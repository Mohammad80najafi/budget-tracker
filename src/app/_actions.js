"use server";

import connectDb from "../config/db";
import Transaction from "../models/Transaction";

import { revalidatePath } from "next/cache";

import { getUser } from "../lib/helpers";

export const newTransaction = async ({ title, category, amount, type }) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "لطفا ابتدا وارد شوید.",
    };
  }

  try {
    await connectDb();

    const transaction = await Transaction.create({
      user: user._id,
      title,
      category,
      amount,
      type,
    });

    user.transactions.push(transaction._id);

    await user.save();

    revalidatePath("/");

    return { success: true, message: "عملیات با موفقیت انجام شد." };
  } catch (error) {
    console.error("Error in newTransaction action : ", error);
    return { success: false, message: "خطای داخلی سرور." };
  }
};

export const deleteTransaction = async (transactionId) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "لطفا ابتدا وارد شوید.",
    };
  }

  try {
    await connectDb();

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return {
        success: false,
        message: "تراکنش یافت نشد",
      };
    }

    if (transaction.user.toString() !== user._id.toString()) {
      return {
        success: false,
        message: "شما دسترسی لازم رو ندارید.",
      };
    }

    await transaction.deleteOne();

    revalidatePath("/");

    return { success: true, message: "عملیات با موفقیت انجام شد." };
  } catch (error) {
    console.error("Error in deleteTransaction action : ", error);
    return { success: false, message: "خطای داخلی سرور." };
  }
};

export const updateTransaction = async (
  transactionId,
  { title, category, amount, type }
) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "لطفا ابتدا وارد شوید.",
    };
  }

  if (!transactionId) {
    return {
      success: false,
      message: "شناسه تراکنش نامعتبر است.",
    };
  }

  if (amount !== undefined && Number(amount) < 0) {
    return { success: false, message: "مبلغ نمی‌تواند منفی باشد." };
  }

  try {
    await connectDb();

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return {
        success: false,
        message: "تراکنش یافت نشد",
      };
    }

    if (transaction.user.toString() !== user._id.toString()) {
      return {
        success: false,
        message: "شما دسترسی لازم رو ندارید.",
      };
    }

    if (title !== undefined) transaction.title = title;
    if (category !== undefined) transaction.category = category;
    if (amount !== undefined)
      transaction.amount = Number.isNaN(Number(amount))
        ? transaction.amount
        : Number(amount);
    if (type !== undefined) transaction.type = type;

    await transaction.save();

    revalidatePath("/");

    return { success: true, message: "ویرایش با موفقیت انجام شد." };
  } catch (error) {
    console.error("Error in updateTransaction action : ", error);
    return { success: false, message: "خطای داخلی سرور." };
  }
};
