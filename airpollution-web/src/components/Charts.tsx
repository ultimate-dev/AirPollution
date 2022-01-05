import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { ppmToData } from "./Map";

export default ({
  ppm,
  co_ppm,
  co2_ppm,
  alkol_ppm,
  aseton_ppm,
  ppm_chart = [],
  dht_chart = [],
}: any) => {
  let { color, title, desc } = ppmToData(ppm);
  return (
    <div className="relative w-full h-full p-10 flex flex-wrap">
      <div className="lg:w-1/3 w-full flex flex-col lg:h-full lg:pr-10 lg:pb-0 pb-20">
        <div className="relative w-full flex-1">
          <div className={"text-3xl font-bold text-center text-" + color}>
            {title}
          </div>
          <div className="text-gray-500 mt-5 border-t border-gray-200 pt-10">
            {desc}
          </div>
        </div>
        <div className="relative w-full h-60">
          <ResponsiveContainer>
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={[
                  { name: "Karbonmonoksit", value: co_ppm },
                  { name: "Karbondioksit", value: co2_ppm },
                  { name: "Alkol", value: alkol_ppm },
                  { name: "Aseton", value: aseton_ppm },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
                
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:w-2/3 w-full h-full lg:border-l border-gray-200">
        <div className="relative w-full h-1/2">
          <ResponsiveContainer>
            <AreaChart data={ppm_chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="bottom" margin={{top:15}}/>
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="ppm"
                stroke="#008DD5"
                activeDot={{ r: 8 }}
                
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="relative w-full h-1/2">
          <ResponsiveContainer>
            <LineChart data={dht_chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="bottom" />
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey="temp"
                stroke="#C82F33"
                activeDot={{ r: 8 }}
              />
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey="humi"
                stroke="#672E97"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
