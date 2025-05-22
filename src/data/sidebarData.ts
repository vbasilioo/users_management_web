import {
  IconUsers,
} from "@tabler/icons-react"
import { User } from "@/schemas/user.schemas";
import { isAdminOrManager, isUser } from "@/constants/roles";

export const getSidebarData = (currentUser: User | null) => {
  if (currentUser && isUser(currentUser.role)) {
    return {
      user: currentUser,
      navMain: [],
      documents: [],
      navSecondary: []
    };
  }

  const baseData = {
    user: currentUser || {
      name: "Guest",
      email: "guest@example.com",
      avatar: "/avatars/default.jpg",
  },
    documents: [],
    navSecondary: [],
  };

  const navMainItems = [];

  if (currentUser && isAdminOrManager(currentUser.role)) {
    navMainItems.push({
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    });
  }

  return {
    ...baseData,
    navMain: navMainItems,
  };
}; 