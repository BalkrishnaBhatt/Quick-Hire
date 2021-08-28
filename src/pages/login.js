import { useState } from "react";
import { Input, Label, Button } from "@windmill/react-ui";
import { EyeIcon, EyeOffIcon } from "icons";

import PublicContainer from "../containers/PublicContainer";

const Login = (props) => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [showPassword, setShowpassword] = useState(false);

  const inputChangehandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs({ ...inputs, [name]: value });
  };

  const submitLogin = (e) => {
    e.preventDefault();
    console.log(inputs);
    props.history.push("/home/jobs");
  };

  return (
    <PublicContainer>
      <div className="w-full">
        <div className="text-center mb-10">
          <h1
            className="text-md font-semibold text-center"
            style={{ color: "#3e5eb8" }}
          >
            SUPERECRUITER
          </h1>
          <span className="text-xs text-gray-400 font-semibold">LOGIN</span>
        </div>
        <form onSubmit={submitLogin}>
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Email</span>
            <Input
              type="email"
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              autoFocus
              onChange={inputChangehandler}
              value={inputs.email}
              name="email"
            />
          </Label>
          <Label>
            <span className="text-xs text-gray-400">Password</span>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="mt-1 h-8 rounded border px-4 active-border-blue"
                onChange={inputChangehandler}
                name="password"
                value={inputs.password}
              />
              {showPassword ? (
                <EyeIcon
                  className="h-5 w-5 text-gray-400 absolute right-2 bottom-1 cursor-pointer"
                  onClick={() => setShowpassword(!showPassword)}
                />
              ) : (
                <EyeOffIcon
                  className="h-5 w-5 text-gray-400 absolute right-2 bottom-1 cursor-pointer"
                  onClick={() => setShowpassword(!showPassword)}
                />
              )}{" "}
            </div>
          </Label>
          <Button
            className="mt-5 w-full"
            disabled={!inputs.email || !inputs.password}
            type="submit"
            style={{ backgroundColor: "#3e5eb8" }}
          >
            Login
          </Button>
        </form>
        <hr className="my-4" />
        <div className="text-center">
          <span
            className="mx-auto text-xs text-gray-400 cursor-pointer"
            onClick={() => props.history.push("/forgot-password")}
          >
            Forgot your password?
          </span>
        </div>
      </div>
    </PublicContainer>
  );
};

export default Login;
