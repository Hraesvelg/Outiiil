/*
 * Profil.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
  
/**
* Classe de fonction pour la page /Membre.php?Pseudo=?.
* 
* @class PageProfil
* @constructor
* @extends Page
*/
var PageProfil = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe. Affiche le temps de trajet, Ajoute les options pour l'historique et la surveillance.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		// Récuperation des coordonnées
		var regexp = new RegExp("x=(\\d*) et y=(\\d*)"), ligne  = $(".boite_membre").find("a[href^='carte2.php?']").text();
		var x = ~~(ligne.replace(regexp, "$1")), y = ~~(ligne.replace(regexp, "$2"));		
		// Affichage du temps de trajet
		var temps = Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(Utils.data.x - x, 2) + Math.pow(Utils.data.y - y, 2))/350))));
		if(!Utils.comptePlus) 
			$(".boite_membre:first div:first table").append("<tr><td style='text-align:right'>Temps de trajet :</td><td>" + Utils.intToTime(temps) + "</td></tr>");
		
		if($("h2").text() != Utils.pseudo){
			$(".boite_membre:first div:first table").append("<tr><td style='text-align:right'>Retour le :</td><td><span>" + moment().add(temps, 's').format("D MMM à HH[h]mm[m]ss[s]") + "</span><span id='o_actualiserTemps' class='o_icone o_actualiser cursor'></span></td></tr>");
			
			$("#o_actualiserTemps").click(function(){
				var temps = Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(Utils.data.x - x, 2) + Math.pow(Utils.data.y - y, 2))/350))));
				$(".boite_membre:first div:first table tr:last td:eq(1) span:eq(0)").text(moment().add(temps, 's').format("D MMM à HH[h]mm[m]ss[s]"));
			});
		}
			
		var retour = Utils.comptePlus ? "<br/>" : "";
		if(!Utils.radar[$("h2").text()])
			$(".boite_membre:eq(1) table tr td:eq(0)").append(retour + "- <span id='surveiller' class='cursor gras'>Surveiller ce joueur</span><br/>- <span id='o_historique' class='cursor gras'>Historique</span>");
		else
			$(".boite_membre:eq(1) table tr td:eq(0)").append(retour + "- <span id='surveiller' class='cursor gras'>Supprimer la surveillance</span><br/>- <span id='o_historique' class='cursor gras'>Historique</span>");
		
		this.event();
	},
	/**
	* Evenement lié à la page : lancement de la récuparation de l'historique et mettre un joueur sous surveillance.
    *
	* @private
	* @method event
	* @return
	*/
	event : function()
	{
		$("#o_historique").click(function(){
			$("#centre center .boite_membre:eq(1)").after("<div class='boite_membre' id='o_boiteHistorique'><div class='o_rangeSelector cursor'><span id='o_selectHisto_1' class='active' data='30'>30J</span><span id='o_selectHisto_2' data='90'>90J</span><span id='o_selectHisto_3' data='180'>180J</span><span id='o_selectHisto_4' data='all'>Tout</span></div><div id='o_chartJoueur'></div></div>");
			// Style preferentiel
			$(".o_rangeSelector span.active").css("background-color", Utils.data.couleur2);
			$(".o_rangeSelector span:not(.active)").css("background-color", Utils.data.couleur1);
			$(".o_rangeSelector span").css("border-color", Utils.data.couleur3);
			page.historique();
            $(this).off();
            $(this).css("color", "#555555")
		});
		$("#surveiller").click(function(){
			var login = $("h2").text();
			if(!Utils.radar[login]){
				var regexp = new RegExp("x=(\\d*) et y=(\\d*)"), ligne = $(".boite_membre").find("a[href^='carte2.php?']").text();
				$(this).text("Supprimer la surveillance");
				Utils.radar[login] = {"type" : 1, "terrain" : numeral().unformat($(".tableau_score tr:eq(1) td:eq(1)").text()), "id" : $("a[href^='commerce.php?ID=']").attr("href").match(/\d+/g)[0], "mv" : $(".boite_membre table:eq(0) tr:eq(0) td:eq(0)").text().indexOf("Joueur en vacances") != -1 ? 1 : 0};
			}else{
				$(this).text("Surveiller ce joueur");
				delete Utils.radar[login];
			}
			localStorage.setItem("outiiil_radar", JSON.stringify(Utils.radar));
			boiteRadar.refreshBoite();
		});
	},
	/**
	* Récupére et Affiche l'historique du joueur.
    *
	* @private
	* @method historique
	* @return
	*/
	historique : function()
	{
		$.get("http://outiiil.fr/fzzz/player/" + location.hostname.split(".")[0].toUpperCase() + "/" + $("a[href^='commerce.php?ID=']").attr("href").match(/\d+/g)[0], function(data){
			// Traitement des données
			var dataTerrain = [], dataConstruction = [], dataTechno = [], dataVac = [], dataBan = [], dataTeam = [];
			var ligne = data.split('\n');
			var values = [], tmpDate = moment("01-01-2014", "DD-MM-YYYY");
			// Creation des series, pour toutes les lignes on ajoutes les données dans les tableaux correspondants
			for(var i = 0, l = ligne.length ; i < l ; i++){
				if(ligne[i]){
					values = ligne[i].split(';');
					var cDate = moment(values[0], "DD-MM-YYYY");
					var diff = cDate.diff(tmpDate, "days");
					// si on a un trou dans les dates on rempli avec des null
					if(diff){
						tmpDate.add(diff, "days");
						for(var j = 0 ; j < diff ; j++, dataTerrain.push(null), dataConstruction.push(null), dataTechno.push(null), dataVac.push(null), dataBan.push(null), dataTeam.push(null));
					}
					dataTerrain.push(parseInt(values[2]));
					dataConstruction.push(~~(values[3]));
					dataTechno.push(~~(values[4]));
					dataBan.push(~~(values[5]));
					dataVac.push(~~(values[6]));
					dataTeam.push(values[1]);
					tmpDate.add(1, "days");			
				}
			}
			// Creation de la table des alliances
			var html = "", tmpDate = moment("01-01-2014", "DD-MM-YYYY");
			for(var i = 0, l = dataTeam.length ; i < l ; i++){
				var ligne = "<tr><td class='left'>" + tmpDate.format("DD/MM/YYYY");
				var j = i + 1, cTeam = dataTeam[i], nbJour = 0;
				while((dataTeam[j] == cTeam || dataTeam[j] == null) && j < l){
					i++;
					tmpDate.add(1, "days");
					j++;
					nbJour++;
				}
				ligne += " -> " + tmpDate.format("DD/MM/YYYY") +  " (" + (nbJour > 1 ? nbJour + " jours" : nbJour + " jour")  + ")</td><td class='centre'><a href='/classementAlliance.php?alliance=" + cTeam + "'>" + cTeam + "</a></td></tr>";
				tmpDate.add(1, "days");
				html = ligne + html;
			}
			$("#o_boiteHistorique").append("<table class='o_historiqueAlliance' cellspacing=0><thead><tr class='gras even'><th>Date</th><th>Alliance</th></tr></thead><tbody>" + html + "</tbody></table>");
            $(".o_historiqueAlliance tr:even").addClass("even");
            // Si le tableau à plus de 9 lignes on ajoute une scrollbar
			if($(".o_historiqueAlliance tr").length > 9)
                $(".o_historiqueAlliance").fixedHeaderTable({footer: false, cloneHeadToFoot: false, fixedColumn: false, height:"225", width:"440"});
			// Creation du graphique
			var chart = new Highcharts.Chart({
				chart : {
					renderTo : "o_chartJoueur",
					type : "spline",
					backgroundColor : null,
					height : 320
				},
				title : {text: ''},
				credits : {enabled : false},
				tooltip : {
					crosshairs : [true], 
					formatter : function(){
						var s = Highcharts.dateFormat("%A %e %b à %H:%M", new Date(this.x));
						$.each(this.points, function(){s += "<br/><span style='color:" + this.series.color + "'>\u25CF</span> " + this.series.name + ": <b>" + numeral(this.y).format() + "</b>";});
						return s;
					},
					shared : true,
					useHTML : true,
				},
				xAxis : {
					lineColor : "#333333",
					labels : {style : {color : "#222222"}},
					type : 'datetime',
					title : {text : 'Date'},
					min : moment().subtract(30, "days").valueOf(),
					max : moment().valueOf(),
				},
				yAxis : {
					title : {text : "Valeur"},
					lineColor : "#333333",
					gridLineColor : "#333333",
					labels : {align : "left", x : 0, y : -2, style : {color : "#222222"}}
				},
				series : [
					{name : "Terrain", color : "#21610B", data : dataTerrain, type : "areaspline", pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000},
					{name : "Fourmilière", color : "#DF7401", data : dataConstruction, type : "areaspline", visible : false, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000},
					{name : "Technologie", color : "#FF0000", data : dataTechno, type : "areaspline", visible : false, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000},
					{name : "Vacance", color : "#013ADF", data : dataVac, visible : false, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000},
					{name : "Banni", color : "#6E6E6E", data : dataBan, visible : false, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000}
				]
			});
			$("span[id^=o_selectHisto]").click(function(){
				var chart = $("#o_chartJoueur").highcharts(), histo = $(this).attr("data");
				$("span[id^=o_selectHisto]").removeClass("active");
				$(this).addClass("active");
				if(histo == "all")
					chart.xAxis[0].update({min : moment("2014-01-01").valueOf()});
				else
					chart.xAxis[0].update({min : moment().subtract(histo, "days").valueOf()});
				// Style preferentiel
				$(".o_rangeSelector span:not(.active)").css("background-color", Utils.data.couleur1);
				$(".o_rangeSelector span.active").css("background-color", Utils.data.couleur2);
			});
		});
	}
});
