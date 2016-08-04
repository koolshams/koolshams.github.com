$(function () {

    $('#chart-1').highcharts({

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },


        title: {
            text: 'Data Access per Virtual Device per weekday'
        },

        xAxis: {
            categories: ['Oracle-Emp', 'Finance-Tbl', 'Projections', 'LUN2', 'LUN3', 'Oracle-Log', 'Sybase-DB1', 'Finance-Main', 'LUN10', 'LUN-42']
        },

        yAxis: {
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            title: null
        },

        credits : {
          enabled: false,
        },

        colorAxis: {
            min: 0,
            minColor: Highcharts.getOptions().colors[8],
            maxColor: Highcharts.getOptions().colors[2]
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> Data Accessed <br><b>' +
                    this.point.value + '</b> K on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
            }
        },

        series: [{
            name: 'Data Access per Virtual Device',
            borderWidth: 1,
            data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
            dataLabels: {
                enabled: true,
                color: '#000000'
            }
        }]

    });

    $.get('assets/chart2.csv', function(csv) {
      $('#chart-2').highcharts({

        data: {
            csv: csv
        },

        credits : {
          enabled: false,
        },

        chart: {
            type: 'heatmap',
            inverted: true
        },


        title: {
            text: 'Virtual Device Data Heatmap Details for Oracle-Emp',
            align: 'left'
        },

        subtitle: {
            text: 'Data Access variation by day and hour through May 2015',
            align: 'left'
        },

        xAxis: {
            tickPixelInterval: 50,
            min: Date.UTC(2015, 4, 1),
            max: Date.UTC(2015, 4, 30)
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}:00'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            tickPositions: [0, 6, 12, 18, 24],
            tickWidth: 1,
            min: 0,
            max: 23
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
            ],
            min: -5
        },

        series: [{
            borderWidth: 0,
            colsize: 24 * 36e5, // one day
            tooltip: {
                headerFormat: 'Data Access for Oracle-Emp <br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} K</b>'
            }
        }]

    });
    })


});
