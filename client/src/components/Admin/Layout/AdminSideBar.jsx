import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { RxDashboard } from "react-icons/rx";
import { FiShoppingBag, FiPackage } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdBorderClear } from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";
import { CiMoneyBill } from "react-icons/ci";
import { logoutUser } from "../../../redux/actions/user";

const navItems = [
  { active: 1, to: "/admin-dashboard", label: "Dashboard", Icon: RxDashboard },
  { active: 2, to: "/admin-orders", label: "All Orders", Icon: FiShoppingBag },
  { active: 3, to: "/admin-sellers", label: "All Sellers", Icon: MdBorderClear },
  { active: 4, to: "/admin-users", label: "All Users", Icon: HiOutlineUserGroup },
  { active: 5, to: "/admin-products", label: "All Products", Icon: FiPackage },
  { active: 6, to: "/admin-withdraws", label: "Withdraw Requests", Icon: CiMoneyBill },
];

const AdminSideBar = ({ active }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        toast.success("Logged out");
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <div className="w-full bg-white shadow-sm">
      {navItems.map(({ active: itemActive, to, label, Icon }) => (
        <div className="w-full flex items-center p-4" key={to}>
          <Link to={to} className="w-full flex items-center">
            <Icon size={30} color={active === itemActive ? "crimson" : "#555"} />
            <h5
              className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                active === itemActive ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              {label}
            </h5>
          </Link>
        </div>
      ))}

      <div className="w-full flex items-center p-4 cursor-pointer" onClick={handleLogout}>
        <AiOutlineLogin size={30} color="#555" />
        <h5 className="hidden 800px:block pl-2 text-[18px] font-[400] text-[#555]">Log out</h5>
      </div>
    </div>
  );
};

export default AdminSideBar;
