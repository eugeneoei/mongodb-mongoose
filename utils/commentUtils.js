const clearCommentCollection = async collection => {
	try {
		await collection.collection.drop()
	} catch(e) {
		throw e
	}
}

module.exports = {
	// clearAndSeedCommentCollection,
	clearCommentCollection
}