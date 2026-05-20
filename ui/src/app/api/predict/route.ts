import { NextRequest, NextResponse } from "next/server";
import type { DiabetesFormInput, ApiResponse } from "@/app/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

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

    // Save to database
    // @ts-ignore
    const userId = session.user?.id as string;
    
    if (userId) {
      await prisma.assessment.create({
        data: {
          userId,
          pregnancies: body.Pregnancies,
          glucose: body.Glucose,
          bloodPressure: body.BloodPressure,
          skinThickness: body.SkinThickness,
          insulin: body.Insulin,
          bmi: body.BMI,
          diabetesPedigreeFunction: body.DiabetesPedigreeFunction,
          age: body.Age,
          prediction: result.prediction,
          probability: result.probability,
          riskLevel: result.riskLevel,
          explanation: result.explanation,
        }
      });
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "An internal error occurred communicating with the ML backend." },
      { status: 500 }
    );
  }
}
