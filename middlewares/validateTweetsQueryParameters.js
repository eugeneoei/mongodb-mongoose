// const Tweet = require('../schemas/tweet')

// const validQueryParameters = Object.keys(Tweet.schema.tree)
// const validData = {
// 	limit: ['5', '10', '25', 'all'],
// 	sortBy: ['asc', 'desc']
// }

// // console.log(Tweet.schema)

// const validateTweetsQueryParameters = (req, res, next) => {
// 	const query = req.query
// 	console.log(validQueryParameters)
// 	// try {
// 	// 	if (Object.keys(req.body).length === 0) {
// 	// 		throw new TypeError('"type" and "action" are required.')
// 	// 	}
// 	// 	if (!validTypes.includes(req.body.type)) {
// 	// 		throw new TypeError('Invalid "type" value.')
// 	// 	}
// 	// 	if (!validActions.includes(req.body.action)) {
// 	// 		throw new TypeError('Invalid "action" value.')
// 	// 	}
// 	// 	next()
// 	// } catch(e) {
// 	// 	res.status(400).send({
// 	// 		name: e.name,
// 	// 		error: e.message
// 	// 	})
// 	// }
// 	next()
// }

// module.exports = validateTweetsQueryParameters