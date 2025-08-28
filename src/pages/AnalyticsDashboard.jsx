import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Active Students</h2>
            <p className="text-3xl font-bold">1,245</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Completed Courses</h2>
            <p className="text-3xl font-bold">320</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p className="text-3xl font-bold">$12,450</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
