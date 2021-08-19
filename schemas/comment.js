const mongoose = require('mongoose')
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
			ref: 'User'
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: 'Tweet' // name of related collection
		}
	},
	{
		timestamps: true
	}
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment

// {
// 	"body": "",
// 	"userId": "",
// 	"tweetId": ""
// }
