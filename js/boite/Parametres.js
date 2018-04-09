/*
 * BoiteParametre.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant de choisir ses préférences.
*
* @class BoiteParametre
* @constructor
* @extends Boite
*/
class BoiteParametre extends Boite
{
    /**
    *
    */
    constructor()
    {
        super("o_boiteParametre", "Paramètres", `<div id='o_tabsParametre' class='o_tabs'><ul><li><a href='#o_tabsParametre1'>Style</a></li><li><a href='#o_tabsParametre2'>Utilitaire</a></li><li><a href='#o_tabsParametre3'>Armée</a></li></ul><div id='o_tabsParametre1'/><div id='o_tabsParametre2'/><div id='o_tabsParametre3'/></div>`);
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
            $("#" + this._id).draggable("option", "cancel", "#o_tabsParametre1, #o_tabsParametre2, form");
            $("#o_tabsParametre").tabs({activate : (event ,ui) => {this.css();}}).addClass("o_tabs_vertical").removeClass("ui-widget");
            this.parametreStyle().parametreUtilitaire().parametreArmee().css().event();
        }
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
        let matches = monProfil.parametre["couleurTexte"].valeur.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i);
        $(".o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", monProfil.parametre["couleur2"].valeur);
        $(".o_content a").css("color", monProfil.parametre["couleurTexte"].valeur);
        $(".o_content li:not(.ui-state-active) a").hover(
            (e) => {$(e.currentTarget).css("color", "rgba(" + matches.slice(1).map((m) => {return parseInt(m, 16);}).concat('0.5') + ")")},
            (e) => {$(e.currentTarget).css("color", "inherit")}
        );
        $(".o_content li:not(.ui-state-active) a").css("color", "inherit");
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
    /**
    *
    */
    parametreStyle()
    {
        let content = ``, paramStyle = ["couleurTitre", "couleur1", "couleur2", "couleur3", "couleurTexte", "toolbarPosition", "toolbarVisible", "boiteShow", "boiteHide"];
        for(let param of paramStyle) content += monProfil.parametre[param].getForm();
        $("#o_tabsParametre1").append(`<form>${content}</form>`);
        for(let param of paramStyle) monProfil.parametre[param].ajouteEvent();
        return this;
    }
    /**
    *
    */
    parametreUtilitaire()
    {
        let content = ``, paramUtilitaire = ["sujetMembre", "sujetConvoi", "sujetCommande", "forumAlliance"];
        for(let param of paramUtilitaire) content += monProfil.parametre[param].getForm();
        $("#o_tabsParametre2").append(`<p class='left reduce gras'>Saisissez les identifiants des sujets de votre utilitaire</p><form>${content}</form>`);
        for(let param of paramUtilitaire) monProfil.parametre[param].ajouteEvent();
        return this;
    }
    /**
    *
    */
    parametreArmee()
    {
        let paramArmee = ["methodeFlood", "uniteAntisonde", "uniteSonde"];
        $("#o_tabsParametre3").append(`<form>
            <p class='left reduce gras'>La méthode sera sélectionnée par défaut dans le lanceur de flood</p>
            ${monProfil.parametre[paramArmee[0]].getForm()}
            <p class='left reduce gras'>Indiquez le nombre d'unité selon l'objectif</p>
            ${monProfil.parametre[paramArmee[1]].getForm() + monProfil.parametre[paramArmee[2]].getForm()}
        </form>`);
        for(let param of paramArmee) monProfil.parametre[param].ajouteEvent();
        return this;
    }
}
