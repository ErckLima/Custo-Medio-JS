# Custo Médio Sisloc — como funciona

Simulador do **custo médio ponderado móvel**: a cada entrada o custo é recalculado; as saídas baixam o estoque pelo custo vigente.

Acesso: https://ercklima.github.io/Custo-Medio-JS/

## Como usar

1. Escolha o **Tipo** (Entrada ou Saída).
2. Informe a **Quantidade** (aceita decimais).
3. Em **Entrada**, informe o **Valor unitário** (zero é aceito, ex.: bonificação). Em **Saída** o campo fica bloqueado, porque a saída usa o custo médio atual.
4. Clique em **Adicionar** (ou tecle Enter).

A tabela mostra, linha a linha, o total da movimentação e o saldo após ela: quantidade, valor e custo médio.

| Botão | O que faz |
|---|---|
| ✕ (na linha) | Remove aquela movimentação e recalcula tudo |
| Remover último | Remove a última movimentação e recalcula |
| Exportar CSV | Baixa o kardex em CSV (separador `;`, abre direto no Excel) |
| Limpar tudo | Apaga todas as movimentações (pede confirmação) |

As movimentações ficam salvas automaticamente no navegador (localStorage). Outro navegador ou outro computador não as vê.

## Regras do cálculo

**Entrada**

```
saldo qtd   = saldo qtd + quantidade
saldo valor = saldo valor + quantidade × valor unitário
custo médio = saldo valor ÷ saldo qtd
```

**Saída**

```
valor unitário = custo médio atual
saldo qtd      = saldo qtd − quantidade
saldo valor    = saldo valor − quantidade × custo médio
custo médio    = não muda
```

- Saída maior que o saldo é recusada.
- Quando o saldo em quantidade chega a zero, o saldo em valor e o custo médio também zeram.
- Remover qualquer linha recalcula o kardex desde a primeira movimentação. Se uma saída posterior ficar sem saldo, a remoção é recusada.
- O cálculo usa precisão total. A tela só arredonda na exibição: valores em 2 casas, custo médio e valor unitário em 4.

### Exemplo

| # | Tipo | Qtd | Valor unit. | Total | Saldo qtd | Saldo valor | Custo médio |
|---|---|---|---|---|---|---|---|
| 1 | Entrada | 10 | 10,00 | 100,00 | 10 | 100,00 | 10,0000 |
| 2 | Entrada | 10 | 20,00 | 200,00 | 20 | 300,00 | 15,0000 |
| 3 | Saída | 5 | 15,00 | 75,00 | 15 | 225,00 | 15,0000 |
| 4 | Entrada | 5 | 30,00 | 150,00 | 20 | 375,00 | 18,7500 |

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Tela e eventos |
| `custoMedio.js` | Regras de cálculo (funções puras, sem tela) |
| `styleCustoMedio.css` | Visual no padrão de cores da Sisloc |
| `custoMedio.test.js` | Testes do cálculo: `node custoMedio.test.js` |

## Limitações

- É um simulador de um único item, sem data, documento ou depósito.
- Não lê nem grava no banco do Sisloc.
