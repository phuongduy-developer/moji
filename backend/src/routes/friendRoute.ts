import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friendController";

const friendRoute = express.Router();

friendRoute.post("/requests", sendFriendRequest);
friendRoute.post("/requests/:requestId/accept", acceptFriendRequest);
friendRoute.post("/requests/:requestId/decline", declineFriendRequest);
friendRoute.get("/", getAllFriends);
friendRoute.get("/requests", getFriendRequests);

export default friendRoute;
