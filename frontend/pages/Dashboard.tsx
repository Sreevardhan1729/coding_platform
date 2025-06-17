import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../src/api";

export default function Dashboard() {
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getProblems().then((r) => setProblems(r.data));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Problems</h1>
      <ul className="space-y-2">
        {problems.map((p) => (
          <li
            key={p.id}
            className="border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Link to={`/problems/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
