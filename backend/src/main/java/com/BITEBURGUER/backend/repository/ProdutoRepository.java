package com.BITEBURGUER.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BITEBURGUER.backend.models.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {
    
}
