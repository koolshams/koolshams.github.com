smApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/patients.html',
        controller: 'PatientsController'
    }).when('/patient/view', {
        templateUrl: 'templates/patient.html',
        controller: 'PatientController'
    }).when('/patient/doc', {
        templateUrl: 'templates/doc.html',
        controller: 'DocController'
    }).when('/patient/insurance', {
        templateUrl: 'templates/insurance.html',
        controller: 'InsuranceController'
    }).when('/patient/medication', {
        templateUrl: 'templates/medication.html',
        controller: 'MedicationController'
    }).when('/patient/add', {
        templateUrl: 'templates/add-patient.html',
        controller: 'AddPatientController'
    });
    
});