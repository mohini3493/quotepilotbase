"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Eye, Mail, Phone, User, Calendar } from "lucide-react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  productId?: number;
  productTitle?: string;
  doorTypeName?: string;
  panelStyleName?: string;
  dimensionName?: string;
  postcodeCode?: string;
  postcodeArea?: string;
  externalColorName?: string;
  internalColorName?: string;
  handleColorName?: string;
  createdAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch(
          `/api/customers`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setCustomers(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            View all customer quote submissions
          </p>
        </div>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No customers yet</h3>
            <p className="text-muted-foreground text-center mt-2">
              Customer submissions will appear here when users request quotes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* Customer List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <Card
                key={customer.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {customer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  {customer.productTitle && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium">
                        Product: {customer.productTitle}
                      </p>
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customer Detail Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Customer Details</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCustomer(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{selectedCustomer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">
                            {selectedCustomer.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">
                            {selectedCustomer.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Submitted
                          </p>
                          <p className="font-medium">
                            {new Date(
                              selectedCustomer.createdAt,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      Configuration
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedCustomer.productTitle && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Product
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.productTitle}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.doorTypeName && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Door Type
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.doorTypeName}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.panelStyleName && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Panel Style
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.panelStyleName}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.dimensionName && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Dimensions
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.dimensionName}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.postcodeCode && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Postcode
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.postcodeCode}
                            {selectedCustomer.postcodeArea &&
                              ` - ${selectedCustomer.postcodeArea}`}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.externalColorName && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            External Color
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.externalColorName}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.internalColorName && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Internal Color
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.internalColorName}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.handleColorName && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Handle Color
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.handleColorName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setSelectedCustomer(null)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
