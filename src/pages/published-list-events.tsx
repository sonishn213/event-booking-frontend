import AttendeeNavBar from "@/components/at-navbar";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaginationResponse, PublishedEventSummary } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Box, Heading, Text } from "@radix-ui/themes";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const PublishedListEventsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    PaginationResponse<PublishedEventSummary> | undefined
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

  return (
    <>
      <div className="container  mx-auto">
        <AttendeeNavBar />
      </div>

      <section className="">
        <div className="container mx-auto  pt-4">
          <Heading
            size="8"
            weight="bold"
            className="font-user text-zinc-800 uppercase"
          >
            Browse <span className="text-orange-500"> Events</span>
          </Heading>
          <Box mt="3">
            <Text color="gray">
              <Link to="/">HOME</Link> / Events
            </Text>
          </Box>
          {/* Published Event Cards */}
          <div className="grid grid-cols-2 gap-4  md:grid-cols-3 mt-8">
            {publishedEvents?.content?.map((publishedEvent) => (
              <PublishedEventCard
                publishedEvent={publishedEvent}
                key={publishedEvent.id}
              />
            ))}
          </div>
          <div className="flex justify-center py-8">
            {publishedEvents && (
              <SimplePagination
                pagination={publishedEvents.page}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PublishedListEventsPage;
