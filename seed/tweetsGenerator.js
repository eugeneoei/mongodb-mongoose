const axios = require('axios')
const fs = require('fs')

const authors = [
	'Tony Stark',
	'Peter Parker',
	'Black Widow',
	'Steve Rogers',
	'Hawkeye',
	'Dr. Banner',
	'Thor',
	'Thanos',
	'Vision',
	'Scarlette Witch',
	'Black Panther',
	'Bucky Barnes'
]
const getRandomTitle = async () => {
	const res = await axios.get('http://metaphorpsum.com/sentences/1')
	return res.data
}
const getRandomBody = async () => {
	const res = await axios.get(`http://metaphorpsum.com/sentences/${Math.floor(Math.random() * 5) + 2}`)
	return res.data
}
const getRandomAuthor = () => authors[Math.floor(Math.random() * authors.length)]
const getRandomBetweenOneAndHundred = () => Math.floor(Math.random() * 100) + 1
const getRandomDate = () => {
	const today = new Date()
	const dayVariance = Math.floor(Math.random() * 400) + 1
	return new Date(today - Math.random()*dayVariance*24*60*60*1000)
}

const generateRandomTweets = async () => {
	const array = [...Array(100).keys()]
	const promises = array.map(async () => {
		const date = getRandomDate()
		return await ({
			title: await getRandomTitle(),
			body: await getRandomBody(),
			author: getRandomAuthor(),
			reactions: {
				likes: getRandomBetweenOneAndHundred(),
				dislikes: getRandomBetweenOneAndHundred()
			},
			createdAt: date,
			updatedAt: date
		})
	})
	const tweetsArray = await Promise.all(promises)
	fs.writeFileSync('./seed/tweetsSeed.json', JSON.stringify(tweetsArray))
	console.log('Generate new tweets complete.')
	return
}

module.exports = {
	generateRandomTweets
}

