import {
  Coffee,
  ShoppingCart,
  CreditCard,
  Heart,
  Truck,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

export const categories = {
  food: { name: "غذا", icon: Coffee },
  shopping: { name: "خرید", icon: ShoppingCart },
  bills: { name: "قبوض", icon: CreditCard },
  health: { name: "سلامت", icon: Heart },
  transport: { name: "حمل و نقل", icon: Truck },
  education: { name: "تحصیل", icon: BookOpen },
  other: { name: "سایر", icon: MoreHorizontal },
};
