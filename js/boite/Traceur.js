/*
 * BoiteTraceur.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant d'afficher les infos du traceur.
*
* @class BoiteTraceur
* @constructor
* @extends Boite
*/
class BoiteTraceur extends Boite
{
    constructor()
    {
        super("o_boiteTraceur", "Données du traceur " + Utils.serveur, `<div id='o_tabsTraceur' class='o_tabs'><ul><li><a href='#o_tabsTraceur1'>Joueur</a></li><li><a href='#o_tabsTraceur2'>Alliance</a></li></ul><div id='o_tabsTraceur1'/><div id='o_tabsTraceur2'/>`);
        /**
        *
        */
        this._traceurJoueur = new TraceurJoueur();
        /**
        *
        */
        this._traceurAlliance = new TraceurAlliance();
    }
	/**
    * Affiche la boite.
    *
    * @private
    * @method afficher
    */
	afficher()
	{
        if(super.afficher()){
            let chargeAlliance = false;
            $("#o_tabsTraceur").tabs({
                activate : (e, ui) => {
                    if(!chargeAlliance && ui.newTab.index() == 1){
                        chargeAlliance = true;
                        this._traceurAlliance.afficher("#o_tabsTraceur2");
                    }
                    this.css();
                },
            }).removeClass("ui-widget");
            this._traceurJoueur.afficher("#o_tabsTraceur1");
            this.css().event();
        }
        return this;
	}
	/**
	* Applique le style propre à la boite.
    *
	* @private
	* @method css
	*/
	css()
	{
        super.css();
        $(".o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", monProfil.parametre["couleur2"].valeur);
        $(".o_content a").unbind("mouseenter mouseleave").css("color", monProfil.parametre["couleurTexte"].valeur);
        let matches = monProfil.parametre["couleurTexte"].valeur.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i);
        $(".o_content li:not(.ui-state-active) a").css("color", "inherit").hover(
            (e) => {$(e.currentTarget).css("color", "rgba(" + matches.slice(1).map((m) => {return parseInt(m, 16);}).concat('0.5') + ")");},
            (e) => {$(e.currentTarget).css("color", "inherit");}
        );
        return this;
    }
	/**
	* Ajoute les evenements propres à la boite.
    *
	* @private
	* @method event
	*/
	event()
	{
        super.event();
        return this;
	}
}
