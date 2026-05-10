# 🩺 GlucoSense – Diabetes Risk Predictor

A modern, full-stack Next.js web application that estimates diabetes mellitus risk using a clinically-grounded rule-based scoring system.

---

## 📁 Project Structure

```
diabetes-risk-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── predict/
│   │   │       └── route.ts          ← Next.js API route (prediction endpoint)
│   │   ├── components/
│   │   │   ├── DiabetesForm.tsx      ← Main form with validation
│   │   │   ├── ResultsPanel.tsx      ← Result display card
│   │   │   ├── RiskMeter.tsx         ← SVG arc gauge
│   │   │   └── ScoreBreakdown.tsx    ← Factor progress bars
│   │   ├── types/
│   │   │   └── index.ts              ← TypeScript interfaces
│   │   ├── globals.css               ← Global styles + Tailwind
│   │   ├── layout.tsx                ← Root layout
│   │   └── page.tsx                  ← Home page
│   └── lib/
│       └── predict.ts                ← Scoring engine (all prediction logic)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.17 ([download](https://nodejs.org))
- **npm** ≥ 9 (comes with Node.js)

### Step-by-step setup

```bash
# 1. Clone or unzip the project
cd diabetes-risk-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in your browser
# → http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

---

## 🧠 Scoring System Explained

The prediction uses a **rule-based point scoring system** — transparent, explainable, and grounded in clinical guidelines.

| Factor | Max Points | Rationale |
|---|---|---|
| **Blood Glucose** | 30 | Strongest predictor; uses ADA thresholds (normal <100, pre-diabetes 100–125, diabetes ≥126 mg/dL) |
| **BMI** | 25 | WHO obesity classification; obesity is the largest modifiable risk factor |
| **Age** | 20 | Risk rises sharply after 45; accounted in tiered steps |
| **Physical Activity** | 15 | Sedentary lifestyle compounds metabolic dysfunction |
| **Smoking** | 5 | Increases insulin resistance |
| **Alcohol** | 5 | Heavy use impairs glucose regulation |
| **TOTAL** | **100** | |

### Score → Probability conversion

Raw score is converted to probability using a **sigmoid (logistic) curve**:

```
normalized = score / 100
sigmoid    = 1 / (1 + e^(-10 × (normalized - 0.5)))
probability = 5 + sigmoid × 90   ← maps to 5%–95% range
```

This S-curve means:
- Very low scores → ~5–20%
- Borderline scores → ~30–60%
- High scores → ~75–95%

### Risk categories

| Probability | Risk Level |
|---|---|
| 0–39% | 🟢 Low |
| 40–64% | 🟡 Medium |
| 65–100% | 🔴 High |

---

## 🔌 API Reference

**`POST /api/predict`**

Request body:
```json
{
  "age": 45,
  "bmi": 28.5,
  "smokingStatus": "no",
  "alcoholConsumption": "moderate",
  "physicalActivityLevel": "low",
  "bloodGlucoseLevel": 118
}
```

Response:
```json
{
  "success": true,
  "data": {
    "riskProbability": 62,
    "riskLevel": "medium",
    "explanation": "Your inputs indicate a moderate risk...",
    "scoreBreakdown": [...],
    "totalScore": 47,
    "maxPossibleScore": 100
  }
}
```

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| API | Next.js Route Handlers |
| State | React useState (no external store needed) |

---

## ⚠️ Disclaimer

This application is for **educational and informational purposes only**. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.
