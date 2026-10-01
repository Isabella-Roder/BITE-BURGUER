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
    String cliente,
    String telefone,
    String endereco,
    String complemento,
    Integer mesa,
    TipoPedido tipo,
    StatusPedido status,
    BigDecimal total,
    LocalDateTime data,
    List<ItemPedidoResponse> itens
) {
    public static PedidoResponse from(Pedido pedido) {
        return new PedidoResponse(
            pedido.getId(),
            pedido.getCliente(),
            pedido.getTelefone(),
            pedido.getEndereco(),
            pedido.getComplemento(),
            pedido.getMesa(),
            pedido.getTipo(),
            pedido.getStatus(),
            pedido.getTotal(),
            pedido.getData(),
            pedido.getItens().stream().map(ItemPedidoResponse::from).toList()
        );
    }
}
