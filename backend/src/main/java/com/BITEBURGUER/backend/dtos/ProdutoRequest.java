package com.BITEBURGUER.backend.dtos;

import java.math.BigDecimal;

import com.BITEBURGUER.backend.enums.CategoriaProduto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProdutoRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(
        max = 80,
        message = "Nome deve conter no máximo 80 caracteres."
    )
    String nome,

    @NotBlank(message = "Descrição é obrigatória")
    @Size(
        max = 500,
        message = "Descrição deve conter no máximo 500 caracteres."
    )
    String descricao,

    @Size(
        max = 255,
        message = "Imagem deve conter no máximo 255 caracteres."
    )
    String imgUrl,

    @NotNull(message = "Preço é obrigatório.")
    @Digits(integer = 4, fraction = 2)
    @Positive(message = "Preço deve ser positivo.")
    BigDecimal preco,

    @NotNull(message = "Categoria é obrigatória.")
    CategoriaProduto categoria
) {
    
}
