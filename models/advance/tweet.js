const mongoose = require('mongoose')
const comment = require('./comment')
const { Schema } = mongoose

const tweetSchema = new Schema(
	{
		title : {
			type: String,
			required: true
		},
		body:{
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
			ref: 'User'
		},
		comments: [{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}]
	},
	{
		timestamps: true
	}
)

tweetSchema.post('findOneAndDelete', async doc => {
	// when a tweet is deleted, we need to
	// 	1. delete all comments that belongs to this deleted tweet
	try {
		await comment.deleteMany(
			{
				tweet: doc._id
			}
		)
	} catch(e) {
		console.log(e)
	}
})

const Tweet = mongoose.model('Tweet', tweetSchema) // tweetSchema to be used on Tweet collection

module.exports = Tweet