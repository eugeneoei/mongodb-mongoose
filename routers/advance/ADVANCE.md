# Advance `mongodb-mongoose` - Establishing Relationships Between Collections

In this advance `mongodb-mongoose` tutorial, the focus is on establishing relationships between collections and how to update or clean up dependent documents caused by a change in a related document using `hook` middlewares.

For example, deleting a user should delete all posts created by this user.

# Getting Started

- Start `mongodb` on your machine (if you are using Atlas, you can skip this step but remember to point `mongoURI` in `index.js` to your own cluster)
- `npm install`
- Start web server by running `nodemon index.js`
- Seed database with a `GET` request to `localhost:3000/seeds` endpoint or you can start with a empty database and make `POST` requests accordingly to `/users`, `/tweets` and `/comments` endpoints
- Check that the database has been seeded with a `GET` request to `localhost:3000/users`, `localhost:3000/tweets` and `localhost:3000/comments`.

# Overview

In this example, we have 3 collections:

- User
- Tweet
- Comment

`User` document schema:
```js
const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		}
	},
	{
		timestamps: true
	}
)
```

`Tweet` document schema:
```js
const tweetSchema = new Schema(
	{
		title : {
			type: String,
			required: true
		},
		body:{
			type: String,
			required: true
		},
		reactions: {
			likes: {
				type: Number,
				default : 0
			},
			dislikes: {
				type: Number,
				default : 0
			}
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		comments: [{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}]
	},
	{
		timestamps: true
	}
)
```

`Comment` document schema:
```js
const commentSchema = new Schema(
	{
		body: {
			type: String,
			required: true
		},
		reactions: {
			likes: {
				type: Number,
				default : 0
			},
			dislikes: {
				type: Number,
				default : 0
			}
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: 'Tweet',
			required: true
		}
	},
	{
		timestamps: true
	}
)
```

Some important points to note:

- `User` has no references to other collections
- `Tweet` references a `User` and an array of `Comment`s
- `Comment` references a `User` and a `Tweet` 

With these above relationships established:

- When a user is deleted, we need to:

	1. Delete all tweets created by deleted user
	2. Delete all comments created by deleted user
	3. Remove ("clean up") all comments created by deleted user in **ALL** tweets

- When a tweet is deleted, we need to:
	
	1. Delete all comments that belong to this deleted tweet

- When a comment is deleted, we need to:
	
	1. Remove ("clean up") this deleted comment from tweet's comments array

- When a comment is created, we need to:
	
	1. Push this new comment into tweet's comments array

All these will be achieved through the use of `hooks`. Also, we will look at populating reference documents in the `GET /tweets` and `GET /tweets/:id` routes.

# `GET /tweets` 

The following are the requirements I have set in this route to understand populating reference documents:

1. [Show all tweets with populated user and comments with pagination for comments](#r1---show-all-tweets-with-populated-user-and-comments-with-pagination-for-comments)

2. [Show all tweets with populated user and comments with user details but view only comments by user whose email is "thanos.titan@email.com"](#r2---show-all-tweets-with-populated-user-and-comments-with-user-details-but-view-only-comments-by-user-whose-email-is-thanostitanemailcom)

3. [Show all tweets with populated user and comments with user details but view only comments by users whose emails are either "steve.rogers@email.com" or "black.panther@email.com"](#r3---show-all-tweets-with-populated-user-and-comments-with-user-details-but-view-only-comments-by-users-whose-emails-are-either-steverogersemailcom-or-blackpantheremailcom)


## R1 - Show all tweets with populated user and comments with pagination for comments
```js
try {
	const page = 1
	const resultsPerPage = 5
	const tweets = await Tweet.find(
		{}
	)
	.populate([
		{
			path: 'user',
			select: ['_id', 'email', 'firstName', 'lastName']
		},
		{
			path: 'comments',
			select: ['_id', 'body'],
			populate: {
				path: 'user',
				select: ['_id', 'email', 'firstName', 'lastName']
			},
			options: {
				skip: resultsPerPage * (page - 1),
				limit: resultsPerPage
			}
		}
	])
	res.send(tweets)
} catch(e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

`select` can be a string. So `['_id', 'body']` or `'_id body'` will work the same.

To paginate results, pass in `options` and set the values for `skip` and `limit` to paginate reference documents.

## R2 - Show all tweets with populated user and comments with user details but view only comments by user whose email is "thanos.titan@email.com"
```js
try {
	const tweets = await Tweet.find(
		{}
	)
	.populate([
		{
			path: 'user',
			select: ['_id', 'email', 'firstName', 'lastName']
		},
		{
			path: 'comments',
			select: ['_id', 'body'],
			populate: {
				path: 'user',
				match: {
					'email': {
						$eq: 'thanos.titan@email.com'
					}
				},
				select: ['_id', 'email', 'firstName', 'lastName'],
			}
		}
	])
	res.send(tweets)
} catch(e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

To filter reference documents, pass in `match` and the respective filters you want to apply accordingly. Note that, if the match fails, value returned will be `null`. It **does not** exclude the value. As a result of this, I would personally avoid filtering reference documents? Not 100% confident with this.

## R3 - Show all tweets with populated user and comments with user details but view only comments by users whose emails are either "steve.rogers@email.com" or "black.panther@email.com"
```js
try {
	const tweets = await Tweet.find(
		{}
	)
	.populate([
		{
			path: 'user',
			select: ['_id', 'email', 'firstName', 'lastName']
		},
		{
			path: 'comments',
			select: ['_id', 'body'],
			populate: {
				path: 'user',
				match: {
					email: {
						$in: [
							'steve.rogers@email.com',
							'black.panther@email.com'
						]
					}
				},
				select: '_id email firstName lastName'
			}
		}
	])
	res.send(tweets)
} catch(e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

Similarly, if the `match` fails, value returned will be `null`. It **does not** exclude the value.

# `GET /tweets/:id` route

The following are the requirements I have set in this route to understand populating reference documents:

1. [Show tweet with populated user information](#r1---show-tweet-with-populated-user-information)

2. [Show tweet with populated user and comments with user details](#r2---show-tweet-with-populated-user-and-comments-with-user-details)

## R1 - Show tweet with populated user information

```js
try {
	const tweet = await Tweet.findById(
		req.params.id
	)
	.populate({
		path: 'user',
		select: 'firstName lastName email'
	})
	res.send(tweet)
} catch(e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

## R2 - Show tweet with populated user and comments with user details

```js
try {
	const tweet = await Tweet.findById(
		req.params.id
	)
	.populate([
		{
			path: 'user',
			select: 'firstName lastName email'
		},
		{
			path: 'comments',
			select: ['body', '_id'],
			populate: {
				path: 'user',
				select: ['_id', 'email', 'firstName', 'lastName']
			}
		}
	])
	res.send(tweet)
} catch(e) {
	res.status(400).send({
		name: e.name,
		message: e.message
	})
}
```

Note that in requirement 1, the arguemnt passed into `populate` is an **object**. Whereas in requirement 2, the argument passed into `populate` is an **array of objects**. Therefore, if you are populating multiple references within a document, pass in an array of objects to `populate` with the desired key-value pairs accordingly.

# `DELETE /tweets/:id` route

For this route, whenever a tweet is deleted, we need to **also delete all comments that belong to this deleted tweet**. To do this, we use the `hook` middleware.

Deleting a tweet is pretty straightforward (if you are unsure, refer to [this](../basic/BASIC.md#delete-tweetsid-route)) so we will skip that and instead look at how the `hook` middleware is used.

In the `tweet` document schema, before the model is initialised, we declare a `post` hook for the `findOneAndDelete` method.

```js
tweetSchema.post('findOneAndDelete', async doc => {
	try {
		await mongoose.model('Comment').deleteMany(
			{
				tweet: doc._id
			}
		)
	} catch(e) {
		console.log(e)
	}
})
```

What happens here is that, whenever the `Tweet` model calls the `findOneAndDelete` method, this `post` hook will execute **after** `findOneAndDelete` is completed. This is where we will delete all documents from the `comments` collection that belongs to this deleted tweet.

`doc` refers to the deleted tweet document.

Middlewares are applicable only for some methods. Refer to the `mongoose` middleware docs [here](https://mongoosejs.com/docs/middleware.html).

According to the `mongoose` documentation [here](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete), `findByIdAndDelete()` triggers the middleware for `findOneAndDelete`. Therefore, you can use either `findByIdAndDelete` or `findOneAndDelete` to delete the tweet in your route. Both should work and trigger this hook for `findOneAndDelete`.

# `POST /comments` route

For this route, whenever a comment is created, we need to push this new comment into the tweet's comments array. To do this, we use the `hook` middleware.

In the `comment` document schema, before the model is initialised, we declare a `post` hook for the `save` method.

```js
commentSchema.post('save', async doc => {
	try {
		await mongoose.model('Tweet').updateOne(
			{
				_id: doc.tweet
			},
			{
				$push: {
					comments : doc._id
				}
			}
		)
	} catch(e) {
		console.log(e)
	}
})
```

What happens here is that, whenever the `Comment` model calls the `save` method, this `post` hook will execute **after** `save` is completed. This is where we will add the newly created comment document into the tweet's `comments` field array.

`doc` refers to the created comment document.

According to the `mongoose` documentation [here](https://mongoosejs.com/docs/api.html#model_Model.create), `create()` triggers the middleware for `save()`. Therefore, `Comment.create({...})` will trigger this hook after the comment has been saved into the database.

# `DELETE /comments/:id` route

For this route, whenever a comment is deleted, we need to remove ("clean up") this comment from the tweet's comments array. To do this, we will use the `hook` middleware.

In the `comment` document schema, before the model is initialised, we declare a `post` hook for the `findOneAndDelete` method.

```js
commentSchema.post('findOneAndDelete', async doc => {
	try {
		await mongoose.model('Tweet').updateOne(
			{
				comments: doc._id
			},
			{
				$pull: {
					comments: doc._id
				}
			}
		)
	} catch(e) {
		console.log(e)
	}
})
```

What happens here is that, whenever the `Comment` model calls the `findOneAndDelete` method, this `post` hook will execute **after** `findOneAndDelete` is completed. This is where we will remove the deleted comment from the tweet's comments array.

`doc` refers to the deleted comment document.

Similarly, you can use either `findByIdAndDelete` or `findOneAndDelete` to delete the comment in your route. Both should work.

# `DELETE /users/:id` route

For this route, whenever a user is deleted, we need to do the following 3 things:  

1. Delete all tweets created by deleted user
2. Delete all comments created by deleted user
3. Remove ("clean up") all comments created by deleted user in **ALL** tweets

To achieve the above 3, we will use the `hook` middleware.

In the `user` document schema, before the model is initialised, we declare a `post` hook for the `findOneAndDelete` method.

```js
userSchema.post('findOneAndDelete', async doc => {
	try {
		const commentsBelongingToDeletedUser = await mongoose.model('Comment').find({
			user: doc._id
		})
		await mongoose.model('Tweet').deleteMany(
			{
				user: doc._id
			}
		)
		await mongoose.model('Comment').deleteMany(
			{
				user: doc._id
			}
		)
		await mongoose.model('Tweet').updateMany(
			{},
			{
				$pull: {
					comments: {
						$in: commentsBelongingToDeletedUser.map(deletedComment => deletedComment._id)
					}
				}
			}
		)
	} catch(e) {
		console.log(e)
	}
})
```

What happens here is that, whenever the `User` model calls the `findOneAndDelete` method, this `post` hook will execute **after** `findOneAndDelete` is completed. This is where we will execute the 3 abovementioned tasks when a user is deleted.

`doc` refers to the deleted user document.

Similarly, you can use either `findByIdAndDelete` or `findOneAndDelete` to delete the user in your route. Both should work.

# Is it necessary to establish relationships between collections?

Well, there are definitely benefits in establishing relationships between collections. Especially so when you plan to store information of one document in another document. Establishing a relationship will make your life a lot easier in the long run. Though, you need to go through the short-term pain of understanding the process and dependencies between the collections.

Nonetheless, if there are multiple relationships, the process of removing dependent documents can get out of hand. There will be more cleaning up and updates required in the respective `hook`s for each individual schema.

Maybe that is why relational databases might be more suitable?

# Todos

### 1. `POST /users`

When a user is created, declare a `pre` hook for `save` method to check for existence of email address since email field in `User` document schema is a unique field. `mongoose` throws an error like the following which is not easily consumed by client side.

```js
{
    "name": "MongoError",
    "message": "E11000 duplicate key error collection: mongodb-mongoose.users index: email_1 dup key: { email: \"tony.stark@email.com\" }"
}
```
If email already exists, `throw new Error('Email has already been taken.')`

# Additional Readings

- [Mongoose Middleware](https://mongoosejs.com/docs/middleware.html)
