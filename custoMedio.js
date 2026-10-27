// Cálculo de custo médio ponderado móvel.
// Funções puras: recebem a lista de movimentações e devolvem o kardex recalculado do zero.
(function (raiz) {
  const EPS = 1e-9;

  // movimentacao: { tipo: "Entrada" | "Saída", quantidade: number, valorUnitario?: number }
  function calcularKardex(movimentacoes) {
    let saldoQtd = 0;
    let saldoValor = 0;
    let custoMedio = 0;
    const linhas = [];

    for (let i = 0; i < movimentacoes.length; i++) {
      const m = movimentacoes[i];
      let valorUnitario;

      if (m.tipo === "Entrada") {
        valorUnitario = m.valorUnitario;
        saldoQtd += m.quantidade;
        saldoValor += m.quantidade * valorUnitario;
        custoMedio = saldoValor / saldoQtd;
      } else {
        if (m.quantidade > saldoQtd + EPS) {
          return { erro: `Linha ${i + 1}: saída de ${m.quantidade} maior que o saldo de ${saldoQtd}.`, indiceErro: i, linhas };
        }
        // Saída baixa o estoque pelo custo médio vigente; o custo médio não muda.
        valorUnitario = custoMedio;
        saldoQtd -= m.quantidade;
        saldoValor -= m.quantidade * valorUnitario;
        if (Math.abs(saldoQtd) < EPS) {
          saldoQtd = 0;
          saldoValor = 0;
          custoMedio = 0;
        }
      }

      linhas.push({
        tipo: m.tipo,
        quantidade: m.quantidade,
        valorUnitario,
        totalMovimentacao: m.quantidade * valorUnitario,
        saldoQtd,
        saldoValor,
        custoMedio,
      });
    }

    return { erro: null, linhas, saldoQtd, saldoValor, custoMedio };
  }

  function validarMovimentacao(tipo, quantidade, valorUnitario) {
    if (!Number.isFinite(quantidade) || quantidade <= 0) return "Informe uma quantidade maior que zero.";
    if (tipo === "Entrada" && (!Number.isFinite(valorUnitario) || valorUnitario < 0)) return "Informe um valor unitário válido (zero ou maior).";
    return null;
  }

  const api = { calcularKardex, validarMovimentacao };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.CustoMedio = api;
})(this);
