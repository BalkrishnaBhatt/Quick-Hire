import { useState } from "react";
import { Button, Input, Label } from "@windmill/react-ui";
import { LockIcon } from "icons";

const ChangePassword = (props) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="shadow">
      {/*
      INITIAL VIEW
      */}
      <div className="text-right bg-gray-100 py-5 px-5" hidden={showForm}>
        <Button
          className="bg-blue"
          size="small"
          iconLeft={LockIcon}
          onClick={() => setShowForm(true)}
        >
          {" "}
          Change Password
        </Button>
      </div>
      <div className="py-5 px-5" hidden={showForm}>
        <span>
          <span className="text-gray-400">Login:</span> Many.wong@gmail.com
        </span>
      </div>

      {/*SHOW FORM VIEW*/}
      <div className="text-right bg-blue py-5 px-5" hidden={!showForm}>
        <Button
          className="blue mr-3"
          style={{ backgroundColor: "white" }}
          size="small"
          onClick={() => setShowForm(false)}
        >
          Save Changes
        </Button>
        <Button
          style={{ backgroundColor: "white", color: "black" }}
          size="small"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </Button>
      </div>
      <div className="py-5 px-5" hidden={!showForm}>
        <form>
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Login</span>
            <Input
              type="email"
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              autoFocus
              name="email"
            />
          </Label>

          <Label className="mb-4">
            <span className="text-xs text-gray-400">Present Password</span>
            <Input
              type="email"
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              autoFocus
              name="presentPassword"
            />
          </Label>

          <Label className="mb-4">
            <span className="text-xs text-gray-400">New Password</span>
            <Input
              type="password"
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              autoFocus
              name="newPassword"
            />
          </Label>

          <Label className="mb-4">
            <span className="text-xs text-gray-400">Confirm Password</span>
            <Input
              type="password"
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              autoFocus
              name="confirmPassword"
            />
          </Label>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
