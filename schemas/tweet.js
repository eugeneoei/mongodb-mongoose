const mongoose = require('mongoose')
const { Schema } = mongoose

const tweetSchema = new Schema(
	{
		// title : {
		// 	type: String,
		// 	required: true
		// },
		// body:{
		// 	type: String,
		// 	required: true
		// },
		// author: {
		// 	type: String,
		// 	required: true
		// },
		// reactions: {
		// 	likes: {
		// 		type: Number,
		// 		default : 0
		// 	},
		// 	dislikes: {
		// 		type: Number,
		// 		default : 0
		// 	}
		// }



		
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
			ref: 'Comment' // name of related collection
		}]
	},
	{
		timestamps: true
	}
)

const Tweet = mongoose.model('Tweet', tweetSchema) // tweetSchema to be used on Tweet collection

module.exports = Tweet