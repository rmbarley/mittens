var app = angular.module("mittensApp", ["ngRoute", "ngResource"]).run(function($rootScope, $http) {
  $rootScope.authenticated = false;
  $rootScope.currentUser = "";

  $rootScope.signout = function() {
    $http.get("/auth/signout");

    $rootScope.authenticated = false;
    $rootScope.currentUser = "";
  };
});

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "main.html",
      controller: "mainController"
    })
    .when("/login", {
      templateUrl: "login.html",
      controller: "authController"
    })
    .when("/signup", {
      templateUrl: "register.html",
      controller: "authController"
    });
});

app.factory("postService", function($resource) {
  return $resource("/api/posts/:id");
});

app.controller("mainController", function($rootScope, $scope, postService) {
  $scope.posts = postService.query();
  $scope.newPost = {
    username: "",
    text: "",
    created_at: ""
  };

  $scope.post = function() {
    $scope.newPost.username = $rootScope.currentUser;
    $scope.newPost.created_at = Date.now();
    
    $scope.posts = postService.query();
    postService.save($scope.newPost, function() {
      $scope.newPost = {
        username: "",
        text: "",
        created_at: ""
      };
    });
  };
});

app.controller("authController", function($scope, $rootScope, $http, $location) {
  $scope.user = { username: "", password: "" };
  $scope.error_message = "";

  // Placeholders until authentication is implemented.
  $scope.login = function() {
    $http.post("/auth/login", $scope.user).success(function(data) {
      if (data.state == "success") {
        $rootScope.authenticated = true;
        $rootScope.currentUser = data.user.username;

        $location.path("/");
      } else {
        $scope.error_message = data.message;
      }
    });
  };
  $scope.register = function() {
    $http.post("/auth/signup", $scope.user).success(function(data) {
      if (data.state == "success") {
        $rootScope.authenticated = true;
        $rootScope.currentUser = data.user.username;
        $location.path("/");
      } else {
        $scope.error_message = data.message;
      }
    });
  };
});
