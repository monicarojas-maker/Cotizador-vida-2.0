import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, AppBar } from "@/components/bolivar";
import { ArrowLeft, ArrowRight, Shield, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import StepIndicator from "@/components/cotizador/StepIndicator";
import StepGenerales from "@/components/cotizador/StepGenerales";
import StepTomador from "@/components/cotizador/StepTomador";
import StepCoberturas from "@/components/cotizador/StepCoberturas";
import StepClausulas from "@/components/cotizador/StepClausulas";
import StepEnvio from "@/components/cotizador/StepEnvio";

const TOTAL_STEPS = 5;

const Index = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const renderStep = () => {
    switch (step) {
      case 0: return <StepGenerales data={formData} onChange={handleChange} />;
      case 1: return <StepTomador data={formData} onChange={handleChange} />;
      case 2: return <StepCoberturas data={formData} onChange={handleChange} />;
      case 3: return <StepClausulas data={formData} onChange={handleChange} />;
      case 4: return <StepEnvio data={formData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppBar
        title="Cotizador"
        subtitle='Vida Grupo Colectivo "726"'
        icon={<Shield className="w-5 h-5 text-primary-foreground" />}
        actions={
          <Link to="/analista">
            <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Calculator className="w-4 h-4" /> Analista
            </Button>
          </Link>
        }
      />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />

        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 min-h-[400px] shadow-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prev} disabled={step === 0} className="gap-2 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Anterior
          </Button>
          {step < TOTAL_STEPS - 1 && (
            <Button onClick={next} className="gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Siguiente <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground mt-12">
        <div className="container max-w-4xl mx-auto px-4 py-6 text-center text-sm opacity-80">
          Seguros Bolívar — Cotizador Vida Grupo Colectivo
        </div>
      </footer>
    </div>
  );
};

export default Index;
