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
		var sacrifice = (21 + Utils.data.niveauConstruction[11]) * 40 * Math.pow(2, (Utils.data.niveauConstruction[11] + 3));
		if(!$(".desciption_amelioration:eq(11) table").find(".verificationOK").length)
			$(".desciption_amelioration:eq(11) table").append("<tr><td colspan=2>La construction est utile à partir de <span class='" + ((Utils.ouvrieres - Utils.terrain) > sacrifice ? "green" : "red") + "'>" + numeral(sacrifice).format() + "</span> ouvrières (disponible : " + numeral(Utils.ouvrieres - Utils.terrain).format() + ").</td></tr>");
		if(!Utils.comptePlus) this.plus();
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
		var str = $("#centre > strong").text();
		var construction = str.substring(2, str.indexOf("se termine") - 1);
		if(construction && (!Utils.data.construction || moment().diff(moment(Utils.data.expConstruction), 's') > 0)){
			var time = parseInt(str.split(',')[0].split('(')[1]);
			this.saveConstruction(construction, time);
		}
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
	* @param {String} construction
	* @param {Integer} temps en secondes
	* @return 
	*/
	saveConstruction : function(construction, temps)
	{
		var tmp = construction.substr(0,1).toUpperCase() + construction.substr(1);
		Utils.data.expConstruction = moment().add(temps, 's');
		Utils.data.startConstruction = moment();
		Utils.data.construction = construction;
		localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
		if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majConstruction();
	}
});
