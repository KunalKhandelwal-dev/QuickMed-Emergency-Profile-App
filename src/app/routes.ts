import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { CreateProfile } from "./pages/CreateProfile";
import { EmergencyProfile } from "./pages/EmergencyProfile";
import { AccessLogs } from "./pages/AccessLogs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/create-profile",
    Component: CreateProfile,
  },
  {
    path: "/emergency/:profileId",
    Component: EmergencyProfile,
  },
  {
    path: "/access-logs/:profileId",
    Component: AccessLogs,
  },
]);
