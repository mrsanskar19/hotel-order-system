"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
    { href: "/hotels", label: "Hotels" },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href} className="mb-2">
              <Link
                href={link.href}
                className={`block p-2 rounded hover:bg-gray-700 ${
                  pathname === link.href ? "bg-gray-900" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export { Sidebar };
