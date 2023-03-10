const { User } = require("../models");

userController = {
  getUsers(req, res) {
    User.find()
      .populate({ path: "reactions", select: "-__v" })
      .then((users) => res.json(users))
      .catch((err) => {
        console.error({ message: err });
        return res.status(500).json(err);
      });
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({ path: "reactions", select: "-__v" })
      .then((users) =>
        !users
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(users)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  //update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((users) =>
        !users
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(users)
      )
      .catch((err) => res.status(500).json(err));
  },

  //delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((users) =>
        res.json({ message: "User has been successfully deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    // res.status(500).json(err));
  },

  //addFriend
  addFriend(req, res) {
    console.log("You are adding a friend");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friends.friendId } },
      { new: true }
    )
      .then((dbFriends) => {
        if (!dbFriends) {
          return res
            .status(404)
            .json({ message: "No friend found with that Id" });
        }
        res.json(dbFriends);
      })
      .catch((err) => res.status(500).json(err));
  },

  //remove a friend
  removeFriend(req, res) {
    User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbFriends) => {
        if (!dbFriends) {
          return res
            .status(404)
            .json({ message: "No friend found with that Id" });
        }
        res.json(dbFriends);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
