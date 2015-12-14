var app = angular.module('myApp', ['ngResource']);


app.factory('Customer', function ($resource) {
  var odataUrl = "http://services.odata.org/V4/Northwind/Northwind.svc/Customers";
  return $resource("Customer", {}, {
    'query': {
      method: 'GET',
      params: {
        key: "@key"
      },
      url: odataUrl + "(:key)"
    },
    'count': {
      method: 'GET',
      url: odataUrl + "/$count",
      transformResponse: function (data) {
        return {
          value: angular.fromJson(data)
        }
      }
    }
  });
});


app.controller("MyController", function ($scope, Customer) {
  $scope.skip = 0;
  $scope.customers = [];
  $scope.showStatus = true;
  $scope.status = "";
  $scope.count = 0;

  $scope.updateQuery = function () {
    var params = {
      '$skip': $scope.skip,
      '$top': 10
    };
    $scope.status = "processing";
    Customer.query(params).$promise
      .then(function (response) {
        $scope.customers = response.value;
        $scope.status = "solved";
      });
    Customer.count().$promise
      .then(function (response) {
        $scope.count = response.value;
      });
  }

  $scope.updateQuery();
});