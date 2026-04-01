import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const COBERTURAS = [
  { key: "muerte", label: "Cobertura Básica – Muerte por cualquier causa" },
  { key: "incapacidadTotal", label: "Incapacidad Total y Permanente" },
  { key: "muerteAccidental", label: "Indemnización Adicional por Muerte Accidental, Desmembración e Incapacidad Total y Permanente por Accidente" },
  { key: "enfermedadesGraves", label: "Enfermedades Graves" },
  { key: "rentaHospitalizacion", label: "Renta Diaria por Hospitalización" },
  { key: "rentaPosthospitalaria", label: "Renta por Incapacidad Posthospitalaria" },
  { key: "rentaIncapacidadTemporal", label: "Renta Diaria por Incapacidad Temporal por Enfermedad o Accidente" },
  { key: "auxilioExequial", label: "Auxilio Exequial" },
  { key: "bonoCanasta", label: "Bono Canasta por Fallecimiento o Incapacidad Total y Permanente" },
  { key: "auxilioMaternidad", label: "Auxilio de Maternidad y/o Paternidad" },
  { key: "auxilioTraslado", label: "Auxilio de Traslado del Cuerpo" },
  { key: "auxilioRepatriacion", label: "Auxilio de Repatriación" },
];

interface StepCoberturasProps {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const StepCoberturas = ({ data, onChange }: StepCoberturasProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide mb-1">Amparos / Coberturas</h2>
        <p className="text-sm text-muted-foreground">Active las coberturas requeridas e indique el valor asegurado.</p>
      </div>

      <div className="space-y-3">
        {COBERTURAS.map(({ key, label }) => {
          const isActive = data[`cob_${key}_active`] === "SI";
          const isBasic = key === "muerte";
          return (
            <div
              key={key}
              className={`rounded-xl border p-4 transition-all ${
                isActive ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <Switch
                  checked={isBasic ? true : isActive}
                  onCheckedChange={(c) => !isBasic && onChange(`cob_${key}_active`, c ? "SI" : "NO")}
                  disabled={isBasic}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-3">
                  <Label className="text-sm leading-tight">{label} {isBasic && <span className="text-xs text-muted-foreground">(obligatoria)</span>}</Label>
                  {isActive && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Valor Asegurado Promedio o Valor Fijo (COP)</Label>
                      <Input
                        type="number"
                        placeholder="Ej: 50000000"
                        value={data[`cob_${key}_valor`] || ""}
                        onChange={(e) => onChange(`cob_${key}_valor`, e.target.value)}
                        className="max-w-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepCoberturas;
