import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Box,
  Grid,
  Heading,
  ScrollArea,
  Text,
  Card,
  Radio,
  RadioCards,
  Flex,
  Dialog,
  Button,
  Skeleton,
} from "@radix-ui/themes";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, ArrowUpRight, Calendar, Car, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import ButtonAlt from "@/components/ui/button-alt";
import AttendeeNavBar from "@/components/at-navbar";

const PublishedEventsPage: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    signinRedirect,
    signoutRedirect,
    user,
    settings,
  } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!pageLoading) {
      return;
    }

    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, [pageLoading]);

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
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
    doUseEffect();
  }, [id]);

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

  const displayDate =
    publishedEvent?.start && publishedEvent?.end
      ? format(publishedEvent.start, "PP") +
        " - " +
        format(publishedEvent.end, "PP")
      : "Dates TBD";

  return (
    <div className=" min-h-screen ">
      <div className="container  mx-auto">
        <AttendeeNavBar />
      </div>
      <main className="container mx-auto px-4 pb-16 pt-10">
        <Grid columns="2" gap="6">
          <div>
            <Skeleton loading={pageLoading}>
              <div className="rounded-2xl overflow-hidden h-full">
                <RandomEventImage />
              </div>
            </Skeleton>
          </div>
          <Skeleton loading={pageLoading}>
            <Card size="3">
              <Flex direction="column" className="h-full" justify="between">
                <div>
                  <Heading className="text-4xl font-bold capitalize" mb="4">
                    {publishedEvent?.name}
                  </Heading>
                  <div>
                    <Text className="text-md flex gap-2 items-center">
                      <MapPin size="18" />
                      {publishedEvent?.venue}
                    </Text>
                    <Text className="text-md flex gap-2 items-center">
                      <Calendar size="16" />
                      {displayDate}
                    </Text>
                  </div>
                </div>

                <div className="mt-10">
                  <div>
                    <Flex justify="between" align="center">
                      <Text as="p" weight="bold">
                        Selected Ticket
                      </Text>
                      {(publishedEvent?.ticketTypes?.length || 0) > 1 && (
                        <Dialog.Root>
                          <Dialog.Trigger>
                            <Text className=" text-orange-500 cursor-pointer  hover:underline decoration-dashed underline-offset-6">
                              <Flex gap="1">
                                <span>Change</span>
                              </Flex>
                            </Text>
                          </Dialog.Trigger>
                          <Dialog.Content maxWidth="450px">
                            <Dialog.Title>Select Ticket</Dialog.Title>
                            <div>
                              <Dialog.Close>
                                <RadioCards.Root
                                  columns="1"
                                  value={selectedTicketType?.id}
                                >
                                  {publishedEvent?.ticketTypes?.map(
                                    (ticketType) => (
                                      <RadioCards.Item
                                        value={ticketType.id}
                                        key={ticketType.id}
                                        onClick={() =>
                                          setSelectedTicketType(ticketType)
                                        }
                                      >
                                        <Flex direction="column" width="100%">
                                          <Text weight="bold">
                                            {ticketType.name}
                                          </Text>
                                          <p className=" text-sm">
                                            {ticketType.description}
                                          </p>
                                        </Flex>
                                        <Text className="text-lg font-bold">
                                          {" "}
                                          ${ticketType.price}
                                        </Text>
                                      </RadioCards.Item>
                                    ),
                                  )}
                                </RadioCards.Root>
                              </Dialog.Close>
                            </div>
                            <Flex justify="end" className="mt-5">
                              <Dialog.Close>
                                <Button variant="soft" color="gray">
                                  Cancel
                                </Button>
                              </Dialog.Close>
                            </Flex>
                          </Dialog.Content>
                        </Dialog.Root>
                      )}
                    </Flex>

                    <Card className="mt-2">
                      <Flex gap="4" align="center" justify="between">
                        <div>
                          <Text className="text-xl " weight="bold">
                            {selectedTicketType?.name}
                          </Text>
                          <Text as="p">{selectedTicketType?.description}</Text>
                        </div>
                        <Text className="text-xl " weight="bold">
                          ${selectedTicketType?.price}
                        </Text>
                      </Flex>
                    </Card>
                  </div>

                  <div className="mt-6 w-1/2">
                    <Link
                      to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
                    >
                      <ButtonAlt>Purchase</ButtonAlt>
                    </Link>
                  </div>
                </div>
              </Flex>
            </Card>
          </Skeleton>
        </Grid>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
