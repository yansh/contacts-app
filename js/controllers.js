'use strict';

//<!--OCAML


//-->
var myapp = angular.module('myApp.controllers', []);

// directive http://jsfiddle.net/6aG4x/181/
myapp.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function (onChangeEvent) {
                var reader = new FileReader();

                reader.onload = function (onLoadEvent) {
                    scope.$apply(function () {
                        fn(scope, {$fileContent: onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});
myapp.service("InitContactsService", ['$q', function ($q) {

    var callWebWorker = function () {
        var defer = $q.defer();
        var worker = new Worker("lib/jsContacts.js");
        var worker_handler = new Object();

        function ASYNCH(action_name, action_args, cont) {
            worker_handler[action_name] = cont;
            worker.postMessage({fname: action_name, args: action_args});
            console.log("[ASYNCH] " + action_name + " (" + action_args + ")");
        }

        worker.onmessage = function (m) {
            if (typeof m.data == 'string') {
                //console.log("" + m.data);
                alert(m.data)
            } else {
                console.log("[ASYNCH] back from " + m.data.fname);
                var handler = worker_handler[m.data.fname];
                handler(m.data.result);

            }
        }
        ASYNCH("runQuery", ["querygoeshere"], function (resp) {
            //  $scope.Contacts = JSON.parse(resp);
            defer.resolve(resp);
        });

        return defer.promise;
    };
    return {
        callWebWorker: callWebWorker
    };

}]).service("ContactsService", ['$q', function ($q) {
    //<!-- from https://github.com/calendee/ionicPickContact/blob/master/www/js/app.js -->
//------------------------------------------
    var formatContact = function (contact) {
        console.log(JSON.stringify(contact));
        return {
            "fn": contact.name.formatted || "Mystery Person",
            "emails": contact.emails[0].value,
            "image": contact.photos[0].value,
            "phones": contact.phones || []

        };
    };
    var pickContact = function () {
        var deferred = $q.defer();
        if (navigator && navigator.contacts) {
            navigator.contacts.pickContact(function (contact) {
                deferred.resolve(formatContact(contact));
            });
        } else {
            deferred.reject("Bummer. No contacts in desktop browser");
        }
        return deferred.promise;
    };
    return {
        pickContact: pickContact
    };
}]).controller('ContactListCtrl', ['$scope', '$http', '$q', 'MyContact', 'InitContactsService', 'ContactsService',
    function ($scope, $http, $q, MyContact, InitContactsService, ContactsService) {

        $scope.showContent = function ($fileContent) {
            //$scope.Contacts = Contact.update([ ]);
            $scope.content = $fileContent;

            ASYNCH("runQuery", [$scope.content], function (resp) {
                $scope.mycontacts = MyContact.update(JSON.parse(resp));
                console.log($scope.mycontacts);
            });


        }
        $scope.fromContacts = function (src) {
            return src.substring(0, 9) === "content:/";
        }
        $scope.pickContact = function () {
            ContactsService.pickContact().then(
                function (contact) {
                    //$scope.mycontacts.push(contact);
                    $scope.mycontacts = MyContact.add(contact);
                    console.log("Selected contacts=" + JSON.stringify(contact));
                    console.log(contact.image);
                },
                function (failure) {
                    console.log("Bummer. Failed to pick a contact");
                }
            );
        };

        if (MyContact.empty()==true){
            console.log("here!");
            InitContactsService.callWebWorker().then(
                function (workerReply) {
                    $scope.mycontacts = MyContact.update(JSON.parse(workerReply));
                });
        }else
            $scope.mycontacts=MyContact.getContacts();

        //$scope.Contacts = Contact.fetch();
    }]).controller('ContactDetailCtrl', function ($scope, $window, $stateParams, MyContact) {
    $scope.openUrl = function (url){
        $window.open(url, '_system', 'location=yes' );
        return false;
    }
    $scope.fromContacts = function (src) {
        return src.substring(0, 9) === "content:/";
    }

    $scope.contact = MyContact.get({contactId: $stateParams.contactId});
})
    .controller('DashCtrl', function ($scope) {
    })

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })
    .controller('AccountCtrl', function ($scope) {
    });