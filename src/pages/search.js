import { DoctorSearch } from "@/components/DoctorSearch";
import LucideIcon from "@/components/LucideIcon";
import { Footer, Navbar } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import styled from "styled-components";
import { useState } from "react";
import { useDoctors } from "@/lib/hooks/useDoctors";
import { useRouter } from "next/router";

const DoctorSquare = ({
  name,
  specialty,
  rating,
  reviewCount,
  location,
  id,
}) => {
  const router = useRouter();

  return (
    <div
      className={
        "shadow-cardShadow rounded-sm flex flex-col md:flex-col lg:flex-row bg-white p-4 items-start "
      }
    >
      <div className={"flex "}>
        <img className={"w-[105px] mt-[-8px]"} src="/doctor-circle.png" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-serif text-lg font-bold text-secondary-foreground">
          {name}
        </p>
        <p className={"text-m text-muted-foreground"}>{specialty}</p>

        <p className={"text-m text-muted-foreground flex gap-2"}>
          <LucideIcon name={"map-pin"} className={"w-5 text-orange"} />
          {location}
        </p>
        <p className={"text-m text-secondary-foreground font-bold flex gap-2"}>
          <LucideIcon name={"star"} className={"w-5 text-orange"} />
          {rating}{" "}
          <span className="font-light underline text-muted-foreground">
            {reviewCount}
          </span>
        </p>
      </div>
      <div className="flex items-center self-center justify-start flex-grow w-full pt-0 pr-5 mt-5 lg:w-auto lg:mt-0 lg:justify-end">
        <Button
          onClick={() => router.push(`/doctor/${id}`)}
          variant="outline"
          className="gap-2 rounded-full border-primary text-primary hover:text-primary"
        >
          See More
          <LucideIcon name="arrow-right" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const MarketingPage = () => {
  const [refreshDoctorSearch, setRefreshDoctorSearch] = useState(0);
  const { doctors, isLoading, error } = useDoctors(refreshDoctorSearch);

  const refreshDoctorSearchState = () => {
    const newVal = refreshDoctorSearch + 1
    setRefreshDoctorSearch(newVal);
  }
  
  return (
    <div className="text-foreground text-opacity-85 m-w-[1920px]">
      <Navbar />
      <WholePageContainer className="pt-32">
        <HeroSection className="container mx-auto rounded-bl-[50px] rounded-br-[50px]">
          <CornerImage src="/corner-image.png" className="" />
          <div className="flex flex-col items-center justify-center pb-14">
            <div className="w-full max-w-5xl">
              <DoctorSearch refreshDoctorSearch={() => refreshDoctorSearchState()}/>
            </div>
            <div className="h-[40px]" />
          </div>
        </HeroSection>

        <div className="h-[90px] bg-background" />
        <section className={"bg-white"}>
          <div className={"m-auto container w-[80%]"}>
            <div className="w-5/6 mx-auto">
              <div className={"flex flex-col justify-center space-y-4"}>
                {doctors?.map((doctor) => {
                  return (
                    <Link href={`/doctor/${doctor.id}`}>
                      <DoctorSquare
                        name={doctor.name}
                        specialty={doctor.specialty_list}
                        rating={doctor.specialty}
                        reviewCount={69}
                        location={doctor.location}
                        id={doctor.id}
                      />
                    </Link>
                  );
                })}
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
  background: #dfefed;
  background-size: 200% 100%;
`;

const WholePageContainer = styled.div`
  background: #dfefed;
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
