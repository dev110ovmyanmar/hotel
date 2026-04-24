import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu } from 'antd';
import Scrollbars from "../CustomScrollBar/CustomScrollBar";
import SidebarMenu from './SidebarMenu';
import logoLg from "../../assets/images/hotellogotext.png"
import logoSm from "../../assets/images/hotellogo.png"

import "./sidebar.css";
import { appSelector, toggleCollapsed } from '../../services/appSlice';
import { queryClient } from '../../app/queryClient';
import { getPropertyDetails } from '../../api/propertyApi';
import useApiQuery from '../../hooks/useApiQuery';

const { Sider } = Layout;

export default function Sidebar({
  sideBarColor
}) {

  const dispatch = useDispatch();

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const propretyImage = initData?.property?.file;


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
      style={{
        backgroundColor: "black"
      }}
    >
      <div className='w-[100%] h-[63px] bg-secondary bg-opacity-30 flex items-center justify-center overflow-hidden'>
        <img alt='Logo' className='w-[100%] h-[60%] object-cover object-center' src={propretyImage} />
      </div>
      <Scrollbars style={{ height: height - 70 }}>
        <Menu
          // theme='dark'
          className='py-8 px-6'
          mode={mode}

        >
          <SidebarMenu 
            onClick={handleClick}
            sideBarMenuColor={sideBarColor}
          />
        </Menu>
      </Scrollbars>
    </Sider>

  );
}
