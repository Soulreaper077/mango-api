const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path:'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1})
        .then(dbUserData => res.json(dbUserData))
        .catch( err => {
            console.log(err);
            res.status(400).json(err)
        }); 
    },

    // get only one of the users 
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return; 
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err); 
        });
    },

    // creating a new user 
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch( err => res.status(400).json(err));
    },

    // update 
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId}, { $set: body }, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this ID try agaain!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete the user 
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this ID try agaain!' });
                return
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // adding friends
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId}},
            { new: true }
        )
        .populate({ 
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id '})
                return; 
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err))
    },

    // removing a frindd
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId })
        .then(deleteFriend => {
            if(!deleteFriend) {
                res.status(404).json({ message: 'No friend found with this id '})
            }
            return User.findOneAndUpdate(
                {
                    friends: params.friendId,
                },
                {
                    $pull: {
                        friends: params.friendId
                    },
                },
                {
                    new: true 
                }
            )
        })
        .then((dbUserData) => {
            if(!dbUserData) {
                res.status(404).json({ message: 'There is no friend with this id '});
                return; 
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err))
    },
}; 

module.exports = userController; 