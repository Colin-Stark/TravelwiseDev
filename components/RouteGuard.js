import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/lib/authenticate";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { checkValidLogin } from "@/lib/cookies";
// import { favouritesAtom, searchHistoryAtom } from "@/store";
// import { getFavourites, getHistory } from "@/lib/userData";

const PUBLIC_PATHS = ['/login', '/register', '/reset', '/reset/password', '/_error'];

export default function RouteGuard(props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useAtom(userAtom);
    // const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    useEffect(() => {
        //load atoms
        updateAtoms();

        // on initial load - run auth check
        authCheck(router.pathname);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck);

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeComplete', authCheck);
        };
    }, []);

    function authCheck(url) {
        const path = url.split('?')[0];

        if (checkValidLogin()) {
            if(path !== "_error" && PUBLIC_PATHS.includes(path)) {
                setAuthorized(false);
                router.push("/");
            }
            else {
                setAuthorized(true);
            }
        }
        else {
            if(PUBLIC_PATHS.includes(path)) {
                setAuthorized(true);
            }
            else {
                setAuthorized(false);
                setUser(null);
                router.push("/login");
            }
        }
    }

    async function updateAtoms() {
        // setFavouritesList(await getFavourites()); 
        // setSearchHistory(await getHistory());
    }

    return (
        <>{authorized && props.children}</>
    );
}