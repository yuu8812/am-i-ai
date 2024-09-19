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
    <footer className="text-center">
      <div className="m-4 bg-gray-800 py-6">
        <p className="text-gray-400">
          &copy; 2024 AI-ness & Human Detection. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
