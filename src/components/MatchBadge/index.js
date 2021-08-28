import { MatchStatuses } from "helpers/constants";
import { Badge } from "@windmill/react-ui";

const MatchBadge = ({ status, active }) => {
  switch (status) {
    case MatchStatuses.scoring:
      return (
        <Badge
          style={{
            color: "white",
            background: "green",
            opacity: active ? 1 : 0.5,
            fontSize: "8px",
          }}
        >
          Scoring
        </Badge>
      );

    case MatchStatuses.engaged:
      return (
        <Badge
          style={{
            color: "white",
            backgroundColor: "blue",
            opacity: active ? 1 : 0.5,

            fontSize: "8px",
          }}
        >
          Engaged
        </Badge>
      );

    case MatchStatuses.matching:
      return (
        <Badge
          style={{
            color: "white",
            backgroundColor: "green",

            fontSize: "8px",
            opacity: active ? 1 : 0.5,
          }}
        >
          Matching
        </Badge>
      );
    
      case MatchStatuses.done:
        return (
          <Badge
            style={{
              color: "white",
              backgroundColor: "blue",
  
              fontSize: "8px",
              opacity: active ? 1 : 0.5,
            }}
          >
            Done
          </Badge>
        );
    default:
      return null;
  }
};

export default MatchBadge;
