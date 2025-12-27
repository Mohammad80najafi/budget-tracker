import connectDb from "../config/db";
import Transactions from "../components/transactions";
import Transaction from "../models/Transaction";

import { getUser } from "../lib/helpers";

import { redirect } from "next/navigation";


const Page = async () => {
  const user = await getUser();

  if (!user) redirect("/login");

  await connectDb();

  const incomeTransactions = await Transaction.find({
    user: user._id,
    type: "income",
  });

  const expenseTransactions = await Transaction.find({
    user: user._id,
    type: "expense",
    amount: { $gt: 0 },
  });

  const totalIncome = incomeTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const totalExpense = expenseTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const totalBalance = totalIncome - totalExpense;

  return (
    <Transactions
      name={user?.fullName}
      transactions={JSON.parse(JSON.stringify(user.transactions))}
      totalBalance={totalBalance}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
    />
  );
};

export default Page;
