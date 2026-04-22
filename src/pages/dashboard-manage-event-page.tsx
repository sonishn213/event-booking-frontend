import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
import {
  CreateEventRequest,
  CreateTicketTypeRequest,
  EventDetails,
  EventStatusEnum,
  UpdateEventRequest,
  UpdateTicketTypeRequest,
} from "@/domain/domain";
import { createEvent, getEvent, updateEvent } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  Edit,
  Plus,
  Ticket,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

import { AdminLayout } from "@/components/admin-layout";
import {Text,Box,Flex,Button, Heading,Badge,DropdownMenu,IconButton,AlertDialog,Card,TextArea,Dialog,Callout,Select} from "@radix-ui/themes";


interface DateTimeSelectProperties {
  date: Date | undefined;
  setDate: (date: Date) => void;
  time: string | undefined;
  setTime: (time: string) => void;
  enabled: boolean;
  setEnabled: (isEnabled: boolean) => void;
}

const DateTimeSelect: React.FC<DateTimeSelectProperties> = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Switch checked={enabled} onCheckedChange={setEnabled} />

      {enabled && (
        <div className="w-full flex gap-2">
          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="soft" color="gray">
                <CalendarIcon size="16"/>
                {date ? format(date, "PPP") : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (!selectedDate) {
                    return;
                  }
                  const displayedYear = selectedDate.getFullYear();
                  const displayedMonth = selectedDate.getMonth();
                  const displayedDay = selectedDate.getDate();

                  const correctedDate = new Date(
                    Date.UTC(displayedYear, displayedMonth, displayedDay),
                  );

                  setDate(correctedDate);
                }}
                className="rounded-md border shadow "
              />
            </PopoverContent>   
          </Popover>
          {/* Time */}
          <div className="flex gap-2 items-center">
            <Input
              type="time"
              className="w-[90px] bg-gray-200"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id: string | undefined) => id && id.startsWith("temp_");

interface TicketTypeData {
  id: string | undefined;
  name: string;
  price: number;
  totalAvailable?: number;
  description: string;
}

interface EventData {
  id: string | undefined;
  name: string;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
  venueDetails: string;
  salesStartDate: Date | undefined;
  salesStartTime: string | undefined;
  salesEndDate: Date | undefined;
  salesEndTime: string | undefined;
  ticketTypes: TicketTypeData[];
  status: EventStatusEnum;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

const DashboardManageEventPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventData>({
    id: undefined,
    name: "",
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: "",
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatusEnum.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState<
    TicketTypeData | undefined
  >();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);

  const [error, setError] = useState<string | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof EventData, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token) {
      const fetchEvent = async () => {
        const event: EventDetails = await getEvent(user.access_token, id);
        setEventData({
          id: event.id,
          name: event.name,
          startDate: event.start,
          startTime: event.start
            ? formatTimeFromDate(new Date(event.start))
            : undefined,
          endDate: event.end,
          endTime: event.end
            ? formatTimeFromDate(new Date(event.end))
            : undefined,
          venueDetails: event.venue,
          salesStartDate: event.salesStart,
          salesStartTime: event.salesStart
            ? formatTimeFromDate(new Date(event.salesStart))
            : undefined,
          salesEndDate: event.salesEnd,
          salesEndTime: event.salesEnd
            ? formatTimeFromDate(new Date(event.salesEnd))
            : undefined,
          status: event.status,
          ticketTypes: event.ticketTypes.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            totalAvailable: ticket.totalAvailable,
          })),
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
        setEventDateEnabled(!!(event.start || event.end));
        setEventSalesDateEnabled(!!(event.salesStart || event.salesEnd));
      };
      fetchEvent();
    }
  }, [id, user]);

  const formatTimeFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time
      .split(":")
      .map((num) => Number.parseInt(num, 10));

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);

    const utcResult = new Date(
      Date.UTC(
        combinedDateTime.getFullYear(),
        combinedDateTime.getMonth(),
        combinedDateTime.getDate(),
        hours,
        minutes,
        0,
        0,
      ),
    );

    return utcResult;
  };

  const handleEventUpdateSubmit = async (accessToken: string, id: string) => {
    const ticketTypes: UpdateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          id: isTempId(ticketType.id) ? undefined : ticketType.id,
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: UpdateEventRequest = {
      id: id,
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await updateEvent(accessToken, id, request);
      navigate("/dashboard/events");
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

  const handleEventCreateSubmit = async (accessToken: string) => {
    const ticketTypes: CreateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: CreateEventRequest = {
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await createEvent(accessToken, request);
      navigate("/dashboard/events");
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !user || !user.access_token) {
      console.error("User not found!");
      return;
    }

    if (isEditMode) {
      if (!eventData.id) {
        setError("Event does not have an ID");
        return;
      }
      await handleEventUpdateSubmit(user.access_token, eventData.id);
    } else {
      await handleEventCreateSubmit(user.access_token);
    }
  };

  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: "",
      price: 0,
      totalAvailable: 0,
      description: "",
    });
    setDialogOpen(true);
  };

  const handleSaveTicketType = () => {
    if (!currentTicketType) {
      return;
    }

    const newTicketTypes = [...eventData.ticketTypes];

    if (currentTicketType.id) {
      const index = newTicketTypes.findIndex(
        (t) => t.id === currentTicketType.id,
      );
      if (index !== -1) {
        newTicketTypes[index] = currentTicketType;
      }
    } else {
      newTicketTypes.push({
        ...currentTicketType,
        id: generateTempId(),
      });
    }

    updateField("ticketTypes", newTicketTypes);
    setDialogOpen(false);
  };

  const handleEditTicketType = (ticketType: TicketTypeData) => {
    setCurrentTicketType(ticketType);
    setDialogOpen(true);
  };

  const handleDeleteTicketType = (id: string | undefined) => {
    if (!id) {
      return;
    }
    updateField(
      "ticketTypes",
      eventData.ticketTypes.filter((t) => t.id !== id),
    );
  };

  return (
    <AdminLayout>
      <AdminLayout.Body>
          <Box mb="6">
            <Flex justify="between">
              <Heading>
                  {isEditMode ? "Edit Event" : "Create a New Event"}
              </Heading>
            </Flex>
            <div>
              {isEditMode && (
              <>
                {eventData.id && (
                  <Text as="p" size="2" className=" text-gray-400">
                    ID: {eventData.id}
                  </Text>
                )}

                {eventData.createdAt && (
                  <Text as="p" size="2"className="text-gray-400">
                    Created At: {format(eventData.createdAt, "PPP")}
                  </Text>
                )}

                {eventData.updatedAt && (
                  <Text as="p" size="2" className= "text-gray-400">
                    Updated At: {format(eventData.updatedAt, "PPP")}
                  </Text>
                )}
              </>
            )}

            {!isEditMode && (
              <p>Fill out the form below to create your event</p>
            )}
            </div>
          </Box>
          <Box>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <Card size="3" variant="surface" className=" space-y-4">
                  {/* Event Name */}
                <div className="mb-2">
                  <div>
                    <Label htmlFor="event-name" className="mb-2">Event Name</Label>
                    <Input
                      id="event-name"
                      placeholder="Event Name"
                      value={eventData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-gray-400 text-xs">
                    This is the public name of your event.
                  </p>
                </div>

                 <div>
                  <label htmlFor="venue-details" className="text-sm font-medium">
                    Venue Details
                  </label>
                  <TextArea
                    id="venue-details"
                    className=" min-h-[100px]"
                    value={eventData.venueDetails}
                    onChange={(e) => updateField("venueDetails", e.target.value)}
                  />
                  <p className="text-gray-400 text-xs">
                    Details about the venue, please include as much detail as
                    possible.
                  </p>
                </div>
              </Card>

              <Card size="3" variant="surface" className=" space-y-4">
                
                {/* Event Start Date Time */}
                <Flex className="mb-2" gap="9" align="center">
                  <div >
                    <label className="text-sm font-medium">Event Start</label>
                    <DateTimeSelect
                      date={eventData.startDate}
                      setDate={(date) => updateField("startDate", date)}
                      time={eventData.startTime}
                      setTime={(time) => updateField("startTime", time)}
                      enabled={eventDateEnabled}
                      setEnabled={setEventDateEnabled}
                    />
                    <p className="text-gray-400 text-xs">
                      The date and time that the event starts.
                    </p>
                  </div>

                  {/* Event End Date Time */}
                  <div >
                    <label className="text-sm font-medium">Event End</label>
                    <DateTimeSelect
                      date={eventData.endDate}
                      setDate={(date) => updateField("endDate", date)}
                      time={eventData.endTime}
                      setTime={(time) => updateField("endTime", time)}
                      enabled={eventDateEnabled}
                      setEnabled={setEventDateEnabled}
                    />
                    <p className="text-gray-400 text-xs">
                      The date and time that the event ends.
                    </p>
                  </div>
                </Flex>

              </Card>


              <Card size="3" variant="surface" className="space-y-4">
                <Flex className="mb-2" gap="9" align="center">
                  {/* Event Sales Start Date Time */}
                  <div>
                    <label className="text-sm font-medium">Event Sales Start</label>
                    <DateTimeSelect
                      date={eventData.salesStartDate}
                      setDate={(date) => updateField("salesStartDate", date)}
                      time={eventData.salesStartTime}
                      setTime={(time) => updateField("salesStartTime", time)}
                      enabled={eventSalesDateEnabled}
                      setEnabled={setEventSalesDateEnabled}
                    />
                    <p className="text-gray-400 text-xs">
                      When tickets go on sale
                    </p>
                  </div>

                  {/* Event Sales End Date Time */}
                  <div>
                    <label className="text-sm font-medium">Event Sales End</label>
                    <DateTimeSelect
                      date={eventData.salesEndDate}
                      setDate={(date) => updateField("salesEndDate", date)}
                      time={eventData.salesEndTime}
                      setTime={(time) => updateField("salesEndTime", time)}
                      enabled={eventSalesDateEnabled}
                      setEnabled={setEventSalesDateEnabled}
                    />
                    <p className="text-gray-400 text-xs">
                      When tickets sale ends
                    </p>
                  </div>
                </Flex>
              </Card>


              <Box>
              {/* Ticket Types */}
                <div className="mt-4">
                  <Card size="2">
                    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                        <Flex justify="between" className="mb-3">
                          <Text weight="bold" className="flex gap-2 items-center">
                            <Ticket />
                            Ticket Types
                          </Text>
                          <Button 
                          type="button"
                          variant="soft"
                           onClick={() => handleAddTicketType()}>
                            <Plus /> Add Ticket Type
                          </Button>
                        </Flex>

                        {eventData.ticketTypes.map((ticketType) => {
                          return (
                            <Card>
                              <div className="flex justify-between items-center">
                                {/* Left */}
                                <div>
                                  <div className="flex gap-4">
                                    <Text weight="bold">
                                      {ticketType.name}
                                    </Text>
                                    <Badge color="grass" variant="outline">
                                      ${ticketType.price}
                                    </Badge>
                                  </div>
                                  {ticketType.totalAvailable && (
                                    <p className="text-gray-400">
                                      {ticketType.totalAvailable} tickets available
                                    </p>
                                  )}
                                </div>
                                {/* Right */}
                                <div className="flex gap-2">
                                  <IconButton
                                    variant="ghost"
                                    onClick={() => handleEditTicketType(ticketType)}
                                  >
                                    <Edit width="18"/>
                                  </IconButton>
                                  <IconButton
                                    variant="ghost"
                                    color="red"
                                    onClick={() =>
                                      handleDeleteTicketType(ticketType.id)
                                    }
                                  >
                                    <Trash width="18"/>
                                  </IconButton>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      <Dialog.Content >
                          <Dialog.Title mb="1">Add Ticket Type</Dialog.Title>
                          <Dialog.Description className="text-gray-400">
                            Please enter details of the ticket type
                          </Dialog.Description>

                        <div className="space-y-5 mt-4">
                        {/* Ticket Type Name */}
                        <div className="space-y-2">
                          <Label htmlFor="ticket-type-name">Name</Label>
                          <Input
                            id="ticket-type-name"
                            value={currentTicketType?.name}
                            onChange={(e) =>
                              setCurrentTicketType(
                                currentTicketType
                                  ? { ...currentTicketType, name: e.target.value }
                                  : undefined,
                              )
                            }
                            placeholder="e.g General Admission, VIP, etc."
                          />
                        </div>

                        <div className="flex gap-4">
                          {/* Price */}
                          <div className="space-y-2 w-full">
                            <Label htmlFor="ticket-type-price">Price</Label>
                            <Input
                              id="ticket-type-price"
                              type="number"
                              value={currentTicketType?.price}
                              onChange={(e) =>
                                setCurrentTicketType(
                                  currentTicketType
                                    ? {
                                        ...currentTicketType,
                                        price: Number.parseFloat(e.target.value),
                                      }
                                    : undefined,
                                )
                              }
                            />
                          </div>

                          {/* Total Available */}
                          <div className="space-y-2 w-full">
                            <Label htmlFor="ticket-type-total-available">
                              Total Available
                            </Label>
                            <Input
                              id="ticket-type-total-available"
                              type="number"
                              value={currentTicketType?.totalAvailable}
                              onChange={(e) =>
                                setCurrentTicketType(
                                  currentTicketType
                                    ? {
                                        ...currentTicketType,
                                        totalAvailable: Number.parseFloat(
                                          e.target.value,
                                        ),
                                      }
                                    : undefined,
                                )
                              }
                            />
                          </div>
                        </div>

                        {/* Ticket Type Description */}
                        <div className="space-y-1">
                          <Label htmlFor="ticket-type-description">Description</Label>
                          <TextArea
                            id="ticket-type-description"
                            value={currentTicketType?.description}
                            onChange={(e) =>
                              setCurrentTicketType(
                                currentTicketType
                                  ? {
                                      ...currentTicketType,
                                      description: e.target.value,
                                    }
                                  : undefined,
                              )
                            }
                          />
                        </div>
                        <Flex justify="end" gap="2">
                          <Dialog.Close>
                            <Button variant="soft" color="gray">
                              Cancel
                            </Button>
                          </Dialog.Close>
                          <Button type="button"
                            onClick={handleSaveTicketType}
                          >
                            Save
                          </Button>
                        </Flex>
                        
                        </div>

                      </Dialog.Content>
                    </Dialog.Root>
                  </Card>
                </div>
              </Box>


              {/* Status */}
              <div className="space-y-1">
                <Label>Status</Label>
                <Select.Root
                  value={eventData.status}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <Select.Trigger 
                    
                    placeholder="Select Event Status"
                  />

                  <Select.Content>
                    <Select.Item value={EventStatusEnum.DRAFT}>Draft</Select.Item>
                    <Select.Item value={EventStatusEnum.PUBLISHED}>
                      Published
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
                <p className="text-gray-400 text-xs">
                  Please select the status of the new event.
                </p>
              </div>

        
              {error && (
                <Callout.Root variant="soft" color="red"  className="my-3">
                <Callout.Icon>
                  <AlertCircle className="h-4 w-4" />
                </Callout.Icon>
                  <Callout.Text><Text weight="bold">Error :</Text> {error}</Callout.Text>
                </Callout.Root>
              )}

              <div>
                <Button onClick={handleFormSubmit}>
                  {isEditMode ? "Update" : "Submit"}
                </Button>
              </div>

            </form>
          </Box>

      </AdminLayout.Body>
    </AdminLayout>
    
  );
};

export default DashboardManageEventPage;
