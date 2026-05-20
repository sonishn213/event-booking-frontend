import AttendeeNavBar from "@/components/at-navbar";
import { SimplePagination } from "@/components/simple-pagination";
import { PaginationResponse, StaffsOrganizersResponse } from "@/domain/domain";
import { listStaffsOrganizers } from "@/lib/api";
import { Avatar, Box, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const StaffDashBoard: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [page, setPage] = useState(0);
  const [organizers, setOrganizers] = useState<
    PaginationResponse<StaffsOrganizersResponse> | undefined
  >();

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    refreshPublishedEvents();
  }, [page]);

  const refreshPublishedEvents = async () => {
    if (isLoading || !user || !user?.access_token) {
      console.log("User not logged in");
      return;
    }

    try {
      setOrganizers(await listStaffsOrganizers(user?.access_token, page));
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
  return (
    <>
      <div className="container  mx-auto">
        <AttendeeNavBar />
      </div>
      <div className="container  mx-auto pt-4 px-4">
        <Heading
          size={{ initial: "4", lg: "8" }}
          weight="bold"
          className="font-user text-zinc-800 uppercase"
        >
          Your <span className="text-orange-500"> Organizers</span>
        </Heading>
        <Box mt="3">
          <Text color="gray" size={{ initial: "1", lg: "4" }}>
            <Link to="/">HOME</Link> / Organizers
          </Text>
        </Box>
        <section className="mt-9 pb-12">
          <p className="font-lg mb-4">
            Select the organizer to validate the tickets
          </p>
          <Grid gap="3" columns={{ initial: "1", lg: "3" }}>
            {organizers?.content?.map((organizer) => (
              <Link to={`/dashboard/staff/validate-qr`}>
                <Card>
                  <Flex align="center" justify="between">
                    <Flex gap="3" align="center">
                      <Avatar
                        size="5"
                        fallback={
                          organizer.displayName?.slice(0, 2).toUpperCase() ||
                          "A"
                        }
                        color="indigo"
                        className="border-1 border-indigo-200"
                      />
                      <div>
                        <h3 className="font-bold text-lg">
                          {organizer.displayName}
                        </h3>
                        <h5 className=" text-md">{organizer.companyName} </h5>
                      </div>
                    </Flex>
                    <div>
                      <ArrowRight className="text-neutral-400" />
                    </div>
                  </Flex>
                </Card>
              </Link>
            ))}
          </Grid>
        </section>
        <div className="flex justify-center py-8">
          {organizers && (
            <SimplePagination
              pagination={organizers.page}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default StaffDashBoard;
