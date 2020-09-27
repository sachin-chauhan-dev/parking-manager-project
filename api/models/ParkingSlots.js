const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'parking_slots';

const ParkingSlots = sequelize.define('ParkingSlots', {
  slotNumber: {
    type: Sequelize.INTEGER,
  },
  occupied: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  underMaintenance: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
}, { tableName });

// eslint-disable-next-line
ParkingSlots.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

module.exports = ParkingSlots;
