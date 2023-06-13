import React, { useEffect, useRef, useState } from "react";
import "./video.scss";
import { socket } from "../../App";
import { BsMic, BsMicMute } from "react-icons/bs";
import { FiCamera, FiCameraOff } from "react-icons/fi";
import { ImPhoneHangUp } from "react-icons/im";
import { motion } from "framer-motion";
import { IMeet } from "../../types/type";
import { useNavigate, useParams } from "react-router-dom";
import { useMeetings } from "../../hooks/useMeetings";
import MeetingTimer from "../../components/Timer/MeetingTimer";

const VideoMeeting = () => {
  const { id } = useParams();
  const [meetingDuration, setMeetingDuration] = useState<number>(0);
  const [meeting, setMeeting] = useState<IMeet | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [remoteConnected, setRemoteConnected] = useState<boolean>(false);
  const [roomCreated, setRoomCreated] = useState<boolean>(false);
  const [roomNum, setRoomNum] = useState<string>(id!);
  const { getOneMeeting } = useMeetings();

  useEffect(() => {
    if (!localStorage.getItem("meeting-time")) {
      localStorage.setItem("meeting-time", JSON.stringify(0));
    }
  }, []);

  const navigate = useNavigate();
  let peerConnection: RTCPeerConnection | null = null;

  function closeCall() {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    // Disable video and audio tracks
    if (localVideoRef.current) {
      const stream = localVideoRef.current!.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      if (remoteConnected) {
        const stream2 = remoteVideoRef.current!.srcObject as MediaStream;
        stream2.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }

    socket.emit("leave-call", roomNum, meeting?.doctorId, meeting?._id);
    setRemoteConnected(false);
    setRoomCreated(false);
    localStorage.setItem("meeting-time", JSON.stringify(meetingDuration));
    navigate("/dashboard/0");
  }
  function otherPersonLeft() {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    const stream = localVideoRef.current!.srcObject as MediaStream;
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    localStorage.setItem("meeting-time", JSON.stringify(meetingDuration));
    setRemoteConnected(false);
    setRoomCreated(false);
    navigate("/dashboard/0");
  }
  async function init() {
    await getOneMeeting(id!, setMeeting);
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

    //Event listener for user closing call
    socket.on("user-left", () => {
      otherPersonLeft();
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
      setRemoteConnected(true);
    }
  }

  function handleICECandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate && peerConnection) {
      // Send ICE candidate to the other user
      socket.emit("ice candidate", event.candidate, roomNum);
    }
  }

  const toggleVideo = () => {
    setVideoEnabled((prevEnabled) => !prevEnabled);
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const tracks = stream.getVideoTracks();
      tracks.forEach((track) => {
        track.enabled = !videoEnabled;
      });
    }
  };

  const toggleAudio = () => {
    setAudioEnabled((prevEnabled) => !prevEnabled);
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const tracks = stream.getAudioTracks();
      tracks.forEach((track) => {
        track.enabled = !audioEnabled;
      });
    }
  };

  useEffect(() => {
    init().then(() => {
      createRoom();
    });
  }, []);
  useEffect(() => {
    if (meeting && meeting.completed) {
      window.location.pathname = "";
    }
  }, [meeting]);

  return (
    <motion.div layout>
      <motion.div layout className="videosWrapper">
        <motion.h1
          initial={{ y: 50 }}
          transition={{ duration: 0.6 }}
          whileInView={{ y: 0 }}
        >
          Video Meeting <span className="doteGlowing"></span>
        </motion.h1>
        <MeetingTimer
          meetingDuration={meetingDuration}
          setMeetingDuration={setMeetingDuration}
        />
        {localVideoRef && (
          <div>
            <div className={remoteConnected ? "videos" : "videos justOne"}>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <label>You</label>
                <video
                  autoPlay
                  muted={!audioEnabled}
                  playsInline
                  ref={localVideoRef}
                ></video>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="otherVideo"
              >
                {remoteConnected && <label>Other</label>}
                <video
                  autoPlay
                  muted={!audioEnabled}
                  playsInline
                  ref={remoteVideoRef}
                ></video>
              </motion.div>
            </div>
            <div className="sessionControllers">
              <button onClick={toggleVideo}>
                {videoEnabled ? (
                  <FiCamera fontWeight={800} />
                ) : (
                  <FiCameraOff fontWeight={"bold"} />
                )}
              </button>
              <button onClick={toggleAudio}>
                {audioEnabled ? (
                  <BsMic fontWeight={"bold"} />
                ) : (
                  <BsMicMute fontWeight={"bold"} />
                )}
              </button>
              <button onClick={closeCall}>
                <ImPhoneHangUp />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VideoMeeting;
