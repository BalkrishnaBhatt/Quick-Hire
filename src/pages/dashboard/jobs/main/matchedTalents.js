import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Modal,
  ModalBody,
  Button,
  Dropdown,
  DropdownItem,
} from "@windmill/react-ui";
import { useState } from "react";

import { ExternalLinkIcon, PencilIcon, UploadIcon } from "icons";

import Tabs from "components/tabs";
import TalentProfile from "pages/dashboard/talents/main/TalentProfile";
import MatchedJobs from "pages/dashboard/talents/main/matchedJobs";
import MatchingActivities from "pages/dashboard/talents/main/matchingActivities";
import Resumes from "pages/dashboard/talents/main/Resumes";

const TalentModalContent = (props) => {
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);

  return (
    <div style={{ height: "500px" }} className="overflow-y-scroll w-full">
      <div className="h-16 bg-gray-100 py-4  px-4 mb-2">
        <div className="flex justify-between">
          <h1 className="font-bold text-gray-400">TALENT DETAILS</h1>
          <Button
            layout="outline"
            size="small"
            iconLeft={PencilIcon}
            className="blue border-blue px-5 h-6 ml-2"
            onClick={() => setIsUpdateDropdownOpen(true)}
          >
            Update
          </Button>
        </div>
        <div className="relative">
          <Dropdown
            isOpen={isUpdateDropdownOpen}
            align="right"
            onClose={() => setIsUpdateDropdownOpen(false)}
          >
            <DropdownItem>
              <span>
                <UploadIcon className="h-3 w-3 mr-2" />
              </span>
              <span>Upload Resume</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setIsUpdateDropdownOpen(false);
              }}
            >
              <span>
                <PencilIcon className="h-4 w-4 mr-1" />
              </span>
              <span>Edit Profile</span>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <Tabs
        tabList={[
          { name: "Profile", Component: TalentProfile },
          { name: "Resumes", Component: Resumes },
          { name: "Matched Jobs", Component: MatchedJobs },
          {
            name: "Matching Activities",
            Component: MatchingActivities,
          },
        ]}
      />
    </div>
  );
};

const MatchedTalents = (props) => {
  const [talentModalOpen, setTalentModalOpen] = useState(false);

  const matchedTalents = [];

  if (!matchedTalents.length) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height: "500px" }}
      >
        No talents engaged!
      </div>
    );
  }

  return (
    <>
      {/* TALENT MODAL*/}
      <Modal isOpen={talentModalOpen} onClose={() => setTalentModalOpen(false)}>
        <ModalBody>
          <TalentModalContent />
        </ModalBody>
      </Modal>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Matched Talents</TableCell>
            <TableCell>Score</TableCell>
            <TableCell style={{ width: '20%' }}>Match time</TableCell>
            <TableCell>Talent details</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[null, null, null].map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center text-xs">
                  <Avatar
                    src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                    alt="Judith"
                  />
                  <span className="ml-2">Judith Ipsum</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs">90%</span>
              </TableCell>
              <TableCell>
                <span className="text-xs">01/02/2020 23:59</span>
              </TableCell>
              <TableCell>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setTalentModalOpen(true);
                  }}
                >
                  <ExternalLinkIcon className="h-5 w-5 mx-auto" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MatchedTalents;
