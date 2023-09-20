import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavbarOption } from "./NavbarOption";

const navigationOptions = {
  default: [
    {
      name: "Login",
      path: "/login"
    },
    {
      name: "Register",
      path: "/register"
    }
  ]
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="h-20 border-b shadow-sm">
      {/* Container */}
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4">
        {/*  Home link */}
        <Link
          to="/"
          className="flex h-full flex-row items-center gap-4 py-2"
          aria-label="Go to home page"
        >
          <img
            src="/images/codelabs-logo_100x100.webp"
            alt="UPB Code Labs logo"
            className="aspect-square h-full rounded-lg"
          />
          <span className="text-xl font-bold">UPB Code Labs</span>
        </Link>
        {/* Navigation options */}
        <div className="md:h-full">
          <button
            className="aspect-square md:hidden"
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            <Menu size={32} />
          </button>
          {/* Backdrop filter */}
          <div
            className={`fixed left-0 top-0 z-10 h-full w-full bg-black/75 md:static md:block md:bg-transparent ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            {/* Menu content */}
            <div className="h-full w-3/4 bg-white p-4 md:w-auto md:bg-transparent md:p-0">
              {/* Close button */}
              <button
                className="aspect-square md:hidden"
                aria-label="Close menu"
                onClick={toggleMenu}
              >
                <X size={32} />
              </button>
              {/* Navigation options */}
              <ul className="mt-8 flex w-full flex-col gap-8 md:mt-0 md:h-full md:flex-row">
                {navigationOptions.default.map((option) => (
                  <NavbarOption key={option.path} {...option} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
