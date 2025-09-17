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

// Set a cookie to store the user's preferred theme
export const setUserCookie = (newUser) => {
    Cookies.set('user', newUser);
}

// Get the user's preferred theme from the cookie
export const getUserCookie = () => {
    if(!Cookies.get("user")) {
        return undefined;
    }

    return JSON.parse(Cookies.get("user"));
};

// Set a cookie to store the user's preferred theme
export const setLogDateCookie = (newDate) => {
    Cookies.set('logDate', newDate);
}

// Get the user's preferred theme from the cookie
export const getLogDateCookie = () => {
    return Cookies.get("logDate");
};

// Check if login is expire
export const checkValidLogin = () => {
    const user = getUserCookie();
    const loggedDate = getLogDateCookie();
    
    if(!user || !loggedDate) {
        return false;
    }

    //expires in 48 hours of not using the app
    const expiryInMilliseconds = 60 * 1 * 1 * 1000; // 1000ms * 60s * 60min * 48hours

    const differenceInMilliseconds = (new Date()).getTime() - loggedDate;

    if(differenceInMilliseconds > expiryInMilliseconds) {
        Cookies.remove("user");
        Cookies.remove("logDate");
        return false;
    }

    return user.email;

};
