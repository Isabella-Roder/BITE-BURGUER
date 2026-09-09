package com.BITEBURGUER.backend.dtos;

import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.BITEBURGUER.backend.enums.StatusPedido;
import com.BITEBURGUER.backend.enums.TipoPedido;
import com.BITEBURGUER.backend.models.Pedido;

public record PedidoResponse(
    UUID id,
    String nomeCliente,
    String telefoneCliente,
    String endereco,
    Integer numeroMesa,
    List<ItemPedidoResponse> itens,
    BigDecimal total,
    TipoPedido tipo,
    StatusPedido status,
    LocalDateTime dataHora
) {
    public static PedidoResponse from(Pedido pedido) {
        return new PedidoResponse(
            pedido.getId(),
            pedido.getNomeCliente(),
            pedido.getTelefoneCliente(),
            pedido.getEndereco(),
            pedido.getNumeroMesa(),
            pedido.getItens().stream().map(ItemPedidoResponse::from).toList(),
            pedido.getTotal(),
            pedido.getTipo(),
            pedido.getStatus(),
            pedido.getDataHora()
        );
    }
}
