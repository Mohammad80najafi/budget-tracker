"use client";

import clsx from "clsx";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateTransaction } from "../app/_actions";

import { categories } from "../lib/constants";
import { formatPrice } from "../lib/utils";

import { toast } from "sonner";

import { Pencil } from "lucide-react";

const EditTransaction = ({ transaction }) => {
  const [data, setData] = useState({
    amount: transaction.amount,
    type: transaction.type,
    title: transaction.title,
    category: transaction.category,
  });
  const router = useRouter();

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const res = await updateTransaction(transaction._id, data);

    if (res.success) {
      toast.success(res.message);
      window[`edit_modal_${transaction._id}`].close();
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <button
        className="size-7 bg-primary text-white p-1.5 rounded-full"
        onClick={() => window[`edit_modal_${transaction._id}`].showModal()}
        aria-label="ویرایش"
      >
        <Pencil className="size-4" />
      </button>

      <dialog id={`edit_modal_${transaction._id}`} className="modal">
        <div method="dialog" className="modal-box">
          <h3 className="font-bold text-lg mb-4">ویرایش تراکنش</h3>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => handleChange({ name: "type", value: "expense" })}
              className={clsx(
                "flex-1 btn",
                data.type === "expense" ? "btn-primary text-white" : "btn-outline"
              )}
            >
              هزینه
            </button>
            <button
              onClick={() => handleChange({ name: "type", value: "income" })}
              className={clsx(
                "flex-1 btn",
                data.type === "income" ? "btn-primary" : "btn-outline"
              )}
            >
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
                  data.category === key ? "btn-primary text-white" : "btn-outline"
                )}
              >
                <Icon className="size-4" />
                <span className="text-xs font-bold">{name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleUpdate} className="btn btn-primary text-white">
              ذخیره
            </button>
            <button
              className="btn"
              onClick={() => window[`edit_modal_${transaction._id}`].close()}
            >
              لغو
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EditTransaction;
