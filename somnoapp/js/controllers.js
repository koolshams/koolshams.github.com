var smApp = angular.module('smApp', ['ngRoute']).controller('PatientsController', function($scope, $routeParams,$rootScope) {
    $scope.name = "PatientsController";
    $rootScope.name = "patients";
    $rootScope.showNav=false;
    $scope.params = $routeParams;
}).controller('PatientController', function($scope, $routeParams, $rootScope) {
    $rootScope.showNav=true;
    $rootScope.name = "patient";
    $scope.name = "PatientController";
    $scope.params = $routeParams;
}).controller('DocController', function($scope, $routeParams, $rootScope) {
    $rootScope.showNav=true;
    $rootScope.name = "doc";
    $scope.params = $routeParams;
}).controller('InsuranceController', function($scope, $routeParams, $rootScope) {
    $rootScope.showNav=true;
    $rootScope.name = "insurance";
    $scope.name = "InsuranceController";
    $scope.params = $routeParams;
}).controller('MedicationController', function($scope, $routeParams, $rootScope) {
    $rootScope.showNav=true;
    $rootScope.name = "medication";
    $scope.name = "MedicationController";
    $scope.params = $routeParams;
}).controller('AddPatientController', function($scope, $routeParams, $rootScope) {
    $rootScope.name = "add-patient";
    $rootScope.showNav=false;
    $scope.params = $routeParams;
});