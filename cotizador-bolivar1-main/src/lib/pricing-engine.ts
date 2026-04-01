// ===== PRICING ENGINE — Vida Grupo Cotizador =====

export type CalcType = "SAME_AS_BASE" | "PERCENT_OF_BASE" | "MIN_PERCENT_CAP" | "FIXED" | "MANUAL";

export interface CoverageDefinition {
  code: string;
  name: string;
  calcType: CalcType;
  percent?: number;       // for PERCENT_OF_BASE / MIN_PERCENT_CAP
  cap?: number;           // for MIN_PERCENT_CAP
  defaultFixed?: number;  // for FIXED/MANUAL defaults
  defaultRiskRate: number;
  ruleDescription: string;
  ageMinIngreso: number;
  ageMaxIngreso: number;
  ageMaxPermanencia: number;
  ageNote?: string;       // for special age rules
}

export const COVERAGE_CATALOG: CoverageDefinition[] = [
  {
    code: "muerte",
    name: "Cobertura Básica – Muerte por cualquier causa",
    calcType: "SAME_AS_BASE",
    defaultRiskRate: 0.7,
    ruleDescription: "Min $30'000,000 Max $100'000,000",
    ageMinIngreso: 15, ageMaxIngreso: 70, ageMaxPermanencia: 75,
  },
  {
    code: "itp",
    name: "Incapacidad Total y Permanente",
    calcType: "SAME_AS_BASE",
    defaultRiskRate: 0.3,
    ruleDescription: "Min $30'000,000 Max $100'000,000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "ipp",
    name: "Incapacidad Parcial Permanente",
    calcType: "PERCENT_OF_BASE",
    percent: 0.5,
    defaultRiskRate: 0.27,
    ruleDescription: "Máximo 50% de ITP",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "muerteAccidental",
    name: "Indemnización Adicional por Muerte Accidental, Desmembración e Incapacidad Total y Permanente por Accidente",
    calcType: "SAME_AS_BASE",
    defaultRiskRate: 0.1,
    ruleDescription: "Min $30'000,000 Max $100'000,000",
    ageMinIngreso: 15, ageMaxIngreso: 70, ageMaxPermanencia: 75,
  },
  {
    code: "enfermedadesGraves",
    name: "Enfermedades Graves",
    calcType: "PERCENT_OF_BASE",
    percent: 0.6,
    defaultRiskRate: 1.5,
    ruleDescription: "60% del Básico, Máx $60'000,000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "rentaHospitalizacion",
    name: "Renta Diaria por Hospitalización (Hospitalización, Doble Por UCI, Complicaciones Por Parto)",
    calcType: "PERCENT_OF_BASE",
    percent: 0.001,
    defaultRiskRate: 60,
    ruleDescription: "0,1% del Básico, Máx $100.000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "rentaPosthospitalaria",
    name: "Renta por Incapacidad Posthospitalaria",
    calcType: "PERCENT_OF_BASE",
    percent: 0.0005,
    defaultRiskRate: 45,
    ruleDescription: "0,05% del Básico, Máx $50.000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "rentaIncapacidadTemporal",
    name: "Renta Diaria por Incapacidad Temporal por Enfermedad o Accidente",
    calcType: "PERCENT_OF_BASE",
    percent: 0.001,
    defaultRiskRate: 85.5,
    ruleDescription: "0,1% del Básico, Máx $100.000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "auxilioExequial",
    name: "Auxilio Exequial",
    calcType: "MIN_PERCENT_CAP",
    percent: 0.1,
    cap: 7_000_000,
    defaultRiskRate: 0.7,
    ruleDescription: "10% del Básico, Máx $7.000.000",
    ageMinIngreso: 15, ageMaxIngreso: 70, ageMaxPermanencia: 75,
  },
  {
    code: "bonoCanasta",
    name: "Bono Canasta por Fallecimiento o Incapacidad Total y Permanente",
    calcType: "MANUAL",
    defaultFixed: 4_000_000,
    defaultRiskRate: 0.8,
    ruleDescription: "$4,000,000",
    ageMinIngreso: 15, ageMaxIngreso: 70, ageMaxPermanencia: 75,
    ageNote: "Sujeta a la cobertura básica",
  },
  {
    code: "cirugiaAmbulatoria",
    name: "Cirugía Ambulatoria o Tratamiento Médico Ambulatorio",
    calcType: "MANUAL",
    defaultFixed: 400_000,
    defaultRiskRate: 12,
    ruleDescription: "$400,000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "auxilioMaternidad",
    name: "Auxilio de Maternidad y/o Paternidad",
    calcType: "MANUAL",
    defaultFixed: 200_000,
    defaultRiskRate: 7,
    ruleDescription: "$200,000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "auxilioTraslado",
    name: "Auxilio de Traslado del Cuerpo",
    calcType: "MANUAL",
    defaultFixed: 3_000_000,
    defaultRiskRate: 0.07,
    ruleDescription: "$3,000,000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
  {
    code: "auxilioRepatriacion",
    name: "Auxilio de Repatriación",
    calcType: "MANUAL",
    defaultFixed: 5_000_000,
    defaultRiskRate: 0.035,
    ruleDescription: "$5,000,000",
    ageMinIngreso: 15, ageMaxIngreso: 65, ageMaxPermanencia: 70,
  },
];

// ===== Parameters =====
export interface PricingParams {
  comision: number;       // e.g. 0.20
  utilidad: number;       // e.g. 0.15
  gastos: number;         // e.g. 0.055
  ivaComision: number;    // e.g. 0.19 (19%)
  factorDescuento: number; // e.g. -0.5 (50% discount)
}

export const DEFAULT_PARAMS: PricingParams = {
  comision: 0.20,
  utilidad: 0.15,
  gastos: 0.055,
  ivaComision: 0.19,
  factorDescuento: -0.5,
};

// ===== Coverage config for a quote =====
export interface CoverageConfig {
  code: string;
  active: boolean;
  riskRate: number;
  manualValue?: number; // for MANUAL/FIXED overrides
}

// ===== Calculated result per coverage =====
export interface CoverageResult {
  code: string;
  name: string;
  active: boolean;
  valorAsegurado: number;
  riskRate: number;
  commercialRate: number;
  prima: number;
  ruleDescription: string;
  ageMinIngreso: number;
  ageMaxIngreso: number;
  ageMaxPermanencia: number;
  ageNote?: string;
}

// ===== Full quote result =====
export interface QuoteResult {
  coverages: CoverageResult[];
  activeCoverages: CoverageResult[];
  sumaTasasComerciales: number;
  tasaPorMil: number;
  tasaCotizada: number;
  tasaCotizadaRedondeada: number;
  numeroAsegurados: number;
  valorAseguradoPromedio: number;
  valorAseguradoTotal: number;
  prima: number;
  // Desglose
  comisionIva: number;
  gastos: number;
  utilidad: number;
}

// ===== Calculate insured value for a coverage =====
function calcularValorCobertura(
  def: CoverageDefinition,
  valorBase: number,
  manualValue?: number
): number {
  switch (def.calcType) {
    case "SAME_AS_BASE":
      return valorBase;
    case "PERCENT_OF_BASE":
      return valorBase * (def.percent ?? 0);
    case "MIN_PERCENT_CAP":
      return Math.min(valorBase * (def.percent ?? 0), def.cap ?? Infinity);
    case "FIXED":
      return def.defaultFixed ?? 0;
    case "MANUAL":
      return manualValue ?? def.defaultFixed ?? 0;
    default:
      return 0;
  }
}

// ===== Main pricing function =====
export function calculateQuote(
  params: PricingParams,
  coverageConfigs: CoverageConfig[],
  valorAseguradoBase: number,
  numeroAsegurados: number
): QuoteResult {
  const divisor = 1 - params.comision * (1 + params.ivaComision) - params.utilidad - params.gastos;

  const coverages: CoverageResult[] = COVERAGE_CATALOG.map((def) => {
    const config = coverageConfigs.find((c) => c.code === def.code);
    const active = config?.active ?? false;
    const riskRate = config?.riskRate ?? def.defaultRiskRate;
    const valorAsegurado = calcularValorCobertura(def, valorAseguradoBase, config?.manualValue);
    const commercialRate = riskRate / divisor;
    const prima = active ? (commercialRate * valorAsegurado * numeroAsegurados) / 1_000_000 : 0;

    return {
      code: def.code,
      name: def.name,
      active,
      valorAsegurado,
      riskRate,
      commercialRate,
      prima,
      ruleDescription: def.ruleDescription,
      ageMinIngreso: def.ageMinIngreso,
      ageMaxIngreso: def.ageMaxIngreso,
      ageMaxPermanencia: def.ageMaxPermanencia,
      ageNote: def.ageNote,
    };
  });

  const activeCoverages = coverages.filter((c) => c.active);

  // Sum commercial rates of active coverages (weighted by their insured value)
  const sumaTasasComerciales = activeCoverages.reduce(
    (sum, c) => sum + c.commercialRate * c.valorAsegurado,
    0
  );

  const tasaPorMil = valorAseguradoBase > 0
    ? (sumaTasasComerciales / valorAseguradoBase) * 1000
    : 0;

  const tasaCotizada = tasaPorMil * (1 + params.factorDescuento);
  const tasaCotizadaRedondeada = Math.round(tasaCotizada * 10) / 10;

  const valorAseguradoTotal = numeroAsegurados * valorAseguradoBase;
  const prima = (tasaCotizadaRedondeada * valorAseguradoTotal) / 1000;

  const comisionIva = params.comision * (1 + params.ivaComision) * prima;
  const gastos = params.gastos * prima;
  const utilidad = prima - comisionIva - gastos;

  return {
    coverages,
    activeCoverages,
    sumaTasasComerciales,
    tasaPorMil,
    tasaCotizada,
    tasaCotizadaRedondeada,
    numeroAsegurados,
    valorAseguradoPromedio: valorAseguradoBase,
    valorAseguradoTotal,
    prima,
    comisionIva,
    gastos,
    utilidad,
  };
}

// ===== Formatting helpers =====
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRate(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}
