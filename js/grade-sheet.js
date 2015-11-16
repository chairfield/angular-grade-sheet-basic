"use strict";

var gradeSheet = angular.module('gradeSheet', ['LocalStorageModule']);
gradeSheet.config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('gradeSheet');
});
gradeSheet.service('PersistentStorageService', ['localStorageService',
    function(localStorageService) {
        return {
            getEntries: function() {
                var entries = localStorageService.get('entries');
                if (!entries) {
                   entries = [];
                }
                return entries;
            },
            setEntries: function(entries) {
                localStorageService.set('entries', entries)
            }
        }
    }
]);
// Credit goes to ryeballar on: http://stackoverflow.com/questions/25596399/set-element-focus-in-angular-way
gradeSheet.factory('focus', function($timeout, $window) {
    return function(id) {
        // timeout makes sure that it is invoked after any other event has been triggered.
        // e.g. click events that need to run before the focus or
        // inputs elements that are in a disabled state but are enabled when those events
        // are triggered.
        $timeout(function() {
            var element = $window.document.getElementById(id);
            if (element) {
                element.focus();
            }
        });
    };
});
gradeSheet.controller('GradeSheetCtrl', ['$scope', '$log', 'focus', 'PersistentStorageService',
    function($scope, $log, focus, PersistentStorageService) {
        $scope.columnLabels = ['#', 'Name', 'Grade', 'Delete?'];
        $scope.entries = PersistentStorageService.getEntries();

        $scope.onNameChange = function(entryId, oldName) {
            var newName = $scope.entries[entryId].name;
            if (angular.isString(newName) && /\S/.test(newName)) {
                $log.info('name changed from', oldName, 'to', newName);
                PersistentStorageService.setEntries($scope.entries);
            }
            else {
                $log.warn('user attempted to modify name illegally; reverting back to', oldName);
                $scope.entries[entryId].name = oldName;
            }
        }
        $scope.onGradeChange = function(entryId, oldGrade) {
            var newGrade = $scope.entries[entryId].grade;
            if (angular.isNumber(newGrade)) {
                $log.info('grade changed from', oldGrade, 'to', newGrade);
                PersistentStorageService.setEntries($scope.entries);
            }
            else {
                $log.warn('user attempted to modify grade illegally; reverting back to', oldGrade);
                $scope.entries[entryId].grade = Number(oldGrade);
            }
        }

        $scope.delete = function(index) {
            $scope.entries.splice(index, 1);
            PersistentStorageService.setEntries($scope.entries);

            focus('newEntryNameInput');
        }
    }
]);
gradeSheet.controller('NewEntryCtrl', ['$scope', 'focus', 'PersistentStorageService',
    function($scope, focus, PersistentStorageService) {
        $scope.newEntry = {};

        function canCreate() {
            return angular.isString($scope.newEntry.name)
                && angular.isNumber($scope.newEntry.grade);
        }

        $scope.create = function() {
            if (canCreate()) {
                $scope.entries.push($scope.newEntry);
                PersistentStorageService.setEntries($scope.entries);
                $scope.newEntry = {};
                focus('newEntryNameInput');
            }
        }
    }
]);
gradeSheet.controller('SummaryCtrl', ['$scope',
    function($scope) {
        function computeMaxGrade(entries) {
            return _(entries).max('grade').grade;
        };
        function computeMinGrade(entries) {
            return _(entries).min('grade').grade;
        };
        function computeAverageGrade(entries) {
            function averageIteratee(accumulator, value, index, collection) {
                return accumulator + value.grade / collection.length;
            };

            return _(entries).reduce(averageIteratee, 0);
        };

        $scope.summaryRows = [
            { label: 'Max:', valueFunction: computeMaxGrade },
            { label: 'Average:', valueFunction: computeAverageGrade },
            { label: 'Min:', valueFunction: computeMinGrade }
        ];
    }
]);
gradeSheet.directive('centered', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div style="display: table; height: 100%; margin: auto;">' +
                      '<div style="display: table-cell; vertical-align: middle;">' +
                          '<ng-transclude></ng-transclude>' +
                      '</div>' +
                  '</div>'
    }
});

