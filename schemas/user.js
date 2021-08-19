const mongoose = require('mongoose')
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
			required: true
		},
		tweets: [{
			type: Schema.Types.ObjectId,
			ref: 'Tweet'
		}]
	},
	{
		timestamps: true
	}
)

// set unique field to prevent duplicates
// but is this flow right? or should it be find({ email: "emailadd@email.com" }) to check?
userSchema.index(
	{ email: 1 },
	{ unique: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User

// {
// 	"firstName": "Tony",
// 	"lastName": "Stark",
// 	"email": "tony.stark@avengers.com"
// }