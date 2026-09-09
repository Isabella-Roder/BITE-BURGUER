import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const { outputText } = ts.transpileModule(readFileSync(new URL('../src/services/store.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } });
const api = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
test('telas administrativas usam métodos e endereços do contrato existente', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => { calls.push([url, options.method || 'GET', options.body && JSON.parse(options.body)]); return new Response('{}'); });
  await api.listProducts(); await api.getProduct('123'); await api.saveProduct({ nome: 'Burger' }); await api.saveProduct({ nome: 'Outro' }, '123');
  await api.toggleProduct({ id: '123', ativo: true }); await api.toggleProduct({ id: '123', ativo: false });
  await api.listOrders('NOVO'); await api.getOrder('456'); await api.updateOrder('456', 'PREPARADO');
  assert.deepEqual(calls.map(c => c.slice(0, 2)), [['/api/produtos','GET'],['/api/produtos/123','GET'],['/api/produtos','POST'],['/api/produtos/123','PUT'],['/api/produtos/123/desativar','PATCH'],['/api/produtos/123/ativar','PATCH'],['/api/pedidos?status=NOVO','GET'],['/api/pedidos/456','GET'],['/api/pedidos/456/status','PATCH']]);
  assert.deepEqual(calls.at(-1)[2], { status: 'PREPARADO' });
});
test('exibe erro de API e não trata uma resposta HTML como dados', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>Indisponível</html>', { status: 502 }));
  await assert.rejects(api.listOrders(''), /502/);
});
