import React, { useState, useCallback, useEffect } from "react";
import {
  useParticipantIds,
  useScreenShare,
  useLocalParticipant,
  useDailyEvent,
  DailyAudio,
  useDaily,
} from "@daily-co/daily-react";

import Tile from "./Tile";
import UserMediaError from "./UserMediaError";

export default function VideoCall() {
  const [getUserMediaError, setGetUserMediaError] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const daily = useDaily();

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

  useDailyEvent("participant-joined", useCallback(() => {
    if (daily) {
      const participantIds = daily.participants().map(p => p.session_id);
      setParticipants(participantIds);
    }
  }, [daily]));

  const renderCallScreen = () => (
    <div className={`${screens.length > 0 ? "is-screenshare" : "call"}`}>
      <div className="tiles-container">
        {participants.map((id) => (
          <Tile key={id} id={id} isLocal={id === localParticipant?.session_id} />
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
    </div>
  );

  return getUserMediaError ? <UserMediaError /> : renderCallScreen();
}
