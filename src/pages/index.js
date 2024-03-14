import { DoctorSearch } from "@/components/DoctorSearch";
import LucideIcon from "@/components/LucideIcon";
import { Footer, Navbar } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Element } from "react-scroll";
import styled from "styled-components";

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
  return (
    <div className="text-foreground text-opacity-85 m-w-[1920px]">
      <Navbar />
      <WholePageContainer className="pt-32">
        <HeroSection className="container mx-auto">
          <CornerImage src="/corner-image.png" className="" />
          <div className="flex flex-col items-center justify-center pb-14">
            <div className={"max-w-[650px]"}>
              <HeroText className="w-full mb-4 font-serif max-w-[992px] leading-snug md:leading-snug text-center font-extrabold text-black text-5xl md:text-7xl">
                Find A Doctor To Fix Your Shit
              </HeroText>
            </div>
            <div className="h-[90px]" />
            <DoctorSearch />
            <div className="h-[90px]" />
          </div>
        </HeroSection>

        <section className="relative overflow-hidden bg-white bg-card">
          <div className="h-[90px]" />
          <FloatingRectangleOne src={"/floating-rectangle-1.png"} />
          <FloatingRectangleTwo src={"/floating-rectangle-2.png"} />

          <div className="container w-full py-20 mx-auto">
            <div className="flex flex-col items-center justify-center font-serif">
              <h2 className="font-extrabold text-5xl">
                Most Trusted Professionals
              </h2>
            </div>
            <div
              className={
                "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative flex-row mt-[75px] mb-[75px] w-full justify-center"
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
                className="rounded-full gap-2 border-primary text-primary hover:text-primary"
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
            <div className="w-3/4 mx-auto">
              <div className={"text-center flex flex-col items-center"}>
                <h2 className="font-extrabold text-5xl font-serif">
                  3 Easy Steps to get your Solution
                </h2>
                <p className={"subheader-text max-w-[650px] pt-14 pb-0"}>
                  These alternatives to the classic Lorem Ipsum texts are often
                  amusing and tell short, funny or nonsensical stories.
                </p>
              </div>

              <div className={"flex flex-col justify-center pt-14 space-y-4"}>
                <SingleFeatureList
                  className={
                    "bg-white gap-[34px] rounded-sm flex flex-row p-[15px]"
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
                    "bg-white gap-[34px] rounded-sm flex flex-row p-[15px]"
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
                    "bg-white gap-[34px] rounded-sm flex flex-row p-[15px]"
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
