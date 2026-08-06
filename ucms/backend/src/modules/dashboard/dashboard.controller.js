import * as dashboardService from "./dashboard.service.js";
import sendResponse from "../../utils/sendResponse.js";

export const getStatistics = async (req, res) => {
  const data = await dashboardService.getStatistics();

  sendResponse(res, {
    message: "Dashboard statistics retrieved successfully.",
    data,
  });
};
