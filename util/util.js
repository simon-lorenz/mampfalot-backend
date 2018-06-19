const GroupMembers = require('./../models').GroupMembers
const User = require('./../models').User

let Util = {}

Util.isAdmin = function (req, res, next) {
	if (res.locals.user.isAdmin) {
		next()
	} else {
		res.status(403).send({
			success: false,
			error: 'admin-privileges required'
		})
	}
}

Util.loadUserGroups = function (req, res, next) {		
	res.locals.user.groups = []

	GroupMembers.findAll({
		attributes: {
			exclude: ['userId']
		},
		where: {
			userId: res.locals.user.id
		},
		raw: true
	})
	.then(result => {
		for (group of result) {
			res.locals.user.groups.push(group)
		}
		next()
	})
}

Util.addKeyIfExists = function (from, to, key) {
	if (key in from) {
		to[key] = from[key]
	}
}

Util.missingValues = function (obj) {
	let undefinedKeys = []
	for (key in obj) {
		if (!obj[key]) {
			undefinedKeys.push(key)
		}
	}
	return undefinedKeys
}

Util.findDuplicates = function (arr) {
	let duplicates = []
	let sorted = arr.slice().sort()
	for (let i = 0; i < sorted.length; i++) {
		if (sorted[i] == sorted[i + 1]) {
			duplicates.push(sorted[i])
		}
	}
	return duplicates
}

Util.getGroupIds = function (user, adminOnly = false) {
	let groupIds = []
	for (group of user.groups) {
		if (adminOnly) {
			if (group.authorizationLevel === 1) {
				groupIds.push(group.groupId)
			}
		} else {
			groupIds.push(group.groupId)
		}
	}
	return groupIds
}

Util.pointsInRange = function(votes, min, max) {
	for (vote of votes) {
		if (!(vote.points >= min && vote.points <= max)) {
			return false
		}
	}

	return true
}

Util.getPointSum = function (votes) {
	let sum = 0
	for (vote of votes) {
		sum += vote.points
	}
	return sum
}

module.exports = Util