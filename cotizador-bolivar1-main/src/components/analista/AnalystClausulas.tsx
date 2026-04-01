import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface Props {
  clausulas: string[];
}

const AnalystClausulas = ({ clausulas }: Props) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-card">
      <div>
        <h2 className="font-display text-lg font-bold text-primary uppercase tracking-wide mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Cláusulas de la Solicitud
        </h2>
        <p className="text-sm text-muted-foreground">
          Cláusulas seleccionadas por el asesor en el formulario de solicitud.
        </p>
      </div>

      {clausulas.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/40 p-6 text-center">
          <p className="text-sm text-muted-foreground">No se seleccionaron cláusulas en esta solicitud.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border p-4">
          <div className="flex flex-wrap gap-2">
            {clausulas.map((c, i) => (
              <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3 capitalize rounded-full bg-primary/10 text-primary border-0">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalystClausulas;
