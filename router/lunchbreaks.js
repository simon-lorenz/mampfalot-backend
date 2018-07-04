const express = require('express')
const router = express.Router()
const Lunchbreak = require('./../models').Lunchbreak
const Comment = require('./../models').Comment
const Participant = require('./../models').Participant
const Vote = require('./../models').Vote
const Place = require('./../models').Place
const User = require('./../models').User
const middleware = require('./../middleware/lunchbreaks')

router.param('lunchbreakId', middleware.loadLunchbreak)

router.route('/:lunchbreakId').get((req, res, next) => {
	res.send(res.locals.lunchbreak)
})

router.route('/:lunchbreakId/comments').get((req, res, next) => {
	res.send(res.locals.lunchbreak.comments)
})

router.route('/:lunchbreakId/participants').get((req, res, next) => {
	res.send(res.locals.lunchbreak.participants)
})

router.param('participantId', middleware.loadParticipant)

router.route('/:lunchbreakId/participants/:participantId').get((req, res, next) => {
	res.send(res.locals.participant)
})

router.route('/:lunchbreakId/participants/:participantId/votes').get((req, res, next) => {
	res.send(res.locals.participant.votes)
})

router.route('/:lunchbreakId/participants/:participantId/votes').post(middleware.checkVotes, async function (req, res, next) {
	let votes = req.body.votes
	
	try {
		// 1. Delete all votes of this participant
		await Vote.destroy({
			where: {
				participantId: req.params.participantId
			}
		})

		// 2. Add the participantId to all votes
		for (let vote of votes) {
			vote.participantId = req.params.participantId
		}

		// 3. Create all votes
		await Vote.bulkCreate(votes)
		
		res.status(204).send()

	} catch (error) {
		next(error)
	}
})


module.exports = router