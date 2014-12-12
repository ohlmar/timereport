angular.module('timeReport').controller('dayreportcontroller', function ($scope, $http, date) {

    $scope.starttime = 0;
    $scope.lunchstarttime = 0;
    $scope.lunchendtime = 0;
    $scope.endtime = 0;
    var id = 0;
    $scope.totaltime = "";
    $scope.flex = "";
    $scope.hasNegativeFlex = false;

    var defaultWorkHours = 8;

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
            if (data) {
                $scope.starttime = moment(data.StartWork);
                $scope.lunchstarttime = moment(data.StartLunch);
                $scope.lunchendtime = moment(data.EndLunch);
                $scope.endtime = moment(data.EndWork);
                id = data.Id;
            } else {
                setDefault();
            }
        });
    });

    var setDefault = function () {
        $scope.starttime = moment().hours(08).minute(00);
        $scope.lunchstarttime = moment().hours(11).minute(30);
        $scope.lunchendtime = moment().hours(12).minute(00);
        $scope.endtime = moment().hours(16).minute(30);
    }
    setDefault();

    var calcTotalTime = function() {
        var beforeLunch = moment($scope.lunchstarttime).diff(moment($scope.starttime));
        var afterLunch = moment($scope.endtime).diff(moment($scope.lunchendtime));

        var hours = moment.duration(beforeLunch + afterLunch).hours();
        var minutes = moment.duration(beforeLunch + afterLunch).minutes();

        var flexhours = hours >= defaultWorkHours ? hours - defaultWorkHours : hours - defaultWorkHours + 1;
        var flexminutes = hours >= defaultWorkHours ? minutes : 60 - minutes;

        $scope.totaltime = hours + "h " + minutes + "m";
        $scope.flex = flexhours + "h " + flexminutes + "m";
        $scope.hasNegativeFlex = hours >= defaultWorkHours ? false : true;

    }
    calcTotalTime();

    $scope.reset = function() {
        $scope.starttime = moment().hours(08).minute(00);
        $scope.lunchstarttime = moment().hours(11).minute(30);
        $scope.lunchendtime = moment().hours(12).minute(00);
        $scope.endtime = moment().hours(16).minute(30);
    }


    $scope.remove = function () {

        //Are you sure??

        var resultPromise = $http.post("/TimeReport/Delete", { id: id });
        resultPromise.success(function (data) {

        });
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