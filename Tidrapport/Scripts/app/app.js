﻿var tidrapport = angular.module('timeReport', ['ui.bootstrap', 'highcharts-ng', 'ngBootbox'])
.controller('MainCtrl', [
'$scope',
function ($scope) {

}]);
tidrapport.factory('date', function () {
    return { selectedDate: moment() };
});

tidrapport.factory('_', function () {
    return window._;
});