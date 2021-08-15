const tweetsSeed = require('../seed/tweetsSeed')
// const tweetsGenerator = require('../seed/tweetsGenerator')

const clearAndSeedDatabase = async collection => {
	// await tweetsGenerator.getRandomTweets()
	const collectionName = collection.collection.collectionName
	try {
		await collection.collection.drop()
		await collection.collection.insertMany(tweetsSeed)
	} catch(e) {
		console.log(e)
	}
}

module.exports = {
	clearAndSeedDatabase
}