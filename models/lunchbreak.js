module.exports = (sequelize, DataTypes) => {	
	const Lunchbreak = sequelize.define('Lunchbreak', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		groupId: {
			type: DataTypes.INTEGER
		},
		result: {
			type: DataTypes.INTEGER
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		lunchTime: {
			type: DataTypes.TIME,
			allowNull: false
		},
		voteEndingTime: {
			type: DataTypes.TIME,
			allowNull: false
		}
	}, {
		tableName: 'lunchbreaks',
		timestamps: false
	})

	Lunchbreak.associate = function (models) {
		models.Lunchbreak.belongsTo(models.Group)
		models.Lunchbreak.hasMany(models.Comment)
		models.Lunchbreak.hasMany(models.Participant)
		models.Lunchbreak.hasOne(models.Place)
		models.Lunchbreak.belongsToMany(models.Vote, {
			through: models.Participant,
			as: 'votes',
			otherKey: 'id' // vote-id
		})
	}

	return Lunchbreak
}