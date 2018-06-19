const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./../models').User
const auth = require('./../util/auth')

router.route('/').get(async (req, res) => {
	let credentials
	try {
		credentials = auth.decodeBasicAuthorizationHeader(req)
	} catch (error) {
		res.status(400).send({
			error
		})
		return
	}

	try {
		let user = await User.unscoped().findOne({ 
			where: { 
				email: credentials.email 
			},
			attributes: ['id', 'name', 'email', 'password'],
			raw: true 
		})

		// Prüfe, ob der User vorhanden ist und ob sein Passwort übereinstimmt
		if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
			res.status(401).send('Invalid credentials.')
			return
		}

		// Passwort entfernen, damit es nicht im token landet
		user.password = undefined

		// Generiere Token
		let token = jwt.sign(user, process.env.SECRET_KEY, {
			expiresIn: '10h'
		})

		res.send({ token })
	} catch (error) {
		console.log(error)
		res.status(500).send()
	}
})

module.exports = router