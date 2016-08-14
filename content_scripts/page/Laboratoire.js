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
        var tdp = Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0];
        var armee = new Armee();
		armee.getArmee();
        // Affichage de la rentabilité du bouclier
		this.titleBouclier(armee, tdp);
        // Affichage de la rentabilité de l'armes
        this.titleArmes(armee, tdp);
        // Sauvegarde recherche
		if(!Utils.comptePlus) this.plus();
	},
    /**
    * Ajoute un title detaillé pour connaitre la rentabilité du niveau bouclier.
    *
    * @private
    * @method titleBouclier
    * @return
    */
    titleBouclier : function(armee, tdp)
    {
        var vieAB = armee.getBaseVie() + armee.getBonusVie(Utils.data.niveauRecherche[1]);        
		var tOuv = numeral().unformat($(".ligneAmelioration:eq(1)").find(".ouvriere").text()) * (Utils.tempsU[0] * Math.pow(0.9, tdp));
        var apportPonte = Math.round(parseInt(tOuv / (Utils.tempsU[1] * Math.pow(0.9, tdp))) * (8 + 8 * Utils.data.niveauRecherche[1] / 10));
        var vieABSupp = armee.getBaseVie() + armee.getBonusVie(Utils.data.niveauRecherche[1] + 1);
        var bLigneGras = vieAB + apportPonte >= vieABSupp ? true : false;
        
        var title = "<table>" +
            "<tr><td>Vie AB actuelle</td><td class='right'>" + numeral(vieAB).format() + "</td></tr>" +
            "<tr" + (bLigneGras ? " class='gras' " : "") + "><td>Vie AB + ponte JSN</td><td class='right' style='padding-left:10px'>" +  numeral(vieAB + apportPonte).format() + " (+ " + numeral(apportPonte).format() + ")</td></tr>" +
            "<tr" + (!bLigneGras ? " class='gras' " : "") + "><td>Vie AB niveau " + (Utils.data.niveauRecherche[1] + 1) + "</td><td class='right'>" +  numeral(vieABSupp).format() + " (+ " + numeral(vieABSupp - vieAB).format() + ")</td></tr>" +
            "</table>";
            
        $(".cout_amelioration:eq(1) table").prepend("<tr class='centre'><td colspan='2' id='o_rentabiliteBouclier' title=''>Rentabilité</td></tr>");
        $("#o_rentabiliteBouclier").tooltip({position : {my : "right+15 top", at : "left center"}, content : title});
    },
    /**
    * Ajoute un title detaillé pour connaitre la rentabilité du niveau d'armes.
    *
    * @private
    * @method titleArmes
    * @return
    */
    titleArmes : function(armee, tdp)
    {    
        var attAB = armee.getTotalAtt(Utils.data.niveauRecherche[2]);
		var tOuv = numeral().unformat($(".ligneAmelioration:eq(2)").find(".ouvriere").text()) * (Utils.tempsU[0] * Math.pow(0.9, tdp));
        var apportPonteJS = Math.round(parseInt(tOuv / (Utils.tempsU[4] * Math.pow(0.9, tdp))) * (10 + 10 * Utils.data.niveauRecherche[1] / 10));
        var apportPonteTk = Math.round(parseInt(tOuv / (Utils.tempsU[11] * Math.pow(0.9, tdp))) * (55 + 55 * Utils.data.niveauRecherche[1] / 10));
        var attABSupp = armee.getTotalAtt(Utils.data.niveauRecherche[2] + 1);
        var bLigneGrasJS = attAB + apportPonteJS >= attABSupp ? true : false;
        var bLigneGrasTk = attAB + apportPonteTk >= attABSupp ? true : false;
        
        var defAB = armee.getTotalDef(Utils.data.niveauRecherche[2]);
        var apportPonteTuE = Math.round(parseInt(tOuv / (Utils.tempsU[14] * Math.pow(0.9, tdp))) * (55 + 55 * Utils.data.niveauRecherche[1] / 10));
        var defABSupp = armee.getTotalDef(Utils.data.niveauRecherche[2] + 1);
        var bLigneGrasTuE = defAB + apportPonteTuE >= defABSupp ? true : false;
        
        var title = "<table>" +
            "<tr><td>Attaque AB actuelle</td><td class='right'>" + numeral(attAB).format() + "</td></tr>" +
            "<tr" + (bLigneGrasJS ? " class='gras' " : "") + "><td>Attaque AB + ponte JS</td><td class='right' style='padding-left:10px'>" +  numeral(attAB + apportPonteJS).format() + " (+ " + numeral(apportPonteJS).format() + ")</td></tr>" +
            "<tr" + (bLigneGrasTk ? " class='gras' " : "") + "><td>Attaque AB + ponte Tank</td><td class='right' style='padding-left:10px'>" +  numeral(attAB + apportPonteTk).format() + " (+ " + numeral(apportPonteTk).format() + ")</td></tr>" +
            "<tr" + (!bLigneGrasTk ? " class='gras' " : "") + "><td>Attaque AB niveau " + (Utils.data.niveauRecherche[2] + 1) + "</td><td class='right'>" +  numeral(attABSupp).format() + " (+ " + numeral(attABSupp - attAB).format() + ")</td></tr></table><hr/><table>" +
            "<tr><td>Défense AB actuelle</td><td class='right'>" + numeral(defAB).format() + "</td></tr>" +
            "<tr" + (bLigneGrasTuE ? " class='gras' " : "") + "><td>Défense AB + ponte TuE</td><td class='right' style='padding-left:10px'>" +  numeral(defAB + apportPonteTuE).format() + " (+ " + numeral(apportPonteTuE).format() + ")</td></tr>" +
            "<tr" + (!bLigneGrasTuE ? " class='gras' " : "") + "><td>Défense AB niveau " + (Utils.data.niveauRecherche[2] + 1) + "</td><td class='right'>" +  numeral(defABSupp).format() + " (+ " + numeral(defABSupp - defAB).format() + ")</td></tr>" +
            "</table>";
            
        $(".cout_amelioration:eq(2) table").prepend("<tr class='centre'><td colspan='2' id='o_rentabiliteArmes' title=''>Rentabilité</td></tr>");
        $("#o_rentabiliteArmes").tooltip({position : {my : "right+15 top", at : "left center"}, content : title});
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
		this.saveRecherche();
        // Suppresion de la recherche en cours si on annule
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
	* @return 
	*/
	saveRecherche : function()
	{
        var str = $("#centre strong").text();
		var recherche = str.substring(2, str.indexOf("termin") - 1);
		if(recherche && (!Utils.data.recherche || moment().diff(moment(Utils.data.expRecherche), 's') > 1)){
            Utils.data.expRecherche = moment().add(parseInt(str.split(",")[0].split("(")[1]), 's');
            Utils.data.startRecherche = moment();
            Utils.data.recherche = recherche.substr(0,1).toUpperCase() + recherche.substr(1);
            localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
            if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majRecherche();
		}
	}
});
