import { Link } from "react-router-dom";

interface NavbarOptionProps {
  name: string;
  path: string;
}

export const NavbarOption = ({ name, path }: NavbarOptionProps) => {
  return (
    <li
      key={path}
      className="border-b-2 border-b-transparent text-neutral-600 transition-colors hover:text-black md:flex md:h-full md:items-center md:hover:border-b-red-upb"
    >
      <Link to={path} className="w-full text-xl font-bold md:font-normal">
        {name}
      </Link>
    </li>
  );
};
