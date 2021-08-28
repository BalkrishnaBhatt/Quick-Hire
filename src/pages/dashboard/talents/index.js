import { Switch, Route } from "react-router-dom";

import Main from "./main";
import CreateTalent from "./createTalent";

const Talents = (props) => {
  return (
    <div className="overflow-y-scroll h-full">
      <Switch>
        <Route path={props.match.url + "/create"} component={CreateTalent} />
        <Route path={props.match.url + "/:id?"} component={Main} />
      </Switch>
    </div>
  );
};

export default Talents;
