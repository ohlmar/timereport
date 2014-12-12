angular.module('timeReport').controller('datepickercontroller', function ($scope, date) {
    $scope.today = function () {
        //date.selectedDate = new Date();
    };
    $scope.today();

    $scope.date = date;

    $scope.clear = function () {
        $scope.dt = null;
    };

});