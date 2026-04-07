import { Button } from "@/components/bolivar";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StepEnvioProps {
  data: Record<string, string>;
}

const REQUIRED_FIELDS: Record<string, string> = {
  fechaSolicitud: "Fecha de Solicitud",
  canal: "Canal",
  localidad: "Localidad",
  directorComercial: "Director Comercial",
  nombreIntermediario: "Nombre Intermediario",
  claveIntermediario: "Clave Intermediario",
  nombreTomador: "Nombre del Tomador",
  nitTomador: "NIT del Tomador",
  ciiu: "CIIU y Actividad Económica",
  totalAsegurados: "Número Total de Asegurados",
  relacionGrupo: "Relación del Grupo",
  tipoSeguro: "Tipo de Seguro",
  tipoAjuste: "Tipo de Ajuste",
  formaPago: "Forma de Pago",
};

const COBERTURA_LABELS: Record<string, string> = {
  cob_muerte: "Muerte por cualquier causa",
  cob_incapacidadTotal: "Incapacidad Total y Permanente",
  cob_muerteAccidental: "Muerte Accidental / Desmembración",
  cob_enfermedadesGraves: "Enfermedades Graves",
  cob_rentaHospitalizacion: "Renta Diaria por Hospitalización",
  cob_rentaPosthospitalaria: "Renta Posthospitalaria",
  cob_rentaIncapacidadTemporal: "Renta Incapacidad Temporal",
  cob_auxilioExequial: "Auxilio Exequial",
  cob_bonoCanasta: "Bono Canasta",
  cob_auxilioMaternidad: "Auxilio Maternidad/Paternidad",
  cob_auxilioTraslado: "Auxilio Traslado del Cuerpo",
  cob_auxilioRepatriacion: "Auxilio Repatriación",
};

const StepEnvio = ({ data }: StepEnvioProps) => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [numeroSolicitud, setNumeroSolicitud] = useState<number | null>(null);
  const { toast } = useToast();

  const missing = Object.entries(REQUIRED_FIELDS)
    .filter(([key]) => !data[key]?.trim())
    .map(([, label]) => label);

  const activeCoberturas = Object.entries(data)
    .filter(([k, v]) => k.endsWith("_active") && v === "SI")
    .map(([k]) => {
      const base = k.replace("_active", "");
      return { label: COBERTURA_LABELS[base] || base, valor: data[`${base}_valor`] || "Sin valor" };
    });

  const CLAUSULAS_LABELS: Record<string, string> = {
    clausula_amparoautomtico: "Amparo Automático",
    clausula_cncerinsituincluyedeseno: "Cáncer Insitu incluye de Seno",
    clausula_causalidad: "Causalidad",
    clausula_coberturaampliadevuelo: "Cobertura Amplia de Vuelo",
    clausula_continuidad: "Continuidad",
    clausula_convertibilidad: "Convertibilidad",
    clausula_deducciones: "Deducciones",
    clausula_desviacindesiniestralidad: "Desviación de Siniestralidad",
    clausula_erroresomisionesinexactitudes: "Errores, Omisiones, Inexactitudes",
    clausula_extensindecoberturaparaindemnizacinpormuerteaccidental: "Extensión de Cobertura para Indemnización por Muerte Accidental",
    clausula_extraprimas: "Extraprimas",
    clausula_irreductibilidad: "Irreductibilidad",
    clausula_muertepresunta: "Muerte Presunta",
    clausula_participacindeutilidades: "Participación de Utilidades",
    clausula_reportedenovedades: "Reporte de Novedades",
    clausula_restablecimientodelvalorasegurado: "Restablecimiento del Valor Asegurado",
    clausula_revocacin: "Revocación",
  };

  const activeClausulas = Object.entries(data)
    .filter(([k, v]) => k.startsWith("clausula_") && v === "SI")
    .map(([k]) => CLAUSULAS_LABELS[k] || k.replace("clausula_", ""));

  const isValid = missing.length === 0;

  const handleSend = async () => {
    if (!isValid || sending) return;
    setSending(true);

    try {
      const coberturas = activeCoberturas.map((c) => ({
        nombre: c.label,
        valor: c.valor,
      }));

      const { data: inserted, error } = await supabase
        .from("solicitudes")
        .insert({
          fecha_solicitud: data.fechaSolicitud || null,
          canal: data.canal || null,
          localidad: data.localidad || null,
          codigo_localidad: data.codigoLocalidad || null,
          director_comercial: data.directorComercial || null,
          nombre_intermediario: data.nombreIntermediario || null,
          clave_intermediario: data.claveIntermediario || null,
          reasegurador: data.reasegurador || null,
          nombre_tomador: data.nombreTomador || null,
          nit_tomador: data.nitTomador || null,
          ciiu: data.ciiu || null,
          total_asegurados: data.totalAsegurados ? parseInt(data.totalAsegurados) : null,
          relacion_grupo: data.relacionGrupo || null,
          distribucion_grupo: data.distribucionGrupo || null,
          tipo_seguro: data.tipoSeguro || null,
          tasa_actual: data.tasaActual || null,
          tiene_poliza: data.tienePóliza === "SI",
          compania_actual: data.companiaActual || null,
          tipo_ajuste: data.tipoAjuste || null,
          forma_pago: data.formaPago || null,
          valor_asegurado_expresion: data.valorAseguradoExpresion || null,
          condiciones_particulares: data.condicionesParticulares || null,
          coberturas,
          clausulas: activeClausulas,
        })
        .select("numero_solicitud")
        .single();

      if (error) throw error;

      setNumeroSolicitud(inserted.numero_solicitud);
      setSent(true);
      toast({ title: "Solicitud guardada", description: `Número de solicitud: ${inserted.numero_solicitud}` });
    } catch (err: any) {
      console.error("Error saving solicitud:", err);
      toast({ title: "Error", description: err.message || "No se pudo guardar la solicitud.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 space-y-4">
        <CheckCircle2 className="w-16 h-16 text-success" />
        <h2 className="font-display text-2xl font-bold text-foreground uppercase">¡Solicitud Enviada!</h2>
        <p className="text-muted-foreground text-center max-w-md">
          La solicitud de cotización para <strong className="text-foreground">{data.nombreTomador}</strong> ha sido guardada exitosamente.
        </p>
        {numeroSolicitud && (
          <div className="mt-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30">
            <span className="text-sm text-muted-foreground">Número de Solicitud:</span>
            <span className="ml-2 text-2xl font-bold text-primary">{numeroSolicitud}</span>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide mb-1">Revisión y Envío</h2>
        <p className="text-sm text-muted-foreground">Verifique la información antes de enviar la solicitud.</p>
      </div>

      {!isValid && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            Campos obligatorios faltantes
          </div>
          <ul className="text-sm text-destructive/80 list-disc pl-5 space-y-0.5">
            {missing.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <Section title="Generales">
          <Row label="Fecha" value={data.fechaSolicitud} />
          <Row label="Canal" value={data.canal} />
          <Row label="Localidad" value={`${data.localidad || ""} (${data.codigoLocalidad || ""})`} />
          <Row label="Director Comercial" value={data.directorComercial} />
          <Row label="Intermediario" value={`${data.nombreIntermediario || ""} - ${data.claveIntermediario || ""}`} />
          <Row label="Reasegurador" value={data.reasegurador} />
        </Section>

        <Section title="Tomador">
          <Row label="Nombre" value={data.nombreTomador} />
          <Row label="NIT" value={data.nitTomador} />
          <Row label="CIIU" value={data.ciiu} />
          <Row label="Asegurados" value={data.totalAsegurados} />
          <Row label="Relación" value={data.relacionGrupo} />
          <Row label="Tipo Seguro" value={data.tipoSeguro} />
          <Row label="Ajuste / Pago" value={`${data.tipoAjuste || ""} / ${data.formaPago || ""}`} />
        </Section>

        {activeCoberturas.length > 0 && (
          <Section title="Coberturas Activas">
            {activeCoberturas.map((c) => (
              <Row key={c.label} label={c.label} value={c.valor} />
            ))}
          </Section>
        )}

        {activeClausulas.length > 0 && (
          <Section title="Cláusulas Activas">
            <div className="flex flex-wrap gap-2">
              {activeClausulas.map((c) => (
                <span key={c} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">{c}</span>
              ))}
            </div>
          </Section>
        )}
      </div>

      <Button onClick={handleSend} disabled={!isValid || sending} size="lg" className="w-full gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base">
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {sending ? "Guardando..." : "Enviar Solicitud de Cotización"}
      </Button>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-card">
    <h3 className="text-sm font-semibold text-primary font-display uppercase tracking-wide">{title}</h3>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium text-right max-w-[60%]">{value || "—"}</span>
  </div>
);

export default StepEnvio;
