"use server";

import connectDb from "../../config/db";
import User from "../../models/User";

import { cookies } from "next/headers";

import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const register = async ({ fullName, username, password }) => {
  if (!fullName.trim() || !username.trim() || !password.trim()) {
    return {
      success: false,
      message: "لطفا اطلاعات خواسته شده را با دقت پر کنید.",
    };
  }

  if (username.length < 4) {
    return {
      success: false,
      message: "نام کاربری باید حداقل 4 کاراکتر باشد.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "گذرواژه باید حداقل 8 کاراکتر باشد.",
    };
  }

  try {
    await connectDb();

    const isAlreadyExist = await User.findOne({ username });

    if (isAlreadyExist) {
      return {
        success: false,
        message: "نام کاربری از قبل وجود دارد.",
      };
    }

    await User.create({
      fullName,
      username,
      password: await hash(password, 12),
    });

    return {
      success: true,
      message: "ثبت نام با موفقیت انجام شد.",
    };
  } catch (error) {
    console.error("Error in register action : ", error);
    return { success: false, message: "خطای داخلی سرور." };
  }
};

export const login = async ({ username, password }) => {
  if (!username.trim() || !password.trim()) {
    return {
      success: false,
      message: "لطفا اطلاعات خواسته شده را با دقت پر کنید.",
    };
  }

  if (username.length < 4) {
    return {
      success: false,
      message: "نام کاربری باید حداقل 4 کاراکتر باشد.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "گذرواژه باید حداقل 8 کاراکتر باشد.",
    };
  }

  const cookiesStore = await cookies();

  try {
    await connectDb();

    const user = await User.findOne({ username });

    if (!user) {
      return {
        success: false,
        message: "کاربری با این مشخصات یافت نشد.",
      };
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "نام کاربری یا گذرواژه صحیح نمیباشد.",
      };
    }

    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    cookiesStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: "ورود با موفقیت انجام شد.",
    };
  } catch (error) {
    console.error("Error in register action : ", error);
    return { success: false, message: "خطای داخلی سرور." };
  }
};

export const logout = async () => {
  const cookiesStore = await cookies();

  cookiesStore.delete("token");

  return {
    success: true,
    message: "خروج با موفقیت انجام شد.",
  };
};
