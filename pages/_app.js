import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/Layout";
import { SWRConfig } from "swr";
import RouteGuard from "@/components/RouteGuard";
import "@/styles/globals.css";
import { createContext, useEffect, useState } from "react";

//contexts
export const ThemeContext = createContext();

export default function App({ Component, pageProps }) {  
  const [theme, setTheme] = useState('dark'); // Default theme
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Persist theme in localStorage
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme');
  //   if (savedTheme) {
  //       setTheme(savedTheme);
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  return (
    <>
      <SWRConfig value={{ 
          fetcher: 
            async url => { 
              const res = await fetch(url); 
        
              // If the status code is not in the range 200-299, 
              // still try to parse and throw it. 
              if (!res.ok) { 
                const error = new Error('An error occurred while fetching the data.'); 
        
                // Attach extra info to the error object. 
                error.info = await res.json(); 
                error.status = res.status; 
                throw error; 
              } 
        
              return res.json(); 
            } 
        }}
      > 
        <RouteGuard>
          <ThemeContext.Provider value={{theme, toggleTheme}}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeContext.Provider>
        </RouteGuard>
      </SWRConfig>
    </>
  );

}
