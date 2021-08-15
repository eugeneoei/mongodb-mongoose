const tweetsSeed = require('../seed/tweetsSeed')

const clearAndSeedDatabase = async collection => {
	const collectionName = collection.collection.collectionName
	try {
		await collection.collection.drop()
		await collection.collection.insertMany(tweetsSeed)
	} catch(e) {
		throw e
	}
}

const clearDataBase = async collection => {
	try {
		await collection.collection.drop()
	} catch(e) {
		throw e
	}
}

module.exports = {
	clearAndSeedDatabase,
	clearDataBase
}