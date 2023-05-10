const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    sequelize.define("Temperamento", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}