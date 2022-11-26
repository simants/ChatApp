import React from "react";
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import Img from "../img/group.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <a href="/groupinfo"><img src={Img} alt="" /> New Group? </a>
      <Chats />
    </div>
  );
};

export default Sidebar;
