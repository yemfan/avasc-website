export function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{question}</summary>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 group-open:block">{answer}</p>
    </details>
  );
}
