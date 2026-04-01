import type { QuoteResult, PricingParams } from "@/lib/pricing-engine";
import { formatCurrency, formatRate } from "@/lib/pricing-engine";
import { COVERAGE_CATALOG } from "@/lib/pricing-engine";

interface Props {
  result: QuoteResult;
  solicitud: {
    numero_solicitud: number;
    nombre_tomador: string | null;
    nit_tomador: string | null;
    reasegurador: string | null;
    localidad: string | null;
    nombre_intermediario: string | null;
    clave_intermediario: string | null;
    tipo_ajuste: string | null;
    forma_pago: string | null;
    clausulas: any;
  };
  params: PricingParams;
}

const AnalystPropuesta = ({ result, solicitud, params }: Props) => {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);

  const clausulas: string[] = Array.isArray(solicitud.clausulas) ? solicitud.clausulas : [];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-card">
      <div className="text-center space-y-1">
        <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide">Propuesta Comercial</h2>
        <p className="text-sm text-muted-foreground">Vida Grupo No Contributivo</p>
      </div>

      <Section title="Información General">
        <Row label="Cotización N°" value={`${solicitud.numero_solicitud}`} />
        <Row label="Reaseguro" value={solicitud.reasegurador || "Local"} />
        <Row label="Intermediario" value={`${solicitud.nombre_intermediario || "—"} (${solicitud.clave_intermediario || ""})`} />
        <Row label="Fecha Elaboración" value={today.toLocaleDateString("es-CO")} />
        <Row label="Fecha Validez" value={validUntil.toLocaleDateString("es-CO")} />
      </Section>

      <Section title="Información del Tomador">
        <Row label="Razón Social" value={solicitud.nombre_tomador || "—"} />
        <Row label="NIT" value={solicitud.nit_tomador || "—"} />
      </Section>

      <Section title="Grupo Asegurable">
        <Row label="Número de Asegurados" value={`${result.numeroAsegurados}`} />
      </Section>

      <Section title="Tarifa">
        <Row label="Tasa Anual Por Mil" value={`${formatRate(result.tasaCotizadaRedondeada, 1)}`} />
        <Row label="Comisión" value={`${(params.comision * 100).toFixed(0)}%`} />
      </Section>

      {/* Coverages */}
      <div className="rounded-xl border border-border p-4 space-y-3 shadow-card">
        <h3 className="text-sm font-semibold text-primary font-display uppercase tracking-wide">Coberturas Contratadas</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground text-left text-xs">
              <th className="py-1.5 px-3 rounded-tl-lg">Cobertura</th>
              <th className="py-1.5 px-3 text-right rounded-tr-lg">Valor Asegurado</th>
            </tr>
          </thead>
          <tbody>
            {result.activeCoverages.map((c) => (
              <tr key={c.code} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-2 px-3 text-foreground">{c.name}</td>
                <td className="py-2 px-3 text-right font-mono text-xs">{c.ruleDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ages */}
      <div className="rounded-xl border border-border p-4 space-y-3 shadow-card">
        <h3 className="text-sm font-semibold text-primary font-display uppercase tracking-wide">Edades de Ingreso y Permanencia</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground text-left text-xs">
              <th className="py-1.5 px-3 rounded-tl-lg">Cobertura</th>
              <th className="py-1.5 px-3 text-center">Min Ingreso</th>
              <th className="py-1.5 px-3 text-center">Max Ingreso</th>
              <th className="py-1.5 px-3 text-center rounded-tr-lg">Max Permanencia</th>
            </tr>
          </thead>
          <tbody>
            {result.activeCoverages.map((c) => (
              <tr key={c.code} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-1.5 px-3 text-foreground text-xs">{c.name}</td>
                <td className="py-1.5 px-3 text-center text-xs">{c.ageMinIngreso} años</td>
                <td className="py-1.5 px-3 text-center text-xs">{c.ageNote || `${c.ageMaxIngreso} años`}</td>
                <td className="py-1.5 px-3 text-center text-xs">{c.ageNote || `${c.ageMaxPermanencia} años`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clausulas */}
      {clausulas.length > 0 && (
        <div className="rounded-xl border border-border p-4 space-y-2 shadow-card">
          <h3 className="text-sm font-semibold text-primary font-display uppercase tracking-wide">Clausulado Aplicable</h3>
          <div className="flex flex-wrap gap-2">
            {clausulas.map((c, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">{c}</span>
            ))}
          </div>
        </div>
      )}

      <Section title="Sistema de Administración">
        <Row label="Tipo de Ajuste" value={solicitud.tipo_ajuste || "—"} />
        <Row label="Forma de Pago" value={solicitud.forma_pago || "—"} />
        <Row label="Plazo máximo de pago" value="Máximo 45 días" />
        <Row label="Facturación" value="Anticipada" />
      </Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border p-4 space-y-2 shadow-card">
    <h3 className="text-sm font-semibold text-primary font-display uppercase tracking-wide">{title}</h3>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium text-right max-w-[60%]">{value}</span>
  </div>
);

export default AnalystPropuesta;
