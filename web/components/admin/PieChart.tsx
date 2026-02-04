import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ data, options }: { data: any; options?: any }) {
  return <Pie data={data} options={options} />;
}
