import SavedItineraryCard from '@/components/itinerary/SavedItineraryCard';
import { getUser } from '@/lib/userData';
import { isBlockedAtom, userAtom } from '@/store';
import { useAtom } from 'jotai';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Row, Tab, Tabs } from 'react-bootstrap';
import { Commet } from 'react-loading-indicators';
import { ThemeContext } from "@/pages/_app";
import { fetchCountryData, getCountryList } from '@/lib/airportData';
import ItineraryDetails from '@/components/itinerary/ItineraryDetails';

//dummy data
const upcomingItineraries = [
  {
    email: 'jojus.stpeter@gmail.com',
    id: 3,
    title: 'Paris Adventure',
    start_date: '2025-12-10',
    end_date: '2025-12-14',
    country: 'France',
    city: 'Paris',
    description: 'Explore the Eiffel Tower, Louvre, and enjoy French cuisine.',
    img: '/images/placeholder1.jpg',
    flight: {
        "departure_token":
        "WyJDalJJY20wMGNXaGZaRzh0UTBsQlFWOXRVbEZDUnkwdExTMHRMUzB0TFhCcWEyc3hORUZCUVVGQlIycHNkRVE0UkZNMmRDMUJFZ3hWUVRnNE9YeFZRVEl6TXpJYUN3aVYxd29RQWhvRFZWTkVPQnh3bGRjSyIsW1siUEVLIiwiMjAyNS0xMC0wOCIsIlNGTyIsbnVsbCwiVUEiLCI4ODkiXSxbIlNGTyIsIjIwMjUtMTAtMDgiLCJBVVMiLG51bGwsIlVBIiwiMjMzMiJdXV0="
    },
    schedules: [
        {
            day: '2025-12-10',
            locations: [
                {
                    "title": "Eiffel Tower",
                    "place_id": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
                    "rating": 4.7,
                    "reviews": 475344,
                    "type": "Tourist attraction",
                    "address": "Av. Gustave Eiffel, 75007 Paris, France",
                    "open_state": "Closes soon ⋅ 11 PM ⋅ Opens 9:30 AM Mon",
                    "description": "Landmark 330m-high 19th-century tower. Gustave Eiffel's iconic, wrought-iron 1889 tower, with steps and elevators to observation decks.",
                    "service_options":
                    {
                        "onsite_services": true
                    },
                    "user_review": "Quiet crowded with tourist.",
                    "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyADJFVVyaVnRGnpdFclZRgD8CV_dzHscAUMGqeBedi0Y_e-oYwu3pULaKpfHa4M8VNVEGc7a3DOjQffJUDrL8gSRLWY_twZHnjP--OGcmDPirFXjPOwaCG5rtf7Iqbq_D2bGS_=w131-h92-k-no",
                    "serpapi_thumbnail": "https://serpapi.com/images/url/PJ9Dp3icBcFRboIwAADQE1VUZmRL_GBUyhwKQqjiT1NLKTBsC60h7n4ewtv43uvZWKvNl-P0jTsTSome3w0fmZKWSztj6uYIbQAzwDg-mrd9_vDhLsT4QbHMkNRVyPpLJqAXYFL9R4b5xR4N_JtX7bwkHKhyuru6iOmvriP6sffwAW8RW1MXJt2xrncFHGNP5Fl8KomdLpHsUgASxG4wbcfw3KXJRAO0Gm29_hmuA4HLK8rJZlq4C9B8LsEfkOoNBFVE3g",
                    time: '8:30 AM',
                    duration: 90,
                },
                {
                "position":
                2,
                "title":
                "Arc de Triomphe",
                "place_id":
                "ChIJjx37cOxv5kcRPWQuEW5ntdk",
                "data_id":
                "0x47e66fec70fb1d8f:0xd9b5676e112e643d",
                "data_cid":
                "15687558599447307325",
                "reviews_link":
                "https://serpapi.com/search.json?data_id=0x47e66fec70fb1d8f%3A0xd9b5676e112e643d&engine=google_maps_reviews&hl=en",
                "photos_link":
                "https://serpapi.com/search.json?data_id=0x47e66fec70fb1d8f%3A0xd9b5676e112e643d&engine=google_maps_photos&hl=en",
                "gps_coordinates":
                {
                "latitude":
                48.8737917,
                "longitude":
                2.2950274999999998
                },
                "place_id_search":
                "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJjx37cOxv5kcRPWQuEW5ntdk",
                "provider_id":
                "/m/0zv_",
                "rating":
                4.7,
                "reviews":
                279781,
                "type":
                "Tourist attraction",
                "types":
                [
                "Tourist attraction",
                "Cultural landmark",
                "Museum",
                "Monument"
                ],
                "type_id":
                "tourist_attraction",
                "type_ids":
                [
                "tourist_attraction",
                "cultural_landmark",
                "museum",
                "monument"
                ],
                "address":
                "Pl. Charles de Gaulle, 75008 Paris, France",
                "open_state":
                "Closes soon ⋅ 10:30 PM ⋅ Opens 10 AM Mon",
                "phone":
                "+33 1 55 37 73 77",
                "website":
                "/url?q=https://www.paris-arc-de-triomphe.fr/&opi=79508299&sa=U&ved=0ahUKEwjc-bz3gOaQAxX1LLkGHYwuOi0Q61gINigP&usg=AOvVaw0LcxNx-cUqAsz0SWX4aDZR",
                "description":
                "Triumphal arch & national monument. Iconic triumphal arch built to commemorate Napoleon's victories, with an observation deck.",
                "extensions":
                [
                {
                "service_options":
                [
                "Onsite services"
                ]
                },
                {
                "accessibility":
                [
                "Wheelchair accessible entrance"
                ]
                },
                {
                "planning":
                [
                "Getting tickets in advance recommended"
                ]
                },
                {
                "children":
                [
                "Good for kids"
                ]
                }
                ],
                "service_options":
                {
                "onsite_services":
                true
                },
                "user_review":
                "Gets super busy on all the street corners surrounding it.",
                "thumbnail":
                "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzGdukiJZejlPfznOSMD5-dSfiIy5cD2azDLMTmocMtaDRNgyTveR8l21Opz-7RtKW_kcMzSMPWdOejdziyPZCQy8u69BVsrKUXIvXRBI-gmY3Zxr6E_DgGHa61YqsNev6nE7cWgw=w122-h92-k-no",
                "serpapi_thumbnail":
                "https://serpapi.com/images/url/FUVwnHicBcFdkoIgAADgE5FJo_3M9LBFY1akaWX50jhIaCKYoCUX3DPsbfb7_n4LrRu1sCxeTEZMSsZpp2hLpNBU6BGRtcUaBYgCyvrxxiWPjZd3VblL6YuHTyOCGCMH5PGz9AeHIJgZdMDnWhKsMxQd2XDuaTTj0A4aA6aR3iePimAT4zDJA_rKTTmE6fo0zDp3vrqqdn-5-f0tWvmA1fdJ-m3dzQMxb5u59v2tjrR3xWZKEvZZfmwIQTGHoAJC_gPr6UZz",
                time: '11:00 AM',
                duration: 60,
                form_type: 1,
                },
            ],
        },
        {
           day: '2025-12-11',
            locations: [
                {
                "position":
                3,
                "title":
                "Notre-Dame Cathedral of Paris",
                "place_id":
                "ChIJATr1n-Fx5kcRjQb6q6cdQDY",
                "data_id":
                "0x47e671e19ff53a01:0x36401da7abfa068d",
                "data_cid":
                "3909157082539624077",
                "reviews_link":
                "https://serpapi.com/search.json?data_id=0x47e671e19ff53a01%3A0x36401da7abfa068d&engine=google_maps_reviews&hl=en",
                "photos_link":
                "https://serpapi.com/search.json?data_id=0x47e671e19ff53a01%3A0x36401da7abfa068d&engine=google_maps_photos&hl=en",
                "gps_coordinates":
                {
                "latitude":
                48.8529682,
                "longitude":
                2.3499021
                },
                "place_id_search":
                "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJATr1n-Fx5kcRjQb6q6cdQDY",
                "provider_id":
                "/m/0gtxh",
                "rating":
                4.7,
                "reviews":
                79845,
                "type":
                "Tourist attraction",
                "types":
                [
                "Tourist attraction",
                "Cathedral"
                ],
                "type_id":
                "tourist_attraction",
                "type_ids":
                [
                "tourist_attraction",
                "cathedral"
                ],
                "address":
                "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France",
                "open_state":
                "Closed ⋅ Opens 7:50 AM Mon",
                "phone":
                "+33 1 42 34 56 10",
                "website":
                "/url?q=https://www.notredamedeparis.fr/&opi=79508299&sa=U&ved=0ahUKEwjc-bz3gOaQAxX1LLkGHYwuOi0Q61gIVCgP&usg=AOvVaw1sptPWi77EgCsUXC8jMjpw",
                "description":
                "Iconic Gothic church with literary link. Towering, 12th-century cathedral with flying buttresses & gargoyles, setting for Hugo's novel.",
                "extensions":
                [
                {
                "service_options":
                [
                "Onsite services"
                ]
                },
                {
                "accessibility":
                [
                "Assistive hearing loop",
                "Wheelchair accessible entrance"
                ]
                }
                ],
                "service_options":
                {
                "onsite_services":
                true
                },
                "user_review":
                "It is a really busy place and as a tourist you have not to be in hurry",
                "thumbnail":
                "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwlN0Gu9EbZ51dMdMFIIUwOWzZZus_LE8eG8HGaIbIo0z0y738x7_1igKamdWmhaOu3Dp_Gscf80bkvAFrrO3oj2oco_SSu4A0BfoHwFqVFK_RzhZ0DBDMXqo2DMFncSzO6Li2E=w80-h92-k-no",
                "serpapi_thumbnail":
                "https://serpapi.com/images/url/zq6KUHicBcFLDoIwFADAE1Uq-KkmLjDQShRJJIph00BBigIPKRXlfF7C2zjz-8q-b9XaMCppTQqAosq1yjsBTZ83_URAbRStQkIhZdgMl1U4VEfM9MpN4_k08zOfet55CKIxjrXiB5fkjOxY4qUe4BF_lhZ5L_m0LPZJnUW1TAJtOS1nStwITh8vm3ZdYMHdBAE8DPXMxtsb7Ab6vNA9P40yxs7W8a9PMB2fNiIcg8WhNN3NQDCSKxM9UAN_anpD3w",
                time: '9:30 AM',
                duration: 120,
                form_type: 1,
                },
                {
                "position":
                4,
                "title":
                "Basilique du Sacré-Cœur de Montmartre",
                "place_id":
                "ChIJ442GNENu5kcRGYUrvgqHw88",
                "data_id":
                "0x47e66e4334868de3:0xcfc3870abe2b8519",
                "data_cid":
                "14970958066519606553",
                "reviews_link":
                "https://serpapi.com/search.json?data_id=0x47e66e4334868de3%3A0xcfc3870abe2b8519&engine=google_maps_reviews&hl=en",
                "photos_link":
                "https://serpapi.com/search.json?data_id=0x47e66e4334868de3%3A0xcfc3870abe2b8519&engine=google_maps_photos&hl=en",
                "gps_coordinates":
                {
                "latitude":
                48.886704599999995,
                "longitude":
                2.3431043
                },
                "place_id_search":
                "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJ442GNENu5kcRGYUrvgqHw88",
                "provider_id":
                "/g/1tdm30l7",
                "rating":
                4.7,
                "reviews":
                156835,
                "type":
                "Tourist attraction",
                "types":
                [
                "Tourist attraction",
                "Catholic church",
                "Monument",
                "Basilica"
                ],
                "type_id":
                "tourist_attraction",
                "type_ids":
                [
                "tourist_attraction",
                "catholic_church",
                "monument",
                "basilica"
                ],
                "address":
                "35 Rue du Chevalier de la Barre, 75018 Paris, France",
                "open_state":
                "Closes soon ⋅ 10:30 PM ⋅ Opens 6:30 AM Mon",
                "phone":
                "+33 1 53 41 89 00",
                "website":
                "/url?q=https://www.sacre-coeur-montmartre.com/&opi=79508299&sa=U&ved=0ahUKEwjc-bz3gOaQAxX1LLkGHYwuOi0Q61gIcigP&usg=AOvVaw2XBnhslfx8SKIcHVp3di48",
                "description":
                "Landmark hilltop white basilica. Iconic, domed white church, completed in 1914, with interior mosaics, stained-glass windows & crypt.",
                "extensions":
                [
                {
                "service_options":
                [
                "Onsite services"
                ]
                },
                {
                "accessibility":
                [
                "Wheelchair accessible entrance"
                ]
                }
                ],
                "service_options":
                {
                "onsite_services":
                true
                },
                "user_review":
                "Walkng around pretty nice, many restaurants, local painters, musicans.",
                "thumbnail":
                "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzWUju4Vvvi5TVIxzwbeQXiBDVSR2Erqs6UWbRa1a49lswvqvqqAriGaIez-0daqLNNfGZ2sGWBwCTfsBgzGYs5Tne3tgz_XVpCEIHXVMxGtGEX32pQHycwPnJ306Ynedvd4YY=w80-h94-k-no",
                "serpapi_thumbnail":
                "https://serpapi.com/images/url/rh86O3icBcHdboIwGADQJ6ogIJkmXoiSyjKNP1hgNwahFBy2lK-22tfbU-xtds7fb6vUAAvH6Vt_woRgPX0CHSvBFeVqUomHwwZAFSBwVtjt-rPNLvdnQLTuZilJXtbc6DHvog05n7x4lBBestupnJbBvAejpZZyNXa4TKhFbl3Kr_2-wd8e4Cwy67SBiFlcwCzl1FfMXnMyrONkm5PdCysc5743HLfvyhz4p--GBae1roOiWJoPF7XzAP0gLv4B-pxFoQ",
                time: '12:00 PM',
                duration: 30,
                form_type: 1,
                },
            ], 
        },
    ],
  },
  {
    email: 'jojus.stpeter@gmail.com',
    id: 4,
    title: 'Tokyo Highlights',
    start_date: '2025-12-22',
    end_date: '2025-12-26',
    country: 'Japan',
    city: 'Tokyo',
    description: 'Visit Shibuya, temples, and try sushi at Tsukiji Market.',
    img: '/images/placeholder3.jpg',
  },
  {
    email: 'jojus.stpeter@gmail.com',
    id: 5,
    title: 'New York Weekend',
    start_date: '2026-01-12',
    end_date: '2026-01-15',
    country: 'United States',
    city: 'New York',
    description: 'Broadway show, Central Park stroll, and Times Square lights.',
    img: '/images/placeholder2.jpg',
  },
];

const pastItineraries = [
  {
    email: 'jojus.stpeter@gmail.com',
    id: 1,
    title: 'Boracay Adventure',
    start_date: '2025-08-08',
    end_date: '2025-08-21',
    country: 'Philippines',
    city: 'Boracay',
    description: 'Relax in beach resorts',
    img: '/images/placeholder1.jpg',
  },
  {
    email: 'jojus.stpeter@gmail.com',
    id: 2,
    title: 'Quick Getaway Trip',
    start_date: '2025-09-01',
    end_date: '2025-09-03',
    country: 'Canada',
    city: 'Vancouver',
    description: 'Quick trip',
    img: '/images/placeholder3.jpg',
  },
];

const ItineraryPage = () => {
    const { theme } = useContext(ThemeContext);
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);

    const [user, setUser] = useAtom(userAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [warning, setWarning] = useState("");
    const [countryObj, setCountryObj] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);    

    const handleModalShow = (event) => {
        setShowAddModal(true);
    };
    const handleModalClose = (action) => {
        setShowAddModal(false);
    }

    useEffect(() => {
        loadData();

        //load data
        loadCountryData();

    }, []);
    
    async function loadCountryData() {
        var cObj = countryObj;
        console.log(cObj);
        if(cObj.length <= 0) {
            cObj = await fetchCountryData();
            setCountryObj(cObj);
        }
        const countries = await getCountryList(cObj);
        setCountryOptions(countries);
    }

    async function loadData() {
        setIsLoading(true); //show loading

        const data = await getUser();
        setUser(data);

        await loadTrips("upcoming", data);
    }

    async function loadTrips(status, dataUser=null) {
        setWarning("");
        setIsLoading(true); //show loading

        const tmpUser = dataUser ? dataUser : user;
        console.log(tmpUser?.email);
        // try {
        //     const res = await fetch("/api/itinerary/get-itineraries", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             email: tmpUser?.email,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error loading trips";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     setUpcomingTrips(data);

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //dummy data
        if(status === "past") {
            setPastTrips(pastItineraries);
        }
        else {
            setUpcomingTrips(upcomingItineraries)
        }

        setIsLoading(false); //hide loading
    
    }

    const handleAdd = async (itinerary, formData, status="upcoming") => {
        setWarning("");
        setIsBlocked(true); //show loading
        
        const properties = {
            email: user.email,
            title: formData.title,
            start_date: formData.start_date,
            end_date: formData.end_date,
            country: formData.country,
            city: formData.city,
            description: formData.description,
            img: "",
            flight: {
                departure_token: formData.departure_token,
            },
            schedules: [],
            gl: formData.gl,
        }
        console.log(properties);

        try {
            const res = await fetch("/api/itinerary/add-itinerary", {  // Changed to same-origin API route
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(properties),
            });

            const data = await res.json();
            if (!res.ok) {
                // Try to parse error message from server
                let errorMsg = "Error creating itinerary";
                try {
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                setWarning(errorMsg);
                setIsLoading(false); //hide loading
                return;
            }

        } catch (err) {
            setWarning("Network error: " + err.message);
        }

        //reload list
        await loadTrips(status);

        //dummy add
        // var tmpTrips = [];
        // if(status === "past") {
        //     for(const trip of pastTrips) {
        //         if(trip.id !== itinerary.id) {
        //             tmpTrips.push(trip);
        //         }
        //     }

        //     setPastTrips(tmpTrips);
        // }
        // else {
        //     for(const trip of upcomingTrips) {
        //         if(trip.id !== itinerary.id) {
        //             tmpTrips.push(trip);
        //         }
        //     }

        //     setUpcomingTrips(tmpTrips);
        // }

        setIsBlocked(false); //hide loading
    
    };

    const handleEdit = async (itinerary, formData, status) => {
        setWarning("");
        setIsBlocked(true); //show loading

        const propertyObj = {
            urlParam: itinerary.id,
            properties: {
                email: user.email,
                title: formData.title,
                start_date: formData.start_date,
                end_date: formData.end_date,
                country: formData.country,
                city: formData.city,
                description: formData.description,
                img: "",
                flight: {
                    departure_token: formData.departure_token,
                },
                schedules: itinerary.schedules ? itinerary.schedules : [],
                gl: formData.gl,
            }
        }

        try {
            const res = await fetch("/api/itinerary/edit-itinerary", {  // Changed to same-origin API route
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(propertyObj),
            });

            const data = await res.json();
            if (!res.ok) {
                // Try to parse error message from server
                let errorMsg = "Error editing itinerary";
                try {
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                setWarning(errorMsg);
                setIsLoading(false); //hide loading
                return;
            }

        } catch (err) {
            setWarning("Network error: " + err.message);
        }

        //reload list
        //await loadTrips(status);

        setIsBlocked(false); //hide loading
    
    };

    
    const handleDelete = async (itinerary, status) => {
        setWarning("");
        setIsBlocked(true); //show loading

        const propertyObj = {
            urlParam: itinerary.id,
            properties: {
                email: user.email,
            }
        }

        try {
            const res = await fetch("/api/itinerary/delete-itinerary", {  // Changed to same-origin API route
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(propertyObj),
            });

            const data = await res.json();
            if (!res.ok) {
                // Try to parse error message from server
                let errorMsg = "Error deleting itinerary";
                try {
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                setWarning(errorMsg);
                setIsLoading(false); //hide loading
                return;
            }

            if(type === "past") {
                setPastTrips(data);
            }
            else {
                setUpcomingTrips(data);
            }

        } catch (err) {
            setWarning("Network error: " + err.message);
        }

        //reload list
        await loadTrips(status);

        //dummy delete
        var tmpTrips = [];
        if(status === "past") {
            for(const trip of pastTrips) {
                if(trip.id !== itinerary.id) {
                    tmpTrips.push(trip);
                }
            }

            setPastTrips(tmpTrips);
        }
        else {
            for(const trip of upcomingTrips) {
                if(trip.id !== itinerary.id) {
                    tmpTrips.push(trip);
                }
            }

            setUpcomingTrips(tmpTrips);
        }

        setIsBlocked(false); //hide loading
    
    };

    const handleSchedule = async (itinerary) => {
        window.open(`/itinerary/manage-schedule?id=${itinerary.id}`, "_blank");
    };

    
    const handleSummary = async (itinerary) => {
        //dummy
        handleSchedule(itinerary);
        return;

        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/edit-itinerary", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary: itinerary?.id,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error deleting itinerary";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     if(type === "past") {
        //         setPastTrips(data);
        //     }
        //     else {
        //         setUpcomingTrips(data);
        //     }

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //reload list
        await loadTrips(status);

        setIsLoading(false); //hide loading
    
    };

  return (
    <div>
        <Row className="mt-2">
            <Card className="bg-dark text-white m-0 p-0">
                <Card.Img className="img-title rounded-0" src="/images/manage_itinerary_title.png" alt="Card image" />
                <Card.ImgOverlay className="d-flex align-items-center px-4 px-md-5">
                    <Card.Title><h1>My Trips</h1></Card.Title>
                </Card.ImgOverlay>
            </Card>
        </Row>
        <hr />
        <div className="mx-sm-2 mx-md-5">
            <div className='d-flex justify-content-end my-3'>
                <Button className='btn-info text-light' onClick={handleModalShow}>Create New Trip</Button>
            </div>
            <ItineraryDetails
                show={showAddModal}
                handleModalClose={handleModalClose}
                handleAction={handleAdd}
                itineraryObj={null}
                status={null}
                action="add"
                countryObj={countryObj}
                countryOptions={countryOptions}
                theme={theme}
            />
            <Tabs defaultActiveKey="upcoming" id="uncontrolled-tab-example" className="mb-3" onSelect={loadTrips}>
                <Tab eventKey="upcoming" title="Upcoming Trips">
                {
                    isLoading ? (
                        <div className="d-flex justify-content-center align-items-center py-3">
                            <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                        </div>
                    ) 
                    :
                    (
                        warning !== "" ?
                        (
                            <Alert variant="danger">{warning}</Alert>
                        )
                        :
                        (
                            <>
                                {
                                    upcomingTrips.length > 0 ?
                                    upcomingTrips.map(itinerary => (
                                        <SavedItineraryCard 
                                            key={itinerary.id} 
                                            itinerary={itinerary} 
                                            status="upcoming"
                                            handleEdit={handleEdit} 
                                            handleDelete={handleDelete} 
                                            handleSummary={handleSummary}
                                            handleSchedule={handleSchedule}
                                            countryObj={countryObj}
                                            countryOptions={countryOptions}
                                            theme={theme}
                                        />
                                    ))
                                    :
                                    (
                                        <div className="d-flex justify-content-center align-items-center py-3">
                                            <Alert className="w-100 text-center bg-main-tertiary">No upcoming trips found</Alert>
                                        </div>
                                    )
                                }
                            </>
                        )
                    )
                     
                }
               
                </Tab>

                <Tab eventKey="past" title="Past Trips">
                {
                    isLoading ? (
                        <div className="d-flex justify-content-center align-items-center py-3">
                            <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                        </div>
                    ) 
                    :
                    (
                        <>
                        {
                            warning !== "" ?
                            (
                                <Alert variant="danger">{warning}</Alert>
                            )
                            :
                            (
                                <>
                                    {
                                        pastTrips.length > 0 ?
                                        pastTrips.map(itinerary => (
                                            <SavedItineraryCard 
                                                key={itinerary.id} 
                                                itinerary={itinerary} 
                                                status="past" 
                                                handleEdit={handleEdit}
                                                handleDelete={handleDelete} 
                                                handleSummary={handleSummary}
                                                handleSchedule={handleSchedule}
                                                countryObj={countryObj}
                                                countryOptions={countryOptions}
                                                theme={theme}
                                            />
                                        ))
                                        :
                                        (
                                            <div className="d-flex justify-content-center align-items-center py-3">
                                                <Alert className="w-100 text-center bg-main-tertiary">No past trips found</Alert>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        
                        }
                        </>
                    )
                }
                </Tab>
            </Tabs>
        </div>
    </div>
  );
};

export default ItineraryPage;
