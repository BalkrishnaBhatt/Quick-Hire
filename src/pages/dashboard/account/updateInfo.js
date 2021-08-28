import { useState } from "react";

import { Button, Input, Label, Badge, Avatar } from "@windmill/react-ui";
import { PencilIcon } from "icons";

const UpdateInfo = (props) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="shadow">
      <div className="text-right bg-gray-100 py-5 px-5" hidden={showForm}>
        <Button
          className="border-blue blue"
          size="small"
          iconLeft={PencilIcon}
          layout="outline"
          onClick={() => setShowForm(true)}
        >
          Update
        </Button>
      </div>
      <div className="py-5 px-5" hidden={showForm}>
        <div className="flex justify-between">
          <div>
            <span className="font-bold">Manny Wong</span>
            <Badge type="success" className="ml-4">
              active
            </Badge>
            <span className="text-xs text-gray-300 block">Talent #1234</span>
            <span className="text-xs text-gray-300 block">
              Created on 23 June 2020, 23:59
            </span>
            <span className="text-xs text-gray-300 block">
              Updated on 23 June 2020, 23:59
            </span>
          </div>
          <div>
            <Avatar
              className="align-middle w-20 h-20"
              src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm font-semibold block text-gray-500">
            User Info
          </span>
          <span className="text-xs text-gray-300 block">Phone: +123123</span>
          <span className="text-xs text-gray-300 block">Role: Manager</span>
          <span className="text-xs text-gray-300 block">Department: IT</span>
        </div>
        <div className="mt-4">
          <span className="text-sm font-semibold block text-gray-500">
            Contact info
          </span>
          <span className="text-xs text-gray-300 block">Phone: +123123</span>
          <span className="text-xs text-gray-300 block">
            Email: Manny.Wong@gmail.com
          </span>
        </div>
      </div>
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
      <div hidden={!showForm} className="px-8 py-8">
        <div className="grid grid-cols-5">
          <div className="col-span-3">
            <Label className="mb-4">
              <span className="text-xs text-gray-400">User Name</span>
              <Input
                type="email"
                className="mt-1 h-8 rounded border px-4 active-border-blue"
                autoFocus
                name="email"
                value="Manny Wong"
                disabled
              />
            </Label>
            <div className="flex justify-between">
              <span className="text-gray-400">Account status</span>
              <div>
                <Label radio>
                  <Input
                    type="radio"
                    checked
                    name="accountStatus"
                    className="border"
                  />
                  <span className="ml-1 mr-2 text-gray-400">Active</span>
                </Label>
                <Label radio>
                  <Input type="radio" name="accountStatus" className="border" />
                  <span className="ml-1 text-gray-400">Expired</span>
                </Label>
              </div>
            </div>
          </div>
          <div className="col-start-5">
            <Avatar
              className="align-middle w-20 h-20"
              src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="border w-full my-5" />
        <span className="text-sm text-gray-400">User Info</span>
        <div className="flex justify-around mt-2">
          <Label className="w-1/2">
            <span className="ml-1 mr-2 text-gray-400 text-xs">Company</span>
            <Input name="accountStatus" className="border rounded" />
          </Label>
          <Label className="w-1/2 ml-1">
            <span className="ml-1 mr-2 text-gray-400 text-xs">Department</span>
            <Input name="accountStatus" className="border rounded" />
          </Label>
        </div>
        <div className="border w-full my-5" />
        <span className="text-sm text-gray-400">Contact Info</span>
        <div className="flex justify-around mt-2">
          <Label className="w-1/2">
            <span className="ml-1 mr-2 text-gray-400 text-xs">Phone</span>
            <Input name="accountStatus" className="border rounded" />
          </Label>
          <Label className="w-1/2 ml-1">
            <span className="ml-1 mr-2 text-gray-400 text-xs">Email</span>
            <Input name="accountStatus" className="border rounded" />
          </Label>
        </div>
      </div>
    </div>
  );
};

export default UpdateInfo;
