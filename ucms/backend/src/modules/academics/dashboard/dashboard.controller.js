import * as dashboardService from "./dashboard.service.js";

import sendResponse from "../../../utils/sendResponse.js";

export const getDashboard = async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.user);

  sendResponse(res, {
    message: "Dashboard retrieved successfully.",
    data: dashboard,
  });
};
