'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise () {
	this._state = "pending";
	this._value;
	this._handlerGroups = [];
	//this._queue = [];


	}

$Promise.prototype.then =function(success, error) {
		var successCb;
		var errorCb; 
		
		if(typeof success === 'function') {
			 successCb = success;
		} else {
			 successCb = false;
		}

		if(typeof error === 'function') {
			 errorCb = error;
		} else {
			 errorCb = false;
		}

		this._handlerGroups.push({"successCb": successCb, "errorCb": errorCb})
		var item = this._handlerGroups.length-1;
		this.callHandlers(item)
		console.log("handler groups", this._handlerGroups);
}


$Promise.prototype.callHandlers = function(item) {
		if(this._state === "resolved") {
			this._handlerGroups[item].successCb(this._value)	
		}

		//if not resolved, wait to be resolved, then invoke. 
		//

		//  else {
		// // 	this._handlerGroups[item].errorCb;	
		// // }
   		
}

function Deferral() {
	this.$promise = new $Promise();
}
Deferral.prototype.resolve = function(value) {
	//check state and if pending, resolve it and send value
	if (this.$promise._state === "pending") {
		this.$promise._state = "resolved";
		this.$promise._value = value;

		if(this.$promise._handlerGroups.length) {
			// var item = this.$promise._handlerGroups.le;
			this.$promise._handlerGroups.forEach((obj) => {
				obj.successCb(this.$promise._value)
			})
		}
		
	}
}

function defer() {
	return new Deferral();
}


Deferral.prototype.reject = function(reason) {
	//check state and if pending, resolve it and send value
	if (this.$promise._state === "pending") {
		this.$promise._state = "rejected";
		this.$promise._value = reason;
	}
}



/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
