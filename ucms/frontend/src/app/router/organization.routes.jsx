import CampusPage from "@/features/organization/campus/pages/CampusPage";
import CollegePage from "@/features/organization/college/pages/CollegePage";

const organizationRoutes = [
  {
    path: "campuses",
    element: <CampusPage />,
    handle: {
      breadcrumb: "Campuses",
    },
  },
  {
    path: "colleges",
    element: <CollegePage />,
    handle: {
      breadcrumb: "Colleges",
    },
  },
];

export default organizationRoutes;
