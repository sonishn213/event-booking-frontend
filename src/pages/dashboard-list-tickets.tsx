import AttendeeNavBar from "@/components/at-navbar";
import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PaginationResponse,
  SpringBootPagination,
  TicketSummary,
} from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { Badge, Box, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  MapPin,
  Tag,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState<
    PaginationResponse<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white">
        <NavBar />
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayDateFormat = (
    start: string | Date | null,
    end: string | Date | null,
  ) => {
    const displayDate =
      start && end
        ? format(start, "PP") + " " + format(end, "PP")
        : "Dates TBD";

    return displayDate;
  };

  return (
    <>
      <div className="container  mx-auto">
        <AttendeeNavBar />
      </div>
      <div className="container  mx-auto pt-4">
        <Heading
          size="8"
          weight="bold"
          className="font-user text-zinc-800 uppercase"
        >
          Your <span className="text-orange-500"> Tickets</span>
        </Heading>
        <Box mt="3">
          <Text color="gray">
            <Link to="/">HOME</Link> / Your tickets
          </Text>
        </Box>

        <section className="mt-9">
          <Grid gap="3" columns="3">
            {tickets?.content.map((ticketItem) => (
              <Link to={`/dashboard/tickets/${ticketItem.id}`}>
                <Card size="3">
                  <Badge variant="soft" color="grass">
                    {ticketItem.status}
                  </Badge>
                  <div className="pb-7 pt-2">
                    <Heading className="pb-2">
                      {ticketItem.ticketType.eventName}
                    </Heading>

                    <div className="text-gray-700 capitalize  text-sm">
                      <Flex gap="2" align="center" mb="2" className="">
                        <MapPin size="16" className="text-gray-400" />{" "}
                        {ticketItem.ticketType.eventVenue}
                      </Flex>
                      <div className="flex gap-2 text-sm  ">
                        <Flex gap="2" align="center" className="">
                          <Calendar size="16" className="text-gray-400" />
                          {displayDateFormat(
                            ticketItem.ticketType.eventStart,
                            ticketItem.ticketType.eventEnd,
                          )}
                        </Flex>
                      </div>
                    </div>
                  </div>

                  <Card>
                    <Flex justify="between" align="center">
                      <Flex gap="4" align="center">
                        <Ticket size="18" className=" text-gray-400" />
                        <h3 className="font-bold text-lg uppercase">
                          {ticketItem.ticketType.name}
                        </h3>
                      </Flex>
                      <Text size="5" weight="bold">
                        ${ticketItem.ticketType.price}
                      </Text>
                    </Flex>

                    <Flex gap="4" align="center" mt="2">
                      <Tag size="18" className="text-gray-400" />
                      <div>
                        <h4 className="font-medium">Ticket ID</h4>
                        <p className="text-gray-400 font-mono text-sm">
                          {ticketItem.id}
                        </p>
                      </div>
                    </Flex>
                  </Card>
                </Card>
              </Link>
            ))}
          </Grid>
        </section>
        <section>
          <div className="flex justify-center py-8">
            {tickets && (
              <SimplePagination
                pagination={tickets.page}
                onPageChange={setPage}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default DashboardListTickets;
