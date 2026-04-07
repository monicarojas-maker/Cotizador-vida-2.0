import { Label } from "@/components/bolivar";
import { Switch } from "@/components/bolivar";

const CLAUSULAS = [
  "Amparo Automático",
  "Cáncer Insitu incluye de Seno",
  "Causalidad",
  "Cobertura Amplia de Vuelo",
  "Continuidad",
  "Convertibilidad",
  "Deducciones",
  "Desviación de Siniestralidad",
  "Errores, Omisiones, Inexactitudes",
  "Extensión de Cobertura para Indemnización por Muerte Accidental",
  "Extraprimas",
  "Irreductibilidad",
  "Muerte Presunta",
  "Participación de Utilidades",
  "Reporte de Novedades",
  "Restablecimiento del Valor Asegurado",
  "Revocación",
];

interface StepClausulasProps {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const StepClausulas = ({ data, onChange }: StepClausulasProps) => {
  const toKey = (s: string) => `clausula_${s.replace(/[^a-zA-Z]/g, "").toLowerCase()}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide mb-1">Cláusulas</h2>
        <p className="text-sm text-muted-foreground">Seleccione las cláusulas que aplican a esta cotización.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CLAUSULAS.map((clausula) => {
          const key = toKey(clausula);
          const isActive = data[key] === "SI";
          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                isActive ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/20"
              }`}
              onClick={() => onChange(key, isActive ? "NO" : "SI")}
            >
              <Switch checked={isActive} onCheckedChange={(c) => onChange(key, c ? "SI" : "NO")} />
              <Label className="text-sm cursor-pointer">{clausula}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepClausulas;
