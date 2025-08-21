import User from "../model/user.model.js";
import FriendRequest from "../model/friendRequest.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currUserId = req.user.id;
    const currUser = req.user;
    const recommendedUser = await User.find({
      $and: [
        { _id: { $ne: currUserId } },
        { _id: { $nin: currUser.friends } },
        { isOnboarded: true },
      ],
    }).select("name profilePic nativeLanguage learningLanguage bio location");

    res.status(200).json(recommendedUser);
  } catch (error) {
    console.log("Error in getRecommandedUser controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "name profilePic nativeLanguage learningLanguage bio location")

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriend controllers: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id : reciverId } = req.params;

    if (myId === reciverId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const reciver = await User.findById(reciverId);
    if (!reciver) {
      return res.status(400).json({ message: "User Not found" });
    }

    if (reciver.friends.includes(myId)) {
      return res.status(400).json({ message: "you are alreday friend of the user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, reciver: reciverId },
        { sender: reciverId, reciver: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friends request already exists between you and user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      reciver: reciverId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendfriendRequest controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId  } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.reciver.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to others friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.reciver },
    });

    await User.findByIdAndUpdate(friendRequest.reciver, {
      $addToSet: { friends: friendRequest.sender },
    });
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controllers: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequest = await FriendRequest.find({
      reciver: req.user.id,
      status: "pending",
    }).populate("sender", "name profilePic nativeLanguage learningLanguage location");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("reciver", "name", "profilePic");

    res.status(200).json({ incomingRequest, acceptedReqs });
  } catch (error) {
    console.log("Error in getFriendRequests controllers: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("reciver", "name profilePic nativeLanguage learningLanguage location");

    res.status(200).json( outgoingReqs );
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controllers: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
