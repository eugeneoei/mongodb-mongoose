# Objective

The objective is not to tell how you should query from `mongodb` through `mongoose` and say which is right or wrong. Rather, to demonstrate the different implmentations to achieve the same result.

Ultimately, it depends what features are required and from there, you write your APIs accordingly to support these features requirements.

I've not built an app with `mongodb` and with `mongoose` as the driver. so I'm definitely not in the position to say if method A is better than method B/C/D.. and so on.

Also, the examples here are based on my own understanding from experimenting and referencing the [mongoose](https://mongoosejs.com/docs/guide.html) docs. I may be wrong with the implementations. So let me know if you spot any mistakes and I will correct them accordingly.

In the `index.js`, I have structured routes for `GET`, `POST`, `PUT`, `PATCH` and `DELETE`. In summary:

- [`GET /tweets`](#get-tweets-route) - get all tweets
- [`GET /tweets/:id`](#get-tweetsid-route) - get one tweet
- [`POST /tweets`](#post-tweets-route) - create a new tweet
- [`PATCH /tweets/:id`](#patch-tweetsid-route) - updates **part** of a tweet
- [`PUT /tweets/:id`](#put-tweetsid-route) - updates **whole** tweet
- [`PATCH /tweets/:id/reactions`](#patch-tweetsidreactions-route) - increases/decreases count for "likes" and "dislikes"
- [`DELETE /tweets/:id`](#delete-tweetsid-route) - delete a tweet

In each of these routes in `index.js`, there are different implmentations written to achieve the same result. Uncomment them accordingly and experiment with the different implementations on your own.

This `mongodb-mongoose` example is an API only server. There is no view layer. To interact with the endpoints, use [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/) or `curl`.

***NOTE**: `PATCH` updates **part** of a tweet. `PUT` updates **whole** tweet. There are differences between the two. More on this in the respective routes!*


# To chain or not to chain?

In `mongoose`, you can query for results by chaining methods or by passing `options` into the methods. To be honest, I can't say which is the more appropriate way to query for results.

I can see why chaining can be straightforward and easier to understand. But, with multiple filters (which leads to multiple chaining), it does get a little fuzzy for me to follow.

Regardless, the choice is yours. Though, if you decide to go with chaining, I would suggest you keep it consistent and chain throughout your routes instead of a mix.

# Getting Started

- Start `mongodb` on your machine (if you are using Atlas, you can skip this step but remember to point `mongoURI` in `index.js` to your own cluster)
- `npm install`
- Start web server by running `nodemon index.js`
- Seed database with a `GET` request to `localhost:3000/tweets/clear-and-seed` endpoint
- Check that the database has been seeded with a `GET` request to `localhost:3000/tweets`. You should get an array of tweets.

# `GET /tweets` route

The following are the requirements I have set for myself for this route to understand the different methods:

1. [Show all tweets](#r1---show-all-tweets)

2. [Show tweets where "likes" >= 50](#r2---show-tweets-where-likes--50)

3. [Show tweets where 40 <= "likes" <= 60](#r3---show-tweets-where-40-likes--60)

4. [Show tweets where "likes" > 20, "dislikes" <= 60 and "author" is not "Peter Parker"](#r4---show-tweets-where-likes--20-dislikes--60-and-author-is-not-peter-parker)

5. [Show tweets where "author" is either "Thor" or "Steve Rogers"](#r5---show-tweets-where-author-is-either-thor-or-steve-rogers)

6. [Show tweets where "author" are not "Hawkeye", "Dr. Banner", "Thanos" and "Black Panther"](#r6---show-tweets-where-author-are-not-hawkeye-dr-banner-thanos-and-black-panther)

7. Paginate tweets
	- [Show page 1 tweets and 10 tweets per page with only "title" and "author" fields](#r7a---paginate-tweets-show-page-1-tweets-and-10-tweets-per-page-with-only-title-and-author-fields)
	- [Show page 2 tweets and 50 tweets per page with all fields](#r7b---paginate-tweets-show-page-2-tweets-and-50-tweets-per-page-with-all-fields)

Do note that I did not use any url query parameters for this endpoint. Objective is to experiment with the different implementations and methods avaialble in `mongoose`.

You can improve this route by writing your own custom middleware that validates the url query parameters this route receives. It is entirely up to you how strict you want to implement this validation.

## R1 - Show all tweets

```js
try {
	const tweets = await Tweet.find({})
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R2 - Show tweets where "likes" >= 50

**Method 1**
```js
try {
	const tweets = await Tweet.find(
		{
			'reactions.likes': {
				$gte: 50
			}
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 2** by chaining.
```js
try {
	await Tweet
		.where('reactions.likes')
		.gte(50)
		.then(tweets => {
			res.send(tweets)
		})
		.catch(err => {
			throw err
		})
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R3 - Show tweets where 40 <="likes" <= 60

**Method 1**
```js
try {
	const tweets = await Tweet.find(
		{
			'reactions.likes': {
				$gte: 40,
				$lte: 60
			}
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 2**
```js
try {
	const tweets = await Tweet.find(
		{
			$and: [
				{
					'reactions.likes': {
						$gte: 40
					}
				},
				{ 
					'reactions.likes': {
						$lte: 60
					}
				}
			]
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 3** by chaining.
```js
try {
	await Tweet
		.where('reactions.likes')
		.gte(40)
		.lte(60)
		.then(tweets => {
			res.send(tweets)
		})
		.catch(err => {
			throw err
		})
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R4 - Show tweets where "likes" > 20, "dislikes" <= 60 and "author" is not "Peter Parker"

**Method 1**
```js
try {
	const tweets = await Tweet.find(
		{
			'reactions.likes': {
				$gt: 20
			},
			'reactions.dislikes': {
				$lte: 60
			},
			'author': {
				$ne: 'Peter Parker'
			}
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 2**
```js
try {
	const tweets = await Tweet.find(
		{
			$and: [
				{
					'reactions.likes': {
						$gt: 20
					}
				},
				{ 
					'reactions.dislikes': {
						$lte: 60
					}
				},
				{
					'author': {
						$ne: 'Peter Parker'
					}
				}
			]
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 3** by chaining.
```js
try {
	await Tweet
		.where('reactions.likes')
		.gt(20)
		.where('reactions.dislikes')
		.lte(60)
		.where('author')
		.ne('Peter Parker')
		.then(tweets => {
			res.send(tweets)
		})
		.catch(err => {
			throw err
		})
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R5 - Show tweets where "author" is either "Thor" or "Steve Rogers"

**Method 1**
```js
try {
	const tweets = await Tweet.find(
		{
			author: {
				$in: [
					'Thor',
					'Steve Rogers'
				]
			}
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 2**
```js
try {
	const tweets = await Tweet.find(
		{
			$or: [
				{
					author: 'Thor'
				},
				{
					author: 'Steve Rogers'
				}
			]	
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 3** by chaining.
```js
try {
	await Tweet
		.where('author')
		.in(['Thor', 'Steve Rogers'])
		.then(tweets => {
			res.send(tweets)
		})
		.catch(err => {
			throw err
		})
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R6 - Show tweets where "author" are not "Hawkeye", "Dr. Banner", "Thanos" and "Black Panther"

**Method 1**
```js
try {
	const tweets = await Tweet.find(
		{
			author: {
				$nin: [
					'Hawkeye',
					'Dr. Banner',
					'Thanos',
					'Black Panther'
				]
			}
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 2**
```js
try {
	const tweets = await Tweet.find(
		{
			$nor: [
				{
					author: 'Hawkeye'
				},
				{
					author: 'Dr. Banner'
				},
				{
					author: 'Thanos'
				},
				{
					author: 'Black Panther'
				}
			]	
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 3** by chaining.
```js
try {
	await Tweet
		.where('author')
		.nin([
			'Hawkeye',
			'Dr. Banner',
			'Thanos',
			'Black Panther'
		])
		.then(tweets => {
			res.send(tweets)
		})
		.catch(err => {
			throw err
		})
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R7a - Paginate tweets: Show page 1 tweets and 10 tweets per page with only "title" and "author" fields

**Method 1**
```js
try {
	const page = 1
	const resultsPerPage = 10
	const tweets = await Tweet.find(
		{},
		'-_id title author',
		{
			skip: resultsPerPage * (page - 1),
			limit: resultsPerPage
		}
	)
	res.send(tweets)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 2** by chaining.
```js
try {
	const page = 1
	const resultsPerPage = 10
	await Tweet
		.find()
		.skip(resultsPerPage * (page - 1))
		.limit(resultsPerPage)
		.select('-_id title author')
		.then(tweets => {
			console.log(tweets.length)
			res.send(tweets)
		})
		.catch(err => {
			throw err
		})
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R7b - Paginate tweets: Show page 2 tweets and 50 tweets per page with all fields

This implementation is same as R7a. You can try it out on your own! :v:

# `GET /tweets/:id` route

**Method 1** using
[findOne](https://mongoosejs.com/docs/api.html#model_Model.findOne).
```js
try {
	const tweet = await Tweet.findOne({
		_id: req.params.id
	})
	if (tweet) {
		res.send(tweet)
	} else {
		res.status(404).send('Tweet not found')
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 2** using [findById](https://mongoosejs.com/docs/api.html#model_Model.findById).
```js
try {
	const tweet = await Tweet.findById(req.params.id)
	if (tweet) {
		res.send(tweet)
	} else {
		res.status(404).send('Tweet not found')
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

# `POST /tweets` route

I did not come across any other methods besides `create` to add a document to a colelction.

`json` payload example:

```js
{
    "title" : "Test Tweet Title",
    "body": "Test Tweet Body",
    "author": "Test Tweet Author"
}
```
**Method 1** using [create](https://mongoosejs.com/docs/api.html#model_Model.create).

```js
try {
	res.send(await Tweet.create(req.body))
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

# `PATCH /tweets/:id` route

By convention, `PATCH` request updates **PART** of a document. Therefore, this route expects only to receive data required to update a Tweet.

`json` payload example:

```js
{
    "title" : "Test Tweet Title Updated"
}
```

**Method 1** using
[findOneAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate).

```js
try {
	const updatedTweet = await Tweet.findOneAndUpdate(
		{ _id: req.params.id },
		{
			title: `${req.body.title} using "findOneAndUpdate" method using HTTP PATCH`
		},
		{
			new: true
		}
	)
	if (updatedTweet) {
		res.send(updatedTweet)
	} else {
		throw new Error('Tweet you are trying to update does not exist.')
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

By default, `findOneAndUpdate` returns the document as it was **BEFORE** the update was applied.
If you set the options "new" to `true`, `findOneAndUpdate` will instead return the document **AFTER** update was applied.

If you want all updated documents returned are **AFTER** the update, you can set it globally using `mongoose.set('returnOriginal', false)` at the start of your entry file (ie `index.js` or `server.js` or whichever file that is). Do note that there are other flags you can set as well. As always, refer to the docs.

**Method 2** using
[findByIdAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate).

```js
try {
	res.send(
		await Tweet.findByIdAndUpdate(
			req.params.id,
			{
				title: `${req.body.title} using "findByIdAndUpdate" method using HTTP PATCH`
			},
			{
				new: true
			}
		)
	)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

Similar to `findOneAndUpdate`, `findByIdAndUpdate` returns the document as it was **BEFORE** the update was applied. Set options "new" to `true` to return document **AFTER** update was applied.

**Method 3** using
[updateOne](https://mongoosejs.com/docs/api.html#model_Model.updateOne).

```js
try {
	res.send(
		await Tweet.updateOne(
			{ _id: req.params.id },
			{
				title: `${req.body.title} using "updateOne" method using HTTP PATCH`
			}
		)
	)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

`updateOne` returns neither the document as it was before nor after the update was applied. It returns the following instead:
```js
{
	"n": 1,
	"nModified": 1,
	"ok": 1
}
```
where `n` is number of documents matched and `nModified` is number of documents modified.

**Which should you use?**

It all depends on the user flow you have in mind.

If you want to show the updated document after edit is successful, then i would say use `findOneAndUpdate` or `findByIdAndUpdate`.

If you want to `redirect` the user after the document has been successfully updated, you can use `updateOne` since returning the updated document does not matter.

There is no fixed rule actually. You can still return the updated document to your controller even though your controller is gonna `redirect`.

# `PUT /tweets/:id` route

By convention, `PUT` request replaces the **ENTIRE** document (or row in relational databases). Therefore, this route expects to receive data that follows the `Tweet` schema ie data you passed into `mongoose` **MUST** provide the required fields else an error will be thrown.

Try not including one of the required fields when you call this endpoint. You will get an error.

`json` payload example:

```js
{
    "title" : "This is a new Tweet Title",
    "body": "This is a new Tweet Body",
    "author": "This is a new Tweet Author"
}
```

**Method 1** using
[findOneAndReplace](https://mongoosejs.com/docs/api.html#model_Model.findOneAndReplace).

```js
try {
	res.send(
		await Tweet.findOneAndReplace(
			{ _id: req.params.id },
			req.body,
			{
				new: true
			}
		)
	)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

Similar to `findOneAndUpdate`, `findOneAndReplace` returns the document as it was **BEFORE** the update was applied. Set options "new" to `true` to return the document **AFTER** update was applied.

**Method 2** using
[replaceOne](https://mongoosejs.com/docs/api.html#query_Query-replaceOne).

```js
try {
	res.send(
		await Tweet.replaceOne(
			{ _id: req.params.id },
			req.body
		)
	)
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

Similar to `updateOne`, `replaceOne` returns neither the document as it was before nor after the update was applied. It returns the following instead:
```js
{
	"n": 1,
	"nModified": 1,
	"ok": 1
}
```
where `n` is number of documents matched and `nModified` is number of documents modified.

**Still confused with the difference between `PUT` vs `PATCH`?**

Take a look at [this](https://stackoverflow.com/questions/28459418/use-of-put-vs-patch-methods-in-rest-api-real-life-scenarios) thread on Stack Overflow.

# `PATCH /tweets/:id/reactions` route

Trying out updating nested fields.

`json` payload example to **increase** "likes":

```js
{
    "type": "likes",
    "action": "increment" // to decrease likes, use "decrement"
}

// "type" accepts either "likes" or "dislikes"
// "action" accepts either "increment" or "decrement"
// No particular rules for these. I just design the routes to accept these key-value pairs.
```

Using [findById](https://mongoosejs.com/docs/api.html#model_Model.findById).

```js
try {
	const type = req.body.type
	const action = req.body.action
	const tweet = await Tweet.findById(req.params.id)
	const typeCurrentCount = tweet.reactions[type]
	if (action === 'decrement' && typeCurrentCount < 1) {
		res.send(tweet)
	} else {
		const path = `reactions.${type}`
		const incrementValue = action === 'increment' ? 1 : -1
		const updatedTweet = await Tweet.findByIdAndUpdate(
			req.params.id,
			{
				// $inc means increment
				$inc: {
					// updating a nested document
					[path]: incrementValue
				}
			},
			{
				new: true
			}
		)
		if (updatedTweet) {
			res.send(updatedTweet)
		} else {
			throw new ReferenceError('Tweet you are trying to update does not exist')
		}
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

I was trying out to see if the "saving" of the changes can be intercepted where if the likes/dislikes count is < 0, do not "save". But I don't see any implementation like that. If you guys come across an "interception" solution, do let me know yea?

# `DELETE /tweets/:id` route

**Method 1** using
[deleteOne](https://mongoosejs.com/docs/api.html#model_Model.deleteOne).

Deletes the first document that matches conditions from the collection.

```js
try {
	const deleteResponse = await Tweet.deleteOne({
		_id: req.params.id
	})
	if (deleteResponse.deletedCount === 1) {
		res.send('Successfully deleted tweet using "deleteOne" method.')
	} else {
		throw new Error('The tweet you are trying to delete using "deleteOne" method does not exist.')
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

`_id` created by `mongodb` is an "ObjectId" class (based on the error thrown).

If `req.params.id` cannot be casted to "ObjectId", `mongodb` will not look for existence of document and throw you an error.

If `req.params.id` can be casted, attempt to delete will happen.

If document is not found, response's "deletedCount" will be 0. This is the response returned if document you are trying to delete does not exist.
```js
{
	n: 0,
	ok: 1,
	deletedCount: 0
}
```

Therefore we need to handle manually. But of course, as Zhiquan mentioned during one of his lessons, returning an error indicating that document does not exist can potentially be a security vulnerability. In this case, I decide to handle it regardless for learning purposes.

**Method 2** using
[findOneAndDelete](https://mongoosejs.com/docs/api.html#model_Model.findOneAndDelete).

Finds a matching document and remove it. Returns null if no match is found.

```js
try {
	const deleteResponse = await Tweet.findOneAndDelete({
		_id: req.params.id
	})
	if (deleteResponse) {
		res.send('Successfully deleted tweet using "findOneAndDelete" method.')
	} else {
		throw new Error('The tweet you are trying to delete using "findOneAndDelete" method does not exist.')
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 3** using
[findByIdAndDelete](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete).

`findByIdAndDelete(id)` is a shorthand for `findOneAndDelete({ _id: id })`. Returns null if no match is found.

```js
try {
	const deleteResponse = await Tweet.findByIdAndDelete(req.params.id)
	if (deleteResponse) {
		res.send('Successfully deleted tweet using "findByIdAndDelete" method.')
	} else {
		throw new Error('The tweet you are trying to delete using "findByIdAndDelete" method does not exist.'
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 4** using
[findOneAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove).

Finds a matching document and remove it. Returns null if no match is found.

```js
try {
	const deleteResponse = await Tweet.findOneAndRemove({
		_id: req.params.id
	})
	if (deleteResponse) {
		res.send('Successfully deleted tweet using "findOneAndRemove" method.')
	} else {
		throw new Error('The tweet you are trying to delete using "findOneAndRemove" method does not exist.'
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Method 5** using
[findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove).

`findByIdAndRemove(id)` is equivalent to `findOneAndRemove({ _id: id })`. Returns null if no match is found.

```js
try {
	const deleteResponse = await Tweet.findByIdAndRemove(req.params.id)
	if (deleteResponse) {
		res.send('Successfully deleted tweet using "findByIdAndRemove" method.')
	} else {
		throw new Error('The tweet you are trying to delete using "findByIdAndRemove" method does not exist.'
	}
} catch (e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

**Which should you use? `findOneAndDelete` or `findOneAndRemove`**

According to the documentation,

> `Model.findOneAndDelete()` differs slightly from `Model.findOneAndRemove()` in that `findOneAndRemove()` becomes a MongoDB `findAndModify()` command, as opposed to a `findOneAndDelete()` command. For most mongoose use cases, this distinction is purely pedantic. You should use `findOneAndDelete()` unless you have a good reason not to.

I would think the same applies for `findByIdAndDelete` vs `findByIdAndRemove`.

# Additional Readings

- [How find() Works in Mongoose](https://thecodebarbarian.com/how-find-works-in-mongoose.html)
- Read the `mongoose` docs :joy:






