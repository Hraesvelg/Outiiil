/*
 * Description.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
  
/**
* Classe de fonction pour la page /classementAlliance.php?alliance=.
* 
* @class PageDescription
* @constructor
* @extends Page
*/
var PageDescription = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		// Suppression du cadre classement
		$("#centre center:first").remove();
		// Affichage des totaux(terrain, fourmiliere, techno) et indication des cibles à portée.
		var total = [0, 0, 0], nbMembre = $("#tabMembresAlliance tbody tr:gt(0)").length;
		$("#tabMembresAlliance tr:gt(0)").each(function(){
			var terrain = numeral().unformat($(this).find("td:eq(4)").text());
			if(!Utils.comptePlus){
				if(terrain >= ((Utils.terrain * 0.5) + 1) && terrain <= ((Utils.terrain * 3) - 1) && $(this).find("td:eq(2)").text() != Utils.pseudo)
					$(this).find("td:eq(5)").html("<img width='18' height='18' src='images/icone/icone_degat_attaque.gif' alt='Attaquable'/>");
				if(((terrain * 0.5) + 1) <= Utils.terrain && ((terrain * 3) - 1) >= Utils.terrain && $(this).find("td:eq(2)").text() != Utils.pseudo)
					$(this).find("td:eq(3)").html("<img width='18' height='18' src='images/icone/icone_degat_defense.gif' alt='Attaquant'/>");
			}		
			total[0] += terrain;
			total[1] += ~~($(this).find("td:eq(7)").text());
			total[2] += ~~($(this).find("td:eq(6)").text());
		});

		$("#tabMembresAlliance").before("<p style='margin-bottom:2px' class='right'><input id='surveiller' type='checkbox' " + (!Utils.radar[Utils.extractUrlParams()["alliance"]] ? "" : "checked")  + "/><label for='surveiller'> Surveiller</label> <input id='niveaux' type='checkbox' checked/><label for='niveaux'> Niveaux</label> <input id='combats' type='checkbox'/><label for='combats'> Combat</label> <input id='temps' type='checkbox'/><label for='temps'> Temps</label></p>");
		$("#tabMembresAlliance").after("<p style='margin-top:2px' class='right'>Terrain : <span id='totalTerrain'>" + numeral(total[0]).format() + "</span> cm², Fourmilière : <span id='totalFourmiliere'>" + numeral(total[1]).format() + "</span>, Technologie : <span>" + numeral(total[2]).format() + "</span>.</p><p><button id='historique'><span class='o_icone o_historique'></span> Récupérer les données</button></p>");
		// Ajoute du tri
		if(!Utils.comptePlus) this.plus();
		
		this.event();
	},
	/**
	* Ajoute les evenements propres à la page.
    *
	* @private
	* @method event
	* @return
	*/
	event : function()
	{
		$("#surveiller").click(function(){
			var tag = Utils.extractUrlParams()["alliance"];
			if(!Utils.radar[tag])
				Utils.radar[tag] = {"type" : 2, "terrain" : numeral().unformat($("#totalTerrain").text())};
			else
				delete Utils.radar[tag];
			localStorage.setItem("outiiil_radar", JSON.stringify(Utils.radar));
			boiteRadar.refreshBoite();
		});
		$("#niveaux").change(function(){
            if(Utils.comptePlus)
                $("#tabMembresAlliance th:nth-child(6), #tabMembresAlliance th:nth-child(7), #tabMembresAlliance td:nth-child(7), #tabMembresAlliance td:nth-child(8)").toggle();
            else
                $("#tabMembresAlliance th:nth-child(7), #tabMembresAlliance th:nth-child(8), #tabMembresAlliance td:nth-child(7), #tabMembresAlliance td:nth-child(8)").toggle();
        });
		$("#combats").change(function(){
			if($("#tabMembresAlliance th:eq(8)").text() == "Combat" || (Utils.comptePlus && $("#tabMembresAlliance th:eq(7)").text() == "Combat")){
				if(Utils.comptePlus)
                    $("#tabMembresAlliance th:nth-child(8), #tabMembresAlliance td:nth-child(9)").toggle();
                else
                    $("#tabMembresAlliance th:nth-child(9), #tabMembresAlliance td:nth-child(9)").toggle();
            }else
				page.analyse();
		});
		$("#temps").change(function(){
			// Si on a deja fait un analyse
			if($("#tabMembresAlliance th:eq(9)").text() == "Tdt" || (Utils.comptePlus && $("#tabMembresAlliance th:eq(8)").text() == "Tdt")){
                if(Utils.comptePlus)
                    $("#tabMembresAlliance th:nth-child(9), #tabMembresAlliance th:nth-child(10), #tabMembresAlliance td:nth-child(10), #tabMembresAlliance td:nth-child(11)").toggle();
                else
				    $("#tabMembresAlliance th:nth-child(10), #tabMembresAlliance th:nth-child(11), #tabMembresAlliance td:nth-child(10), #tabMembresAlliance td:nth-child(11)").toggle();
            }
            else
				page.analyse();
		});
		$("#historique").click(function(){
			$(this).attr("disabled", "disabled");
			$(this).after("<div id='o_boiteAlliance' class='simulateur o_marginT15'><div class='o_rangeSelector cursor'><span id='o_selectHisto_1' class='active' data='30'>30J</span><span id='o_selectHisto_2' data='90'>90J</span><span id='o_selectHisto_3' data='180'>180J</span><span id='o_selectHisto_4' data='all'>Tout</span></div><div id='o_chartAlliance'></div></div>");
			// Style preferentiel
			$(".o_rangeSelector span.active").css("background-color", Utils.data.couleur2);
			$(".o_rangeSelector span:not(.active)").css("background-color", Utils.data.couleur1);
			$(".o_rangeSelector span").css("border-color", Utils.data.couleur3);
			page.historique();
		});
	},
	/**
	* Ajoute les fonctionnalités du compte+. Tri sur le tableau des membres.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{
		$("#tabMembresAlliance tr:first").remove();
		$("#tabMembresAlliance").prepend("<thead class='cursor'><tr class='alt'><th></th><th>Rang</th><th>Pseudo</th><th></th><th>Terrain</th><th></th><th>Technologie</th><th>Fourmiliere</th></tr></thead>");
		$("#tabMembresAlliance").tablesorter({
			headers: {0:{sorter:false}, 3:{sorter:false}, 4:{sorter:"int"}, 5:{sorter:false}, 6:{sorter:"int"}, 7:{sorter:"int"}},
			widgets: ["zebra"]
		});
	},
	/**
	* Récupére et Affiche l'historique de l'alliance.
    *
	* @private
	* @method historique
	* @return
	*/
	historique : function()
	{
		$.get("http://outiiil.fr/fzzz/team/" + location.hostname.split(".")[0].toUpperCase() + "/" + Utils.extractUrlParams()["alliance"], function(data){
			// Traitement des données
			var dataTerrain = [], dataConstruction = [], dataTechno = [], dataMembre = [];
			var ligne = data.split('\n');
			var values = [], tmpDate = moment("01-01-2014", "DD-MM-YYYY");
			var variation = [];
			// Creation des series, pour toutes les lignes on ajoutes les données dans les tableaux correspondants
			for(var i = 0, l = ligne.length ; i < l ; i++){
				if(ligne[i]){
					values = ligne[i].split(';');
					var cDate = moment(values[0], "DD-MM-YYYY");
					var diff = cDate.diff(tmpDate, "days");
					// si on a un trou dans les dates on rempli avec des null
					if(diff){
						tmpDate.add(diff, "days");
						for(var j = 0 ; j < diff ; j++, dataTerrain.push(null), dataConstruction.push(null), dataTechno.push(null), dataMembre.push(null));
					}
					dataTerrain.push(parseInt(values[2]));
					dataConstruction.push(~~(values[4]));
					dataTechno.push(~~(values[3]));
					dataMembre.push(~~(values[1]));
					// Si on est un premier jour de mois on ajoute les valeurs aux variations
					if(tmpDate.date() == 1)
						variation.push([parseInt(values[2]), ~~(values[4]), ~~(values[3]), ~~(values[1])]);	
					// on passe à la date suivante
					tmpDate.add(1, "days");
				}
			}
			// Creation du graphique
			var chart = new Highcharts.Chart({
				chart : {
					renderTo : "o_chartAlliance",
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
					{name : "Terrain", color : "#21610B", type : "areaspline", data : dataTerrain, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000},
					{name : "Fourmilière", color : "#DF7401", type : "areaspline", data : dataConstruction, visible : false, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000},
					{name : "Technologie", color : "#FF0000", type : "areaspline", data : dataTechno, visible : false, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000},
					{name : "Membre", color : "#013ADF", data : dataMembre, visible : false, pointStart : Date.UTC(2014, 0, 1), pointInterval : 86400000}
				]
			});
			$("span[id^=o_selectHisto]").click(function(){
				var chart = $("#o_chartAlliance").highcharts(), histo = $(this).attr("data");
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
			// Affichage d'un resultat sur 1 mois
			var mouth = moment(), html = "<br/><div id='o_resultatAlliance' class='simulateur'><table cellspacing=0 class='centre o_maxWidth'><tr class='gras even'><td></td><td>Terrain</td><td>Fourmilière</td><td>Techologie</td><td>Membre</td></tr>";
            html += "<tr><td>En cours</td><td>" + numeral(_.last(dataTerrain) - _.last(variation)[0]).format("+0,0") + " cm²</td><td>" + numeral(_.last(dataConstruction) - _.last(variation)[1]).format("+0,0") + "</td><td>" + numeral(_.last(dataTechno) - _.last(variation)[2]).format("+0,0") + "</td><td>" + (_.last(dataMembre) - _.last(variation)[3]) + "</td></tr>";
			for(var i = variation.length - 1 ; i > 0 ; i--){
				html += "<tr " + (!(i % 2) ? "class='even'" : "") + "><td>" + mouth.format("MMM YYYY") + "</td><td>" + numeral(variation[i][0] - variation[i - 1][0]).format("+0,0") + " cm²</td><td>" + numeral(variation[i][1] - variation[i - 1][1]).format("+0,0") + "</td><td>" + numeral(variation[i][2] - variation[i - 1][2]).format("+0,0") + "</td><td>" + (variation[i][3] - variation[i - 1][3]) + "</td></tr>";
				mouth.subtract(1, 'M');
			}
			html += "</table></div>";
			$("#o_boiteAlliance").after(html);
		});
	},
	/**
	*  Récupére les points de combats des joueurs et calcule les temps de trajet.
    *
	* @private
	* @method analyse
	* @return
	*/
	analyse : function()
	{
		$("#tabMembresAlliance tr:first").append("<th>Combat</th><th title='Temps de Trajet'>Tdt</th><th>Retour</th>"); //style='width:60px'
		$("#niveaux").attr("checked", false);
        $("#niveaux").trigger("change");
		$("#temps, #combats").attr("checked", "checked");
		
		var tempsMax = Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(Utils.data.x - 0, 2) + Math.pow(Utils.data.y - 10000, 2))/350))));
        var proche = tempsMax / 3, loin = 2 * tempsMax / 3;
        $("#tabMembresAlliance tr:gt(0)").each(function(){
            var elem = $(this);
            $.get("/Membre.php?Pseudo=" + $(this).find("td:eq(2)").text(), function(data){
                var parsed = $("<div/>").append(data);
				var regexp = new RegExp("x=(\\d*) et y=(\\d*)");
				var ligne  = parsed.find(".boite_membre a[href^='carte2.php?']").text();
				var temps = Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(Utils.data.x - ~~(ligne.replace(regexp, "$1")), 2) + Math.pow(Utils.data.y - ~~(ligne.replace(regexp, "$2")), 2))/350))));
				var vac = parsed.find(".boite_membre table td:eq(0)").text().indexOf("Joueur en vacances") != -1, style = "";
				if(temps <= proche && !vac) style = "class='marron'";
				else if (temps > proche && temps <= loin && !vac) style = "class='marron_dark'" ;
				elem.append("<td>" + parsed.find(".tableau_score:eq(0) tr:eq(4) td:eq(1)").text() + "</td><td><span " + style + ">" + Utils.intToTime(temps) + "</span></td><td>" + moment().add(temps, 's').format("D MMM à HH[h]mm") + "</td>");
				if(vac){
				    elem.find("a").css("color", "blue");
				    elem.css("color", "blue");
				}
            });
        });
	}
});
