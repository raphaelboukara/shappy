angular.module('ionicApp', ['ionic', 'ngResource', 'angularMoment'])

.run(function(amMoment) {
    amMoment.changeLanguage('fr');
})

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])

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
  return $resource("http://shappi.herokuapp.com/posts/:id", null,
  //return $resource("http://localhost:3000/posts/:id", null,
     {
         'update': { method:'PUT' }
     });
})

.controller('SignInCtrl', function($scope, $state) {
  
  $scope.signIn = function(user) {
    $state.go('tabs.home');
  };
  
})

.controller('HomeTabCtrl', function($scope, Post) {
  
  $scope.refresh = function() {
    Post.query(function(posts) {
      $scope.posts = posts;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.like = function(post) {
    post.yes += 1;
    Post.update({ id:post.id }, post);
  };

  $scope.unlike = function(post) {
    post.no += 1;
    Post.update({ id:post.id }, post);
  };

})

.controller('newPostCtrl', function($scope, $state, Post) {

  $scope.post = {};

  $scope.update = function() {
    var post = new Post();
    post.content = $scope.post.content;
    post.$save();
    $state.go('tabs.home');
  };

});


