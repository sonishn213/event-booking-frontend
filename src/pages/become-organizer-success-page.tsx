import { Button, Card, Heading } from "@radix-ui/themes";
import { Link, useNavigate, useParams } from "react-router";

const BecomeOrganizerSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { passcode } = useParams();

  //check the passcode
  checkPassCode(passcode);

  localStorage.removeItem("becomeOrganizerSuccessPassCode");

  function checkPassCode(passcode: string | undefined) {
    const savedPasscode: string | null = localStorage.getItem(
      "becomeOrganizerSuccessPassCode",
    );

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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem magni
              minus ea voluptate quaerat beatae assumenda vel porro dolorem sunt
              soluta doloribus illum, quas iusto dolor accusantium tempore,
              repudiandae temporibus!
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

export default BecomeOrganizerSuccessPage;
