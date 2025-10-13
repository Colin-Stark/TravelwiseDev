const iconData = {
    "wifi": "wifi",
    "wi-fi": "wifi",
    "air condition": "snow",
    "hot": "thermometer-sun",
    "parking": "car-front",
    "fitness": "person-walking",
    "spa": "flower1",
    "bar": "moon",
    "restaurant": "fork-knife",
    "dine": "fork-knife",
    "smoke-free": "slash-circle",
    "room": "door-closed",
    "kid": "dribbble",
    "laundry": "droplet-half",
    "accessible": "person-wheelchair",
    "pool": "water",
};

export function getMatchingIcon(strMatch) {
    strMatch = strMatch?.toLowerCase().trim();
    if(!strMatch) {
        return null;
    }

    var icon = "check";
    for(const [keyword, name] of Object.entries(iconData)) {
        if(strMatch.includes(keyword)) {
            icon = name;
            break;
        }
    }

    return icon;
}