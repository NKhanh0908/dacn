import { useState } from "react";
import { loginSuccess } from "../../store/authStore";
import { authLogin, getCurrentEmployee } from "../../services";
import BackgroundWaves from "../../components/BackgroundWaves";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await authLogin({ username, password });
      const profile = await getCurrentEmployee();

      loginSuccess({
        profile: profile.data,
        role: localStorage.getItem("role"),
      });

      window.location.replace("/");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Sai tài khoản hoặc mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <BackgroundWaves />
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 flex items-center justify-center px-4">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">

        {/* LEFT – LOGIN FORM */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <span className="inline-flex items-center gap-2 text-xs px-3 py-1 mb-6 rounded-full border border-white/10 bg-[#1f1f1f] text-gray-400">
            🔒 Secure Access
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
            WELCOME BACK
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Đăng nhập để truy cập hệ thống quản lý và tiếp tục công việc của bạn.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#181818] border border-[#2d2d2d]
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                           outline-none transition"
                placeholder="Nhập username"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#181818] border border-[#2d2d2d]
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                           outline-none transition"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Quên mật khẩu?
              </a>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700
                         font-medium text-white transition flex items-center
                         justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>

        {/* RIGHT – IMAGE */}
        <div className="hidden lg:block relative rounded-2xl overflow-hidden">
          <div
            className="h-full min-h-[600px] bg-cover bg-center flex items-end p-8"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1709706696753-1dc4f13d0cc4?w=1080&q=80)",
            }}
          >
            <h3 className="text-white text-3xl tracking-tight">
              Infrastructure Dashboard
            </h3>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}