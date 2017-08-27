var huoyun = angular.module('huoyun', ["huoyun.widget", 'huoyun.formdata']);

huoyun.config(["$logProvider", function($logProvider) {
  $logProvider.debugEnabled(true);
}]);

huoyun.config(["applicationProvider", function(applicationProvider) {
  applicationProvider.setName("纵目真值系统V2");
}]);

huoyun.config(["navProvider", function(navProvider) {

  navProvider.setItems([{
    name: "home",
    text: "任务大厅",
    href: "page/home/index.html"
  }, {
    name: "mytask",
    text: "我的任务",
    href: "page/task/index.html"
  }, {
    name: "train",
    text: "训练中心",
    href: "page/train/index.html"
  }, {
    name: "setting",
    text: "设置",
    visibility: false,
    href: "page/setting/asset.view.tag.html"
  }, {
    name: "help",
    text: "帮助中心",
    href: "page/help/index.html"
  }]);
}]);


huoyun.config(["footbarProvider", function(footbarProvider) {
  footbarProvider.configure({
    links: [{
      text: "关于系统",
      href: "http://www.zongmutech.com/"
    }, {
      text: "联系我们(QQ:123456;Tel:12345678)",
      href: "/"
    }],
    copyRight: "2014-2016",
    companyName: "纵目科技有限公司",
    recordNo: "沪公安备09004260号"
  });
}]);




huoyun.controller("appController", ["$scope",
  function($scope) {
    $scope.title = "纵目真值系统";

  }
]);
'use strict';

huoyun.controller("LoginController", ["$scope", "FormData", "UserService", "Validators",
  function($scope, FormData, UserService, Validators) {

    $scope.vm = new FormData("email", "password");
    $scope.vm.addValidator("email", Validators.Mandatory, "邮箱不能为空。");
    $scope.vm.addValidator("email", Validators.Email, "邮件格式不正确。");
    $scope.vm.addValidator("password", Validators.Mandatory, "密码不能为空。");

    $scope.login = function() {
      $scope.vm.onValid()
        .then(login)
        .catch(function(ex) {
          $scope.vm.clearErrors();
          $scope.vm.setError(ex.fieldName, ex.errorMessage);
        });
    };

    function login() {
      var model = $scope.vm.getModel();
      UserService.login(model.email, model.password)
        .then(function() {
          window.location.href = "/index.html";
        }).catch(function(err) {
          $scope.vm.clearErrors();
          $scope.vm.setError("email", err.message);
        });
    }
  }
]);
'use strict';

huoyun.controller("RegisterController", ["$scope", "FormData", "UserService", "Validators",
  function($scope, FormData, UserService, Validators) {

    $scope.vm = new FormData("email", "password", "repeatPassword");
    $scope.vm.addValidator("email", Validators.Mandatory, "邮箱不能为空。");
    $scope.vm.addValidator("email", Validators.Email, "邮件格式不正确。");
    $scope.vm.addValidator("password", Validators.Mandatory, "密码不能为空。");
    $scope.vm.addValidator("repeatPassword", Validators.Mandatory, "重复密码不能为空。");
    $scope.vm.addValidator("repeatPassword", Validators.StringEqual, "两次密码不一致。", {
      equals: function(value) {
        return value === $scope.vm.password.value;
      }
    });



    $scope.register = function() {
      $scope.vm.onValid()
        .then(register)
        .catch(function(ex) {
          $scope.vm.clearErrors();
          $scope.vm.setError(ex.fieldName, ex.errorMessage);
        });
    };

    function register() {
      var model = $scope.vm.getModel();
      UserService.register(model.email, model.password, model.repeatPassword)
        .then(function() {
          window.location.href = "/login.html";
        }).catch(function(err) {
          $scope.vm.clearErrors();
          $scope.vm.setError("email", err.message);
        });
    }
  }
]);
'use strict';
huoyun.constant("ServiceContext", "");

huoyun.factory("BaseService", ["$q", "$http",
  function($q, $http) {
    return {
      getResponse: function(request) {
        var dtd = $q.defer();
        request.then(function(res) {
          dtd.resolve(res.data);
        }).catch(function(ex) {
          console.error(ex);
          dtd.reject(ex.data);
        });
        return dtd.promise;
      }
    };
  }
]);

huoyun.factory("UserService", ["$http", "BaseService", "ServiceContext",
  function($http, BaseService, ServiceContext) {

    return {
      login: function(email, password) {
        var url = `${ServiceContext}/login`;
        return BaseService.getResponse($http.post(url, {
          email: email,
          password: password
        }));
      },

      register: function(email, password, repeatPassword) {
        var url = `${ServiceContext}/register`;
        return BaseService.getResponse($http.post(url, {
          email: email,
          password: password,
          repeatPassword: repeatPassword
        }));
      }
    };
  }
]);