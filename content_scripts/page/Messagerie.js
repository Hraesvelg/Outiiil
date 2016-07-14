/*
 * Messagerie.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe de fonction pour la page /messagerie.php.
* 
* @class PageMessagerie
* @constructor
* @extends Page
*/
var PageMessagerie = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		var rp = 0, messagesAnalyse = {};
		// Listener pour l'ouverture des rapports de combat ou de chasse.
		$("#corps_messagerie").on("DOMNodeInserted", function(e){
			// Si on ouvre le message pour la première fois
			if($(e.target).hasClass("contenu_conversation")){
				// Si on est sur des rapports des chasses
				var titreMess = $(e.target).prev().prev().find(".td_objet").text();
				
				if(titreMess.indexOf("Vos chasseuses ont conquis") != -1){
					// bilan
					var bilan = new Chasse();
					var listeMessages = [];
					// Pour tout les rapports
					$(e.target).find(".message").each(function(index){
						var chasse = new Chasse();
						chasse.analyse($(this).text());
						$(this).append("<p><span class='gras cursor show_info_" + rp + "'>+</span></p>" + page.afficherChasse(chasse));
						$(".show_info_" + rp++).click(function(){
							if($(this).text() == "+")
								$(this).text("-");
							else
								$(this).text("+");
							$(this).parent().next().toggle("blind", 400);
						});
						bilan.ajoute(chasse);
						listeMessages.push($(this).parent().attr("id"));
					});
					// Affichage du bilan
					$(e.target).find(".message:last").append("<p><span id='show_info_" + rp + "' class='gras cursor'>Bilan (uniquement les rapports affichés !)</span></p>" + page.afficherChasse(bilan));
					$("#show_info_" + rp++).click(function(){$(this).parent().next().toggle("blind", 400);});
					messagesAnalyse[$(e.target).prev().prev().attr("id")] = {"bilan" : bilan, "messages" : listeMessages};
				// Si on est sur des rapports de combat
				}else if(titreMess.indexOf("Attaque réussie") != -1 || titreMess.indexOf("Attaque échouée") != -1 || titreMess.indexOf("Invasion") != -1){
					$(e.target).find(".message").each(function(index){
						var combat = new Combat();
						combat.analyse($(this).text());
						$(this).append("<p><span class='gras cursor show_info_" + rp + "'>+</span></p>" + page.afficherCombat(combat));
						$(".show_info_" + rp++).click(function(){
							if($(this).text() == "+") 
								$(this).text("-");
							else
								$(this).text("+");
							$(this).parent().next().toggle("blind", 400);
						});
					});
				}
			}
			// Si on affiche plus de message
			else if($(e.target).attr("id") && $(e.target).attr("id").indexOf("message_") != -1){
				var message = $(e.target).closest(".contenu_conversation");
				// Si on affiche plus de message d'un rapport de chasse
				if(message.prev().prev().find(".td_objet").text().indexOf("Vos chasseuses ont conquis") != -1){
					// Pour tout les rapports
					var chasse = new Chasse();
					chasse.analyse($(e.target).find(".message").text());
					$(e.target).find(".message").append("<p><span class='gras cursor show_info_" + rp + "'>+</span></p>" + page.afficherChasse(chasse));
					$(".show_info_" + rp++).click(function(){
						if($(this).text() == "+")
							$(this).text("-");
						else
							$(this).text("+");
						$(this).parent().next().toggle("blind", 400);
					});
					// Gestion du bilan
					var id_messages = message.prev().prev().attr("id"), id_message = $(e.target).attr("id");
					// Si la chasse n'a pas deja etait analysé dans le bilan
					if(messagesAnalyse[id_messages]["messages"].indexOf(id_message) == -1){
						messagesAnalyse[id_messages]["messages"].push(id_message);
						messagesAnalyse[id_messages]["bilan"].ajoute(chasse);
						// Mise à jour de l'affichage
						message.find(".info_supp:last").replaceWith(page.afficherChasse(messagesAnalyse[id_messages]["bilan"]));
					}
				}
			}
		});
		// Ajout d'un code couleur sur les messages
		$("tr[id^='conversation_']").each(function(){
			var titre = $(this).find("td:eq(3) .intitule_message").text();
			if(titre.indexOf("Colonie perdue") != -1 || titre.indexOf("Vol") != -1 || titre.indexOf("Invasion") != -1 || titre.indexOf("conquis par") != -1)
				$(this).find("td:eq(3)").children().addClass("red");
			if(titre.indexOf("Colonie conquise") != -1 || titre.indexOf("Butin") != -1)
				$(this).find("td:eq(3)").children().addClass("green");
		});
	},
	/**
	* Affiche le resultat de l'analyse d'un rapport de combat.
    *
	* @private
	* @method afficherCombat
	* @param {Object} combat
	* @return {String} Tableau du récapitulatif formaté avec des balises html.
	*/
	afficherCombat : function(combat)
	{
		var message = "<div class='info_supp' style='display:none'>";
		// Affichage des temps HOF - relatif
		message += "<p class='small'>HoF : " + Utils.intToTime((combat.armee1.getTemps(0) - combat.armee1Pe.getTemps(0)) + (combat.armee2.getTemps(0) - combat.armee2Pe.getTemps(0))) + "<br/>Ennemie : " + Utils.intToTime(combat.armee2.getTemps(0) - combat.armee2Pe.getTemps(0)) + " - Vous : " + Utils.intToTime(combat.armee1.getTemps(0) - combat.armee1Pe.getTemps(0)) + "</p>";
		// Affichage des Niveaux
		message += "<span style='text-decoration:underline;' class='gras'>Niveau(x)</span><br/><p>";
		if(combat.bonusVie2)
			message += "Bouclier (/ Lieu) : " + combat.bonusVie2 + " | ";
		message += "Armes : " + combat.bonusAtt2;
		if(combat.armee1.getSommeUnite() < 1000 || combat.armee2.getSommeUnite() < 1000) 
			message += " <img src='images/attention.gif' alt='attention' title='les unitées sont peut être insuffisantes pour être sur' class='o_vAlign'/> ";
		message += "</p>";
		// Affichage des infos sur l'armée restante de l'ennemie
		if(combat.armee2Pe.getSommeUnite()){
			message += "<span style='text-decoration:underline;' class='gras'>Armee (après combat, sans XP)</span><br/><table class='tab_message' cellspacing='0'>"
				+ "<tr><td><img width='35' src='images/icone/icone_ouvriere.png' alt='nb_unite' class='o_vAlign'/></td><td class='right'>" + numeral(combat.armee2Pe.getSommeUnite()).format() + "</td>"
				+ "<td class='right' style='width:30px;'><img height='18' width='18' src='images/icone/icone_coeur.gif' class='o_vAlign'/></td><td class='right'>" + numeral(combat.armee2Pe.getBaseVie()).format() + " (HB)</td>";
			if(typeof combat.bonusVie2 == "number")
				message += "<td class='right'>" + numeral(combat.armee2Pe.getTotalVie(combat.bonusVie2, 0, 0)).format() + " (AB)<img src='images/attention.gif' alt='attention' title='Vie sans le bonus lieu !' class='o_vAlign'/></td></tr>";	
			else if(typeof combat.bonusVie2 == "string"){
				var bouTmp = parseInt(combat.bonusVie2.split(" - ")[0].split("/")[0]), lieuTmp = parseInt(combat.bonusVie2.split(" - ")[0].split("/")[1]);
				message += "<td class='right'>" + numeral(combat.armee2Pe.getTotalVie(bouTmp, combat.lieu == "dome" ? 2 : 3, lieuTmp)).format() + " (AB) <img src='images/attention.gif' alt='attention' title='vie en " + combat.lieu + "' class='o_vAlign'/></td></tr>";
			}else 
				message += "<td></td></tr>";	
			message += "<tr><td><img width='18' height='18' src='images/icone/horloge.png' class='o_vAlign'/></td><td>" + Utils.intToTime(combat.armee2Pe.getTemps(0)) + "</td>"
				+ "<td class='right' style='width:30px;'><img height='18' width='18' src='images/icone/icone_degat_attaque.gif' class='o_vAlign'/></td><td class='right'>" + numeral(combat.armee2Pe.getBaseAtt()).format() + " (HB)</td><td class='right'>" + numeral(combat.armee2Pe.getTotalAtt(combat.bonusAtt2)).format() + " (AB)</td></tr>"
				+ "<tr><td>Perte JSN 10%</td><td class='right'>" + numeral(Math.round(combat.armee2Pe.getTotalDef(combat.bonusAtt2) / 10 / (8 + 8 * Utils.data.niveauRecherche[1] / 10))).format() + " <img src='images/attention.gif' alt='attention' title='Avec votre bonus Bouclier de : " + Utils.data.niveauRecherche[1] + "' class='o_vAlign'/></td>"
				+ "<td class='right' style='width:30px;'><img height='18' width='18' src='images/icone/icone_degat_defense.gif' class='o_vAlign'/></td><td class='right'>" + numeral(combat.armee2Pe.getBaseDef()).format() + " (HB)</td><td class='right'>" + numeral(combat.armee2Pe.getTotalDef(combat.bonusAtt2)).format() + " (AB)</td></tr>"
				+ "</table><br/>";
		}
		// Affichage des infos sur "votre" armée avec l'XP
		if(combat.armee1Pe.getSommeUnite()){
			var nbUnite = combat.armee1XP.getSommeUnite() - combat.armee1.getSommeUnite();
			var attHB = combat.armee1XP.getBaseAtt() - combat.armee1.getBaseAtt();
			var defHB = combat.armee1XP.getBaseDef() - combat.armee1.getBaseDef();
			var vieHB = combat.armee1XP.getBaseVie() - combat.armee1.getBaseVie();
				
			var attAB = combat.armee1XP.getTotalAtt(Utils.data.niveauRecherche[2]) - combat.armee1.getTotalAtt(Utils.data.niveauRecherche[2]);
			var defAB = combat.armee1XP.getTotalDef(Utils.data.niveauRecherche[2]) - combat.armee1.getTotalDef(Utils.data.niveauRecherche[2]);
			var vieAB = combat.armee1XP.getTotalVie(Utils.data.niveauRecherche[1], 0, 0) - combat.armee1.getTotalVie(Utils.data.niveauRecherche[1], 0, 0);
				
			var pnbUnite = (nbUnite * 100 / combat.armee1.getSommeUnite()).toFixed(2);
			var pattHB = (attHB * 100 / combat.armee1.getBaseAtt()).toFixed(2);
			var pdefHB = (defHB * 100 / combat.armee1.getBaseDef()).toFixed(2);
			var pvieHB = (vieHB * 100 / combat.armee1.getBaseVie()).toFixed(2);

			message += "<span style='text-decoration:underline;' class='gras'>Bilan XP</span><br/><table class='tab_message right' cellspacing='0'>"
				+ "<tr><td><img width='35' src='images/icone/icone_ouvriere.png' alt='nb_unite' class='o_vAlign'/></td><td colspan='2' style='padding-left:10px'>" + numeral(nbUnite).format() + "</td><td style='padding-left:10px'>" + pnbUnite + "%</td></tr>"
				+ "<tr><td><img height='18' width='18' src='images/icone/icone_coeur.gif' class='o_vAlign'/></td><td class='right'>" + (vieHB > 0 ? '+' : '') + numeral(vieHB).format() + "(HB)</td><td class='right'>" + (vieHB > 0 ? '+' : '') + numeral(vieAB).format() + "(AB)</td><td style='padding-left:10px'>" + (vieHB > 0 ? '+' : '') + pvieHB + "%</td></tr>"
				+ "<tr><td><img height='18' width='18' src='images/icone/icone_degat_attaque.gif' class='o_vAlign'/></td><td style='padding-left:10px' class='right'>" + (attHB > 0 ? '+' : '') + numeral(attHB).format() + "(HB)</td><td style='padding-left:10px' class='right'>" + (attHB > 0 ? '+' : '') + numeral(attAB).format() + "(AB)</td><td style='padding-left:10px'>" + (attHB > 0 ? '+' : '') + pattHB + "%</td></tr>"
				+ "<tr><td><img height='18' width='18' src='images/icone/icone_degat_defense.gif' class='o_vAlign'/></td><td class='right'>" + (defHB > 0 ? '+' : '') + numeral(defHB).format() + "(HB)</td><td class='right'>" + (defHB > 0 ? '+' : '') + numeral(defAB).format() + "(AB)</td></td><td style='padding-left:10px'>" + (defHB > 0 ? '+' : '') + pdefHB + "%</td></tr>"		
				+ "</table><br/>";
		}
		message += "</div>";
		return message;
	},
    /**
	* Affiche le resultat de l'analyse d'un rapport de chasse.
    *
	* @private
	* @method afficherChasse
	* @param {Object} chasse
	* @return {String} Tableau du récapitulatif formaté avec des balises html.
	*/
	afficherChasse : function(chasse)
	{
		var tdp = Utils.data.niveauConstruction[3] +  Utils.data.niveauConstruction[4] +  Utils.data.niveauRecherche[0];
		var message = "<div class='info_supp' style='display:none'><p class='retour'>Perte HOF : " + Utils.intToTime(chasse.armee.getTemps(0) - chasse.armeePe.getTemps(0)) + " - Perte (TDP " + tdp + ") : " + Utils.intToTime((chasse.armee.getTemps(tdp) - chasse.armeePe.getTemps(tdp))) + "</p>";
		var sommeUnite = chasse.armeePe.getSommeUnite() - chasse.armee.getSommeUnite();
		var baseAtt = chasse.armeeXP.getBaseAtt() - chasse.armee.getBaseAtt();
		var baseDef = chasse.armeeXP.getBaseDef() - chasse.armee.getBaseDef();
		var baseVie = chasse.armeeXP.getBaseVie() - chasse.armee.getBaseVie();
		var bonusAtt = chasse.armeeXP.getTotalAtt(Utils.data.niveauRecherche[2]) - chasse.armee.getTotalAtt(Utils.data.niveauRecherche[2]);
		var bonusDef = chasse.armeeXP.getTotalDef(Utils.data.niveauRecherche[2]) - chasse.armee.getTotalDef(Utils.data.niveauRecherche[2]);
		var bonusVie = chasse.armeeXP.getTotalVie(Utils.data.niveauRecherche[1], 0, 0) - chasse.armee.getTotalVie(Utils.data.niveauRecherche[1], 0, 0);
		var pSommeUnite = (sommeUnite * 100 / chasse.armee.getSommeUnite()).toFixed(2);
		var pAtt = (baseAtt * 100/ chasse.armee.getBaseAtt()).toFixed(2);
		var pDef = (baseDef * 100/ chasse.armee.getBaseDef()).toFixed(2);
		var pVie = (baseVie * 100/ chasse.armee.getBaseVie()).toFixed(2);
		message += "<span style='text-decoration:underline;' class='gras'>Bilan XP</span><br/><table class='tab_message right' cellspacing='0'>" 
			+ "<tr><td><img width='35' src='images/icone/icone_ouvriere.png' alt='nb_unite'/></td><td colspan='2' style='padding-left:10px'>" + numeral(sommeUnite).format() + "</td><td style='padding-left:10px'>" + pSommeUnite + "%</td></tr>"
			+ "<tr><td><img height='18' width='18' src='images/icone/icone_coeur.gif'/></td><td class='right'>" + (baseVie > 0 ? "+" : "") + numeral(baseVie).format() + "(HB)</td><td class='right'>" + (bonusVie > 0 ? "+" : "") + numeral(bonusVie).format() + "(AB)</td><td style='padding-left:10px'>" + (pVie > 0 ? "+" : "") + pVie + "%</td></tr>"
			+ "<tr><td><img height='18' width='18' src='images/icone/icone_degat_attaque.gif'/></td><td style='padding-left:10px' class='right'>" + (baseAtt > 0 ? "+" : "") + numeral(baseAtt).format() + "(HB)</td><td style='padding-left:10px' class='right'>" + (bonusAtt > 0 ? "+" : "") + numeral(bonusAtt).format() + "(AB)</td><td style='padding-left:10px'>" + (pAtt > 0 ? "+" : "") + pAtt + "%</td></tr>"
			+ "<tr><td><img height='18' width='18' src='images/icone/icone_degat_defense.gif'/></td><td class='right'>" + (baseDef > 0 ? "+" : "") +  numeral(baseDef).format() + "(HB)</td><td class='right'>" + (bonusDef > 0 ? "+" : "") + numeral(bonusDef).format() + "(AB)</td></td><td style='padding-left:10px'>" + (pDef > 0 ? "+" : "") + pDef + "%</td></tr>"
			+ "</table></div>";
		return message;
	}
});
