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
  const propertyName = initData?.property?.name;
  const isMobile = window.innerWidth < 766;
  const styleForImage = isMobile ? 'hidden' : 'inset-0 flex';


  const { view, collapsed, openDrawer, height } = useSelector(appSelector);
  const isCollapsed = collapsed && !openDrawer;

  const mode = isCollapsed === true ? 'vertical' : 'inline';

  const handleClick = () => {
    if (view === 'MobileView') {
      setTimeout(() => {
        dispatch(toggleCollapsed());
      }, 100);
    }

  }

  return (
    <Sider
      trigger={null}
      collapsible={true}
      collapsed={isCollapsed}
      width={240}
      className='bg-white! shrink-0 w-60 md:w-70 z-900'
      style={{
        backgroundColor: "black"
      }}

    >
      <div className='w-[100%] h-[70px] bg-secondary bg-opacity-30 flex items-center justify-center overflow-hidden'>
        {
          isCollapsed ?
            <div className='text-2xl sm:text-md text-center text-blue-500 border-3 border-blue-500 px-4 py-2 sm:px-3 sm:py-1 rounded-full shadow-lg'>
              {propertyName?.[0].toUpperCase()}
            </div>
            :
            <img alt='Logo' className={`w-full sm:w-[65%] lg:w-[95%] h-[60%] object-cover object-center ${styleForImage}`} src={propretyImage} />
        }

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
            isCollapsed={isCollapsed}
          />
        </Menu>
      </Scrollbars>
    </Sider>

  );
}
