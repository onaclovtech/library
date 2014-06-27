var app = angular.module("myapp", ["firebase"]);

app.config(function($httpProvider) 
{
  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
});

function LibController($scope, $firebase, $http) 
{
  var FB = ""; //your Firebase address
  var name = ""; // your name
  var ref = new Firebase(FB + "library/" + name);
  $scope.books = $firebase(ref);
  var ref2 = new Firebase(FB + "library/all");
  $scope.all = $firebase(ref2.limit(1));
  $scope.addBook = function(e) 
  {
    $scope.method = 'GET';
    $scope.url = "http://openlibrary.org/search.json?isbn=";
    
    $http({method: $scope.method, url: $scope.url + $scope.isbn}).
      success(function(data, status)
      {
        $scope.status = status;
        $scope.data = data;
        if (data["docs"] != "")
        {
          $scope.books.$add({"title":data["docs"][0]["title"], isbn : $scope.isbn});
          $scope.all.$add({"title":data["docs"][0]["title"], isbn : $scope.isbn});
        }
      }).
      error(function(data, status) 
      {
        $scope.data = data;
        $scope.status = status;
      });
  }
}
