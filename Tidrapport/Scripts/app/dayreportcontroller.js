angular.module('timeReport').controller('dayreportcontroller', function ($scope, $http, date) {

    $scope.starttime = moment().hours(08).minute(00);
    $scope.lunchstarttime = moment().hours(11).minute(30);
    $scope.lunchendtime = moment().hours(12).minute(00);
    $scope.endtime = moment().hours(16).minute(30);
    $scope.selectedDay = moment().format("YYYY-MM-DD");
    $scope.totaltime = "";

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.date = date;

    $scope.ismeridian = false;

    $scope.changed = function () {

        var resultPromise = $http.post("/TimeReport/Post", { model: { StartWork: $scope.starttime, StartLunch: $scope.lunchstarttime, EndLunch: $scope.lunchendtime, EndWork: $scope.endtime, Day: moment($scope.date.selectedDate).format("YYYY-MM-DD") } });
        resultPromise.success(function (data) {

        });

        calcTotalTime();
    };

    $scope.$watch('date.selectedDate', function (newValue, oldValue) {
        var resultPromise = $http.post("/TimeReport/GetForDay", { day: moment($scope.date.selectedDate).format("YYYY-MM-DD") });
        resultPromise.success(function (data) {
            data = data.Data.Report;

            $scope.starttime = moment(data.StartWork);
            $scope.lunchstarttime = moment(data.StartLunch);
            $scope.lunchendtime = moment(data.EndLunch);
            $scope.endtime = moment(data.EndWork);

        });
    });

    var calcTotalTime = function() {
        var beforeLunch = moment($scope.lunchstarttime).diff(moment($scope.starttime));
        var afterLunch = moment($scope.endtime).diff(moment($scope.lunchendtime));

        $scope.totaltime = moment.duration(beforeLunch + afterLunch).hours() + ":" + moment.duration(beforeLunch + afterLunch).minutes();
    }
    calcTotalTime();

    $scope.reset = function() {
        $scope.starttime = moment().hours(08).minute(00);
        $scope.lunchstarttime = moment().hours(11).minute(30);
        $scope.lunchendtime = moment().hours(12).minute(00);
        $scope.endtime = moment().hours(16).minute(30);
    }


    $scope.remove = function () {
        
    }


    $scope.setStartTimeNow = function() {
        $scope.starttime = moment();
        $scope.changed();
    }
    $scope.setEndTimeNow = function () {
        $scope.endtime = moment();
        $scope.changed();
    }
    $scope.setLunchStartTimeNow = function () {
        $scope.lunchstarttime = moment();
        $scope.changed();
    }
    $scope.setLunchEndTimeNow = function () {
        $scope.lunchendtime = moment();
        $scope.changed();
    }

});