const mongoose = require('mongoose')
const Tweet = require('./tweet')
const Comment = require('./comment')
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
		const commentsBelongingToDeletedUser = await Comment.find({
			user: doc._id
		})
		await Tweet.deleteMany(
			{
				user: doc._id
			}
		)
		
		await Comment.deleteMany(
			{
				user: doc._id
			}
		)
		await Tweet.updateMany(
			{},
			{
				$pull: {
					comments: {
						$in: commentsBelongingToDeletedUser.map(deletedComment => deletedComment._id)
					}
				}
			}
		)
	} catch(e) {
		console.log(e)
	}
})

const User = mongoose.model('User', userSchema)

module.exports = User
