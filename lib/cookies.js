import { useAtom } from "jotai";
import { userAtom } from "@/store";
import Cookies from "js-cookie";

// Set a cookie to store the user's preferred theme
export const setThemeCookie = (newTheme) => {
    Cookies.set('theme', newTheme);
}

// Get the user's preferred theme from the cookie
export const getThemeCookie = () => {
    return Cookies.get("theme");
};

// Set a cookie to store the user's preferred language
export const setLanguageCookie = (newLanguage) => {
    Cookies.set('language', newLanguage);
}

// Get the user's preferred language from the cookie
export const getLanguageCookie = () => {
    return Cookies.get("language");
};

// Set a cookie to store the user' data
export const setUserCookie = (newUser) => {
    Cookies.set('user', newUser);
}

// Get the user's data from the cookie
export const getUserCookie = () => {
    if(!Cookies.get("user")) {
        return undefined;
    }

    return JSON.parse(Cookies.get("user"));
};

// Remove user's data cookie
export const removeUserCookie = () => {
    if(!Cookies.get("user")) {
        return false;
    }

    Cookies.remove("user");

    return true;
};

// Set a cookie to store the user's preferred theme
export const setLogDateCookie = (newDate) => {
    Cookies.set('logDate', newDate);
}

// Get the user's preferred theme from the cookie
export const getLogDateCookie = () => {
    return Cookies.get("logDate");
};

// Get the user's data from the cookie
export const removeLogDateCookie = () => {
    if(!Cookies.get("logDate")) {
        return false;
    }

    Cookies.remove("logDate");

    return true;
};

// Check if login is expire
export const checkValidLogin = () => {
    const user = getUserCookie();
    const loggedDate = getLogDateCookie();
    
    if(!user || !loggedDate) {
        removeUserCookie();
        removeLogDateCookie();
        return false;
    }

    //expires in 48 hours of not using the app
    const expiryInMilliseconds = 60 * 60 * 48 * 1000; // 1000ms * 60s * 60min * 48hours

    const differenceInMilliseconds = (new Date()).getTime() - loggedDate;

    if(differenceInMilliseconds > expiryInMilliseconds) {
        removeUserCookie();
        removeLogDateCookie();
        return false;
    }

    return user.email;

};
