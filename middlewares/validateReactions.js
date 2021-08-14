const validTypes = ['likes', 'dislikes']
const validActions = ['increment', 'decrement']

const validateReactions = (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new TypeError('"type" and "action" are required.')
		}
		if (!validTypes.includes(req.body.type)) {
			throw new TypeError('Invalid "type" value.')
		}
		if (!validActions.includes(req.body.action)) {
			throw new TypeError('Invalid "action" value.')
		}
		next()
	} catch(e) {
		res.status(400).send({
			name: e.name,
			error: e.message
		})
	}
}

module.exports = validateReactions