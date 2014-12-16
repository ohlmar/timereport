angular.module('timeReport').controller('datepickercontroller', function($scope, date, _) {
    $scope.today = function() {
        date.selectedDate = new Date();
    };
    $scope.today();

    $scope.date = date;

    $scope.clear = function() {
        $scope.dt = null;
    };

    $('.datepicker').datepicker({
    }).on('changeDate', function (e) {
        $scope.$apply(function() {
            $scope.date.selectedDate = moment(e.date);
        });
    });
});