import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsDashboard() {
  // Sample Data
  const courseData = [
    { name: "React Basics", students: 120 },
    { name: "Node.js", students: 90 },
    { name: "Database", students: 75 },
    { name: "Data Science", students: 60 },
    { name: "AI/ML", students: 40 },
  ];

  const progressData = [
    { name: "Completed", value: 60 },
    { name: "In Progress", value: 30 },
    { name: "Not Started", value: 10 },
  ];

  const COLORS = ["#4CAF50", "#2196F3", "#FF9800"];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Active Students */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Active Students</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">350</p>
          <p className="text-sm text-gray-500">This Month</p>
        </CardContent>
      </Card>

      {/* Course Completion */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Course Completion</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">78%</p>
          <p className="text-sm text-gray-500">Across All Courses</p>
        </CardContent>
      </Card>

      {/* Avg Time Spent */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Avg Time Spent</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">2h 45m</p>
          <p className="text-sm text-gray-500">Per Student Daily</p>
        </CardContent>
      </Card>

      {/* Assignments Submitted */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Assignments Submitted</h2>
          <p className="text-3xl font-bold text-orange-600 mt-2">1,240</p>
          <p className="text-sm text-gray-500">This Month</p>
        </CardContent>
      </Card>

      {/* Top Courses Chart */}
      <Card className="shadow-lg rounded-2xl col-span-1 md:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Courses Viewed</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3b82f6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Student Progress Pie Chart */}
      <Card className="shadow-lg rounded-2xl col-span-1 md:col-span-1">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Student Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
