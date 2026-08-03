import { UAParser } from "ua-parser-js";

const sessionContext = (req, res, next) => {
  const parser = new UAParser(req.get("user-agent"));

  const browser = parser.getBrowser();
  const os = parser.getOS();

  req.sessionContext = {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    deviceName: `${os.name || "Unknown"} • ${browser.name || "Unknown"}`,
  };

  next();
};

export default sessionContext;
