import { LOCAL_STORAGE_KEYS } from "../variables/constants";
import { saveState } from "./Utils";
import { v4 as uuidv4 } from "uuid";

export const deviceId = () => {
    try {
        // crypto.randomUUID?.() 
        const deviceId = uuidv4(); // Generate a unique device ID
        saveState(LOCAL_STORAGE_KEYS.deviceId, deviceId);
        return deviceId;
    } catch (error) {
        console.error("Error generating device ID:", error);
        return "UnknownDeviceId"; // Fallback in case of error
    }
};

export const deviceName = () => {
    try {
        const ua = navigator.userAgent;
        let deviceName = "Unknown Device"; // Default fallback for unknown devices
        const browserMatch = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        if (/trident/i.test(browserMatch[1])) {
            const tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            deviceName = `IE ${tem[1] || ""}`;
        } else if (browserMatch[1] === "Chrome") {
            const tem = ua.match(/\b(OPR|Edg)\/(\d+)/);
            if (tem != null) {
                deviceName = tem.slice(1, 2).join(" ").replace("OPR", "Opera");
            } else {
                deviceName = "Chrome";
            }
        } else if (browserMatch[1]) {
            deviceName = browserMatch[1];
        }

        saveState(LOCAL_STORAGE_KEYS.deviceName, deviceName);
        return deviceName;
    } catch (error) {
        console.error("Error detecting device name:", error);
        return "Unknown Device"; // Fallback in case of error
    }
};
