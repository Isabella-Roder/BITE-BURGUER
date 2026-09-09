package com.BITEBURGUER.backend.dtos;

import java.util.List;

import com.BITEBURGUER.backend.enums.TipoPedido;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CriarPedidoRequest(
    @NotBlank(message = "Nome do cliente é obrigatório")
    @Size (
        max = 80,
        message = "Nome deve conter no máximo 80 caracteres"
    )
    String nomeCliente,

    @NotBlank(message = "Telefone do cliente é obrigatório")
    @Pattern(regexp = "\\d{10,11}",
        message = "Telefone deve ter 10 ou 11 digitos"
    )
    String telefoneCliente,

    @NotNull(message = "Tipo do pedido é obrigatório")
    TipoPedido tipo,

    @Size(
        max = 255,
        message = "Endereço deve conter no máximo 255 caracteres"
    )
    String endereco,

    @Positive(message = "Numero da mesa deve ser positivo")
    Integer numeroMesa,

    @Size(max = 150, message = "Complemento deve conter no máximo 150 caracteres")
    String complemento,

    @NotEmpty(message = "Pedido precisa ter ao menos um item")
    List<@NotNull @Valid ItemPedidoRequest> itens
) {
}
