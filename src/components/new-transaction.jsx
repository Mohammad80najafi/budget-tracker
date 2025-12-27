"use client";

import clsx from "clsx";

import { useState } from "react";

import { newTransaction } from "../app/_actions";

import { categories } from "../lib/constants";
import { formatPrice } from "../lib/utils";

import { toast } from "sonner";

import { Plus } from "lucide-react";

const NewTransaction = () => {
  const [data, setData] = useState({
    amount: "",
    type: "expense",
    title: "",
    category: "other",
  });

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewTransaction = async () => {
    const res = await newTransaction(data);

    if (res.success) {
      toast.success(res.message);
      window.transaction_modal.close();
      setData({
        amount: "",
        type: "expense",
        title: "",
        category: "other",
      });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-primary text-white"
        onClick={() => window.transaction_modal.showModal()}>
        ایجاد <Plus className="size-5" />
      </button>

      <dialog id="transaction_modal" className="modal">
        <div method="dialog" className="modal-box">
          <h3 className="font-bold text-lg mb-4">افزودن تراکنش جدید</h3>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => handleChange({ name: "type", value: "expense" })}
              className={clsx(
                "flex-1 btn",
                data.type === "expense"
                  ? "btn-primary text-white"
                  : "btn-outline"
              )}>
              هزینه
            </button>
            <button
              onClick={() => handleChange({ name: "type", value: "income" })}
              className={clsx(
                "flex-1 btn",
                data.type === "income" ? "btn-primary" : "btn-outline"
              )}>
              درآمد
            </button>
          </div>

          <div className="text-2xl font-semibold text-center mb-4">
            {data.amount ? `${formatPrice(data.amount)} تومن` : "0 تومن"}
          </div>

          <div className=" mb-4">
            <input
              type="number"
              value={data.amount}
              onChange={(e) =>
                handleChange({ name: "amount", value: e.target.value })
              }
              className="input w-full"
              placeholder="مبلغ را وارد کنید"
              required
            />
          </div>

          <div className="form-control mb-4">
            <input
              value={data.title}
              onChange={(e) =>
                handleChange({ name: "title", value: e.target.value })
              }
              className="input w-full"
              placeholder="عنوان تراکنش"
            />
          </div>

          <label className="label mb-1">دسته‌بندی</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {Object.entries(categories).map(([key, { name, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => handleChange({ name: "category", value: key })}
                className={clsx(
                  "btn btn-sm flex items-center gap-1 justify-start border",
                  data.category === key
                    ? "btn-primary text-white"
                    : "btn-outline"
                )}>
                <Icon className="size-4" />
                <span className="text-xs font-bold">{name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleNewTransaction}
              className="btn btn-primary text-white">
              ذخیره
            </button>
            <button
              className="btn"
              onClick={() => window.transaction_modal.close()}>
              لغو
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NewTransaction;
