"use client";

import { useCallback, useEffect, useState } from "react";
import {
  STATE_CREATING,
  STATE_ERROR,
  STATE_HAIRCHECK,
  STATE_IDLE,
  STATE_JOINED,
  STATE_JOINING,
  STATE_LEAVING,
} from "../../../../lib/constants";
import DailyIframe, { DailyCall, DailyEvent } from "@daily-co/daily-js";
import {
  createRoom,
  pageUrlFromRoomUrl,
  roomUrlFromPageUrl,
} from "../../../../lib/utils";
import { DailyProvider } from "@daily-co/daily-react";
import { VideoCall, HairCheck, Tray } from "../../../../components";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [appState, setAppState] = useState(STATE_IDLE);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [meetingToken, setMeetingToken] = useState<string | null>(null);

  /**
   * Create a new call room. This function will return the newly created room URL.
   * We'll need this URL when pre-authorizing (https://docs.daily.co/reference/rn-daily-js/instance-methods/pre-auth)
   * or joining (https://docs.daily.co/reference/rn-daily-js/instance-methods/join) a call.
   */
  const createCall = useCallback(() => {
    setAppState(STATE_CREATING);
    return createRoom()
      .then((room) => {
        if (room && room.url) {
          return room.url;
        } else {
          throw new Error("Invalid room data received");
        }
      })
      .catch((error) => {
        console.error("Error creating room", error);
        setRoomUrl(null);
        setAppState(STATE_IDLE);
        if (error.message.includes("401")) {
          setApiError(
            "Authentication failed. Please check your API key in the .env file."
          );
        } else if (error.message.includes("403")) {
          setApiError(
            "Authorization failed. Your API key might not have the necessary permissions."
          );
        } else {
          setApiError(`Failed to create room: ${error.message}`);
        }
        return null;
      });
  }, []);

  const startDemo = () => {
    createCall().then((url) => {
      if (url) {
        console.log("Start demo. URL: ", url);
        startHairCheck(url);
      } else {
        console.error("Failed to create call");
        // The error message is already set in createCall
      }
    });
  };

  const fetchMeetingToken = useCallback(async (roomName: string) => {
    try {
      const response = await fetch('/api/dailyToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch meeting token');
      }
  
      const data = await response.json();
      setMeetingToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Error fetching meeting token:', error);
      setApiError('Failed to fetch meeting token');
      return null;
    }
  }, []);

  /**
   * We've created a room, so let's start the hair check. We won't be joining the call yet.
   */
  const startHairCheck = useCallback(async (url: string) => {
    const newCallObject = DailyIframe.createCallObject();
    setRoomUrl(url);
    setCallObject(newCallObject);
    setAppState(STATE_HAIRCHECK);
  
    const roomName = url.split('/').pop() || '';
    const token = await fetchMeetingToken(roomName);
  
    if (token) {
      await newCallObject.preAuth({ url, token });
      await newCallObject.startCamera();
    } else {
      console.error('Failed to fetch meeting token');
      setAppState(STATE_IDLE);
    }
  }, [fetchMeetingToken]);

  /**
   * Once we pass the hair check, we can actually join the call.
   */
  const joinCall = useCallback(() => {
    if (callObject && roomUrl && meetingToken) {
      callObject.join({ url: roomUrl, token: meetingToken });
    }
  }, [callObject, roomUrl, meetingToken]);
  /**
   * Start leaving the current call.
   */
  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    setAppState(STATE_LEAVING);
    callObject
      .leave()
      .then(() => {
        callObject.destroy().then(() => {
          setRoomUrl(null);
          setCallObject(null);
          setAppState(STATE_IDLE);
        });
      })
      .catch((error) => {
        console.error("Error leaving call:", error);
        setAppState(STATE_ERROR);
        callObject.leave();
        // callObject.destroy();
      });
  }, [callObject]);

  /**
   * If a room's already specified in the page's URL when the component mounts,
   * join the room.
   */
  useEffect(() => {
    const url = roomUrlFromPageUrl();
    console.log("useEffect for Demo page. Room Url from page url: ", url);
    if (url) {
      startHairCheck(url);
    }
  }, [startHairCheck]);

  /**
   * Update the page's URL to reflect the active call when roomUrl changes.
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(roomUrl);
    if (pageUrl === window.location.href) return;
    window.history.replaceState(null, "", pageUrl);
  }, [roomUrl]);

  function handleNewMeetingState() {
    if (callObject) {
      switch (callObject.meetingState()) {
        case "joined-meeting":
          setAppState(STATE_JOINED);
          break;
        case "left-meeting":
          callObject.destroy().then(() => {
            setRoomUrl(null);
            setCallObject(null);
            setAppState(STATE_IDLE);
          });
          break;
        case "error":
          setAppState(STATE_ERROR);
          break;
        default:
          break;
      }
    }
  }
  /**
   * Update app state based on reported meeting state changes.
   *
   * NOTE: Here we're showing how to completely clean up a call with destroy().
   * This isn't strictly necessary between join()s, but is good practice when
   * you know you'll be done with the call object for a while, and you're no
   * longer listening to its events.
   */
  useEffect(() => {
    if (callObject) {
      const events: DailyEvent[] = [
        "joined-meeting",
        "left-meeting",
        "error",
        "camera-error",
      ];

      // Use initial state
      handleNewMeetingState();

      /*
       * Listen for changes in state.
       * We can't use the useDailyEvent hook (https://docs.daily.co/reference/daily-react/use-daily-event) for this
       * because right now, we're not inside a <DailyProvider/> (https://docs.daily.co/reference/daily-react/daily-provider)
       * context yet. We can't access the call object via daily-react just yet, but we will later in Call.js and HairCheck.js!
       */
      events.forEach((event) => callObject.on(event, handleNewMeetingState));

      // Stop listening for changes in state
      return () => {
        events.forEach((event) => {
          callObject.off(event, handleNewMeetingState);
        });
      };
    }
  }, [callObject]);

  /**
   * Show the call UI if we're either joining, already joined, or have encountered
   * an error that is _not_ a room API error.
   */
  const showCall =
    !apiError && [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(appState);

  /* When there's no problems creating the room and startHairCheck() has been successfully called,
   * we can show the hair check UI. */
  const showHairCheck = !apiError && appState === STATE_HAIRCHECK;

  const renderApp = () => {
    // If something goes wrong with creating the room.
    if (apiError) {
      return (
        <div className="api-error">
          <h1>Error</h1>
          <p>{apiError}</p>
          <p>
            Please ensure your `.env` file is set up correctly with a valid API
            key. Follow these steps:
          </p>
          <ol>
            <li>
              Check if the `.env` file exists in the root directory of your
              project.
            </li>
            <li>
              Verify that the file contains a line like:{" "}
              <code>DAILY_API_KEY=your_api_key_here</code>
            </li>
            <li>
              Make sure you've replaced 'your_api_key_here' with your actual
              Daily.co API key.
            </li>
            <li>
              Restart your development server after making changes to the `.env`
              file.
            </li>
          </ol>
          <p>
            For more information on setting up the project, see the{" "}
            <a href="https://github.com/daily-demos/custom-video-daily-react-hooks#readme">
              readme
            </a>
            .
          </p>
        </div>
      );
    }
    // No API errors? Let's check our hair then.
    if (showHairCheck && callObject) {
      return (
        <DailyProvider callObject={callObject}>
          <HairCheck joinCall={joinCall} cancelCall={startLeavingCall} />
        </DailyProvider>
      );
    }

    // No API errors, we passed the hair check, and we've joined the call? Then show the call.
    if (showCall && callObject) {
      return (
        <DailyProvider callObject={callObject}>
          <VideoCall />
          <Tray leaveCall={startLeavingCall} />
        </DailyProvider>
      );
    }

    return (
      <div className="home-screen">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          SimpleDisco Video Demo
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Start the demo with a new unique room by clicking the button below.
        </p>
        <Button onClick={startDemo} type="button">
          Click to start a call
        </Button>
        <p className="small">
          Select “Allow” to use your camera and mic for this call if prompted
        </p>
      </div>
    );
  };

  useEffect(() => {
    return () => {
      // Cleanup function to destroy the call object when component unmounts
      if (callObject) {
        callObject.destroy();
      }
    };
  }, [callObject]);

  return <div className="daily-app">{renderApp()}</div>;
}
