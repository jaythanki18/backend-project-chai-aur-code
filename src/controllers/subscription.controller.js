import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription

  const {channelId} = req.params
  if (!isValidObjectId(channelId)) throw new ApiError(400, 'Invalid channel id');

  const subscriberAlready = await Subscription.findOne({
    channel : channelId,
    subscriber: req.user?._id,
  });

  if(subscriberAlready){
    await Subscription.findByIdAndDelete(subscriberAlready?._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          {subscribed: false},
          "Channel unsubscribed successfully!"
        )
      );
  }

  await Subscription.create({
    channel: channelId,
    subscriber: req.user?._id
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        {subscribed: true},
        "Channel subscribed successfully!"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)) throw new ApiError(400,"Invalid Channel ID");

    const subscribers = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
          pipeline: [
            {
              $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribedToSubscriber",
              }
            },
            {
              $addFields: {
                subscribedToSubscriber: {
                  $cond: {
                    $if: {
                      $in: [channelId,  "$subscribedToSubscriber?.subscriber"]
                    },
                    then: true,
                    else: true,
                  }  
                },
                subscriberCount: {
                  $sum: "$subcribedToSubscriber",
                }
              }
            }
          ]
        }
      },
      {
        $unwind: "$subscriber"
      },
      {
        $project: {
          subscriber: {
            _id: 1,
            username: 1,
            fullName: 1,
            "avatar?.url": 1,
            subscribedToSubscriber: 1,
            subscriberCount: 1,
          }
        }
      }
    ]);

    if(!subscribers){
      throw new ApiError(500, "Failed to fetch subscribers");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(201, subscribers, "Subscribers fetched successfully")
      );
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
      throw new ApiError(400, "Invalid subscriber id");
    }

    const subscribedChannels = await Subscription.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberId);
        }
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "channel",
          as: "subscribedChannels",
          pipeline: [
            {
              $lookup: {
                from: "videos",
                foreignField: "owner",
                localField: "_id",
                as: "videos"
              }
            },
            {
              $addFields: {
                latestVideos: {
                  $last: "$videos",
                }
              }
            }
          ]
        }
      },
      {
        $unwind: "$subscribedChannels",
      },
      {
        $project: {
          subscribedChannels: {
            _id: 1,
            username: 1,
            fullName: 1,
            latestVideos: {
              _id: 1,
              "videoFile.url": 1,
              "thumbnail.url": 1,
              duration: 1,
              title: 1,
              createdAt: 1,
              description: 1,
              owner: 1,
            }
          }
        }
      }
    ]);

    if(!subscribedChannels){
      return new ApiError(500, "Failed to fetch subscribed channels");
    }

    return res
      .status(200)
      .json(
         new ApiResponse(
            201,
            subscribedChannels,
            "subscribed channels fetched Successfully"
         )
    );
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}