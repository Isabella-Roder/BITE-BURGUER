package com.BITEBURGUER.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.BITEBURGUER.backend.dtos.CriarPedidoRequest;
import com.BITEBURGUER.backend.dtos.ItemPedidoRequest;
import com.BITEBURGUER.backend.dtos.PedidoResponse;
import com.BITEBURGUER.backend.enums.StatusPedido;
import com.BITEBURGUER.backend.enums.TipoPedido;
import com.BITEBURGUER.backend.exception.RecursoNaoEncontradoException;
import com.BITEBURGUER.backend.models.ItemPedido;
import com.BITEBURGUER.backend.models.Pedido;
import com.BITEBURGUER.backend.models.Produto;
import com.BITEBURGUER.backend.repository.PedidoRepository;
import com.BITEBURGUER.backend.repository.ProdutoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(
        PedidoRepository pedidoRepository,
        ProdutoRepository produtoRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    private Pedido buscarEntidade(UUID id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado com ID: " + id));
    }

    private Produto buscarProduto(UUID id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id));
    }

    @Transactional
    public PedidoResponse cadastrar(CriarPedidoRequest request) {

        if (request.tipo() == TipoPedido.DELIVERY && (request.endereco() == null || request.endereco().isBlank())) {
            throw new IllegalArgumentException("Endereço é obrigatório para pedidos de delivery.");
        }

        if (request.tipo() == TipoPedido.MESA && request.numeroMesa() == null) {
            throw new IllegalArgumentException("Número da mesa é obrigatório para pedidos no local.");
        }

        Pedido pedido = new Pedido();
        pedido.setNomeCliente(request.nomeCliente());
        pedido.setTelefoneCliente(request.telefoneCliente());
        pedido.setTipo(request.tipo());
        pedido.setEndereco(request.tipo() == TipoPedido.DELIVERY ? request.endereco() : null);
        pedido.setComplemento(request.tipo() == TipoPedido.DELIVERY ? request.complemento() : null);
        pedido.setNumeroMesa(request.tipo() == TipoPedido.MESA ? request.numeroMesa() : null);
        pedido.setStatus(StatusPedido.NOVO);

        List<ItemPedido> itens = request.itens().stream()
            .map(itemRequest -> criarItem(pedido, itemRequest))
            .toList();
        pedido.setItens(itens);

        BigDecimal total = itens.stream()
            .map(item -> item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setTotal(total);

        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    private ItemPedido criarItem(Pedido pedido, ItemPedidoRequest itemRequest) {
        Produto produto = buscarProduto(itemRequest.produtoId());
        if (!produto.isAtivo()) {
            throw new IllegalArgumentException("Produto indisponível: " + produto.getNome());
        }
        ItemPedido item = new ItemPedido(produto, itemRequest.quantidade());
        item.setPedido(pedido);
        return item;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar() {
        return pedidoRepository.findAllByOrderByDataHoraDesc().stream()
            .map(PedidoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(UUID id) {
        return PedidoResponse.from(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPorStatus(StatusPedido status) {
        return pedidoRepository.findByStatusOrderByDataHoraDesc(status).stream()
            .map(PedidoResponse::from).toList();
    }

    @Transactional
    public PedidoResponse atualizarStatus(UUID id, StatusPedido novoStatus) {
        Pedido pedido = buscarEntidade(id);
        if (pedido.getStatus() == novoStatus) return PedidoResponse.from(pedido);
        StatusPedido proximo = switch (pedido.getStatus()) {
            case NOVO -> StatusPedido.PREPARADO;
            case PREPARADO -> pedido.getTipo() == TipoPedido.DELIVERY
                ? StatusPedido.SAIU_PARA_ENTREGA : StatusPedido.ENTREGUE;
            case SAIU_PARA_ENTREGA -> StatusPedido.ENTREGUE;
            case ENTREGUE -> null;
        };
        if (novoStatus != proximo) {
            throw new IllegalArgumentException("Transição de status inválida: " + pedido.getStatus() + " para " + novoStatus);
        }
        pedido.setStatus(novoStatus);
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }
}
