angular.module('timeReport').controller('manageusersettings', function ($scope, $http) {
  
    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.ismeridian = false;

    

    $scope.changed = function () {

        var resultPromise = $http.post("/Account/UpdateSettings", { model: { DefaultStartWork: $scope.starttime, DefaultStartLunch: $scope.lunchstarttime, DefaultEndLunch: $scope.lunchendtime, DefaultEndWork: $scope.endtime, VacationDays: $scope.vacationdays } });
        resultPromise.success(function (data) {
        });

    };

    var getUserSettings = function() {

        var resultPromise = $http.post("/Account/GetSettings");
        resultPromise.success(function(data) {

            var data = data.Data.User;
            if (data.DefaultStartWork) {
                $scope.starttime = moment(data.DefaultStartWork);
                $scope.lunchstarttime = moment(data.DefaultStartLunch);
                $scope.lunchendtime = moment(data.DefaultEndLunch);
                $scope.endtime = moment(data.DefaultEndWork);
            } else {
                $scope.starttime = moment().hours(08).minute(00);
                $scope.lunchstarttime = moment().hours(11).minute(30);
                $scope.lunchendtime = moment().hours(12).minute(00);
                $scope.endtime = moment().hours(16).minute(30);
            }
            $scope.vacationdays = data.VacationDays ? data.VacationDays : 0;
        });
    };



    getUserSettings();

});