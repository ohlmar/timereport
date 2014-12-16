angular.module('timeReport').controller('statscontroller', function ($scope, $http) {

    $scope.$on('timechanged', function (event, args) {
        getTotalFlex();
    });

    var getTotalFlex = function () {
        var resultPromise = $http.post("/TimeReport/CalculateTotalFlex");
        resultPromise.success(function (result) {
            $scope.totalFlex = result.Data.Flex;
        });
    };

});
