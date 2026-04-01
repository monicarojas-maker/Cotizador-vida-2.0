import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface StepTomadorProps {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const StepTomador = ({ data, onChange }: StepTomadorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide mb-1">Datos del Tomador</h2>
        <p className="text-sm text-muted-foreground">Información del grupo asegurado y condiciones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Nombre del Tomador</Label>
          <Input placeholder="Razón social" value={data.nombreTomador || ""} onChange={(e) => onChange("nombreTomador", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>NIT del Tomador</Label>
          <Input placeholder="NIT" value={data.nitTomador || ""} onChange={(e) => onChange("nitTomador", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Código CIIU y Actividad Económica</Label>
          <Input placeholder="Ej: 6512 - Seguros" value={data.ciiu || ""} onChange={(e) => onChange("ciiu", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Número Total de Asegurados</Label>
          <Input type="number" placeholder="0" value={data.totalAsegurados || ""} onChange={(e) => onChange("totalAsegurados", e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Relación del Grupo Asegurado con el Tomador</Label>
          <Input placeholder="Ej: Empleados, Asociados, Cooperados" value={data.relacionGrupo || ""} onChange={(e) => onChange("relacionGrupo", e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Distribución del Grupo Asegurado</Label>
          <Input placeholder="Ej: 80% Administrativos, 20% Operarios" value={data.distribucionGrupo || ""} onChange={(e) => onChange("distribucionGrupo", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Tipo de Seguro</Label>
          <Select value={data.tipoSeguro || ""} onValueChange={(v) => onChange("tipoSeguro", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No Contributivo">No Contributivo</SelectItem>
              <SelectItem value="Contributivo">Contributivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tasa Actual (Opcional)</Label>
          <Input placeholder="%" value={data.tasaActual || ""} onChange={(e) => onChange("tasaActual", e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Póliza con otra compañía</h3>
        <div className="flex items-center gap-3">
          <Switch checked={data.tienePóliza === "SI"} onCheckedChange={(c) => onChange("tienePóliza", c ? "SI" : "NO")} />
          <Label className="text-sm">¿Tiene póliza de seguro con otra compañía?</Label>
        </div>
        {data.tienePóliza === "SI" && (
          <div className="space-y-2">
            <Label>Nombre de la compañía actual</Label>
            <Input placeholder="Compañía de seguros" value={data.companiaActual || ""} onChange={(e) => onChange("companiaActual", e.target.value)} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Forma de Pago y Tipo de Ajuste</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Ajuste</Label>
            <Select value={data.tipoAjuste || ""} onValueChange={(v) => onChange("tipoAjuste", v)}>
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Blanket">Ajuste Blanket</SelectItem>
                <SelectItem value="Prorrata">Ajuste a Prorrata</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Forma de Pago</Label>
            <Select value={data.formaPago || ""} onValueChange={(v) => onChange("formaPago", v)}>
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Anual">Anual</SelectItem>
                <SelectItem value="Mensual">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Valor Asegurado expresado en</Label>
        <Select value={data.valorAseguradoExpresion || ""} onValueChange={(v) => onChange("valorAseguradoExpresion", v)}>
          <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="SMMLV">SMMLV</SelectItem>
            <SelectItem value="Pesos">Pesos Colombianos</SelectItem>
            <SelectItem value="USD">Dólares</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Condiciones Particulares / Observaciones</Label>
        <Textarea placeholder="Observaciones, términos actuales, continuidad, etc." value={data.condicionesParticulares || ""} onChange={(e) => onChange("condicionesParticulares", e.target.value)} rows={3} />
      </div>
    </div>
  );
};

export default StepTomador;
