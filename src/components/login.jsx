"use client";

import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "../app/(auth)/_actions";

import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    const res = await login({ username, password });

    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      router.push("/");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="card w-96">
        <Image
          src="/login.png"
          alt="Login"
          width={300}
          height={300}
          className="mx-auto"
        />
        <div className="card-body gap-3 items-center ">
          <h2 className="card-title">بودجه یار - ورود</h2>
          <p className="text-center">بودجه یار - مدیریت تراکنش های مالی شما.</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input placeholder:text-xs"
            placeholder="نام کاربری"
          />
          <div className="relative w-full">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="input placeholder:text-xs pl-10 w-full"
              placeholder="گذرواژه"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 z-10"
              aria-label={showPassword ? "مخفی کردن گذرواژه" : "نمایش گذرواژه"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <div className="card-actions w-full px-1.5">
            <button
              onClick={handleLogin}
              disabled={!username.trim() || !password.trim() || isLoading}
              className="btn btn-primary text-white w-full">
              ورود
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
