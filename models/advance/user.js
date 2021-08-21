const mongoose = require('mongoose')
const tweet = require('./tweet')
const comment = require('./comment')
const { Schema } = mongoose

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			// but is this flow right? or should it be find({ email: "emailadd@email.com" }) to check?
			unique: true
		}
	},
	{
		timestamps: true
	}
)

userSchema.post('findOneAndDelete', async doc => {
	// when a user is deleted, we need to
	// 	1. delete all tweets by deleted user
	// 	2. delete all comments by deleted user
	// 	3. remove all comments made by user in ALL tweets
	try {
		await tweet.deleteMany(
			{
				user: doc._id
			}
		)
		await comment.deleteMany(
			{
				user: doc._id
			}
		)
		await tweet.updateMany(
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

const User = mongoose.model('User', userSchema)

module.exports = User
