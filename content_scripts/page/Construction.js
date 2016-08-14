/*
 * Construction.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
  
/**
* Classe de fonction pour la page /construction.php.
* 
* @class PageConstruction
* @constructor
* @extends Page
*/
var PageConstruction = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe. Ajoute l'information sur la rentabilité de l'etable.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		// Affichage de la rentabilité
		if(!$(".desciption_amelioration:eq(11) table").find(".verificationOK").length) this.titleEtable();
        // Sauvegarde construction
		if(!Utils.comptePlus) this.plus();
	},
    /**
    * Ajoute un title detaillé pour connaitre la rentabilité de la construction : etable à pucerons.
    *
    * @private
    * @method titleEtable
    * @return 
    */
    titleEtable : function(){
        var ouvDispo = Utils.ouvrieres - Utils.terrain;
        var capacite = ouvDispo * (10 + (Utils.data.niveauConstruction[11] / 2));
        var perte = 80 * Math.pow(2, Utils.data.niveauRecherche[4]);
        var capaciteS = (ouvDispo - perte) * (10 + ((Utils.data.niveauConstruction[11] + 1) / 2));
        var seuil = (21 + Utils.data.niveauConstruction[11]) * 40 * Math.pow(2, (Utils.data.niveauConstruction[11] + 3));
        
        var title = "<table>" +
            "<tr><td>Ouvrières</td><td class='right'>" + numeral(Utils.ouvrieres).format() + "</td></tr>" +
            "<tr><td>Disponible</td><td class='right'>" +  numeral(ouvDispo).format() + "</td></tr>" +
            "<tr><td>Capacité de livraison actuelle</td><td class='right'>" +  numeral(capacite).format() + "</td></tr>" +
            "<tr><td>Perte ouvrières pour niveau " + (Utils.data.niveauConstruction[11] + 1) + "</td><td class='right'>" +  numeral(perte).format() + "</td></tr>" +
            "<tr><td>Capacité de livraison niveau suivant</td><td class='right' style='padding-left:10px'>" +  numeral(capaciteS).format() + "</td></tr>" +
            "<tr><td>Seuil rentabilité ouvrière</td><td class='right gras' style='padding-left:10px'>" +  numeral(seuil).format() + "</td></tr>" +
            "</table>";
            
        $(".cout_amelioration:eq(11) table").prepend("<tr class='centre'><td colspan='2' id='o_rentabiliteEtable' title=''>Rentabilité</td></tr>");
        $("#o_rentabiliteEtable").tooltip({position : {my : "right+15 center", at : "left center"}, content : title});
    },
	/**
	* Ajoute les fonctionnalités du compte+. Sauvegarde la construction en cours.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{	
		// Affichage de la fin de la construction
		if($("#centre > strong").length)
			$("#centre > strong").after("<span class='small'> Terminé le " + moment().add($("#centre > strong").text().split(',')[0].split('(')[1], 's').format("D MMM YYYY à HH[h]mm") + "</span>");
		// Sauvegarde de la construction en cours
        this.saveConstruction();
        // Suppresion de la construction en cours si on annule
		if($("a:contains('Annuler')").length)
			$("a:contains('Annuler')").click(function(){
				Utils.data.expConstruction = -1;
				delete Utils.data.construction;
				delete Utils.data.startConstruction;
				localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
			});
	},
	/**
	* Sauvegarde la construction en cours.
    *
	* @private
	* @method saveConstruction
	* @return 
	*/
	saveConstruction : function()
	{
        var str = $("#centre > strong").text();
		var construction = str.substring(2, str.indexOf("se termine") - 1);
		if(construction && (!Utils.data.construction || moment().diff(moment(Utils.data.expConstruction), 's') > 0)){
            Utils.data.expConstruction = moment().add(parseInt(str.split(',')[0].split('(')[1]), 's');
            Utils.data.startConstruction = moment();
            Utils.data.construction = construction.substr(0,1).toUpperCase() + construction.substr(1);
            localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
            if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majConstruction();
		}
	}
});
