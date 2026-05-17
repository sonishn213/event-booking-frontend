import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import ButtonAlt from "./ui/button-alt";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

type RootProps = {
  children: React.ReactNode;
};

const OrganizerFormDialog: React.FC<RootProps> = ({ children }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content maxWidth="550px">
        <Stepper />
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              defaultValue="Freja Johnsen"
              placeholder="Enter your full name"
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              defaultValue="freja@example.com"
              placeholder="Enter your email"
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const Stepper: React.FC = () => {
  const [currentValue, setCurrentValue] = useState<Value>(1);
  return (
    <div>
      <Flex align="center" justify="center" gap="9">
        <StepperHeaderItem
          value={1}
          currentValue={currentValue}
          number={1}
          label="Details"
          connector={true}
          completed={false}
          onClick={() => setCurrentValue(1)}
        />
        <StepperHeaderItem
          value={2}
          currentValue={currentValue}
          number={2}
          label="Address"
          connector={true}
          onClick={() => setCurrentValue(2)}
        />
        <StepperHeaderItem
          value={3}
          currentValue={currentValue}
          number={3}
          label="Finish"
          connector={false}
          onClick={() => setCurrentValue(3)}
        />
      </Flex>
    </div>
  );
};

type Value = number | string;

type StepperHeaderItemProps = {
  value: Value;
  currentValue: Value;
  connector: boolean;
  number: number;
  label: string | number;
  completed?: boolean;
  onClick: Function;
};

const StepperHeaderItem: React.FC<StepperHeaderItemProps> = ({
  value,
  currentValue,
  connector,
  number,
  label,
  completed,
  onClick,
}) => {
  const isActive = currentValue == value || completed;

  return (
    <div className="relative">
      <div className="text-center">
        <IconButton
          radius="full"
          variant={isActive ? "solid" : "soft"}
          onClick={() => onClick()}
        >
          {number}
        </IconButton>
        <div className="text-sm w-20">{label}</div>
      </div>
      {/* Connector  */}
      {connector && (
        <div className="absolute -right-[85%] top-3.5">
          <div
            className={clsx(
              "h-[1px] w-18",
              isActive ? "bg-orange-500" : "bg-orange-200",
            )}
          ></div>
        </div>
      )}
    </div>
  );
};

export default OrganizerFormDialog;
