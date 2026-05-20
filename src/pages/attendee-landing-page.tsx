import { useAuth } from "react-oidc-context";
import { Heading, Flex, Text } from "@radix-ui/themes";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationResponse, PublishedEventSummary } from "@/domain/domain";
import { listPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import AttendeeNavBar from "@/components/at-navbar";
import { Link } from "react-router";
import ButtonAlt from "@/components/ui/button-alt";

const AttendeeLandingPage: React.FC = () => {
  const { isLoading } = useAuth();

  const [publishedEvents, setPublishedEvents] = useState<
    PaginationResponse<PublishedEventSummary> | undefined
  >();

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    refreshPublishedEvents();
  }, []);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(0));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen">
      <section className="bg-[url(/organizers-landing-hero-blur.png)] bg-cover min-h-[200px]  bg-bottom md:min-h-[250px] ">
        <div className=" bg-gradient-to-r from-orange-500  to-orange-500/50 min-h-[200px] md:min-h-[500px]  text-white pb-10 lg:pb-0">
          <div className="container  mx-auto">
            <AttendeeNavBar />
          </div>
          <div className="container  mx-auto  pt-14 px-4">
            <h1
              className="text-5xl lg:text-8xl font-black
           mb-12 text-left tracking-tighter font-user"
            >
              EXPLORE
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
              <div className="w-62">
                <ButtonAlt>
                  Browse
                  <div className="bg-orange-300 group-hover/buttonhero:bg-orange-200 text-orange-600 rounded-full p-2 -mr-0.5 ml-2 transition duration-500">
                    {/* <ChevronsDown size="28" /> */}
                    <ArrowUpRight size="28" />
                  </div>
                </ButtonAlt>
              </div>
            </Flex>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="">
        <div className="container mx-auto px-4 pt-6 lg:pt-12 pb-12">
          <Flex justify="between" align="end" className="mb-8">
            <div className="lg:w-1/2  lg:mt-2">
              <Heading
                size={{ initial: "4", lg: "8" }}
                weight="bold"
                className="font-user text-zinc-800 uppercase"
              >
                Discover The <span className="text-orange-500"> Events</span>{" "}
                You Love
              </Heading>
            </div>
            <div className="w-60">
              <Link to={`/events/`}>
                <Text
                  size={{ initial: "1", lg: "3" }}
                  className="font-user text-orange-500  hover:underline decoration-dashed underline-offset-6"
                >
                  <Flex gap="1" align="center" justify="end">
                    <span>View All</span> <ArrowUpRight />
                  </Flex>
                </Text>
              </Link>
            </div>
          </Flex>

          {/* Published Event Cards */}
          <div className="grid grid-cols-1 gap-4  md:grid-cols-3">
            {publishedEvents?.content?.map((publishedEvent) => (
              <PublishedEventCard
                publishedEvent={publishedEvent}
                key={publishedEvent.id}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AttendeeLandingPage;
