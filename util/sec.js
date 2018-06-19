let Util = require('./util')
let Lunchbreak = require('./../models').Lunchbreak

let sec = {}

sec.userIsGroupMember = function (req, res, next) {
	let user = res.locals.user
	let groupId = parseInt(req.params.groupId)

	if (Util.getGroupIds(user, false).includes(groupId)) {
		next()
	} else {
		res.status(403).send()
	}
}

sec.userIsGroupAdmin = function (req, res, next) {
	let user = res.locals.user
	let groupId = parseInt(req.params.groupId)

	if (Util.getGroupIds(user, true).includes(groupId)) {
		next()
	} else {
		res.status(403).send()
	}
}

sec.userHasAccessToLunchbreak = function (req, res, next) {
	Lunchbreak.findOne({
		attributes: ['groupId'],
		where: {
			id: req.params.lunchbreakId
		},
		raw: true
	})
	.then(lunchbreak => {
		if (!lunchbreak) {
			res.status(404).send()
			return
		}

		if (Util.getGroupIds(res.locals.user, false).includes(lunchbreak.groupId)) {
			next()
		} else {
			res.status(403).send()			
			return
		}
	})
}

module.exports = sec