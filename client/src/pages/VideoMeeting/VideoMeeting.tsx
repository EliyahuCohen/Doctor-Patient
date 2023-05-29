import React, { useEffect, useRef, useState } from "react";
import "./video.scss";
import { socket } from "../../App";

const VideoMeeting = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [roomCreated, setRoomCreated] = useState<boolean>(false);
  const [roomNum, setRoomNum] = useState<string>("");
  let peerConnection: RTCPeerConnection | null = null;

  async function init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Error accessing media devices:", error);
    }
  }

  async function createRoom() {
    if (roomNum.length > 0) {
      socket.emit("join room", roomNum);
      setRoomCreated(true);
      setupPeerConnection();
    }
  }

  function setupPeerConnection() {
    peerConnection = new RTCPeerConnection();

    // Add local stream to the peer connection
    const localStream = localVideoRef.current?.srcObject as MediaStream;
    localStream?.getTracks().forEach((track) => {
      peerConnection?.addTrack(track, localStream);
    });

    // Event listener for receiving remote tracks
    peerConnection!.ontrack = handleRemoteTrack;

    // Event listener for ICE candidates
    peerConnection!.onicecandidate = handleICECandidate;

    // Create offer and set local description
    peerConnection
      .createOffer()
      .then((offer) => {
        peerConnection!.setLocalDescription(offer);
        socket.emit("offer", offer, roomNum);
      })
      .catch((error) => {
        console.log("Error creating offer:", error);
      });

    // Event listener for receiving offers
    socket.on("offer", (offer: RTCSessionDescriptionInit, senderId: string) => {
      if (!peerConnection) return;
      peerConnection
        .setRemoteDescription(offer)
        .then(() => {
          // Create answer and set local description
          peerConnection!.createAnswer().then((answer) => {
            peerConnection!.setLocalDescription(answer);
            socket.emit("answer", answer, roomNum);
          });
        })
        .catch((error) => {
          console.log("Error setting remote description:", error);
        });
    });

    // Event listener for receiving answers
    socket.on("answer", (answer: RTCSessionDescriptionInit) => {
      if (peerConnection) {
        peerConnection.setRemoteDescription(answer).catch((error) => {
          console.log("Error setting remote description:", error);
        });
      }
    });

    // Event listener for receiving ICE candidates
    socket.on("ice candidate", (candidate: RTCIceCandidateInit) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(candidate).catch((error) => {
          console.log("Error adding ICE candidate:", error);
        });
      }
    });
  }

  function handleRemoteTrack(event: RTCTrackEvent) {
    const remoteStream = event.streams[0];
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }

  function handleICECandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate && peerConnection) {
      // Send ICE candidate to the other user
      socket.emit("ice candidate", event.candidate, roomNum);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="videosWrapper">
      <h1>Ideas</h1>
      <ul>
        <li>
          Can block the user from getting to that page if he dont have a meeting
          in that time
        </li>
        <li>
          Can generate room automaticaly without typing the room id and such
          like a random uuid library maybe
        </li>
      </ul>
      <div className="videos">
        <video autoPlay muted playsInline ref={localVideoRef}></video>
        <video autoPlay muted playsInline ref={remoteVideoRef}></video>
      </div>
      <div className="roomControllers">
        <input
          type="text"
          value={roomNum}
          onChange={(e) => setRoomNum(e.target.value)}
        />
        {!roomCreated ? (
          <button className="joinBtn" onClick={createRoom}>
            Create Room
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default VideoMeeting;
