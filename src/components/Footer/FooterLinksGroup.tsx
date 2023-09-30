type FooterLinkItem = {
  name: string;
  url: string;
};

interface FooterLinksGroupProps {
  title: string;
  items: FooterLinkItem[];
}

export const FooterLinksGroup = ({ title, items }: FooterLinksGroupProps) => {
  return (
    <div className="flex flex-col gap-2 text-center md:text-end">
      <p className="font-bold">{title}</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.name} className="text-muted-foreground">
            <a
              className="hover:underline"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
