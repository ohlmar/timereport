angular.module('timeReport').controller('datepickercontroller', function($scope, date, _, reports) {
    $scope.today = function() {
        date.selectedDate = new Date();
    };
    $scope.today();

    $scope.date = date;

    $scope.clear = function() {
        $scope.dt = null;
    };

    $('.datepicker').datepicker({
        weekStart: 1,
        daysOfWeekDisabled: '0,6',
        todayHighlight: true,
        beforeShowDay: function(date) {

            var hasReport = _.find(reports.monthReports, function(report) {
                return moment(report.Day).format("YYYY-MM-DD") == moment(date).format("YYYY-MM-DD");
            });

            return {
                enabled: true,
                classes: hasReport ? (hasReport.IsVacation ? "vacation" :"reported") : "",
            }

        }

    }).on('changeDate', function(e) {
        $scope.$apply(function () {
            $scope.date.selectedDate = moment(e.date);
        });
    }).on('changeMonth', function (e) {
        $scope.$apply(function () {
            $scope.date.selectedDate = moment(e.date);
        });
    });
});