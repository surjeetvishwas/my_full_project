import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { isActiveStyles, isNotActiveStyles } from "../utils/style";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { MdShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import Avatar from "../assets/img/avatar.png";

const Header = () => {
  const user = useSelector((state) => state.user);
  return (
    <header className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px20 py-6">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        <img src={logo} className="w-12" alt="" />
        <p className="font-semibold text-xl ">The Bois</p>
      </NavLink>
      <nav className="flex items-center justify-center gap-8">
        <ul className="hidden md:flex items-center justify-center gap-16">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/"}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/menu"}
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/service"}
          >
            Services
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/AboutUs"}
          >
            About Us
          </NavLink>
        </ul>
        <motion.div {...buttonClick} className="relative cursor-pointer">
          <MdShoppingCart className="text-2xl text-textColor" />
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-2">
            <p className="text-primary text-base font-semibold">2</p>
          </div>
        </motion.div>
        {user ? (
          <>
            <div className="relative cursor-pointer">
              <div className="w-10 h-10 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center -mt-2">
                <motion.img
                  className="w-full h-full object-cover"
                  src={user?.picture ? user?.picture : Avatar}
                  whileHover={{ scale: 1.15 }}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <NavLink to={"/login"}>
              <motion.button
                {...buttonClick}
                className="px-4 py-2 rounded-md shadow-md bg-lightOverlay border border-red-300 cursor-pointer"
              >
                Login
              </motion.button>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
