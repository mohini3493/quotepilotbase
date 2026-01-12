import { Card, CardContent } from "@/components/ui/card";

type Breakdown = {
  label: string;
  amount: number;
};

export default function QuoteResult({
  total,
  currency,
  breakdown,
}: {
  total: number;
  currency: string;
  breakdown: Breakdown[];
}) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="p-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Price</p>
          <h2 className="text-3xl font-semibold">
            {currency} {total}
          </h2>
        </div>

        <div className="border-t pt-4 space-y-2">
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span>
                {currency} {item.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
