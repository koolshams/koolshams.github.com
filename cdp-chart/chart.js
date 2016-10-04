//  No copyright
/* global jQuery, Highcharts, Handlebars, moment */
((function ($) {
  'use strict';

  Highcharts.setOptions({
    global: {
      useUTC: false,
    },
  });

  var values = ['0', '< 1K', '< 100K', '< 1M', '< 100M', '> 100M'];

  function getValue (value) {
    if (value < 1024) {
      return 1;
    }

    if (value < 1024 * 100) {
      return 2;
    }

    if (value < 1024 * 1024) {
      return 3;
    }

    if (value < 1024 * 1024 * 100) {
      return 4;
    }

    return 5;
  }

  $(function () {
    function dataMapperSecond(item) {
      return [item.rawtimestamp * 1000, getValue(item.datasize)];
    }

    function dataMapper(item) {
      return [item.rawtimestamp - 100000000, getValue(item.datasize)];
    }

    var rangeTemplate = Handlebars.compile('{{min}} - {{max}}');
    var graphRangeTemplate = Handlebars.compile('<b>Min: </b><span>{{min}}</span> <span class="pull-right"><b>Max:</b>{{max}}</span>');

    function formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss SSS') + ' ' +
        parseInt((date - parseInt(date, 10)) * 1000, 10);
    }

    var chartDiv = $('#chart');

    $.get('intial-data.json', function(res){
      var fullData = res.map(dataMapperSecond);
      var chart;
      var zoomData = [];

      $.get('zoom-data.json', function(response){
        zoomData = response.map(dataMapper);
      }, 'json');

      var range = {
        min: 1471533282000,
        max: 1474404238000,
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
          maxPointWidth: 5,
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

        setTimeout(function() {
          if (!selectePoint) {
             chartDiv.scrollLeft(0);
          }

          var extremes = chart.xAxis[0].getExtremes();
          var diff = selectePoint - extremes.min;
          if (diff <= 0) {
            chartDiv.scrollLeft(0);
          }

          var left = (chartDiv.find('div').width() * diff / (extremes.max - extremes.min)) - 300;
          if (left  <= 0) {
            chartDiv.scrollLeft(0);
          }

          chartDiv.scrollLeft(left);
        }, 200);
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
        tooltip: {
          enabled: true,
          formatter: function() {
            var d = new Date(this.x);
            return '<b>' + this.series.name +'</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S ', d) +
              d.getMilliseconds() + ': ' + values[this.y];
          }
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
          tickPositioner: function() {
            if (currentZoom !== 3) {
              return null;
            }
            var positions = [];
            var min = this.min;
            var max = this.max;
            var tiks = (max - min) / 20;
            for(var i = 0; i < 20; i++) {
              positions.push(min + (tiks * i));
            }
            return positions;
          },
          labels: {
            formatter: function() {
              if (currentZoom === 0 || currentZoom === 1) {
                return Highcharts.dateFormat(this.dateTimeLabelFormat, this.value);
              } else {
                var d = new Date(this.value);
                if (currentZoom === 2) {
                  if (this.isLast && d.getMilliseconds() === 0) {
                    return 1000;
                  }

                  return d.getMilliseconds();
                }

                return parseInt((this.value - parseInt(this.value)) * 1000);
              }
            }
          }
        },
        yAxis: {
          title: {
            text: '',
          },
          labels: {
            enabled: false,
          },
        },
        series: [getSeries(fullData)],
      });
    }, 'json');
  });
})(jQuery));
