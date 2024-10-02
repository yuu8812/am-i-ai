import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

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
    <footer className="">
      <div className="m-4 bg-gray-800 py-6 flex items-center justify-center">
        <p className="text-gray-400">
          <Link to="https://x.com/am_i_ai_" target="_blank">
            <div className="flex items-center gap-2">
              <FaTwitter />
              twitter
            </div>
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
