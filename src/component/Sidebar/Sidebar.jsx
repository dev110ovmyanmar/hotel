import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu } from 'antd';
import Scrollbars from "../CustomScrollBar/CustomScrollBar";
import SidebarMenu from './SidebarMenu';
import { toggleCollapsed, appSelector } from '../../services/appSlice';
// import logoLg from "../../assets/images/hotel_logo.png";
import logoLg from "../../assets/images/ovwithtext.png"
import logoSm from "../../assets/images/ovlogo.png"
// import logoSm from "../../assets/images/hotel_logo.png";

import "./sidebar.css";

const { Sider } = Layout;

export default function Sidebar() {

  const dispatch = useDispatch();
  
  const { view, collapsed, openDrawer, height } = useSelector(appSelector);
  const isCollapsed = collapsed && !openDrawer;
  const mode = isCollapsed === true ? 'vertical' : 'inline';

  const handleClick = () => {
    if (view === 'MobileView') {
      setTimeout(() => {
        dispatch(toggleCollapsed());
      }, 100);
    }
  };

  return (
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={isCollapsed}
        width={240}
        className='bg-white! shrink-0 w-60 md:w-70 z-1000'
      >
        <div className='h-[70px] bg-secondary bg-opacity-30 m-0 md:px-2 flex items-center justify-center overflow-hidden'>
          <img alt='Logo' className='w-full h-[70px] object-cotain' src={isCollapsed ? logoSm : logoLg} />
        </div>
        <Scrollbars style={{ height: height - 70 }}>
          <Menu
            // theme='dark'
            className='py-8 px-6'
            mode={mode}
          >
            <SidebarMenu onClick={handleClick} />
          </Menu>
        </Scrollbars>
      </Sider>
    
  );
}
