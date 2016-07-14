/*
 * Attaquer.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
 
/**
* Classe de fonction pour les pages d'attaques.
* 
* @class PageAttaquer
* @constructor
* @extends Page
*/
var PageAttaquer = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe. Récupére l'armée et affiche les outils.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		if($("#formulaireChoixArmee").length){
			armeeAt = new Armee();
			if($("#unite1").length) armeeAt.unite[0] = numeral().unformat($("#unite1").val());
			if($("#unite2").length) armeeAt.unite[1] = numeral().unformat($("#unite2").val());
			if($("#unite3").length) armeeAt.unite[2] = numeral().unformat($("#unite3").val());
			if($("#unite4").length) armeeAt.unite[3] = numeral().unformat($("#unite4").val());
			if($("#unite5").length) armeeAt.unite[4] = numeral().unformat($("#unite5").val());
			if($("#unite6").length) armeeAt.unite[5] = numeral().unformat($("#unite6").val());
			if($("#unite7").length) armeeAt.unite[7] = numeral().unformat($("#unite7").val());
			if($("#unite8").length) armeeAt.unite[8] = numeral().unformat($("#unite8").val());
			if($("#unite9").length) armeeAt.unite[9] = numeral().unformat($("#unite9").val());
			if($("#unite10").length) armeeAt.unite[10] = numeral().unformat($("#unite10").val());
			if($("#unite11").length) armeeAt.unite[12] = numeral().unformat($("#unite11").val());
			if($("#unite12").length) armeeAt.unite[13] = numeral().unformat($("#unite12").val());
			if($("#unite13").length) armeeAt.unite[11] = numeral().unformat($("#unite13").val());
			if($("#unite14").length) armeeAt.unite[6] = numeral().unformat($("#unite14").val());
			resteAttaque = Utils.data.niveauRecherche[6] + 2 - $("#centre").text().split("- Vous allez attaquer").length;
			$("#formulaireChoixArmee").append("<input type='hidden' value='-1' id='o_idCible'/><input type='hidden' value='-1' id='o_coordXCible'/><input type='hidden' value='-1' id='o_coordYCible'/>");
			// Ajout du bouton pour la synchro simple
			$("input[name='ChoixArmee']").before("<button id='o_sync'>Synchroniser</button>");
			
			this.lanceur();	
			this.flooder();
			this.getProfil();
			
			this.css();
			this.event();
		}
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
		$("#o_sondeTable tr:even, #o_infoAtt tr:even").css("background-color", Utils.data.couleur2);
		$("#o_lanceurFlood tr:even, #o_simulationFlood tr:even").css("background-color", Utils.data.couleur2);
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
		$("#o_sync").click(function(event){
			event.preventDefault();
			var attente = 60 - (moment().add(Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(Utils.data.x - ~~$("#o_coordXCible").val(), 2) + Math.pow(Utils.data.y - ~~$("#o_coordYCible").val(), 2))/350)))), 's').seconds() % 60);
			if(attente < 0) attente += 60;
			// Affichage du compte à rebours
			$(this).before("<p>Synchronisation en cours, veuillez attendre : <span id='o_decSyncA'></span>.</p>");
			Utils.decreaseTime(attente, "o_decSyncA");

			setTimeout(function(){$("input[name='ChoixArmee']").click();}, attente * 1000);
		});
		// Event lanceur
		$("#o_nonXp").click(function(){
			$("#unite1").val(numeral(armeeAt.unite[0]).format());
			$("#unite2").val(numeral(armeeAt.unite[1]).format());
			$("#unite4").val(numeral(armeeAt.unite[3]).format());
			$("#unite5").val(numeral(armeeAt.unite[4]).format());
			$("#unite6").val(numeral(armeeAt.unite[5]).format());
			$("#unite7").val(numeral(armeeAt.unite[7]).format());
			$("#unite10").val(numeral(armeeAt.unite[10]).format());
			$("#unite11").val(numeral(armeeAt.unite[12]).format());
			$("#unite3, #unite8, #unite9, #unite12, #unite13, #unite14").val(0);
			page.compileDataAtt();
		});
		$("input[id^=unite]").bind("change paste keyup", function(){
			page.compileDataAtt();
		});
		$(".o_ligneAtt").click(function(){
			$("span[id^=o_infoAtt]").toggle();
			if($(".o_ligneAtt:eq(1) td:eq(0)").text() == "Vie (HB)"){
				$(".o_ligneAtt:eq(1) td:eq(0)").text("Vie (AB)");
				$(".o_ligneAtt:eq(2) td:eq(0)").text("Attaque (AB)");
				$(".o_ligneAtt:eq(3) td:eq(0)").text("Défense (AB)");
			}else{
				$(".o_ligneAtt:eq(1) td:eq(0)").text("Vie (HB)");
				$(".o_ligneAtt:eq(2) td:eq(0)").text("Attaque (HB)");
				$(".o_ligneAtt:eq(3) td:eq(0)").text("Défense (HB)");
			}
		});
		// Event pour les floods
		$("#o_methodeFlood").change(function(){
			if($(this).val() == 1)
				$("#o_floodNbr, #o_floodQte").spinner("disable");
			if($(this).val() == 2)
				$("#o_floodNbr, #o_floodQte").spinner("enable");
			if($(this).val() == 3){
				$("#o_floodQte").spinner("disable");
				$("#o_floodNbr").spinner("enable");
			}
			page.compileDataFlood();
		});
		$("#o_floodNbr, #o_floodQte, #o_floodTDCA, #o_floodTDCB, #o_floodAntiSonde").on("keyup spin", function(event, ui){
			var nombre = ui ? ui.value : $(this).spinner("value");
			$(this).spinner("value", nombre);
			page.compileDataFlood();
		});
		$("input[name='o_allFlood']").change(function(){
			page.compileDataFlood();
		});
		$("#o_lancerFlood").click(function(){
			armeeAt.repUniteFlood();
			// Synchronisation
			if($("input[name=o_syncFlood]:checked").val() == "Oui"){
				var arrive = moment().add(Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(Utils.data.x - ~~$("#o_coordXCible").val(), 2) + Math.pow(Utils.data.y - ~~$("#o_coordYCible").val(), 2))/350)))), 's');
				var attente = 60 - armeeAt.repartition.length - (arrive.seconds() % 60);
				if(attente < 0) attente += 60;
				// Affichage du compte à rebours
				$("#o_retourFlood").html("Synchronisation en cours, veuillez attendre : <span id='o_decSyncF'></span>.");
				Utils.decreaseTime(attente, "o_decSyncF");
				setTimeout(function(){page.envoyerFlood(1, $("#t:last").attr("name") + "=" + $("#t:last").attr("value"));}, attente * 1000);
			}else
				page.envoyerFlood(1, $("#t:last").attr("name") + "=" + $("#t:last").attr("value"));
		});
	},
	/**
	* Formulaire pour lancer une attaque de nimporte qu'elle sorte.
    *
	* @private
	* @method lanceur
	* @return
	*/
	lanceur : function()
	{
		$("#tabChoixArmee tr:eq(0) th:last").append(" <span id='o_nonXp' title='Unités non XP' class='o_nonXp cursor'/>");
		$("#tabChoixArmee").append("<tr class='cursor o_ligneAtt'><td>Nombre d'unité</td><td colspan='3'></td><td class='right' colspan='2'><span id='o_infoNdr'>" + numeral(armeeAt.getSommeUnite()).format() + "</span> <img class='o_vAlign' height='20' src='images/icone/fourmi.png'/></td></tr>"
			+ "<tr class='cursor o_ligneAtt'><td>Vie (AB)</td><td colspan='3'></td><td class='right'><span id='o_infoAtt2'>" + numeral(armeeAt.getTotalVie(Utils.data.niveauRecherche[1], 0, 0)).format() + "</span><span style='display:none' id='o_infoAtt3'>" + numeral(armeeAt.getBaseVie()).format() + "</span> <img class='o_vAlign' height='20' src='images/icone/icone_coeur.gif'/></td></tr>"
			+ "<tr class='cursor o_ligneAtt'><td>Attaque (AB)</td><td colspan='3'></td><td class='right'><span id='o_infoAtt4'>" + numeral(armeeAt.getTotalAtt(Utils.data.niveauRecherche[2])).format() + "</span><span style='display:none' id='o_infoAtt5'>" + numeral(armeeAt.getBaseAtt()).format() + "</span> <img class='o_vAlign' height='20' src='images/icone/icone_degat_attaque.gif'/></td></tr>"
			+ "<tr class='cursor o_ligneAtt'><td>Défense (AB)</td><td colspan='3'></td><td class='right'><span id='o_infoAtt6'>" + numeral(armeeAt.getTotalDef(Utils.data.niveauRecherche[2])).format() + "</span><span style='display:none' id='o_infoAtt7'>" + numeral(armeeAt.getBaseDef()).format() + "</span> <img class='o_vAlign' height='20' src='images/icone/icone_degat_defense.gif'/></td></tr>"
		);
	},
	/**
	* Affiche les données de l'armée selectionné.
    *
	* @private
	* @method compileDataAtt
	* @return
	*/
	compileDataAtt : function()
	{
		var tmp = new Armee();
		tmp.unite = [$("#unite1").length ? numeral().unformat($("#unite1").val()) : 0, $("#unite2").length ? numeral().unformat($("#unite2").val()) : 0, $("#unite3").length ? numeral().unformat($("#unite3").val()) : 0, $("#unite4").length ? numeral().unformat($("#unite4").val()) : 0, $("#unite5").length ? numeral().unformat($("#unite5").val()) : 0, $("#unite6").length ? numeral().unformat($("#unite6").val()) : 0, $("#unite14").length ? numeral().unformat($("#unite14").val()) : 0, $("#unite7").length ? numeral().unformat($("#unite7").val()) : 0, $("#unite8").length ? numeral().unformat($("#unite8").val()) : 0, $("#unite9").length ? numeral().unformat($("#unite9").val()) : 0, $("#unite10").length ? numeral().unformat($("#unite10").val()) : 0, $("#unite13").length ? numeral().unformat($("#unite13").val()) : 0, $("#unite11").length ? numeral().unformat($("#unite11").val()) : 0, $("#unite12").length ? numeral().unformat($("#unite12").val()) : 0];
		$("#o_infoNbr").text(numeral(tmp.getSommeUnite()).format());
		$("#o_infoAtt2").text(numeral(tmp.getTotalVie(Utils.data.niveauRecherche[1], 0, 0)).format());
		$("#o_infoAtt3").text(numeral(tmp.getBaseVie()).format());
		$("#o_infoAtt4").text(numeral(tmp.getTotalAtt(Utils.data.niveauRecherche[2])).format());
		$("#o_infoAtt5").text(numeral(tmp.getBaseAtt()).format());
		$("#o_infoAtt6").text(numeral(tmp.getTotalDef(Utils.data.niveauRecherche[2])).format());
		$("#o_infoAtt7").text(numeral(tmp.getBaseDef()).format());
	},
	/**
	* Formulaire de lancemenet de flood.
    *
	* @private
	* @method flooder
	* @return
	*/
	flooder : function()
	{
		var html = "<fieldset id='o_prepaFlood'><legend><span class='titre'>Lanceur de Flood</span></legend><table id='o_lanceurFlood' cellspacing=0>"
			+ "<tr><td colspan='2'><select id='o_methodeFlood'><option value='1'>Optimisée</option><option value='2'>Uniforme</option><option value='3'>Dégressive</option></select></td></tr>"
			+ "<tr><td>Nombre d'attaques</td><td><input value='0' size='12' id='o_floodNbr'/></td></tr>"
			+ "<tr><td>Quantité par attaque</td><td><input value='0' size='12' id='o_floodQte'/></td></tr>"
			+ "<tr><td>Toute l'armée</td><td><input type='radio' name='o_allFlood' value='Oui' checked/> Oui <input type='radio' name='o_allFlood' value='Non' disabled/> Non</td></tr>"
			+ "<tr><td>Flooder en dôme</td><td><input type='radio' name='o_domeFlood' value='Oui'/> Oui <input type='radio' name='o_domeFlood' value='Non' checked disabled/> Non</td></tr>"
			+ "<tr><td>Synchroniser</td><td><input type='radio' name='o_syncFlood' value='Oui'/> Oui <input type='radio' name='o_syncFlood' value='Non' checked disabled/> Non</td></tr>"
			+ "<tr><td>Retour le</td><td id='o_floodRetour'></td></tr>"
			+ "</table><table id='o_simulationFlood' class='o_maxWidth' cellspacing=0>"
			+ "<tr class='gras'><td>Etape</td><td>Troupes</td><td>Mon Terrain</td><td>Cible</td></tr>"
			+ "<tr><td colspan='2'></td><td><input value='" + Utils.terrain + "' size='12' id='o_floodTDCA'/></td><td><input value='0' size='12' id='o_floodTDCB'/></td></tr>"
			+ "<tr><td>Anti-sonde</td><td><input value='0' size='12' id='o_floodAntiSonde'/></td><td>" + numeral(Utils.terrain).format() + "</td><td>0</td></tr>"
			+ "</table><input id='o_lancerFlood' class='o_marginT15' type='button' value='Flooder' disabled/><p id='o_retourFlood' class='o_marginT0 small'></p></fieldset>";
		$(".simulateur:eq(0)").append(html);
		// lanceur de flood
		$("#o_floodNbr").spinner({min : 0, max : resteAttaque, numberFormat: "i", disabled : true});
		$("#o_floodQte").spinner({min : 0, numberFormat: "i", disabled : true});
		$("#o_floodTDCA, #o_floodTDCB, #o_floodAntiSonde").spinner({min : 0, numberFormat: "i"});
	},
	/**
	* Lance une simulation si les données saisies sont correctes.
    *
	* @private
	* @method compileDataFlood
	* @return
	*/
	compileDataFlood : function()
	{
		var tdcAtt   = $("#o_floodTDCA").spinner("value");
		var tdcCible = $("#o_floodTDCB").spinner("value");
		// Si la cible est à porter
		if(tdcCible >= (tdcAtt * 0.5) && tdcCible <= (tdcAtt * 3)){
			$("#o_lancerFlood, #o_methodeFlood, input[name='o_syncFlood'], input[name='o_allFlood'], input[name='o_domeFlood']").removeAttr("disabled");
			$("#o_floodTDCA, #o_floodTDCB, #o_floodAntiSonde").spinner("enable");
			var methode = $("#o_methodeFlood").val();
			var nbFlood = $("#o_floodNbr").spinner("value");
			var qteFlood = $("#o_floodQte").spinner("value");
			var antisonde = $("#o_floodAntiSonde").spinner("value");
			var unite = $("input[name=o_allFlood]:checked").val() == "Oui";
			var simu = armeeAt.simulerFlood(tdcAtt, tdcCible, methode, nbFlood, qteFlood, antisonde, unite, resteAttaque);
			this.afficherSimulation(tdcAtt, tdcCible, simu);
			$("#o_floodNbr").spinner("value", simu.length - 1);
		}else{
			$("#o_simulationFlood tr:gt(2)").each(function(){$(this).remove();});
			$("#o_simulationFlood").append("<tr><td colspan='4' class='red'>Cible hors de portée !</td></tr>");
		}
	},
	/**
	* Affiche le resultat de la simulation.
    *
	* @private
	* @method afficherSimulation
	* @param {Integer} tdcAtt
	* @param {Integer} tdcCible
	* @param {Array} repartition
	* @return
	*/
	afficherSimulation : function(tdcAtt, tdcCible, repartition)
	{
		// On supprime l'ancienne simulation
		$("#o_simulationFlood tr:gt(2)").each(function(){$(this).remove();});
		//Affichage de l'anti sonde
		$("#o_simulationFlood tr:eq(2) td:eq(2)").text(numeral($("#o_floodTDCA").spinner("value") + repartition[0]).format());
		$("#o_simulationFlood tr:eq(2) td:eq(3)").text(numeral($("#o_floodTDCB").spinner("value") - repartition[0]).format());
		var priseMax = Math.floor(tdcCible * 0.2);
		if(repartition[0] > priseMax){
			tdcAtt += priseMax;
			tdcCible -= priseMax;
		}else{
			tdcAtt += repartition[0];
			tdcCible -= repartition[0];
		}
		// Affichage de tout les floods
		var simulation = "";
		for(var i = 1, nbFlood = repartition.length ; i < nbFlood ; i++){
			simulation += "<tr><td>" + i + "</td>";
			var pourcentage = Math.ceil(repartition[i] * 100 / tdcCible);
			if(pourcentage > 20) pourcentage = 20;
			simulation += "<td>" + numeral(repartition[i]).format() + " (" + pourcentage + " %)</td>";
			var priseMax = Math.floor(tdcCible * 0.2);
			if(tdcCible < (tdcAtt * 0.5)){
				if(repartition[i] > priseMax){
					tdcAtt += priseMax;
					tdcCible -= priseMax;
				}else{
					tdcAtt += repartition[i];
					tdcCible -= repartition[i];
				}
				simulation += "<td colspan='2'>Cible hors de portée !</td></tr>";
			}else{
				if(repartition[i] > priseMax)
					simulation += "<td>" + numeral(tdcAtt += priseMax).format() + "</td><td>" + numeral(tdcCible -= priseMax).format() + "</td></tr>";
				else
					simulation += "<td>" + numeral(tdcAtt += repartition[i]).format() + "</td><td>" + numeral(tdcCible -= repartition[i]).format() + "</td></tr>";
			}
		}
		$("#o_simulationFlood").append(simulation);
		// Style preferentiel
		$("#o_simulationFlood tr:even").css("background-color", Utils.data.couleur2);
	},
	/**
	* Envoie un flood.
    *
	* @private
	* @method envoyerFlood
	* @param {Integer} indice
	* @param {String} securite
	* @return 
	*/
	envoyerFlood : function(indice, securite)
	{
		// Si il n'y a pas d'antisonde
		if(!_.sum(armeeAt.repartition[0])){
			armeeAt.repartition.splice(0, 1);
			indice++;
			$("#o_simulationFlood tr:eq(2)").html("<td>Anti-sonde</td><td colspan='3'>Pas d'anti-sonde</td>");
		}
		var donnees = {};
		donnees["" + securite.split("=")[0]] = securite.split("=")[1];
		donnees["ChoixArmee"] = "1";
		donnees["lieu"] = $("input[name=o_domeFlood]:checked").val() == "Oui" ? "2" : "1";
		donnees["pseudoCible"] = $("input[name=pseudoCible]").val();
		donnees["unite1"] = armeeAt.repartition[0][0];
		donnees["unite2"] = armeeAt.repartition[0][1];
		donnees["unite3"] = armeeAt.repartition[0][2];
		donnees["unite4"] = armeeAt.repartition[0][3];
		donnees["unite5"] = armeeAt.repartition[0][4];
		donnees["unite6"] = armeeAt.repartition[0][5];
		donnees["unite7"] = armeeAt.repartition[0][7];
		donnees["unite8"] = armeeAt.repartition[0][8];
		donnees["unite9"] = armeeAt.repartition[0][9];
		donnees["unite10"] = armeeAt.repartition[0][10];
		donnees["unite11"] = armeeAt.repartition[0][12];
		donnees["unite12"] = armeeAt.repartition[0][13];
		donnees["unite13"] = armeeAt.repartition[0][11];
		donnees["unite14"] = armeeAt.repartition[0][6];
		armeeAt.repartition.splice(0, 1);
		// Requete
		$.post("/ennemie.php?Attaquer=" + $("#o_idCible").val(), donnees, function(data){
			var parsed = $("<div/>").append(data);
			var res = parsed.find("center:last").text();
			$("#o_simulationFlood tr:eq(" + (indice + 1) + ")").html("<td>" + (indice - 1) + "</td><td colspan='3' class='" + (res.indexOf("Vos troupes sont en marche") == -1 ? "red" : "green") + "'>" + res + "</td>");
			indice++;
			if(armeeAt.repartition.length != 0)
				setTimeout(function(){page.envoyerFlood(indice, securite);}, 1000);
		});
	},
	/**
	* Récupére le profil de la cible.
    *
	* @private
	* @method getProfil
	* @return 
	*/
	getProfil : function()
	{
		$.ajax({
			url     : "/Membre.php?Pseudo=" + $("input[name=pseudoCible]").val(),
			success : function(data){
				var regexp = new RegExp("x=(\\d*) et y=(\\d*)");
				var ligne  = $(data).find(".boite_membre a[href^='carte2.php?']").text();
				$("#o_coordXCible").val(~~(ligne.replace(regexp, "$1")));
				$("#o_coordYCible").val(~~(ligne.replace(regexp, "$2")));
				$("#o_idCible").val($(data).find("a[href^='commerce.php?ID=']").attr("href").match(/\d+/g)[0]);
				$("#o_floodTDCB").spinner("value", numeral().unformat($(data).find(".tableau_score tr:eq(1) td:eq(1)").text()));
				var temps = Math.ceil(Math.pow(0.9, Utils.data.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(Utils.data.x - ~~(ligne.replace(regexp, "$1")), 2) + Math.pow(Utils.data.y - ~~(ligne.replace(regexp, "$2")), 2))/350))));
				$("#o_simulationFlood tr:eq(0) td:eq(3)").text($("input[name=pseudoCible]").val() + " (" + Utils.intToTime(temps) + ")");
				$("#o_floodRetour").text(moment().add(temps, 's').format("D MMM à HH[h]mm[m]ss[s]"));
				page.compileDataFlood();
			}
		});
	}
});
