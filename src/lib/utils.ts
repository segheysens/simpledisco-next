import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WebSocketStatus } from "@hocuspocus/provider";

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

  const endpoint = "https://api.daily.co/v1/rooms/";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_DAILY_API_KEY}`,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function roomUrlFromPageUrl() {
  const match = window.location.search.match(/roomUrl=([^&]+)/i);
  console.log("window.location:", window.location);
  console.log("match:", match);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export function pageUrlFromRoomUrl(roomUrl: string | number | boolean | null) {
  return (
    window.location.href.split("?")[0] +
    (roomUrl ? `?roomUrl=${encodeURIComponent(roomUrl)}` : "")
  );
}

export const cssVar = (name: string, value?: string) => {
  let currentName = name;
  if (name.substring(0, 2) !== "--") {
    currentName = `--${currentName}`;
  }

  if (value) {
    document.documentElement.style.setProperty(currentName, value);
  }

  return getComputedStyle(document.body).getPropertyValue(currentName);
};

export function randomElement<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const getConnectionText = (collabState: WebSocketStatus) => {
  switch (collabState) {
    case WebSocketStatus.Connected:
      return `Connected`;

    case WebSocketStatus.Connecting:
      return `Connecting...`;

    case WebSocketStatus.Disconnected:
      return `Disconnected`;

    default:
      return `Connecting...`;
  }
};
