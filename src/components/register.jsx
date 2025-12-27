"use client";

import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "../app/(auth)/_actions";

import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);

    const res = await register({ fullName, username, password });
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      router.push("/login");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="card w-96">
        <Image
          src="/register.png"
          alt="Register"
          width={300}
          height={300}
          className="mx-auto"
        />
        <div className="card-body gap-3 items-center -mt-10">
          <h2 className="card-title">بودجه یار - ثبت نام</h2>
          <p className="text-center">بودجه یار - مدیریت تراکنش های مالی شما.</p>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input placeholder:text-xs"
            placeholder="نام و نام خانوادگی شما"
          />
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
              onClick={handleRegister}
              disabled={
                !fullName.trim() ||
                !username.trim() ||
                !password.trim() ||
                isLoading
              }
              className="btn btn-primary text-white w-full">
              ثبت نام
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
