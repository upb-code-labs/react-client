import { FooterLinksGroup } from "./FooterLinksGroup";

const documents = [
  {
    name: "Data Processing and Protection Policy",
    url: "#"
  },
  {
    name: "User Manual",
    url: "#"
  }
];

const source = [
  {
    name: "Organization profile",
    url: "https://github.com/upb-code-labs"
  },
  {
    name: "Frontend repository",
    url: "https://github.com/UPB-Code-Labs/react-client"
  },
  {
    name: "Main API repository",
    url: "https://github.com/UPB-Code-Labs/main-api"
  },
  {
    name: "Tests runner repository",
    url: "https://github.com/UPB-Code-Labs/tests-microservice"
  }
];

export const Footer = () => {
  return (
    <footer className="sticky top-full border-t border-t-border p-4">
      {/* Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {/* First col */}
        <div className="sm:col-span-2 md:col-span-1">
          <a
            className="flex justify-center md:justify-start"
            rel="noreferrer"
            target="_blank"
            href="https://www.upb.edu.co/"
          >
            <img
              className="max-w-[15rem]"
              src="/images/upb-logo.svg"
              alt="Universidad Pontificia Bolivariana logo"
            />
          </a>
        </div>
        {/* Second col */}
        <FooterLinksGroup title="Documents" items={documents} />
        {/* Third col */}
        <FooterLinksGroup title="Source Code" items={source} />
      </div>
    </footer>
  );
};
