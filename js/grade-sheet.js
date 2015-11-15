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
gradeSheet.controller('GradeSheetCtrl', ['$scope', 'focus', 'PersistentStorageService',
    function($scope, focus, PersistentStorageService) {
        $scope.columnLabels = ['#', 'Name', 'Grade', 'Delete?'];
        $scope.entries = PersistentStorageService.getEntries();

        var watcher = $scope.$watch('entries', function(newEntries) {
                PersistentStorageService.setEntries($scope.entries);
                focus('thingy');
            },
            true); // Deep watch

        $scope.$on('$destroy', function() {
            watcher(); // Unbind the watch when the scope is destroyed
        });

        $scope.delete = function(index) {
            $scope.entries.splice(index, 1);
        }
    }
]);
gradeSheet.controller('NewEntryCtrl', ['$scope',
    function($scope) {
        $scope.newEntry = {};

        function canCreate() {
            return angular.isString($scope.newEntry.name)
                && angular.isNumber($scope.newEntry.grade);
        }

        $scope.create = function() {
            if (canCreate()) {
                $scope.entries.push($scope.newEntry);
                $scope.newEntry = {};
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
gradeSheet.directive('updateOnEnterInput', function() {
    return {
        restrict: 'E',
        // Must replace the original update-on-enter-input element so that additional
        // attributes are added to the input in the directive template
        replace: true,
        template: '<input ng-model=\"model\" ng-model-options=\"{updateOn: \'change blur\'}\">',
        scope: {
            model: '='
        }
    }
});
