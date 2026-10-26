import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#E23744", "#3B82F6", "#F59E0B", "#22C55E", "#8B5CF6"];

const ChartComponent = ({ data, title }) => (
  <div className="glass-card" style={{ marginBottom: "1.25rem", overflow: "hidden" }}>
    <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
      <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{title}</h4>
    </div>
    <div style={{ padding: "1.25rem", display: "flex", justifyContent: "center" }}>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            paddingAngle={5}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `₹${value.toFixed(2)}`}
            contentStyle={{ 
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '16px',
              overflowY: 'auto',
              maxHeight: '80px',
              color: 'var(--text-secondary)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChartComponent;
