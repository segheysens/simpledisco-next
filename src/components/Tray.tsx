import React, { useCallback, useState } from "react";
import {
  useDaily,
  useScreenShare,
  useLocalParticipant,
  useVideoTrack,
  useAudioTrack,
  useDailyEvent,
} from "@daily-co/daily-react";

import VideoCallMeetingInfo from "./VideoCallMeetingInfo";
import Chat from "./Chat";
import Button from "./ui/button";

import {
  FaDoorOpen,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaLaptop,
  FaInfoCircle,
  FaVideo,
} from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoChatbubbleOutline } from "react-icons/io5";

export default function Tray({ leaveCall }) {
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();

  const [showMeetingInformation, setShowMeetingInformation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState(false);

  const localParticipant = useLocalParticipant();
  const localVideo = useVideoTrack(localParticipant?.session_id);
  const localAudio = useAudioTrack(localParticipant?.session_id);
  const mutedVideo = localVideo.isOff;
  const mutedAudio = localAudio.isOff;

  /* When a remote participant sends a message in the chat, we want to display a differently colored
   * chat icon in the Tray as a notification. By listening for the `"app-message"` event we'll know
   * when someone has sent a message. */
  useDailyEvent(
    "app-message",
    useCallback(() => {
      /* Only light up the chat icon if the chat isn't already open. */
      if (!showChat) {
        setNewChatMessage(true);
      }
    }, [showChat])
  );

  const toggleVideo = useCallback(() => {
    callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    callObject.setLocalAudio(mutedAudio);
  }, [callObject, mutedAudio]);

  const toggleScreenShare = () =>
    isSharingScreen ? stopScreenShare() : startScreenShare();

  const toggleMeetingInformation = () => {
    setShowMeetingInformation(!showMeetingInformation);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (newChatMessage) {
      setNewChatMessage(!newChatMessage);
    }
  };

  return (
    <div className="tray p-4 rounded-t-lg shadow-lg">
      {showMeetingInformation && <VideoCallMeetingInfo />}
      <Chat showChat={showChat} toggleChat={toggleChat} />
      <div className="tray-buttons-container flex justify-between items-center">
        <div className="controls space-x-2">
          <Button onClick={toggleVideo} variant="secondary" size="sm">
            {mutedVideo ? (
              <FaVideoSlash className="mr-2" />
            ) : (
              <FaVideo className="mr-2" />
            )}
            {mutedVideo ? "Turn camera on" : "Turn camera off"}
          </Button>
          <Button onClick={toggleAudio} variant="secondary" size="sm">
            {mutedAudio ? (
              <FaMicrophoneSlash className="mr-2" />
            ) : (
              <FaMicrophone className="mr-2" />
            )}
            {mutedAudio ? "Unmute mic" : "Mute mic"}
          </Button>
        </div>
        <div className="actions space-x-2">
          <Button onClick={toggleScreenShare} variant="secondary" size="sm">
            <FaLaptop className="mr-2" />
            {isSharingScreen ? "Stop sharing" : "Share screen"}
          </Button>
          <Button
            onClick={toggleMeetingInformation}
            variant="secondary"
            size="sm"
          >
            <FaInfoCircle className="mr-2" />
            {showMeetingInformation ? "Hide info" : "Show info"}
          </Button>
          <Button onClick={toggleChat} variant="secondary" size="sm">
            {newChatMessage ? (
              <IoChatbubbleEllipses className="mr-2" />
            ) : (
              <IoChatbubbleOutline className="mr-2" />
            )}
            {showChat ? "Hide chat" : "Show chat"}
          </Button>
        </div>
        <div className="leave">
          <Button onClick={leaveCall} variant="danger" size="sm">
            <FaDoorOpen className="mr-2" /> Leave call
          </Button>
        </div>
      </div>
    </div>
  );
}
