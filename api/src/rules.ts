export default [
  {
    name: "Large company surcharge",
    conditions: [{ field: "companySize", operator: ">" as const, value: 50 }],
    actions: [{ type: "ADD" as const, amount: 120 }],
  },
  {
    name: "Extra service",
    conditions: [
      { field: "extraService", operator: "==" as const, value: true },
    ],
    actions: [{ type: "ADD" as const, amount: 50 }],
  },
];
