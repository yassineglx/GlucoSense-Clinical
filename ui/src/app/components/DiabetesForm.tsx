"use client";

import { useState } from "react";
import type { DiabetesFormInput, PredictionResult } from "../types";
import ResultsPanel from "./ResultsPanel";

// ── Validation ─────────────────────────────────────────────────────────────────
function validate(values: DiabetesFormInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.Age < 1 || values.Age > 120) errors.Age = "Valid age 1-120.";
  if (values.BMI <= 0 || values.BMI > 80) errors.BMI = "Valid BMI 0-80.";
  if (values.Glucose < 0 || values.Glucose > 600) errors.Glucose = "Valid glucose 0-600.";
  if (values.Pregnancies < 0 || values.Pregnancies > 20) errors.Pregnancies = "Valid pregnancies 0-20.";
  if (values.BloodPressure < 0 || values.BloodPressure > 200) errors.BloodPressure = "Valid BP 0-200.";
  if (values.SkinThickness < 0 || values.SkinThickness > 100) errors.SkinThickness = "Valid skin thickness 0-100.";
  if (values.Insulin < 0 || values.Insulin > 1000) errors.Insulin = "Valid insulin 0-1000.";
  if (values.DiabetesPedigreeFunction < 0 || values.DiabetesPedigreeFunction > 3) errors.DiabetesPedigreeFunction = "Valid DPF 0-3.";
  return errors;
}

const INITIAL: DiabetesFormInput = {
  Pregnancies: 0,
  Glucose: 120,
  BloodPressure: 70,
  SkinThickness: 20,
  Insulin: 79,
  BMI: 25,
  DiabetesPedigreeFunction: 0.5,
  Age: 35
};

const CLINICAL_DEFINITIONS = {
  Pregnancies: "Number of times pregnant",
  Glucose: "Fasting plasma glucose (mg/dL) - Measures blood sugar levels after overnight fasting",
  BloodPressure: "Diastolic blood pressure (mm Hg) - Pressure in arteries between heartbeats",
  SkinThickness: "Triceps skin fold thickness (mm) - Measures body fat percentage",
  Insulin: "2-Hour serum insulin (μU/mL) - Insulin levels after glucose challenge",
  BMI: "Body Mass Index (kg/m²) - Weight relative to height",
  DiabetesPedigreeFunction: "Diabetes genetic risk score - Estimates familial diabetes risk",
  Age: "Age in years - Diabetes risk increases with age"
};

function Label({ children, tooltip }: { children: React.ReactNode, tooltip?: string }) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <label className="block text-sm font-medium text-slate-300">
        {children}
      </label>
      {tooltip && (
        <div className="group relative cursor-help text-slate-500 hover:text-sky-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-800 text-slate-200 text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-white/10">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-400 mt-1">{msg}</p>;
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-sky-400"
        />
        <div className="flex items-center gap-1.5 min-w-[72px]">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-16 rounded-lg px-2 py-1.5 text-sm text-center font-mono bg-white/5 border ${
              error ? "border-red-500/50" : "border-white/10"
            } text-slate-100 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-colors`}
          />
          {unit && <span className="text-xs text-slate-500">{unit}</span>}
        </div>
      </div>
      <ErrorMsg msg={error} />
    </div>
  );
}

export default function DiabetesForm() {
  const [values, setValues] = useState<DiabetesFormInput>(INITIAL);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<PredictionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // BMI Calculator specific state
  const [showBMICalc, setShowBMICalc] = useState(false);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const calculateBMI = () => {
    const hInMeters = height / 100;
    const calcBmi = weight / (hInMeters * hInMeters);
    set("BMI", parseFloat(calcBmi.toFixed(1)));
    setShowBMICalc(false);
  };

  const set = <K extends keyof DiabetesFormInput>(key: K, val: DiabetesFormInput[K]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      const newErrs = { ...errors };
      delete newErrs[key];
      setErrors(newErrs);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError(null);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Prediction failed.");
      setResult(json.data);
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl border border-white/8 p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6" style={{ fontFamily: "var(--font-display)" }}>
          Clinical Inputs
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <Label tooltip={CLINICAL_DEFINITIONS.Age}>Age (years)</Label>
            <NumberInput value={values.Age} onChange={(v) => set("Age", v)} min={1} max={120} unit="yrs" error={errors.Age} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-300">Body Mass Index (BMI)</label>
              <button type="button" onClick={() => setShowBMICalc(!showBMICalc)} className="text-xs text-sky-400 hover:text-sky-300 underline">
                Calculator
              </button>
            </div>
            
            {showBMICalc ? (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 mb-3 space-y-4 animate-fade-in">
                <div>
                  <label className="text-xs text-slate-400">Weight (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Height (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <button type="button" onClick={calculateBMI} className="w-full py-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-sm hover:bg-sky-500/30 transition-colors">
                  Apply BMI
                </button>
              </div>
            ) : (
              <NumberInput value={values.BMI} onChange={(v) => set("BMI", v)} min={10} max={60} step={0.1} unit="kg/m²" error={errors.BMI} />
            )}
          </div>

          <div>
            <Label tooltip={CLINICAL_DEFINITIONS.Glucose}>Glucose Level</Label>
            <NumberInput value={values.Glucose} onChange={(v) => set("Glucose", v)} min={0} max={300} unit="mg/dL" error={errors.Glucose} />
          </div>

          <div>
            <Label tooltip={CLINICAL_DEFINITIONS.BloodPressure}>Blood Pressure</Label>
            <NumberInput value={values.BloodPressure} onChange={(v) => set("BloodPressure", v)} min={0} max={150} unit="mmHg" error={errors.BloodPressure} />
          </div>

          <div>
            <Label tooltip={CLINICAL_DEFINITIONS.SkinThickness}>Skin Thickness</Label>
            <NumberInput value={values.SkinThickness} onChange={(v) => set("SkinThickness", v)} min={0} max={99} unit="mm" error={errors.SkinThickness} />
          </div>

          <div>
            <Label tooltip={CLINICAL_DEFINITIONS.Insulin}>Insulin</Label>
            <NumberInput value={values.Insulin} onChange={(v) => set("Insulin", v)} min={0} max={846} unit="μU/mL" error={errors.Insulin} />
          </div>

          <div>
            <Label tooltip={CLINICAL_DEFINITIONS.Pregnancies}>Pregnancies</Label>
            <NumberInput value={values.Pregnancies} onChange={(v) => set("Pregnancies", v)} min={0} max={17} error={errors.Pregnancies} />
          </div>

          <div>
            <Label tooltip={CLINICAL_DEFINITIONS.DiabetesPedigreeFunction}>Diabetes Pedigree Function</Label>
            <NumberInput value={values.DiabetesPedigreeFunction} onChange={(v) => set("DiabetesPedigreeFunction", v)} min={0.0} max={2.42} step={0.01} error={errors.DiabetesPedigreeFunction} />
          </div>

          {apiError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white transition-all duration-200 shadow-lg shadow-sky-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Analyzing..." : "Predict Diabetes Risk"}
          </button>
        </form>
      </div>

      <div id="result-section">
        {loading && (
          <div className="glass-card rounded-2xl border border-white/8 p-6 space-y-4">
            <div className="shimmer h-6 w-48 rounded-lg" />
            <div className="flex justify-center py-4">
              <div className="shimmer w-40 h-24 rounded-full" />
            </div>
            <div className="shimmer h-20 rounded-xl" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shimmer h-8 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {!loading && result && <ResultsPanel result={result} />}

        {!loading && !result && (
          <div className="glass-card rounded-2xl border border-white/8 p-8 flex flex-col items-center justify-center text-center min-h-[300px] gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
              🩺
            </div>
            <div>
              <p className="text-slate-300 font-medium mb-1">No assessment yet</p>
              <p className="text-sm text-slate-500">
                Fill in your clinical details and click <em>Predict Diabetes Risk</em> to see your personalized risk analysis powered by LightGBM.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
