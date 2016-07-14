/*
 * Alliance.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe de fonction pour la page /alliance.php?Membres.
* 
* @class PageAlliance
* @constructor
* @extends Page
*/
var PageAlliance = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		//var self = this;
		//$("#alliance").on("DOMNodeInserted", function(e){
		//	if($(e.target).find("table").hasClass("simulateur")){
                
        $("#tabMembresAlliance td:eq(5)").css("white-space", "nowrap");
        $(".simulateur table[class='ligne_paire'] tr:eq(0) td:eq(1)").append("  (" + $("img[alt='Actif']").length + ")");
        $(".simulateur table[class='ligne_paire'] tr:eq(0) td:eq(3)").append("  (" + $("img[alt='Vacances']").length + ")");
		$(".simulateur table[class='ligne_paire'] tr:eq(1) td:eq(1)").append("  (" + $("img[alt='Inactif depuis 3 jours']").length + ")");
		$(".simulateur table[class='ligne_paire'] tr:eq(1) td:eq(3)").append("  (" + $("img[alt='Bannie']").length + ")");
		$(".simulateur table[class='ligne_paire'] tr:eq(2) td:eq(1)").append("  (" + $("img[alt='Inactif depuis 10 jours']").length + ")");
		$(".simulateur table[class='ligne_paire'] tr:eq(2) td:eq(3)").append("  (" + $("img[alt='Colonisé']").length + ")");
		var total = [0, 0, 0];
		$("#tabMembresAlliance tr:gt(0)").each(function(){
			var terrain = numeral().unformat($(this).find("td:eq(5)").text());
			if(!Utils.comptePlus){
				if(terrain >= ((Utils.terrain * 0.5) + 1) && terrain <= ((Utils.terrain * 3) - 1) && $(this).find("td:eq(3)").text() != Utils.pseudo)
					$(this).find("td:eq(6)").html("<img height='18' src='images/icone/icone_degat_attaque.gif' alt='Attaquable'/>");
				if(((terrain * 0.5) + 1) <= Utils.terrain && ((terrain * 3) - 1) >= Utils.terrain && $(this).find("td:eq(3)").text() != Utils.pseudo)
					$(this).find("td:eq(4)").html("<img height='18' src='images/icone/icone_degat_defense.gif' alt='Attaquant'/>");
			}
			total[0] += terrain;
			total[1] += ~~($(this).find("td:eq(8)").text());
			total[2] += ~~($(this).find("td:eq(7)").text());
		});
		$(".simulateur h2:first").after("<span class='small'>Terrain : <span id='totalTerrain'>" + numeral(total[0]).format() + "</span> cm², Fourmilière : " + numeral(total[1]).format() + ", Technologie : " + numeral(total[2]).format() + ".</span>");	
        
		if(!Utils.comptePlus)
			this.plus();
		else 
			$("#headTerrain").removeAttr("colspan").after("<th></th>");
	},
	/**
	* Ajoute les fonctionnalités du compte+. Ajoute le tri.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{
		$("#tabMembresAlliance tr:first").remove();
		$("#tabMembresAlliance").prepend("<thead class='cursor'><tr class='alt'><th width='30'></th><th width='25'></th><th>Rang</th><th>Pseudo</th><th></th><th>Terrain</th><th></th><th><span style='padding-left:10px;padding-right:10px'>Technologie</span></th><th><span style='padding-left:10px;padding-right:17px'>Fourmiliere</span></th> <th colspan='2'><span style='padding-left:8px;padding-right:8px'>Etat</span></th><th width='30'></th></tr></thead>");
		$("#tabMembresAlliance").tablesorter({
			headers: {0:{sorter:false}, 1:{sorter:false}, 4:{sorter:false}, 5:{sorter:"int"}, 6:{sorter:false}, 7:{sorter:"int"}, 8:{sorter:"int"}, 9:{sorter:false}, 10:{sorter:false}},
			widgets: ['zebra']
		});
	}
});
