/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from page1.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Page1.
 * @suppress {missingRequire}
 * @public
 */

goog.module('Page1.incrementaldom');

/** @suppress {extraRequire} */
goog.require('goog.asserts');
/** @suppress {extraRequire} */
goog.require('goog.i18n.bidi');
/** @suppress {extraRequire} */
goog.require('goog.string');
/** @suppress {extraRequire} */
var soy = goog.require('soy');
/** @suppress {extraRequire} */
var soydata = goog.require('soydata');
var IncrementalDom = goog.require('incrementaldom');
var ie_open = IncrementalDom.elementOpen;
var ie_close = IncrementalDom.elementClose;
var ie_void = IncrementalDom.elementVoid;
var ie_open_start = IncrementalDom.elementOpenStart;
var ie_open_end = IncrementalDom.elementOpenEnd;
var itext = IncrementalDom.text;
var iattr = IncrementalDom.attr;
var soyIdom = goog.require('soy.idom');
var dyn = soyIdom.renderDynamicContent;
var print = soyIdom.print;


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $render(opt_data, opt_ignored, opt_ijData) {
  ie_open('div');
    ie_open('h1');
      itext('Hello ');
      print(opt_data.attr);
      itext('!');
    ie_close('h1');
    ie_open_start('a');
        iattr('href', '/page2');
    ie_open_end();
      itext('Navigate');
    ie_close('a');
  ie_close('div');
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
