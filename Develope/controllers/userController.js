const { User, Thought } = require('../models');

module.exports = {
  // Get all students
  async getUsers(req, res) {
    try {
      const user = await User.find();
      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleUser(req, res) {
    try {
      const user = await Users.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate("friends")
        .populate("thoughts")

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user)
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a student and remove them from the course
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such user exists' })
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

async updateUser(req, res) {
try {
  const user = await User.findOneAndUpdate({_id: req.params.userId}, {$set: req.body}, {runValidators: true, new: true})
  if(!user) {
    return res.status(404).json({ message: 'No such user exists' })
  } res.json(user)
} catch (error) {
  res.status(500).json(err);
}
},

  // Add an assignment to a student
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId} },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' })
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
