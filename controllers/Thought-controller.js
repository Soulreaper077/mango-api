//const { Thoughts } = require('../models'); 
const Thought = require('../models/Thought');
const User = require('../models/User');

const thoughtController = {
    getAllThoughts(req, res){
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err); 
        });
    },

    // get a single thought 
    getThoughtById({ params }, res) {
        Thought.findOne({
            _id: params.thoughtId,
        })
        .select('-__v')
        .sort({
            _id: -1,
        })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({  message: 'No thought with this id '
                });
                return;
            }
            res.json(dbThoughtData); 
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // add thoughts 
    addThought({ body }, res) {
        Thought.create(body)
        .then(( ThoughtData) => {
            return User.findOneAndUpdate(
                {
                    _id: body.userId,
                },
                {
                    $addToSet: {
                        thoughts: ThoughtData._id,
                    },
                },
                {
                    new: true,
                }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this id ' });
                return; 
            }
            res.json(dbUserData)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err); 
        });
    },

    // upadate thoughts 
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId}, { $set: body }, { new: true, runValidators: true })
        .then(updateThought => {
            if (!updateThought) {
                res.status(404).json({ message: 'No thought with this ID try agaain!' });
            }
            return res.json({ message: 'Thought was successfully updated '});
        })
        .catch(err => res.status(400).json(err));
    },

    // delete thoughts 
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(removeThought => {
            if (!removeThought) {
                return res.status(404).json({ message: 'No thought with this ID try agaain!' });
            }
            return User.findOneAndUpdate(
                {
                    thoughts: params.thoughtId,
                },
                {
                    $pull: {
                        thoughts: params.thoughtId,
                    },
                },
                {
                    new: true 
                }
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: ' no thought with this id '});
            return; 
            }
            res.json(dbUserData); 
        })
        .catch((err) => res.json(err)); 
    },

    // reactions 
    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body}},
            { new: true, runValidators: true}
        )
        .populate({ 
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(400).json({ message: ' There is no thought with this id'})
                return; 
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err))
    },

    // remove reactions 
    removeReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId}}},
            { new: true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(400).json({ message: ' There is no thought with this id'})
                return; 
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err))
    },
};

module.exports = thoughtController; 