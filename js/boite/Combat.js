/*
 * BoiteCombat.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant d'analyser simuler et lancer des attaques.
*
* @class BoiteCombat
* @constructor
* @extends Boite
*/
class BoiteCombat extends Boite
{
    constructor()
    {
        super("o_boiteCombat", "Outils d'Attaque", `<div id='o_tabsCombat' class='o_tabs'><ul><li><a href='#o_tabsCombat1'>Analyser</a></li><li><a href='#o_tabsCombat2'>Simuler</a></li><li><a href='#o_tabsCombat3'>Multi-flood</a></li><li><a href='#o_tabsCombat4'>Calculatrice</a></li></ul><div id='o_tabsCombat1'/><div id='o_tabsCombat2'/><div id='o_tabsCombat3'/><div id='o_tabsCombat4'/></div>`);
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
            $("#o_tabsCombat").tabs({disabled: [1, 2, 3], activate : (event ,ui) => {this.css();}}).removeClass("ui-widget");
            this.analyse().css().event();
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
        $("#o_resultatCombat tr:even, .o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", monProfil.parametre["couleur2"].valeur);
        $(".o_content a").css("color", monProfil.parametre["couleurTexte"].valeur);
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
		$("#o_addTemps").click(() => {
			let temps1 = moment.duration($("#o_tempsH1").spinner("value") * 3600 + $("#o_tempsM1").spinner("value") * 60 + $("#o_tempsS1").spinner("value"), 's');
			let temps2 = moment.duration($("#o_tempsH2").spinner("value") * 3600 + $("#o_tempsM2").spinner("value") * 60 + $("#o_tempsS2").spinner("value"), 's');
			let res = temps1.add(temps2);
			$("#o_resultTemps").text(res.hours() + "H " + res.minutes() + "m " + res.seconds() + "s");
		});
		$("#o_subTemps").click(() => {
			let temps1 = moment.duration($("#o_tempsH1").spinner("value") * 3600 + $("#o_tempsM1").spinner("value") * 60 + $("#o_tempsS1").spinner("value"), 's');
			let temps2 = moment.duration($("#o_tempsH2").spinner("value") * 3600 + $("#o_tempsM2").spinner("value") * 60 + $("#o_tempsS2").spinner("value"), 's');
			let cpt = 0 ;
			while(temps1 < temps2){
				temps1.add(1, 'd');
				cpt++;
			}
			let res = temps1.subtract(temps2);
			$("#o_resultTemps").text(res.hours() + "H " + res.minutes() + "m " + res.seconds() + "s");
		});
        return this;
	}
    /**
	* Formulaire pour analyser une rapport de combat.
    *
	* @private
	* @method analyse
	*/
	analyse()
	{
		$("#o_tabsCombat1").append("<textarea id='o_rcCombat' class='o_maxWidth' placeholder='Rapport de combat...'></textarea><div class='o_marginT15' style='max-height:200px;overflow:auto'><table id='o_resultatCombat' class='o_maxWidth'></table></div>");

        $("#o_rcCombat").on("input", (e) => {
			let combat = new Combat(0, 0, e.currentTarget.value);
			if(combat.analyse()){
                $("#o_resultatCombat").html(combat.toHTMLBoite());
                this.css();
            }else
                $.toast({...TOAST_WARNING, text : "Le rapport de combat ne peut pas être analysé."});
		});
        return this;
    }
	/**
	* Affiche une calculatrice pour calculer les temps de trajets, les horraires.
    *
	* @private
	* @method calculatrice
	*/
	calculatrice()
	{
		let html = "<table id='o_calculatriceCombat' class='centre'>"
			+ "<tr><th>Calculatrice Temps</th></tr>"
			+ "<tr><td><input id='o_tempsH1' value='0' size='6' name='o_tempsH1'/> H <input id='o_tempsM1' value='0' size='6' name='o_tempsM1'/> m <input id='o_tempsS1' value='0' size='6' name='o_tempsS1'/> s</td></tr>"
			+ "<tr><td><input id='o_tempsH2' value='0' size='6' name='o_tempsH2'/> H <input id='o_tempsM2' value='0' size='6' name='o_tempsM2'/> m <input id='o_tempsS2' value='0' size='6' name='o_tempsS2'/> s</td></tr>"
			+ "<tr><td><button id='o_addTemps'>+</button><button id='o_subTemps'>-</button><button id='o_resetTemps'>Reset</button></td></tr>"
			+ "<tr><td id='o_resultTemps' class='gras' colspan='2'></td></tr>"
			+ "</table><table id='o_calculatriceVA' class='centre'>"
			+ "<tr><th colspan='2'>Calculatrice VA</th></tr>"
			+ "<tr><td><input type='text' id='o_joueur1VA' placeholder='Joueur 1'/></td><td>X <input id='o_x1VA' value='0' size='4'/> et Y <input id='o_y1VA' value='0' size='4'/></td></tr>"
			+ "<tr><td><input type='text' id='o_joueur2VA' placeholder='Joueur 2'/></td><td>X <input id='o_x2VA' value='0' size='4'/> et Y <input id='o_y2VA' value='0' size='4'/></td></tr>"
			+ "<tr><td>VA</td><td><input id='o_calculVA' value='0' size='6'/></td></tr>"
			+ "<tr><td id='o_resultVA' colspan='2' class='gras'></td></tr>"
			+ "</table>";
		$("#o_tabsCombat4").append(html);
		// Formatage des spinners
		$("input[name^='o_temps']").spinner({min : 0, numberFormat: "d2"});
		$("#o_calculVA").spinner({min : 0, max : 40, numberFormat: "i"});
		$("#o_x1VA, #o_x2VA").spinner({min : 0, max : 50, numberFormat: "i"});
		$("#o_y1VA, #o_y2VA").spinner({min : 0, max : 4000, numberFormat: "i"});
        return this;
	}
}
