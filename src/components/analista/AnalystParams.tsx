import { Input, Label } from "@/components/bolivar";
import type { PricingParams } from "@/lib/pricing-engine";

interface Props {
  params: PricingParams;
  onParamsChange: (p: PricingParams) => void;
  valorBase: number;
  onValorBaseChange: (v: number) => void;
  numAsegurados: number;
  solicitud: {
    nombre_tomador: string | null;
    nit_tomador: string | null;
    total_asegurados: number | null;
    canal: string | null;
    localidad: string | null;
    reasegurador: string | null;
    tipo_ajuste: string | null;
    forma_pago: string | null;
  };
}

const pct = (v: number) => (v * 100).toFixed(1);
const fromPct = (s: string) => parseFloat(s) / 100 || 0;

const AnalystParams = ({ params, onParamsChange, valorBase, onValorBaseChange, numAsegurados, solicitud }: Props) => {
  const update = (field: keyof PricingParams, value: string) => {
    onParamsChange({ ...params, [field]: fromPct(value) });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-card">
      <div>
        <h2 className="font-display text-lg font-bold text-primary uppercase tracking-wide mb-1">Parámetros de Cotización</h2>
        <p className="text-sm text-muted-foreground">Datos de la solicitud #{solicitud.nombre_tomador} y parámetros técnicos.</p>
      </div>

      {/* Solicitud info */}
      <div className="rounded-xl bg-muted/50 border border-border p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div><span className="text-muted-foreground">Tomador:</span> <span className="font-medium text-foreground">{solicitud.nombre_tomador || "—"}</span></div>
        <div><span className="text-muted-foreground">NIT:</span> <span className="font-medium text-foreground">{solicitud.nit_tomador || "—"}</span></div>
        <div><span className="text-muted-foreground">Asegurados:</span> <span className="font-medium text-foreground">{numAsegurados}</span></div>
        <div><span className="text-muted-foreground">Canal:</span> <span className="font-medium text-foreground">{solicitud.canal || "—"}</span></div>
        <div><span className="text-muted-foreground">Localidad:</span> <span className="font-medium text-foreground">{solicitud.localidad || "—"}</span></div>
        <div><span className="text-muted-foreground">Reasegurador:</span> <span className="font-medium text-foreground">{solicitud.reasegurador || "—"}</span></div>
        <div><span className="text-muted-foreground">Tipo Ajuste:</span> <span className="font-medium text-foreground">{solicitud.tipo_ajuste || "—"}</span></div>
        <div><span className="text-muted-foreground">Forma Pago:</span> <span className="font-medium text-foreground">{solicitud.forma_pago || "—"}</span></div>
      </div>

      {/* Valor asegurado base */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Valor Asegurado Base / Promedio (COP)</Label>
        <Input
          type="number"
          value={valorBase}
          onChange={(e) => onValorBaseChange(parseFloat(e.target.value) || 0)}
          className="max-w-xs"
        />
      </div>

      {/* Technical parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Comisión (%)</Label>
          <Input type="number" step="0.1" value={pct(params.comision)} onChange={(e) => update("comision", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Utilidad (%)</Label>
          <Input type="number" step="0.1" value={pct(params.utilidad)} onChange={(e) => update("utilidad", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Gastos (%)</Label>
          <Input type="number" step="0.1" value={pct(params.gastos)} onChange={(e) => update("gastos", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">IVA Comisión (%)</Label>
          <Input type="number" step="0.1" value={pct(params.ivaComision)} onChange={(e) => update("ivaComision", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Factor Dcto/Recargo (%)</Label>
          <Input type="number" step="1" value={pct(params.factorDescuento)} onChange={(e) => update("factorDescuento", e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Fórmula:</strong> Tasa Comercial = Tasa Riesgo / (1 − Comisión×(1+IVA) − Utilidad − Gastos)
        <br />
        <strong className="text-foreground">Divisor actual:</strong> {(1 - params.comision * (1 + params.ivaComision) - params.utilidad - params.gastos).toFixed(4)}
      </div>
    </div>
  );
};

export default AnalystParams;
