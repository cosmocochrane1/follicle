import Image from "next/image";
import Link from "next/link";
import LucideIcon from "../LucideIcon";
import SignUpInput from "./SIgnUpInput";
import styled from "styled-components";

const Footer = () => {
  return (

    <footer className="relative bg-white">
      {/* <WhiteOval /> */}
      <div className="relative w-full py-6 border-t rounded-tl-[50px] pb-[140px] pt-[90px] rounded-tr-[50px] bg-tertiary">
        <FooterBlobContainer className={'absolute w-full overflow-hidden bottom-0 left-0'}>
          <div>
            <img src="/footer-blob.png" alt="blob" />
            <p className="absolute left-0 right-0 m-auto text-sm font-light text-center text-white bottom-5">
              Copyright 2023 Logo. All rights reserved.
            </p>
          </div>
        </FooterBlobContainer>

        <div className="container flex flex-col items-center justify-between w-full mx-auto">
          <div className={'flex mb-[100px] w-full flex-col text-center'}>
            <h1 className="text-[51px] text-white">Get The Latest</h1>
            <p className="text-sm text-white mt-[35px] mb-[55px]">
              Sign up for our newsletter
            </p>
            <SignUpInput />
          </div>

          <div className="grid w-full grid-cols-1 gap-10 mx-auto sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-between mb-[20px] w-full h-full m-auto align-start">
              {/* Opening div */}
              <Link href="/">
                <Image
                  className=""
                  width={80}
                  height={26}
                  src="/logo.png"
                  alt="Logo"
                />
              </Link>

              <div className="flex flex-row gap-2">
                <div className="p-2 border rounded-full border-[#2C4659]">
                  <LucideIcon name="facebook" className="w-4 h-4 text-white" />
                </div>
                <div className="p-2 border rounded-full border-[#2C4659]">
                  <LucideIcon name="instagram" className="w-4 h-4 text-white" />
                </div>
                <div className="p-2 border rounded-full border-[#2C4659]">
                  <LucideIcon name="twitter" className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* Closing div */}
            </div>

            <div className="flex flex-col gap-7 justfity-between">
              {/* Opening div */}
              <p className={'text-lg mb-1 text-tertiary-foreground'}>Services</p>
              <Link href="/" className="text-sm text-tertiary-foregroundSecondary">
                Treatments
              </Link>
              <Link href="/auth" className="text-sm text-tertiary-foregroundSecondary">
                Testimonials
              </Link>
              <Link href="/auth" className="text-sm text-tertiary-foregroundSecondary">
                FAQ's
              </Link>
              <Link href="/auth" className="text-sm text-tertiary-foregroundSecondary">
                Contact
              </Link>
              {/* Closing div */}
            </div>

            <div className="flex flex-col gap-7 justfity-between">
              {/* Opening div */}
              <p className={'text-lg mb-1 text-tertiary-foreground'}>Company</p>
              <Link href="/" className="text-sm text-tertiary-foregroundSecondary">
                Help Center
              </Link>
              <Link href="/auth" className="text-sm text-tertiary-foregroundSecondary">
                privacy policy
              </Link>
              <Link href="/auth" className="text-sm text-tertiary-foregroundSecondary">
                {/* Opening div */}
                Terms & Conditions
                {/* Closing div */}
              </Link>
              <Link href="/auth" className="text-sm text-tertiary-foregroundSecondary">
                Members
              </Link>
              {/* Closing div */}
            </div>
            <div className="flex flex-col gap-7 justfity-between">
              {/* Opening div */}
              <p className={'text-lg mb-1 text-tertiary-foreground'}>Contact Information</p>
              <div className="flex flex-row gap-2">
                <LucideIcon name="mail" className="w-4 h-4 text-tertiary-foregroundSecondary" />
                <p className="text-sm text-tertiary-foregroundSecondary">
                  logo.12498@gmail.com
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <LucideIcon name="phone" className="w-4 h-4 text-tertiary-foregroundSecondary" />
                <p className="text-sm text-tertiary-foregroundSecondary">
                  012 345 6789
                </p>
              </div>


              {/* Closing div */}
            </div>


          </div>

        </div>
      </div>
    </footer >
  );
};

export default Footer;


const WhiteOval = styled.div`
  background: white;
  width: 100%;
  width: 100px;
  height: 100px;
  border-radius: 100%;
`

const FooterBlobContainer = styled.div`
  img {
    height: auto;
    width: auto;
    max-width: fit-content;
  }
`