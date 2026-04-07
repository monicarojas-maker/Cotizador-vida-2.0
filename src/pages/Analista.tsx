import { useState, useEffect, useMemo } from "react";
import { Shield, Calculator, FileText, Settings2 } from "lucide-react";
import { Button, AppBar } from "@/components/bolivar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/bolivar";
import {
  calculateQuote,
  COVERAGE_CATALOG,
  DEFAULT_PARAMS,
  type PricingParams,
  type CoverageConfig,
  type QuoteResult,
} from "@/lib/pricing-engine";
import AnalystParams from "@/components/analista/AnalystParams";
import AnalystCoverages from "@/components/analista/AnalystCoverages";
import AnalystResults from "@/components/analista/AnalystResults";
import AnalystPropuesta from "@/components/analista/AnalystPropuesta";
import AnalystClausulas from "@/components/analista/AnalystClausulas";
import { Link } from "react-router-dom";

interface Solicitud {
  numero_solicitud: number;
  nombre_tomador: string | null;
  nit_tomador: string | null;
  total_asegurados: number | null;
  created_at: string;
  canal: string | null;
  localidad: string | null;
  director_comercial: string | null;
  nombre_intermediario: string | null;
  clave_intermediario: string | null;
  reasegurador: string | null;
  ciiu: string | null;
  relacion_grupo: string | null;
  tipo_seguro: string | null;
  tipo_ajuste: string | null;
  forma_pago: string | null;
  coberturas: any;
  clausulas: any;
}

const Analista = () => {
  const { toast } = useToast();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useState<PricingParams>(DEFAULT_PARAMS);
  const [coverageConfigs, setCoverageConfigs] = useState<CoverageConfig[]>(
    COVERAGE_CATALOG.map((c) => ({
      code: c.code,
      active: c.code === "muerte",
      riskRate: c.defaultRiskRate,
      manualValue: c.defaultFixed,
    }))
  );

  const muerteConfig = coverageConfigs.find((c) => c.code === "muerte");
  const valorBase = muerteConfig?.manualValue ?? 60_000_000;

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    const { data, error } = await supabase
      .from("solicitudes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSolicitudes(data || []);
    }
    setLoading(false);
  };

  const handleSelect = (sol: Solicitud) => {
    setSelected(sol);
    if (sol.coberturas && Array.isArray(sol.coberturas)) {
      const solCobs = sol.coberturas as Array<{ nombre: string; valor: string }>;

      const nameToCode: Record<string, string> = {};
      COVERAGE_CATALOG.forEach((def) => {
        nameToCode[def.name.toLowerCase()] = def.code;
      });

      const LABEL_MAP: Record<string, string> = {
        "muerte por cualquier causa": "muerte",
        "incapacidad total y permanente": "itp",
        "indemnización adicional por muerte accidental, desmembración e incapacidad total y permanente por accidente": "muerteAccidental",
        "enfermedades graves": "enfermedadesGraves",
        "renta diaria por hospitalización": "rentaHospitalizacion",
        "renta por incapacidad posthospitalaria": "rentaPosthospitalaria",
        "renta diaria por incapacidad temporal por enfermedad o accidente": "rentaIncapacidadTemporal",
        "auxilio exequial": "auxilioExequial",
        "bono canasta por fallecimiento o incapacidad total y permanente": "bonoCanasta",
        "auxilio de maternidad y/o paternidad": "auxilioMaternidad",
        "auxilio de traslado del cuerpo": "auxilioTraslado",
        "auxilio de repatriación": "auxilioRepatriacion",
      };

      const resolveCode = (nombre: string): string | undefined => {
        const lower = nombre.toLowerCase().trim();
        return nameToCode[lower] || LABEL_MAP[lower];
      };

      const matchedCodes = new Set<string>();
      const valorByCode: Record<string, number> = {};
      solCobs.forEach((sc) => {
        const code = resolveCode(sc.nombre || "");
        if (code) {
          matchedCodes.add(code);
          const parsed = parseFloat(String(sc.valor).replace(/[^0-9.]/g, ""));
          if (!isNaN(parsed)) valorByCode[code] = parsed;
        }
      });

      setCoverageConfigs((prev) =>
        prev.map((cc) => {
          const isMatched = matchedCodes.has(cc.code);
          const val = valorByCode[cc.code];
          return {
            ...cc,
            active: isMatched || cc.code === "muerte",
            ...(val !== undefined ? { manualValue: val } : {}),
          };
        })
      );
    }
  };

  const numAsegurados = selected?.total_asegurados ?? 300;

  const result: QuoteResult = useMemo(
    () => calculateQuote(params, coverageConfigs, valorBase, numAsegurados),
    [params, coverageConfigs, valorBase, numAsegurados]
  );

  return (
    <div className="min-h-screen bg-background">
      <AppBar
        title="Analista"
        subtitle="Motor de Cotización — Vida Grupo"
        icon={<Calculator className="w-5 h-5 text-primary-foreground" />}
        actions={
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Shield className="w-4 h-4" /> Cotizador
            </Button>
          </Link>
        }
      />

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Solicitud selector */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2 font-display uppercase tracking-wide">
            <FileText className="w-4 h-4" /> Seleccionar Solicitud
          </h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
          ) : solicitudes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay solicitudes disponibles. <Link to="/" className="text-primary underline">Crear una nueva</Link></p>
          ) : (
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {solicitudes.map((sol) => (
                <button
                  key={sol.numero_solicitud}
                  onClick={() => handleSelect(sol)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all text-sm ${
                    selected?.numero_solicitud === sol.numero_solicitud
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <span className="font-semibold text-foreground">#{sol.numero_solicitud}</span>
                    <span className="ml-2 text-muted-foreground">{sol.nombre_tomador || "Sin nombre"}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{sol.total_asegurados} asegurados</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(sol.created_at).toLocaleDateString("es-CO")}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <Tabs defaultValue="params" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-muted rounded-xl p-1">
              <TabsTrigger value="params" className="gap-1 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Settings2 className="w-3.5 h-3.5" /> Parámetros
              </TabsTrigger>
              <TabsTrigger value="coverages" className="gap-1 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Shield className="w-3.5 h-3.5" /> Coberturas
              </TabsTrigger>
              <TabsTrigger value="clausulas" className="gap-1 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <FileText className="w-3.5 h-3.5" /> Cláusulas
              </TabsTrigger>
              <TabsTrigger value="results" className="gap-1 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Calculator className="w-3.5 h-3.5" /> Resultados
              </TabsTrigger>
              <TabsTrigger value="propuesta" className="gap-1 text-xs sm:text-sm rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <FileText className="w-3.5 h-3.5" /> Propuesta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="params">
              <AnalystParams
                params={params}
                onParamsChange={setParams}
                valorBase={valorBase}
                onValorBaseChange={(v) => setCoverageConfigs(prev => prev.map(c => c.code === "muerte" ? { ...c, manualValue: v } : c))}
                numAsegurados={numAsegurados}
                solicitud={selected}
              />
            </TabsContent>

            <TabsContent value="coverages">
              <AnalystCoverages
                configs={coverageConfigs}
                onConfigsChange={setCoverageConfigs}
                valorBase={valorBase}
                params={params}
              />
            </TabsContent>

            <TabsContent value="clausulas">
              <AnalystClausulas clausulas={Array.isArray(selected.clausulas) ? selected.clausulas as string[] : []} />
            </TabsContent>

            <TabsContent value="results">
              <AnalystResults result={result} params={params} />
            </TabsContent>

            <TabsContent value="propuesta">
              <AnalystPropuesta result={result} solicitud={selected} params={params} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <footer className="bg-secondary text-secondary-foreground mt-12">
        <div className="container max-w-6xl mx-auto px-4 py-6 text-center text-sm opacity-80">
          Seguros Bolívar — Motor de Cotización Vida Grupo
        </div>
      </footer>
    </div>
  );
};

export default Analista;
