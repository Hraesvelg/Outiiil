/*
 * Class.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

//usr/local/bin/php.TEST.5

/**
 * Classe permettant de créer des classes proprement.
 * Cette classe permet l'heritage entre classe.
 *
 * @class Class
 * @constructor
 */
var Class = function () {
    this.initialize && this.initialize.apply(this, arguments);
};
Class.extend = function (childPrototype) {
    var parent = this;
    var child = function () {
        return parent.apply(this, arguments);
    };
    child.extend = parent.extend;
    var Surrogate = function () {};
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    for (var key in childPrototype)
        child.prototype[key] = childPrototype[key];
    return child;
};