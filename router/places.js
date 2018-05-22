const express = require('express')
const router = express.Router()
const Place = require('./../models/place')
const FoodType = require('./../models/foodType')
const util = require('./../util/util')

router.route('/').get(util.loadUserGroupMemberships, (req, res) => {
	Place.findAll({
			where: {
				groupId: util.getGroupMembershipIds(req.user)
			},
			order: [
				['id', 'ASC']
			],
			include: [{
				model: FoodType,
				as: 'foodType',
				attributes: {
					exclude: ['groupId']
				}
			}]
		})
		.then(result => {
			res.send(result)
		})
		.catch(error => {
			console.log('GET /places: ' + error)
			res.status(500).send()
		})
})

router.route('/').post(util.loadUserGroupMemberships, (req, res) => {
	let place = {
		name: req.body.name,
		foodTypeId: req.body.foodTypeId,
		groupId: req.body.groupId ? parseInt(req.body.groupId) : undefined
	}

	let missingValues = util.missingValues(place)
	if (missingValues.length > 0) {
		res.status(400).send({
			missingValues
		})
		return
	}

	// Ist der User Mitglied der angegebenen Gruppe und hat er Adminrechte auf die Gruppe?
	if (util.getGroupMembershipIds(req.user, true).indexOf(place.groupId) === -1) {
		res.status(401).send()
		return
	}

	Place.create(place)
		.then(result => {
			res.status(204).send()
		})
		.catch(error => {
			console.log(error)
			res.status(500).send('Something went wrong.')
		})
})

router.route('/:placeId').get((req, res) => {
	Place.findOne({
			where: {
				id: req.params.placeId
			}
		})
		.then(result => {
			if (!result) {
				res.status(404).send()
			} else {
				if (util.getGroupMembershipIds(req.user).indexOf(result.groupId) === -1) {
					res.status(401).send()
				} else {
				res.send(result)
			}
			}
		})
		.catch(error => {
			console.log(error)
			res.status(500).send('Something went wrong.')
		})
})

router.route('/:placeId').put(util.loadUserGroupMemberships, (req, res) => {
	let placeId = req.params.placeId

	let updateData = {}
	if (req.body.name) {
		updateData.name = req.body.name.trim()
	}
	if (req.body.foodTypeId) {
		updateData.foodTypeId = req.body.foodTypeId
	}

	if (Object.keys(updateData).length === 0) {
		res.status(400).send({
			error: 'Request needs to have at least one of the following parameters: name or foodTypeId'
		})
		return
	}

	Place.update(updateData, {
			where: {
				id: placeId,
				groupId: util.getGroupMembershipIds(req.user, true)
			}
		})
		.then(result => {
			res.status(204).send()
		})
		.catch(err => {
			res.status(500).send(err)
		})
})

router.route('/:placeId').delete(util.loadUserGroupMemberships, (req, res) => {
	Place.destroy({
			where: {
				id: req.params.placeId,
				groupId: util.getGroupMembershipIds(req.user, true)
			}
		})
		.then(result => {
			if (result == 0) {
				res.status(404).send()
			} else {
				res.status(204).send()
			}
		})
		.catch(error => {
			console.log(error)
			res.status(500).send('Something went wrong.')
		})
})

module.exports = router