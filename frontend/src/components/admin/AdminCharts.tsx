import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface Props {
  pending: number;
  approved: number;
  rejected: number;
}

function AdminCharts({
  pending,
  approved,
  rejected,
}: Props) {

  const pieData = [
    {
      name: "Pending",
      value: pending,
    },
    {
      name: "Approved",
      value: approved,
    },
    {
      name: "Rejected",
      value: rejected,
    },
  ];

  const COLORS = [
    "#facc15",
    "#22c55e",
    "#ef4444",
  ];

  const barData = [
    {
      status: "Pending",
      incidents: pending,
    },
    {
      status: "Approved",
      incidents: approved,
    },
    {
      status: "Rejected",
      incidents: rejected,
    },
  ];

  return (

    <div className="grid md:grid-cols-2 gap-8 mb-10">

      {/* Pie Chart */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-5 text-center">

          Incident Status

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >

              {pieData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Bar Chart */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-5 text-center">

          Incident Overview

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={barData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="status" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="incidents"
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default AdminCharts;