const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Tweet = require('./schemas/tweet')
const mongoURI = 'mongodb://localhost:27017/tweets'

const dbConnection = mongoose.connection

mongoose.connect(
	mongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
)

dbConnection.on('error', err => console.log(err.message))
dbConnection.on('connected', err => console.log('Connection to mongoDB successfully!'))
dbConnection.on('disconnected', err => console.log('Broken connection to mongoDB'))

app.use(express.json())
mongoose.set('useFindAndModify', false)
// mongoose.set('returnOriginal', false) // global settings such that all updated documents returned are AFTER the update

app.get('/tweets', async (req, res) => {
	try {
		res.send(
			await Tweet.find({})
		)
	} catch (e) {
		res.status(400).send(e.message ?? e)
	}
})

app.get('/tweets/:id', async (req, res) => {
	try {
		// METHOD 1
		// https://mongoosejs.com/docs/api.html#model_Model.findOne
		const tweet = await Tweet.findOne({
			_id: req.params.id
		})
		if (tweet) {
			res.send(tweet)
		} else {
			res.status(404).send('Tweet not found')
		}

		// // METHOD 2
		// // https://mongoosejs.com/docs/api.html#model_Model.findById
		// // Finds a single document by its _id field. findById(id) is almost* equivalent to findOne({ _id: id }). If you want to query by a document's _id, use findById() instead of findOne()
		// // * Except for how it treats undefined. If you use findOne(), you'll see that findOne(undefined) and findOne({ _id: undefined }) are equivalent to findOne({}) and return arbitrary documents. However, mongoose translates findById(undefined) into findOne({ _id: null }).
		// const tweet = await Tweet.findById(req.params.id)
		// if (tweet) {
		// 	res.send(tweet)
		// } else {
		// 	res.status(404).send('Tweet not found')
		// }
	} catch (e) {
		res.status(400).send(e.message ?? e)
	}
})

app.post('/tweets', async (req, res) => {
	try {
		res.send(await Tweet.create(req.body))
	} catch (e) {
		res.status(400).send(e.message ?? e)
	}
})

// By convention, PATCH request updates PART of the document
// Therefore, in this example, "PATCH /tweets/:id" route expects only to receive data required to update a Tweet
app.patch('/tweets/:id', async (req, res) => {
	try {
		// METHOD 1
		// https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
		res.send(
			await Tweet.findOneAndUpdate(
				{ _id: req.params.id },
				{
					title: `${req.body.title} using "findOneAndUpdate" method using HTTP PATCH`
				},
				{
					// By default, "findOneAndUpdate" returns the document as it was BEFORE the update was applied.
					// If you set the options "new" to true, "findOneAndUpdate" will instead return document AFTER update was applied.
					// if you want all updated documents returned are AFTER the update, you can set it globally using "mongoose.set('returnOriginal', false)" at the top
					// note that there are other flags to set as well
					new: true
				}
			)
		)

		// // METHOD 2
		// // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
		// res.send(
		// 	await Tweet.findByIdAndUpdate(
		// 		req.params.id,
		// 		{
		// 			title: `${req.body.title} using "findByIdAndUpdate" method using HTTP PATCH`
		// 		},
		// 		{
		// 			// Similar to "findOneAndUpdate", "findByIdAndUpdate" returns the document as it was BEFORE the update was applied
		// 			// set "new" to true to return document AFTER update was applied.
		// 			new: true
		// 		}
		// 	)
		// )

		// // METHOD 3
		// // "updateOne" DOES NOT return the updated document
		// // it returns the following instead:
		// // {
		// // 	"n": 1,
		// // 	"nModified": 1,
		// // 	"ok": 1
		// // }
		// // where "n" is Number of documents matched and "nModified" is Number of documents modified
		// // https://mongoosejs.com/docs/api.html#model_Model.updateOne
		// res.send(
		// 	await Tweet.updateOne(
		// 		{ _id: req.params.id },
		// 		{
		// 			title: `${req.body.title} using "updateOne" method using HTTP PATCH`
		// 		}
		// 	)
		// )

		// Comments
		// Which should you use? it all depends on the user flow you have in mind.
		// if you want to show the updated document after edit is successful, then i would say use "findOneAndUpdate" or "findByIdAndUpdate".
		// if you want to redirect the user after the document has been successfully updated, you can use "updateOne" since returning the updated document does not matter.

	} catch (e) {
		res.status(400).send(e.message ?? e)
	}
})

// By convention, PUT request replaces the ENTIRE document
// In this example, "PUT /tweets/:id" route expects to receive data that follows the Tweet schema
// ie data you passed into mongoose MUST provide the required fields else an error will be thrown
app.put('/tweets/:id', async (req, res) => {
	try {
		// // METHOD 1
		// // https://mongoosejs.com/docs/api.html#model_Model.findOneAndReplace
		// res.send(
		// 	await Tweet.findOneAndReplace(
		// 		{ _id: req.params.id },
		// 		req.body,
		// 		{
		// 			// Similar to "findOneAndUpdate", "findOneAndReplace" returns the document as it was BEFORE the update was applied
		// 			// set "new" to true to return document AFTER update was applied.
		// 			new: true
		// 		}
		// 	)
		// )

		// METHOD 2
		// similar to "updateOne", "replaceOne" DOES NOT return the updated document
		// it returns the following instead:
		// {
		// 	"n": 1,
		// 	"nModified": 1,
		// 	"ok": 1
		// }
		// where "n" is Number of documents matched and "nModified" is Number of documents modified
		// https://mongoosejs.com/docs/api.html#query_Query-replaceOne
		res.send(
			await Tweet.replaceOne(
				{ _id: req.params.id },
				req.body
			)
		)

	} catch (e) {
		res.status(400).send(e.message ?? e)
	}
})

// PUT vs PATCH
// https://stackoverflow.com/questions/28459418/use-of-put-vs-patch-methods-in-rest-api-real-life-scenarios

app.delete('/tweets/:id', async (req, res) => {
	try {
		
		// METHOD 1
		// https://mongoosejs.com/docs/api.html#model_Model.deleteOne
		// Deletes the first document that matches conditions from the collection
		const deleteResponse = await Tweet.deleteOne({
			_id: req.params.id
		})
		// '_id' created by mongodb is an "ObjectId" class (based on the error thrown)
		// if req.params.id cannot be casted to "ObjectId", mongo will not look for existence of document and throw an error
		// if req.params.id can be casted, attempt to delete will happen
		// if document is not found, response's "deletedCount" will be 0 therefore handle manually
		if (deleteResponse.deletedCount === 1) {
			res.send('Successfully deleted tweet using "deleteOne" method.')
		} else {
			throw 'The tweet you are trying to delete does not exist.'
		}

		// // METHOD 2
		// // https://mongoosejs.com/docs/api.html#model_Model.findOneAndDelete
		// // Finds a matching document, removes it.
		// const deleteResponse = await Tweet.findOneAndDelete({
		// 	_id: req.params.id
		// })
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findOneAndDelete" method.')
		// } else {
		// 	throw 'The tweet you are trying to delete using "findOneAndDelete" method does not exist.'
		// }

		// // METHOD 3
		// // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
		// // "findByIdAndDelete(id)" is a shorthand for "findOneAndDelete({ _id: id })"
		// const deleteResponse = await Tweet.findByIdAndDelete(req.params.id)
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findByIdAndDelete" method.')
		// } else {
		// 	throw 'The tweet you are trying to delete using "findByIdAndDelete" method does not exist.'
		// }

		// // METHOD 4
		// // https://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove
		// // Finds a matching document, removes it.
		// const deleteResponse = await Tweet.findOneAndRemove({
		// 	_id: req.params.id
		// })
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findOneAndRemove" method.')
		// } else {
		// 	throw 'The tweet you are trying to delete using "findOneAndRemove" method does not exist.'
		// }

		// // METHOD 5
		// // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
		// // "findByIdAndRemove(id)" is equivalent to "findOneAndRemove({ _id: id })"
		// const deleteResponse = await Tweet.findByIdAndRemove(req.params.id)
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findByIdAndRemove" method.')
		// } else {
		// 	throw 'The tweet you are trying to delete using "findByIdAndRemove" method does not exist.'
		// }


		// Comments

		// findOneAndDelete vs findOneAndRemove? which should you use?
		// according to the documentation,
		// Model.findOneAndDelete() differs slightly from Model.findOneAndRemove() in that findOneAndRemove() becomes a MongoDB findAndModify() command, as opposed to a findOneAndDelete() command.
		// For most mongoose use cases, this distinction is purely pedantic.
		// You should use findOneAndDelete() unless you have a good reason not to.

		// i would think the same applies for findByIdAndDelete vs findByIdAndRemove

	} catch (e) {
		res.status(400).send(e.message ?? e)
	}
})

app.listen(1234)
