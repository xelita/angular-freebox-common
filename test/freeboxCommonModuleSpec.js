describe("fbCommonModule Tests Suite", function () {

    // fbCommonConstants

    describe("fbCommonConstants Tests", function () {

        var fbCommonConstants;

        beforeEach(function () {
            module('fbCommonModule');
            inject(function (_fbCommonConstants_) {
                fbCommonConstants = _fbCommonConstants_;
            });
        });

        it("boxLocalUrl", function () {
            expect(fbCommonConstants.box.localUrl).toBe('http://mafreebox.freebox.fr');
        });

        it("apiVersionUrl", function () {
            expect(fbCommonConstants.urls.apiVersion).toBe('/api_version');
        });
    });

    // fbCommonService

    describe("fbCommonService Tests", function () {

        var fbCommonService;
        var fbCommonConstants;

        var $httpBackend;

        beforeEach(function () {
            module('fbCommonModule');
            inject(function (_fbCommonService_, _fbCommonConstants_, _$httpBackend_) {
                fbCommonService = _fbCommonService_;
                fbCommonConstants = _fbCommonConstants_;
                $httpBackend = _$httpBackend_;
            });
        });

        it("targetRootUrl should return local url if url parameter is omitted", function () {
            expect(fbCommonService.targetRootUrl()).toBe('http://mafreebox.freebox.fr');
        });

        it("targetRootUrl should return url if url is given", function () {
            expect(fbCommonService.targetRootUrl('myUrl')).toBe('myUrl');
        });

        it("apiVersion when url is omitted", function () {
            var expectedResponse = {
                "uid": "23b86ec8091013d668829fe12791fdab",
                "device_name": "Freebox Server",
                "api_version": "3.0",
                "api_base_url": "/api/",
                "device_type": "FreeboxServer1,1"
            };
            $httpBackend.expectGET('http://mafreebox.freebox.fr/api_version').respond(expectedResponse);
            fbCommonService.apiVersion();
            $httpBackend.flush();
        });

        it("apiVersion when url is provided", function () {
            var expectedResponse = {
                "uid": "23b86ec8091013d668829fe12791fdab",
                "device_name": "Freebox Server",
                "api_version": "3.0",
                "api_base_url": "/api/",
                "device_type": "FreeboxServer1,1"
            };
            $httpBackend.expectGET('http://88.168.32.124:8080/api_version').respond(expectedResponse);
            fbCommonService.apiVersion('http://88.168.32.124:8080');
            $httpBackend.flush();
        });

        it("apiRequestUrl when url is omitted", function () {
            var expectedResponse = {
                "uid": "23b86ec8091013d668829fe12791fdab",
                "device_name": "Freebox Server",
                "api_version": "3.0",
                "api_base_url": "/api/",
                "device_type": "FreeboxServer1,1"
            };
            $httpBackend.expectGET('http://mafreebox.freebox.fr/api_version').respond(expectedResponse);
            var promise = fbCommonService.apiRequestUrl('/login');
            promise.then(function(requestUrl){
                expect(requestUrl).toBe('http://mafreebox.freebox.fr/api/v3/login');
            });
            $httpBackend.flush();
        });

        it("apiRequestUrl when url is provided", function () {
            var expectedResponse = {
                "uid": "23b86ec8091013d668829fe12791fdab",
                "device_name": "Freebox Server",
                "api_version": "3.0",
                "api_base_url": "/api/",
                "device_type": "FreeboxServer1,1"
            };
            $httpBackend.expectGET('http://88.168.32.124:8080/api_version').respond(expectedResponse);
            var promise = fbCommonService.apiRequestUrl('/login', 'http://88.168.32.124:8080');
            promise.then(function(requestUrl){
                expect(requestUrl).toBe('http://88.168.32.124:8080/api/v3/login');
            });
            $httpBackend.flush();
        });
    });
});