angular.module("ruleGuiApp").run(["$templateCache",function(a){"use strict";a.put("views/main.html",'<!-- <div class="diagram-container" ng-style="{height: getWindowHeight(0)}">\n  <div class="tool-box">\n    <div class="box-header clearfix">Building blocks</div>\n    <div class="item-group" ng-repeat="cat in menuItems" ng-init="acc = {open: true}">\n      <div class="item-title clearfix" ng-class="cat.bgClass" ng-click="acc.open = !acc.open">\n        <i ng-class="cat.icon"></i> {{cat.name}}\n        <i class="fa pull-right toggle-icon" ng-class="{\'fa-angle-down\': !acc.open, \'fa-angle-up\': acc.open}"></i>\n      </div>\n      <div class="item-list clearfix am-collapse" ng-show="acc.open">\n        <div class="item" cs-drag ng-repeat="item in cat.items">\n          <i ng-class="item.icon"></i><br/>\n          {{item.name}}\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="content-box">\n    <div class="panel panel-default">\n      <div class="panel-heading">Edit Diagram</div>\n      <div class="panel-body" ng-style="{height: getWindowHeight(100)}">\n        <div class="jont-paper" cs-designer></div>\n      </div>\n    </div>\n  </div>\n  <div class="property-box">\n    <div class="box-header clearfix">Properties</div>\n  </div>\n</div> -->')}]);