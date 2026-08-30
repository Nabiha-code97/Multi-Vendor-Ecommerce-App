import React from "react";
import ProfileInfo from "./ProfileInfo";
import MyOrders from "./MyOrders";
import ChangePassword from "./ChangePassword";
import AddressBook from "./AddressBook";

const ProfileContent = ({ active }) => {
  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-6 ml-6">
      {active === 1 && <ProfileInfo />}
      {active === 2 && <MyOrders />}
      {active === 3 && <ChangePassword />}
      {active === 4 && <AddressBook />}
    </div>
  );
};

export default ProfileContent;
