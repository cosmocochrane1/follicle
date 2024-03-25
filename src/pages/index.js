import { DoctorSearch } from "@/components/DoctorSearch";
import LucideIcon from "@/components/LucideIcon";
import { Footer, Navbar } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Element } from "react-scroll";
import styled from "styled-components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FloatingRectangleOne = styled.img`
  position: absolute;
  top: 85px;
  z-index: 0;
  left: 25px;
`;
const FloatingRectangleTwo = styled.img`
  position: absolute;
  bottom: 125px;
  right: 0px;
`;

const DoctorSquare = ({ name, specialty, rating, reviewCount, location }) => {
  return (
    <div
      className={"max-w-[275px] rounded-sm shadow-cardShadow flex flex-col bg-white p-6"}
    >
      <img className={'w-[124px] h-[124px]'} src="/doctor-circle.png" />
      <p className="text-base text-secondary-foreground">{name}</p>
      <p className={"text-sm pt-1 text-muted-foreground"}>{specialty}</p>
      <p
        className={
          "text-sm pt-3 text-secondary-foreground font-bold flex gap-2"
        }
      >
        <LucideIcon name={"star"} className={"text-orange"} />
        {rating}{" "}
        <span className="font-light underline text-muted-foreground">
          {reviewCount}
        </span>
      </p>
      <p className={"text-sm pt-3 text-muted-foreground flex gap-2"}>
        <LucideIcon name={"map-pin"} className={"text-orange"} />
        {location}
      </p>
    </div>
  );
};



const MarketingPage = () => {
  return (
    <div className="text-foreground text-opacity-85 m-w-[1920px]">
      <Navbar />
      <WholePageContainer className="pt-20 md:pt-32">
        <HeroSection className="container mx-auto">
          <CornerImage src="/corner-image.png" className="" />
          <div className="flex flex-col items-center justify-center pb-14">
            <div className={"max-w-[650px]"}>
              <HeroText className="w-full mb-4 font-serif max-w-[992px] leading-snug md:leading-snug text-center font-extrabold text-black text-5xl md:text-7xl">
                Find A <span className={'text-orange relative'}><img className={'absolute left-0 bottom-[-5px]'} src={'/doctor-underline.png'} />Doctor</span> To Fix Your Shit
              </HeroText>
            </div>
            <div className="h-[20px] md:h-[90px]" />
            <div className="w-full max-w-4xl">
              <DoctorSearch />
            </div>
            <div className="h-[20px] md:h-[90px]" />
          </div>
        </HeroSection>

        <section className="relative overflow-hidden bg-white bg-card">
        <div className="h-[20px] md:h-[90px]" />
          <FloatingRectangleOne src={"/floating-rectangle-1.png"} />
          <FloatingRectangleTwo src={"/floating-rectangle-2.png"} />

          <div className="container w-full py-20 mx-auto pt-14">
            <div className="flex flex-col items-center justify-center font-serif">
              <h2 className="z-10 text-5xl font-extrabold text-center">
                Most Trusted <span className={'text-orange relative'}><img className={' absolute left-0  top-[-5px] bottom-0 transform'} src={'/circle-text.png'} />Professionals</span>
              </h2>
            </div>
            <div
              className={
                "flex flex-col items-center md:grid lg:grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative  mt-[75px] mb-[75px] w-full justify-center"
              }
            >
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
            <div className="flex items-center justify-center pt-0">
              <Button
                variant="outline"
                className="gap-2 rounded-full border-primary text-primary hover:text-primary"
              >
                See More
                <LucideIcon name="arrow-right" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className={"bg-white"}>
          <div
            className={
              "m-auto container w-[80%] bg-lightOrange rounded-lg p-6 py-14"
            }
          >
            <div className="w-full mx-auto md:w-full lg:w-3/4">
              <div className={"text-center flex flex-col items-center"}>
                <h2 className="font-serif text-5xl font-extrabold">
                  3 Easy Steps to get your <span className={'text-orange relative'}><img className={' absolute left-[-5px] w-[200%] top-[-5px] bottom-0 transform'} src={'/circle-text.png'} />Solution</span>
                </h2>
                <p className={"subheader-text max-w-[650px] pt-14 pb-0"}>
                  These alternatives to the classic Lorem Ipsum texts are often
                  amusing and tell short, funny or nonsensical stories.
                </p>
              </div>

              <div className={"flex flex-col justify-center pt-14 space-y-4"}>
                <SingleFeatureList
                  className={
                    "bg-white gap-[34px] relative rounded-sm flex flex-col md:flex-row p-[15px]"
                  }
                >
                  <p className={'text-4xl text-[#F0D7D5] ml-0 md:ml-[-50px] font-bold font-serif self-center'}>01</p>
                  <div className={"p-[25px] h-[20%] w-auto self-center bg-lightOrange rounded-md"}>
                    <img className={'w-[60px] h-auto'}
                      src={"/searchDoctor.png"} alt={"search doctor"} />
                  </div>
                  <div className={"flex flex-col items-start justify-center"}>
                    <h4 className={"font-serif font-bold text-2xl"}>
                      Search Doctor
                    </h4>
                    <p className={" font-extralight pt-2"}>
                      These alternatives to the classic Lorem Ipsum texts are
                      often amusing and tell short.
                    </p>
                  </div>
                </SingleFeatureList>
                <SingleFeatureList
                  className={
                    "bg-white gap-[34px] rounded-sm flex flex-col md:flex-row p-[15px]"
                  }
                >
                  <p className={'text-4xl text-[#F0D7D5] ml-0 md:ml-[-50px] font-bold font-serif self-center'}>02</p>

                  <div className={"p-[25px] h-[20%] w-auto self-center bg-lightOrange rounded-md"}>
                    <img
                      className={'w-[60px] h-auto'}
                      src={"/schedule.png"}
                      alt={"Schedule Appointment"}
                    />
                  </div>
                  <div className={"flex flex-col items-start justify-center"}>
                    <h4 className={"font-serif font-bold text-2xl"}>
                      Schedule Appointment
                    </h4>
                    <p className={" font-extralight pt-2"}>
                      These alternatives to the classic Lorem Ipsum texts are
                      often amusing and tell short.
                    </p>
                  </div>
                </SingleFeatureList>
                <SingleFeatureList
                  className={
                    "bg-white gap-[34px] rounded-sm flex flex-col md:flex-row p-[15px]"
                  }
                >
                  <p className={'text-4xl text-[#F0D7D5] ml-0 md:ml-[-50px] font-bold font-serif self-center'}>03</p>

                  <div className={"p-[25px] h-[20%] w-auto self-center bg-lightOrange rounded-md"}>
                    <img className={'w-[60px] h-auto'}
                      src={"/solution.png"} alt={"Get Your Solution"} />
                  </div>
                  <div className={"flex flex-col items-start justify-center"}>
                    <h4 className={"font-serif font-bold text-2xl"}>
                      Get Your Solution
                    </h4>
                    <p className={" font-extralight pt-2"}>
                      These alternatives to the classic Lorem Ipsum texts are
                      often amusing and tell short.
                    </p>
                  </div>
                </SingleFeatureList>
              </div>
            </div>
          </div>
        </section>
        <div className="h-[20px] md:h-[90px] bg-background" />

        <section className={"bg-white"}>
          <div className={"m-auto container w-full md:w-full lg:w-[80%] rounded-lg p-6 py-14"}>
            <div className="w-full mx-auto lg:w-3/4 md:w-3/4">
              <div className={"text-center flex flex-col items-center"}>
                <h2 className="font-serif text-5xl font-extrabold">
                  Success Stories
                </h2>
                <p className={"subheader-text max-w-[650px] pt-14 pb-0"}>
                  These alternatives to the classic Lorem Ipsum texts are often
                  amusing and tell short, funny or nonsensical stories.
                </p>
              </div>

              <div className={"flex flex-col justify-center pt-14 space-y-4"}>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      According to most sources?
                    </AccordionTrigger>
                    <AccordionContent>
                      It seems that only fragments of the original text remain
                      in the Lorem Ipsum texts used today. One may speculate
                      that over the course of time certain letters were added or
                      deleted at various positions within the text. This might
                      also explain why one can now find slightly different
                      versions. Due to the age of the Lorem Ipsum text there are
                      no copyright issues to contend with.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      According to most sources?
                    </AccordionTrigger>
                    <AccordionContent>
                      It seems that only fragments of the original text remain
                      in the Lorem Ipsum texts used today. One may speculate
                      that over the course of time certain letters were added or
                      deleted at various positions within the text. This might
                      also explain why one can now find slightly different
                      versions. Due to the age of the Lorem Ipsum text there are
                      no copyright issues to contend with.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      According to most sources?
                    </AccordionTrigger>
                    <AccordionContent>
                      It seems that only fragments of the original text remain
                      in the Lorem Ipsum texts used today. One may speculate
                      that over the course of time certain letters were added or
                      deleted at various positions within the text. This might
                      also explain why one can now find slightly different
                      versions. Due to the age of the Lorem Ipsum text there are
                      no copyright issues to contend with.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      According to most sources?
                    </AccordionTrigger>
                    <AccordionContent>
                      It seems that only fragments of the original text remain
                      in the Lorem Ipsum texts used today. One may speculate
                      that over the course of time certain letters were added or
                      deleted at various positions within the text. This might
                      also explain why one can now find slightly different
                      versions. Due to the age of the Lorem Ipsum text there are
                      no copyright issues to contend with.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
        <div className="h-[20px] md:h-[90px] bg-background" />
      </WholePageContainer>
      <Footer />
    </div>
  );
};

export default MarketingPage;

const HeroSection = styled.div`
  background: #f5fcfb;
  background-size: 200% 100%;
`;

const WholePageContainer = styled.div`
  background: #f5fcfb;
`;

const HeroText = styled.h1``;

const SingleFeatureList = styled.div``;

const CornerImage = styled.img`
  position: absolute;
  top: 0;
  width: 150px;
  height: auto;
  left: 0;
  z-index: 0;
`;
