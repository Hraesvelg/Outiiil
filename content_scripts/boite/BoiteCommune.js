/*
 * BoiteCommune.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe pour la gestion des différents outils globals à fourmizzz.
* 
* @class BoiteDroite
* @constructor
* @extends Boite
*/
var BoiteDroite = Boite.extend({
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		this.html = "<div>"
			+ "<div id='o_menuPonte' class='o_item'><span></span>Unité</div><div id='o_boitePonte' class='o_contentElement'><span class='o_titreElement'>Lanceur de Ponte</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuRessource' class='o_item'><span></span>Ressource</div><div id='o_boiteRessource' class='o_contentElement'><span class='o_titreElement'>Gestion des Ressources</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuChasse' class='o_item'><span></span>Chasse</div><div id='o_boiteChasse' class='o_contentElement'><span class='o_titreElement'>Outils pour Chasseur</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuCombat' class='o_item'><span></span>Combat</div><div id='o_boiteCombat' class='o_contentElement'><span class='o_titreElement'>Outils d'Attaque</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuPreference' class='o_item'><span></span>Paramètre</div><div id='o_boitePreference' class='o_contentElement'><span class='o_titreElement'>Préférences</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "</div>";
		$("body").append(this.html);
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
		$(".o_contentElement").css("background-color", Utils.data.couleur1); 
		$(".o_closeElement b:nth-child(1)").css("border-top-color", Utils.data.couleur1);
		$(".o_closeElement b:nth-child(2)").css("border-left-color", Utils.data.couleur1);
		$(".o_closeElement b:nth-child(3)").css("border-bottom-color", Utils.data.couleur1);
		$(".o_closeElement b:nth-child(4)").css("border-right-color", Utils.data.couleur1);
		$(".o_item, .o_closeElement").css("background-color", Utils.data.couleur2);
		$(".o_item, .o_contentElement").css("border-left-color", Utils.data.couleur3);
		$(".o_item, .o_contentElement").css("border-top-color", Utils.data.couleur3);
		$(".o_item, .o_contentElement").css("border-bottom-color", Utils.data.couleur3);
		$(".o_closeElement").hover(
			function(){
				$(this).animate({backgroundColor : "#bb3333"}, 400);
			}, function(){
				$(this).animate({backgroundColor : Utils.data.couleur2}, 400);
			}
		);
		$(".o_item").hover(
			function(){
				$(this).animate({borderLeftColor : "#f6e497", borderTopColor : "#f6e497", borderBottomColor : "#f6e497"}, {queue : false, duration : 400});
			}, function(){
				$(this).animate({borderLeftColor : Utils.data.couleur3, borderTopColor : Utils.data.couleur3, borderBottomColor : Utils.data.couleur3}, {queue : false, duration : 400});
			}
		);
		$(".o_contentElement, .o_contentElement table").css("color", Utils.data.couleur4);
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
		$(".o_item").click(function(){
			boite.show($(this).attr("id"), $(this).next().attr("id"));
		});
		$(".o_closeElement").click(function(){
			boite.hide($(this).parent().prev().attr("id"), $(this).parent().attr("id"));
		});
	},
	/**
	* Affiche la boite demandé avec un effet de slide.
    *
	* @private
	* @method show
	* @param {String} item
	* @param {String} boite
	* @return
	*/
	show : function(item, boite)
	{
		// Si on reclique sur l'item 
        $(".active.o_item").css("z-index", 101);
        $(".active.o_contentElement").css("z-index", 100);
		$("#" + item).css("z-index", 501);
		$("#" + boite).css("z-index", 500);
		// si la boite est caché on decale pour afficher
        //&& !$("#" + item).is(':animated')
		if($("#" + item).css("margin-right") == "0px"){
			$("#" + item).animate({marginRight : "800px"}, "slow", "easeInOutQuart");
			$("#" + boite).animate({marginRight : "0px"}, "slow", "easeInOutQuart");
			$("#" + item + ", #" + boite).addClass("active");
			// si la boite a deja été chargé
			if($("#" + boite).children().length < 3){
				switch(item){
					case "o_menuPonte" :
						boitePonte = new BoitePonte();
						break;
					case "o_menuRessource" :
						boiteRessource = new BoiteRessource();
						break;
					case "o_menuChasse" :
						boiteChasse = new BoiteChasse();
						break;
					case "o_menuCombat" :
						boiteCombat = new BoiteCombat();
						break;
					case "o_menuPreference" :
						boitePreference = new BoitePreference();
						break;
					default :
						break;
				}
			}
		}
	},
	/**
	* Cache la boite avec un effet de slide.
    *
	* @private
	* @method hide
	* @param {String} item
	* @param {String} boite
	* @return 
	*/
	hide : function(item, boite)
	{
		$("#" + item).animate({marginRight : "0px"}, "slow", "easeInOutQuart", function(){
			$("#" + item).css("z-index", 2000);
			$("#" + boite).css("z-index", 1000);
		});
		$("#" + boite).animate({marginRight : "-810px"}, "slow", "easeInOutQuart");
		$("#" + item + ", #" + boite).removeClass("active");
	}
});

/**
* Classe pour la gestion des différents outils globals à fourmizzz.
* 
* @class BoiteBas
* @constructor
* @extends Boite
*/
var BoiteBas = Boite.extend({
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		this.html = "<div>"
			+ "<div id='o_menuPonteB' class='o_itemB'><span></span>Unité</div><div id='o_boitePonte' class='o_contentElementB'><span class='o_titreElement'>Lanceur de Ponte</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuRessourceB' class='o_itemB'><span></span>Ressource</div><div id='o_boiteRessource' class='o_contentElementB'><span class='o_titreElement'>Gestion des Ressources</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuChasseB' class='o_itemB'><span></span>Chasse</div><div id='o_boiteChasse' class='o_contentElementB'><span class='o_titreElement'>Outils pour Chasseur</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuCombatB' class='o_itemB'><span></span>Combat</div><div id='o_boiteCombat' class='o_contentElementB'><span class='o_titreElement'>Outils d'Attaque</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "<div id='o_menuPreferenceB' class='o_itemB'><span></span>Paramètre</div><div id='o_boitePreference' class='o_contentElementB'><span class='o_titreElement'>Préférences</span><div class='o_closeElement'><b></b><b></b><b></b><b></b></div></div>"
			+ "</div>";
		$("body").append(this.html);
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
		$(".o_contentElementB").css("background-color", Utils.data.couleur1); 
		$(".o_closeElement b:nth-child(1)").css("border-top-color", Utils.data.couleur1);
		$(".o_closeElement b:nth-child(2)").css("border-left-color", Utils.data.couleur1);
		$(".o_closeElement b:nth-child(3)").css("border-bottom-color", Utils.data.couleur1);
		$(".o_closeElement b:nth-child(4)").css("border-right-color", Utils.data.couleur1);
		$(".o_itemB, .o_closeElement").css("background-color", Utils.data.couleur2);
		$(".o_itemB, .o_contentElementB").css("border-left-color", Utils.data.couleur3);
		$(".o_itemB, .o_contentElementB").css("border-top-color", Utils.data.couleur3);
		$(".o_itemB, .o_contentElementB").css("border-right-color", Utils.data.couleur3);
		$(".o_closeElement").hover(
			function(){
				$(this).animate({backgroundColor : "#bb3333"}, 400);
			}, function(){
				$(this).animate({backgroundColor : Utils.data.couleur2}, 400);
			}
		);
		$(".o_itemB").hover(
			function(){
				$(this).animate({borderLeftColor : "#f6e497", borderTopColor : "#f6e497", borderRightColor : "#f6e497"}, {queue : false, duration : 400});
			}, function(){
				$(this).animate({borderLeftColor : Utils.data.couleur3, borderTopColor : Utils.data.couleur3, borderRightColor : Utils.data.couleur3}, {queue : false, duration : 400});
			}
		);
		$(".o_contentElementB, .o_contentElementB table").css("color", Utils.data.couleur4);
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
		$(".o_itemB").click(function(){
			boite.show($(this).attr("id"), $(this).next().attr("id"));
		});
		$(".o_closeElement").click(function(){
			boite.hide($(this).parent().prev().attr("id"), $(this).parent().attr("id"));
		});
	},
	/**
	* Affiche la boite demandé avec un effet de slide.
    *
	* @private
	* @method show
	* @param {String} item
	* @param {String} boite
	* @return
	*/
	show : function(item, boite)
	{
		// Si on reclique sur l'item 
		$(".active.o_contentElementB").css("z-index", 100);
		$("#" + boite).css("z-index", 500);
		// si la boite est caché on decale pour afficher
		if($("#" + boite).css("margin-bottom") == "-510px"){
			$("#" + boite).animate({marginBottom : "0px"}, "slow", "easeInOutQuart");
			$("#" + boite).addClass("active");
			// si la boite a deja été chargé
			if($("#" + boite).children().length < 3){
				switch(item){
					case "o_menuPonteB" :
						boitePonte = new BoitePonte();
						break;
					case "o_menuRessourceB" :
						boiteRessource = new BoiteRessource();
						break;
					case "o_menuChasseB" :
						boiteChasse = new BoiteChasse();
						break;
					case "o_menuCombatB" :
						boiteCombat = new BoiteCombat();
						break;
					case "o_menuPreferenceB" :
						boitePreference = new BoitePreference();
						break;
					default :
						break;
				}
			}
		}
	},
	/**
	* Cache la boite avec un effet de slide.
    *
	* @private
	* @method hide
	* @param {String} item
	* @param {String} boite
	* @return 
	*/
	hide : function(item, boite)
	{
		$("#" + boite).css("z-index", 1000);
		$("#" + boite).animate({marginBottom : "-510px"}, "slow", "easeInOutQuart");
		$("#" + boite).removeClass("active");
	}
});

/**
* Creer la boite compte plus.
* 
* @class BoiteComptePlus
* @constructor
* @extends Boite
*/
var BoiteComptePlus = Boite.extend({
	/**
	* Initialise la boite compte plus. Affiche ligne par ligne les infos et anime les elements en fonction.
    *
	* @private
	* @method initialize
	* @return
	*/
	initialize : function()
	{
		var visible = sessionStorage.getItem("boiteActive");
		this.html = "<div id='boiteComptePlus' class='boite_compte_plus'><div class='titre_colonne_cliquable'><span class='titre_compte_plus'>" + Utils.version + "</span></div><div class='contenu_boite_compte_plus'><table " + (visible == null || visible == "C" ? "" : "style='display:none'") + ">"
			// Ligne ponte
			+ "<tr class='lien' title='Aller sur Reine'><td><a href='Reine.php'><div style='position:relative;height:27px;padding-left:5px;'><div class='mini_icone_ponte'/><div id='o_resteUnite' class='o_labelBoite'>" + (Utils.data.ponte ? Utils.data.ponte[0]["unite"] : "<span class='red'>Aucune ponte</span>") + "</div>" + (Utils.data.ponte ? "<div id='o_tempsUnite' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.ponte[0]["exp"]).diff(moment()) / 1000))) + "</div>" : "") + "<div id='o_progressUnite'/></div></a></td></tr>"
			// Ligne construction
			+ "<tr class='lien' title='Aller sur Construction'><td><a href='construction.php'><div style='position:relative;height:27px;padding-left:5px;'><div class='mini_icone_construction'/><div id='o_resteConstruction' class='o_labelBoite'>" + (Utils.data.construction ? Utils.data.construction : "Aucune construction") + "</div>" + (Utils.data.construction ? "<div id='o_tempsConstruction' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.expConstruction).diff(moment()) / 1000))) + "</div>" : "") + "<div id='o_progressConstruction'/></div></a></td></tr>"
			// Ligne recherche
			+ "<tr class='lien' title='Aller sur Laboratoire'><td><a href='laboratoire.php'><div style='position:relative;height:27px;padding-left:5px;'><div class='mini_icone_recherche'/><div id='o_resteRecherche' class='o_labelBoite'>" + (Utils.data.recherche ? Utils.data.recherche : "Aucune recherche") + "</div>" + (Utils.data.recherche ? "<div id='o_tempsRecherche' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.expRecherche).diff(moment()) / 1000))) + "</div>" : "") + "<div id='o_progressRecherche'/></div></a></td></tr>"
			// Ligne attaque
			+ "<tr class='lien' title='Aller sur Armée'><td><a href='Armee.php'><div style='position:relative;height:27px;padding-left:5px;'><div class='mini_icone_attaque'/><div id='o_resteAttaque' class='o_labelBoite'>" + (Utils.data.attaque ? Utils.data.attaque[0]["cible"] : "Aucune attaque") + "</div>" + (Utils.data.attaque ? "<div id='o_tempsAttaque' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.attaque[0]["exp"]).diff(moment()) / 1000))) + "</div>" : "") + "<div id='o_progressAttaque'/></div></a></td></tr>"
			// Ligne Convoi
			+ "<tr class='lien' title='Aller sur Convoi'><td><a href='commerce.php'><div style='position:relative;height:27px;padding-left:5px;'><div class='mini_icone_convoi'/><div id='o_resteConvoi' class='o_labelBoite'>" + (Utils.data.convoi ? Utils.data.convoi[0]["cible"] : "Aucune convoi") + "</div>" + (Utils.data.convoi ? "<div id='o_tempsConvoi' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.convoi[0]["exp"]).diff(moment()) / 1000))) + "</div>" : "") + "<div id='o_progressConvoi'/></div></a></td></tr>"
			// Ligne Chasse
			+ "<tr class='lien' title='Aller sur Ressource'><td><a href='Ressources.php'><div style='position:relative;height:27px;padding-left:5px;'><div class='mini_icone_chasse'/><div id='o_resteChasse' class='o_labelBoite'>" + (Utils.data.chasse ? Utils.data.chasse : "Aucune chasse") + "</div>" + (Utils.data.chasse ? "<div id='o_tempsChasse' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.expChasse).diff(moment()) / 1000))) + "</div>" : "") + "<div id='o_progressChasse'/></div></a></td></tr>"
			// Formulaire de recherche
			+ "</table><form method='post' action='classementAlliance.php' style='text-align:center;margin-top:5px;'><input type='text' name='requete' id='recherche' placeholder='Joueur ou Alliance'/></form></div></div>";
		$("#boiteComptePlus").replaceWith(this.html);
		
		if(Utils.data.ponte){
			$("#o_progressUnite").progressbar({value : (moment().valueOf() - moment(Utils.data.startPonte).valueOf()) * 100 / (moment(Utils.data.ponte[0]["exp"]).valueOf() - moment(Utils.data.startPonte).valueOf())});
			// Ajout du title
			var table = "<table>", tmpExp = moment(Utils.data.ponte[0]["exp"]);
			for(var i = 0, l = Utils.data.ponte.length ; i < l ; i++){
				var nombreU = Utils.data.ponte[i]["nombre"];
				// Pour la première ponte on calcule ce qu'il doit rester
				var tempsU = nombreU > 1 ? Utils.tempsU[Utils.nomUs.indexOf(Utils.data.ponte[i]["unite"])] : Utils.tempsU[Utils.nomU.indexOf(Utils.data.ponte[i]["unite"])];
				if(i == 0)
					nombreU = (moment(Utils.data.ponte[i]["exp"]).diff(moment()) / 1000) / (tempsU * Math.pow(0.9, Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]));
				else{
					var tempsPonte = nombreU * (tempsU * Math.pow(0.9, Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]));
					tmpExp.add(tempsPonte, 's');
				}
				table += "<tr><td class='gras'>" + numeral(nombreU).format("0.00a") + "</td><td>" + Utils.data.ponte[i]["unite"] + "</td><td>" + tmpExp.format("D MMM YYYY à HH[h]mm") + "</td></tr>";
			}
			table += "</table>";
			$("#boiteComptePlus table tr:eq(0)").attr("title", table);
			// Si il reste moins d'une heure (on voit les secondes) on met dynamise
			var tempsR = moment(Utils.data.ponte[0]["exp"]).diff(moment()) / 1000;
			if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsUnite");
		}	
		if(Utils.data.construction){
			$("#o_progressConstruction").progressbar({value : (moment().valueOf() - moment(Utils.data.startConstruction).valueOf()) * 100 / (moment(Utils.data.expConstruction).valueOf() - moment(Utils.data.startConstruction).valueOf())});
			var tempsR = moment(Utils.data.expConstruction).diff(moment()) / 1000;
			if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsConstruction");
		}
		if(Utils.data.recherche){
			$("#o_progressRecherche").progressbar({value : (moment().valueOf() - moment(Utils.data.startRecherche).valueOf()) * 100 / (moment(Utils.data.expRecherche).valueOf() - moment(Utils.data.startRecherche).valueOf())});
			var tempsR = moment(Utils.data.expRecherche).diff(moment()) / 1000;
			if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsRecherche");
		}
		if(Utils.data.attaque){
			$("#o_progressAttaque").progressbar({value : (moment().valueOf() - moment(Utils.data.startAttaque).valueOf()) * 100 / (moment(Utils.data.attaque[0]["exp"]).valueOf() - moment(Utils.data.startAttaque).valueOf())});
			// Ajout du title
			var table = "<table>";
			for(var i = 0, l = Utils.data.attaque.length ; i < l ; i++)
				table += "<tr><td class='gras'>" + Utils.data.attaque[i]["cible"] + "</td><td>Retour le " + moment(Utils.data.attaque[i]["exp"]).format("D MMM YYYY à HH[h]mm") + "</td></tr>";
			table += "</table>";
			$("#boiteComptePlus table tr:eq(3)").attr("title", table);
			var tempsR = moment(Utils.data.attaque[0]["exp"]).diff(moment()) / 1000;
			if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsAttaque");
		}	
		if(Utils.data.convoi){
			$("#o_progressConvoi").progressbar({value : (moment().valueOf() - moment(Utils.data.startConvoi).valueOf()) * 100 / (moment(Utils.data.convoi[0]["exp"]).valueOf() - moment(Utils.data.startConvoi).valueOf())});
			// Ajout du title
			var table = "<table>";
			for(var i = 0, l = Utils.data.convoi.length ; i < l ; i++)
				table += "<tr><td class='gras'>" + Utils.data.convoi[i]["cible"] + "</td><td>Retour le " + moment(Utils.data.convoi[i]["exp"]).format("D MMM YYYY à HH[h]mm") + "</td></tr>";
			table += "</table>";
			$("#boiteComptePlus table tr:eq(4)").attr("title", table);
			var tempsR = moment(Utils.data.convoi[0]["exp"]).diff(moment()) / 1000;
			if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsConvoi");
		}	
		if(Utils.data.chasse){
			$("#o_progressChasse").progressbar({value : (moment().valueOf() - moment(Utils.data.startChasse).valueOf()) * 100 / (moment(Utils.data.expChasse).valueOf() - moment(Utils.data.startChasse).valueOf())});
			var tempsR = moment(Utils.data.expChasse).diff(moment()) / 1000;
			if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsChasse");
		}
		$("#boiteComptePlus table tr").tooltip({
			tooltipClass : "o_titleTable",
			content : function(){return $(this).prop("title");},
			position: {my : "left+10 center", at : "right center"}
		});
	},
	/**
	* Met à jour les pontes si elles ne correspondent pas.
    *
	* @private
	* @method majPonte
	* @return
	*/
	majPonte : function()
	{
		$("#o_resteUnite").text(Utils.data.ponte[0]["unite"]);
		$("#o_resteUnite").css({"max-width":"110px","text-overflow":"ellipsis","overflow":"hidden","white-space":"nowrap"});
		$("#o_progressUnite").progressbar({value : (moment().valueOf() - moment(Utils.data.startPonte).valueOf()) * 100 / (moment(Utils.data.ponte[0]["exp"]).valueOf() - moment(Utils.data.startPonte).valueOf())});
		// Ajout du title
		var table = "<table>", tmpExp = moment(Utils.data.ponte[0]["exp"]);
		for(var i = 0, l = Utils.data.ponte.length ; i < l ; i++){
			var nombreU = Utils.data.ponte[i]["nombre"];
			var tempsU = nombreU > 1 ? Utils.tempsU[Utils.nomUs.indexOf(Utils.data.ponte[i]["unite"])] : Utils.tempsU[Utils.nomU.indexOf(Utils.data.ponte[i]["unite"])];
			if(i == 0)
				nombreU = (moment(Utils.data.ponte[i]["exp"]).diff(moment()) / 1000) / (tempsU * Math.pow(0.9, Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]));
			else{
				var tempsPonte = nombreU * (tempsU * Math.pow(0.9, Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0]));
				tmpExp.add(tempsPonte, 's');
			}
			table += "<tr><td class='gras'>" + numeral(nombreU).format("0.00a") + "</td><td>" + Utils.data.ponte[i]["unite"] + "</td><td>" + tmpExp.format("D MMM YYYY à HH[h]mm") + "</td></tr>";
		}
		table += "</table>";
		$("#boiteComptePlus table tr:eq(0)").attr("title", table);
		$("#boiteComptePlus table tr:eq(0)").tooltip({
			tooltipClass : "o_titleTable",
			content : function(){return $(this).prop('title');},
			position: {my : "left+10 center", at : "right center"}
		});
		// Si il reste moins d'une heure (on voit les secondes) on met dynamise
		if(!$("#o_tempsUnite").length)
			$("#o_resteUnite").after("<div id='o_tempsUnite' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.ponte[0]["exp"]).diff(moment()) / 1000))) + "</div>");
		else
			$("#o_tempsUnite").text(Utils.shortcutTime(Utils.intToTime((moment(Utils.data.ponte[0]["exp"]).diff(moment()) / 1000))));
		var tempsR = moment(Utils.data.ponte[0]["exp"]).diff(moment()) / 1000;
		if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsUnite");
	},
    /**
	* Met à jour la construction en cours si elle change.
    *
	* @private
	* @method majConstruction
	* @return
	*/
	majConstruction : function()
	{
		$("#o_resteConstruction").text(Utils.data.construction);
		$("#o_resteConstruction").css({"max-width":"110px","text-overflow":"ellipsis","overflow":"hidden","white-space":"nowrap"});
		$("#o_progressConstruction").progressbar({value : (moment().valueOf() - moment(Utils.data.startConstruction).valueOf()) * 100 / (moment(Utils.data.expConstruction).valueOf() - moment(Utils.data.startConstruction).valueOf())});
		$("#o_resteConstruction").after("<div id='o_tempsConstruction' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.expConstruction).diff(moment()) / 1000))) + "</div>");
		var tempsR = moment(Utils.data.expConstruction).diff(moment()) / 1000;
		if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsConstruction");
	},
    /**
	* Met à jour la recherche en cours si elle change.
    *
	* @private
	* @method majRecherche
	* @return
	*/
	majRecherche : function()
	{
		$("#o_resteRecherche").text(Utils.data.recherche);
		$("#o_resteRecherche").css({"max-width":"110px","text-overflow":"ellipsis","overflow":"hidden","white-space":"nowrap"});
		$("#o_progressRecherche").progressbar({value : (moment().valueOf() - moment(Utils.data.startRecherche).valueOf()) * 100 / (moment(Utils.data.expRecherche).valueOf() - moment(Utils.data.startRecherche).valueOf())});
		$("#o_resteRecherche").after("<div id='o_tempsRecherche' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.expRecherche).diff(moment()) / 1000))) + "</div>");
		var tempsR = moment(Utils.data.expRecherche).diff(moment()) / 1000;
		if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsRecherche");
	},
    /**
	* Met à jour les attaques si elles ne correspondent pas.
    *
	* @private
	* @method majAttaque
	* @return
	*/
	majAttaque : function()
	{
		$("#o_resteAttaque").text(Utils.data.attaque[0]["cible"]);
		$("#o_resteAttaque").css({"max-width":"110px","text-overflow":"ellipsis","overflow":"hidden","white-space":"nowrap"});
		$("#o_progressAttaque").progressbar({value : (moment().valueOf() - moment(Utils.data.startAttaque).valueOf()) * 100 / (moment(Utils.data.attaque[0]["exp"]).valueOf() - moment(Utils.data.startAttaque).valueOf())});
		// Ajout du title
		var table = "<table>";
		for(var i = 0, l = Utils.data.attaque.length ; i < l ; i++)
			table += "<tr><td class='gras'>" + Utils.data.attaque[i]["cible"] + "</td><td>Retour le " + moment(Utils.data.attaque[i]["exp"]).format("D MMM YYYY à HH[h]mm") + "</td></tr>";
		table += "</table>";
		$("#boiteComptePlus table tr:eq(3)").attr("title", table);
		$("#boiteComptePlus table tr:eq(3)").tooltip({
			tooltipClass : "o_titleTable",
			content : function(){return $(this).prop("title");},
			position: {my : "left+10 center", at : "right center"}
		});
		if(!$("#o_tempsAttaque").length)
			$("#o_resteAttaque").after("<div id='o_tempsAttaque' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.attaque[0]["exp"]).diff(moment()) / 1000))) + "</div>");
		else
			$("#o_tempsAttaque").text(Utils.shortcutTime(Utils.intToTime((moment(Utils.data.attaque[0]["exp"]).diff(moment()) / 1000))));
		var tempsR = moment(Utils.data.attaque[0]["exp"]).diff(moment()) / 1000;
		if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsAttaque");
	},
    /**
	* Met à jour les convois si ils ne correspondent pas.
    *
	* @private
	* @method majConvoi
	* @return
	*/
	majConvoi : function()
	{
		$("#o_resteConvoi").text(Utils.data.convoi[0]["cible"]);
		$("#o_resteConvoi").css({"max-width":"110px","text-overflow":"ellipsis","overflow":"hidden","white-space":"nowrap"});
		$("#o_progressConvoi").progressbar({value : (moment().valueOf() - moment(Utils.data.startConvoi).valueOf()) * 100 / (moment(Utils.data.convoi[0]["exp"]).valueOf() - moment(Utils.data.startConvoi).valueOf())});
		// Ajout du title
		var table = "<table>";
		for(var i = 0, l = Utils.data.convoi.length ; i < l ; i++)
			table += "<tr><td class='gras'>" + Utils.data.convoi[i]["cible"] + "</td><td>Retour le " + moment(Utils.data.convoi[i]["exp"]).format("D MMM YYYY à HH[h]mm") + "</td></tr>";
		table += "</table>";
		$("#boiteComptePlus table tr:eq(4)").attr("title", table);
		$("#boiteComptePlus table tr:eq(4)").tooltip({
			tooltipClass : "o_titleTable",
			content : function(){return $(this).prop("title");},
			position: {my : "left+10 center", at : "right center"}
		});
		if(!$("#o_tempsConvoi").length)
			$("#o_resteConvoi").after("<div id='o_tempsConvoi' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.convoi[0]["exp"]).diff(moment()) / 1000))) + "</div>");
		else
			$("#o_tempsConvoi").text(Utils.shortcutTime(Utils.intToTime((moment(Utils.data.convoi[0]["exp"]).diff(moment()) / 1000))));
		var tempsR = moment(Utils.data.convoi[0]["exp"]).diff(moment()) / 1000;
		if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsConvoi");
	},
    /**
	* Met à jour les chasses si elles ne correspondent pas.
    *
	* @private
	* @method majChasse
	* @return
	*/
	majChasse : function()
	{
		$("#o_resteChasse").text(Utils.data.chasse);
		$("#o_resteChasse").css({"max-width":"110px","text-overflow":"ellipsis","overflow":"hidden","white-space":"nowrap"});
		$("#o_progressChasse").progressbar({value : (moment().valueOf() - moment(Utils.data.startChasse).valueOf()) * 100 / (moment(Utils.data.expChasse).valueOf() - moment(Utils.data.startChasse).valueOf())});
		$("#o_resteChasse").after("<div id='o_tempsChasse' class='o_labelTempsBoite'>" + Utils.shortcutTime(Utils.intToTime((moment(Utils.data.expChasse).diff(moment()) / 1000))) + "</div>");
		var tempsR = moment(Utils.data.expChasse).diff(moment()) / 1000;
		if(tempsR <= 3600) Utils.decreaseTime(tempsR, "o_tempsChasse");
	}
});
 
/**
* Creer une boite radar pour la surveillance des joueurs/alliances.
* 
* @class BoiteRadar
* @constructor
* @extends Boite
*/
var BoiteRadar = Boite.extend({ 
	/**
	* Initialise la boite radar. Affiche dans la boite compte plus les joueurs et alliances sous surveillance.
    *
	* @private
	* @method initialize
	* @return {Object} description
	*/
	initialize : function()
	{
		var visible = sessionStorage.getItem("boiteActive");
		// Modification de la boite compte plus pour faire apparaitre la boite radar
		if(Utils.comptePlus){
			$("#boiteComptePlus .titre_compte_plus").replaceWith(function(){
				return $("<span class='titre_compte_plus'>" + $(this).html() + "</span>");
			});
			if(visible == "R")
				$("#boiteComptePlus table").hide();
		}
		var img = "<img src='images/icone/fleche-bas-claire.png' style='vertical-align:1px;' alt='changer' height='8'>";
		$("#boiteComptePlus .titre_compte_plus").before(img + " ").after(" " + img);
		// Event sur le titre si on utilise le radar
		$("#boiteComptePlus .titre_colonne_cliquable").removeAttr("onclick").click(function(){
			if($(this).next().find("table:visible").attr("id"))
				sessionStorage.setItem("boiteActive", "C");
			else 
				sessionStorage.setItem("boiteActive", "R");
			$("#boiteComptePlus .contenu_boite_compte_plus table").toggle();
		});
		this.html = "<table id='o_radar' " + (visible == "R" ? "" : "style='display:none'") + ">", tmp = 0;
		for(var key in Utils.radar){
			if(Utils.radar[key]["type"] == 1){ // Si c'est un joueur
				var attaque = "";
				if(Utils.radar[key]["mv"] == 1)
					attaque = "<span title='En vacances' class='blue'>" + numeral(Utils.radar[key]["terrain"]).format() + "</span>";
				else
					attaque = (Utils.radar[key]["terrain"] >= ((Utils.terrain * 0.5) + 1) && Utils.radar[key]["terrain"] <= ((Utils.terrain * 3) - 1)) ? "<a class='gras' href='/ennemie.php?Attaquer=" + Utils.radar[key]["id"] + "&lieu=1'>" + numeral(Utils.radar[key]["terrain"]).format() + "</a>" : numeral(Utils.radar[key]["terrain"]).format();
				this.html += "<tr class='lien'><td><span title='Actualiser' id='radar_maj_" + tmp++ + "' class='cursor o_icone o_actualiser'/></td><td class='left'><a class='gras' href='Membre.php?Pseudo=" + key + "'>" + key + "</a></td><td class='right reduce' title=''>" + attaque + "</td></tr>";
			}
			if(Utils.radar[key]["type"] == 2) // Sinon c'est une alliance
				this.html += "<tr class='lien'><td><span title='Actualiser' id='radar_maj_" + tmp++ + "' class='cursor  o_icone o_actualiser'/></td><td class='left'><a class='gras' href='classementAlliance.php?alliance=" + key + "'>" + key + "</a></td><td class='right reduce' title=''>" + numeral(Utils.radar[key]["terrain"]).format() + "</td></tr>";
		}
		$("#boiteComptePlus .contenu_boite_compte_plus table").after(this.html + "</table>");
		this.event();
	},
	/**
	* Ajoute l'evenement de mise à jour des données sur la boite.
    *
	* @private
	* @method event
	* @return
	*/
	event : function()
	{
		$("span[id^='radar_maj_']").click(function(){
			var ligne = $(this).parent().parent(), elem = ligne.find("a:eq(0)").attr("href").split("=")[1], cell = ligne.find("td:eq(2)");
			// Si ce n'est pas le lien d'une alliance
			if(ligne.find("a:eq(0)").attr("href").indexOf("alliance") == -1)
				boiteRadar.majJoueur(elem);
			else
				boiteRadar.majAlliance(elem);
			var terrain = numeral().unformat(cell.text());
			if(terrain > Utils.radar[elem]["terrain"]){
				cell.text(numeral(Utils.radar[elem]["terrain"]).format());
				cell.effect("highlight", {color : "#8D4545"}, 1000);
				cell.attr("title", numeral(Utils.radar[elem]["terrain"] - terrain).format());
				cell.tooltip({position : {my : "left+10 center", at : "right center"}, content: "<span class='red'>" + cell.attr("title") + " cm²</span>"});
				cell.tooltip("open");
			}
			if(terrain < Utils.radar[elem]["terrain"]){
				cell.text(numeral(Utils.radar[elem]["terrain"]).format());
				cell.effect("highlight", {color : "#458D58"}, 1000);
				cell.attr("title", numeral(Utils.radar[elem]["terrain"] - terrain).format());
				cell.tooltip({position : {my : "left+10 center", at : "right center"}, content: "<span class='green'>+ " + cell.attr("title") + " cm²</span>"});
				cell.tooltip("open");
			}
            $(this).animate({deg : 360}, {
                duration : 500,
                step : function(now) {
                    $(this).css({transform: "rotate(" + now + "deg)"});
                }
            });
        });
	},
	/**
	* Récupére le profil d'un joueur.
    *
	* @private
	* @method majJoueur
	* @param {String} pseudo
	* @return
	*/
	majJoueur : function(pseudo)
	{
		$.ajax({
			url     : "/Membre.php?Pseudo=" + pseudo,
			async   : false,
			success : function(data){
				var terrain = numeral().unformat($(data).find(".tableau_score tr:eq(1) td:eq(1)").text());
				if(terrain != Utils.radar[pseudo]["terrain"]){
					Utils.radar[pseudo]["terrain"] = terrain;
					localStorage.setItem("outiiil_radar", JSON.stringify(Utils.radar));
				}
			}
		});
	},
	/**
	* Récupére la description d'une alliance.
    *
	* @private
	* @method majAlliance
	* @param {String} tag
	* @return
	*/
	majAlliance : function(tag)
	{
		$.ajax({
			url     : "/classementAlliance.php?alliance=" + tag,
			async   : false,
			success : function(data){
				var total = 0;
				$(data).find("#tabMembresAlliance tr:gt(0)").each(function(){total += numeral().unformat($(this).find("td:eq(4)").text());});
				if(total != Utils.radar[tag]["terrain"]){
					Utils.radar[tag]["terrain"] = total;
					localStorage.setItem("outiiil_radar", JSON.stringify(Utils.radar));
				}
			}
		});
	},
	/**
	* Rafraichie la boite radar quand un element est inséré ou retiré.
    *
	* @private
	* @method refreshBoite
	* @return 
	*/
	refreshBoite : function()
	{
		var visible = sessionStorage.getItem("boiteActive");
		this.html = "<table id='o_radar' " + (visible == "R" ? "" : "style='display:none'") + ">", tmp = 0;
		for(var key in Utils.radar){
			if(Utils.radar[key]["type"] == 1){ // Si c'est un joueur
				var attaque = "";
				if(Utils.radar[key]["mv"] == 1)
					attaque = "<span title='En vacances' class='blue'>" + numeral(Utils.radar[key]["terrain"]).format() + "</span>";
				else
					attaque = (Utils.radar[key]["terrain"] >= ((Utils.terrain * 0.5) + 1) && Utils.radar[key]["terrain"] <= ((Utils.terrain * 3) - 1)) ? "<a class='gras' href='/ennemie.php?Attaquer=" + Utils.radar[key]["id"] + "&lieu=1'>" + numeral(Utils.radar[key]["terrain"]).format() + "</a>" : numeral(Utils.radar[key]["terrain"]).format();
				this.html += "<tr class='lien'><td><span title='Actualiser' id='radar_maj_" + tmp++ + "' class='cursor o_icone o_actualiser'/></td><td class='left'><a class='gras' href='Membre.php?Pseudo=" + key + "'>" + key + "</a></td><td class='right reduce' title=''>" + attaque + "</td></tr>";
			}
			if(Utils.radar[key]["type"] == 2) // Sinon c'est une alliance
				this.html += "<tr class='lien'><td><span title='Actualiser' id='radar_maj_" + tmp++ + "' class='cursor  o_icone o_actualiser'/></td><td class='left'><a class='gras' href='classementAlliance.php?alliance=" + key + "'>" + key + "</a></td><td class='right reduce' title=''>" + numeral(Utils.radar[key]["terrain"]).format() + "</td></tr>";
		}
		$("#o_radar").replaceWith(this.html + "</table>");
		$("#o_radar").off();
		this.event();
	}
});
