/*
 * BoitePonte.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe pour creer et gérer un lanceur de ponte.
* 
* @class BoitePonte
* @constructor
* @extends Boite
*/
var BoitePonte = Boite.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		var tdp = Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0];
		this.html = "<div id='o_ponteContent'><table class='o_maxWidth'><tr class='gras'><td>Unité</td><td><img width='17' height='18' src='images/icone/icone_sablier.gif' alt='Durée :'/></td><td>Nombre</td><td>Jour</td><td>Heure</td><td>Minute</td><td>Seconde</td><td></td></tr>" 
			+ "<tr><td>Ouvrière</td><td>" + parseFloat((Utils.tempsU[0] * Math.pow(0.9, tdp)).toPrecision(2))  + "</td><td><input value='0' size='15' name='o_nombre0'/></td><td><input name='o_jour0' value='0' size='3'/></td><td><input name='o_heure0' value='0' size='2'/></td><td><input name='o_minute0' value='0' size='2'/></td><td><input name='o_seconde0' value='0' size='2'/></td><td class='cursor'><img id='o_lancer0' height='20' src='images/icone/fourmi.png' alt='Lancer'></td></tr>"
			+ "<tr><td>JSN</td><td>" + parseFloat((Utils.tempsU[1] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre1'/></td><td><input name='o_jour1' value='0' size='3'/></td><td><input name='o_heure1' value='0' size='2'/></td><td><input name='o_minute1' value='0' size='2'/></td><td><input name='o_seconde1' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[7] >= 1 ? "<img id='o_lancer1' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>SN</td><td>" + parseFloat((Utils.tempsU[2] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre2'/></td><td><input name='o_jour2' value='0' size='3'/></td><td><input name='o_heure2' value='0' size='2'/></td><td><input name='o_minute2' value='0' size='2'/></td><td><input name='o_seconde2' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[7] >= 3 ? "<img id='o_lancer2' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>NE</td><td>" + parseFloat((Utils.tempsU[3] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre3'/></td><td><input name='o_jour3' value='0' size='3'/></td><td><input name='o_heure3' value='0' size='2'/></td><td><input name='o_minute3' value='0' size='2'/></td><td><input name='o_seconde3' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[8] >= 4 ? "<img id='o_lancer3' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>JS</td><td>" + parseFloat((Utils.tempsU[4] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre4'/></td><td><input name='o_jour4' value='0' size='3'/></td><td><input name='o_heure4' value='0' size='2'/></td><td><input name='o_minute4' value='0' size='2'/></td><td><input name='o_seconde4' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[7] >= 7 ? "<img id='o_lancer4' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>S</td><td>" + parseFloat((Utils.tempsU[5] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre5'/></td><td><input name='o_jour5' value='0' size='3'/></td><td><input name='o_heure5' value='0' size='2'/></td><td><input name='o_minute5' value='0' size='2'/></td><td><input name='o_seconde5' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[8] >= 9 ? "<img id='o_lancer5' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>C</td><td>" + parseFloat((Utils.tempsU[6] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre6'/></td><td><input name='o_jour6' value='0' size='3'/></td><td><input name='o_heure6' value='0' size='2'/></td><td><input name='o_minute6' value='0' size='2'/></td><td><input name='o_seconde6' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[7] >= 10 && Utils.data.niveauRecherche[7] >= 5 ? "<img id='o_lancer6' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>A</td><td>" + parseFloat((Utils.tempsU[8] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre8'/></td><td><input name='o_jour8' value='0' size='3'/></td><td><input name='o_heure8' value='0' size='2'/></td><td><input name='o_minute8' value='0' size='2'/></td><td><input name='o_seconde8' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[7] >= 11 && Utils.data.niveauRecherche[8] >= 1 ? "<img id='o_lancer8' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>AE</td><td>" + parseFloat((Utils.tempsU[9] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre9'/></td><td><input name='o_jour9' value='0' size='3'/></td><td><input name='o_heure9' value='0' size='2'/></td><td><input name='o_minute9' value='0'  size='2'/></td><td><input name='o_seconde9' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[8] >= 13 && Utils.data.niveauRecherche[8] >= 5 ? "<img id='o_lancer9' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>SE</td><td>" + parseFloat((Utils.tempsU[10] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre10'/></td><td><input name='o_jour10' value='0' size='3'/></td><td><input name='o_heure10' value='0' size='2'/></td><td><input name='o_minute10' value='0' size='2'/></td><td><input name='o_seconde10' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[8] >= 17 ? "<img id='o_lancer10' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>Tk</td><td>" + parseFloat((Utils.tempsU[11] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre11'/></td><td><input name='o_jour11' value='0' size='3'/></td><td><input name='o_heure11' value='0' size='2'/></td><td><input name='o_minute11' value='0' size='2'/></td><td><input name='o_seconde11' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[8] >= 23 && Utils.data.niveauRecherche[7] >= 15 ? "<img id='o_lancer11' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>Tu</td><td>" + parseFloat((Utils.tempsU[13] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre13'/></td><td><input name='o_jour13' value='0' size='3'/></td><td><input name='o_heure13' value='0' size='2'/></td><td><input name='o_minute13' value='0' size='2'/></td><td><input name='o_seconde13' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[7] >= 25 && Utils.data.niveauRecherche[9] >= 4 ? "<img id='o_lancer13' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td>TuE</td><td>" + parseFloat((Utils.tempsU[14] * Math.pow(0.9, tdp)).toPrecision(2)) + "</td><td><input value='0' size='15' name='o_nombre14'/></td><td><input name='o_jour14' value='0' size='3'/></td><td><input name='o_heure14' value='0' size='2'/></td><td><input name='o_minute14' value='0' size='2'/></td><td><input name='o_seconde14' value='0' size='2'/></td><td class='cursor'>" + (Utils.data.niveauConstruction[8] >= 28 && Utils.data.niveauRecherche[9] >= 7 ? "<img id='o_lancer14' height='20' src='images/icone/fourmi.png' alt='Lancer'>" : "") + "</td></tr>"
			+ "<tr><td colspan='8'>Temps de ponte : <input id='o_niveauTDP' value='" + tdp + "' size='3'/></td></tr></table></div>";
		$("#o_boitePonte").append(this.html);
		// Formatage des spinners
		$("input[name^='o_nombre'], input[name^='o_jour']").spinner({min : 0, numberFormat: "i"});
		$("input[name^='o_heure'], input[name^='o_minute'], input[name^='o_seconde']").spinner({min : 0, numberFormat: "d2"});
		$("#o_niveauTDP").spinner({min : 0, max : 150});
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
		$("#o_ponteContent table tr:even").css("background-color", Utils.data.couleur2); 
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
		$("input[name^='o_nombre']").on("keyup spin", function(event, ui){
			var unite = parseInt(_.trimStart($(this).attr("name"), "o_nombre"));
			var nombre = ui ? ui.value : $(this).spinner("value");
			var temps = nombre * (Utils.tempsU[unite] * Math.pow(0.9, ~~($("#o_niveauTDP").spinner("value"))));
			// mise à jour du temps
			boitePonte.refreshTemps(unite, temps);
			$(this).spinner("value", nombre);
		});
		$("input[name^='o_seconde']").on("keyup spin", function(event, ui){
			var unite = parseInt(_.trimStart($(this).attr("name"), "o_seconde"));
			var seconde = ui ? ui.value : $(this).spinner("value");
			if(seconde >= 60){
				$(this).spinner("value", seconde - 60);
				$("input[name='o_minute" + unite + "']").spinner("stepUp");
				return false;
			}
			// mise à jour du nombre
			boitePonte.refreshNombre(unite, -1, -1, -1, seconde);
		});
		$("input[name^='o_minute']").on("keyup spin", function(event, ui){
			var unite = parseInt(_.trimStart($(this).attr("name"), "o_minute"));
			var minute = ui ? ui.value : $(this).spinner("value");
			if(minute >= 60){
				$(this).spinner("value", minute - 60);
				$("input[name='o_heure" + unite + "']").spinner("stepUp");
				return false;
			}
			// mise à jour du nombre
			boitePonte.refreshNombre(unite, -1, -1, minute, -1);
		});
		$("input[name^='o_heure']").on("keyup spin", function(event, ui){
			var unite = parseInt(_.trimStart($(this).attr("name"), "o_heure"));
			var heure = ui ? ui.value : $(this).spinner("value");
			if(heure >= 24){
				$(this).spinner("value", heure - 24);
				$("input[name='o_jour" + unite + "']").spinner("stepUp");
				return false;
			}
			// mise à jour du nombre
			boitePonte.refreshNombre(unite, -1, heure, -1, -1);
		});
		$("input[name^='o_jour']").on("keyup spin", function(event, ui){
			var jour = ui ? ui.value : $(this).spinner("value");
			// mise à jour du nombre
			boitePonte.refreshNombre(parseInt(_.trimStart($(this).attr("name"), "o_jour")), jour, -1, -1, -1);
			$(this).spinner("value", jour);
		});
		// event sur le temps de ponte
		$("#o_niveauTDP").on("keyup spin", function(event, ui){
			var tdp = ui ? ui.value : $(this).spinner("value");
			$("input[name^='o_nombre']").each(function(){ // Pour chaque unité on met à jour le temps
				var unite = parseInt(_.trimStart($(this).attr("name"), "o_nombre"));
				$(this).parent().parent().prev().text(parseFloat((Utils.tempsU[unite] * Math.pow(0.9, tdp)).toPrecision(2)));
				var nombre = $(this).spinner("value");
				// mise à jour du temps
				if(nombre)
					boitePonte.refreshTemps(unite, nombre * (Utils.tempsU[unite] * Math.pow(0.9, tdp)));
			});
		});
		// Lancer les pontes
		$("img[id^=o_lancer]").click(function(){
			var securite = sessionStorage.getItem("outiiil_securite_ponte");
			if(!securite){
				$.ajax({
					url     : "/Reine.php",
					async   : false,
					success : function(data){
						var parsed = $("<div/>").append(data);
						securite = parsed.find("#t").attr("name") + "=" + parsed.find("#t").attr("value");
						sessionStorage.setItem("outiiil_securite_ponte", securite);
					}
				});
			}
			var unite = ~~(_.trimStart($(this).attr("id"), "o_lancer"));
			var nombre = $("input[name='o_nombre" + unite + "']").spinner("value");
			if(nombre){
				var donnees = {};
				donnees["destination"] = 3;
				donnees["unePonte"] = "oui";
				donnees["typeUnite"] = "unite" + unite;
				donnees["input_cout_nombre" + unite] = nombre;
				donnees["nombre_de_ponte"] = nombre;
				donnees["" + securite.split("=")[0]] = securite.split("=")[1];
				$.post("/Reine.php", donnees, function(data){   /////////// A REVOIR 
					var parsed = $('<div/>').append(data);
					$("#boiteInfo").fadeOut("slow", function(){
						$(this).replaceWith(parsed.find("#boiteInfo"));
						$("#boiteInfo").fadeIn("slow");
					});
					if(Utils.comptePlus)
						$("#boiteComptePlus").fadeOut("slow", function(){
							$(this).replaceWith(parsed.find("#boiteComptePlus"));
							$("#boiteComptePlus").fadeIn("slow");		
						});
					//alert("Ponte Lancée !");
					$("input[name='o_nombre" + unite + "']").spinner("value", 0);		
				});
			}
		});
	},
	/**
	* Met à jour le nombre d'unité lorsqu'on à modifié le temps.
    *
	* @private
	* @method refreshNombre
	* @param {String} unite
	* @param {Integer} jour
	* @param {Integer} heure
	* @param {Integer} minute
	* @param {Integer} seconde
	* @return
	*/
	refreshNombre : function(unite, jour, heure, minute, seconde)
	{
		var nbJour = (jour < 0) ? $("input[name='o_jour" + unite + "']").spinner("value") : jour;
		var nbHeure = (heure < 0 ) ? $("input[name='o_heure" + unite + "']").spinner("value"): heure;
		var nbMinute = (minute < 0) ? $("input[name='o_minute" + unite + "']").spinner("value") : minute;
		var nbSeconde = (seconde < 0) ? $("input[name='o_seconde" + unite + "']").spinner("value") : seconde;
		var temps = nbJour * 86400 + nbHeure * 3600 + nbMinute * 60 + nbSeconde;
		$("input[name='o_nombre" + unite + "']").spinner("value", Math.round(temps / (Utils.tempsU[unite] * Math.pow(0.9, ~~($("#o_niveauTDP").val())))));
	},
	/**
	* Met à jour les spinner lorsqu'on a modifié la ponte pour une unité.
    *
	* @private
	* @method refreshTemps
	* @param {String} i
	* @param {Integer} temps
	* @return 
	*/
	refreshTemps : function(i, temps)
	{
		// on compte les jours
		$("input[name='o_jour" + i + "']").spinner("value", (temps - temps % 86400) / 86400);
		temps %= 86400;
		// on compte les heures restantes
		$("input[name='o_heure" + i + "']").spinner("value", (temps - temps % 3600) / 3600);
		temps %= 3600;
		// on compte les minutes restantes
		$("input[name='o_minute" + i + "']").spinner("value", (temps - temps % 60) / 60);
		temps = Math.round(temps % 60);
		// il ne reste que les secondes
		$("input[name='o_seconde" + i + "']").spinner("value", temps);
	}
});
