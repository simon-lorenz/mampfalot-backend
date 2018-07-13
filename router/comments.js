const express = require('express')
const router = express.Router()
const Comment = require('./../models').Comment
const middleware = require('../middleware/comment')

router.param('commentId', middleware.loadComment)

router.route('/:commentId').post(middleware.userOwnsComment, (req, res, next) => {
	if (!req.body.comment) {
		res.status(400).send()
		return
	}

	res.locals.comment.comment = req.body.comment
	res.locals.comment.save()
	.then(instance => {
		res.send(instance)
	})
	.catch(err => {
		next(err)
	})
})

module.exports = router