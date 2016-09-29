//  No copyright
/* global jQuery, Highcharts, Handlebars, moment */
((function ($) {
  Highcharts.setOptions({
    global: {
      useUTC: false,
    },
  });
  $(function () {
    function dataMapper(item) {
      return [item.rawtimestamp, item.datasize];
    }

    var rangeTemplate = Handlebars.compile('{{min}} - {{max}}');
    var graphRangeTemplate = Handlebars.compile('<b>Min: </b><span>{{min}}</span> <span class="pull-right"><b>Max:</b>{{max}}</span>');

    function formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss SSS') + ' ' +
        parseInt((date - parseInt(date, 10)) * 1000, 10);
    }

    $.get('intial-data.json', function(res){
      var fullData = res.map(dataMapper);
      var chart;
      var zoomData = [];

      $.get('zoom-data.json', function(response){
        zoomData = response.map(dataMapper);
      }, 'json');

      var range = {
        min: 1473049967000,
        max: 1474054044000,
      };

      var zoomList = [{
        title: 'Full',
      }, {
        title: '10 Minutes',
        range: 10 * 60 * 1000,
      }, {
        title: '1 Second',
        range: 1000,
      }, {
        title: '1 Millisecond',
        range: 1,
      }];

      $('.jounral-range span').text(rangeTemplate({
        min: formatDate(range.min),
        max: formatDate(range.max),
      }));

      $('.graph-range').html(graphRangeTemplate({
        min: formatDate(range.min),
        max: formatDate(range.max),
      }));

      var $selectedDate = $('.selected-point .date');
      var $selectedZoom = $('.zoom');
      var currentZoom = 0;
      var selectePoint = null;

      function clickHandler(evt) {
        var axis = chart.xAxis[0];
        axis.removePlotLine('marker');
        var value;
        if (evt.xAxis) {
          value = evt.xAxis[0].value;
        } else if (evt.point) {
          value = evt.point.x;
        } else {
          return;
        }

        selectePoint = value;
        $selectedDate.text(formatDate(value));

        axis.addPlotLine({
          id: 'marker',
          color: 'red',
          width: 1,
          value: value,
          zIndex: 5,
        });
      }

      function getSeries(data) {
        return {
          name: 'IOs',
          data: data,
          events: {
            click: clickHandler,
          },
          id: 'cdp',
          color: '#7cb5ec',
        };
      }

      var width = 800;
      var diff = Math.round((range.max - range.min) / (1000 * 60 * 60 * 24));
      var diffWidth = 500 * diff;
      if (diffWidth > width) {
        width = diffWidth;
      }

      function drawChart(newRange) {
        if (chart.get('cdp')) {
          chart.get('cdp').remove();
        }

        if (currentZoom === 0) {
          chart.xAxis[0].setExtremes(range.min, range.max);
          chart.setSize(width, 200);
          chart.addSeries(getSeries(fullData));
          chart.redraw();
        } else {
          chart.setSize(3000, 200);
          chart.xAxis[0].setExtremes(newRange.min, newRange.max);
          var chartData = zoomData.filter(function(item) {
            return item[0] >= newRange.min && item[0] <= newRange.max;
          });
          chart.addSeries(getSeries(chartData));
        }
      }

      function changeZoom(timeDiff) {
        if (!selectePoint) {
          return;
        }

        currentZoom += timeDiff;
        if (currentZoom > zoomList.length - 1) {
          currentZoom = zoomList.length - 1;
        }

        if (currentZoom < 0) {
          currentZoom = 0;
        }

        var zoom = zoomList[currentZoom];
        $selectedZoom.text(zoom.title);

        var newRange = {};
        if (currentZoom === 0) {
          newRange = $.extend(newRange, range);
        } else if (currentZoom === 1) {
          newRange = {
            min: parseInt(selectePoint - (zoom.range / 2), 10),
            max: parseInt(selectePoint + (zoom.range / 2), 10),
          };
        } else {
          var start = selectePoint - (selectePoint % zoom.range);
          newRange = {
            min: start,
            max: start + zoom.range,
          };
        }

        if (newRange.min < range.min) {
          newRange.min = range.min;
        }

        if (newRange.max > range.max) {
          newRange.max = range.max;
        }

        $('.graph-range').html(graphRangeTemplate({
          min: formatDate(newRange.min),
          max: formatDate(newRange.max),
        }));

        drawChart(newRange);
      }

      $('button.plus').on('click', function() {
        changeZoom(1);
      });

      $('button.minus').on('click', function(){
        changeZoom(-1);
      });

      chart = new Highcharts.Chart({
        chart: {
          type: 'column',
          renderTo: $('#chart')[0],
          width: width,
          height: 200,
          events: {
            click: clickHandler,
          },
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          type: 'datetime',
          min: range.min,
          max: range.max,
        },
        yAxis: {
          title: {
            text: '',
          },
          labels: {
            enabled: false,
          },
        },
        tooltip: {
          enable: true,
        },
        series: [getSeries(fullData)],
      });
    }, 'json');
  });
})(jQuery));
