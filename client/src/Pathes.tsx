import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { User } from "./types/type";
import BookingPage from "./pages/Booking/BookingPage";

const HomePage = lazy(() => import("./pages/Home/HomePage"));
const AdminPage = lazy(() => import("./pages/Admin/AdminPage"));
const OneProfile = lazy(() => import("./components/OneProfile/OneProfile"));
const RegisterPage = lazy(() => import("./pages/Register/RegisterPage"));
const SigninPage = lazy(() => import("./pages/Signin/SigninPage"));
const UserDashboardPage = lazy(
  () => import("./pages/UserDashboard/UserDashboardPage")
);
const Communication = lazy(
  () => import("./pages/CommunicationPage/Communication")
);
const ChartsPage = lazy(() => import("./pages/Charts/Charts"));

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
    path: "booking/:id",
    element: ({ user }: { user: User }) =>
      user != null && user.role != 0 ? <BookingPage /> : <Navigate to="/" />,
  },
  {
    path: "charts",
    element: ({ user }: { user: User }) =>
      user != null && user.role == 0 ? <ChartsPage /> : <Navigate to="/" />,
  },
  {
    path: "*",
    element: ({ user }: { user: User }) => <Navigate to="/" />,
  },
];

export default routes;
