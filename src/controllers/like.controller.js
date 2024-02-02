import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

//TODO: toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
      throw new ApiError(400, 'Invalid Video ID');
    }

    const likeAlready = await Like.findOne({
      video: videoId,
      likedBy: req.user?._id,
    });

    if(likeAlready){
      await Like.findByIdAndDelete(likeAlready?._id);

      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            {liked : false},
            "Video unliked successfully"
          )
        );
    }

    await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          {liked : true},
          "Video liked successfully"
        )
      );
});

//TODO: toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if(!isValidObjectId(commentId)){
      throw new ApiError(400, "Invalid comment id");
    }

    const likeAlready = await Like.findOne({
      comment: commentId,
      likedBy:  req.user?._id,
    });

    if(likeAlready){
      await Like.findByIdAndDelete(likeAlready?._id);

      return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          {commentId : false},
          "Comment unliked successfully"
        )
      );
    }

    await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
   });

   return res
      .status(200)
      .json(
        new ApiResponse(201, { commented: true }, "Comment Liked Successfully")
      );
})

//TODO: toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!isValidObjectId(tweetId)){
      throw new ApiError(400, "Invalid tweet id");
    }

    const likeAlready = await Like.findOne({
      tweet: tweetId,
      likedBy:  req.user?._id,
    });

    if(likeAlready){
      await Like.findByIdAndDelete(likeAlready?._id);

      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            { tweeted: false },
            "Unlike tweet successfully"
          )
        );
    }

    await Like.create({
      tweet: tweetId,
      likedBy: req.user?._id,
    });

    return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        {tweeted:true},
        "Tweet liked successfully"
      )
    );
}
);

//TODO: get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    
  const likedVideos  = await Like.aggregate([
    {
      $set: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      }
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "video",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
              as: "ownerDetails"
            }
          },
          {
            $unwind: "$ownerDetails",
          }
        ]
      }
    },
    {
      $unwind: "$videos",
    },
    {
      $sort: {
        createdAt : -1
      }
    },
    {
      $project: {
        videos: {
          "videoFile.url": 1,
          "thumbnail.url": 1,
          owner: 1,
          title: 1,
          description: 1,
          views: 1,
          duration: 1,
          createdAt: 1,
          isPublished: 1,
          ownerDetails: {
            username: 1,
            fullName: 1,
            "avatar?.url": 1,
          },
        }
      }
    }
  ]);

  if(!likedVideos){
    throw new ApiError(500, "Failed to fetch liked videos");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        likedVideos,
        "Liked videos fetched successfully"
      )
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}