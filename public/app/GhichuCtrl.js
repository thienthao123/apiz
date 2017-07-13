'use strict';
app.controller('GhichuCtrl', ['$scope','$window','socket','$timeout','$location', function ($scope,$window,socket,$timeout,$location) {
  socket.on('list',function(data){
    $scope.ghichus = data
  })
  $scope.redirectEncode = function(){
    var url = $scope.link
        url = url.replace(/\s/g, '');
        url = url.replace(/\(/g, '');
        url = url.replace(/\)/g, '');
        url = url.replace(/\,/g, '.');
        $window.location.replace(url);
  }

  $scope.seachKey = function(data){
  	socket.emit('seach',data)
  }
  $scope.redirect = function(url){
    $window.open(url, '_blank');
  		//$window.location.href= url
  }
  $scope.save = function(){
      var url = $scope.link
        url = url.replace(/\s/g, '');
        url = url.replace(/\(/g, '');
        url = url.replace(/\)/g, '');
        url = url.replace(/\,/g, '.');
    socket.emit('save',{url : url,danhdau:$scope.danhdau})
    $timeout(function() { $scope.link = "" }, 1300)
  }
  $scope.delete = function(id){
    socket.emit('delete',id)
  }

  socket.on('err',function(err){
    alert(err)
  })




$scope.danhdauList = function(){
  
  socket.emit('danhdau',1)
}

}])