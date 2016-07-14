/*
 * Reine.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
 
/**
* Classe de fonction pour la page /reine.php.
* 
* @class PageReine
* @constructor
* @extends Page
*/
var PageReine = Page.extend({
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		if(!Utils.comptePlus) this.plus();
	},
	/**
	* Ajoute les fonctionnalités du compte+. Modifie les champs de saisie, sauvegarde la ponte en cours.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{	
		$(".icones_unite").each(function(){
			$(this).addClass("cliquable3");
			$(this).attr("onclick", "$('.tab_stat').toggle();");
			var index = Utils.nomU.indexOf($(this).parent().find("h2").text());
			$(this).append("<table class='tab_stat' style='display: none;'><tbody><tr><td style='text-align:center;font-size:0.8em;height:30px;' colspan='2'> Avec Bonus</td></tr><tr title='Vie avec Bouclier niveau " + Utils.data.niveauRecherche[1] + "'><td class='icone_vie' style='position:relative; top:4px'><img width='19' height='19' src='images/icone/icone_coeur.gif' alt='Vie :'/></td><td class='vie' style='white-space:nowrap'>" + (Utils.vieU[index] + (Utils.vieU[index] / 10 * Utils.data.niveauRecherche[1]).toFixed(1)/1) + " </td></tr><tr title='Dégats en Attaque avec Armes niveau " + Utils.data.niveauRecherche[2] + "'><td class='icone_degat_attaque' style='position:relative; top:3px'><img width='18' height='18' src='images/icone/icone_degat_attaque.gif' alt='Dégat en attaque :'/></td><td class='degat_defense' style='white-space:nowrap'>" + (Utils.attU[index] + (Utils.attU[index] / 10 * Utils.data.niveauRecherche[2]).toFixed(1)/1) + " </td></tr><tr title='Dégats en Défense avec Armes niveau " + Utils.data.niveauRecherche[2] + "'><td class='icone_degat_defense' style='position:relative; top:3px'><img width='18' height='18' src='images/icone/icone_degat_defense.gif' alt='Dégat en défense :'/></td><td class='degat_defense' style='white-space:nowrap'>" + (Utils.defU[index] + (Utils.defU[index] / 10 * Utils.data.niveauRecherche[2]).toFixed(1)/1) + " </td></tr><tr><td style='height:30px;' colspan='2'></td></tr></tbody></table>");
		});
		$("span[id^='bouton_cout_nombre'], span[id^='bouton_cout_temps'], span[id^='bouton_cout_nourriture']").addClass("cliquable3");
		// Gestion du nombre pour la ponte
		this.changeInput("cout_nombre", "cout_temps", "cout_nourriture");
		// Gestion du temps pour la ponte
		$("span[id^='bouton_cout_temps']").each(function(i){$(this).append("<input id='input_cout_temps" + (i == 0 ? "" : i) + "' class='tooltip_droite' type='text' style='height: 20px; width: 85px;display:none;' title='Ex: 1.5 jour, 1j 12h, 36h' value='" + $(this).find("span[id^='cout_temps']").text() + "'/>");});
		$("input[id^='input_cout_temps']").bind("change paste keyup", function(){
			var i = $(this).attr("id").match(/\d+/) ? $(this).attr("id").match(/\d+/) : "";
			var temps = page.calculeTemps($(this).val());
			
			var nombre = parseInt(temps / (Utils.tempsU[(i == "" ? 0 : i)] * Math.pow(0.9, (Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]))));
			$("#cout_nombre" + i).text(numeral(nombre).format());
			$("#cout_temps" + i).text($(this).val());
			$("#cout_nourriture" + i).text(numeral(nombre * Utils.coutU[(i == "" ? 0 : i)]).format("0.00 a"));
		});
		this.changeInput("cout_temps", "cout_nombre", "cout_nourriture");
		// Gestion de la consommation pour la ponte
		$("span[id^='bouton_cout_nourriture']").each(function(i){$(this).append("<input id='input_cout_nourriture" + (i == 0 ? "" : i) + "' class='tooltip_droite' type='tel' style='height: 20px; width: 85px; display: none;' title='Ex: 100 000, 100k, 0.1M' value='" + $(this).find("span[id^='cout_nourriture']").text() + "'/>");});
		$("input[id^='input_cout_nourriture']").bind("change paste keyup", function(){
			var i = $(this).attr("id").match(/\d+/) ? $(this).attr("id").match(/\d+/) : "";
			var nourriture = page.calculeNombre($(this).val());
			
			var nombre = Math.floor(nourriture / Utils.coutU[(i == "" ? 0 : i)]);
			$("#cout_nombre" + i).text(numeral(nombre).format());
			$("#cout_temps" + i).text(page.timeFormat(nombre * (Utils.tempsU[(i == "" ? 0 : i)] * Math.pow(0.9, (Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]))), nombre));
			$("#cout_nourriture" + i).text($(this).val());
		});
		this.changeInput("cout_nourriture", "cout_nombre", "cout_temps");
		// Sauvegarde de la ponte en cours
		this.verifierPonte();
		if($("a:contains('Annuler')").length)
			$("a:contains('Annuler')").click(function(){
				delete Utils.data.ponte;
				delete Utils.data.startPonte;
				localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
			});
	},
	/**
	* Commute le input actif pour lancer une ponte.
    *
	* @private
	* @method changeInput
	* @param {String} id1
	* @param {String} id2
	* @param {String} id3
	* @return
	*/
	changeInput : function(id1, id2, id3)
	{
		$("span[id^='bouton_" + id1 + "']").click(function(){
			var i = $(this).attr("id").match(/\d+/) ? $(this).attr("id").match(/\d+/) : "";
			
			$("#input_" + id1 + i).val($("#" + id1 + i).text());
			$("#input_" + id1 + i).css("display", "");

			$("#" + id2 + i + ", #" + id3 + i).css("display", "inline-block");
			$("#" + id1 + i + ", #input_" + id2 + i + ", #input_" + id3 + i).css("display", "none");
		});
	},
	/**
	* Analyse le temps souhaité pour la ponte.
    *
	* @private
	* @method calculeTemps
	* @param {String} texte
	* @return {Integer} le nombre de seconde pour la ponte souhaité.
	*/
	calculeTemps : function(texte)
	{	
		var RegExpToutSaufChiffre = new RegExp("[^0-9,/.]", "g");
		var mini_temps1 = new RegExp("([0-9]+)s", "gi");
		var mini_temps2 = new RegExp("([0-9]+)m", "gi");
		var mini_temps3 = new RegExp("([0-9]+)h", "gi");
		var mini_temps4 = new RegExp("([0-9]+)j", "gi");
		var mini_temps5 = new RegExp("([0-9]+)d", "gi");
		texte = texte.replace(mini_temps1, "$1 Secondes");
		texte = texte.replace(mini_temps2, "$1 Minutes");
		texte = texte.replace(mini_temps3, "$1 Heures");
		texte = texte.replace(mini_temps4, "$1 Jours");
		texte = texte.replace(mini_temps5, "$1 Jours");
		var temps1 = new RegExp("(\\bs\\b)|(Sec)|(Secondes?)|(Young dwarves)", "gi");
		var temps2 = new RegExp("(\\bm\\b)|(Min)|(Minutes?)", "gi");
		var temps3 = new RegExp("(\\bh\\b)|(Heures?)|(Hours?)", "gi");
		var temps4 = new RegExp("(\\bj\\b)|(\\bd\\b)|(Jours?)|(Days?)", "gi");
		var unite = new Array (temps1,temps2,temps3,temps4);
		var quantiteUnite = new Array (0,0,0,0,0);
		
		for (i = 0; i < unite.length ; i++)
			texte = texte.replace(unite[i], "{separateur}unite"+(i+1)+"{separateur}");
		
		var texteSplit = texte.split("{separateur}");
		if(texteSplit.length==1){
			var temps_secondes=parseInt(texteSplit[0]); 
			if (!(temps_secondes>0))
				temps_secondes=0;
			return temps_secondes;
		}

		var decalage = texteSplit[0].replace(RegExpToutSaufChiffre, '').length > 0 ? -1 : 1;
		var a = "", b = "", temp = "";
		for (i = 0; i < texteSplit.length ; i++){
			for (j = unite.length; j >0 ; j--){
				if (texteSplit[i].indexOf("unite"+j) >= 0){
					if (texteSplit[i+decalage].indexOf('\t') < 0){ 
						temp = parseFloat(texteSplit[i+decalage].replace(RegExpToutSaufChiffre, ''));
						if (isNaN(temp)) {temp = 0;}
						quantiteUnite[j] += temp;
					}else{
						var splitQuantite = texteSplit[i+decalage].split('\t');
						for (k = 0; k < splitQuantite.length; k++){
							temp = parseFloat(splitQuantite[k].replace(RegExpToutSaufChiffre, ''),10); // on doit pr�ciser que c'est en base 10 au cas o� �a commence par 0
							if (isNaN(temp)) {temp = 0;}
							quantiteUnite[j] += temp;
						}
					}
					break;
				}
			}
		}
		
		var temps_secondes=parseInt(quantiteUnite[1]+60*quantiteUnite[2]+3600*quantiteUnite[3]+3600*24*quantiteUnite[4]);
		if (temps_secondes<0){temps_secondes=0;}
		return parseInt(temps_secondes);
	},
	/**
	* Analyse le nombre entrée pour la ponte. Convertit les unités.
    *
	* @private
	* @method calculeNombre
	* @param {String} nombre
	* @return {Integer} nombre d'unité en entier.
	*/
	calculeNombre : function(nombre)
	{
		nombre = nombre.replace(',','.');
		var RegExpToutSaufChiffre = new RegExp("[^0-9,/.]", "g");
		var suffixe = new RegExp("[kmgt]", "gi");
		
		if(suffixe = nombre.match(suffixe)){
			var kilo = new RegExp("\\b([0-9]+)([.]*)([0-9]*)k\\b", "gi");
			var mega = new RegExp("\\b([0-9]+)([.]*)([0-9]*)m\\b", "gi");
			var giga = new RegExp("\\b([0-9]+)([.]*)([0-9]*)g\\b", "gi");
			var tera = new RegExp("\\b([0-9]+)([.]*)([0-9]*)t\\b", "gi");
			if(nombre.match(kilo)){var nombre=nombre.replace(RegExpToutSaufChiffre,'');return (1000*nombre);}
			if(nombre.match(mega)){var nombre=nombre.replace(RegExpToutSaufChiffre,'');return (1000000*nombre);}
			if(nombre.match(giga)){var nombre=nombre.replace(RegExpToutSaufChiffre,'');return (1000000000*nombre);}
			if(nombre.match(tera)){var nombre=nombre.replace(RegExpToutSaufChiffre,'');return (1000000000000*nombre);}
		}
		nombre = nombre.replace(RegExpToutSaufChiffre,'');
		return parseInt(nombre);
	},
	/**
	* Formate un nombre de seconde en chaine de caractéres formatée raccourci.
    *
	* @private
	* @method timeFormat
	* @param {Integer} nombre_seconde
	* @param {Integer} nb_unite
	* @return {String} chaine formatée.
	*/
	timeFormat : function(nombre_seconde, nb_unite)
	{
		var jours = Math.floor(nombre_seconde / 86400);
		var temp = nombre_seconde- jours*86400;
		var heures = Math.floor(temp / 3600);
		var minutes = Math.floor(((temp / 3600) - Math.floor(temp / 3600)) * 60);
		var secondes = temp - ((Math.floor(temp / 60)) * 60);
		var message = "", flag=0;
		if(flag<nb_unite && jours>=1){
			if(heures==23 && minutes>30){jours++;heures=0;}
			flag++; 
			message+= jours + "J ";
		}
		if(flag<nb_unite && heures>=1){
			if(minutes==59 && secondes>30){heures++;minutes=0;}
			flag++; 
			message+= heures + "h ";
		}else{
			if(flag==1){flag++;}
		}
		if(flag<nb_unite && minutes>=1 ){
			if(secondes>59.5){minutes++;secondes=0;}
			flag++;
			message += minutes + "m ";
		}else{
			if(flag>=1){flag++;}
		}
		if(flag<nb_unite && secondes>=1 ){
			flag++;
			message += Math.ceil(secondes) + "s";
		}
		if(flag==0){
			flag++; 
			message += Math.ceil(secondes*10000)/10000 + "s";
		}
		return message;
	},
	/**
	* Verifie les pontes en cours avec ce qui est sauvegarder.
    *
	* @private
	* @method verifierPonte
	* @return
	*/
	verifierPonte : function()
	{
		// Si on a des pontes en cours
		if($(".tableau_leger:eq(0)").length){
			var listePonte = [];
			for(var i = 1, l = $(".tableau_leger:eq(0) tr").length ; i < l ; i++){
				var unite = $(".tableau_leger:eq(0) tr:eq(" + i + ") td:eq(0)").text().replace(/[0-9]+/g, '').trim();
				var nombre = parseInt($(".tableau_leger:eq(0) tr:eq(" + i + ") td:eq(0)").text().replace(/\D+/g, ''));
				var temps = Utils.timeToInt($(".tableau_leger:eq(0) tr:eq(" + i + ") td:eq(2)").text());
				listePonte.push({"unite" : unite.substr(0,1).toUpperCase() + unite.substr(1), "nombre" : nombre, "exp" : moment().add(temps, 's')});
			}
			// Verification si les données sont deja enregistré
			if(!Utils.data.ponte || Utils.data.ponte.length != listePonte.length || listePonte[0]["exp"].diff(Utils.data.ponte[0]["exp"], 's') > 1)
				this.savePonte(listePonte);
		}
	},
	/**
	* Sauvegarde la ponte en cours.
    *
	* @private
	* @method savePonte
	* @param {Object} liste
	* @return
	*/
	savePonte : function(liste)
	{
		Utils.data.ponte = liste;
		Utils.data.startPonte = moment();
		localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
		if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majPonte();
	}
});
