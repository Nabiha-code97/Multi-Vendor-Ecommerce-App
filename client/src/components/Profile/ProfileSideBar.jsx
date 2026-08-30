import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { RxPerson } from "react-icons/rx";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbAddressBook } from "react-icons/tb";
import { AiOutlineLogin } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { logoutUser } from "../../redux/actions/user";

const tabs = [
  { id: 1, label: "Profile Info", Icon: RxPerson },
  { id: 2, label: "My Orders", Icon: HiOutlineShoppingBag },
  { id: 3, label: "Change Password", Icon: RiLockPasswordLine },
  { id: 4, label: "Address Book", Icon: TbAddressBook },
];

const ProfileSideBar = ({ active, setActive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        toast.success("Logged out");
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      {tabs.map(({ id, label, Icon }) => (
        <div
          key={id}
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(id)}
        >
          <Icon size={20} color={active === id ? "crimson" : "#555"} />
          <span className={`pl-3 800px:block hidden ${active === id ? "text-[crimson]" : ""}`}>
            {label}
          </span>
        </div>
      ))}

      {user?.role === "admin" && (
        <Link to="/admin-dashboard" className="flex items-center cursor-pointer w-full mb-8">
          <MdOutlineAdminPanelSettings size={20} color="#555" />
          <span className="pl-3 800px:block hidden">Admin Dashboard</span>
        </Link>
      )}

      <div className="flex items-center cursor-pointer w-full mb-8" onClick={handleLogout}>
        <AiOutlineLogin size={20} color="#555" />
        <span className="pl-3 800px:block hidden">Log out</span>
      </div>
    </div>
  );
};

export default ProfileSideBar;
