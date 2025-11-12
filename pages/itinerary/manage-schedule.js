import SavedItineraryCard from '@/components/itinerary/SavedItineraryCard';
import { getUser } from '@/lib/userData';
import { userAtom } from '@/store';
import { useAtom } from 'jotai';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Row, Tab, Tabs } from 'react-bootstrap';
import { Commet } from 'react-loading-indicators';
import { ThemeContext } from "@/pages/_app";
import { fetchCountryData, getCountryList } from '@/lib/airportData';
import ItineraryDetails from '@/components/itinerary/ItineraryDetails';
import { getLocationList, getLocationPhotos } from '@/lib/locationData';
import LocationCard from '@/components/itinerary/LocationCard';
import moment from 'moment';
import LocationDetails from '@/components/itinerary/LocationDetails';

//dummy data
const upcomingItineraries = [
  {
    user_id: "asadasa",
    id: 3,
    title: 'Paris Adventure',
    start_date: '2025-12-10',
    end_date: '2025-12-14',
    country: 'France',
    city: 'Paris',
    gl: 'fr',
    description: 'Explore the Eiffel Tower, Louvre, and enjoy French cuisine.',
    img: '',
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
    id: 4,
    title: 'Tokyo Highlights',
    start_date: '2025-11-25',
    end_date: '2025-11-29',
    country: 'Japan',
    city: 'Tokyo',
    description: 'Visit Shibuya, temples, and try sushi at Tsukiji Market.',
    img: '',
    user_id: "asadasa",
    gl: 'jp',
    flight: {
        "departure_token": 
        "WyJDalJJY20wMGNXaGZaRzh0UTBsQlFWOXRVbEZDUnkwdExTMHRMUzB0TFhCcWEyc3hORUZCUVVGQlIycHNkRVE0UkZNMmRDMUJFZ3hWUVRnNE9YeFZRVEl6TXpJYUN3aVYxd29RQWhvRFZWTkVPQnh3bGRjSyIsW1siUEVLIiwiMjAyNS0xMC0wOCIsIlNGTyIsbnVsbCwiVUEiLCI4ODkiXSxbIlNGTyIsIjIwMjUtMTAtMDgiLCJBVVMiLG51bGwsIlVBIiwiMjMzMiJdXV1=",
    },
    schedules: [],
  },
  {
    id: 5,
    title: 'New York Weekend',
    start_date: '2026-01-12',
    end_date: '2026-01-15',
    country: 'United States',
    city: 'New York',
    description: 'Broadway show, Central Park stroll, and Times Square lights.',
    img: '',
    schedules: [],
  },
];

const pastItineraries = [
  {
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

const ManageSchedulePage = () => {
    const { theme } = useContext(ThemeContext);
    
    const [user, setUser] = useAtom(userAtom);
    const [itineraryId, setItineraryId] = useState(null);
    const [itinerary, setItinerary] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState("");
    const [prevLoc, setPrevLoc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [warning, setWarning] = useState("");
    const [countryObj, setCountryObj] = useState([]);
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
        if(cObj.length <= 0) {
            cObj = await fetchCountryData();
            setCountryObj(cObj);
        }
    }

    async function loadData() {
        setIsLoading(true); //show loading

        //load user
        const data_user = await getUser();
        setUser(data_user);

        //get itinerary
        const data_itinerary = await loadItinerary();    
        
        if(!data_itinerary) {
            return;
        }

        //set number of days
        var tmpDays = [];
        var tmpDate = moment(data_itinerary.start_date);
        const endDate = moment(data_itinerary.end_date);
        var i=0;
        while(tmpDate.isBefore(endDate) || tmpDate.isSame(endDate)) {
            const formattedDate = tmpDate.format('MMM DD, YYYY');
            tmpDays.push(formattedDate);
            tmpDate = tmpDate.add(1, "days");

            if(i === 0) {
                //set initial selected day
                setSelectedDay(tmpDays[0])
            }
            i++;
        }   
        setDays(tmpDays);   

        setIsLoading(false); //remove loading
    }

    async function loadItinerary() {
        setWarning("");
        setIsLoading(true); //show loading

        var data = null;
        //get itinerary id from url
        const queryParams = new URLSearchParams(window.location.search);
        const itinerary_id = queryParams.get("id");
        // try {
        //     const res = await fetch("/api/itinerary/get-itinerary", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             email: user?.email,
        //             itinerary_id:  itinerary_id,
        //         }),
        //     });

        //     data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error loading itinerary";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }
        //     setItinerary(data);
        //     setItineraryId(itinerary_id);

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }
        //dummy itinerary
        for(const trip of upcomingItineraries) {
            if((""+trip.id) === (""+itinerary_id)) {
                data = trip;
                break;
            }
        }
        if(!data) {
            data = upcomingItineraries[0];
        }
        setItinerary(data);
        setItineraryId(itinerary_id);

        setIsLoading(false);

        return data;
    }

    const handleAdd = async (loc, formValues) => {
        setWarning("");
        setIsLoading(true); //show loading

        loc = {
            ...loc,
            time: formValues.time,
            duration: formValues.duration,
            form_type: 1,
        }

        //get location image
        if(!itinerary.img) {
            const img_properties = {
                data_id : loc.data_id,
            }
            const dataImg = await getLocationPhotos(img_properties);
            for(const photo of dataImg?.photos) {
                if(photo.image) {
                    console.log("added img", photo.image);
                    var tmpIter = itinerary;
                    tmpIter.img = photo.image;

                    setItinerary(tmpIter);
                    break;
                }
            }
        }

        // try {
        //     const res = await fetch("/api/itinerary/add-location", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary_id: itineraryId,
        //             day: day,
        //             location: loc,
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
        await loadItinerary();

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
        //dummy add
        var tmpSchedules = itinerary.schedules;
        var tmpSched = null;
        var i=0;
        for(const sched of tmpSchedules) {
            if(moment(sched.day).isSame(moment(formValues.day))) {
                tmpSched = sched;
                break;
            }
            i++;
        }

        //add new schedule
        if(tmpSched === null) {
            tmpSchedules.push(
                {
                    day: formValues.day,
                    locations: [loc],
                }
            );
        }
        else {
            tmpSched.locations.push(loc);
            //sort
            tmpSched.locations.sort((a,b)=>new Date("2025-12-12 "+a.time) - new Date("2025-12-12 "+b.time));
            tmpSchedules[i] = tmpSched;
        }
        
        const tmpItinerary = {
            ...itinerary,
            schedules: tmpSchedules,
        };
        setItinerary(tmpItinerary);
        console.log(tmpItinerary);

        //reload list
        //await loadItinerary();

        setIsLoading(false); //hide loading
    
    };

    const handleEdit = async (loc, formValues) => {
        setWarning("");
        setIsLoading(true); //show loading

        loc = {
            ...loc,
            time: formValues.time,
            duration: formValues.duration,
            form_type: 1,
        }

        console.log(itinerary);

        // try {
        //     const res = await fetch("/api/itinerary/edit-location", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary_id: itineraryId,
        //             day: day,
        //             time: formValues.time,
        //             location: loc,
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
        //dummy edit
        var tmpSchedules = itinerary.schedules;
        var tmpSched = null;
        var i=0;
        for(const sched of tmpSchedules) {
            if(moment(sched.day).isSame(moment(formValues.day))) {
                tmpSched = sched;
                break;
            }
            i++;
        }
        var j=0;
        for(const l of tmpSched.locations) {
            if(l.time === formValues.prevTime) {
                break;
            }
            j++;
        }
        tmpSched.locations[j] = loc;
        //sort
        tmpSched.locations.sort((a,b)=>new Date("2025-12-12 "+a.time) - new Date("2025-12-12 "+b.time));
        tmpSchedules[i] = tmpSched;
        
        const tmpItinerary = {
            ...itinerary,
            schedules: tmpSchedules,
        };
        setItinerary(tmpItinerary);
        console.log(tmpItinerary);

        //reload list
        //await loadItinerary();

        setIsLoading(false); //hide loading
    
    };

    
    const handleDelete = async (loc, day) => {
        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/delete-location", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             time: loc.time,
        //             day: day,
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
        //dummy delete
        var tmpSchedules = itinerary.schedules;
        var tmpSched = null;
        var i=0;
        for(const sched of tmpSchedules) {
            if(moment(sched.day).isSame(moment(day))) {
                tmpSched = sched;
                break;
            }
            i++;
        }
        var tmpLoc = [];
        for(const l of tmpSched.locations) {
            if(l.time === loc.time) {
                continue;
            }
            tmpLoc.push(l);
        }
        tmpSched.locations = tmpLoc;
        tmpSchedules[i] = tmpSched;
        
        const tmpItinerary = {
            ...itinerary,
            schedules: tmpSchedules,
        };
        
        setItinerary(tmpItinerary);
        console.log(tmpItinerary);

        //reload list
        //await loadItinerary();

        setIsLoading(false); //hide loading
    
    };

  return (
    itineraryId ? (
    <div>
        <Row className="mt-2">
            <Card className="bg-dark text-white m-0 p-0">
                <Card.Img className="img-title rounded-0" src="/images/manage_schedule_title.png" alt="Card image" />
                <Card.ImgOverlay className="d-flex align-items-center px-4 px-md-5">
                    <Card.Title><h1>Itinerary Schedule</h1></Card.Title>
                </Card.ImgOverlay>
            </Card>
        </Row>
        <hr />
        <div className="mx-sm-2 mx-md-5">
            <div className='d-flex justify-content-between my-3'>
                <label><strong>Main Location: </strong>{`${itinerary?.city}, ${itinerary?.country}`}</label>
                <Button className='btn-info text-light' onClick={handleModalShow}>Add Location to Schedule</Button>
            </div>
            <LocationDetails
                show={showAddModal}
                handleModalClose={handleModalClose}
                handleAction={handleAdd}
                locationObj={null}
                action="add"
                country={itinerary?.country}
                city={itinerary?.city}
                day={selectedDay}
                itinerary={itinerary}
                countryObj={countryObj}
                theme={theme}
            />

            {
            isLoading ?
            (
                <div className="d-flex justify-content-center align-items-center py-3">
                    <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                </div>
            )
            :
            (
            <Tabs defaultActiveKey="day_0" id="days_tab" className="mb-3" onSelect={(tabId)=>{
                const dayIndexArr = tabId.split("_");
                const dayIndex = dayIndexArr[1]
                const tmpDay = days[dayIndex];
                setSelectedDay(tmpDay);
            }}>
            {
                days.map((day, index)=> {
                
                var tmpSchedule = null;
                for(const schedule of itinerary?.schedules) {
                    if(moment(schedule?.day).isSame(moment(day))) {
                        tmpSchedule = schedule;
                        break;
                    }
                }

                return (
                    <Tab key={`tab_${index}`} eventKey={`day_${index}`} title={`${day}`}>
                    {
                        isLoading ? 
                            (
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
                                    <div className='mb-4'>
                                        <p>Number of Stops: {tmpSchedule?.locations?.length > 0 ? tmpSchedule?.locations?.length : 0}</p>
                                    {
                                        tmpSchedule?.locations?.length > 0 ?
                                        tmpSchedule.locations.map((location, ind) => (
                                            <LocationCard 
                                                key={`saved_loc_${ind}`}
                                                location={location}
                                                index={ind}
                                                day={day}
                                                time={location.time}
                                                duration={location.duration}
                                                country={itinerary?.country}
                                                city={itinerary?.city}
                                                handleEdit={handleEdit}
                                                handleDelete={handleDelete}
                                                itinerary={itinerary}
                                                countryObj={countryObj}
                                                theme={theme}
                                            />
                                        ))
                                        :
                                        (
                                            <div className="d-flex justify-content-center align-items-center py-3">
                                                <Alert className="w-100 text-center bg-main-tertiary">No saved locations for this day found</Alert>
                                            </div>
                                        )
                                    }
                                    </div>
                                )
                            )
                    }
                    </Tab>
                )})
            }
            </Tabs>
            )
            }
        </div>
    </div>
    )
    :
    (
    <>
    {
        isLoading ? (
            <div className="d-flex justify-content-center align-items-center py-3">
                <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
            </div>
        )
        :
        (
            <div className="d-flex justify-content-center align-items-center py-3">
                <Alert variant='danger'>Cannot find itinerary</Alert>
            </div>
        )
    }
    </>
    )
  );
};

export default ManageSchedulePage;
