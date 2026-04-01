import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepGeneralesProps {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const StepGenerales = ({ data, onChange }: StepGeneralesProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide mb-1">Datos de la Oficina e Intermediario</h2>
        <p className="text-sm text-muted-foreground">Información general de la solicitud de cotización.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Fecha de Solicitud</Label>
          <Input type="date" value={data.fechaSolicitud || ""} onChange={(e) => onChange("fechaSolicitud", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Canal</Label>
          <Input placeholder="Ej: Corredor" value={data.canal || ""} onChange={(e) => onChange("canal", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Localidad</Label>
          <Input placeholder="Ciudad o localidad" value={data.localidad || ""} onChange={(e) => onChange("localidad", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Código Localidad</Label>
          <Input placeholder="Código" value={data.codigoLocalidad || ""} onChange={(e) => onChange("codigoLocalidad", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Director Comercial</Label>
          <Input placeholder="Nombre completo" value={data.directorComercial || ""} onChange={(e) => onChange("directorComercial", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Nombre Intermediario</Label>
          <Input placeholder="Nombre del intermediario" value={data.nombreIntermediario || ""} onChange={(e) => onChange("nombreIntermediario", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Clave Intermediario</Label>
          <Input placeholder="Clave" value={data.claveIntermediario || ""} onChange={(e) => onChange("claveIntermediario", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Reasegurador</Label>
          <Select value={data.reasegurador || ""} onValueChange={(v) => onChange("reasegurador", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Local">Local</SelectItem>
              <SelectItem value="Internacional">Internacional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepGenerales;
