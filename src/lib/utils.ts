import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
  We'll add a 30-min expiry (exp) so rooms won't linger too long on your account.
  See other available options at https://docs.daily.co/reference#create-room
 */
export async function createRoom() {
  const exp = Math.round(Date.now() / 1000) + 60 * 30;
  const options = {
    properties: {
      exp,
    },
  };

  const isLocal =
    process.env.REACT_APP_ROOM_ENDPOINT &&
    process.env.REACT_APP_ROOM_ENDPOINT === "local";
  console.log("REACT_APP_ROOM_ENDPOINT:", process.env.REACT_APP_ROOM_ENDPOINT);
  // const endpoint = isLocal
  //   ? "https://api.daily.co/v1/rooms/"
  //   : `${window.location.origin}/api/rooms`;
  const endpoint = "https://api.daily.co/v1/rooms/";

  /*
      No need to send the headers with the request when using the proxy option:
      netlify.toml takes care of that for us.
    */
  const headers = isLocal && {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_DAILY_API_KEY}`,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(options),
    ...headers,
  });
  return response.json();
}

export function roomUrlFromPageUrl() {
  const match = window.location.search.match(/roomUrl=([^&]+)/i);
  console.log("window.location:", window.location);
  console.log("match:", match);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export function pageUrlFromRoomUrl(roomUrl) {
  return (
    window.location.href.split("?")[0] +
    (roomUrl ? `?roomUrl=${encodeURIComponent(roomUrl)}` : "")
  );
}
