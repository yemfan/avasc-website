export function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="rounded-xl border border-white/[0.08] bg-[var(--avasc-bg-card)]/70 px-4 py-3 backdrop-blur-sm transition hover:border-white/[0.12]">
      <summary className="block cursor-pointer list-none text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
        {question}
      </summary>
      <p className="mt-2 block text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{answer}</p>
    </details>
  );
}
