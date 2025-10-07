import { useState, useEffect, useCallback } from "react";
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

    const authCheck = useCallback((url) => {
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
    }, [router, setUser]);

    const updateAtoms = useCallback(async () => {
        // setFavouritesList(await getFavourites()); 
        // setSearchHistory(await getHistory());
    }, []);

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
    }, [authCheck, router.events, router.pathname, updateAtoms]);

    return (
        <>{authorized && props.children}</>
    );
}