import {
  AdminPage,
  Communication,
  HomePage,
  OneProfile,
  ProfilePage,
  RegisterPage,
  SigninPage,
  SystemMessagesPage,
  UserDashboardPage,
} from "./pages/index";
import { Navigate } from "react-router-dom";
import { User } from "./types/type";
import AddDoctor from "./pages/AddDoctor/AddDoctor";

export interface RouteType {
  element: JSX.Element | React.ElementType<any>;
  path: string;
}

const routes: RouteType[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin",
    element: ({ user }: { user: User }) =>
      user != null && user?.role == 0 ? <AdminPage /> : <Navigate to="/" />,
  },
  {
    path: "/profile",
    element: ({ user }: { user: User }) =>
      user != null ? <ProfilePage /> : <Navigate to="/" />,
  },
  {
    path: "/profile/:id",
    element: ({ user }: { user: User }) =>
      user != null ? <OneProfile /> : <Navigate to="/" />,
  },
  {
    path: "/register",
    element: ({ user }: { user: User }) =>
      user != null ? <Navigate to="/" /> : <RegisterPage />,
  },
  {
    path: "/signin",
    element: ({ user }: { user: User }) =>
      user != null ? <Navigate to="/" /> : <SigninPage />,
  },
  {
    path: "/dashboard",
    element: ({ user }: { user: User }) =>
      user != null && user.approved ? (
        <UserDashboardPage />
      ) : (
        <Navigate to="/" />
      ),
  },
  {
    path: "/communication/:userid",
    element: ({ user }: { user: User }) =>
      user != null && user.approved ? <Communication /> : <Navigate to="/" />,
  },
  {
    path: "/system-messages",
    element: ({ user }: { user: User }) =>
      user != null && user.role != 0 ? (
        <SystemMessagesPage />
      ) : (
        <Navigate to="/" />
      ),
  },
  {
    path: "/dashboard/add-doctor",
    element: ({ user }: { user: User }) =>
      user != null && user.role != 0 ? <AddDoctor /> : <Navigate to="/" />,
  },
  {
    path: "booking/:id",
    element: ({ user }: { user: User }) =>
      user != null && user.role != 0 ? (
        <h1>This is me BOOKINGs</h1>
      ) : (
        <Navigate to="/" />
      ),
  },
];

export default routes;
