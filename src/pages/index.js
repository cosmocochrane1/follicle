import LucideIcon from "@/components/LucideIcon";
import { Footer, Navbar } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Element } from "react-scroll";
import styled from 'styled-components'


const FloatingRectangleOne = styled.img`
  position: absolute;
  top: 25px;
  left: 25px;
`
const FloatingRectangleTwo = styled.img`
  position: absolute;
  bottom: 25px;
  right: 0px;
`


const DoctorSquare = ({ name, specialty, rating, reviewCount, location }) => {
  return (
    <Container className={'rounded-lg mx-4 flex flex-col bg-white p-6'}>
      <ProfilePicture src="/doctor-circle.png" />
      <p className="text-base text-secondary-foreground">{name}</p>
      <p className={"text-sm pt-1 text-muted-foreground"}>{specialty}</p>
      <p className={"text-sm pt-3 text-secondary-foreground"}>{rating} <span className="underline text-muted-foreground">{reviewCount}</span></p>
      <p className={"text-sm pt-3 text-muted-foreground"}>{location}</p>
    </Container>
  )
}

const Container = styled.div`

`
const ProfilePicture = styled.img`
  width: 124px;
  height: 124px;
`

const MarketingPage = () => {
  return (
    <div className=" text-foreground text-opacity-85">
      <Navbar />
      <WholePageContainer className="pt-32">
        <HeroSection className="container mx-auto">
          <CornerImage
            src="/corner-image.png"
            className=""
          />
          <div className="flex flex-col items-center justify-center pb-14 md:pb-40">
            <div className={'max-w-[650px]'}>
              <HeroText className="w-full mb-4 text-center text-black text-8xl md:text-7xl">
                Find A Doctor<br /> To Fix Your Shit
              </HeroText>
            </div>

            <div className="relative max-w-[1200px] w-full aspect-video mt-10">
            </div>
          </div>
        </HeroSection>

        <section className="relative overflow-hidden bg-card">
          <FloatingRectangleOne src={'/floating-rectangle-1.png'}/>
          <FloatingRectangleTwo src={'/floating-rectangle-2.png'}/>
 
          <div className="container w-full py-20 mx-auto">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl md:text-4xl">
                Most Trusted Professionals
              </h2>
            </div>
            <div className={'flex relative flex-row mt-[75px] mb-[75px] w-full justify-center'}>
              <DoctorSquare
                name={"Dr. Christopher Corrales, DO"}
                specialty={"Primary care doctor"}
                rating={"4.97"}
                reviewCount={"420 Verified Reviews"}
                location={"Sugar Land, TX"}
              />
              <DoctorSquare
                name={"Dr. Christopher Corrales, DO"}
                specialty={"Primary care doctor"}
                rating={"4.97"}
                reviewCount={"420 Verified Reviews"}
                location={"Sugar Land, TX"}
              />

              <DoctorSquare
                name={"Dr. Christopher Corrales, DO"}
                specialty={"Primary care doctor"}
                rating={"4.97"}
                reviewCount={"420 Verified Reviews"}
                location={"Sugar Land, TX"}
              />

              <DoctorSquare
                name={"Dr. Christopher Corrales, DO"}
                specialty={"Primary care doctor"}
                rating={"4.97"}
                reviewCount={"420 Verified Reviews"}
                location={"Sugar Land, TX"}
              />
            </div>
          </div>
        </section>


        <Element name="contact">
          <section className="py-20 bg-card">
            <div className="container flex flex-col items-center justify-center mx-auto text-center">
              <h2 className="mb-3 text-3xl md:text-4xl">Want to learn more?</h2>
              <p className="mb-8">
                Join the waitlist to be the first to hear about our Beta launch
                and to arrange early access to our tools and vendors.
              </p>

              <Button size="lg" asChild>
                <Link href="/auth">Get started</Link>
              </Button>
            </div>
          </section>
        </Element>
      </WholePageContainer>

      <Footer />
    </div>
  );
};

export default MarketingPage;

const HeroSection = styled.div`
  background: #F5FCFB; 
  background-size: 200% 100%;

`;

const WholePageContainer = styled.div`
  background: #F5FCFB; 
`

const HeroText = styled.h1`
`

const CornerImage = styled.img`
  position: absolute;
  top: 0;
  width: 150px;
  height: auto;
  left: 0;
  z-index: 0;
`