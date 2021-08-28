import { useState } from "react";
import PublicContainer from "../containers/PublicContainer";
import { Input, Label, Button } from "@windmill/react-ui";

import { EyeIcon, EyeOffIcon } from "icons";

const ResetPassword = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const submitResetPassword = (e) => {
    e.preventDefault();
    console.log({ newPassword, confirmPassword });
    props.history.push("/");
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
              RESET PASSWORD
            </span>
          </div>
        </div>
        <form onSubmit={submitResetPassword}>
          <Label className="mb-4">
            <span className="text-xs text-gray-400">New Password</span>
            <div className="relative">
              <Input
                type={showPassword.newPassword ? "text" : "password"}
                className="mt-1 h-8 rounded border px-4 active-border-brown"
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {showPassword.newPassword ? (
                <EyeIcon
                  className="h-5 w-5 text-gray-400 absolute right-2 bottom-1 cursor-pointer"
                  onClick={() =>
                    setShowPassword({ ...showPassword, newPassword: false })
                  }
                />
              ) : (
                <EyeOffIcon
                  className="h-5 w-5 text-gray-400 absolute right-2 bottom-1 cursor-pointer"
                  onClick={() =>
                    setShowPassword({ ...showPassword, newPassword: true })
                  }
                />
              )}
            </div>
          </Label>
          <Label>
            <span className="text-xs text-gray-400">Confirm Password</span>
            <div className="relative">
              <Input
                type={showPassword.confirmPassword ? "text" : "password"}
                className="mt-1 h-8 rounded border px-4 active-border-brown"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {showPassword.confirmPassword ? (
                <EyeIcon
                  className="h-5 w-5 text-gray-400 absolute right-2 bottom-1 cursor-pointer"
                  onClick={() =>
                    setShowPassword({ ...showPassword, confirmPassword: false })
                  }
                />
              ) : (
                <EyeOffIcon
                  className="h-5 w-5 text-gray-400 absolute right-2 bottom-1 cursor-pointer"
                  onClick={() =>
                    setShowPassword({ ...showPassword, confirmPassword: true })
                  }
                />
              )}
            </div>
          </Label>
          <Button
            className="mt-5 w-full bg-blue"
            disabled={!confirmPassword || !newPassword}
            type="submit"
          >
            Confirm
          </Button>
        </form>
      </div>
    </PublicContainer>
  );
};

export default ResetPassword;
