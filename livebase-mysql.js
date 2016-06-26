
(function() {
    angular.module('livebase', []);
})();

(function() {
    "use strict";
    angular.module('livebase')
        //Config
        .provider('$livebase', function() {
            var fburl = false;
            var commands = [];
            return {
                url: function(val) {
                    fburl = val
                },
                tell: function(obj) {
                    commands = obj
                },
                $get: function() {
                    return {
                        url: fburl,
                        tell: commands
                    };
                }
            };
        })
        //Controllers
        .controller('LivebaseCtrl', ['$scope', 'Bot', function($scope, Bot) {
            var rec = new webkitSpeechRecognition();
            $scope.$watch(function() {
                return Bot.all();
            }, function(val) {
                $scope.chats = val;
            });
            $scope.lb.send = function() {
                if ($scope.lb.input) {
                    Bot.send($scope.lb.input);
                    $scope.lb.input = '';
                }
            }
            $scope.lb.enter = function($event) {
                if ($event.keyCode === 13 && $scope.lb.input) {
                    Bot.send($scope.lb.input);
                    $scope.lb.input = '';
                }
            }

            $scope.lb.listen = function() {
                rec.start();
            }

            rec.onresult = function(event) {
                Bot.send(event.results[0][0].transcript);
            }
        }])

    //Directives
    .directive('livebase', function() {
            return {
                restrict: 'E',
                controller: 'LivebaseCtrl',
                controllerAs: 'lb',
                transclude: true,
                template: '<ng-transclude></ng-transclude>'
            }
        })
        .directive('lbInput', function() {
            return {
                require: "livebase",
                restrict: 'E',
                replace: true,
                template: '<input type="text" ng-model="lb.input" ng-keydown="lb.enter($event)">'
            }
        })
        .directive('lbSend', function() {
            return {
                require: 'livebase',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<button ng-click="lb.send()"><ng-transclude></ng-transclude></button>'
            }
        })
        .directive('lbListen', function() {
            return {
                require: 'livebase',
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<button ng-click="lb.listen()"><ng-transclude></ng-transclude></button>'
            }
        })
        //Services
        .service('Bot', function($http, $q, $location, $rootScope, $livebase) {
            if (!localStorage.getItem('livebaseid')) {
                localStorage.setItem('livebaseid', Date.now().toString() + (Math.floor(Math.random() * 100000) + 1));
            }
            var chats = [];
            $http.get($livebase.url + "/all.php?livebaseid=" + localStorage.getItem('livebaseid')).success(function(data) {
                chats = data;
            });
            return ({
                send: function(text) {
                    var id;
                    $http.get($livebase.url + "/send.php?id=" + localStorage.getItem('livebaseid') + "&type=user&text=" + text).success(function() {
                        $http.get($livebase.url + "/all.php?livebaseid=" + localStorage.getItem('livebaseid')).success(function(data) {
                            chats = data;
                        });
                    });
                    var bypass = matchTell($livebase.tell, text.toLowerCase());
                    if (bypass) {
                        if (bypass.reply) {
                            $http.get($livebase.url + "/send.php?id=" + localStorage.getItem('livebaseid') + "&type=bot&text=" + text).success(function() {
                                $http.get($livebase.url + "/all.php?livebaseid=" + localStorage.getItem('livebaseid')).success(function(data) {
                                    chats = data;
                                });
                            });
                        }
                        if (bypass.link) {
                            $location.hash(bypass.link);
                        }
                    } else {
                        if (!localStorage.getItem('livebaseid')) {
                            id = ""
                        } else {
                            id = "&convo_id=" + localStorage.getItem('livebaseid')
                        }
                        var url = "https://samsungiotacademy.com/livebase/gui/plain/bot.php?format=json&submit=Go&say=" + text + id;
                        $http.get(url)
                            .then(function(response) {
                                var res = response.data.botsay;
                                for (var script = /<script\b[^>]*>([\s\S]*?)<\/script>/gm, scriptCap = /<Script\b[^>]*>([\s\S]*?)<\/Script>/gm,
                                        scr; scr = script.exec(res);) res = res.split(scr[0]).join("").trim(), eval(scr[1]);
                                for (; scr = scriptCap.exec(res);) res = res.split(scr[0]).join("").trim(), eval(scr[1]);
                                $http.get($livebase.url + "/send.php?id=" + localStorage.getItem('livebaseid') + "&type=bot&text=" + res).success(function() {
                                    $http.get($livebase.url + "/all.php?livebaseid=" + localStorage.getItem('livebaseid')).success(function(data) {
                                        chats = data;
                                    });
                                });
                            });
                    }
                },
                all: function() {
                    return chats;
                }
            })
        });

    function matchTell(arr, tell) {
        if (arr.length === 0) {
            return false;
        } else {
            var ret;
            arr.map(function(i, j, k) {
                if (tell.indexOf(i.cmd.toLowerCase()) > -1) {
                    ret = k[j];
                }
            });
            return ret;
        }
    }

})();
