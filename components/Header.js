import React from "react";
import { Header as HeaderSemantic, Menu } from "semantic-ui-react";
import Link from "next/link";
const Header = () => {
  return (
    <>
      <Menu>
        <Menu.Item>
          <Link href={"/"}>
            <a className="item">CrowdCoin</a>
          </Link>
        </Menu.Item>
        <Menu.Item position={"right"}>
          <Link href={"/"}>
            <a className="item">Campaigns</a>
          </Link>
        </Menu.Item>
        <Menu.Item>+</Menu.Item>
      </Menu>
    </>
  );
};
export default Header;
