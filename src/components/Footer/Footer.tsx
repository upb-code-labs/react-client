import { FooterLinksGroup } from "./FooterLinksGroup";

const documents = [
  {
    name: "Information Processing and Personal Data Protection Policy",
    url: "/POLITICA_TRATAMIENTO_INFORMACION_PROTECCION_DATOS_PERSONALES.pdf"
  },
  {
    name: "User Manual",
    url: "https://upb-code-labs.github.io/manual/"
  }
];

const source = [
  {
    name: "Organization profile",
    url: "https://github.com/upb-code-labs"
  }
];

export const Footer = () => {
  return (
    <footer className="sticky top-full border-t border-t-border p-4">
      {/* Container */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {/* First col */}
        <div className="sm:col-span-2 md:col-span-1">
          <a
            className="flex justify-center md:justify-start"
            rel="noreferrer"
            target="_blank"
            href="https://www.upb.edu.co/"
            aria-label="Universidad Pontificia Bolivariana website"
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
