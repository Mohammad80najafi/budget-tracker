import connectDb from "../config/db";
import User from "../models/User";

import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export const getUser = async () => {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    if (!decoded) return null;

    await connectDb();

    const user = await User.findById(decoded.id).populate({
      path: "transactions",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
};
