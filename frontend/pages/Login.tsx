import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import  {api, login } from "../src/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(form);
      const { access, refresh } = res.data;

      // Persist tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Set token as default header for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Invalid credentials, please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-xl shadow"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Log In</h1>

        {error && (
          <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
        )}

        <label className="block mb-3">
          <span className="text-sm">Username</span>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Sign In
        </button>

        <p className="mt-4 text-xs text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
