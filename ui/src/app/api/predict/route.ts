import { NextRequest, NextResponse } from "next/server";
import type { DiabetesFormInput, ApiResponse } from "@/app/types";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json() as DiabetesFormInput;
    
    // Call FastAPI backend
    const apiRes = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      throw new Error("Backend API error");
    }

    const { prediction, probability } = await apiRes.json();

    // Map probability to risk level
    let riskLevel: "very low" | "low" | "medium" | "high" | "very high" = "medium";
    let explanation = "";
    let recommendations: string[] = [];

    if (probability < 0.2) {
      riskLevel = "very low";
      explanation = "Your risk is very low. Keep up healthy habits!";
      recommendations = [
        "Continue annual glucose screening",
        "Maintain a healthy BMI through balanced diet",
        "Engage in 150 mins/week of moderate exercise"
      ];
    } else if (probability < 0.4) {
      riskLevel = "low";
      explanation = "You have slightly elevated risk. Consider lifestyle improvements.";
      recommendations = [
        "Continue annual glucose screening",
        "Maintain BMI < 25 through balanced diet",
        "Reassess risk factors in 2-3 years"
      ];
    } else if (probability < 0.6) {
      riskLevel = "medium";
      explanation = "Moderate risk detected. We recommend preventive actions.";
      recommendations = [
        "Perform HbA1c test within 3 months",
        "Begin lifestyle modification program",
        "Monitor fasting glucose quarterly"
      ];
    } else if (probability < 0.8) {
      riskLevel = "high";
      explanation = "High risk identified. Medical consultation advised.";
      recommendations = [
        "Conduct comprehensive diabetes screening now",
        "Implement intensive lifestyle intervention",
        "Schedule follow-up in 1 month"
      ];
    } else {
      riskLevel = "very high";
      explanation = "Very high risk. Please consult a doctor soon.";
      recommendations = [
        "Refer to endocrinology specialist",
        "Begin pharmacotherapy if indicated",
        "Immediate lifestyle intervention required"
      ];
    }

    const result = {
      prediction,
      probability,
      riskLevel,
      explanation,
      recommendations
    };

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "An internal error occurred communicating with the ML backend." },
      { status: 500 }
    );
  }
}
