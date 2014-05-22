'use strict';
var app = angular.module('webvlc', []);

app.controller('MainCtrl', function(
    $scope, $http, $interval
) {
    $scope.vlcControl = function(action) {
        $http.get('requests/status.json?command=' + action);
    };

    $scope.statusTick = function() {
        $http.get('requests/status.json').success(function(data, status) {
            $scope.status = angular.copy(data);
        }).error(function(data, status) {
            $scope.intervalTick.cancel();
        });
    };

    $scope.fetchFiles = function(path) {
        $http.get('requests/browse.json?dir='+path).success(function(data, status) {
            data.element = data.element.map(function(file) {
                file.relativePath = file.path.replace(/^.*[\\\/]/, '');
                return file;
            });
            $scope.files = angular.copy(data.element);
        });
    }

    $scope.openFile = function(file) {
        if ('dir' === file.type) {
            $scope.fetchFiles(file.path);
        } else {
            $scope.vlcControl('in_play&input=' + encodeURI(file.uri));
        }
    }

    $scope.intervalTick = $interval($scope.statusTick, 500);
    $scope.fetchFiles('~');
});