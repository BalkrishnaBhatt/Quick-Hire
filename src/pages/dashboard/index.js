import { Switch, Route, Redirect } from "react-router-dom";

import Sidebar from "components/sidebar";
import Header from "components/header";

import Jobs from "./jobs";
import Talents from "./talents";
import Account from "./account";
import Matching from "./matching";

const Dashboard = (props) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <Header />

        <Switch>
          <Route path={props.match.url + "/matching"} component={Matching} />
          <Route path={props.match.url + "/account"} component={Account} />
          <Route path={props.match.url + "/talents"} component={Talents} />
          <Route path={props.match.url + "/jobs"} component={Jobs} />
          <Redirect from={props.match.url} to={props.match.url + "/jobs"} />
        </Switch>
      </div>
    </div>
  );
};

export default Dashboard;
