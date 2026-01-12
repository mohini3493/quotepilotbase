import QuoteForm from "@/components/quote/QuoteForm";
import QuoteResult from "@/components/quote/QuoteResult";

const quote = {
  totalPrice: 1250,
  currency: "GBP",

  breakdown: [120, 300, 200, 150, 480].map((amount, index) => ({
    label: `Service ${index + 1}`,
    amount,
  })),
};

export default function QuotePage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Get a Quote</h1>
      <QuoteForm />
      <QuoteResult
        total={quote.totalPrice}
        currency={quote.currency}
        breakdown={quote.breakdown}
      />
    </main>
  );
}
