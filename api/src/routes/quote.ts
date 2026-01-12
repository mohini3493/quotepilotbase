import express from "express";
import { runRuleEngine } from "../engine/ruleEngine";
import rules from "../rules";
import { Request, Response } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: "Answers required" });
  }

  const basePrice = 100;

  const result = runRuleEngine(rules, answers, basePrice);

  return res.json({
    success: true,
    quote: {
      totalPrice: result.total,
      currency: "GBP",
      breakdown: result.breakdown,
    },
  });
});

export default router;
