import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


export default function Home() {

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-black">
        SmartStub Admin
      </h1>
      <p className="mt-2 text-black/60">Use the navigation menu on the left to
        access the reports</p>
    </div>
  );
}
