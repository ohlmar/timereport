angular.module('timeReport').controller('dayreportcontroller', function ($scope, $log) {

    $scope.starttime = moment().hours(08).minute(00);
    $scope.lunchstarttime = moment().hours(11).minute(30);
    $scope.lunchendtime = moment().hours(12).minute(00);
    $scope.endtime = moment().hours(16).minute(30);
    $scope.totaltime = "";

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.ismeridian = false;

    $scope.changed = function () {
        calcTotalTime();
    };

    var calcTotalTime = function() {
        var beforeLunch = moment($scope.lunchstarttime).diff(moment($scope.starttime));
        var afterLunch = moment($scope.endtime).diff(moment($scope.lunchendtime));

        $scope.totaltime = moment.duration(beforeLunch + afterLunch).hours() + ":" + moment.duration(beforeLunch + afterLunch).minutes();
    }
    calcTotalTime();

    $scope.reset = function() {
        $scope.starttime = moment().hours(08).minute(00);
        $scope.lunchstarttime = moment().hours(11).minute(30);
        $scope.lunchendtime = moment().hours(12).minute(00);
        $scope.endtime = moment().hours(16).minute(30);
    }
    var Example = (function () {
        "use strict";

        var elem,
            hideHandler,
            that = {};

        that.init = function (options) {
            elem = $(options.selector);
        };

        that.show = function (text) {
            clearTimeout(hideHandler);

            elem.find("span").html(text);
            elem.delay(200).fadeIn().delay(4000).fadeOut();
        };

        return that;
    }());

    $scope.remove = function () {
        bootbox.confirm("Are you sure?", function (result) {
            Example.show("Confirm result: " + result);
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