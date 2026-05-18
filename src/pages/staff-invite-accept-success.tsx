import { Button, Card, Heading } from "@radix-ui/themes";
import { Link, useNavigate, useParams } from "react-router";

const StaffInviteAcceptSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { passcode } = useParams();

  //check the passcode
  checkPassCode(passcode);
  const key = "staffInviteAcceptSuccess";

  localStorage.removeItem(key);

  function checkPassCode(passcode: string | undefined) {
    const savedPasscode: string | null = localStorage.getItem(key);

    if (!savedPasscode || savedPasscode != passcode) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 ">
      <div className="max-w-full md:max-w-lg px-4 mx-auto">
        <Card size="3">
          <div className="text-center">
            <img src="/confetti.png" className="w-16 inline-block mb-4" />
            <Heading size="7" className="font-user">
              Congratulations!
            </Heading>
            <p className="mb-6 mt-3">
              You are a staff now, you can validate the tickets of audience
              attending the events for your organization
            </p>

            <Link to="/dashboard">
              <Button className="font-user" radius="full">
                Go To DASHBOARD
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StaffInviteAcceptSuccess;
