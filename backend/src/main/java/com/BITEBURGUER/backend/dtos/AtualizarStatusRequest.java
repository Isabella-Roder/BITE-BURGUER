package com.BITEBURGUER.backend.dtos;

import com.BITEBURGUER.backend.enums.StatusPedido;

import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(
    @NotNull(message = "Status é obrigatório")
    StatusPedido status
) {
}
