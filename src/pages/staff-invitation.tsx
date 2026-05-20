import { inviteAcceptStaff } from "@/lib/api";
import { Button, Card, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

const StaffInvitation: React.FC = () => {
  const { isLoading, user, signinRedirect } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const { invitationId } = useParams();

  const handleSubmit = async () => {
    if (isLoading || !user || !user.access_token || !invitationId) {
      console.error("User not found!");
      return;
    }

    try {
      setSubmitLoading(true);
      await inviteAcceptStaff(user?.access_token, invitationId);
      setSubmitLoading(false);
      //generate success token
      const key = "staffInviteAcceptSuccess";
      const passcode: string = uuidv4();
      const redirectUrl: string = `http://localhost:5173/invitation/success/${passcode}`;
      localStorage.setItem(key, passcode);
      await signinRedirect({ redirect_uri: redirectUrl });

    } catch (err) {
      setSubmitLoading(false);
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
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 ">
      <div className="max-w-full md:max-w-lg px-4 mx-auto">
        <Card size="3">
          <div className="text-center">
            <img src="/invitation.png" className="w-16 inline-block mb-4" />
            <Heading size="7" className="font-user">
              You have a Invitation!
            </Heading>
            <p className="mb-6 mt-3">
              You have been invited to become a staff, would you like to accept
              the invitation
            </p>
            <p className="text-red-600 text-sm">{error}</p>

            <Button
              color="grass"
              className="font-user"
              radius="full"
              disabled={submitLoading}
              onClick={() => handleSubmit()}
            >
              ACCEPT
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StaffInvitation;
