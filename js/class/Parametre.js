/*
 * Parametre.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant la gestion de parametre
*
* @class Page
*/
class Parametre
{
    constructor(id, libelle, type = "", valeur = "", valeurPossible = [])
    {
        /**
        * id du parametre
        */
        this._id = id;
        /**
        * nom du parametre
        */
        this._libelle = libelle;
        /**
        * type du parametre : input ou select
        */
        this._type = type;
        /**
        * valeur du parametre
        */
        this._valeur = valeur;
        /**
        * dans le cas d'un select les valeurs possibles
        */
        this._valeurPossible = valeurPossible;
    }
    /**
    *
    */
    destructor()
    {

    }
    /**
    *
    */
    get id()
    {
        return this._id;
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
    get type()
    {
        return this._type;
    }
    /**
    *
    */
    set type(newType)
    {
        this._type = newType;
    }
    /**
    *
    */
    get valeur()
    {
        return this._valeur;
    }
    /**
    *
    */
    set valeur(newValeur)
    {
        this._valeur = newValeur;
    }
    /**
    *
    */
    get valeurPossible()
    {
        return this._valeurPossible;
    }
    /**
    *
    */
    set valeurPossible(newPossible)
    {
        this._valeurPossible = newPossible;
    }
    /**
    * override JSON
    */
    toJSON()
    {
        return {id : this._id, libelle : this._libelle, type : this._type, valeur : this._valeur, valeurPossible : this._valeurPossible};
    }
    /**
    *
    */
    sauvegarde()
    {
        localStorage.setItem("outiiil_parametre", JSON.stringify(monProfil.parametre));
    }
    /**
    *
    */
    getForm()
    {
        let html = `<div class="group">`;
        switch(this._type){
            case "color" :
                html += `<input id="${this._id}" class="o_input" type="text" value="${this._valeur}" required/><input id="${this._id}Picker" class="o_inputColor" type="color" value="${this._valeur}"/>`;
                break;
            case "number" :
                html += `<input class="o_input" type="text" value="0" style="display:none;" required/><input id="${this._id}" value="${this._valeur}" />`;
                break;
            case "input" :
                html += `<input id="${this._id}" class="o_input" type="text" value="${this._valeur}" required/>`;
                break;
            case "select" :
                html += `<select id="${this._id}" class="o_input" required>`;
                this._valeurPossible.forEach((item, index, array) => {html += `<option value="${index}" ${index == this._valeur ? "selected" : ""}>${item}</option>`;});
                html += `</select>`;
                break;
            default :
                break;
        }
        html += `<span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>${this._libelle}</label></div>`;
        return html;
    }
    /**
    *
    */
    ajouteEvent()
    {
        switch(this._type){
            case "number" :
                $("#" + this._id).spinner({
                    min : 0,
                    classes : {"ui-spinner" : "o_number ui-corner-all"},
                    numberFormat: "i",
                    stop : (event, ui) => {
                        this._valeur = numeral(event.target.value).value();
                        this.sauvegarde();
                    }
                });
                $("#" + this._id).on("input", (e, ui) => {
                    this._valeur = numeral(e.currentTarget.value).value();
                    $(e.currentTarget).spinner("value", this._valeur);
                    this.sauvegarde();
                });
                break;
            case "color" :
                $("#" + this._id).on("input", (e) => {
                    this._valeur = e.currentTarget.value.padEnd(7, "0");
                    $("#" + this._id + "Picker").val(this._valeur);
                    this.sauvegarde();
                });
                $("#" + this._id + "Picker").on("change", (e) => {
                    this._valeur = e.currentTarget.value;
                    $("#" + this._id).val(this._valeur);
                    this.sauvegarde();
                });
                break;
            default :
                $("#" + this._id).on("input", (e) => {
                    this._valeur = e.currentTarget.value;
                    this.sauvegarde();
                });
                break;
        }
        return this;
    }
}
