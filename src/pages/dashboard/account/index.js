import ChangePassword from "./changePassword";
import UpdateInfo from "./updateInfo";

const Account = (props) => {
  return (
    <div className="mx-10 my-10">
      <h1 className="uppercase text-gray-600 font-bold mb-10">Account</h1>
      <div className="grid grid-cols-10 gap-5">
        <div className="col-span-3">
          <ChangePassword />
        </div>
        <div className="col-span-5">
          <UpdateInfo />
        </div>
      </div>
    </div>
  );
};

export default Account;
