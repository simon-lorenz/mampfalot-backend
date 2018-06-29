module.exports = (sequelize, DataTypes) => {
	const Vote = sequelize.define('Vote', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		points: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'votes',
		timestamps: false,
		name: {
			singular: 'vote',
			plural: 'votes'
		}
	})

	Vote.associate = function(models) {
		models.Vote.belongsTo(models.Place)
	}

	return Vote
}