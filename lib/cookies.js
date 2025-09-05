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
