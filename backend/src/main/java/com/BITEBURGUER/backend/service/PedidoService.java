package com.BITEBURGUER.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.BITEBURGUER.backend.dtos.ItemPedidoRequest;
import com.BITEBURGUER.backend.dtos.PedidoRequest;
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
            .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado com id: " + id));
    }

    private void validarTipo(PedidoRequest request) {
        if (request.tipo() == TipoPedido.DELIVERY) {
            if (request.telefone() == null) {
                throw new IllegalArgumentException("Telefone é obrigatório.");
            }
            if (request.endereco() == null || request.endereco().isBlank()) {
                throw new IllegalArgumentException("Endereço é obrigatório.");
            }
        } else if (request.mesa() == null) {
            throw new IllegalArgumentException("Número da mesa é obrigatório.");
        }
    }

    private boolean transicaoValida(Pedido pedido, StatusPedido novo) {
        boolean delivery = pedido.getTipo() == TipoPedido.DELIVERY;

        return switch(pedido.getStatus()) {
            case NOVO -> novo == StatusPedido.PREPARADO || novo == StatusPedido.CANCELADO;
            case PREPARADO -> novo == StatusPedido.CANCELADO
                || (delivery ? novo == StatusPedido.SAIU_PARA_ENTREGA : novo == StatusPedido.ENTREGA);
            case SAIU_PARA_ENTREGA -> novo == StatusPedido.ENTREGA;
            case ENTREGA, CANCELADO -> false;
        };
    }

    @Transactional 
    public PedidoResponse cadastrar(PedidoRequest request) {
        validarTipo(request);

        boolean delivery = request.tipo() == TipoPedido.DELIVERY;

        Pedido pedido = new Pedido(
            request.cliente(),
            delivery ? request.telefone() : null,
            delivery ? request.endereco() : null,
            delivery ? request.complemento() : null,
            delivery ? null : request.mesa(),
            request.tipo(),
            StatusPedido.NOVO,
            BigDecimal.ZERO
        );

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoRequest itemRequest : request.itens()) {
            Produto produto = produtoRepository.findById(itemRequest.produtoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + itemRequest.produtoId()));

            if (!produto.isAtivo()) {
                throw new IllegalArgumentException("Produto indisponível: " + produto.getNome());
            }

            ItemPedido item = new ItemPedido(
                produto,
                itemRequest.quantidade()
            );
            pedido.adicionarItem(item);

            total = total.add(item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())));
        }

        pedido.setTotal(total);

        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional 
    public PedidoResponse atualizarStatus(UUID id, StatusPedido novoStatus) {
        Pedido pedido = buscarEntidade(id);

        if (!transicaoValida(pedido, novoStatus)) {
            throw new IllegalArgumentException("Transição inválida: " + pedido.getStatus() + " para " + novoStatus);
        }

        pedido.setStatus(novoStatus);
        return PedidoResponse.from(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar() {
        return pedidoRepository.findAllByOrderByDataDesc()
            .stream().map(PedidoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPorStatus(StatusPedido status) {
        return pedidoRepository.findByStatusOrderByDataDesc(status)
            .stream().map(PedidoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(UUID id) {
        return PedidoResponse.from(buscarEntidade(id));
    }
}
