import type { QuoteResult, PricingParams } from "@/lib/pricing-engine";
import { formatCurrency, formatRate } from "@/lib/pricing-engine";

interface Props {
  result: QuoteResult;
  params: PricingParams;
}

const AnalystResults = ({ result, params }: Props) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-card">
      <div>
        <h2 className="font-display text-lg font-bold text-primary uppercase tracking-wide mb-1">Resultados del Cálculo</h2>
        <p className="text-sm text-muted-foreground">Resumen de tasas, primas y desglose técnico.</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPI label="Tasa por Mil (antes dcto)" value={formatRate(result.tasaPorMil)} unit="‰" />
        <KPI label="Tasa Cotizada" value={formatRate(result.tasaCotizadaRedondeada, 1)} unit="‰" highlight />
        <KPI label="Prima Total" value={formatCurrency(result.prima)} highlight />
        <KPI label="VAS Total" value={formatCurrency(result.valorAseguradoTotal)} />
      </div>

      {/* Coverage breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground font-display uppercase tracking-wide">Detalle por Cobertura Activa</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground text-xs text-left">
                <th className="py-2 px-3 rounded-tl-lg">#</th>
                <th className="py-2 px-3">Cobertura</th>
                <th className="py-2 px-3 text-right">VAS</th>
                <th className="py-2 px-3 text-right">Tasa Riesgo</th>
                <th className="py-2 px-3 text-right">Tasa Comercial</th>
                <th className="py-2 px-3 text-right rounded-tr-lg">Prima</th>
              </tr>
            </thead>
            <tbody>
              {result.activeCoverages.map((c, i) => (
                <tr key={c.code} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
                  <td className="py-2 px-3 text-foreground">{c.name}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs">{formatCurrency(c.valorAsegurado)}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs">{formatRate(c.riskRate)}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs">{formatRate(c.commercialRate)}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs font-semibold">{formatCurrency(c.prima)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical breakdown */}
      <div className="rounded-xl bg-muted/40 border border-border p-4 space-y-2">
        <h3 className="text-sm font-semibold text-foreground font-display uppercase tracking-wide">Desglose Técnico de Prima</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Comisión + IVA ({(params.comision * 100).toFixed(0)}% × {((1 + params.ivaComision) * 100).toFixed(0)}%)</span>
            <div className="font-semibold text-foreground">{formatCurrency(result.comisionIva)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Gastos ({(params.gastos * 100).toFixed(1)}%)</span>
            <div className="font-semibold text-foreground">{formatCurrency(result.gastos)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Utilidad restante</span>
            <div className="font-semibold text-primary">{formatCurrency(result.utilidad)}</div>
          </div>
        </div>
      </div>

      {/* Calculation trace */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-xs text-muted-foreground space-y-1">
        <p><strong className="text-foreground">Traza del cálculo:</strong></p>
        <p>Σ Tasas Comerciales × VAS = {formatCurrency(result.sumaTasasComerciales)}</p>
        <p>Tasa por Mil = ({formatCurrency(result.sumaTasasComerciales)} / {formatCurrency(result.valorAseguradoPromedio)}) × 1000 = {formatRate(result.tasaPorMil)} ‰</p>
        <p>Tasa Cotizada = {formatRate(result.tasaPorMil)} × (1 + ({(params.factorDescuento * 100).toFixed(0)}%)) = {formatRate(result.tasaCotizada)} ‰ → redondeada: {formatRate(result.tasaCotizadaRedondeada, 1)} ‰</p>
        <p>VAS Total = {result.numeroAsegurados} × {formatCurrency(result.valorAseguradoPromedio)} = {formatCurrency(result.valorAseguradoTotal)}</p>
        <p>Prima = {formatRate(result.tasaCotizadaRedondeada, 1)} × {formatCurrency(result.valorAseguradoTotal)} / 1000 = <strong className="text-foreground">{formatCurrency(result.prima)}</strong></p>
      </div>
    </div>
  );
};

const KPI = ({ label, value, unit, highlight }: { label: string; value: string; unit?: string; highlight?: boolean }) => (
  <div className={`rounded-xl border p-4 ${highlight ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-card"}`}>
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className={`text-xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>
      {value}{unit && <span className="text-sm ml-0.5">{unit}</span>}
    </div>
  </div>
);

export default AnalystResults;
