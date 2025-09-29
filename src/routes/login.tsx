import React, { useState } from "react";
import { saveAuthToken } from "../services/fetchWrapper";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://mood-inventory-api-4gec.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid Credentials");
      }
      const data = await response.json();
      const token = data.token;

      saveAuthToken(token);
      setMessage("Login success");

      setEmail("");
      setPassword("");

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-5 flex flex-row">
      <div className=" hidden w-[55%] h-[95vh] md:flex items-center justify-center bg-light-beige rounded-2xl">
        <img src="/images/logo.png" className="w-100 h-100" alt="" />
      </div>
      <div className=" flex justify-center flex-col w-[45%] p-20 gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl">Welcome</h1>
          <p className="text-light-gray text-sm">Please login here</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6 flex flex-col">
          {message && (
            <div
              className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
                message.toLowerCase().includes("success")
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {message}
            </div>
          )}
          <div className="relative border border-light-beige rounded-lg transition-all duration-300">
            <label
              htmlFor="email"
              className={`absolute left-4 pointer-events-none transition-all duration-300
                         ${
                           email
                             ? "top-0 -translate-y-1/2 text-xs text-light-beige bg-white px-1"
                             : "top-1/2 -translate-y-1/2 text-light-gray"
                         }`}
            >
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 pt-4 bg-transparent rounded-lg focus:outline-none"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="relative border border-light-beige rounded-lg transition-all duration-300">
            <label
              htmlFor="password"
              className={`absolute left-4 pointer-events-none transition-all duration-300
                         ${
                           password
                             ? "top-0 -translate-y-1/2 text-xs text-light-beige bg-white px-1"
                             : "top-1/2 -translate-y-1/2 text-light-gray"
                         }`}
            >
              Password
            </label>
            <input
              className="w-full px-4 py-2 pt-4 pr-10 bg-transparent rounded-lg focus:outline-none"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-light-beige text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-300 transform hover:scale-[1.005] disabled:opacity-50"
            >
              {" "}
              {loading ? "Logging..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
