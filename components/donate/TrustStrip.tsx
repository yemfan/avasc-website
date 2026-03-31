type TrustStripProps = {
  items: string[];
};

export function TrustStrip({ items }: TrustStripProps) {
  return (
    <section className="border-b bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-8">
        {items.map((item) => (
          <div key={item} className="text-center">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
