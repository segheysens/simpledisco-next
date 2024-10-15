import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  useParticipantIds,
  useScreenShare,
  useLocalParticipant,
  useDailyEvent,
  DailyAudio,
  useDaily,
  useRoom,
} from "@daily-co/daily-react";

import Tile from "./Tile";
import UserMediaError from "./UserMediaError";

import { useChannel } from "ably/react";

export default function VideoCall() {
  const [getUserMediaError, setGetUserMediaError] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const daily = useDaily();
  // const room = useRoom();
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const { publish } = useChannel("transcriptions");

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, [])
  );

  const { screens } = useScreenShare();
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const localParticipant = useLocalParticipant();

  useEffect(() => {
    if (localParticipant) {
      setParticipants([localParticipant.session_id, ...remoteParticipantIds]);
    }
  }, [localParticipant, remoteParticipantIds]);

  useDailyEvent(
    "participant-joined",
    useCallback(() => {
      if (daily) {
        const participantIds = daily.participants().map((p) => p.session_id);
        setParticipants(participantIds);
      }
    }, [daily])
  );

  useDailyEvent(
    "transcription-message",
    useCallback((event: any) => {
      const { participantId, text } = event;
      // console.log(participant);
      const userName = participantId || "Unknown";
      setTranscriptions((prev) => [...prev, `${userName}: ${text}`]);
      publish(`${userName}`, `${text}`);
    }, [])
  );

  const renderCallScreen = () => (
    <div className={`${screens.length > 0 ? "is-screenshare" : "call"}`}>
      <div className="tiles-container">
        {participants.map((id) => (
          <Tile
            key={id}
            id={id}
            isLocal={id === localParticipant?.session_id}
          />
        ))}
        {screens.map((screen) => (
          <Tile key={screen.screenId} id={screen.session_id} isScreenShare />
        ))}
      </div>
      {remoteParticipantIds.length === 0 && screens.length === 0 && (
        <div className="info-box">
          <h1>Waiting for others</h1>
          <p>Invite someone by sharing this link:</p>
          <span className="room-url">{window.location.href}</span>
        </div>
      )}
      <DailyAudio />
      <div className="transcriptions">
        <h3>Transcriptions</h3>
        {transcriptions.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );

  return getUserMediaError ? <UserMediaError /> : renderCallScreen();
}
