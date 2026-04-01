import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { COVERAGE_CATALOG, type CoverageConfig, type PricingParams, formatCurrency } from "@/lib/pricing-engine";

interface Props {
  configs: CoverageConfig[];
  onConfigsChange: (c: CoverageConfig[]) => void;
  valorBase: number;
  params: PricingParams;
}

function calcValorAsegurado(code: string, valorBase: number, manualValue?: number): number {
  const def = COVERAGE_CATALOG.find((c) => c.code === code);
  if (!def) return 0;
  switch (def.calcType) {
    case "SAME_AS_BASE": return valorBase;
    case "PERCENT_OF_BASE": return valorBase * (def.percent ?? 0);
    case "MIN_PERCENT_CAP": return Math.min(valorBase * (def.percent ?? 0), def.cap ?? Infinity);
    case "MANUAL": case "FIXED": return manualValue ?? def.defaultFixed ?? 0;
    default: return 0;
  }
}

const AnalystCoverages = ({ configs, onConfigsChange, valorBase, params }: Props) => {
  const divisor = 1 - params.comision * (1 + params.ivaComision) - params.utilidad - params.gastos;

  const updateConfig = (code: string, patch: Partial<CoverageConfig>) => {
    onConfigsChange(configs.map((c) => (c.code === code ? { ...c, ...patch } : c)));
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-card">
      <div>
        <h2 className="font-display text-lg font-bold text-primary uppercase tracking-wide mb-1">Coberturas y Tasas</h2>
        <p className="text-sm text-muted-foreground">Active coberturas, ajuste tasas de riesgo y valores manuales.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground text-left text-xs">
              <th className="py-2.5 px-3 rounded-tl-lg w-10"></th>
              <th className="py-2.5 px-3">Cobertura</th>
              <th className="py-2.5 px-3 text-right w-28">VAS</th>
              <th className="py-2.5 px-3 text-right w-24">Tasa Riesgo</th>
              <th className="py-2.5 px-3 text-right w-24">Tasa Comercial</th>
              <th className="py-2.5 px-3 text-right rounded-tr-lg w-32">Valor Manual</th>
            </tr>
          </thead>
          <tbody>
            {COVERAGE_CATALOG.map((def) => {
              const config = configs.find((c) => c.code === def.code);
              const isActive = config?.active ?? false;
              const riskRate = config?.riskRate ?? def.defaultRiskRate;
              const vasCalc = calcValorAsegurado(def.code, valorBase, config?.manualValue);
              const commercialRate = riskRate / divisor;
              const isManual = def.calcType === "MANUAL" || def.calcType === "FIXED";

              return (
                <tr
                  key={def.code}
                  className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${isActive ? "bg-primary/5" : ""}`}
                >
                  <td className="py-3 px-3">
                    <Switch
                      checked={isActive}
                      onCheckedChange={(v) => updateConfig(def.code, { active: v })}
                      disabled={def.code === "muerte"}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-foreground leading-tight">{def.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{def.ruleDescription}</div>
                  </td>
                  <td className="py-3 px-3 text-right text-foreground font-mono text-xs">
                    {formatCurrency(vasCalc)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Input
                      type="number"
                      step="0.01"
                      value={riskRate}
                      onChange={(e) => updateConfig(def.code, { riskRate: parseFloat(e.target.value) || 0 })}
                      className="w-20 text-right text-xs h-8 ml-auto"
                    />
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-foreground">
                    {commercialRate.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {isManual ? (
                      <Input
                        type="number"
                        value={config?.manualValue ?? def.defaultFixed ?? 0}
                        onChange={(e) => updateConfig(def.code, { manualValue: parseFloat(e.target.value) || 0 })}
                        className="w-28 text-right text-xs h-8 ml-auto"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Auto</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalystCoverages;
