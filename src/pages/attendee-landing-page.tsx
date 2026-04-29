import { useAuth } from "react-oidc-context";
import { IconButton, Heading, Flex, Button, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, ChevronsDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import AttendeeNavBar from "@/components/at-navbar";
import { Link } from "react-router";
import ButtonAlt from "@/components/ui/button-alt";

const AttendeeLandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();

  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
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

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
    }

    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
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
        <div className=" bg-gradient-to-r from-orange-500  to-orange-500/50 min-h-[200px] md:min-h-[500px]  text-white">
          <div className="container  mx-auto">
            <AttendeeNavBar />
          </div>
          <div className="container  mx-auto  pt-14">
            <h1
              className="text-8xl font-black
           mb-12 text-left tracking-tighter font-user"
            >
              EXPLORE
              <br /> EVENTS
            </h1>

            {/* <div className="flex gap-2 justify-start w-full mb-3">
            <div className="flex gap-2 w-lg">
              <Input
                className="bg-white text-black"
                value={query}
                placeholder="Search the events"
                onChange={(e) => setQuery(e.target.value)}
              />
              <IconButton variant="solid" onClick={queryPublishedEvents}>
                <Search />
              </IconButton>
            </div>
          </div> */}
            <Flex gap="4">
              <div className="md:w-1/2">
                <Text size="4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Harum accusantium saepe deserunt atque debitis. Animi omnis
                  eaque quasi voluptatum sunt reiciendis, distinctio ratione
                  culpa pariatur!
                </Text>
              </div>
              <div>
                <ButtonAlt>
                  Browse
                  <div className="bg-orange-300 group-hover/buttonhero:bg-orange-200 text-orange-600 rounded-full p-2 -mr-0.5 ml-2 transition duration-500">
                    <ChevronsDown size="28" />
                  </div>
                </ButtonAlt>
              </div>
            </Flex>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="">
        <div className="container mx-auto px-4 pt-12 pb-12">
          <Flex justify="between" align="end" className="mb-8">
            <div className="w-1/2  mt-2">
              <Heading
                size="8"
                weight="bold"
                className="font-user text-zinc-800 uppercase"
              >
                Discover The <span className="text-orange-500"> Events</span>{" "}
                You Love
              </Heading>
              {/* <Text size="4" className="text-zinc-500">
                Browse curated listings, compare options, and easily book
                experiences that fit your interests, schedule, budget, and
                preferred locations seamlessly today.
              </Text> */}
            </div>
            <div>
              <Link to={`/events/`}>
                <Text className="font-user text-orange-500  hover:underline decoration-dashed underline-offset-6">
                  <Flex gap="1">
                    <span>View All</span> <ArrowUpRight />
                  </Flex>
                </Text>
              </Link>
            </div>
          </Flex>

          {/* Published Event Cards */}
          <div className="grid grid-cols-2 gap-4  md:grid-cols-3">
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
