const {Schema, Model, Types } = require('mongoose'); 
const dateFormat = require('../utils/dateFormat');

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true, 
            minLength: 1,
            maxLength: 200
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username: {
            type: String,
            required: true, 
        },
        reactions: [ReactionSchema]
    },
    {
    toJSON: {
        getters: true 
    }
}
); 

const ReactionSchema = new Schema  (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true, 
            maxLength: 200
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true 
        }
    }
);

const Thoughts = Model('Thoughts', ThoughtSchema);

module.exports = Thoughts; 