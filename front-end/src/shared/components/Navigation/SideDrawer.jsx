import React from "react";
import "./SideDrawer.css";
import { ReactDOM } from "react-dom";
function SideDrawer({ children }) {
  const content = <aside className="side-drawer">{children}</aside>;
  console.log(content);
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
}

export default SideDrawer;
