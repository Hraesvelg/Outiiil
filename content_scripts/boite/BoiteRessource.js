/*
 * BoiteRessource.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
 
/**
* Classe pour gérer ses ressources rapidement.
* 
* @class BoitePreference
* @constructor
* @extends Boite
*/
var BoiteRessource = Boite.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		this.html = "<div id='o_tabsRessource' class='o_tabs'>"
			+ "<ul><li><a href='#o_tabsRessource1'>Récap</a></li><li><a href='#o_tabsRessource2'>Commande</a></li><li><a href='#o_tabsRessource3'>Echange</a></li></ul>"
			// Boite gestion globale
			+ "<div id='o_tabsRessource1'></div>"
			// Boite utilitaire
			+ "<div id='o_tabsRessource2'>" + (Utils.data.utility ? "<div id='o_listeConvoi'></div><div id='o_listeCommande'></div>" : "<p class='o_messNonC'>Un utilitaire compatible avec Outiiil est necessaire pour utiliser cette fonctionnalité.</p>") + "</div>"
			// Boite de Echange
			+ "<div id='o_tabsRessource3'><p class='o_messNonC'>Cette section est en cours de développement.</p></div>"
			+ "</div>";
		$("#o_boiteRessource").append(this.html);
		$("#o_tabsRessource").tabs();
		$("#o_tabsRessource").removeClass("ui-widget");
		
		this.ressource();
		if(Utils.data.utility){
			this.livraison();
			this.demande();
			Utils.getCommande(this);
		}
		
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
		$(".o_tabs > .ui-widget-header").css("border-bottom-color", Utils.data.couleur2);
		$(".o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", Utils.data.couleur2);
		$("#o_tableRess tr:nth-child(3n-2) td:first-child").css("border-bottom-color", Utils.data.couleur2);
		$("#o_tableLivraison tr:even").css("background-color", Utils.data.couleur2); 
		$("#o_tableCommande tr:even").css("background-color", Utils.data.couleur2); 
		$("#o_listeCommande table tr:not(.o_commandeHidden):even").css("background-color", Utils.data.couleur2); 
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
		
	},
	/**
	* Affiche un tableau récapitulatif des ressources et ajoute la possibilité de les gérer.
    *
	* @private
	* @method ressource
	* @return
	*/
	ressource : function()
	{
		var html = "<table id='o_tableRess' class='left'>"
			+ "<tr><td><img height='20' src='images/icone/icone_ouvriere.png' alt='Ouvrière' /></td><td rowspan='3'><div id='o_gaugeOuv' class='o_gaugeRess'></div></td></tr><tr><td>Nombre : " + numeral(Utils.ouvrieres).format() + "</td></tr><tr><td>Occupé : <span></span></td></tr>"
			+ "<tr><td style='padding-top:20px;'><img height='20' src='images/icone/icone_pomme.png' alt='Nourriture'/></td><td rowspan='3' style='padding-top:20px;'><div id='o_gaugeNou' class='o_gaugeRess'></div></td></tr><tr><td>Quantité : " + numeral(Utils.nourriture).format() + "</td></tr><tr><td>Production : <span></span> <a class='cursor o_changeRess'><img height='14' src='images/icone/move.png' alt='Actualiser'/></a></td></tr>"
			+ "<tr><td style='padding-top:20px;'><img height='20' src='images/icone/icone_bois.png' alt='Materiaux'/></td><td rowspan='3' style='padding-top:20px;'><div id='o_gaugeMat' class='o_gaugeRess'></div></td></tr><tr><td>Quantité : " + numeral(Utils.materiaux).format() + "</td></tr><tr><td>Production : <span></span> <a class='cursor o_changeRess'><img height='14' src='images/icone/move.png' alt='Actualiser'/></a></td></tr>"
			+ "<tr><td style='padding-top:20px;'><img height='20' src='images/icone/icone_tdc.png' alt='Terrain'/></td><td rowspan='3' style='padding-top:20px;'><div id='o_gaugeTer' class='o_gaugeRess'></div></td></tr><tr><td>Surface :  " + numeral(Utils.terrain).format() + " cm²</td></tr><tr><td>Non couvert : <span></span> cm²</td></tr>"
			+ "</table>"
			+ "<div id='o_dialogRess' title='Modifier vos récoltes'><p class='o_dialogMess'></p><table><tr><td><img height='20' src='images/icone/icone_pomme.png' alt='Nourriture'/></td><td><input id='o_ouvriereNourriture' name='nourriture' value='0' size='15'/></td></tr><tr><td><img height='20' src='images/icone/icone_bois.png' alt='Materiaux'/></td><td><input id='o_ouvriereMateriaux' name='materiaux' value='0' size='15'></td></tr></table></div>";
		$("#o_tabsRessource1").append(html);
		// Completion des valeurs
		this.gaugeRessource("o_gaugeOuv", "rgba(11, 137, 4, 0.9)", "rgba(11, 137, 4, 0.1)", "{y:.0f}%");
		this.gaugeRessource("o_gaugeNou", "rgba(254, 46, 46, 0.9)", "rgba(254, 46, 46, 0.1)", "{y}%");
		this.gaugeRessource("o_gaugeMat", "rgba(173, 87, 47, 0.9)", "rgba(173, 87, 47, 0.1)", "{y}%");
		$("#o_gaugeTer").highcharts({
			chart : {
				type: "solidgauge",
				backgroundColor : null,
				spacing : [0, 0, 0, 10],
			},
			title : null,
			tooltip : {enabled : false},
			credits : {enabled : false},
			pane : {
				size : "100%",
				startAngle : -90,
				endAngle : 180,
				background : {
					backgroundColor : "rgba(11, 137, 4, 0.1)",
					innerRadius : "80%",
					outerRadius : "100%",
					shape : "arc",
					borderColor : "transparent"
				}
			},
			yAxis : {
				min : 0,
				max : 100,
				minorTickInterval : null,
				tickWidth : 0,
				gridLineWidth : 0,
				lineWidth : 0,
				labels : {enabled : false},
				title : {enabled : false}
			},
			plotOptions : {
				solidgauge : {
					innerRadius : "80%",
				}
			},
			series : [{
				data : [{y : 0, color : "rgba(254, 46, 46, 0.9)"}],
				dataLabels : {
					format : "<span style='font-size:1.2em;position:relative;left:-20px;top:-17px;'>{y}%</span>",
					borderWidth : 0,
					useHTML : true
				},
				zIndex : 2
			},{
				data : [{y : 0, color : "rgba(173, 87, 47, 0.9)"}],
				dataLabels : {
					formatter : function(){
						return "<span style='font-size:1.2em;position:relative;left:-20px;top:-5px;'>" + (this.y - $("#o_gaugeTer").highcharts().series[0].data[0].y) + "%</span>";                             
					},
					borderWidth : 0,
					useHTML : true
				},
				zIndex : 1
			}]
		});
		this.dialogRessource();
		this.getRessource();
	},
	/**
	* Creer une gauge highchart en 3/4 de cercle.
    *
	* @private
	* @method gaugeRessource
	* @param {String} id
	* @param {String} fcolor
	* @param {String} bcolor
	* @param {String} format
	* @return
	*/
	gaugeRessource : function(id, fcolor, bcolor, format)
	{
		$("#" + id).highcharts({
			chart : {
				type: "solidgauge",
				backgroundColor : null,
				spacing : [0, 0, 0, 10],
			},
			title : null,
			tooltip : {enabled : false},
			credits : {enabled : false},
			pane : {
				size : "100%",
				startAngle : -90,
				endAngle : 180,
				background : {
					backgroundColor : bcolor, 
					innerRadius : "80%", 
					outerRadius : "100%", 
					shape : "arc", 
					borderColor : "transparent"
				}
			},
			yAxis : {
				min : 0,
				max : 100,
				minorTickInterval : null,
				tickWidth : 0,
				gridLineWidth : 0,
				lineWidth : 0,
				labels : {enabled : false},
				title : {enabled : false},
			},
			plotOptions : {solidgauge : {innerRadius : "80%",}},
			series : [{
				data : [{y : 0, color : fcolor}],
				dataLabels : {
					format : "<span style='font-size:1.2em;position:relative;left:-20px;top:-15px;'>" + format + "</span>",
					borderWidth : 0,
					useHTML : true
				}
			}]
		});
	},
	/**
	* Fenetre popup pour modifier le placement des ouvrières.
    *
	* @private
	* @method dialogRessource
	* @return
	*/
	dialogRessource : function()
	{
		// Dialog de gestion des ressources
		this.dialogRess = $("#o_dialogRess").dialog({
			autoOpen : false,
			height : "auto",
			width : 280,
			buttons : {
				"Modifier" : function(){
					$.post("/Ressources.php", {RecolteNourriture : $("#o_ouvriereNourriture").spinner("value"), RecolteMateriaux : $("#o_ouvriereMateriaux").spinner("value"), ChangeRessource : "Valider" }, function(data){
						$("#o_dialogRess .o_dialogMess").text("Changement effectué").addClass("ui-state-highlight");
						setTimeout(function(){$("#o_dialogRess .o_dialogMess").removeClass("ui-state-highlight", 1500);}, 500);
						var parsed = $("<div/>").append(data);
						boiteRessource.afficherRessource(parseInt(parsed.find("#RecolteMateriaux").val()), parseInt(parsed.find("#RecolteNourriture").val()));
					});
				},
				"Fermer" : function(){$(this).dialog("close");}
			}
		});
		// le clique sur la fleche ouvre le dialog
		// les input à l'interieur sont des spinners numeriques
		$(".o_changeRess").click(function(){boiteRessource.dialogRess.dialog("open");});
		$("#o_ouvriereMateriaux, #o_ouvriereNourriture").spinner({min : 0, max : Math.min(Utils.ouvrieres, Utils.terrain), numberFormat : "i"});
		$("#o_ouvriereMateriaux, #o_ouvriereNourriture").on("keyup spin", function(event, ui){
			var value = ui ? ui.value : $(this).spinner("value");
			if(value > Math.min(Utils.ouvrieres, Utils.terrain))
				value = Math.min(Utils.ouvrieres, Utils.terrain);
			var id = $(this).attr("id") == "o_ouvriereMateriaux" ? "o_ouvriereNourriture" : "o_ouvriereMateriaux";
			var nbOuvOcc = $("#" + id).spinner("value");
			// si j'ai des ouvriéres libre et du terrain libre
			if((Utils.ouvrieres - nbOuvOcc - value) >= 0 && (Utils.terrain - nbOuvOcc - value) >= 0)
				$(this).spinner("value", value);
			else if(nbOuvOcc > 0){  								// sinon je recupére des ouvriéres de l'autre ressource
				$(this).spinner("value", value);
				$("#" + id).spinner("value", Math.min(Utils.ouvrieres, Utils.terrain) - value);
			}else 													// sinon je bloque
				return false;
		});
	},
	/**
	* Récupére les valeurs pour gérer les ressources.
    *
	* @private
	* @method getRessource
	* @return
	*/
	getRessource : function()
	{
		var self = this;
		$.get("/Ressources.php", function(data){
			var parsed = $("<div/>").append(data);
			self.afficherRessource(parseInt(parsed.find("#RecolteMateriaux").val()), parseInt(parsed.find("#RecolteNourriture").val()));
		});
	},
	/**
	* Met à jour les données ressources.
    *
	* @private
	* @method afficherRessource
	* @param {Integer} nbMat
	* @param {Integer} nbNou
	* @return 
	*/
	afficherRessource : function(nbMat, nbNou)
	{
		// Données sur les ouvrieres
		$("#o_tableRess td:eq(3) span").text(numeral(nbMat + nbNou).format());
		$("#o_gaugeOuv").highcharts().series[0].data[0].update(((nbMat + nbNou) / Utils.ouvrieres * 100));    
		// Données sur la nourriture
		$("#o_tableRess td:eq(7) span").text("+" + numeral(nbNou).format());
		$("#o_gaugeNou").highcharts().series[0].data[0].update(Math.round($(".jauge_nourriture:eq(0)").width() * 100 / $(".jauge_nourriture:eq(0)").parent().width()));  
		$("#o_ouvriereNourriture").spinner("value", nbNou);
		// Données sur les materiaux
		$("#o_tableRess td:eq(11) span").text("+" + numeral(nbMat).format());
		$("#o_gaugeMat").highcharts().series[0].data[0].update(Math.round($(".jauge_materiaux:eq(0)").width() * 100 / $(".jauge_materiaux:eq(0)").parent().width()));  
		$("#o_ouvriereMateriaux").spinner("value", nbMat);
		// Données sur le terrain 
		$("#o_tableRess td:eq(15) span").text(numeral(Utils.terrain - nbNou - nbMat).format());
		$("#o_gaugeTer").highcharts().series[0].data[0].update(Math.round(nbNou / Utils.terrain * 100));
		$("#o_gaugeTer").highcharts().series[1].data[0].update(Math.round((nbNou + nbMat) / Utils.terrain * 100));  
	},
	/**
	* Affiche le formulaire pour envoyer des ressources à quelqu'un.
    *
	* @private
	* @method livraison
	* @return
	*/
	livraison : function()
	{
		var html = "<table id='o_tableLivraison'><tr><td colspan='3'><strong>Envoyer des ressources</strong></td></tr>"
			+ "<tr><td><img alt='nourriture' src='images/icone/icone_pomme.png' width='20'></td><td id='o_maxNourritureConvoi' class='cursor'>Nourritures</td><td><input id='o_nourritureConvoi' placeholder='Nourritures' size='18'/></td></tr>"
			+ "<tr><td><img alt='materiaux' src='images/icone/icone_bois.png' width='20'></td><td id='o_maxMateriauxConvoi' class='cursor'>Materiaux</td><td><input id='o_materiauxConvoi' placeholder='Materiaux' size='18'/></td></tr>"
			+ "<tr><td><img alt='ouvrieres' src='images/icone/icone_ouvriere.png' width='20'></td><td>Ouvrières</td><td><input id='o_ouvriereConvoi' placeholder='Ouvrières' size='18'/></td></tr>"
			+ "<tr><td colspan='3'><input type='hidden' id='o_idCommandeConvoi' value='-1'/><input id='o_pseudoConvoi' class='o_width196px' type='text' placeholder='Destinataire'/> <button id='o_livrerConvoi'>Livrer</button></td></tr></table>";
		$("#o_tabsRessource1").append(html);
		// Formatage des spinners
		if(Utils.comptePlus)
			$("#o_pseudoConvoi").autocomplete({
				source : "commerce.php",
				delai : 0,
				position : {my:"left top", at:"left bottom"},
				minLength : 1,
				select : function(event, ui){/*click sur un pseudo declenche le l'action valider*/}
			}).data("ui-autocomplete")._renderItem = function(ul, item){
				var style = "";
				if (item.type.indexOf("pseudo_exact") != -1) {style+=" font-weight:bold;";}
				if (item.type.indexOf("mes_amis") != -1) {style+=" font-style:italic;";}
				if (item.type.indexOf("mon_alliance") != -1) {style+=" color:#0d7405;";}
				if (item.type.indexOf("mes_alliances_amies") != -1) {style+=" color:#0000FF;";}
				if (item.type.indexOf("mes_ennemis") != -1) {style+=" color:#c5130f;";}
				return $("<li>").append('<a style="'+style+'">'+ item.value_avec_html + "</a>").appendTo(ul);
			};
		var capa_livraison = Math.floor(Utils.ouvrieres * (10 + (Utils.data.niveauConstruction[11] / 2)));
		$("#o_nourritureConvoi, #o_materiauxConvoi").spinner({min : 0, max : capa_livraison, numberFormat : "i"});
		$("#o_nourritureConvoi").on("keyup spin", function(event, ui){
			var nb = ui ? ui.value : $(this).spinner("value");
			// mise à jour du nombre d'ouvriere
			$("#o_ouvriereConvoi").spinner("value", Math.ceil((nb + $("#o_materiauxConvoi").spinner("value")) / (10 + (Utils.data.niveauConstruction[11] / 2))));
			$(this).spinner("value", nb);
		});
		$("#o_materiauxConvoi").on("keyup spin", function(event, ui){
			var nb = ui ? ui.value : $(this).spinner("value");
			// mise à jour du nombre d'ouvriere
			$("#o_ouvriereConvoi").spinner("value", Math.ceil((nb + $("#o_nourritureConvoi").spinner("value")) / (10 + (Utils.data.niveauConstruction[11] / 2))));
			$(this).spinner("value", nb);
		});
		$("#o_ouvriereConvoi").spinner({min : 0, max : Utils.ouvrieres, numberFormat : "i"});
		$("#o_ouvriereConvoi").on("keyup spin", function(event, ui){
			var nb = ui ? ui.value : $(this).spinner("value");
			// mise à jour du nombre d'ouvriere
			$("#o_nourritureConvoi").spinner("value", Math.floor(nb * (10 + (Utils.data.niveauConstruction[11] / 2)) / 2));
			$("#o_materiauxConvoi").spinner("value", Math.floor(nb * (10 + (Utils.data.niveauConstruction[11] / 2)) / 2));
			$(this).spinner("value", nb);
		});
		$("#o_maxNourritureConvoi").click(function(){
			$("#o_materiauxConvoi").spinner("value", 0);
			var max_capa = Math.floor((Utils.ouvrieres - Utils.terrain) * (10 + (Utils.data.niveauConstruction[11] / 2)));
			if(max_capa > $("#o_nourritureConvoi").spinner("value")){
				$("#o_nourritureConvoi").spinner("value", max_capa);
				$("#o_ouvriereConvoi").spinner("value", Utils.ouvrieres - Utils.terrain);
			}else
				$("#o_nourritureConvoi, #o_ouvriereConvoi").spinner("value", 0);
		});
		$("#o_maxMateriauxConvoi").click(function(){
			$("#o_nourritureConvoi").spinner("value", 0);
			var max_capa = Math.floor((Utils.ouvrieres - Utils.terrain) * (10 + (Utils.data.niveauConstruction[11] / 2)));
			if(max_capa > $("#o_materiauxConvoi").spinner("value")){
				$("#o_materiauxConvoi").spinner("value", max_capa);
				$("#o_ouvriereConvoi").spinner("value", Utils.ouvrieres - Utils.terrain);
			}else
				$("#o_materiauxConvoi, #o_ouvriereConvoi").spinner("value", 0);
		});
		$("#o_livrerConvoi").click(function(){
			var securite = sessionStorage.getItem("outiiil_securite_convoi");
			if(!securite){
				$.ajax({
					url     : "/commerce.php",
					async   : false,
					success : function(data){
						var parsed = $("<div/>").append(data);
						securite = parsed.find("#t").attr("name") + "=" + parsed.find("#t").attr("value");
						sessionStorage.setItem("outiiil_securite_convoi", securite);
					}
				});
			}
			var donnees = {};		
			donnees["convoi"] = "1";
			donnees["pseudo_convoi"] = $("#o_pseudoConvoi").val();
			donnees["nbMateriaux"] = $("#o_materiauxConvoi").spinner("value");
			donnees["nbNourriture"] = $("#o_nourritureConvoi").spinner("value");
			donnees["" + securite.split("=")[0]] = securite.split("=")[1];
			$.post("/commerce.php", donnees, function(data){
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
			});
		});
	},
	/**
	* Affiche un formulaire pour effectuer des demandes de ressources (necessite un utilitaire).
    *
	* @private
	* @method demande
	* @return 
	*/
	demande : function()
	{
		var html = "<table id='o_tableCommande' class='o_marginT15'><tr><td colspan='2'><strong>Demander des ressources</strong></td></tr>"
			+ "<tr><td>Évolution</td><td><select class='o_width196px'>'"
				+ "<option value='0'>" + Utils.nomConstruction[0] + "</option>"
				+ "<option value='1'>" + Utils.nomConstruction[1] + "</option>"
				+ "<option value='2'>" + Utils.nomConstruction[2] + "</option>"
				+ "<option value='3'>" + Utils.nomConstruction[3] + "</option>"
				+ "<option value='4'>" + Utils.nomConstruction[4] + "</option>"
				+ "<option value='5'>" + Utils.nomConstruction[5] + "</option>"
				+ "<option value='6'>" + Utils.nomConstruction[6] + "</option>"
				+ "<option value='7'>" + Utils.nomConstruction[7] + "</option>"
				+ "<option value='8'>" + Utils.nomConstruction[8] + "</option>"
				+ "<option value='9'>" + Utils.nomConstruction[9] + "</option>"
				+ "<option value='10'>" + Utils.nomConstruction[10] + "</option>"
				+ "<option value='11'>" + Utils.nomConstruction[11] + "</option>"
				+ "<option value='12'>" + Utils.nomConstruction[12] + "</option>"
				+ "<option value='13'>" + Utils.nomRecherche[0] + "</option>"
				+ "<option value='14'>" + Utils.nomRecherche[1] + "</option>"
				+ "<option value='15'>" + Utils.nomRecherche[2] + "</option>"
				+ "<option value='16'>" + Utils.nomRecherche[3] + "</option>"
				+ "<option value='17'>" + Utils.nomRecherche[4] + "</option>"
				+ "<option value='18'>" + Utils.nomRecherche[5] + "</option>"
				+ "<option value='19'>" + Utils.nomRecherche[6] + "</option>"
				+ "<option value='20'>" + Utils.nomRecherche[7] + "</option>"
				+ "<option value='21'>" + Utils.nomRecherche[8] + "</option>"
				+ "<option value='21'>" + Utils.nomRecherche[9] + "</option>"
			+ "</select></td></tr>"
			+ "<tr><td>Pour le*</td><td><input id='o_dateCommande' class='o_width196px' type='text' placeholder='AAAA-MM-JJ'/></td></tr>"
			+ "<tr><td colspan=2>Entrepôt prêt ? <input type='radio' name='o_pretCommande' value='oui' checked> Oui <input type='radio' name='o_pretCommande' value='non'> Non</td></tr>"
			+ "<tr><td colspan=2><input type='button' id='o_commander' value='Demander'/></td></tr></table>"; 
		$("#o_tabsRessource1").append(html);
		// Event
		$("#o_dateCommande").datepicker({dateFormat : "yy-mm-dd", minDate : 0});
		$("input[name='o_pretCommande']:radio").change(function(){
			$(this).parent().parent().html("<td>Après le</td><td><input id='o_apresCommande' class='o_width196px' type='text' placeholder='AAAA-MM-JJ'/></td>");
			$("#o_apresCommande").datepicker({dateFormat : "yy-mm-dd", minDate : 0});
		});
		//$("#evoDemande").val(utils.extractUrlParams()["e"] ? utils.extractUrlParams()["e"] : 0);
		/*var data = null, dateFin = new Date();
		if($("#evoDemande").val() < 13){
			if(data = localStorage.getItem("outiiil_construction")){
				var values = JSON.parse(data);
				if(values["timestamp"])	dateFin = new Date(values["timestamp"]);
			}
			$("#dateDemande").val(dateFin.getFullYear() + "-" + utils.datetimeFormat(dateFin.getMonth() + 1) + "-" + utils.datetimeFormat(dateFin.getDate()));
		}else{
			if(data = localStorage.getItem("outiiil_laboratoire")){
				var values = JSON.parse(data);
				if(values["timestamp"])	dateFin = new Date(values["timestamp"]);
			}
			$("#dateDemande").val(dateFin.getFullYear() + "-" + utils.datetimeFormat(dateFin.getMonth() + 1) + "-" + utils.datetimeFormat(dateFin.getDate()));
		}
		$("#evoDemande").change(function(){
			var data = null, dateFin = new Date();
			if($("#evoDemande").val() < 13){
				if(data = localStorage.getItem("outiiil_construction")){
					var values = JSON.parse(data);
					if(values["timestamp"])	dateFin = new Date(values["timestamp"]);
				}
				$("#dateDemande").val(dateFin.getFullYear() + "-" + utils.datetimeFormat(dateFin.getMonth() + 1) + "-" + utils.datetimeFormat(dateFin.getDate()));
			}else{
				if(data = localStorage.getItem("outiiil_laboratoire")){
					var values = JSON.parse(data);
					if(values["timestamp"])	dateFin = new Date(values["timestamp"]);
				}
				$("#dateDemande").val(dateFin.getFullYear() + "-" + utils.datetimeFormat(dateFin.getMonth() + 1) + "-" + utils.datetimeFormat(dateFin.getDate()));
			}
		});
		$("#envoyer").click(function(){utilitaire.ajouterCommande($("#evoDemande").val(), $("#dateDemande").val(), $("#dateDebut").val());});*/
	}
});
