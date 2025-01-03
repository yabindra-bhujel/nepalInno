import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import instance from "../../config/instance";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  };


  const saveGoogleUserData = async(credentialResponse: any) => {
    const response = await instance.post("user/google-auth", {
     credentialResponse,
    });

    if (response.status === 201) {
     navigate("/");
    }
  };


  return (
    <div className="bg-gray-100 text-gray-800 flex items-center justify-center min-h-screen py-6 px-4">
      <div className="relative w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Welcome Back
        </h1>
        <div className="relative w-full transition-transform duration-500">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <a href="/register" className="text-sm text-blue-500 hover:underline">
            Don't have an account? Register here
          </a>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* OR separator and Google login */}
        <div className="my-4 flex items-center justify-center text-sm text-gray-500">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="text-center">
          <GoogleLogin
            size="large"
            width={400}
            onSuccess={(credentialResponse) => {
              saveGoogleUserData(credentialResponse);
            }}
            onError={() => {
            }}
            auto_select={true}
          />
        </div>
      </div>
      <div className="absolute right-0 bottom-0 px-4 py-2 text-sm text-gray-700">
        &copy; {currentYear} My Company. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
