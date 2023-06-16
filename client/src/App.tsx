import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { UserType } from "./features/userSlice";
import { useEffect } from "react";
import { adminUsers } from "./features/adminSlice";
import { useSaveLocalStorage } from "./hooks/useSaveLocalStorage";
import Messages from "./components/Messages/Messages";
import routes, { RouteType } from "./Pathes";
import { handleSocket, sendMessageTime, updateStatus } from "./Utils/functions";
import { useLogin } from "./hooks/useLogin";
import Loading from "./components/Loading/Loading";
import RatingModal from "./components/RatingModal/RatingModal";
import CompletedMeetingModal from "./components/CompletedMeetingModal/CompletedMeetingModal";

import { io } from "socket.io-client";
export const socket = io("http://localhost:3001");

const App = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [meetingId, setMeetingId] = useState<string>("");
  const [completedMeetingModal, setCompletedMeetingModal] =
    useState<boolean>(false);
  const [modalText, setModalText] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const { createIfDontHave } = useSaveLocalStorage();
  const { checkTokenValidity } = useLogin();
  const dispatch = useDispatch();
  const date = new Date();
  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  useEffect(() => {
    checkTokenValidity();
    sendMessageTime(dispatch);
    createIfDontHave();
  }, []);
  useEffect(() => {
    updateStatus(socket, dispatch, user);
  }, [socket, user, users.length]);
  useEffect(() => {
    handleSocket(
      socket,
      dispatch,
      setMeetingId,
      setModalOpen,
      setModalText,
      setDoctorId,
      setCompletedMeetingModal,
      user!
    );
  }, [socket]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Navbar />
          {modalOpen ? (
            <RatingModal
              modalText={modalText}
              setModalOpen={setModalOpen}
              setDoctorId={setDoctorId}
              doctorId={doctorId}
            />
          ) : null}
          {completedMeetingModal ? (
            <CompletedMeetingModal
              setModal={setCompletedMeetingModal}
              meetingID={meetingId}
            />
          ) : null}
          <Messages />
          <Routes>
            {routes.map((route: RouteType) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    typeof route.element === "function" ? (
                      <route.element user={user} />
                    ) : (
                      route.element
                    )
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
