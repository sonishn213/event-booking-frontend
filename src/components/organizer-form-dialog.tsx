import { BecomeOrganizerRequest } from "@/domain/domain";
import { becomeOrganizer } from "@/lib/api";
import {
  Button,
  Callout,
  Dialog,
  Flex,
  Heading,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";
import { v4 as uuidv4 } from "uuid";

type RootProps = {
  children: React.ReactNode;
};

const OrganizerFormDialog: React.FC<RootProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  const deactivate = (e: Event) => e.preventDefault();

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>{children}</Dialog.Trigger>

        <Dialog.Content
          maxWidth="550px"
          onInteractOutside={deactivate}
          onPointerDownOutside={deactivate}
          onEscapeKeyDown={deactivate}
        >
          {/* <Dialog.Title>Become Organizer</Dialog.Title> */}
          <Dialog.Description size="2" mb="6">
            Please fill in the following details. This information is required
            to generate invoices and manage payments efficiently.
          </Dialog.Description>
          <TheForm setOpen={setOpen} />
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

type TheFormProps = {
  setOpen: Function;
};

interface CompanyData {
  companyName: string;
  displayName: string;
  companyEmail: string;
  companyPhone: string;
  gstNumber: string;
  address: string;
}

const TheForm: React.FC<TheFormProps> = ({ setOpen }) => {
  const { isLoading, user, signinSilent, signinRedirect } = useAuth();

  const [error, setError] = useState<string | undefined>();
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: "",
    displayName: "",
    companyEmail: "",
    companyPhone: "",
    gstNumber: "",
    address: "",
  });

  const updateField = (field: keyof CompanyData, value: any) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !user || !user.access_token) {
      console.error("User not found!");
      return;
    }

    const request: BecomeOrganizerRequest = {
      companyName: companyData.companyName,
      companyEmail: companyData.companyEmail,
      companyPhone: companyData.companyPhone,
      displayName: companyData.displayName,
      address: companyData.address,
      gstNumber: companyData.gstNumber,
    };

    try {
      await becomeOrganizer(user.access_token, request);
      // navigate("/dashboard/events");
      //trigger confirmed event
      const passcode: string = uuidv4();
      const redirectUrl: string = `http://localhost:5173/become-organizer/success/${passcode}`;
      localStorage.setItem("becomeOrganizerSuccessPassCode", passcode);
      await signinRedirect({ redirect_uri: redirectUrl });
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

  async function atest() {}

  return (
    <>
      <button onClick={() => atest()}>TEST</button>
      <Flex direction="column" gap="4">
        <Flex gap="4">
          <div className="grow">
            <Text as="div" size="2" mb="1" weight="bold">
              Company Name
            </Text>
            <TextField.Root
              placeholder="Enter the full company name"
              value={companyData.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
            />
          </div>
          <div className="grow">
            <Text as="div" size="2" mb="1" weight="bold">
              Display Name
            </Text>
            <TextField.Root
              placeholder="Enter display name"
              value={companyData.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
            />
          </div>
        </Flex>
        <Flex gap="4">
          <div className="grow">
            <Text as="div" size="2" mb="1" weight="bold">
              Company Email
            </Text>
            <TextField.Root
              placeholder="Enter company email"
              value={companyData.companyEmail}
              onChange={(e) => updateField("companyEmail", e.target.value)}
            />
          </div>
          <div className="grow">
            <Text as="div" size="2" mb="1" weight="bold">
              Company Phone Number
            </Text>
            <TextField.Root
              placeholder="Enter company phone number"
              value={companyData.companyPhone}
              onChange={(e) => updateField("companyPhone", e.target.value)}
            />
          </div>
        </Flex>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            GST Number
          </Text>
          <TextField.Root
            placeholder="Enter GST number"
            value={companyData.gstNumber}
            onChange={(e) => updateField("gstNumber", e.target.value)}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Address
          </Text>
          <TextArea
            placeholder="Enter Address"
            value={companyData.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </label>
      </Flex>

      {error && (
        <Callout.Root variant="soft" color="red" className="my-3">
          <Callout.Icon>
            <AlertCircle className="h-4 w-4" />
          </Callout.Icon>
          <Callout.Text>
            <Text weight="bold">Error :</Text> {error}
          </Callout.Text>
        </Callout.Root>
      )}

      <Flex gap="3" mt="4" justify="end">
        <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        {/* <Dialog.Close> */}
        <Button onClick={handleFormSubmit}>Confirm</Button>
        {/* </Dialog.Close> */}
      </Flex>
    </>
  );
};

export default OrganizerFormDialog;
