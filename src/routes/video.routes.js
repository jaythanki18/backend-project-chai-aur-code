import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
 } from "../controllers/video.controller.js"
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

  const router = Router()

  router.use(verifyJWT);

  router
    .route("/allVideos")
    .get(getAllVideos)
    .post(
      upload.fields([
        {
          name: "videoFile",
          maxCount: 1,
        },
        {
          name: "thumbnail",
          maxCount: 1,
      },
      ]),
      publishAVideo
    );

  router
    .route(":/videoId")
    .patch(upload.single("thumbnail"),updateVideo)
    .delete(deleteVideo)
    .get(getVideoById);
  
  router
    .route("/togglePublish/:videoId").patch(togglePublishStatus);

/*
  GET /api/v1/videos/allVideos
  POST /api/v1/videos/allVideos
  PATCH /api/v1/videos/:videoId
  DELETE /api/v1/videos/:videoId
  GET /api/v1/videos/:videoId
  PATCH /api/v1/videos/togglePublish/:videoId
*/
export default router;