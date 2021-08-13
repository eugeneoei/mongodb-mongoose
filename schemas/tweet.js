const mongoose = require('mongoose')
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
		author: {
			type: String,
			required: true
		},
		likes: {
			type: Number,
			default : 0
		}
	},
	{
		timestamps: true
	}
)

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet