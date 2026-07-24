"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { ReticleCorners } from "./Reticle";
import { findDisease, URGENCY_LABEL, URGENCY_COLOR, DiseaseInfo } from "@/lib/diseases";

interface ApiPrediction {
  label: string;
  confidence: number;
  matched: boolean;
  diseaseId: string | null;
}

type Stage = "capture" | "preview" | "analyzing" | "results" | "error";

export default function ScanWorkbench() {
  const [stage, setStage] = useState<Stage>("capture");
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<ApiPrediction[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const reset = useCallback(() => {
    setStage("capture");
    setImageDataUrl(null);
    setFile(null);
    setPredictions([]);
    setErrorMsg("");
  }, []);

  function onFileChosen(f: File) {
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setStage("preview");
    };
    reader.readAsDataURL(f);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFileChosen(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChosen(f);
  }

  function capturePhoto() {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    setImageDataUrl(screenshot);
    fetch(screenshot)
      .then((r) => r.blob())
      .then((blob) => {
        setFile(new File([blob], "capture.jpg", { type: "image/jpeg" }));
        setStage("preview");
      });
  }

  async function runAnalysis() {
    if (!file) return;
    setStage("analyzing");
    setErrorMsg("");

    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Analysis failed.");
      }
      if (!json.hasResults) {
        throw new Error("The model didn't return a readable result for this image. Try a clearer, well-lit photo.");
      }

      setPredictions(json.predictions);
      setStage("results");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  }

  async function downloadReport(pred: ApiPrediction) {
    const disease = pred.diseaseId ? findDisease(pred.diseaseId) : findDisease(pred.label);
    if (!disease) return;
    setDownloadingId(disease.id);

    try {
      const others = predictions
        .filter((p) => p.label !== pred.label)
        .map((p) => ({ label: p.label, confidence: p.confidence }));

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diseaseId: disease.id,
          confidence: pred.confidence,
          otherPredictions: others,
          imageDataUrl: imageDataUrl ?? undefined
        })
      });

      if (!res.ok) throw new Error("Report generation failed.");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pantheon-report-${disease.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMsg("Could not generate the PDF report. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {(stage === "capture" || stage === "preview") && (
        <div className="mb-6 flex gap-2 font-mono text-[11px] tracking-widest2 uppercase">
          <button
            onClick={() => {
              reset();
              setMode("upload");
            }}
            className={`px-4 py-2 border ${
              mode === "upload" ? "border-ink bg-ink text-white" : "border-line text-stone"
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => {
              reset();
              setMode("camera");
            }}
            className={`px-4 py-2 border ${
              mode === "camera" ? "border-ink bg-ink text-white" : "border-line text-stone"
            }`}
          >
            Camera
          </button>
        </div>
      )}

      {stage === "capture" && mode === "upload" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="reticle relative border border-line bg-mist aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:border-clinical-500 transition-colors"
        >
          <ReticleCorners />
          <p className="font-display text-xl italic text-ink">Drop a photo here</p>
          <p className="font-mono text-xs text-stone mt-2 tracking-wide">or click to browse — JPG, PNG, up to 8MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}

      {stage === "capture" && mode === "camera" && (
        <div className="reticle relative border border-line bg-ink aspect-[4/3] overflow-hidden">
          <ReticleCorners />
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full h-full object-cover"
          />
          <button
            onClick={capturePhoto}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-white text-ink font-mono text-xs tracking-widest2 uppercase border border-white hover:bg-clinical-500 hover:text-white hover:border-clinical-500 transition-colors"
          >
            Capture
          </button>
        </div>
      )}

      {stage === "preview" && imageDataUrl && (
        <div>
          <div className="reticle relative border border-line aspect-[4/3] overflow-hidden bg-mist">
            <ReticleCorners />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageDataUrl} alt="Selected skin area" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={runAnalysis}
              className="flex-1 py-3 bg-ink text-white font-mono text-xs tracking-widest2 uppercase hover:bg-clinical-600 transition-colors"
            >
              Run analysis
            </button>
            <button
              onClick={reset}
              className="px-5 py-3 border border-line text-stone font-mono text-xs tracking-widest2 uppercase hover:border-ink hover:text-ink transition-colors"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {stage === "analyzing" && imageDataUrl && (
        <div className="reticle relative border border-line aspect-[4/3] overflow-hidden bg-mist">
          <ReticleCorners />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageDataUrl} alt="Analyzing" className="w-full h-full object-contain opacity-60" />
          <div className="scan-sweep" />
          <div className="absolute inset-x-0 bottom-6 text-center">
            <p className="font-mono text-xs tracking-widest2 uppercase text-ink bg-white/90 inline-block px-4 py-2">
              Running inference…
            </p>
          </div>
        </div>
      )}

      {stage === "error" && (
        <div className="border border-signal-red/40 bg-[#FBEEEE] p-6">
          <p className="font-mono text-xs tracking-widest2 uppercase text-signal-red mb-2">Analysis failed</p>
          <p className="text-ink text-sm mb-4">{errorMsg}</p>
          <button
            onClick={reset}
            className="px-5 py-2.5 border border-ink text-ink font-mono text-xs tracking-widest2 uppercase hover:bg-ink hover:text-white transition-colors"
          >
            Start over
          </button>
        </div>
      )}

      {stage === "results" && (
        <div>
          {imageDataUrl && (
            <div className="reticle relative border border-line aspect-[4/3] overflow-hidden bg-mist mb-8">
              <ReticleCorners />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageDataUrl} alt="Analyzed skin area" className="w-full h-full object-contain" />
            </div>
          )}

          <p className="font-mono text-xs tracking-widest2 uppercase text-stone mb-4">
            {predictions.length} possible match{predictions.length !== 1 ? "es" : ""}, ranked by confidence
          </p>

          <div className="space-y-4">
            {predictions.map((p, i) => {
              const disease = p.diseaseId ? findDisease(p.diseaseId) : findDisease(p.label);
              return (
                <PredictionCard
                  key={i}
                  rank={i + 1}
                  label={p.label}
                  confidence={p.confidence}
                  disease={disease}
                  onDownload={() => downloadReport(p)}
                  downloading={downloadingId === (disease?.id ?? p.label)}
                />
              );
            })}
          </div>

          <button
            onClick={reset}
            className="mt-8 px-5 py-2.5 border border-line text-stone font-mono text-xs tracking-widest2 uppercase hover:border-ink hover:text-ink transition-colors"
          >
            Analyze another photo
          </button>

          <div className="mt-10 border border-line bg-mist p-5">
            <p className="text-xs leading-relaxed text-stone">
              This screening is generated by an automated image classification model and is intended for
              informational purposes only. It is not a medical diagnosis. Please consult a licensed
              dermatologist or physician for evaluation of any skin concern, particularly anything new,
              changing, bleeding, or not healing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PredictionCard({
  rank,
  label,
  confidence,
  disease,
  onDownload,
  downloading
}: {
  rank: number;
  label: string;
  confidence: number;
  disease: DiseaseInfo | undefined;
  onDownload: () => void;
  downloading: boolean;
}) {
  return (
    <div className="border border-line p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 tick-row pb-4 mb-4 border-b border-line">
        <div>
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-stone">Match {rank.toString().padStart(2, "0")}</p>
          <h3 className="font-display text-2xl mt-1">{disease?.name ?? label}</h3>
          {disease && <p className="text-xs text-stone mt-1">{disease.category}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-stone">Confidence</p>
          <p className="font-mono text-xl text-ink">{(confidence * 100).toFixed(1)}%</p>
        </div>
      </div>

      {disease ? (
        <>
          <p className={`font-mono text-[10px] tracking-widest2 uppercase mb-3 ${URGENCY_COLOR[disease.urgency]}`}>
            {URGENCY_LABEL[disease.urgency]}
          </p>
          <p className="text-sm leading-relaxed text-ink mb-4">{disease.summary}</p>

          <details className="group mb-4">
            <summary className="cursor-pointer font-mono text-[11px] tracking-widest2 uppercase text-clinical-600 hover:text-clinical-700">
              View clinical details
            </summary>
            <div className="mt-4 grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest2 uppercase text-stone mb-2">Hallmarks</p>
                <ul className="space-y-1.5">
                  {disease.hallmarks.map((h, i) => (
                    <li key={i} className="text-sm text-ink flex gap-2">
                      <span className="text-clinical-500">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-widest2 uppercase text-stone mb-2">
                  Treatment recommendations
                </p>
                <ul className="space-y-1.5">
                  {disease.treatment.map((t, i) => (
                    <li key={i} className="text-sm text-ink flex gap-2">
                      <span className="text-clinical-500 font-mono text-xs">{i + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          <button
            onClick={onDownload}
            disabled={downloading}
            className="px-5 py-2.5 bg-clinical-600 text-white font-mono text-xs tracking-widest2 uppercase hover:bg-clinical-700 transition-colors disabled:opacity-50"
          >
            {downloading ? "Preparing PDF…" : "Download PDF report"}
          </button>
        </>
      ) : (
        <p className="text-sm text-stone">
          No clinical reference is on file for this label yet. Raw model output shown above.
        </p>
      )}
    </div>
  );
}
