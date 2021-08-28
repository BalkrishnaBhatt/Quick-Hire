import { useState } from "react";
import { Input, Label, Button } from "@windmill/react-ui";

import PublicContainer from "../containers/PublicContainer";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");

  const submitForgotPasswordEmail = (e) => {
    e.preventDefault();
    console.log(email);
    props.history.push("/reset-password");
  };

  return (
    <PublicContainer>
      <div className="w-full">
        <div className="text-center mb-12  text-gray-500">
          <div className="text-center mb-10">
            <h1
              className="text-md font-semibold text-center"
              style={{ color: "#3e5eb8" }}
            >
              SUPERECRUITER
            </h1>
            <span className="text-xs text-gray-400 font-semibold">
              FORGOT PASSWORD
            </span>
          </div>
        </div>
        <form onSubmit={submitForgotPasswordEmail}>
          <Label>
            <span className="text-xs text-gray-400">Email</span>
            <Input
              type="email"
              className="mt-1 h-8 rounded border px-4 active-border-brown"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
          <Button
            className="mt-5 w-full bg-blue"
            disabled={!email}
            type="submit"
          >
            Confirm
          </Button>
        </form>
        <hr className="my-4" />

        <div className="text-center">
          <span className="mx-auto text-xs text-gray-400">
            Please check your mailbox for reset password email from
            Superecruiter Platform
          </span>
        </div>
      </div>
    </PublicContainer>
  );
};

export default ForgotPassword;
