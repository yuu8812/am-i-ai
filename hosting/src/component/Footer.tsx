const FOOTER_LINKS = [
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Contact",
    link: "/contact",
  },
  {
    name: "Privacy Policy",
    link: "/privacy-policy",
  },
  {
    name: "Terms of Service",
    link: "/terms-of-service",
  },
  {
    name: "FAQ",
    link: "/faq",
  },
  {
    name: "Blog",
    link: "/blog",
  },
];

const Footer = () => {
  return (
    <div className="h-56 bg-slate-200">
      <div className="flex px-16 py-12 justify-between text-sm text-slate-600">
        {FOOTER_LINKS.map((link) => {
          return (
            <div className="" key={link.name}>
              {link.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
