const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with desired ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a tought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate({userName: req.body.userName}, {$push: {thoughts: thought._id}}, {new: true})
      if(!user)
      return res.status(404).json({ message: 'No user with desired ID' });
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with desired ID' });
      }

      await User.deleteMany({ _id: { $in: thought.users } });
      res.json({ message: 'Thought(s) deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with desired id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

// creat reaction
async createReaction(req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$addtoSet: {reactions: req.body}},
      {runValidators: true, new: true}
    );
    if(!thought) {
      res.status(404).json({message: 'No thought with desired id!'});
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
  },

  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$pull: {reactions: {reactionId:req.params.reactionId}}},
        {new: true}
      )
      if (!thought) {
        res.status(404).json({message: 'No thought with desired id!'});
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

