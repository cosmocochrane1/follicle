import LucideIcon from "@/components/LucideIcon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Link as ReactScrollLink } from "react-scroll";
import styled from 'styled-components';

const menus = [
  { title: "Home", href: "/", id: "hero" },
  { title: "Treatments", href: "/#about", id: "about" },
  { title: "Testimonial", href: "/#features", id: "features" },
  { title: "FAQs", href: "/#contact", id: "contact" },
  { title: "Contact", href: "/#contact", id: "contact" },

];



const Navbar = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <nav className="sticky h-[94px] flex items-center top-0 z-10 w-full mx-auto bg-white border-b border-opacity-10">
      <div className="container">
        <div className="p-[1px]">
          <div className="flex items-center justify-between px-4 bg-white md:grid md:grid-cols-3">
            <div className="flex items-center py-4 md:py-0">
              <Link href="/" className="relative w-[100px] h-[32px]">
                <Image
                  className=""
                  width={195}
                  height={26}
                  src="/logo.png"
                  alt="Logo"
                />
              </Link>
            </div>

            <div className="items-center justify-center hidden w-full md:flex">
              <ul className="flex items-center justify-center space-x-14">
                {menus.map((menu) => (
                  <li key={menu.title} className="relative flex-col">
                    <ReactScrollLink
                      smooth
                      spy
                      offset={-150}
                      to={menu.id}
                      className="relative block py-5 text-black text-opacity-85"
                      activeClass="font-semibold	font-semibold	after:content-[''] text-orange after:absolute after:bottom-[-2px] after:right-0 after:left-0 after:h-[3px] after:w-full after:bg-orange after:rounded-full"
                    >
                      {menu.title} 
                    </ReactScrollLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="items-center justify-end hidden space-x-3 md:flex">        
              <Button className="rounded-full" asChild>
                <Link href="">Get started</Link>
              </Button>
            </div>

            <Button
              variant="icon"
              onClick={() => setShowMobileNav(true)}
              className="block md:hidden"
            >
              <LucideIcon name="menu" />
            </Button>
          </div>
        </div>

        <Sheet
          open={showMobileNav}
          onOpenChange={(value) => setShowMobileNav(value)}
        >
          <SheetContent className="pt-16 bg-white">
            <ul className="flex flex-col">
              {menus.map((menu) => (
                <li key={menu.title} className="relative flex-col mb-2">
                  <ReactScrollLink
                    smooth
                    spy
                    offset={-150}
                    to={menu.id}
                    className="relative block py-2 w-fit"
                    activeClass="after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-primary after:rounded-full"
                  >
                    {menu.title}
                  </ReactScrollLink>
                </li>
              ))}
            </ul>

            {/* <div className="grid grid-cols-2 gap-5 mt-6">
              <Button className="rounded-full" asChild>
                <Link className="rounded-full" href="/auth">Get started</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/auth">Login</Link>
              </Button>
            </div> */}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;



const Test = styled.div`
  height: 100px;
  width: 100px;
  background-color: green
`