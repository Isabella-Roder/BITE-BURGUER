package com.BITEBURGUER.backend.dtos;

import java.util.UUID;

import com.BITEBURGUER.backend.models.ItemPedido;

import java.math.BigDecimal;

public record ItemPedidoResponse(
    UUID produtoId,
    String produto,
    Integer quantidade,
    BigDecimal precoUnitario,
    BigDecimal subtotal
) {
    public static ItemPedidoResponse from(ItemPedido item) {
        return new ItemPedidoResponse(
            item.getProduto().getId(),
            item.getProduto().getNome(),
            item.getQuantidade(),
            item.getPrecoUnitario(),
            item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()))
        );
    }
}
