const privateRoutes = {
  'GET /parkingdetails': 'ParkingManagerController.getParkingDetails',
  'GET /parkingstatus': 'ParkingManagerController.getParkingStatus',
  'GET /parkingstats': 'ParkingManagerController.getParkingDailyStats',
  'POST /createparking': 'ParkingManagerController.createParking',
  'POST /maintainancestatus': 'ParkingManagerController.setParkingSlotMaintenanceStatus',
};

module.exports = privateRoutes;
