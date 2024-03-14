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
import { useDoctors } from "@/lib/hooks/useDoctors";

const FloatingRectangleOne = styled.img`
  position: absolute;
  top: 85px;
  left: 25px;
`;
const FloatingRectangleTwo = styled.img`
  position: absolute;
  bottom: 125px;
  right: 0px;
`;

const DoctorSquare = ({ name, specialty, rating, reviewCount, location }) => {
  return (
    <Container
      className={"rounded-sm shadow-cardShadow flex flex-col bg-white p-6"}
    >
      <ProfilePicture src="/doctor-circle.png" />
      <p className="text-base text-secondary-foreground">{name}</p>
      <p className={"text-sm pt-1 text-muted-foreground"}>{specialty}</p>
      <p
        className={
          "text-sm pt-3 text-secondary-foreground font-bold flex gap-2"
        }
      >
        <LucideIcon name={"star"} className={"text-orange"} />
        {rating}{" "}
        <span className="font-normal underline text-muted-foreground">
          {reviewCount}
        </span>
      </p>
      <p className={"text-sm pt-3 text-muted-foreground flex gap-2"}>
        <LucideIcon name={"map-pin"} className={"text-orange"} />
        {location}
      </p>
    </Container>
  );
};

const Container = styled.div``;
const ProfilePicture = styled.img`
  width: 124px;
  height: 124px;
`;

const MarketingPage = () => {
  const { doctors, isLoading, error } = useDoctors();
  console.log(doctors);
  return (
    <div className="text-foreground text-opacity-85 m-w-[1920px]">
      <Navbar />
      <WholePageContainer className="pt-32">
        <HeroSection className="container mx-auto">
          <CornerImage src="/corner-image.png" className="" />
          <div className="flex flex-col items-center justify-center pb-14">
            <div className="max-w-4xl w-full">
              <DoctorSearch />
            </div>
            <div className="h-[40px]" />
          </div>
        </HeroSection>

        <div className="h-[90px] bg-background" />
        <section className={"bg-white"}>
          <div className={"m-auto container w-[80%]"}>
            <div className="w-3/4 mx-auto">
              <div className={"flex flex-col justify-center space-y-4"}>
                <SingleFeatureList
                  className={
                    "bg-white gap-[34px] rounded-sm flex flex-row p-[15px] shadow-lg border border-foreground/5"
                  }
                >
                  <div className={"p-[25px] bg-lightOrange rounded-md"}>
                    <img src={"/searchDoctor.png"} alt={"search doctor"} />
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
                    "bg-white gap-[34px] rounded-sm flex flex-row p-[15px] shadow-lg border border-foreground/5"
                  }
                >
                  <div className={"p-[25px] bg-lightOrange rounded-md"}>
                    <img
                      src={"/searchDoctor.png"}
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
                    "bg-white gap-[34px] rounded-sm flex flex-row p-[15px] shadow-lg border border-foreground/5"
                  }
                >
                  <div className={"p-[25px] bg-lightOrange rounded-md"}>
                    <img src={"/searchDoctor.png"} alt={"Get Your Solution"} />
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
        <div className="h-[90px] bg-background" />
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
