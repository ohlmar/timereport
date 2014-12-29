angular.module('timeReport').controller('statscontroller', function ($scope, $http, reports) {

    $scope.$on('getFlex', function (event, args) {
        getTotalFlex();
        getRemainingVacation();
    });

    var getTotalFlex = function () {
        var resultPromise = $http.post("/TimeReport/CalculateTotalFlex");
        resultPromise.success(function (result) {
            $scope.totalFlex = parseFloat(result.Data.Flex).toFixed(2);
        });

        var resultPromise = $http.post("/TimeReport/GetFlexInterval", {
            startDate: moment().subtract(21, 'days'), endDate: moment()
        });
        resultPromise.success(function (result) {
            $('#container').highcharts().series[0].update({
                data: result.Data.FlexList
                
            });
        });


    };
    var getRemainingVacation = function () {
        var resultPromise = $http.post("/TimeReport/CalculateRemainingVacation");
        resultPromise.success(function (result) {
            $scope.remainingVacation = result.Data.RemainingVacation + "/" + result.Data.TotalVacation;
        });
    };


    $('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Flexbank'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            minRange: 7 * 24 * 3600000 // fourteen days
        },
        yAxis: {
            title: {
                text: 'Timmar'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'Flexbank (h)',
            pointInterval: 24 * 3600 * 1000,
            pointStart: Date.UTC(2014, 11, 04),
            data: [
                0.84, 1.84, 2.84, 1.84, 0.64, -3.22, -1.42, 1.82, 2.82, 3.82,
                2.82, 3.82, 5.82, 1.82, 0.8239, 0.8239, 0.8245, 0.8265, 0.8261, 0.8269,
                
            ]
        }]
    });
});
