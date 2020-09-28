const ParkingSlots = require('../models/ParkingSlots');
const ParkingDetails = require('../models/ParkingDetails');

const VehicleController = () => {
  const park = async (req, res) => {
    const { vehnumber } = req.body;
    let availableSlotId = null;

    if (!vehnumber) {
      return res.status(400).json({msg: 'Bad Request: vehicle number not provided'});
    }
    try {
      const vehParkingDetails = await ParkingDetails.findAll({
        where: { vehNumber: vehnumber, outTime: null },
      });

      if (vehParkingDetails.length) {
        return res.status(400).json({ msg: `This ${vehnumber} vehicle is already parked` });
      }

      availableSlotId = await ParkingSlots.min('id', {
        where: {occupied: false, underMaintenance: false},
      });

      console.log('Available Slot id', availableSlotId);

      if (!availableSlotId) {
        return res.status(200).json({ msg: 'No slot available' });
      }

      await ParkingSlots.update({occupied: true,}, {where: {id: availableSlotId}});

      const inserted = await ParkingDetails.create({
        vehNumber: vehnumber,
        parkingSlotId: availableSlotId,
        inTime: Date.now(),
        inDate: Date.now(),
      });

      console.log('inserted ', inserted);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('error ', err);
      if (availableSlotId) {
        ParkingSlots.update({occupied: false,}, {where: {id: availableSlotId}})
      }
      return res.status(500).json({msg: 'Internal server error'});
    }
  };

  const unPark = async (req, res) => {
    const {vehnumber} = req.body;

    if (!vehnumber) {
      return res.status(400).json({msg: 'Bad Request: vehicle number not provided'});
    }
    try {
      const vehParkingDetails = await ParkingDetails.findAll({
        where: {vehNumber: vehnumber, outTime: null},
      });

      if (!vehParkingDetails.length) {
        return res.status(200).json({msg: `No such vehicle available having number ${vehnumber}`});
      }

      const details = vehParkingDetails[0];
      const outTime = Date.now();
      const totalTime = outTime - details.inTime;
      const totalTimeInHrs = totalTime / (60 * 60 * 1000);
      const totalFees = 10 * Math.ceil(totalTimeInHrs);

      await ParkingDetails.update({
        outTime,
        totalTime: totalTimeInHrs,
        fees: totalFees,
      }, { where: { id: details.id } });

      await ParkingSlots.update({ occupied: false }, { where: { id: details.parkingSlotId } });

      return res.status(200).json({ success: true, totalTimeInHrs, totalFees });
    } catch (err) {
      console.error('error ', err);
      return res.status(500).json({msg: 'Internal server error'});
    }
  };

  return {
    park,
    unPark,
  };
};

module.exports = VehicleController;
