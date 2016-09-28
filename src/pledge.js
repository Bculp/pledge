'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise () {
	this._state = "pending";
	this._value;
	this._handlerGroups = [];

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
		var downstream = new Deferral();
		var group = {"successCb": successCb, "errorCb": errorCb, "downstream": downstream};
		this._handlerGroups.push(group);
		// console.log(this._handlerGroups);	
		var item = this._handlerGroups.length-1;
		this.callHandlers(item)

		return this._handlerGroups[item].downstream.$promise;
}

$Promise.prototype.catch = function(errorFn) {
	return this.then(null, errorFn);
}


$Promise.prototype.callHandlers = function(item) {
	//for group in handlerGroup
	/*
		promiseB = group.defer
		this = promiseA
		if this.state=resolved then promiseB.resolve(this.value)
		or promiseB.reject(this.value)
	*/
		if(this._state === "resolved") {
			this._handlerGroups[item].successCb(this._value);	
		}
		 else if (this._state === "rejected"){
			if (this._handlerGroups[item].errorCb) {
				this._handlerGroups[item].errorCb(this._value);	
			}
		}
		
			//this._handlerGroups[item].errorCb();
		
   		
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
			console.log("handler groups in resolve: " , this.$promise._handlerGroups)
			this.$promise._handlerGroups.forEach((obj) => {
				obj.successCb(this.$promise._value)
			})
		}
		
	}
	this.$promise._handlerGroups = [];
}

function defer() {
	return new Deferral();
}


Deferral.prototype.reject = function(reason) {
	//check state and if pending, resolve it and send value
	if (this.$promise._state === "pending") {
		this.$promise._state = "rejected";
		this.$promise._value = reason;
	
		if(this.$promise._handlerGroups.length) {
				this.$promise._handlerGroups.forEach((obj) => {
					obj.errorCb(this.$promise._value)
				})
			}
	}
	this.$promise._handlerGroups = [];
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
