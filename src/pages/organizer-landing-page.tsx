import AttendeeNavBar from "@/components/at-navbar";
import OrganizerFormDialog from "@/components/organizer-form-dialog";
import ButtonAlt from "@/components/ui/button-alt";
import { useRoles } from "@/hooks/use-roles";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const OrganizerLandingPage: React.FC = () => {
  const { isOrganizer } = useRoles();
  return (
    <div className="min-h-screen">
      <section className="bg-[url(/organizers-landing-hero-blur.png)] bg-cover min-h-[200px]  bg-bottom md:min-h-[250px] ">
        <div className=" bg-gradient-to-r from-[#084887]  to-[#084887]/50 min-h-[200px] md:min-h-[500px]  text-white ">
          <div className="container  mx-auto">
            <AttendeeNavBar />
          </div>
          <div className="container  mx-auto  pt-14 px-4 pb-6">
            <h1
              className="text-5xl lg:text-8xl font-black
           mb-12 text-left tracking-tighter font-user"
            >
              HOST
              <br /> EVENTS
            </h1>

            <Flex gap="4" direction={{ initial: "column-reverse", md: "row" }}>
              <div className="md:w-1/2">
                <Text size="4">
                  Plan your perfect event with a streamlined booking experience
                  designed for efficiency and flexibility. From corporate
                  conferences to private celebrations, our platform enables
                  seamless venue discovery, real-time availability checks, and
                  instant confirmations.
                </Text>
              </div>
              <div>
                {isOrganizer ? (
                  <div>
                    <Link to="/dashboard">
                      <div className="w-59">
                        <ButtonAlt>
                          START
                          <div className="bg-orange-300 group-hover/buttonhero:bg-orange-200 text-orange-600 rounded-full p-2 -mr-0.5 ml-2 transition duration-500 select-none">
                            <ArrowUpRight size="28" />
                          </div>
                        </ButtonAlt>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <OrganizerFormDialog>
                    <div className="w-59">
                      <ButtonAlt>
                        START
                        <div className="bg-orange-300 group-hover/buttonhero:bg-orange-200 text-orange-600 rounded-full p-2 -mr-0.5 ml-2 transition duration-500 select-none">
                          <ArrowUpRight size="28" />
                        </div>
                      </ButtonAlt>
                    </div>
                  </OrganizerFormDialog>
                )}
              </div>
            </Flex>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrganizerLandingPage;
