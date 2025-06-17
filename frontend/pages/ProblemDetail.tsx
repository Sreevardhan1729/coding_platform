import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/Editor";
import { getProblem, submit } from "../src/api";

export default function ProblemDetail() {
  const { slug } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState("# your code here");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    getProblem(slug!).then((r) => setProblem(r.data));
  }, [slug]);

  const handleSubmit = async () => {
    const res = await submit({ problem_slug: slug!, language: "python", code });
    setResults(res.data);
  };

  if (!problem) return null;

  const visibleSamples = (problem.samples ?? []).filter(
    (s: any) => !s.hidden
  );

  return (
    <div className="min-h-screen text-white p-6">
      <div className="mx-auto flex flex-col md:flex-row gap-8 max-w-7xl">
        {/* ── Left column ───────────────────────────────────────────── */}
        <section className="md:w-1/2 space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold">{problem.title}</h2>

          {/* Description */}
          <pre className="whitespace-pre-wrap text-sm rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
            {problem.description}
          </pre>

          {/* Constraints */}
          {problem.constraints && (
            <div>
              <h3 className="font-semibold mb-1">Constraints</h3>
              <pre className="whitespace-pre-wrap text-xs rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                {problem.constraints}
              </pre>
            </div>
          )}

          {/* Samples */}
          {visibleSamples.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sample&nbsp;Cases</h3>
              <div className="space-y-3">
                {visibleSamples.map((s: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-xs"
                  >
                    <p className="mb-1 font-medium">Input</p>
                    <pre className="whitespace-pre-wrap">{s.input_data}</pre>

                    <p className="mt-2 mb-1 font-medium">Expected Output</p>
                    <pre className="whitespace-pre-wrap">
                      {s.expected_output}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Right column ──────────────────────────────────────────── */}
        <section className="md:flex-1 flex flex-col gap-4">
          <CodeEditor
            language="python"
            code={code}
            onChange={setCode}
            height="60vh"
            className="flex-1"
          />

          <button
            onClick={handleSubmit}
            className="self-start px-4 py-2 rounded-full font-medium
                       bg-blue-600 text-white hover:bg-blue-700
                       dark:bg-white dark:text-blue-600 dark:hover:bg-gray-100
                       transition-colors"
          >
            Run&nbsp;&amp;&nbsp;Submit
          </button>

          {results && (
            <div className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="font-semibold">
                Verdict:&nbsp;
                <span
                  className={
                    results.verdict === "Accepted"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }
                >
                  {results.verdict}
                </span>
              </p>

              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(results.results, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
