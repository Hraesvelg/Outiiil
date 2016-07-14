/*
 * Ressource.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
  
/**
* Classe de fonction pour la page /Ressource.php.
* 
* @class PageRessource
* @constructor
* @extends Page
*/
var PageRessource = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe. Récupére l'armée pour calculer des chasses et ajoute des affichage.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		// Récupération de l'armée
		armeeCh = new Armee();
		armeeCh.getArmee();
		// Nombre de chasse restante
		resteChasse = Utils.data.niveauRecherche[5] + 2 - $("#centre").text().split("Vos chasseuses vont conquérir").length;
		// Ajout du lanceur de chasse
		this.lanceur();
		if(!Utils.comptePlus) this.plus();
		
		this.css();
		this.event();
	},
	/**
	* Applique le style propre à la page chargé.
    *
	* @private
	* @method css
	* @return 
	*/
	css : function()
	{
		$("#o_lanceurChasse tr:even, #o_recapChasse tr:even").css("background-color", Utils.data.couleur2);
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
		$("#o_chasseTDCDep, #o_chasseNbr, #o_chasseTDCRep").on("keyup spin", function(event, ui){
			var nombre = ui ? ui.value : $(this).spinner("value");
			$(this).spinner("value", nombre);page.compileData();
		});
		$("#o_chasseNbrAuto").click(function(){
			if(!$(this).is(':checked'))
				$("#o_chasseNbr").spinner("enable");
			else{
				$("#o_chasseNbr").spinner("disable");
				page.compileData();
			}
		});
		$("#o_chasseTDCRepAuto").click(function(){
			if(!$(this).is(':checked'))
				$("#o_chasseTDCRep").spinner("enable");
			else{
				$("#o_chasseTDCRep").spinner("disable");
				page.compileData();
			}
		});
		$("#o_chasseDiff").change(function(){
			var value = $(this).val();
			if(value <= 4)
				$(this).css("color", "black");
			else if(value > 4 && value <= 6)
				$(this).css("color", "red");
			else if(value > 6 && value <= 7.5)
				$(this).css("color", "orange");
			else
				$(this).css("color", "green");
			page.compileData();
		});
		$("#o_chasseJSN").on("keyup spin", function(event, ui){
			var nombre = ui ? ui.value : $(this).spinner("value");
			armeeCh.setJSN(nombre);
			$(this).spinner("value", nombre);
			page.compileData();
		});
		// Lancement des chasses
		$("#o_chasseEnvoyer").click(function(){
			$("#o_simulationChasse tr:gt(0)").addClass("red");
			$.ajax({
				url : "/AcquerirTerrain.php",
				async : false,
				success : function(data) {
					var parsed = $("<div/>").append(data);
					page.envoyerChasse(1, parsed.find("#t:last").attr("name") + "=" + parsed.find("#t:last").attr("value"));
				}
			});
			var nbChasse = $("#o_chasseNbr").spinner("value");
			page.saveChasse($("#o_chasseTDCRep").spinner("value") * nbChasse, nbChasse, _.round((Utils.terrain +  terrainChasse) * Math.pow(0.9, Utils.data.niveauRecherche[5])));
		});
	},
	/**
	* Formulaire de lancement pour les chasses.
    *
	* @private
	* @method lanceur
	* @return
	*/
	lanceur : function()
	{
		var html = "<table id='o_lanceurChasse' class='o_maxWidth o_marginT15' cellspacing=0>"
			+ "<tr><td>Terrain à l'arrivée</td><td><input value='1000000' size='21' id='o_chasseTDCDep'/></td><td></td></tr>"
			+ "<tr><td>Nombre de chasse</td><td><input value='0' size='21' id='o_chasseNbr'/></td><td><input id='o_chasseNbrAuto' type='checkbox' checked='checked' name='optionAuto'/><label for='o_chasseNbrAuto'>Auto</label></td></tr>"
			+ "<tr><td>Terrain par chasse</td><td><input value='0' size='21' id='o_chasseTDCRep'/></td><td><input id='o_chasseTDCRepAuto' type='checkbox' checked='checked' name='optionAuto'/><label for='o_chasseTDCRepAuto'>Auto</label></td></tr>"
			+ "<tr><td>Difficulté</td><td><select id='o_chasseDiff' title='Ratio (Attaque de votre Armée) / (Difficulté de chasse) : détermine les pertes et taux de réplique de votre chasse...'><option value='1' class='black'>" + armeeCh.hunt_ratio[0].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[0] >= 0.20 ? (100 * armeeCh.hunt_reply[0]).toFixed(2) + "%" : "< 20%") + "</option><option value='2' class='black'>" + armeeCh.hunt_ratio[1].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[1] >= 0.20 ? (100 * armeeCh.hunt_reply[1]).toFixed(2) + "%" : "< 20%") + "</option><option value='3' class='black'>" + armeeCh.hunt_ratio[2].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[2] >= 0.20 ? (100 * armeeCh.hunt_reply[2]).toFixed(2) + "%" : "< 20%") + "</option><option value='4' class='black'>" + armeeCh.hunt_ratio[3].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[3] >= 0.20 ? (100 * armeeCh.hunt_reply[3]).toFixed(2) + "%" : "< 20%") + "</option><option value='5' class='red'>" + armeeCh.hunt_ratio[4].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[4] >= 0.20 ? (100 * armeeCh.hunt_reply[4]).toFixed(2) + "%" : "< 20%") + "</option><option value='6' class='red'>" + armeeCh.hunt_ratio[5].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[5] >= 0.20 ? (100 * armeeCh.hunt_reply[5]).toFixed(2) + "%" : "< 20%") + "</option><option value='6.5' class='orange'>" + armeeCh.hunt_ratio[6].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[6] >= 0.20 ? (100 * armeeCh.hunt_reply[6]).toFixed(2) + "%" : "< 20%") + "</option><option value='7' class='orange'>" + armeeCh.hunt_ratio[7].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[7] >= 0.20 ? (100 * armeeCh.hunt_reply[7]).toFixed(2) + "%" : "< 20%") + "</option><option value='7.5' class='orange'>" + armeeCh.hunt_ratio[8].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[8] >= 0.20 ? (100 * armeeCh.hunt_reply[8]).toFixed(2) + "%" : "< 20%") + "</option><option value='8' class='green'>" + armeeCh.hunt_ratio[9].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[9] >= 0.20 ? (100 * armeeCh.hunt_reply[9]).toFixed(2) + "%" : "< 20%") + "</option><option value='8.5' class='green'>" + armeeCh.hunt_ratio[10].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[10] >= 0.20 ? (100 * armeeCh.hunt_reply[10]).toFixed(2) + "%" : "< 20%") + "</option><option value='9' class='green' selected>" + armeeCh.hunt_ratio[11].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[11] >= 0.20 ? (100 * armeeCh.hunt_reply[11]).toFixed(2) + "%" : "< 20%") + "</option><option value='10' class='green'>" + armeeCh.hunt_ratio[12].toFixed(1) + " → Rep10% : " + (armeeCh.hunt_reply[12] >= 0.20 ? (100 * armeeCh.hunt_reply[12]).toFixed(2) + "%" : "< 20%") + "</option></select></td><td></td></tr>"
			+ "<tr><td>Garder des JSN</td><td><input value='0' size='21' id='o_chasseJSN'/></td><td>max : " + numeral(armeeCh.nbrJSN).format() + "</td></tr>"
			+ "<tr><td>Intervalle entre les chasses</td><td><select id='o_chasseInt' title='Intervalle entre les chasses'><option value='2' selected>2 secondes</option><option value='30'>30 secondes</option><option value='60'>1 minute</option><option value='120'>2 minutes</option></select></td><td></td></tr>"
			+ "<tr><td colspan='3'><em>Basé sur le lanceur de <a href='http://alliancead2.free.fr/HuntingSimulator.html' class='violet'>Calystene</a></em></td></tr>"
			+ "</table><table id='o_recapChasse' cellspacing=0>"
			+ "<tr><td colspan='3' class='gras'>Récapitulatif</td></tr>"
			+ "<tr><td>Chasse(s)</td><td>:</td><td id='o_chasseTotal'></td><td></td></tr>"
			+ "<tr><td>Temps requis</td><td>:</td><td id='o_chasseTemps'></td></tr>"
			+ "<tr><td>Retour</td><td>:</td><td id='o_chasseRetour'></td></tr>"
			+ "<tr><td>Rentabilité</td><td>:</td><td id='o_chasseRentabilite'></td></tr>"
			+ "<tr><td>Difficulté</td><td>:</td><td id='o_chasseRefDiff'></td></tr>"
			+ "<tr><td>Perte estimé</td><td>:</td><td id='o_chassePerte'></td></tr>"
			+ "</table>";
		$("#boite_tdc").after("<br/><div id='o_prepaChasse' class='boite_amelioration'><h2>Lanceur de Chasses</h2>" + html + "</div><br/><div id='o_simuChasse' class='boite_amelioration'><input class='o_marginT15' type='button' id='o_chasseEnvoyer' value='Envoyer'/><p class='o_marginT0'><em class='small'>Veuillez rester sur cette page le temps du lancement !</em></p></div>");
		// Event
		$("#o_chasseTDCDep").spinner({min : 0, numberFormat : "i"});
		$("#o_chasseJSN").spinner({min : 0, max : armeeCh.nbrJSN, numberFormat : "i"});
		$("#o_chasseNbr, #o_chasseTDCRep").spinner({min : 0, numberFormat : "i", disabled : true});
		// Completion des valeurs
		this.compileData();
	},
    /**
	* Calcule les données de la chasse en fonction des valeurs souhaitées par le joueur.
    *
	* @private
	* @method compileData
	* @return
	*/
	compileData : function()
	{
		var tdcDep = $("#o_chasseTDCDep").spinner("value");
		var diffChasse = $("#o_chasseDiff").val();
		var nbChasse = $("#o_chasseNbr").spinner("value");
		var fixNB = nbChasse && !$("#o_chasseNbrAuto").is(':checked') ? nbChasse : 0;
		var terrainChasse = $("#o_chasseTDCRep").spinner("value");
		var fixHF = terrainChasse && !$("#o_chasseTDCRepAuto").is(':checked') ? terrainChasse : 0;
		// Si une chasse peut être calculer
        if(tdcDep){
			var simu = armeeCh.simulerChasse(tdcDep, nbChasse, terrainChasse, diffChasse, fixNB, fixHF, resteChasse);
			this.afficherRecapitulatif(simu.nbChasse, simu.terrainChasse, simu.ratio, simu.ratioRef, simu.iTabPerte);
			this.afficherSimulation(simu.repartition);
		}
	},
	/**
	* Affiche le compte rendu de la simulation.
    *
	* @private
	* @method afficherRecapitulatif
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @param {Float} ratio
	* @param {Float} ratioRef
	* @param {Array} iTabPerte
	* @return 
	*/
	afficherRecapitulatif : function(nbChasse, terrainChasse, ratio, ratioRef, iTabPerte)
	{
		$("#o_chasseTotal").html(nbChasse + " x " + numeral(terrainChasse).format() + " = <span class='green'>" + numeral(nbChasse * terrainChasse).format() + "</span> cm²");
		var temps = _.round((Utils.terrain +  terrainChasse) * Math.pow(0.9, Utils.data.niveauRecherche[5]));
		$("#o_chasseTemps").text(Utils.intToTime(temps));
		$("#o_chasseRetour").text(moment().add(temps, 's').format("D MMM YYYY à HH[h]mm"));
		$("#o_chasseRentabilite").text(numeral(_.round(nbChasse * terrainChasse / temps * 86400)).format() + " cm² / jour");
		$("#o_chasseRefDiff").text(ratio.toFixed(1) + " ~ " + ratioRef);
		$("#o_chassePerte").text(numeral(_.round(iTabPerte["AVG"])).format() + " JSN (max : " + numeral(_.round(iTabPerte["MAX"])).format() + ")");
	},
	/**
	* Affiche la répartition des unités pour les chasses.
    *
	* @private
	* @method afficherSimulation
	* @param {Array} repartition
	* @return
	*/
	afficherSimulation : function(repartition)
	{
		if($("#o_simuChasse > div").length)
			$("#o_simuChasse > div").remove();
		var simulation = "<div style='max-height:400px;overflow:auto'><table id='o_simulationChasse' class='o_maxWidth' cellspacing=0><tr class='gras'><td>Chasse</td><td>JSN</td><td>SN</td><td>NE</td><td>JS</td><td>S</td><td>C</td><td>CE</td><td>A</td><td>AE</td><td>SE</td><td>Tk</td><td>TkE</td><td>Tu</td><td>TuE</td></tr>";
		for(var i = 0, l = repartition.length ; i < l ; i++){
			simulation += "<tr><td>" + (i + 1) + "</td>";
			for(var j = -1 ; ++j < 14 ; simulation += "<td class='small' nowrap>" + (repartition[i][j] ? numeral(repartition[i][j]).format() : "") + "</td>");
			simulation += "</tr>";
		}
		simulation += "</tr></table></div>";
		$("#o_simuChasse").prepend(simulation);
		$("#o_simulationChasse tr:even").css("background-color", Utils.data.couleur2); 
	},
	/**
	* Envoie une chasse.
    *
	* @private
	* @method envoyerChasse
	* @param {Integer} indice
	* @param {String} securite
	* @return
	*/
	envoyerChasse : function(indice, securite)
	{
		var terrainChasse = $("#o_chasseTDCRep").spinner("value"), nbChasse = $("#o_chasseNbr").spinner("value");
		var donnees = {};
		donnees["" + securite.split("=")[0]] = securite.split("=")[1];
		donnees["ChoixArmee"] = "1";
		donnees["AcquerirTerrain"] = terrainChasse;
		donnees["unite1"] = armeeCh.repartition[0][0];
		donnees["unite2"] = armeeCh.repartition[0][1];
		donnees["unite3"] = armeeCh.repartition[0][2];
		donnees["unite4"] = armeeCh.repartition[0][3];
		donnees["unite5"] = armeeCh.repartition[0][4];
		donnees["unite6"] = armeeCh.repartition[0][5];
		donnees["unite7"] = armeeCh.repartition[0][7];
		donnees["unite8"] = armeeCh.repartition[0][8];
		donnees["unite9"] = armeeCh.repartition[0][9]; 
		donnees["unite10"] = armeeCh.repartition[0][10];
		donnees["unite11"] = armeeCh.repartition[0][12];
		donnees["unite12"] = armeeCh.repartition[0][13];
		donnees["unite13"] = armeeCh.repartition[0][11];
		donnees["unite14"] = armeeCh.repartition[0][6];
		armeeCh.repartition.splice(0, 1);
		// Requete
		$.post("/AcquerirTerrain.php", donnees, function(data){
			if(data.indexOf("La chasse est lancée.") > -1)
				$("#o_simulationChasse tr:eq(" + indice + ")").html("<td class='green'>" + indice + "</td><td colspan='14' class='green'>La chasse est lancée.</td>");
			else
				$("#o_simulationChasse tr:eq(" + indice + ")").html("<td class='red'>" + indice + "</td><td colspan='14' class='red'>La chasse n'a pas pu être lancée.</td>");
			if(indice != nbChasse){
				indice++;
				setTimeout(function(){page.envoyerChasse(indice, securite);}, $("#o_chasseInt").val() * 1000) ;
			}
		});
	},
	/**
	* Ajoute les fonctionnalités du compte+. Ajoute les boutons "max", sauvegarde la chasse en cours.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{
		$("#RecolteNourriture").after("<a title='Affecter un maximum d’ouvrière à la nourriture' class='button_max' onclick='javascript:maxNourriture();' href='#max'><img class='o_vAlign' width='23' height='23' src='images/bouton/fleche_haut.gif'/></a>");
		$("#RecolteMateriaux").after("<a title='Affecter un maximum d’ouvrière aux matériaux' class='button_max' onclick='javascript:maxMateriaux();' href='#max'><img class='o_vAlign' width='23' height='23' src='images/bouton/fleche_haut.gif'/></a>");
		// Sauvegarde de la chasse en cours
		var chasse = $("#centre").text().split("Vos chasseuses vont conquérir");
		if((chasse.length - 1) > 0 && (!Utils.data.chasse || moment().diff(moment(Utils.data.expChasse), 's') > 1)){
			var time = chasse[1].split("reste(")[1].split(",")[0], total = 0;
			for(var i = 0, l = chasse.length ; ++i < l ; total += numeral().unformat(chasse[i].split("cm²")[0]));
			this.saveChasse(total, chasse.length - 1, time);
		}
		if($("a:contains('Annuler')").length)
			$("a:contains('Annuler')").click(function(){
				delete Utils.data.expChasse;
				delete Utils.data.chasse;
				delete Utils.data.startChasse;
				localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
			});
		// Affichage du retour des chasses
		$("span[id^=chasse_]").each(function(){$(this).parent().next().after("<span class='small'> Retour le " + moment().add($(this).parent().next().text().split(",")[0].split("(")[1], 's').format("D MMM YYYY à HH[h]mm") + "</span>");});
	},
	/**
	* Sauvegarde la chasse en cours.
    *
	* @private
	* @method saveChasse
	* @param {Integer} quantite
	* @param {Integer} nombre
	* @param {Integer} temps
	* @return
	*/
	saveChasse : function(quantite, nombre, temps)
	{
		Utils.data.expChasse = moment().add(temps, 's');
		Utils.data.chasse = numeral(quantite).format() + " cm² (" + nombre + ")";
		Utils.data.startChasse = moment();
		localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
		if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majChasse();
	}
});
