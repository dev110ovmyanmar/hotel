import { createSlice } from '@reduxjs/toolkit';
import { isServer } from '../utils/Utils';

export function getView(width) {
    let newView = 'MobileView';
    if (width > 1220) {
      newView = 'DesktopView';
    } else if (width > 767) {
      newView = 'TabView';
    }
    return newView;
  }

const initialState = {
  collapsed: !isServer && window.innerWidth > 1220 ? false : true,
  view: !isServer && getView(window.innerWidth),
  height: !isServer && window.innerHeight,
  openDrawer: false,
  sessionExpired: false,
  theme: (!isServer && localStorage.getItem('theme')) || 'light',
  networkFailed: false,
  systemLocked: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    toggleOpenDrawer: (state) => {
      state.openDrawer = !state.openDrawer;
    },
    toggleAll: (state, action) => {
      const view = getView(action.payload.width);
      const collapsed = view !== 'DesktopView';
      if (state.view !== action.payload.view || action.payload.height !== state.height) {
        const height = action.payload.height ? action.payload.height : state.height;
        state.collapsed = collapsed;
        state.view = view;
        state.height = height;
      }
    },
    changeOpenKeys: (state, action) => {
      state.openKeys = action.payload.openKeys;
    },
    changeCurrent: (state, action) => {
      state.current = action.payload.current;
    },
    clearMenu: (state) => {
      state.openKeys = [];
      state.current = [];
    },
    sessionExpired: (state, action) => {
      state.sessionExpired = action.payload;
    },
    networkFailedModal:(state,action)=>{
      console.log(action,"ActionInAppSlice")
      state.networkFailed = action.payload;
    },
    systemLocked: (state, action) => {
      state.systemLocked = action.payload;
    },

    // Added Theme Toggle Reducer
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      
      if (!isServer) {
        localStorage.setItem('theme', newTheme);
        // Sync Tailwind v4 class
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    // Added to initialize theme on app load
    initTheme: (state) => {
      if (!isServer && state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    },
  },
});

const appReducer = appSlice.reducer;

export const {
  toggleCollapsed,
  toggleOpenDrawer,
  toggleAll,
  changeOpenKeys,
  changeCurrent,
  clearMenu,
  toggleTheme,
  initTheme,
} = appSlice.actions;



export const appSelector = (state) => state?.app;

export const { sessionExpired, networkFailedModal, systemLocked: setSystemLocked } = appSlice.actions;

export default appReducer;
