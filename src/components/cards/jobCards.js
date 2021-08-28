import { Badge, Avatar } from "@windmill/react-ui";

const JobCards = (props) => {
  const { position, talentName, id, active, onClick, jobStatus } = props;

  return (
    <li onClick={onClick} className="cursor-pointer">
      <div className="bg-white border relative px-5 py-5">
        {active && (
          <>
            <span
              className="absolute inset-y-0 left-0 w-1  bg-blue rounded-tr-lg rounded-br-lg"
              aria-hidden="true"
            ></span>
            <span
              className="absolute inset-y-0 left-0 w-1  bg-blue rounded-tr-lg rounded-br-lg"
              aria-hidden="true"
            ></span>
          </>
        )}
        <div className="grid grid-cols-5">
          <div className="col-span-3">
            <h1 className="font-bold">{position}</h1>
            <span className="text-xs text-gray-400">{talentName}</span>
            <br />
            <span className="text-xs text-gray-300">Job #{id}</span>
          </div>
          <div className="col-span-2 text-right">
            {/*
            <Avatar
              src="https://g.foolcdn.com/art/companylogos/square/jpm.png"
              size="large"
            />
            <br />
            */}
            <Badge type={jobStatus === "ACTIVE" ? "success" : "danger"}>
              {jobStatus}
            </Badge>
          </div>
        </div>
      </div>
    </li>
  );
};

export default JobCards;
