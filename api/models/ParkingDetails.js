const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const ParkingSlots = require('./ParkingSlots');

const tableName = 'parking_details';

const ParkingDetails = sequelize.define('ParkingDetails', {
  vehNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  inTime: {
    type: Sequelize.INTEGER,
    defaultValue: Date.now(),
    allowNull: false,
  },
  outTime: {
    type: Sequelize.INTEGER,
    defaultValue: null,
    allowNull: true,
  },
  totalTime: {
    type: Sequelize.DECIMAL(4),
    defaultValue: 0,
    allowNull: false,
  },
  inDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  parkingSlotId: {
    type: Sequelize.INTEGER,
  },
  fees: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
}, { tableName });

// eslint-disable-next-line
ParkingDetails.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

ParkingSlots.hasMany(ParkingDetails, {foreignKey: 'parkingSlotId', sourceKey: 'id' });
ParkingDetails.belongsTo(ParkingSlots, { foreignKey: 'parkingSlotId', targetKey: 'id' });
module.exports = ParkingDetails;
