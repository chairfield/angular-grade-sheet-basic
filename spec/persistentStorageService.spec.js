"use strict";

describe('the persistent storage service', function() {
    var sut
      , mockLocalStorageService;

    beforeEach(module('gradeSheet'));
    beforeEach(function() {
        mockLocalStorageService = jasmine.createSpyObj('localStorageService', ['get', 'set']);

        module(function($provide) {
            $provide.value('localStorageService', mockLocalStorageService);
        });

        inject(function($injector) {
            sut = $injector.get('PersistentStorageService');
        })
    });

    // Without this, my controller code that called (return value).push will error
    it('should return an empty array when local storage is empty', function() {
        // Arrange
        mockLocalStorageService.get.and.returnValue(null);

        // Act
        var entries = sut.getEntries();

        // Assert
        expect(entries).toEqual([]);
    });
});
