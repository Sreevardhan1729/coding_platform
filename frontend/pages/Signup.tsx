import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import  {api, register, login } from "../src//api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password
      });

      // Auto-login after successful registration
      const res = await login({
        username: form.username,
        password: form.password
      });
      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.username?.[0] ||
          err.response?.data?.email?.[0] ||
          "Registration failed."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-xl shadow"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign Up</h1>

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

        <label className="block mb-3">
          <span className="text-sm">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </label>

        <label className="block mb-3">
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

        <label className="block mb-6">
          <span className="text-sm">Confirm Password</span>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Create Account
        </button>

        <p className="mt-4 text-xs text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
