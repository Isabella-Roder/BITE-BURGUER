package com.BITEBURGUER.backend.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.BITEBURGUER.backend.dtos.AtualizarStatusRequest;
import com.BITEBURGUER.backend.dtos.CriarPedidoRequest;
import com.BITEBURGUER.backend.dtos.PedidoResponse;
import com.BITEBURGUER.backend.enums.StatusPedido;
import com.BITEBURGUER.backend.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> cadastrar(
        @Valid @RequestBody CriarPedidoRequest request
    ) {
        PedidoResponse response = pedidoService.cadastrar(request);

        URI localizar = URI.create("/api/pedidos/" + response.id());

        return ResponseEntity.created(localizar).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar(
        @RequestParam(required = false) StatusPedido status
    ) {
        if (status != null) {
            return ResponseEntity.ok(pedidoService.listarPorStatus(status));
        }
        return ResponseEntity.ok(pedidoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscarPorId(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoResponse> atualizarStatus(
        @PathVariable UUID id,
        @Valid @RequestBody AtualizarStatusRequest request
    ) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, request.status()));
    }
}
