# Objectives

The objectives of the examples in this repository is not to dictate how you should query from `mongodb` through `mongoose` and give a blanket statement which is right or wrong. Rather, I intend to demonstrate the different implmentations and approach you can take to achieve the same result. I've not built an app with `mongodb` and with `mongoose` as the driver. So, I'm definitely not in the position to say if method A is better than method B/C/D.. and so on.

Ultimately, it depends what features are required and from there, you write your APIs accordingly to support these features requirements.

Also, the examples here are based on my own understanding from experimenting and referencing the [mongoose](https://mongoosejs.com/docs/guide.html) docs. I may be wrong with the implementations. So let me know if you spot any mistakes and I will correct them accordingly.

This `mongodb-mongoose` example is an API only server. There is no view layer. To interact with the endpoints, use [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/) or `curl`.

# Two Parts

This repository has been structured into 2 parts - **basic** and **advance**. Files for each individual part are placed in their respective `basic` and `advance` folders within `models`, `routers` and `seed` folders.

**Basic**

For basic, it's a simple CRUD API to demonstrate the different implementations and approaches to querying `mongodb` through `mongoose`. Mainly, `GET`, `POST`, `PUT`, `PATCH` and `DELETE` routes.

Refer to this [document](/routers/basic/BASIC.md) for a detailed run through of this part.

**Advance**

For advance, to understand the process of establishing relationships between colections in `mongodb` and the use of `mongoose`'s `hook` middlewares to update or clean up dependent documents caused by a change in another document (deleting a user should delete all posts created by this user).

Refer to this [document](/routers/advance/ADVANCE.md) for a detailed run through of this part.
