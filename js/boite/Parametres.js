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
        super("o_boiteParametre", "Paramètres", `<div id='o_tabsParametre' class='o_tabs'><ul><li><a href='#o_tabsParametre1'>Général</a></li><li><a href='#o_tabsParametre2'>Utilitaire</a></li><li><a href='#o_tabsParametre3'>Apparence</a></li><li><a href='#o_tabsParametre4'>Traceur</a></li></ul><div id='o_tabsParametre1'/><div id='o_tabsParametre2'/><div id='o_tabsParametre3'/><div id='o_tabsParametre4'/></div>`);
        /**
        *
        */
        this._paramStyle = ["couleurTitre", "couleur1", "couleur2", "couleur3", "couleurTexte", "dockPosition", "dockVisible", "boiteShow", "boiteHide"];
        /**
        *
        */
        this._paramUtilitaire = ["forumCommande", "forumMembre"];
        /**
        *
        */
        this._paramGeneral = ["affectationRessource", "methodeFlood", "uniteAntisondeTerrain", "uniteAntisondeDome", "uniteSonde"];
        /**
        *
        */
        this._paramTraceur = ["etatTraceurJoueur", "intervalleTraceurJoueur", "nbPageTraceurJoueur", "etatTraceurAlliance", "intervalleTraceurAlliance"];
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
            $("#o_tabsParametre").tabs({activate : (e, ui) => {this.css();}}).removeClass("ui-widget");
            if(!monProfil.parametre["cleTraceur"].valeur) $("#o_tabsParametre").tabs("disable", 3);
            this.parametreStyle().parametreUtilitaire().parametreGeneral().parametreTraceur().css().event();
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
        $(".o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", monProfil.parametre["couleur2"].valeur);
        $(".o_content a").unbind("mouseenter mouseleave").css("color", monProfil.parametre["couleurTexte"].valeur);
        $(".o_content li:not(.ui-state-active) a").css("color", "inherit")
        let matches = monProfil.parametre["couleurTexte"].valeur.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i);
        $(".o_content li:not(.ui-state-active):not(.ui-state-disabled) a").hover(
            (e) => {$(e.currentTarget).css("color", "rgba(" + matches.slice(1).map((m) => {return parseInt(m, 16);}).concat('0.5') + ")");},
            (e) => {$(e.currentTarget).css("color", "inherit");}
        );
        $(".o_content .ui-state-disabled a").css({cursor : "not-allowed", "pointer-events" : "all"});
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
        for(let param of this._paramStyle) monProfil.parametre[param].ajouterEvent();
        for(let param of this._paramUtilitaire) monProfil.parametre[param].ajouterEvent();
        for(let param of this._paramGeneral) monProfil.parametre[param].ajouterEvent();
        for(let param of this._paramTraceur) monProfil.parametre[param].ajouterEvent();
        return this;
	}
    /**
    *
    */
    parametreStyle()
    {
        let content = ``;
        for(let param of this._paramStyle) content += monProfil.parametre[param].getForm();
        $("#o_tabsParametre3").append(`<form>${content}</form>`);
        return this;
    }
    /**
    *
    */
    parametreUtilitaire()
    {
        let content = ``;
        for(let param of this._paramUtilitaire) content += monProfil.parametre[param].getForm();
        $("#o_tabsParametre2").append(`<p class='left reduce gras'>Saisissez les identifiants des sujets de votre utilitaire</p><form>${content}</form>`);
        return this;
    }
    /**
    *
    */
    parametreGeneral()
    {
        $("#o_tabsParametre1").append(`<form>
            <p class='left reduce gras'>L'affectation sera automatique lors de la consultation de la page ressource</p>
            ${monProfil.parametre[this._paramGeneral[0]].getForm()}
            <p class='left reduce gras'>La méthode sera sélectionnée par défaut dans le lanceur de flood</p>
            ${monProfil.parametre[this._paramGeneral[1]].getForm()}
            <p class='left reduce gras'>Indiquez le nombre d'unité selon l'objectif</p>
            <p class='left small'><em>Le nombre est choisi aléatoirement entre 90% du max et le max.</em></p>
            ${monProfil.parametre[this._paramGeneral[2]].getForm() + monProfil.parametre[this._paramGeneral[3]].getForm() + monProfil.parametre[this._paramGeneral[4]].getForm()}
        </form>`);
        return this;
    }
    /**
    *
    */
    parametreTraceur()
    {
        $("#o_tabsParametre4").append(`<form>
            <p class='left reduce gras'>Paramètres pour le traçage des joueurs</p>
            ${monProfil.parametre[this._paramTraceur[0]].getForm() + monProfil.parametre[this._paramTraceur[1]].getForm() + monProfil.parametre[this._paramTraceur[2]].getForm()}
            <p class='left reduce gras'>Paramètres pour le traçage des alliances</p>
            ${monProfil.parametre[this._paramTraceur[3]].getForm() + monProfil.parametre[this._paramTraceur[4]].getForm()}
        </form>`);
        return this;
    }
}
