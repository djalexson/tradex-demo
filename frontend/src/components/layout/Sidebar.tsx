"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BriefcaseBusiness, History, LayoutDashboard, Settings, Shield, TrendingUp } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Главная", icon: LayoutDashboard },
  { href: "/markets", label: "Рынки", icon: TrendingUp },
  { href: "/portfolio", label: "Портфель", icon: BriefcaseBusiness },
  { href: "/history", label: "История", icon: History },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/settings", label: "Настройки", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <span className="brand-mark">
          <BarChart3 size={20} />
        </span>
        <span>TradeX</span>
      </Link>
      <nav className="nav">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : ""}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
