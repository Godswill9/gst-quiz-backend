const express = require("express");
const {
  createSession,
  getUserSessions,
  getAllUserSessions,
  updateSession,
  updateSessionUser,
  deleteSession,
} = require("../controllers/ANALYTICS_SESSION");
const {
  createNewVisit,
  getAllUserVisits,
} = require("../controllers/ANALYTICS_VISITS");
const {
  createNewEvent,
  getAllUserevents,
} = require("../controllers/ANALYTICS_EVENT");
const {
  createNewClickEvent,
  getAllUserclicks,
} = require("../controllers/ANALYTICS_CLICK");
const { authenticate } = require("../config/verifyToken");
const route = express.Router();

route.post("/newSession", createSession);
route.post("/newEvent", createNewEvent);
route.post("/newVisit", createNewVisit);
route.post("/newClick", createNewClickEvent);

route.get("/getAllSessions", authenticate, getAllUserSessions);
route.get("/getAllVisits", authenticate, getAllUserVisits);
route.get("/getAllClicks", authenticate, getAllUserclicks);
route.get("/getAllEvents", authenticate, getAllUserevents);

route.put("/updateUserSession/:session_id", authenticate, updateSessionUser);
route.put("/updateUserEndSession/:session_id", authenticate, updateSession);

route.delete("/deleteSession/:session_id", authenticate, deleteSession);

module.exports = route;
