const mongoose = require('mongoose')
const tweet = require('./tweet')
const { Schema } = mongoose

const commentSchema = new Schema(
	{
		body: {
			type: String,
			required: true
		},
		reactions: {
			likes: {
				type: Number,
				default : 0
			},
			dislikes: {
				type: Number,
				default : 0
			}
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: 'Tweet', // name of related collection
			required: true
		}
	},
	{
		timestamps: true
	}
)

commentSchema.post('findOneAndDelete', async doc => {
	// when a comment is deleted, we need to
	// 	1. remove comment from tweet's comments array (each comment can only belong to one tweet)
	try {
		await tweet.updateOne(
			{
				comments: doc._id
			},
			{
				$pull: {
					comments: doc._id
				}
			}
		)
	} catch(e) {
		console.log(e)
	}
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
