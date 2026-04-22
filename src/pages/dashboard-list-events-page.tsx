import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {Box,Flex,Button, Heading,Table,Badge,DropdownMenu,IconButton,AlertDialog} from "@radix-ui/themes";

import {
  EventSummary,
  EventStatusEnum,
  PaginationResponse,
} from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {  AlertCircle,  Calendar,  Clock,  Edit,  MapPin,  Tag,  Trash,  Plus, Ellipsis, CopyPlus} 
from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";
import { AdminLayout } from "@/components/admin-layout";

const DashboardListEventsPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState<
    PaginationResponse<EventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<
    string | undefined
  >();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<
    EventSummary | undefined
  >();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    refreshEvents(user.access_token);
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
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

  const formatDate = (date?: Date) => {
    if (!date) {
      return "TBD";
    }
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) {
      return "";
    }
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "gray";
      case EventStatusEnum.PUBLISHED:
        return "grass";
      case EventStatusEnum.CANCELLED:
        return "red";
      case EventStatusEnum.COMPLETED:
        return "blue";
      default:
        return "purple";
    }
  };

  const handleOpenDeleteEventDialog = (eventToDelete: EventSummary) => {
    setEventToDelete(undefined);
    setEventToDelete(eventToDelete);
    setDialogOpen(true);
  };

  const handleCancelDeleteEventDialog = () => {
    setEventToDelete(undefined);
    setEventToDelete(undefined);
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) {
      return;
    }

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteEventError(err.message);
      } else if (typeof err === "string") {
        setDeleteEventError(err);
      } else {
        setDeleteEventError("An unknown error has occurred");
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
    <AdminLayout>
      <AdminLayout.Body>
          <Box mb="6">
            <Flex justify="between">
              <Heading>
                 Your Events
              </Heading>
              <Link to="/dashboard/events/create" >
                <Button variant="soft">
                  <Plus />  Add New
                </Button>
              </Link>
            </Flex>
          </Box>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Schedule</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Sales Period</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Venue</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">Action</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {events?.content.map((eventItem) => (
                <Table.Row>
                  <Table.RowHeaderCell>
                      <div className="max-w-xs text-wrap">
                        {eventItem.name}
                      </div>
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                  <div>
                    <p className="font-medium">
                      {formatDate(eventItem.start)} to{" "}
                      {formatDate(eventItem.end)}
                    </p>
                    <p className="text-gray-400">
                      {formatTime(eventItem.start)} -{" "}
                      {formatTime(eventItem.end)}
                    </p>
                  </div>
                </div>
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(eventItem.salesStart)} to{" "}
                    {formatDate(eventItem.salesEnd)}
                  </Table.Cell>
                  <Table.Cell>{eventItem.venue}</Table.Cell>
                  <Table.Cell>
                      <Badge color={getStatusColor(eventItem.status)}>
                        {eventItem.status}
                      </Badge>
                  </Table.Cell>
                  <Table.Cell align="center">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <IconButton  variant="ghost" color="gray">
                            <Ellipsis size="16"/>
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content variant="soft">
                            <Link to={`/dashboard/events/update/${eventItem.id}`}>
                          <DropdownMenu.Item color="gray">
                              <Edit size="14"/>Edit
                          </DropdownMenu.Item>
                            </Link>
                          <DropdownMenu.Item  color="gray">
                            <CopyPlus size="14"/>Duplicate
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item  
                            color="red" 
                            onClick={() => handleOpenDeleteEventDialog(eventItem)}
                          >
                            <Trash size="14"/>Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <div className="flex justify-center py-8">
            {events && (
              <SimplePagination pagination={events.page} onPageChange={setPage} />
            )}
          </div>
          <AlertDialog.Root open={dialogOpen}>
        <AlertDialog.Content>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This will delete your event '{eventToDelete?.name}' and cannot be
              undone.
            </AlertDialog.Description>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )} 
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel onClick={handleCancelDeleteEventDialog}>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action onClick={() => handleDeleteEvent()}>
               <Button color="red">
                  Continue
               </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      </AdminLayout.Body>
    </AdminLayout>
    
  );
};

export default DashboardListEventsPage;
