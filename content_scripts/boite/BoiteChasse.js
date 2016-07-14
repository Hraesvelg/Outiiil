/*
 * BoiteChasse.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe permettant d'analyser simuler et lancer des chasses.
* 
* @class BoiteChasse
* @constructor
* @extends Boite
*/
var BoiteChasse = Boite.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function () 
    {
		this.html = "<div id='o_tabsChasse' class='o_tabs'>"
			+ "<ul><li><a href='#o_tabsChasse1'>Analyser</a></li><li><a href='#o_tabsChasse2'>Simuler</a></li></ul>"
			// Boite d'analyse
			+ "<div id='o_tabsChasse1'></div>"
			// Boite de simulation
			+ "<div id='o_tabsChasse2'>" + (Utils.comptePlus ? "<p class='o_messNonC'>Cette section est en cours de développement.</p>" : "<p class='o_messNonC'>Vous devez disposez du <a href='/comptePlus.php'>Compte+</a> pour simuler vos chasses.</p>") + "</div>"
			+ "</div>";
		$("#o_boiteChasse").append(this.html);
		$("#o_tabsChasse").tabs();
		$("#o_tabsChasse").removeClass("ui-widget");
		// Ajout des outils
		this.analyse();
		
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
		$("#o_analyseChasse").click(function(){
			$("#o_resultatChasse").html("");
			var tmp = $("#o_rcChasse").val().split("nourriture");
			if(tmp.length == 2){
				var chasse = new Chasse();
				chasse.analyse(tmp[0]);
				boiteChasse.afficherAnalyse(chasse, false, true);
			}else{
				var bilan = new Chasse();
				for(var i = 0, l = tmp.length - 1 ; i < l ; i++){
					var chasse = new Chasse();
					chasse.analyse(tmp[i]);
					boiteChasse.afficherAnalyse(chasse, true, false);
					bilan.ajoute(chasse);
				}
				boiteChasse.afficherAnalyse(bilan, true, true);
			}
		});
	},
	/**
	* Formulaire pour analyser une ou plusieurs chasse(s).
    *
	* @private
	* @method analyse
	* @return
	*/
	analyse : function()
	{
		$("#o_tabsChasse1").append("<textarea id='o_rcChasse' class='o_maxWidth' placeholder='Rapport(s) de chasse(s)...'></textarea><br/><input type='button' id='o_analyseChasse' class='o_marginT15' value='Analyser'/><br/><div><table id='o_resultatChasse' class='o_marginT15 o_maxWidth'></table></div>");
	},
	/**
	* Affiche les données issue d'un rapport de chasse.
    *
	* @private
	* @method afficherAnalyse
	* @param {Object} chasse
	* @param {Boolean} cumul
	* @param {Boolean} bilan
	* @return
	*/
	afficherAnalyse : function(chasse, cumul, bilan)
	{
		if(!cumul) $("#o_resultatChasse").html("");
		var lignes = "";
		// Si le tableau est vide on ajoute l'en tête
		if(!$("#o_resultatChasse tr").length)
			lignes += "<tr class='gras'><td colspan='2'>Avant</td><td colspan='2'>Evolution</td><td colspan='2'>Résultat</td></tr>";
		// on ajoute les analyses de chasse mais on n'affiche que le bilan
		var diffNbr = chasse.armeeXP.getSommeUnite() - chasse.armee.getSommeUnite(), diffVie = chasse.armeeXP.getBaseVie() - chasse.armee.getBaseVie(), diffAtt = chasse.armeeXP.getBaseAtt() - chasse.armee.getBaseAtt(), diffDef = chasse.armeeXP.getBaseDef() - chasse.armee.getBaseDef();
		lignes += "<tr " + (bilan ? "" : "style='display:none'") + "><td><img height='20' src='images/icone/fourmi.png'/></td><td>" + numeral(chasse.armee.getSommeUnite()).format() + "</td><td><img height='20' src='images/icone/fourmi.png'/></td><td>" + numeral(diffNbr).format("+0,0") + " (" + numeral(diffNbr / chasse.armee.getSommeUnite()).format("+0.00%") + ")</td><td><img height='20' src='images/icone/fourmi.png'/></td><td>" + numeral(chasse.armeeXP.getSommeUnite()).format() + "</td></tr>"
			+ "<tr " + (bilan ? "" : "style='display:none'") + "><td><img height='20' src='images/icone/icone_coeur.gif'/></td><td>" + numeral(chasse.armee.getBaseVie()).format() + "</td><td><img height='20' src='images/icone/icone_coeur.gif'/></td><td>" + numeral(diffVie).format("+0,0") + " (" + numeral(diffVie / chasse.armee.getBaseVie()).format("+0.00%") + ")</td><td><img height='20' src='images/icone/icone_coeur.gif'/></td><td>" + numeral(chasse.armeeXP.getBaseVie()).format() + "</td></tr>"
			+ "<tr " + (bilan ? "" : "style='display:none'") + "><td><img height='20' src='images/icone/icone_degat_attaque.gif'/></td><td>" + numeral(chasse.armee.getBaseAtt()).format() + "</td><td><img height='20' src='images/icone/icone_degat_attaque.gif'/></td><td>" + numeral(diffAtt).format("+0,0") + " (" + numeral(diffAtt / chasse.armee.getBaseAtt()).format("+0.00%") + ")</td><td><img height='20' src='images/icone/icone_degat_attaque.gif'/></td><td>" + numeral(chasse.armeeXP.getBaseAtt()).format() + "</td></tr>" 
			+ "<tr " + (bilan ? "" : "style='display:none'") + "><td><img height='20' src='images/icone/icone_degat_defense.gif'/></td><td>" + numeral(chasse.armee.getBaseDef()).format() + "</td><td><img height='20' src='images/icone/icone_degat_defense.gif'/></td><td>" + numeral(diffDef).format("+0,0") + " (" + numeral(diffDef / chasse.armee.getBaseDef()).format("+0.00%") + ")</td><td><img height='20' src='images/icone/icone_degat_defense.gif'/></td><td>" + numeral(chasse.armeeXP.getBaseDef()).format() + "</td></tr>";
		if(cumul && bilan){
			lignes += "<tr><td colspan='6'><select id='o_choixChasse' class='o_marginT15'>";
			var i = 0, l = Math.floor($("#o_resultatChasse tr").length / 4);
			for( ; i < l ; lignes += "<option value='" + i + "'>Chasse " + (i+1) + "</option>", i++);
			lignes += "<option value='" + i + "' selected>Bilan</option></select></td></tr>";
		}
		$("#o_resultatChasse").append(lignes);
		// Style preferentiel
		$("#o_resultatChasse tr:even").css("background-color", Utils.data.couleur2); 
		$("#o_choixChasse").change(function(){
			var selection = $(this).val();
			$("#o_resultatChasse tr:gt(0):lt(-1):visible").toggle();
			$("#o_resultatChasse tr:eq(" + ((selection * 4) + 1) + "), #o_resultatChasse tr:eq(" + ((selection * 4) + 2) + "), #o_resultatChasse tr:eq(" + ((selection * 4) + 3) + "), #o_resultatChasse tr:eq(" + ((selection * 4) + 4) + ")").toggle();
		});
	}
}); 
