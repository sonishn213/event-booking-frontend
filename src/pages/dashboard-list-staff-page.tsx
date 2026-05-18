import { AdminLayout } from "@/components/admin-layout";
import { inviteStaff } from "@/lib/api";
import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  TextField,
} from "@radix-ui/themes";
import { CheckCircle, CircleX, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

const DashboardListStaffPage = () => {
  const { isLoading, user } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState<string>();
  const [confirmationMsg, setConfirmationMsg] = useState<string | undefined>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (isLoading || !user || !user.access_token || !email) {
      console.error("User not found!");
      return;
    }

    try {
      setSubmitLoading(true);
      await inviteStaff(user?.access_token, email);
      setConfirmationMsg("Invitation sent successfully");
      setSubmitLoading(false);
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

  return (
    <AdminLayout>
      <AdminLayout.Body>
        <Box mb="6">
          <Flex justify="between">
            <Heading>Your Staffs</Heading>
            <Dialog.Root>
              <Dialog.Trigger>
                <Button variant="soft">
                  <Plus /> Invite
                </Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Invite Staff</Dialog.Title>
                <Dialog.Description>
                  Send invite through mail
                </Dialog.Description>
                <div className="mt-2">
                  <TextField.Root
                    placeholder="Enter the email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></TextField.Root>
                  {confirmationMsg && (
                    <p className="text-green-600 text-sm flex gap-2 items-center mt-1">
                      <CheckCircle size="16" /> {confirmationMsg}
                    </p>
                  )}

                  {error && (
                    <p className="text-red-600 text-sm flex gap-2 items-center mt-1">
                      <CircleX size="16" /> {error}
                    </p>
                  )}
                </div>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button
                      variant="soft"
                      color="gray"
                      disabled={submitLoading}
                    >
                      Cancel
                    </Button>
                  </Dialog.Close>
                  {/* <AlertDialog.Action onClick={() => handleDeleteEvent()}> */}
                  <Button
                    onClick={() => handleSubmit()}
                    disabled={submitLoading}
                  >
                    Confirm
                  </Button>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        </Box>
      </AdminLayout.Body>
    </AdminLayout>
  );
};

export default DashboardListStaffPage;
