import { Users, Briefcase, DollarSign, Clock } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const projectData = [
  { name: "Mon", projects: 2, revenue: 500 },
  { name: "Tue", projects: 3, revenue: 700 },
  { name: "Wed", projects: 4, revenue: 1200 },
  { name: "Thu", projects: 1, revenue: 300 },
  { name: "Fri", projects: 5, revenue: 1500 },
  { name: "Sat", projects: 2, revenue: 800 },
  { name: "Sun", projects: 3, revenue: 950 },
];

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 bg-gray-100 min-h-screen">
      {/* KPI Cards */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <Briefcase className="h-6 w-6 text-blue-500" />
        </div>
        <p className="mt-2 text-2xl font-bold">12</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Clients</h2>
          <Users className="h-6 w-6 text-green-500" />
        </div>
        <p className="mt-2 text-2xl font-bold">28</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Monthly Revenue</h2>
          <DollarSign className="h-6 w-6 text-purple-500" />
        </div>
        <p className="mt-2 text-2xl font-bold">$45,200</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
          <Clock className="h-6 w-6 text-red-500" />
        </div>
        <p className="mt-2 text-2xl font-bold">5</p>
      </div>

      {/* Charts */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Weekly Performance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={projectData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="projects" stroke="#3b82f6" />
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          <li className="p-2 border rounded-lg">🚀 New project <strong>Website Redesign</strong> started</li>
          <li className="p-2 border rounded-lg">🤝 New client <strong>Acme Corp</strong> onboarded</li>
          <li className="p-2 border rounded-lg">✅ Milestone "Mobile App Beta" completed</li>
          <li className="p-2 border rounded-lg">💰 Invoice #4567 generated</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Add Project</button>
          <button className="px-4 py-2 border rounded-lg shadow hover:bg-gray-100">Add Client</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">Generate Invoice</button>
        </div>
      </div>
    </div>
  );
}
