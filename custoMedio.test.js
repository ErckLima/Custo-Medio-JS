// Testes do cálculo. Rodar com: node custoMedio.test.js
const assert = require("assert");
const { calcularKardex, validarMovimentacao } = require("./custoMedio.js");

const perto = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);
const E = (q, v) => ({ tipo: "Entrada", quantidade: q, valorUnitario: v });
const S = (q) => ({ tipo: "Saída", quantidade: q });

// 1. Entradas ponderam o custo
let r = calcularKardex([E(10, 10), E(10, 20)]);
perto(r.custoMedio, 15); perto(r.saldoValor, 300); perto(r.saldoQtd, 20);

// 2. Saída baixa pelo custo médio e não altera o custo
r = calcularKardex([E(10, 10), E(10, 20), S(5)]);
perto(r.linhas[2].valorUnitario, 15); perto(r.saldoValor, 225); perto(r.custoMedio, 15);

// 3. Nova entrada após saída pondera sobre o saldo restante
r = calcularKardex([E(10, 10), E(10, 20), S(5), E(5, 30)]);
perto(r.saldoQtd, 20); perto(r.saldoValor, 375); perto(r.custoMedio, 18.75);

// 4. Zerar estoque zera custo; próxima entrada começa do zero
r = calcularKardex([E(3, 10), S(3), E(2, 50)]);
perto(r.linhas[1].saldoValor, 0); perto(r.custoMedio, 50);

// 5. Saída maior que o saldo é rejeitada
r = calcularKardex([E(2, 10), S(3)]);
assert.ok(r.erro); assert.strictEqual(r.indiceErro, 1);

// 6. Entrada com custo zero (bonificação) é aceita e reduz o custo médio
r = calcularKardex([E(10, 10), E(10, 0)]);
perto(r.custoMedio, 5);

// 7. Custo médio com dízima (30,02 / 3) e com quantidades fracionadas
r = calcularKardex([E(1, 10), E(2, 10.01), S(1)]);
perto(r.custoMedio, 30.02 / 3); perto(r.saldoValor, 2 * 30.02 / 3);
r = calcularKardex([E(2.5, 4), E(1.5, 8)]);
perto(r.custoMedio, 5.5);

// 8. Remoção de uma entrada intermediária recalcula tudo (o bug da versão antiga)
const lista = [E(10, 10), E(10, 20), S(5)];
lista.splice(1, 1);
r = calcularKardex(lista);
perto(r.saldoQtd, 5); perto(r.saldoValor, 50); perto(r.custoMedio, 10);

// 9. Validações
assert.ok(validarMovimentacao("Entrada", 0, 10));
assert.ok(validarMovimentacao("Entrada", 1, NaN));
assert.ok(validarMovimentacao("Entrada", 1, -1));
assert.strictEqual(validarMovimentacao("Entrada", 1, 0), null);
assert.strictEqual(validarMovimentacao("Saída", 1, NaN), null);

console.log("OK: todos os testes passaram");
