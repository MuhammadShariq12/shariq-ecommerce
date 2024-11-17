"use client";

import useCart from "@/lib/hooks/useCart";

import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = () => {
    if (query) {
      setSearchHistory((prev) =>
        Array.from(new Set([query, ...prev])).slice(0, 5)
      ); // Keep only the latest 5 queries
      router.push(`/search/${query}`);
    }
  };

  return (
    <div className="sticky top-0 z-10 flex justify-between items-center bg-white shadow-md px-4 lg:px-8 h-16">
      {/* Logo */}
      <Link href="/" className="h-full flex items-center">
        <Image
          src="/khareedo.drawio.png"
          alt="logo"
          width={170}
          height={150}
          className="h-full object-contain max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]"
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex gap-6 text-base font-semibold">
        {["Home", "Wishlist", "Orders"].map((item) => {
          const route = item === "Home" ? "/" : `/${item.toLowerCase()}`;
          return (
            <Link
              key={item}
              href={user || item === "Home" ? route : "/sign-in"}
              className={`relative pb-2 hover:text-red-600 ${
                pathname === route ? "text-red-600" : "text-gray-800"
              }`}
            >
              {item}
              {pathname === route && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center gap-3 border border-gray-300 px-3 py-1 rounded-lg">
        <input
          className="outline-none w-48 max-sm:w-24"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          disabled={query === ""}
          onClick={handleSearch}
          className="text-gray-600 hover:text-red-600"
        >
          <Search className="h-4 w-4" />
        </button>

        {query && searchHistory.length > 0 && (
          <ul className="absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 list-none">
            {searchHistory.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setQuery(item);
                  router.push(`/search/${item}`);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User & Cart */}
      <div className="flex items-center gap-4">
        <Link
          href="/cart"
          className="flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-black hover:text-white"
        >
          <ShoppingCart />
          <p className="hidden lg:block text-base font-semibold">
            Cart ({cart.cartItems.length})
          </p>
        </Link>

        {/* Mobile Menu Toggle */}
        <Menu
          className="cursor-pointer lg:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />

        {dropdownMenu && (
          <div className="absolute top-12 right-5 flex flex-col gap-4 p-3 rounded-lg border bg-white shadow-md text-base font-semibold lg:hidden">
            {["Home", "Wishlist", "Orders"].map((item) => {
              const route = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  href={user || item === "Home" ? route : "/sign-in"}
                  className="hover:text-red-600"
                  onClick={() => setDropdownMenu(false)}
                >
                  {item}
                </Link>
              );
            })}
            <Link
              href="/cart"
              className="flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-black hover:text-white"
            >
              <ShoppingCart />
              <p>Cart ({cart.cartItems.length})</p>
            </Link>
          </div>
        )}

        {user ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <CircleUserRound className="h-6 w-6 text-gray-800 hover:text-red-600" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
