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
			required: true,
			// but is this flow right? or should it be find({ email: "emailadd@email.com" }) to check?
			unique: true
		}
	},
	{
		timestamps: true
	}
)

const User = mongoose.model('User', userSchema)

module.exports = User
