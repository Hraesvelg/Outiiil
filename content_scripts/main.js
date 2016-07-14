/*
 * main.js
 * author			Hraesvelg
 * version			1.4.0
 **********************************************************************/

/**
 * Classe principale du projet : appelle les classes en fonction de la route.
 *
 * @class Main
 * @static
 */
!function() {
	// si l'utilisateur est identifié
	if ($(".boite_connexion_titre:first").text() != "Connexion"){
		// Chargement du language francais
		Globalize.culture("fr");
		numeral.language("fr");
		moment.locale("fr");
		Highcharts.setOptions({
			lang : {
				months : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
				shortMonths : ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"],
				weekdays : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],    
				decimalPoint : ',',
				thousandsSep : ' '
			}
		});
		// Ajout des tris pour les tableaux
		$.tablesorter.addParser({
			id     : "int",
			is     : function(s){return false;},
			format : function(s){return s.replace(/\s+/g, '');},
			type   : "numeric"
		});
		$.tablesorter.addParser({
			id     : "myTime",
			is     : function(s){return false;},
			format : function(s){return Utils.timeToInt(s);},
			type   : "numeric"
		});
		// Chargement des données
		Utils.getData();
		Utils.getRadar();
		// Ajout des boites communes
		boite = (Utils.data.position === "0" ? new BoiteDroite() : new BoiteBas());
		if (!Utils.comptePlus) boiteComptePlus = new BoiteComptePlus();
		if (Object.keys(Utils.radar).length) boiteRadar = new BoiteRadar();
		// Routing
		if (Utils.uri == "/Reine.php") page = new PageReine();
		if (Utils.uri == "/construction.php") page = new PageConstruction();
		if (Utils.uri == "/laboratoire.php") page = new PageLaboratoire();
		if (Utils.uri == "/Ressources.php") page = new PageRessource();
		if (Utils.uri == "/Armee.php") page = new PageArmee();
		if (Utils.uri == "/commerce.php") page = new PageCommerce();
		if (Utils.uri == "/messagerie.php") page = new PageMessagerie();
		if (Utils.uri == "/chat.php" || (Utils.uri == "/alliance.php" && location.search == "")) page = new PageChat();
		if (location.href.indexOf("/alliance.php?Membres") > 0) page = new PageAlliance();
		if (location.href.indexOf("/Membre.php?Pseudo") > 0) page = new PageProfil();
		if (Utils.uri == "/classementAlliance.php" && Utils.extractUrlParams()["alliance"]) page = new PageDescription();
		if (location.href.indexOf("/ennemie.php?Attaquer") > 0 || location.href.indexOf("/ennemie.php?annuler") > 0) page = new PageAttaquer();
		if (Utils.uri == "/ennemie.php" && location.search == "") {
		    // Affichage des temps de trajet
		    $("#tabEnnemie tr:eq(0) th:eq(5)").after("<th class='centre'>Temps</th>");
		    $("#tabEnnemie tr:gt(0)").each(function () {
		        var distance = parseInt($(this).find("td:eq(5)").text());
		        $(this).find("td:eq(5)").after("<td class='centre'>" + Utils.intToTime(Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(distance / 350))))) + "</td>");
		    });
		}
    }
}();
