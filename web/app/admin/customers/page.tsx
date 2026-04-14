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
  doorType?: string;
  panelStyle?: string;
  dimension?: string;
  postcode?: string;
  externalColor?: string;
  internalColor?: string;
  handleColor?: string;
  created_at: string;
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
        const response = await fetch(`/api/customers`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Map backend snake_case fields to camelCase for UI
          const toCamel = (obj: any) => ({
            ...obj,
            productId: obj.product_id,
            productTitle: obj.product_title,
            doorType: obj.door_type,
            panelStyle: obj.panel_style,
            dimension: obj.dimension,
            postcode: obj.postcode,
            externalColor: obj.external_color,
            internalColor: obj.internal_color,
            handleColor: obj.handle_color,
            created_at: obj.created_at,
          });
          const arr = Array.isArray(data) ? data : data.data || [];
          setCustomers(arr.map(toCamel));
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-4 py-2 whitespace-nowrap font-medium">
                    {customer.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {customer.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {customer.phone}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">
                    {customer.created_at &&
                      new Date(customer.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(customer);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                            {selectedCustomer.created_at &&
                              new Date(
                                selectedCustomer.created_at,
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
                      {selectedCustomer.doorType && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Product Type
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.doorType}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.panelStyle && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Panel Style
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.panelStyle}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.dimension && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Dimensions
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.dimension}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.postcode && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Postcode
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.postcode}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.externalColor && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            External Color
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.externalColor}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.internalColor && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Internal Color
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.internalColor}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.handleColor && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase">
                            Handle Color
                          </p>
                          <p className="font-medium text-sm">
                            {selectedCustomer.handleColor}
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
