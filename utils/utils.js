const tweetsSeed = require('../seed/tweets')

const clearAndSeedDatabase = async collection => {
	await collection.collection.drop()
	await collection.collection.insertMany(tweetsSeed)
}

// const seedDatabse = () => {

// }

module.exports = {
	clearAndSeedDatabase
}