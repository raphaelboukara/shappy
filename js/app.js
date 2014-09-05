angular.module('ionicApp', ['ionic', 'ngResource', 'angularMoment'])

.run(function(amMoment) {
    amMoment.changeLanguage('fr');
})

.config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('signin', {
      url: "/sign-in",
      templateUrl: "sign-in.html",
      controller: 'SignInCtrl'
    })

    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html",
          controller: 'HomeTabCtrl'
        }/*,
        'header': {
          templateUrl: "home-header.html"
        }*/
      }
    })
    .state('tabs.new', {
      url: "/new",
      views: {
        'new-tab': {
          templateUrl: "new.html",
          controller: "newPostCtrl"
        }/*,
        'header': {
          templateUrl: "new-header.html"
        }*/
      }
    });

    $urlRouterProvider.otherwise("/sign-in");
})

.factory("Post", function($resource) {
  //return $resource("http://shappi.herokuapp.com/posts/:id", null,
  return $resource("http://localhost:3000/users/:user_id/posts/:id", null,
     {
         'update': { method:'PUT' }
     });
})

.factory("User", function($resource) {
  //return $resource("http://shappi.herokuapp.com/posts/:id", null,
  return $resource("http://localhost:3000/users/:id", null,
     {
         'update': { method:'PUT' }
     });
})

.controller('SignInCtrl', function($rootScope, $scope, $state, User) {
  
  $scope.user = {};

  $scope.signIn = function() {
    var user = new User();
    user.name = $scope.user.name;
    user.$save().then(function(data) {
      $rootScope.user = data;
      $state.go('tabs.home');
    });
  };
  
})

.controller('HomeTabCtrl', function($rootScope, $scope, Post) {
  
  $scope.refresh = function() {
    Post.query({user_id: $rootScope.user.id}, function(posts) {
      $scope.posts = posts;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.like = function(post) {
    post.yes += 1;
    Post.update({ user_id: $rootScope.user.id, id:post.id }, post);
  };

  $scope.unlike = function(post) {
    post.no += 1;
    Post.update({ user_id: $rootScope.user.id, id:post.id }, post);
  };

})

.controller('newPostCtrl', function($rootScope, $scope, $state, Post) {

  $scope.post = {};

  $scope.create = function() {
    var post = new Post();
    post.content = $scope.post.content;
    post.$save({user_id: $rootScope.user.id}).then(function(data){
      $state.go('tabs.home');
    });
  };

});


