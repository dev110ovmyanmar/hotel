import React from "react";
import { AntDesignOutlined, AudioOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Input} from "antd";
import { useNavigate } from "react-router-dom";


const suffix = <AudioOutlined style={{ fontSize: 16, color: '#1677ff' }} />;
const { Search } = Input;


const gradientButtonTheme = {
  token: {},
  components: {
    Button: {
      // apply custom class
      className: "gradient-btn",
    },
  },
};


const ContentBanner = ({
  title,
  btntext,
  navlink,
  smalltitle,
  smallbuttonsize,
  onCreate,
  onCreateImage,
  disabled=false,
  hidden=false,
  setDrawerOpen
  
  // handleImageChange
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if(onCreate){
      onCreate()
    } else if(navlink){
      navigate(navlink)
    } else{
      setDrawerOpen(true)
    }
  }

  return ( 
      <ConfigProvider theme={gradientButtonTheme}>
        {title? 
          (<div className="flex flex-row justify-between items-center w-full gap-2">
            {title && 
              (<p className={!smalltitle? "text-2xl font-bold" : smalltitle}>{title}</p>)
            }
          
            {btntext && 
              ( <Button type="primary" size={smallbuttonsize? smallbuttonsize : "large"} onClick={handleClick} disabled={disabled} hidden={hidden}>{btntext}</Button>)
            }        
        </div>)
        : (
          <div className="w-full flex justify-end">
            {btntext && 
              ( <Button type="primary" size={smallbuttonsize? smallbuttonsize : "large"} onClick={handleClick} disabled={disabled} hidden={hidden}>{btntext}</Button>)
            } 
          </div> 
        )}
      </ConfigProvider>

  )
};

export default ContentBanner;
