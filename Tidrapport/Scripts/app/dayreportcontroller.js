angular.module('timeReport').controller('dayreportcontroller', function ($scope, $http, date, _) {

    var id = 0;
    $scope.totaltime = "";
    $scope.flex = "";
    $scope.hasNegativeFlex = false;

    var defaultWorkHours = 8;

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.date = date;
    var selectedMonth;
    var monthReports;

    var settings = {
        starttime: moment(),
        lunchstarttime: moment(),
        lunchendtime: moment(),
        endtime: moment(),
    };

    $scope.ismeridian = false;

    var getUserSettings = function () {
        var resultPromise = $http.post("/Account/GetSettings");
        resultPromise.success(function (data) {
            var data = data.Data.User;
            if (data.DefaultStartWork) {
                settings.starttime = moment(data.DefaultStartWork);
                settings.lunchstarttime = moment(data.DefaultStartLunch);
                settings.lunchendtime = moment(data.DefaultEndLunch);
                settings.endtime = moment(data.DefaultEndWork);
            } else {
                settings.starttime = moment().hours(08).minute(00);
                settings.lunchstarttime = moment().hours(11).minute(30);
                settings.lunchendtime = moment().hours(12).minute(00);
                settings.endtime = moment().hours(16).minute(30);
            }
        });
    };
    getUserSettings();

    $scope.changed = function () {

        var resultPromise = $http.post("/TimeReport/Post", { model: { StartWork: $scope.starttime, StartLunch: $scope.lunchstarttime, EndLunch: $scope.lunchendtime, EndWork: $scope.endtime, Day: moment($scope.date.selectedDate).format("YYYY-MM-DD") } });
        resultPromise.success(function (result) {
            var selectedDay = _.find(monthReports, function (day) {
                return moment(day.Day).format("YYYY-MM-DD") == moment($scope.date.selectedDate).format("YYYY-MM-DD");
            });
            result = result.Data.DayReport;
            if (selectedDay) {
                selectedDay.StartWork = result.StartWork;
                selectedDay.StartLunch = result.StartLunch;
                selectedDay.EndLunch = result.EndLunch;
                selectedDay.EndWork = result.EndWork;
            } else {
                monthReports.push(result);
            }


        });
    };

    $scope.$watch('date.selectedDate', function (newValue, oldValue) {

        if (selectedMonth != moment($scope.date.selectedDate).month()) {
            selectedMonth = moment($scope.date.selectedDate).month();

            var resultPromise = $http.post("/TimeReport/GetDayReports", { startDate: moment($scope.date.selectedDate).startOf("month"), endDate: moment($scope.date.selectedDate).endOf("month") });
            resultPromise.success(function (data) {
                data = data.Data.Reports;
                if (data) {
                    monthReports = data;
                    var day = _.find(monthReports, function(day) {
                        return moment(day.Day).format("YYYY-MM-DD") == moment($scope.date.selectedDate).format("YYYY-MM-DD");
                    });
                    if (day) {
                        $scope.starttime = moment(day.StartWork);
                        $scope.lunchstarttime = moment(day.StartLunch);
                        $scope.lunchendtime = moment(day.EndLunch);
                        $scope.endtime = moment(day.EndWork);
                        id = day.Id;
                    } else {
                        setDefault();
                    }

                } else {
                    setDefault();
                }
            });
        } else {
            var day = _.find(monthReports, function (day) {
                return moment(day.Day).format("YYYY-MM-DD") == moment($scope.date.selectedDate).format("YYYY-MM-DD");
            });
            if (day) {
                $scope.starttime = moment(day.StartWork);
                $scope.lunchstarttime = moment(day.StartLunch);
                $scope.lunchendtime = moment(day.EndLunch);
                $scope.endtime = moment(day.EndWork);
                id = day.Id;
            } else {
                setDefault();
            }


        }
    });

    var setDefault = function () {
        $scope.starttime = settings.starttime;
        $scope.lunchstarttime = settings.lunchstarttime;
        $scope.lunchendtime = settings.lunchendtime;
        $scope.endtime = settings.endtime;
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

    $scope.$watchGroup(['starttime', 'lunchstarttime', 'lunchendtime', 'endtime'], function (newValues, oldValues, scope) {
        calcTotalTime();
    });

    $scope.reset = function() {
        setDefault();
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