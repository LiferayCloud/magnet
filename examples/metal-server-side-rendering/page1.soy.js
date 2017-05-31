/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';

var templates;
goog.loadModule(function(exports) {
var soy = goog.require('soy');
var soydata = goog.require('soydata');
// This file was automatically generated from page1.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Page1.
 * @public
 */

goog.module('Page1.incrementaldom');

var incrementalDom = goog.require('incrementaldom');
var soyIdom = goog.require('soy.idom');


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {void}
 * @suppress {checkTypes}
 */
function $render(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  incrementalDom.elementOpen('div');
    incrementalDom.elementOpen('h1');
      incrementalDom.text('Hello ');
      soyIdom.print(opt_data.attr);
      incrementalDom.text('!');
    incrementalDom.elementClose('h1');
    incrementalDom.elementOpenStart('a');
        incrementalDom.attr('href', '/page2');
    incrementalDom.elementOpenEnd();
      incrementalDom.text('Navigate');
    incrementalDom.elementClose('a');
  incrementalDom.elementClose('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'Page1.render';
}

exports.render.params = ["attr"];
exports.render.types = {"attr":"any"};
templates = exports;
return exports;

});

class Page1 extends Component {}
Soy.register(Page1, templates);
export { Page1, templates };
export default templates;
/* jshint ignore:end */
