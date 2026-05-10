// ─── Input shape sent from the form ───────────────────────────────────────────
export interface DiabetesFormInput {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

// ─── Result returned by the API ───────────────────────────────────────────────
export type RiskLevel = "very low" | "low" | "medium" | "high" | "very high";

export interface PredictionResult {
  prediction: number;
  probability: number;
  riskLevel: RiskLevel;
  explanation: string;
  recommendations: string[];
}

// ─── API response wrapper ──────────────────────────────────────────────────────
export interface ApiResponse {
  success: boolean;
  data?: PredictionResult;
  error?: string;
}
