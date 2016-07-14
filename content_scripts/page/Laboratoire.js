/*
 * Laboratoire.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
  
/**
* Classe de fonction pour la page /laboratoire.php.
* 
* @class PageLaboratoire
* @constructor
* @extends Page
*/
var PageLaboratoire = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe. Ajoute les informatiosn sur la rentabilités du niveau armes et bouclier.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		var armee = new Armee();
		armee.getArmee();
		// Informations pour amelioration Bouclier
		var tOuv = 0, nbJSN = 0, nbTuE = 0;
		tOuv = numeral().unformat($(".ligneAmelioration:eq(1)").find(".ouvriere").text()) * (Utils.tempsU[0] * Math.pow(0.9, (Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0])));
		nbJSN = parseInt(tOuv / (Utils.tempsU[1] * Math.pow(0.9, (Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]))));
		if($(".desciption_amelioration:eq(1) table").find(".verificationOK").length)
			$(".desciption_amelioration:eq(1) table").append("<tr><td colspan=2>Bouclier " + (Utils.data.niveauRecherche[1] + 1) + " : +" + numeral(Math.round(armee.getBaseVie() / 10)).format() + ", Ponte : +" + numeral(Math.round(nbJSN * (8 + 8 * Utils.data.niveauRecherche[1] / 10 ))).format() + "</td></tr>");
		// Informations pour amelioration Armes
		tOuv = numeral().unformat($(".ligneAmelioration:eq(2)").find(".ouvriere").text()) * (Utils.tempsU[0] * Math.pow(0.9, (Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0])));
		nbTuE = parseInt(tOuv / (Utils.tempsU[14] * Math.pow(0.9, (Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]))));
		if($(".desciption_amelioration:eq(2) table").find(".verificationOK").length)
			$(".desciption_amelioration:eq(2) table").append("<tr><td colspan=2>Armes " + (Utils.data.niveauRecherche[2] + 1) + " : +" + numeral(Math.round(armee.getBaseAtt() / 10)).format() + ", Ponte : +" + numeral(Math.round(nbTuE * (55 + 55 * Utils.data.niveauRecherche[2] / 10 ))).format() + "</td></tr>");
		if(!Utils.comptePlus) this.plus();
	},
	/**
	* Ajoute les fonctionnalités du compte+. Sauvegarde la recherche en cours.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{	
		// Affichage de la fin de la recherche
		if($("#centre > strong").length)
			$("#centre > strong").after("<span class='small'> Terminé le " + moment().add($("#centre > strong").text().split(',')[0].split('(')[1], 's').format("D MMM YYYY à HH[h]mm") + "</span>");
		// Sauvegarde de la recherche en cours
		var str = $("#centre strong").text();
		var recherche = str.substring(2, str.indexOf("termin") - 1);
		if(recherche && (!Utils.data.recherche || moment().diff(moment(Utils.data.expRecherche), 's') > 1)){
			var time = parseInt(str.split(",")[0].split("(")[1]);
			this.saveRecherche(recherche, time);
		}
		if($("a:contains('Je confirme')").length)
			$("a:contains('Je confirme')").click(function(){
				Utils.data.expRecherche = -1;
				delete Utils.data.recherche;
				delete Utils.data.startRecherche;
				localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
			});
	},
	/**
	* Sauvegarde la recherche en cours.
    *
	* @private
	* @method saveRecherche
	* @param {String} recherche
	* @param {Integer} temps en secondes
	* @return 
	*/
	saveRecherche : function(recherche, temps)
	{
		var tmp = recherche.substr(0,1).toUpperCase() + recherche.substr(1);
		Utils.data.expRecherche = moment().add(temps, 's');
		Utils.data.startRecherche = moment();
		Utils.data.recherche = recherche;
		localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
		if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majRecherche();
	}
});
