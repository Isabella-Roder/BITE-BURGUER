package com.BITEBURGUER.backend.dtos;

import java.math.BigDecimal;
import java.util.UUID;

import com.BITEBURGUER.backend.enums.CategoriaProduto;
import com.BITEBURGUER.backend.models.Produto;

public record ProdutoResponse(
    UUID id,
    String nome, 
    String descricao,
    String imgUrl,
    BigDecimal preco,
    boolean ativo,
    CategoriaProduto categoria
) {
    public static ProdutoResponse from(Produto produto) {
        return new ProdutoResponse(
            produto.getId(),
            produto.getNome(),
            produto.getDescricao(),
            produto.getImgUrl(),
            produto.getPreco(),
            produto.isAtivo(),
            produto.getCategoria()
        );
    }
}
