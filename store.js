import { atom } from "jotai";

export const isBlockedAtom = atom(false);
export const languageAtom = atom();
export const userAtom = atom();
export const resetEmailAtom = atom();
export const resetOTPPassAtom = atom();

//data
export const countryCsvAtom = atom();
export const objByCountryAtom = atom();
export const objByCityAtom = atom();
export const selectedFlightAtom = atom();
export const selectedHotelAtom = atom();