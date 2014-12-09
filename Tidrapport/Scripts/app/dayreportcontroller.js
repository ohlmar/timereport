angular.module('timeReport').controller('dayreportcontroller', function ($scope, $log) {

    $scope.starttime = moment().hours(08).minute(00);
    $scope.lunchstarttime = moment().hours(11).minute(30);
    $scope.lunchendtime = moment().hours(12).minute(00);
    $scope.endtime = moment().hours(16).minute(30);
    $scope.totaltime = "";

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.ismeridian = false;

    $scope.changed = function () {
        calcTotalTime();
    };

    var calcTotalTime = function() {
        var beforeLunch = moment($scope.lunchstarttime).diff(moment($scope.starttime));
        var afterLunch = moment($scope.endtime).diff(moment($scope.lunchendtime));

        $scope.totaltime = moment.duration(beforeLunch + afterLunch).hours() + ":" + moment.duration(beforeLunch + afterLunch).minutes();
    }
    calcTotalTime();

});