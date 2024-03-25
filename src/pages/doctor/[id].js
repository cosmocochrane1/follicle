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
import { useRouter } from "next/router";
import { useDoctor } from "@/lib/hooks/useDoctor";

const DoctorDetail = () => {
  const { doctor, isLoading } = useDoctor();
  const router = useRouter();
  console.log(doctor);
  return (
    <div className="text-foreground text-opacity-85 m-w-[1920px]">
      <Navbar />
      <WholePageContainer className="pt-32">
        <HeroSection className="container mx-auto rounded-bl-[50px] rounded-br-[50px]">
          <CornerImage src="/corner-image.png" className="" />
          <div className="flex flex-col items-center justify-center pb-14">
            <h2 className="font-serif text-5xl font-extrabold">
              Doctor Details
            </h2>
            <div className="h-[40px]" />
          </div>
        </HeroSection>

        <div className="h-[25px] lg:h-[90px] bg-background" />
        <section className={"bg-white"}>
          <div className={"m-auto container w-full lg:w-[100%] max-w-[1300px]"}>
            <div className="">
              <div
                className={
                  "flex flex-col justify-center space-y-4 p-6 rounded-lg shadow-cardShadow"
                }
              >
                <div className={"flex flex-col items-center lg:flex-row"}>
                  <div
                    className={
                      "w-full lg:w-1/4 max-w-[260px]  rounded-sm gap-1 bg-primary flex items-center flex-col text-white p-6"
                    }
                  >
                    <img
                      className={"w-3/5 self-center"}
                      src="/doctor-circle.png"
                    />
                    <p className="font-serif text-base font-medium text-center ">
                      Dr. Loretta Russell, DO
                    </p>
                    <p className={"font-thin  text-xs "}>
                      Hair Specialist Front
                    </p>
                    <p className={"font-thin	items-center text-xs flex gap-2"}>
                      <LucideIcon
                        name={"map-pin"}
                        className={"w-4 text-white"}
                      />
                      Sugar Land, TX
                    </p>
                  </div>
                  <div className={"h-[25px] lg:h-0"} />
                  <div className={"w-[8%]"} />

                  <div className={"flex w-3/4 justify-between  flex-col"}>
                    <div
                      className={
                        "py-5 flex flex-col md:flex-row items-center md:items-start"
                      }
                    >
                      <div
                        className={
                          "rounded-lg w-[96px] h-[96px] flex items-center justify-center bg-lightOrange p-5"
                        }
                      >
                        <img
                          className={"w-[45px] h-auto"}
                          src={"/education-icon.png"}
                          alt={"Schedule Appointment"}
                        />
                      </div>
                      <div className={"w-[20px]"} />

                      <div
                        className={
                          "flex w-4/5 flex-col items-center md:items-start"
                        }
                      >
                        <p className={"font-serif font-medium text-xl"}>
                          Insurance Accepted
                        </p>
                        <p
                          className={
                            "font-sans text-md font-thin text-lightGrey leading-6"
                          }
                        >
                          One may speculate that over the course of time certain
                          letters were added or deleted at various positions
                          within the text. This might also explain why one can
                          now find slightly different versions.
                        </p>
                      </div>
                    </div>
                    <div className={"h-[1px] w-full bg-[#DBEAE8]"} />
                    <div
                      className={
                        "py-5 flex flex-col md:flex-row items-center md:items-start"
                      }
                    >
                      <div
                        className={
                          "rounded-lg w-[96px] h-[96px] flex items-center justify-center bg-lightOrange p-5"
                        }
                      >
                        <img
                          className={"w-[45px] h-auto"}
                          src={"/insurance-icon.png"}
                          alt={"Schedule Appointment"}
                        />
                      </div>
                      <div className={"w-[20px]"} />
                      <div
                        className={
                          "flex w-4/5 flex-col items-center md:items-start"
                        }
                      >
                        <p className={"font-serif font-medium text-xl"}>
                          Awards / Education
                        </p>
                        <p
                          className={
                            "font-sans text-md font-thin text-lightGrey leading-6"
                          }
                        >
                          One may speculate that over the course of time certain
                          letters were added or deleted at various positions
                          within the text. This might also explain why one can
                          now find slightly different versions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*                             
                            <div className={"flex flex-col bg-lightOrange justify-center space-y-4 p-6 rounded-lg shadow-cardShadow"}>
                                <div className={'flex flex-row'}>
                                    <div
                                        className={"w-1/4  rounded-sm gap-1 bg-primary flex items-center flex-col text-white p-6"}
                                    >
                                        <img className={'w-3/5 self-center'} src="/doctor-circle.png" />
                                        <p className="font-serif text-base font-medium ">Dr. Loretta Russell, DO</p>
                                        <p className={"font-thin	 text-xs "}>Hair Specialist Front</p>
                                        <p className={"font-thin	items-center text-xs flex gap-2"}>
                                            <LucideIcon name={"map-pin"} className={"w-4 text-white"} />
                                            Sugar Land, TX
                                        </p>
                                    </div>
                                    <div className={'w-[80px]'} />

                                    <div className={'flex w-3/4 justify-between  flex-col'}>
                                        <div className={'flex flex-row'}>
                                            <div className={'rounded-lg w-[96px] h-[96px] flex items-center justify-center bg-lightOrange p-5'}>
                                                <img
                                                    className={'w-[45px] h-auto'}
                                                    src={"/education-icon.png"}
                                                    alt={"Schedule Appointment"}
                                                />

                                            </div>
                                            <div className={'w-[20px]'} />

                                            <div className={'flex w-4/5 flex-col'}>
                                                <p className={'font-serif font-medium text-xl'}>Insurance Accepted</p>
                                                <p className={'font-sans text-md font-thin text-lightGrey leading-6'}>One may speculate that over the course of time certain letters were added or deleted at various positions within the text. This might also explain why one can now find slightly different versions.</p>
                                            </div>
                                        </div>
                                        <div className={'h-[1px] w-full bg-[#DBEAE8]'}/>
                                        <div className={'flex flex-row'}>
                                            <div className={'rounded-lg w-[96px] h-[96px] flex items-center justify-center bg-lightOrange p-5'}>
                                                <img
                                                    className={'w-[45px] h-auto'}
                                                    src={"/insurance-icon.png"}
                                                    alt={"Schedule Appointment"}
                                                />
                                            </div>
                                            <div className={'w-[20px]'} />
                                            <div className={'flex w-4/5 flex-col'}>
                                                <p className={'font-serif font-medium text-xl'}>Awards / Education</p>
                                                <p className={'font-sans text-md font-thin text-lightGrey leading-6'}>One may speculate that over the course of time certain letters were added or deleted at various positions within the text. This might also explain why one can now find slightly different versions.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
            </div>
          </div>
        </section>
        <div className="h-[90px] bg-background" />
      </WholePageContainer>

      <Footer />
    </div>
  );
};

export default DoctorDetail;

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
