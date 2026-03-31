export function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <summary className="block cursor-pointer list-none text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        {question}
      </summary>
      <p className="mt-2 block text-sm leading-relaxed text-slate-600">{answer}</p>
    </details>
  );
}
