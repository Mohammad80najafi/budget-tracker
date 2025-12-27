import { getUser } from "../../lib/helpers";

import { redirect } from "next/navigation";

const AuthLayout = async ({ children }) => {
  const user = await getUser();

  if (user) redirect("/");

  return children;
};

export default AuthLayout;
