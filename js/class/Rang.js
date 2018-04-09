/*
 * Rang.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant de gérer un rang.
*
* @class Rang
* @constructor
*/
class Rang
{
    constructor(libelle, ordre = 0)
    {
        /**
        *
        */
        this._libelle = libelle;
        /**
        *
        */
        this._ordre = ordre;
    }
    /**
    *
    */
    get libelle()
    {
        return this._libelle;
    }
    /**
    *
    */
    set libelle(newLibelle)
    {
        this._libelle = newLibelle;
    }
    /**
    *
    */
    get ordre()
    {
        return this._ordre;
    }
    /**
    *
    */
    set ordre(newOrdre)
    {
        this._ordre = newOrdre;
    }
    /**
    *
    */
    toJSON()
    {
        return {libelle : this._libelle, ordre : this._ordre};
    }
    /**
    *
    */
    equals(pRang)
    {
        return pRang.libelle == this._libelle;
    }
}
