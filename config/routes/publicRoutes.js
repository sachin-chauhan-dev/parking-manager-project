const publicRoutes = {
  'POST /admin/login': 'ParkingManagerController.login',
  'POST /park': 'VehicleController.park',
  'POST /unpark': 'VehicleController.unPark',
};

module.exports = publicRoutes;
