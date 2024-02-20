import { Link } from "react-router-dom";

interface NavbarOptionProps {
  name: string;
  path: string;
  closeMenuCallback: () => void;
}

export const NavbarOption = ({
  name,
  path,
  closeMenuCallback
}: NavbarOptionProps) => {
  return (
    <li
      key={path}
      className="border-b-2 border-b-transparent text-neutral-600 transition-colors hover:text-black md:flex md:h-full md:items-center md:hover:border-b-purple-upb"
    >
      <Link
        to={path}
        className="w-full text-xl font-bold md:font-normal"
        onClick={closeMenuCallback}
      >
        {name}
      </Link>
    </li>
  );
};
