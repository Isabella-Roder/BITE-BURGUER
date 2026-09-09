package com.BITEBURGUER.backend.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
@Table(name = "pedidos")
public class Pedido {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 80)
    private String nomeCliente;

    @Column(length = 20)
    private String telefoneCliente;

    @Column(length = 255)
    private String endereco;

    @Column(length = 150)
    private String complemento;

    public String getComplemento() { return complemento; }

    public void setComplemento(String complemento) { this.complemento = complemento; }

    @Column
    private Integer numeroMesa;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal total;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoPedido tipo;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataHora;

    public Pedido() {

    }

    public Pedido(
        String nomeCliente,
        String telefoneCliente,
        String endereco,
        List<ItemPedido> itens,
        BigDecimal total,
        TipoPedido tipo,
        StatusPedido status
    ) {
        this.nomeCliente = nomeCliente;
        this.telefoneCliente = telefoneCliente;
        this.endereco = endereco;
        this.itens = itens;
        this.total = total;
        this.tipo = tipo;
        this.status = status;
    }

    @PrePersist 
    private void antesDeSalvar() {
        dataHora = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public String getTelefoneCliente() {
        return telefoneCliente;
    }

    public String getEndereco() {
        return endereco;
    }

    public Integer getNumeroMesa() {
        return numeroMesa;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public TipoPedido getTipo() {
        return tipo;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public void setTelefoneCliente(String telefoneCliente) {
        this.telefoneCliente = telefoneCliente;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public void setNumeroMesa(Integer numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public void setTipo(TipoPedido tipo) {
        this.tipo = tipo;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }
}
