package com.BITEBURGUER.backend.dtos;

import java.math.BigDecimal;
import java.util.UUID;

import com.BITEBURGUER.backend.models.ItemPedido;

public record ItemPedidoResponse(
    UUID produtoId,
    String nomeProduto,
    Integer quantidade,
    BigDecimal precoUnitario
) {
    public static ItemPedidoResponse from(ItemPedido item) {
        return new ItemPedidoResponse(
            item.getProduto().getId(),
            item.getProduto().getNome(),
            item.getQuantidade(),
            item.getPrecoUnitario()
        );
    }
}
