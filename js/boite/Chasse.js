/*
 * BoiteChasse.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant d'analyser simuler et lancer des chasses.
*
* @class BoiteChasse
* @constructor
* @extends Boite
*/
class BoiteChasse extends Boite
{
    constructor()
    {
        super("o_boiteChasse", "Outils pour Chasseur", `<div id='o_tabsChasse' class='o_tabs'><ul><li><a href='#o_tabsChasse1'>Analyser</a></li><li><a href='#o_tabsChasse2'>Simuler</a></li></ul><div id='o_tabsChasse1'/><div id='o_tabsChasse2'/></div>`);
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
            $("#o_tabsChasse").tabs({disabled: [1], activate : (event ,ui) => {this.css();}}).removeClass("ui-widget");
            this.analyse().css().event();
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
        $("#o_resultatChasse tr:even, .o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", monProfil.parametre["couleur2"].valeur);
        $(".o_content a").css("color", monProfil.parametre["couleurTexte"].valeur);
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
        return this;
    }
	/**
	* Formulaire pour analyser une ou plusieurs chasse(s).
    *
	* @private
	* @method analyse
	*/
	analyse()
	{
		$("#o_tabsChasse1").append("<textarea id='o_rcChasse' class='o_maxWidth' placeholder='Rapport(s) de chasse(s)...'></textarea><div class='o_marginT15'><table  id='o_resultatChasse' class='o_maxWidth'></table></div>");

        $("#o_rcChasse").on("input", (e) => {
            // on recup les chasses à analyser
			let chasses = e.currentTarget.value.split("nourriture"), bilan = new Chasse(""), chasse = null, erreur = false, html = "<tr class='gras'><td colspan='2'>Avant</td><td colspan='2'>Evolution</td><td colspan='2'>Résultat</td></tr>";
            // on nettoie l'ancien affichage
            $("#o_resultatChasse").html("");
            for(let i = 0 ; i < chasses.length ; i++){
                if(chasses[i]){
                    chasse = new Chasse(chasses[i]);
                    if(chasse.analyse()){
                        html += chasse.toHTMLBoite(false);
                        bilan.ajoute(chasse);
                    }else{
                        $.toast({...TOAST_WARNING, text : "Le rapport de chasse ne peut pas être analysé."});
                        erreur = true;
                    }
                }
            }
            if(!erreur){
                $("#o_resultatChasse").append(html);
                this.afficherBilan(bilan);
            }
		});
        return this;
    }
	/**
	* Affiche les données issue d'un rapport de chasse.
    *
	* @private
	* @method afficherAnalyse
	* @param {Object} chasse
	* @param {Boolean} bilan
	*/
	afficherBilan(chasse)
	{
        let i = 0, html = "<tr><td colspan='6'><select id='o_choixChasse' class='o_marginT15'>";
        for( ; i < Math.floor($("#o_resultatChasse tr").length / 4) ; html += "<option value='" + i + "'>Chasse " + (i+1) + "</option>", i++);
        html += "<option value='" + i + "' selected>Bilan</option></select></td></tr>";
        $("#o_resultatChasse").append(chasse.toHTMLBoite(true) + html);
		// Style
		$("#o_resultatChasse tr:even").css("background-color", monProfil.parametre["couleur2"].valeur);
		$("#o_choixChasse").change((e) => {
			let selection = e.currentTarget.value;
			$("#o_resultatChasse tr:gt(0):lt(-1):visible").toggle();
			$("#o_resultatChasse tr:eq(" + ((selection * 4) + 1) + "), #o_resultatChasse tr:eq(" + ((selection * 4) + 2) + "), #o_resultatChasse tr:eq(" + ((selection * 4) + 3) + "), #o_resultatChasse tr:eq(" + ((selection * 4) + 4) + ")").toggle();
		});
	}

}
