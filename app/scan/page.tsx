import Link from "next/link";
import Image from "next/image";
import ScanWorkbench from "@/components/ScanWorkbench";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Pantheon Precision Health"
              width={2400}
              height={820}
              priority
              className="h-9 md:h-10 w-auto"
            />
          </Link>
          <span className="font-mono text-[11px] tracking-widest2 uppercase text-stone">Scan</span>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <p className="font-mono text-[11px] tracking-widest2 uppercase text-clinical-600 mb-3">
          Skin condition screening
        </p>
        <h1 className="font-display text-4xl mb-3">Analyze a photo</h1>
        <p className="text-stone text-sm max-w-lg mb-10 leading-relaxed">
          Use even, natural lighting and fill the frame with the area of concern. Avoid shadows,
          filters, or heavy zoom for the most reliable result.
        </p>
        <ScanWorkbench />
      </section>
    </main>
  );
}
