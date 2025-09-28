import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const RatingChart = ({ userId }) => {
  const [history,    setHistory]    = useState([]);    
  const [currentRank,setCurrentRank]= useState(null);
  const [totalUsers, setTotalUsers] = useState(1);


  const formatMonth = (ym) => {
    const [year, month] = ym.split("-");
    const d = new Date(year, month - 1);
    return d.toLocaleString("default", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const hist = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/monthly-ranks`
        );
        if (hist.data.success) {
          setHistory(
            hist.data.monthlyRanks.map((e) => ({
              date: e.month,
              rank: e.rank,
              fullDate: formatMonth(e.month),
            }))
          );
          setTotalUsers(hist.data.totalUsers);
        }

        const now = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/current-rank`
        );
        if (now.data.success) {
          setCurrentRank(now.data.rank);
        }
      } catch (err) {
        console.error("RatingChart load error:", err);
      }
    };

    if (userId) load();
  }, [userId]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { fullDate, rank } = payload[0].payload;
      return (
        <div className="rounded-lg bg-muted p-4 shadow-xl border border-border text-sm text-muted-foreground">
          <div className="font-semibold text-foreground">{fullDate}</div>
          <div className="text-primary">Rank: #{rank}</div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = ({ cx, cy }) => (
    <circle
      cx={cx}
      cy={cy}
      r="3"
      fill="hsl(var(--primary))"
      stroke="hsl(var(--background))"
      strokeWidth="1"
      className="transition-all"
    />
  );

  const minRank = history.length
    ? Math.min(...history.map((d) => d.rank)) - 5
    : 1;
  const maxRank = totalUsers;

  return (
    <Card className="bg-dark-card border border-[#1f2937] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-white">
          <TrendingUp className="w-5 h-5 mr-2 text-primary text-white" />
          Ranking Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-2xl font-bold text-white">
          Global Rank: #{currentRank ?? "—"}
        </div>

        <div className="h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={history}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="date"
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                label={{
                  value: "Months",
                  position: "insideBottom",
                  offset: -10,
                  style: { textAnchor: "middle", fill: "#9CA3AF", fontSize: 12 },
                }}
              />
              <YAxis
                domain={[maxRank, minRank]}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                label={{
                  value: "Rank",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#9CA3AF", fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rank"
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={<CustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>

          {history.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-gray-500">No Data Available</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingChart;
