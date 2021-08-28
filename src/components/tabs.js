import { useState } from "react";

/**
 * tabList = [
 *  {
 *  name: "Profile" -> String,
 *  Component: Profile -> React Component
 *  }
 *
 * ]
 */

const Tabs = (props) => {
  const [openTab, setOpenTab] = useState(0);
  const { tabList } = props;

  let Content = tabList[openTab].Component;
  if (!Content) {
    Content = () => <></>;
  }
  return (
    <>
      <ul className="flex mb-0 list-none ml-2">
        {tabList.map((tab, i) => (
          <li className="-mb-px mr-2 last:mr-0 text-center" key={i}>
            <a
              className={
                "text-xs font-bold uppercase px-5 py-3  rounded-t-lg block leading-normal border border-b-0 " +
                (openTab === i ? "blue bg-gray-100" : "text-gray-300 bg-white")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(i);
              }}
              data-toggle="tab"
              href="#link1"
              role="tablist"
            >
              {tab.name}
            </a>
          </li>
        ))}
      </ul>
      <Content />
    </>
  );
};

export default Tabs;
