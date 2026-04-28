import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const user=useSelector(state => state.auth.user)
  const loading=useSelector(state => state.auth.loading)
  const {handleLogin}=useAuth()
  const navigate=useNavigate()
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =async (event) => {
    event.preventDefault();
    console.log("Login submitted", formData);
    await handleLogin(formData)
    navigate("/")
    // TODO: connect to auth API
  };

  if(!loading && user){
    return <Navigate to='/' replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm bg-black-500   border border-[#31b8c6] shadow-2xl rounded-3xl p-6 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#31b8c6] mb-2">Login</p>
          <h1 className="text-2xl font-semibold text-[#31b8c6]">Sign in to your account</h1>
          <p className="mt-2 text-sm text-[#31b8c6]">Enter your email and password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#31b8c6] mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#31b8c6] bg-black px-3 py-2 text-sm text-[#31b8c6] outline-none transition focus:border-[#31b8c6] focus:ring-4 focus:ring-[#31b8c6]/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#31b8c6] mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#31b8c6] bg-black px-3 py-2 text-sm text-[#31b8c6] outline-none transition focus:border-[#31b8c6] focus:ring-4 focus:ring-[#31b8c6]/20"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#31b8c6] px-4 py-2 text-white text-sm font-semibold shadow-lg shadow-[#31b8c6]/30 transition hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Sign In
          </button>
        </form>
        <p className="text-center">Don't have an account? <Link to="/register" className="text-[#31b8c6]">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
