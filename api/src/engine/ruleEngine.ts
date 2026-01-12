interface Condition {
  field: string;
  operator: ">" | "<" | "==" | "!=" | "includes";
  value: any;
}

interface Action {
  type: "ADD" | "MULTIPLY" | "PERCENT";
  amount: number;
}

interface Rule {
  name: string;
  conditions: Condition[];
  actions: Action[];
}

interface BreakdownItem {
  label: string;
  amount: number;
}

interface RuleEngineResult {
  total: number;
  breakdown: BreakdownItem[];
}

function evaluateCondition(condition: Condition, answers: Record<string, any>): boolean {
  const userValue = answers[condition.field];
  const ruleValue = condition.value;

  switch (condition.operator) {
    case ">":
      return userValue > ruleValue;
    case "<":
      return userValue < ruleValue;
    case "==":
      return userValue == ruleValue;
    case "!=":
      return userValue != ruleValue;
    case "includes":
      return Array.isArray(userValue) && userValue.includes(ruleValue);
    default:
      return false;
  }
}

function applyAction(action: Action, currentTotal: number): number {
  switch (action.type) {
    case "ADD":
      return currentTotal + action.amount;
    case "MULTIPLY":
      return currentTotal * action.amount;
    case "PERCENT":
      return currentTotal + (currentTotal * action.amount) / 100;
    default:
      return currentTotal;
  }
}

export function runRuleEngine(rules: Rule[], answers: Record<string, any>, basePrice: number): RuleEngineResult {
  let total = basePrice;
  const breakdown: BreakdownItem[] = [{ label: "Base price", amount: basePrice }];

  for (const rule of rules) {
    const allConditionsMet = rule.conditions.every((condition) =>
      evaluateCondition(condition, answers)
    );

    if (allConditionsMet) {
      for (const action of rule.actions) {
        const before = total;
        total = applyAction(action, total);

        breakdown.push({
          label: rule.name,
          amount: total - before,
        });
      }
    }
  }

  return { total, breakdown };
}
