package com.BITEBURGUER.backend.models;

import java.math.BigDecimal;
import java.util.UUID;

import com.BITEBURGUER.backend.enums.CategoriaProduto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "produtos")
public class Produto {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 80)
    private String nome;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(nullable = false)
    private String imgUrl;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal preco;

    @Column(nullable = false)
    private boolean ativo = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaProduto categoria;

    public Produto() {

    }

    public void desativar() {
        if (!ativo) {
            throw new IllegalArgumentException("Produto precisa estar ativo para desativar.");
        }

        ativo = false;
    }

    public void ativar() {
        if (ativo) {
            throw new IllegalArgumentException("Produto precisa estar desativado para ativar.");
        }

        ativo = true;
    }

    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public CategoriaProduto getCategoria() {
        return categoria;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public void setCategoria(CategoriaProduto categoria) {
        this.categoria = categoria;
    }
}
