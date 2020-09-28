const ParkingDetails = require('../models/ParkingDetails');
const ParkingSlots = require('../models/ParkingSlots');
const Sequelize = require('sequelize');
const authService = require('../services/auth.service');

const ParkingManagerController = () => {

  const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Bad Request: Username or password is wrong' });
    }
    try {
      if (username === process.env.PARKING_MANAGER_USERNAME && password === process.env.PARKING_MANAGER_PASSWORD) {
        const token = authService().issue({username});
        res.cookie('token', token, {httpOnly: true});
        return res.status(200).json({token, username});
      }

      return res.status(401).json({msg: 'Unauthorized'});
    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: 'Internal server error'});
    }
  };

  const createParking = async (req, res) => {
    const { lotsize } = req.body;
    if (!lotsize) {
      return res.status(400).json({ msg: 'Bad Request: lot size is not provided' });
    }
    try {
      const slotList = [];
      for (let i = 1; i <= lotsize; i++) {
        slotList.push({
          slotNumber: i,
          occupied: false,
        });
      }
      await ParkingSlots.bulkCreate(slotList, { validate: false });
      const slots = await ParkingSlots.findAll({ attributes: ['id', 'slotNumber'] });

      return res.status(200).json({ success: true, slots });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getParkingStatus = async (req, res) => {
    try {
      const slots = await ParkingSlots.findAll({ attributes: ['id', 'slotNumber', 'occupied', 'underMaintenance'] });
      return res.status(200).json({ success: true, slots });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getParkingDetails = async (req, res) => {
    try {
      const details = await ParkingDetails.findAll( { attributes:['vehNumber', 'inTime', 'outTime', 'totalTime', 'fees', 'inDate', 'parkingSlotId']} );
      return res.status(200).json({success: true, details});
    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: 'Internal server error'});
    }
  };

  const setParkingSlotMaintenanceStatus = async (req, res) => {
    const {slotidlist, status} = req.body;
    if (!slotidlist || !status) {
      return res.status(400).json({msg: 'Bad Request: slotIdList or status not provided'});
    }
    try {
      const slotIdArray = JSON.parse(slotidlist);
      await ParkingSlots.update({underMaintenance: status}, {where: {id: slotIdArray, occupied: false}});
      return res.status(200).json({success: true});
    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: 'Internal server error'});
    }
  };

  const getParkingDailyStats = async (req, res) => {
    try {
      const stats = await ParkingDetails.findAll({
        attributes: [
          ['inDate', 'date'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_vehicle'],
          [Sequelize.fn('SUM', Sequelize.col('totalTime')), 'total_time'],
          [Sequelize.fn('SUM', Sequelize.col('fees')), 'total_fees']
        ],
        group: ['inDate'],
      });
      return res.status(200).json({ success: true, stats });
    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: 'Internal server error'});
    }
  };

  return {
    login,
    createParking,
    getParkingStatus,
    getParkingDetails,
    setParkingSlotMaintenanceStatus,
    getParkingDailyStats,
  };
};

module.exports = ParkingManagerController;
