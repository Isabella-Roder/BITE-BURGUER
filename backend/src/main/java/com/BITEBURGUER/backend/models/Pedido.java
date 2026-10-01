package com.BITEBURGUER.backend.models;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.BITEBURGUER.backend.enums.StatusPedido;
import com.BITEBURGUER.backend.enums.TipoPedido;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity 
@Table(
    name = "pedidos"
)
public class Pedido {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cliente", nullable = false, length = 120)
    private String cliente;

    @Column(name = "telefone", length = 11)
    private String telefone;

    @Column(name = "endereco", length = 255)
    private String endereco;

    @Column(name = "complemento", length = 100)
    private String complemento;

    @Column(name = "mesa")
    private Integer mesa;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoPedido tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusPedido status;

    @Column(name = "total", nullable = false, precision = 19, scale = 2)
    private BigDecimal total;

    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    public Pedido() {

    }

    public Pedido(
        String cliente,
        String telefone,
        String endereco,
        String complemento,
        Integer mesa,
        TipoPedido tipo,
        StatusPedido status,
        BigDecimal total
    ) {
        this.cliente = cliente;
        this.telefone = telefone;
        this.endereco = endereco;
        this.complemento = complemento;
        this.mesa = mesa;
        this.tipo = tipo;
        this.status = status;
        this.total = total;
    }

    @PrePersist 
    private void antesDeSalvar() {
        data = LocalDateTime.now();
    }

    public void adicionarItem(ItemPedido item) {
        item.setPedido(this);
        itens.add(item);
    }

    public UUID getId() {
        return id;
    }

    public String getCliente() {
        return cliente;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public String getComplemento() {
        return complemento;
    }

    public Integer getMesa() {
        return mesa;
    }

    public TipoPedido getTipo() {
        return tipo;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public LocalDateTime getData() {
        return data;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
