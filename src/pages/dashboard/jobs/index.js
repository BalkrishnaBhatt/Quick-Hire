import { Switch, Route } from "react-router-dom";

import Main from "./main";
import CreateJob from "./createJob";

const Jobs = (props) => {
  return (
    <div className="overflow-y-scroll h-full">
      <Switch>
        <Route path={props.match.url + "/create"} component={CreateJob} />
        <Route path={props.match.url + "/:id?"} component={Main} />
      </Switch>
    </div>
  );
};

export default Jobs;
