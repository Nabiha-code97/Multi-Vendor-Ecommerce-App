import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { RxDashboard } from "react-icons/rx";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { AiOutlineFolderAdd, AiOutlineGift, AiOutlineLogin, AiOutlineSetting } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill } from "react-icons/ci";
import { logoutSeller } from "../../../redux/actions/seller";

const navItems = [
  { active: 1, to: "/dashboard", label: "Dashboard", Icon: RxDashboard },
  { active: 2, to: "/dashboard-orders", label: "All Orders", Icon: FiShoppingBag },
  { active: 3, to: "/dashboard-products", label: "All Products", Icon: FiPackage },
  { active: 4, to: "/dashboard-create-product", label: "Create Product", Icon: AiOutlineFolderAdd },
  { active: 5, to: "/dashboard-events", label: "All Events", Icon: MdOutlineLocalOffer },
  { active: 6, to: "/dashboard-create-event", label: "Create Event", Icon: VscNewFile },
  { active: 7, to: "/dashboard-coupons", label: "Discount Codes", Icon: AiOutlineGift },
  { active: 8, to: "/dashboard-withdraw", label: "Withdraw Money", Icon: CiMoneyBill },
  { active: 9, to: "/dashboard-settings", label: "Settings", Icon: AiOutlineSetting },
];

const DashboardSideBar = ({ active }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSeller())
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

export default DashboardSideBar;
