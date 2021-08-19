const tweetsSeed = require('../seed/tweetsSeed')

const clearAndSeedTweetCollection = async collection => {
	try {
		// take 10 random comments and seed?

		await collection.collection.drop()
		await collection.collection.insertMany(tweetsSeed)
	} catch(e) {
		throw e
	}
}

const clearTweetCollection = async collection => {
	try {
		await collection.collection.drop()
	} catch(e) {
		throw e
	}
}

module.exports = {
	clearAndSeedTweetCollection,
	clearTweetCollection
}