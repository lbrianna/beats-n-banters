import React from "react";
import { Layout, Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { useRouter } from "next/router";
const { Header } = Layout;
const CustomHeader = () => {
  // You'll need to edit this array
  const menuItems: { key: string; label: string; href: string }[] = [
    // each menu item must contain:
    // key: unique string
    // label: string
    // href: string (route path)
    { key: "0", label: "Home", href: "/" },
    { key: "1", label: "About", href: "/about" },
  ];
  const router = useRouter();
  const selectedKey = menuItems
    .findIndex((item) => item.href === router.pathname)
    .toString();

  const handleClick = (e: MenuInfo) => {
    const parsedKey = parseInt(e.key);
    console.log("parsedKey:", parsedKey);
    console.log("e.key", e.key);
    if (parsedKey < 0 || parsedKey >= menuItems.length) return;
    router.push(menuItems[parsedKey].href);
  };

  // Start editing here

  return (
    <Header style={{ alignItems: "center" }}>
      <Menu
        theme="dark"
        onClick={handleClick}
        defaultSelectedKeys={[selectedKey]}
        mode="horizontal"
        items={menuItems}
      ></Menu>
    </Header>
  );
};

export default CustomHeader;
