'use strict';

(function () {

    var mycontacts = [],


        findById = function (id) {
            var contact = null,
                l = mycontacts.length,
                i;
            for (i = 0; i < l; i = i + 1) {
                if (mycontacts[i].id === id) {
                    contact = mycontacts[i];
                    break;
                }
            }
            return contact;
        },

        findById2  = function (id) {
        console.log(id);
            var results = mycontacts.filter(function (contact) {
                return id === contact.id;
            });
            return results;
        };



    angular.module('myApp.memoryServices', [])
        .factory('MyContact', [
            function () {
                return {
                    empty: function () {
                        if (mycontacts.length == 0)
                            return true
                        else
                            return false
                    },
                    getContacts: function(){
                        return mycontacts;
                    },
                    add: function (contact) {
                        contact["id"] = mycontacts.length;
                        mycontacts.push(contact);
                        return mycontacts;
                    },
                    update: function (contact) {
                        mycontacts = contact
                        //console.log("hello!:"+mycontacts);;
                        return mycontacts;
                    },
                    get: function (contact) {
                        return findById(parseInt(contact.contactId));
                    }
                }

            }])
        .factory('Report', [
            function () {
                return {
                    query: function (contact) {
                        return findByManager(parseInt(contact.contactId));
                    }
                }

            }])
}());
