const mongoose = require('mongoose')
const { Schema } = mongoose

const tweet = require('./tweet')

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
	// when a comment is deleted, remove comment from tweet's comments array
	try {
		await tweet.updateOne(
			{
				comments: doc._id
			},
			{
				$pull: {
					comments: doc._id
				}
			},
			{
				multi: true
			}
		)
	} catch(e) {
		console.log(e)
	}
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
