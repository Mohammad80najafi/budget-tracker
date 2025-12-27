"use client";

import clsx from "clsx";

import Image from "next/image";

import NewTransaction from "./new-transaction.jsx";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "../app/(auth)/_actions";
import { deleteTransaction } from "../app/_actions.js";

import { formatPrice } from "../lib/utils.js";
import { categories } from "../lib/constants";

import { toast } from "sonner";

import { LogOut, RefreshCcw, Trash2 } from "lucide-react";
import EditTransaction from "./edit-transaction.jsx";

const Transactions = ({
  name,
  transactions,
  totalBalance,
  totalIncome,
  totalExpense,
}) => {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [sortMode, setSortMode] = useState("latest");

  const handleLogout = async () => {
    await logout();
    location.href = "/login";
  };

  const handleDeleteTransaction = async (transactionId) => {
    const res = await deleteTransaction(transactionId);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      router.refresh();
      await new Promise((res) => setTimeout(res, 1000));
    } finally {
      setRefreshing(false);
    }
  };

  const displayTransactions = (() => {
    if (!transactions || transactions.length === 0) return [];
    const list = [...transactions];
    if (sortMode === "latest") {
      return list;
    }
    if (sortMode === "income_desc") {
      return list
        .filter((t) => t.type === "income")
        .sort((a, b) => Number(b.amount) - Number(a.amount));
    }
    if (sortMode === "income_asc") {
      return list
        .filter((t) => t.type === "income")
        .sort((a, b) => Number(a.amount) - Number(b.amount));
    }
    if (sortMode === "expense_desc") {
      return list
        .filter((t) => t.type === "expense")
        .sort((a, b) => Number(b.amount) - Number(a.amount));
    }
    if (sortMode === "expense_asc") {
      return list
        .filter((t) => t.type === "expense")
        .sort((a, b) => Number(a.amount) - Number(b.amount));
    }
    return list;
  })();

  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-2">
          <Image src="/home.png" width={50} height={50} alt="Home" />
          <p className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">خوش آمدی</span>
            <span className="text-sm font-bold">{name}</span>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <NewTransaction />
          <LogOut
            onClick={handleLogout}
            className="size-5 text-primary rotate-180"
            strokeWidth={2}
          />
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 items-start">
        <div className="card bg-neutral shadow-xs lg:col-span-1 self-start">
          <div className="card-body gap-5 p-6">
            <span className="text-xs text-gray-300 font-bold">موجودی کل :</span>
            <p className="font-bold text-3xl text-white lg:text-4xl">
              {formatPrice(totalBalance)} تومن
            </p>
            <div className="flex items-center">
              <div className="flex-1 flex flex-col items-start gap-1">
                <p className="text-xs text-gray-300 font-medium">دریافتی</p>
                <p className="font-bold text-success">
                  {formatPrice(totalIncome)} تومن
                </p>
              </div>
              <div className="divider divider-horizontal " />
              <div className="w-[45%] flex flex-col items-start gap-1">
                <p className="text-xs text-gray-300 font-medium">مخارج</p>
                <p className="font-bold text-error">
                  {formatPrice(totalExpense)} تومن
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h6 className="text-sm font-bold text-gray-500">تراکنش های اخیر :</h6>
            <div className="flex items-center gap-2">
              <select
                className="input input-xs appearance-none"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
                aria-label="مرتب سازی">
                <option value="latest">جدیدترین‌ها</option>
                <option value="income_desc">بیشترین درآمد</option>
                <option value="income_asc">کمترین درآمد</option>
                <option value="expense_desc">بیشترین خرج</option>
                <option value="expense_asc">کمترین خرج</option>
              </select>
              <button onClick={handleRefresh} className="btn btn-xs btn-square">
                <RefreshCcw
                  className={clsx(
                    "size-3 transition-transform duration-500",
                    refreshing ? "animate-spin" : ""
                  )}
                />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto space-y-3">
            {displayTransactions?.length > 0 ? (
              displayTransactions.map((t) => {
                const Icon = categories[t.category]?.icon;
                return (
                  <div key={t._id} className="card bg-white shadow-xs">
                    <div className="card-body p-4 lg:p-5 flex-row justify-between">
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-4 h-4 lg:w-5 lg:h-5" />}
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-bold text-sm lg:text-base">{t.title}</span>
                          <span className="text-gray-500 text-xs">
                            {t.type === "income" ? "درآمد" : "هزینه"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 items-end">
                          <span className="font-bold text-sm lg:text-base">
                            {formatPrice(t.amount)} تومن
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(t.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <EditTransaction transaction={t} />
                          <Trash2
                            onClick={() => handleDeleteTransaction(t._id)}
                            className="size-7 bg-error text-rose-500 p-1.5 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="pt-10 text-center font-bold text-gray-600 text-sm">
                تراکنشی فعلا یافت نشد.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
