angular.module('timeReport').controller('statscontroller', function ($scope, $http) {

    $scope.$on('getFlex', function (event, args) {
        getTotalFlex();
        getRemainingVacation();
    });

    var getTotalFlex = function () {
        var resultPromise = $http.post("/TimeReport/CalculateTotalFlex");
        resultPromise.success(function (result) {
            $scope.totalFlex = parseFloat(result.Data.Flex).toFixed(2);
        });
    };
    var getRemainingVacation = function () {
        var resultPromise = $http.post("/TimeReport/CalculateRemainingVacation");
        resultPromise.success(function (result) {
            $scope.remainingVacation = result.Data.RemainingVacation + "/" + result.Data.TotalVacation;
        });
    };

});
