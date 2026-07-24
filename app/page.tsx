import Link from "next/link";
import { ReticleCorners } from "@/components/Reticle";
import { DISEASES } from "@/lib/diseases";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <span className="font-display text-lg tracking-tight">Pantheon Precision Health</span>
          <Link
            href="/scan"
            className="font-mono text-[11px] tracking-widest2 uppercase border border-ink px-4 py-2 hover:bg-ink hover:text-white transition-colors"
          >
            Start a scan
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 grid md:grid-cols-[1.1fr,0.9fr] gap-14 items-center">
        <div>
          <p className="font-mono text-[11px] tracking-widest2 uppercase text-clinical-600 mb-5">
            Precision dermatologic screening
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-ink">
            Read the skin
            <br />
            <span className="italic">before it reads you.</span>
          </h1>
          <p className="text-stone text-base leading-relaxed mt-6 max-w-md">
            Photograph a lesion or rash and Pantheon's classification model ranks the most likely
            conditions in seconds — with a clinical reference report you can bring to your
            dermatologist.
          </p>
          <div className="flex gap-3 mt-9">
            <Link
              href="/scan"
              className="px-6 py-3 bg-ink text-white font-mono text-xs tracking-widest2 uppercase hover:bg-clinical-600 transition-colors"
            >
              Analyze a photo
            </Link>
            <a
              href="#coverage"
              className="px-6 py-3 border border-line text-stone font-mono text-xs tracking-widest2 uppercase hover:border-ink hover:text-ink transition-colors"
            >
              View coverage
            </a>
          </div>
        </div>

        <div className="reticle relative border border-line aspect-square bg-mist overflow-hidden">
          <ReticleCorners />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-24 h-24 rounded-full border border-clinical-300" />
            <p className="font-mono text-[10px] tracking-widest2 uppercase text-stone">
              Awaiting sample
            </p>
          </div>
          <div className="scan-sweep" />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line bg-mist">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-3 gap-10">
          {[
            {
              step: "01",
              title: "Capture",
              body: "Upload a photo or use your camera to photograph the area of concern in good lighting."
            },
            {
              step: "02",
              title: "Classify",
              body: "Our model ranks the most probable conditions from a clinically curated set of skin diseases."
            },
            {
              step: "03",
              title: "Reference",
              body: "Download a PDF report with condition details and treatment recommendations to discuss with a clinician."
            }
          ].map((s) => (
            <div key={s.step}>
              <p className="font-mono text-xs text-clinical-600 mb-3">{s.step}</p>
              <h3 className="font-display text-2xl mb-2">{s.title}</h3>
              <p className="text-sm text-stone leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <p className="font-mono text-[11px] tracking-widest2 uppercase text-clinical-600 mb-3">Coverage</p>
        <h2 className="font-display text-3xl mb-8">Conditions in the current model</h2>
        <div className="tick-row grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-0 border-t border-line pt-2">
          {DISEASES.map((d) => (
            <div key={d.id} className="flex items-center justify-between py-3 border-b border-line">
              <span className="text-sm text-ink">{d.name}</span>
              <span className="font-mono text-[10px] text-stone uppercase">{d.category.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between gap-4">
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-stone">
            Pantheon Precision Health — Informational screening, not a diagnosis.
          </p>
          <p className="text-xs text-stone max-w-lg">
            Always consult a licensed dermatologist or physician for evaluation and treatment of any
            skin condition.
          </p>
        </div>
      </footer>
    </main>
  );
}
