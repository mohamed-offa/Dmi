import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { LabResults } from "./pages/LabResults";
import { Prescriptions } from "./pages/Prescriptions";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Overview },
      { path: "workflow", Component: Dashboard },
      { path: "history", Component: History },
      { path: "labs", Component: LabResults },
      { path: "prescriptions", Component: Prescriptions },
    ],
  },
]);
