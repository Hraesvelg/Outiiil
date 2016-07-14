/*
 * BoiteCombat.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
 
/**
* Classe permettant d'analyser simuler et lancer des attaques.
* 
* @class BoiteCombat
* @constructor
* @extends Boite
*/
var BoiteCombat = Boite.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		this.html = "<div id='o_tabs_combat' class='o_tabs'>"
			+ "<ul><li><a href='#o_tabsCombat1'>Analyser</a></li><li><a href='#o_tabsCombat2'>Simuler</a></li><li><a href='#o_tabsCombat3'>Multi-flood</a></li><li><a href='#o_tabsCombat4'>Calculatrice</a></li></ul>"
			// Boite d'analyse
			+ "<div id='o_tabsCombat1'></div>"
			// Boite de simulation
			+ "<div id='o_tabsCombat2'>" + (Utils.comptePlus ? "<p class='o_messNonC'>Cette section est en cours de développement.</p>" : "<p class='o_messNonC'>Vous devez disposez du <a href='/comptePlus.php'>Compte+</a> pour simuler des combats.</p>") + "</div>"
			// Boite MF
			+ "<div id='o_tabsCombat3'>" + (Utils.comptePlus ? "<p class='o_messNonC'>Cette section est en cours de développement.</p>" : "<p class='o_messNonC'>Vous devez disposez du <a href='/comptePlus.php'>Compte+</a> pour simuler des combats.</p>") + "</div>"
			// Boite Calculatrice temps
			+ "<div id='o_tabsCombat4'></div>"
			+ "</div>";
		$("#o_boiteCombat").append(this.html);
		$("#o_tabs_combat").tabs();
		$("#o_tabs_combat").removeClass("ui-widget");
		this.analyse();
		//this.calculatrice();
		
		this.css();
		this.event();
	},
	/**
	* Applique le style propre à la boite.
    *
	* @private
	* @method css
	* @return 
	*/
	css : function()
	{
		$(".o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", Utils.data.couleur2);
		$(".o_tabs > .ui-widget-header").css("border-bottom-color", Utils.data.couleur2);
		$("#o_calculatriceCombat tr:even, #o_calculatriceVA tr:even").css("background-color", Utils.data.couleur2); 
	},
	/**
	* Ajoute les evenements propres à la boite.
    *
	* @private
	* @method event
	* @return
	*/
	event : function()
	{
		$("#o_analyseCombat").click(function(){
			var combat = new Combat();
			combat.analyse($("#o_rcCombat").val());
			boiteCombat.afficherAnalyse(combat);
		});
		$("#o_addTemps").click(function(){
			var temps1 = moment.duration($("#o_tempsH1").spinner("value") * 3600 + $("#o_tempsM1").spinner("value") * 60 + $("#o_tempsS1").spinner("value"), 's');
			var temps2 = moment.duration($("#o_tempsH2").spinner("value") * 3600 + $("#o_tempsM2").spinner("value") * 60 + $("#o_tempsS2").spinner("value"), 's');
			var res = temps1.add(temps2);
			$("#o_resultTemps").text(res.hours() + "H " + res.minutes() + "m " + res.seconds() + "s");
		});
		$("#o_subTemps").click(function(){
			var temps1 = moment.duration($("#o_tempsH1").spinner("value") * 3600 + $("#o_tempsM1").spinner("value") * 60 + $("#o_tempsS1").spinner("value"), 's');
			var temps2 = moment.duration($("#o_tempsH2").spinner("value") * 3600 + $("#o_tempsM2").spinner("value") * 60 + $("#o_tempsS2").spinner("value"), 's');	
			var cpt = 0 ;
			while(temps1 < temps2){
				temps1.add(1, 'd');
				cpt++;
			}
			var res = temps1.subtract(temps2);
			$("#o_resultTemps").text(res.hours() + "H " + res.minutes() + "m " + res.seconds() + "s");
		});
		$("#o_resetTemps").click(function(){
			
		});
	},
    /**
	* Formulaire pour analyser une rapport de combat.
    *
	* @private
	* @method analyse
	* @return
	*/
	analyse : function()
	{
		$("#o_tabsCombat1").append("<textarea id='o_rcCombat' class='o_maxWidth' placeholder='Rapport de combat...'></textarea><input type='button' class='o_marginT15' id='o_analyseCombat' value='Analyser'/><div class='o_marginT15' style='max-height:200px;overflow:auto'><table id='o_resultatCombat' class='o_maxWidth'></table></div>");
	},
	/**
	* Affiche les données issue d'un rapport de combat.
    *
	* @private
	* @method afficherAnalyse
	* @param {Object} combat
	* @return
	*/
	afficherAnalyse : function(combat)
	{
		$("#o_resultatCombat").html("");
		var message = "<tr class='gras'><td></td><td style='width:38%'>Vous</td><td style='width:38%'>Ennemie</td></tr>"
			+ "<tr><td>Bouclier(/Lieu)</td><td>" + (combat.bonusVie1 ? combat.bonusVie1 : "N/A") + "</td><td>" + (combat.bonusVie2 ? combat.bonusVie2 : "N/A") + "</td></tr>"
			+ "<tr><td>Armes</td><td>" + combat.bonusAtt1 + "</td><td>" + combat.bonusAtt2 + "</td></tr>"
			+ "<tr><td></td><td colspan='2' class='gras'>Bilan unités</td></tr>";
		for(var i = 0 ; i < 14 ; i++){
			if(combat.armee1.unite[i] || combat.armee2.unite[i] || combat.armee1XP.unite[i]){
				var diff1 = combat.armee1XP.unite[i] - combat.armee1.unite[i];
				message += "<tr><td>" + Utils.nomU[i + 1] + "</td><td>" + numeral(combat.armee1XP.unite[i]).format() + " (" + (diff1 > 0 ? "+" : "") + numeral(diff1).format() + ")</td><td>" + numeral(combat.armee2Pe.unite[i]).format() + " (" + numeral(combat.armee2Pe.unite[i] - combat.armee2.unite[i]).format() + ")</td></tr>";
			}
		}
		message += "<tr><td></td><td colspan='2' class='gras'>Bilan Perte</td></tr>"
			+ "<tr><td><img width='35' class='o_vAlign' src='images/icone/icone_ouvriere.png' alt='nb_unite'/></td><td>" + numeral(combat.armee1Pe.getSommeUnite()).format() + " (" + numeral(combat.armee1Pe.getSommeUnite() - combat.armee1.getSommeUnite()).format() + ")</td><td>" + numeral(combat.armee2Pe.getSommeUnite()).format() + " (" + numeral(combat.armee2Pe.getSommeUnite() - combat.armee2.getSommeUnite()).format() + ")</td></tr>"
			+ "<tr><td><img height='18' class='o_vAlign' src='images/icone/icone_coeur.gif'/></td><td>" + numeral(combat.armee1Pe.getBaseVie()).format() + " (" + numeral(combat.armee1Pe.getBaseVie() - combat.armee1.getBaseVie()).format() + ")</td><td>" + numeral(combat.armee2Pe.getBaseVie()).format() + " (" + numeral(combat.armee2Pe.getBaseVie() - combat.armee2.getBaseVie()).format() + ")</td></tr>"
			+ "<tr><td><img height='18' class='o_vAlign' src='images/icone/icone_degat_attaque.gif'></td><td>" + numeral(combat.armee1Pe.getBaseAtt()).format() + " (" + numeral(combat.armee1Pe.getBaseAtt() - combat.armee1.getBaseAtt()).format() + ")</td><td>" + numeral(combat.armee2Pe.getBaseAtt()).format() + " (" + numeral(combat.armee2Pe.getBaseAtt() - combat.armee2.getBaseAtt()).format() + ")</td></tr>"
			+ "<tr><td><img height='18' class='o_vAlign' src='images/icone/icone_degat_defense.gif'/></td><td>" + numeral(combat.armee1Pe.getBaseDef()).format() + " (" + numeral(combat.armee1Pe.getBaseDef() - combat.armee1.getBaseDef()).format() + ")</td><td>" + numeral(combat.armee2Pe.getBaseDef()).format() + " (" + numeral(combat.armee2Pe.getBaseDef() - combat.armee2.getBaseDef()).format() + ")</td></tr>"
			+ "<tr><td><img width='18' class='o_vAlign' src='images/icone/horloge.png'/></td><td>" + Utils.intToTime(combat.armee1.getTemps(0) - combat.armee1Pe.getTemps(0)) + "</td><td>" + Utils.intToTime(combat.armee2.getTemps(0) - combat.armee2Pe.getTemps(0)) + "</td></tr>"
			+ "<tr><td>Temps HOF</td><td colspan='2'>" + Utils.intToTime((combat.armee1.getTemps(0) - combat.armee1Pe.getTemps(0)) + (combat.armee2.getTemps(0) - combat.armee2Pe.getTemps(0))) + "</td></tr>";	
		if(combat.armee1Pe.getBaseAtt() != combat.armee1XP.getBaseAtt()){
			var diff1 = combat.armee1XP.getBaseVie() - combat.armee1.getBaseVie();
			var diff2 = combat.armee1XP.getBaseAtt() - combat.armee1.getBaseAtt();
			var diff3 = combat.armee1XP.getBaseDef() - combat.armee1.getBaseDef();
			message += "<tr><td colspan='3' class='gras'>Bilan XP</td></tr>"
				+ "<tr><td colspan='3'><img height='18' class='o_vAlign' src='images/icone/icone_coeur.gif'/> " + (diff1 > 0 ? "+" : "") + numeral(diff1).format() + "</td></tr>"
				+ "<tr><td colspan='3'><img height='18' class='o_vAlign' src='images/icone/icone_degat_attaque.gif'> " + (diff2 > 0 ? "+" : "") + numeral(diff2).format() + "</td></tr>"
				+ "<tr><td colspan='3'><img height='18' class='o_vAlign' src='images/icone/icone_degat_defense.gif'/> " + (diff3 > 0 ? "+" : "") + numeral(diff3).format() + "</td></tr>";
		}
		$("#o_resultatCombat").html(message);
		// Style preferentiel
		$("#o_resultatCombat tr:even").css("background-color", Utils.data.couleur2); 
	},
	/**
	* Affiche une calculatrice pour calculer les temps de trajets, les horraires.
    *
	* @private
	* @method calculatrice
	* @return
	*/
	calculatrice : function()
	{
		var html = "<table id='o_calculatriceCombat' class='centre'>"
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
	}
});
