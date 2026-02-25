import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AttendanceData {
  subject: string;
  present: number;
  absent: number;
  tardy: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  title?: string;
  delay?: number;
}

export function AttendanceChart({ data, title = "Attendance per Class", delay = 0 }: AttendanceChartProps) {
  const colors = {
    present: "hsl(142, 76%, 36%)",
    absent: "hsl(0, 72%, 51%)",
    tardy: "hsl(38, 92%, 50%)",
  };

  return (
    <GlassCard delay={delay} className="p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 10%)",
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
            />
            <Bar dataKey="present" stackId="a" radius={[0, 0, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`present-${index}`} fill={colors.present} />
              ))}
            </Bar>
            <Bar dataKey="tardy" stackId="a" radius={[0, 0, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`tardy-${index}`} fill={colors.tardy} />
              ))}
            </Bar>
            <Bar dataKey="absent" stackId="a" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`absent-${index}`} fill={colors.absent} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.present }} />
          <span className="text-sm text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.tardy }} />
          <span className="text-sm text-muted-foreground">Tardy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.absent }} />
          <span className="text-sm text-muted-foreground">Absent</span>
        </div>
      </div>
    </GlassCard>
  );
}
