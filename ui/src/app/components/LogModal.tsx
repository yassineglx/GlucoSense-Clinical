"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Scale, HeartPulse, FileText } from "lucide-react";

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LogModal({ isOpen, onClose, onSuccess }: LogModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    glucose: "",
    weight: "",
    bloodPressure: "",
    notes: "",
  });

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ glucose: "", weight: "", bloodPressure: "", notes: "" });
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to save log");
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(2, 6, 23, 0.85)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 9998,
            }}
          />

          {/* Modal container — uses flexbox centering instead of translate */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "16px",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "28rem",
                maxHeight: "calc(100vh - 32px)",
                overflowY: "auto",
                pointerEvents: "auto",
                backgroundColor: "#0f172a",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                borderRadius: "1rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 60px rgba(56, 189, 248, 0.08)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    margin: 0,
                  }}
                >
                  <Activity style={{ width: 20, height: 20, color: "#60a5fa" }} />
                  Log Daily Metrics
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    color: "#94a3b8",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.35rem",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f1f5f9";
                    e.currentTarget.style.background = "rgba(148,163,184,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {error && (
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                        fontSize: "0.875rem",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Glucose */}
                  <div>
                    <label style={labelStyle}>
                      <Activity style={{ width: 16, height: 16, color: "#60a5fa" }} />
                      Glucose (mg/dL)
                    </label>
                    <input
                      type="number"
                      name="glucose"
                      value={formData.glucose}
                      onChange={handleChange}
                      placeholder="e.g., 95"
                      style={inputStyle}
                      onFocus={onInputFocus}
                      onBlur={onInputBlur}
                    />
                  </div>

                  {/* Weight & BP row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={labelStyle}>
                        <Scale style={{ width: 16, height: 16, color: "#c084fc" }} />
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="e.g., 70.5"
                        style={inputStyle}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        <HeartPulse style={{ width: 16, height: 16, color: "#fb7185" }} />
                        BP (mmHg)
                      </label>
                      <input
                        type="number"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        placeholder="e.g., 80"
                        style={inputStyle}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={labelStyle}>
                      <FileText style={{ width: 16, height: 16, color: "#34d399" }} />
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="How are you feeling today?"
                      rows={3}
                      style={{
                        ...inputStyle,
                        resize: "none",
                      }}
                      onFocus={onInputFocus as any}
                      onBlur={onInputBlur as any}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={onClose}
                      style={{
                        flex: 1,
                        padding: "0.7rem 1rem",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(148,163,184,0.2)",
                        background: "transparent",
                        color: "#cbd5e1",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(148,163,184,0.08)";
                        e.currentTarget.style.color = "#f1f5f9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#cbd5e1";
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "0.7rem 1rem",
                        borderRadius: "0.75rem",
                        border: "none",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                        boxShadow: "0 0 24px rgba(59,130,246,0.3)",
                        transition: "all 0.15s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {loading ? (
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.6s linear infinite",
                          }}
                        />
                      ) : (
                        "Save Log"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Spinner keyframe (injected once) */}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );

  // Use a portal to render at <body> level, bypassing any parent transforms
  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

/* ── Shared styles ── */

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  fontSize: "0.82rem",
  fontWeight: 500,
  color: "#94a3b8",
  marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "rgba(2, 6, 23, 0.6)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  borderRadius: "0.75rem",
  padding: "0.65rem 0.9rem",
  color: "#f1f5f9",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  fontFamily: "inherit",
};

const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
};

const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "rgba(148,163,184,0.12)";
  e.currentTarget.style.boxShadow = "none";
};
