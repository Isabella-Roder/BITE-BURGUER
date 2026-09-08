package com.BITEBURGUER.backend.dtos;

import java.math.BigDecimal;

import com.BITEBURGUER.backend.enums.CategoriaProduto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CadastroProdutoRequest(

        @NotBlank(message = "Nome é obrigatório.")
        @Size(max = 80, message = "Nome deve ter no máximo 80 caracteres.")
        String nome,

        @NotBlank(message = "Descrição é obrigatória.")
        @Size(max = 500, message = "Descrição deve ter no máximo 255 caracteres.")
        String descricao,

        String imgUrl,

        @NotNull(message = "Preço é obrigatório.")
        @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero.")
        BigDecimal preco,

        @NotNull(message = "Categoria é obrigatória.")
        CategoriaProduto categoria
) {
}
