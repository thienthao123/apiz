'use strict';
var app = angular.module('myApp', ['officeuifabric.components.choicefield','officeuifabric.components.button','officeuifabric.core','officeuifabric.components.navbar','ngSanitize','officeuifabric.components.icon','officeuifabric.components.link','officeuifabric.components.list','btford.socket-io'])
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
