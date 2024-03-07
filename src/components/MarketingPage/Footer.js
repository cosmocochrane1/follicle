import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="relative h-[30px] md:h-[40px] aspect-[2/1] object-left"
        >
          <Image
            src="/svgs/logo-white-text.svg"
            fill
            className="object-contain invert dark:invert-0"
          />
        </Link>

        <div className="flex items-center space-x-3">
          <Link href="privacy-policy">Privacy Policy</Link>
          <Link href="terms-conditions">Terms</Link>
        </div>
        <p>&copy; Arcade</p>
      </div>
    </footer>
  );
};

export default Footer;
