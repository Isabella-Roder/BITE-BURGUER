package com.BITEBURGUER.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import com.BITEBURGUER.backend.repository.PedidoRepository;
import com.BITEBURGUER.backend.repository.ProdutoRepository;
import com.BITEBURGUER.backend.models.Produto;
import com.BITEBURGUER.backend.enums.CategoriaProduto;
import java.math.BigDecimal;
import java.util.UUID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:api-tests", "spring.jpa.hibernate.ddl-auto=create-drop"})
class PedidoApiTests {
    @Autowired WebApplicationContext context;
    @Autowired PedidoRepository pedidos;
    @Autowired ProdutoRepository produtos;
    MockMvc mvc;
    Produto produto;

    @BeforeEach void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
        pedidos.deleteAll();
        produtos.deleteAll();
        produto = new Produto();
        produto.setNome("Burger teste");
        produto.setDescricao("Hambúrguer com queijo");
        produto.setImgUrl("https://example.com/burger.jpg");
        produto.setPreco(new BigDecimal("29.90"));
        produto.setCategoria(CategoriaProduto.HAMBURGUER_ARTESANAL);
        produto = produtos.save(produto);
    }

    String body(String tipo, String itens) {
        return """
            {"nomeCliente":"Cliente teste","telefoneCliente":"91999999999",
            "tipo":"%s","endereco":"Rua A, 12","complemento":"Casa 2","itens":%s}
            """.formatted(tipo, itens);
    }
    String item(int quantidade) {
        return "[{\"produtoId\":\"" + produto.getId() + "\",\"quantidade\":" + quantidade + "}]";
    }
    UUID create(String tipo) throws Exception {
        String location = mvc.perform(post("/api/pedidos").contentType(MediaType.APPLICATION_JSON).content(body(tipo, item(2))))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.total").value(59.80))
            .andExpect(jsonPath("$.status").value("NOVO"))
            .andReturn().getResponse().getHeader("Location");
        return UUID.fromString(location.substring(location.lastIndexOf('/') + 1));
    }
    void updateStatus(UUID id, String value, int expected) throws Exception {
        mvc.perform(patch("/api/pedidos/" + id + "/status").contentType(MediaType.APPLICATION_JSON)
            .content("{\"status\":\"" + value + "\"}" )).andExpect(status().is(expected));
    }

    @Test void productEndpointsValidateAndUpdate() throws Exception {
        mvc.perform(get("/api/produtos/" + produto.getId())).andExpect(status().isOk());
        mvc.perform(patch("/api/produtos/" + produto.getId() + "/desativar"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(false));
        mvc.perform(patch("/api/produtos/" + produto.getId() + "/ativar"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(true));
        String cadastro = """
            {"nome":"Clássico","descricao":"Carne e queijo","preco":20.00,"categoria":"HAMBURGUER_CLASSICO"}
            """;
        mvc.perform(post("/api/produtos").contentType(MediaType.APPLICATION_JSON).content(cadastro))
            .andExpect(status().isCreated());
        mvc.perform(put("/api/produtos/" + produto.getId()).contentType(MediaType.APPLICATION_JSON).content(cadastro))
            .andExpect(status().isOk()).andExpect(jsonPath("$.preco").value(20.00));
        mvc.perform(post("/api/produtos").contentType(MediaType.APPLICATION_JSON).content(cadastro.replace("20.00", "20.001")))
            .andExpect(status().isBadRequest());
        mvc.perform(get("/api/produtos/" + UUID.randomUUID())).andExpect(status().isNotFound());
    }

    @Test void deliveryCalculatesPriceAndPreservesHistoricalTotal() throws Exception {
        UUID id = create("DELIVERY");
        produto.setPreco(new BigDecimal("50.00")); produtos.save(produto);
        mvc.perform(get("/api/pedidos/" + id)).andExpect(status().isOk())
            .andExpect(jsonPath("$.total").value(59.80))
            .andExpect(jsonPath("$.itens[0].precoUnitario").value(29.90))
            .andExpect(jsonPath("$.complemento").value("Casa 2"));
        updateStatus(id, "ENTREGUE", 400);
        updateStatus(id, "PREPARADO", 200);
        updateStatus(id, "SAIU_PARA_ENTREGA", 200);
        updateStatus(id, "ENTREGUE", 200);
        updateStatus(id, "NOVO", 400);
    }
    @Test void pickupHasNoDeliveryAndCanBeCompleted() throws Exception {
        UUID id = create("RETIRADA");
        mvc.perform(get("/api/pedidos/"+id)).andExpect(jsonPath("$.endereco").isEmpty());
        updateStatus(id,"PREPARADO",200);
        updateStatus(id,"SAIU_PARA_ENTREGA",400);
        updateStatus(id,"ENTREGUE",200);
    }
    @Test void nestedItemsAreValidated() throws Exception {
        for (String itens : new String[]{item(0), item(-1), "[]", "[null]", "[{\"quantidade\":1}]", "[{\"produtoId\":\""+produto.getId()+"\"}]"}) {
            mvc.perform(post("/api/pedidos").contentType(MediaType.APPLICATION_JSON).content(body("DELIVERY",itens)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.mensagem").exists());
        }
    }
    @Test void rejectsMissingAddressAndInactiveProduct() throws Exception {
        mvc.perform(post("/api/pedidos").contentType(MediaType.APPLICATION_JSON)
            .content(body("DELIVERY",item(1)).replace("Rua A, 12", " "))).andExpect(status().isBadRequest());
        produto.desativar(); produtos.save(produto);
        mvc.perform(post("/api/pedidos").contentType(MediaType.APPLICATION_JSON)
            .content(body("DELIVERY",item(1)))).andExpect(status().isBadRequest());
        org.junit.jupiter.api.Assertions.assertEquals(0, pedidos.count());
    }
    @Test void listsNewestFirstAndFiltersStatus() throws Exception {
        UUID first=create("RETIRADA");
        updateStatus(first,"PREPARADO",200);
        UUID second=create("DELIVERY");
        mvc.perform(get("/api/pedidos")).andExpect(jsonPath("$[0].id").value(second.toString()));
        mvc.perform(get("/api/pedidos?status=PREPARADO"))
            .andExpect(jsonPath("$",hasSize(1))).andExpect(jsonPath("$[0].id").value(first.toString()));
    }
    @Test void handlesBadIdentifiersAndMissingOrders() throws Exception {
        mvc.perform(get("/api/pedidos/"+UUID.randomUUID())).andExpect(status().isNotFound());
        mvc.perform(get("/api/pedidos/invalido")).andExpect(status().isBadRequest()).andExpect(jsonPath("$.mensagem").exists());
        mvc.perform(get("/api/pedidos?status=INVALIDO")).andExpect(status().isBadRequest());
        mvc.perform(post("/api/pedidos").contentType(MediaType.APPLICATION_JSON).content("{"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.mensagem").exists());
    }
}
