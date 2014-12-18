angular.module('timeReport').controller('dayreportcontroller', function ($scope, $rootScope, $http, date, _, reports) {

    var id = 0;
    $scope.hasNegativeFlex = false;

    var defaultWorkHours = 8;

    $scope.hstep = $scope.isVacation ? 0 : 1;
    $scope.mstep = $scope.isVacation ? 0 : 1;

    $scope.date = date;

    var selectedMonth;

    var settings = {
        starttime: moment(),
        lunchstarttime: moment(),
        lunchendtime: moment(),
        endtime: moment(),
    };



    $scope.ismeridian = false;

    var getUserSettings = function () {
        var resultPromise = $http.post("/Account/GetSettings");
        resultPromise.success(function (result) {
            var result = result.Data.User;

            settings.starttime = result.DefaultStartWork ? moment(result.DefaultStartWork) : moment().hours(08).minute(00);
            settings.lunchstarttime = result.DefaultStartLunch ? moment(result.DefaultStartLunch) : moment().hours(11).minute(30);
            settings.lunchendtime = result.DefaultEndLunch ? moment(result.DefaultEndLunch) : moment().hours(12).minute(00);
            settings.endtime = result.DefaultEndWork ? moment(result.DefaultEndWork) : moment().hours(16).minute(30);
        });
    };



    $scope.changed = function () {

        var resultPromise = $http.post("/TimeReport/Post", { model: { StartWork: $scope.starttime, StartLunch: $scope.lunchstarttime, EndLunch: $scope.lunchendtime, EndWork: $scope.endtime, Day: moment($scope.date.selectedDate).format("YYYY-MM-DD"), IsVacation: $scope.isVacation } });
        resultPromise.success(function (result) {
            var selectedDay = _.find(reports.monthReports, function (day) {
                return moment(day.Day).format("YYYY-MM-DD") == moment($scope.date.selectedDate).format("YYYY-MM-DD");
            });
            result = result.Data.DayReport;
            if (selectedDay) {
                selectedDay.StartWork = result.StartWork;
                selectedDay.StartLunch = result.StartLunch;
                selectedDay.EndLunch = result.EndLunch;
                selectedDay.EndWork = result.EndWork;
                selectedDay.IsVacation = result.IsVacation;
            } else {
                reports.monthReports.push(result);
            }
            $rootScope.$broadcast('getFlex');
        });
    };


    $scope.$watch('date.selectedDate', function () {
        selectedDayChange();
        $scope.displayDate = moment(date.selectedDate).format("dddd, MMMM Do YYYY");
    });

    var selectedDayChange = function() {

        if (selectedMonth != moment($scope.date.selectedDate).month()) {
            selectedMonth = moment($scope.date.selectedDate).month();

            var resultPromise = $http.post("/TimeReport/GetDayReports", { startDate: moment($scope.date.selectedDate).startOf("month"), endDate: moment($scope.date.selectedDate).endOf("month") });
            resultPromise.success(function (data) {
                data = data.Data.Reports;
                if (data) {
                    reports.monthReports = data;
                    var day = _.find(reports.monthReports, function (day) {
                        return moment(day.Day).format("YYYY-MM-DD") == moment($scope.date.selectedDate).format("YYYY-MM-DD");
                    });

                    if (day) {
                        $scope.starttime = moment(day.StartWork);
                        $scope.lunchstarttime = moment(day.StartLunch);
                        $scope.lunchendtime = moment(day.EndLunch);
                        $scope.endtime = moment(day.EndWork);
                        $scope.isVacation = day.IsVacation;
                        id = day.Id;
                    } else {
                        setDefault();
                    }

                } else {
                    setDefault();
                }
                reRenderDatePicker();
            });
        } else {
            var day = _.find(reports.monthReports, function (day) {
                return moment(day.Day).format("YYYY-MM-DD") == moment($scope.date.selectedDate).format("YYYY-MM-DD");
            });
            if (day) {
                $scope.starttime = moment(day.StartWork);
                $scope.lunchstarttime = moment(day.StartLunch);
                $scope.lunchendtime = moment(day.EndLunch);
                $scope.endtime = moment(day.EndWork);
                $scope.isVacation = day.IsVacation;
                id = day.Id;
            } else {
                setDefault();
            }
        }
    }

    var setDefault = function () {
        $scope.starttime = settings.starttime;
        $scope.lunchstarttime = settings.lunchstarttime;
        $scope.lunchendtime = settings.lunchendtime;
        $scope.endtime = settings.endtime;
        $scope.isVacation = false;
    }

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

    $scope.$watchGroup(['starttime', 'lunchstarttime', 'lunchendtime', 'endtime'], function () {
        calcTotalTime();
    });

    $scope.reset = function() {
        setDefault();
    }

    var reRenderDatePicker = function () {
        $('.datepicker').datepicker('remove');
        $('.datepicker').datepicker({
            weekStart: 1,
            daysOfWeekDisabled: '0,6',
            todayHighlight: true,
            beforeShowDay: function (date) {

                var hasReport = _.find(reports.monthReports, function (report) {
                    return moment(report.Day).format("YYYY-MM-DD") == moment(date).format("YYYY-MM-DD");
                });

                return {
                    enabled: true,
                    classes: hasReport ? (hasReport.IsVacation ? "vacation" : "reported") : "",
                }

            }

        }).on('changeDate', function (e) {
            $scope.$apply(function () {
                $scope.date.selectedDate = moment(e.date);
            });
        });
    }

    $scope.remove = function () {

        //var resultPromise = $http.post("/TimeReport/Delete", { id: id });
        //resultPromise.success(function (result) {

        //});
    }
    $scope.vacation = function () {
        $scope.isVacation = !$scope.isVacation;
        if (!$scope.isVacation) {
            setDefault();
        }
        $scope.changed();
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

    $(document).ready(function () {
        getUserSettings();
        setDefault();
        $rootScope.$broadcast('getFlex');
        reRenderDatePicker();
    });

});