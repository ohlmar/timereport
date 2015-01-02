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
                selectedDay.StartWork = result.StartWork ? result.StartWork : moment();
                selectedDay.StartLunch = result.StartLunch ? result.StartLunch : moment();
                selectedDay.EndLunch = result.EndLunch ? result.EndLunch: moment();
                selectedDay.EndWork = result.EndWork ? result.EndWork : moment();
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
                        $scope.starttime = day.StartWork ? moment(day.StartWork) : moment();
                        $scope.lunchstarttime = day.StartLunch ? moment(day.StartLunch) : moment();
                        $scope.lunchendtime = day.EndLunch ? moment(day.EndLunch) : moment();
                        $scope.endtime = day.EndWork ? moment(day.EndWork) : moment();
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
                $scope.starttime = day.StartWork ? moment(day.StartWork) : moment();
                $scope.lunchstarttime = day.StartLunch ? moment(day.StartLunch): moment();
                $scope.lunchendtime = day.EndLunch ? moment(day.EndLunch): moment();
                $scope.endtime = day.EndWork ? moment(day.EndWork) : moment();
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
        updateCharts();
    });

    $scope.reset = function() {
        setDefault();
    }

    var reRenderDatePicker = function () {

        var days = $('td.day').not('.disabled').not('.new').not('.old');

        var selDate = date.selectedDate;

        var item = _.find(days, function(day) {
            return moment(selDate).date().toString() == day.innerHTML;
        });

        if (item) {
            item.click();

            var item = _.find($('td.day').not('.disabled').not('.new').not('.old').not('.active'), function (day) {
                return moment(selDate).date().toString() == day.innerHTML;
            });
            
            if (item) {
                item.click();
            }
        } else {
            days[0].click();
        }

        //$('.datepicker').datepicker('hide');

    }

    $('#semicirclepie').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: 50
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Tidsfördelning',
            innerSize: '50%',
            data: [
                ['Förmiddag', 0],
                ['Lunch', 0],
                ['Eftermiddag', 0]
            ]
        }]
    });

    var updateCharts = function () {
        $('#semicirclepie').highcharts().series[0].update({
            data: [
                    ['Fm', moment($scope.lunchstarttime).diff(moment($scope.starttime))],
                    ['L', moment($scope.lunchendtime).diff(moment($scope.lunchstarttime))],
                    ['Em', moment($scope.endtime).diff(moment($scope.lunchendtime))]
            ]
        });
    }

    $scope.remove = function () {
        var resultPromise = $http.post("/TimeReport/Delete", { id: id });
        resultPromise.success(function (result) {
            var removedDay = _.find(reports.monthReports, function (day) {
                return moment(day.Day).format("YYYY-MM-DD") == moment($scope.date.selectedDate).format("YYYY-MM-DD");
            });
            var index = reports.monthReports.indexOf(removedDay);
            reports.monthReports.splice(index, 1);
        });
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