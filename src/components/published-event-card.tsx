import { PublishedEventSummary } from "@/domain/domain";
import { Card, Flex, Inset } from "@radix-ui/themes";
import { Calendar, Heart, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  const displayDate =
    publishedEvent.start && publishedEvent.end
      ? format(publishedEvent.start, "PP") +
        " " +
        format(publishedEvent.end, "PP")
      : "Dates TBD";

  return (
    <Link to={`/events/${publishedEvent.id}`}>
      <Card size="2">
        {/* Card Image */}
        <div className="  overflow-hidden rounded-lg mb-3">
          <RandomEventImage />
        </div>
        <div>
          <h3 className="text-2xl font-bold  mb-6 capitalize">
            {publishedEvent.name}
          </h3>

          <div className="text-gray-700 capitalize">
            <Flex gap="2" align="center" mb="2" className="">
              <MapPin size="16" /> {publishedEvent.venue}
            </Flex>
            <div className="flex gap-2 text-sm  ">
              <Flex gap="2" align="center" className="">
                <Calendar size="16" />
                {displayDate}
              </Flex>
            </div>
            {/* <div className="flex justify-between p-2 border-t text-gray-500">
            <button className="cursor-pointer">
              <Heart />
            </button>
            <button className="cursor-pointer">
              <Share2 />
            </button>
          </div> */}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;
