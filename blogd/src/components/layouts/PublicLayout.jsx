import {
  Home,
  Menu,
  X,
  Search,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Film,
  Globe,
  Newspaper,
} from "lucide-react";
import { useState } from "react";

import { Outlet, Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Politics",
    slug: "politics",
    description: "Latest political news and updates",
    icon: "Users",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 2,
    name: "Business",
    slug: "business",
    description: "Business news, economy and finance",
    icon: "DollarSign",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 3,
    name: "Sports",
    slug: "sports",
    description: "Latest sports news and updates",
    icon: "TrendingUp",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 4,
    name: "Entertainment",
    slug: "entertainment",
    description: "Entertainment news, music and lifestyle",
    icon: "Film",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 5,
    name: "International",
    slug: "international",
    description: "World news and international affairs",
    icon: "Globe",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
];

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getIconComponent = (iconName) => {
    const icons = {
      Users,
      DollarSign,
      TrendingUp,
      Film,
      Globe,
      Newspaper,
    };
    const Icon = icons[iconName] || Newspaper;
    return <Icon className="w-5 h-5" />;
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
    </div>
  );
}
