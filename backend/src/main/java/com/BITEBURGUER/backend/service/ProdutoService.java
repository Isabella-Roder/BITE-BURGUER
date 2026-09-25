package com.BITEBURGUER.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.BITEBURGUER.backend.dtos.ProdutoRequest;
import com.BITEBURGUER.backend.dtos.ProdutoResponse;
import com.BITEBURGUER.backend.models.Produto;
import com.BITEBURGUER.backend.repository.ProdutoRepository;

@Service 
public class ProdutoService {
    
    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    private Produto buscarEntidade(UUID id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
    }

    @Transactional 
    public ProdutoResponse cadastrar(ProdutoRequest request) {
        Produto produto = new Produto(
            request.nome(),
            request.descricao(),
            request.imgUrl(),
            request.preco(),
            request.categoria()
        );

        return ProdutoResponse.from(produtoRepository.save(produto));
    }

    @Transactional 
    public ProdutoResponse atualizar(UUID id, ProdutoRequest request) {
        Produto produto = buscarEntidade(id);

        produto.setNome(request.nome());
        produto.setDescricao(request.descricao());
        produto.setImgUrl(request.imgUrl());
        produto.setPreco(request.preco());
        produto.setCategoria(request.categoria());

        return ProdutoResponse.from(produto);
    }

    @Transactional 
    public void desativar(UUID id) {
        Produto produto = buscarEntidade(id);
        produto.desativar();
    }

    @Transactional
    public void ativar(UUID id) {
        Produto produto = buscarEntidade(id);
        produto.ativar();
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> listar() {
        return produtoRepository.findAll()
            .stream().map(ProdutoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoResponse buscarPorid(UUID id) {
        return ProdutoResponse.from(buscarEntidade(id));
    }
}
