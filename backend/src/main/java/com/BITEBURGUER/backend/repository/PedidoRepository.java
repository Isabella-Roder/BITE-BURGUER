package com.BITEBURGUER.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BITEBURGUER.backend.enums.StatusPedido;
import com.BITEBURGUER.backend.models.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, UUID>{
    
    List<Pedido> findByItensId(UUID itens);

    List<Pedido> findByStatus(StatusPedido status);
}
