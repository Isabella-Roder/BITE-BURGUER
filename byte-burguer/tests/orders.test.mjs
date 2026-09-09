import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/services/orders.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { createOrder } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const order = { nomeCliente: 'Maria', telefoneCliente: '91999999999', tipo: 'RETIRADA', endereco: null, complemento: null, itens: [{ produtoId: 'produto-1', quantidade: 2 }] };

test('envia o contrato da API sem preço fornecido pelo cliente e retorna o comprovante', async t => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/pedidos');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), order);
    return new Response(JSON.stringify({ id: 'pedido-1', total: 59.8, status: 'NOVO' }), { status: 201 });
  });
  assert.equal((await createOrder(order)).id, 'pedido-1');
});
test('mostra detalhes de validação retornados pelo backend', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ mensagem: 'Dados inválidos.', detalhes: ['telefoneCliente: Telefone deve ter 10 ou 11 digitos'] }), { status: 400 }));
  await assert.rejects(createOrder(order), /Telefone deve ter 10 ou 11 digitos/);
});
test('falha de rede não reenvia automaticamente o pedido', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(createOrder(order), /Failed to fetch/);
  assert.equal(mock.mock.callCount(), 1);
});
