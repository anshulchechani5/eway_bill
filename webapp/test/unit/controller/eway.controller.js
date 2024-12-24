/*global QUnit*/

sap.ui.define([
	"yeway_bill/yeway_bill/controller/eway.controller"
], function (Controller) {
	"use strict";

	QUnit.module("eway Controller");

	QUnit.test("I should test the eway controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
