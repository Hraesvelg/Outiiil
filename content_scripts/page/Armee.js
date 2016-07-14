/*
 * Armee.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe de fonction pour la page /Armee.php.
* 
* @class PageArmee
* @constructor
* @extends Page
*/
var PageArmee = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe. Affichage supplémentaire des attaques, Formulaire de déplacement de l'armée.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		var armeeTdc = new Armee(), armeeDome = new Armee(), armeeLoge = new Armee();
		this.getArmeeTdc(armeeTdc);
		this.getArmeeDome(armeeDome);
		this.getArmeeLoge(armeeLoge);
		// Affichage du nombre d'attaque restante
		var nbAttaque = $("#centre").text().split("- Vous allez attaquer").length - 1;
		$("h3:eq(2)").append(" " + nbAttaque + ", reste : " + (Utils.data.niveauRecherche[6] + 1 - nbAttaque) + ".</p>");
		// Affichage du nombre total d'unité
		$("h3:first").append(" (" + numeral(armeeTdc.getSommeUnite() + armeeDome.getSommeUnite() + armeeLoge.getSommeUnite()).format() + ")</p>");
		// Formulaire pour déplacer son armée
		$(".simulateur:eq(0)").after("<br/><table class='simulateur centre'><tr><td class='gras'>Déplacer son armée</td></tr><tr><td>Envoyer <input id='o_nb_unite_1' value='1' size='12' name='o_value_1'/> <select id='o_choix_unite_1'>" + $("#ChoixUnite").clone().html() + "</select> de <select id='o_lieu_depart_1'><option value='1'>Terrain</option><option value='2'>Dôme</option><option value='3' selected>Loge</option></select> vers <select id='o_lieu_destination_1'><option value='1'>Terrain</option><option value='2' selected>Dôme</option><option value='3'>Loge</option></select> <button id='o_deplacer_1'>Déplacer</button></td></tr><tr><td>Envoyer <input id='o_nb_unite_2' value='1' size='12' name='o_value_2'/> <select id='o_choix_unite_2'>" + $("#ChoixUnite").clone().html() + "</select> de <select id='o_lieu_depart_2'><option value='1'>Terrain</option><option value='2'>Dôme</option><option value='3' selected>Loge</option></select> vers <select id='o_lieu_destination_2'><option value='1'>Terrain</option><option value='2'>Dôme</option><option value='3'>Loge</option></select> <button id='o_deplacer_2'>Déplacer</button></td></tr></table>");
		$("#o_nb_unite_1, #o_nb_unite_2").spinner({min : 0, numberFormat: "i"});
		$("#o_deplacer_1").click(function(){
			var param = "Transferer=Envoyer&ChoixUnite=" + $("#o_choix_unite_1").val() + "&LieuOrigine=" + $("#o_lieu_depart_1").val() + "&LieuDestination=" + $("#o_lieu_destination_1").val() + "&nbTroupes=" + $("#o_nb_unite_1").val() + "&" + $("#t").attr("name") + "=" + $("#t").val();
			$.post("/Armee.php?" + param, function(data){location="/Armee.php";});
		});
		$("#o_deplacer_2").click(function(){
			var param = "Transferer=Envoyer&ChoixUnite=" + $("#o_choix_unite_2").val() + "&LieuOrigine=" + $("#o_lieu_depart_2").val() + "&LieuDestination=" + $("#o_lieu_destination_2").val() + "&nbTroupes=" + $("#o_nb_unite_2").val() + "&" + $("#t").attr("name") + "=" + $("#t").val();
			$.post("/Armee.php?" + param, function(data){location="/Armee.php";});
		});

		if(!Utils.comptePlus) this.plus(armeeTdc, armeeDome, armeeLoge);
		$(".simulateur:eq(1)").width($(".simulateur:eq(0)").width());
		// Affichage du temps Hof de votre armée
		var vdp = Utils.data.niveauConstruction[3] + Utils.data.niveauConstruction[4] + Utils.data.niveauRecherche[0];
		$(".simulateur:first").append("<tr><td colspan=10>Temps <span class='gras' title='Hall Of Fame' >HOF : " + Utils.shortcutTime(Utils.intToTime(armeeTdc.getTemps(0) + armeeDome.getTemps(0) + armeeLoge.getTemps(0))) + "</span>, Temps relatif : <span class='gras'>" + Utils.shortcutTime(Utils.intToTime(armeeTdc.getTemps(vdp) + armeeDome.getTemps(vdp) + armeeLoge.getTemps(vdp))) + "</span></td></tr>");
	},
    /**
	* Initialise l'armée en terrain de chasse.
    *
    * @private
	* @method getArmeeTdc
	* @param {Object} Armee en TDC.
	* @return
	*/
	getArmeeTdc : function(armee)
	{
		$(".simulateur tr[align=center]:lt(14)").each(function(i){
			var unite = $(this).find('.pas_sur_telephone').text(), nbr = numeral().unformat($(this).find("td:nth-child(3) span").text());
			if(unite && nbr)
				armee.unite[Utils.nomU.indexOf(unite) - 1] = nbr;
		});
	},   
	/**
	* Initialise l'armée en dome.
    *
	* @private
	* @method getArmeeDome
	* @param {Object} Armee en dome.
	* @return 
	*/
	getArmeeDome : function(armee)
	{
		$(".simulateur tr[align=center]:lt(14)").each(function(i){
			var unite = $(this).find(".pas_sur_telephone").text();
			$(this).find("td").slice(3, ($(this).find("td").length - 2)).each(function(){
				var nbr = numeral().unformat($(this).text());
				if(unite && nbr)
					armee.unite[Utils.nomU.indexOf(unite) - 1] = nbr;
			});
		});
	},
	/**
	* Initialise l'armée en loge.
    *
	* @private
	* @method getArmeeLoge
	* @param {Object} Armee en loge.
	* @return
	*/
	getArmeeLoge : function(armee)
	{
		$(".simulateur tr[align=center]:lt(14)").each(function(i){
			var unite = $(this).find('.pas_sur_telephone').text(), nbr = numeral().unformat($(this).find("td:nth-last-child(2)").text());
			if(unite && nbr)
				armee.unite[Utils.nomU.indexOf(unite) - 1] = nbr;
		});
	},
	/**
	* Ajoute les fonctionnalités du compte+. Affiche les infos sur l'armée et les fléches dans le tableau des unités.
    *
	* @private
	* @method plus
    * @param {Object} armeeT
	* @param {Object} armeeD
	* @param {Object} armeeL
	* @return
	*/
	plus : function(armeeT, armeeD, armeeL)
	{
		// Affiche les fléches de deplacement des unités
		$(".simulateur td").each(function(){
			if(/^[0-9,]+$/.test($(this).text().replace(/ /g, ''))){
				var info    = $(this).find('span').attr('id').replace(/\(|\)/g, '');
				var nbUnit  = info.split(',')[0];
				var nomUnit = info.split(',')[1].replace(/\'/g, '');
				var lieuDep = info.split(',')[2];
				if(lieuDep != 3){
					var lieuArr  = ~~(lieuDep) + 1;
					var securite = $("#t").attr('name') + "=" + $("#t").attr('value');
					var lien     = "Armee.php?Transferer&nbTroupes=" + nbUnit + "&ChoixUnite=" + nomUnit + "&LieuOrigine=" + lieuDep + "&LieuDestination=" + lieuArr + "&" + securite;
					$(this).next().html("<a href=" + lien + " class='cursor'><img width='9' height='15' src='http://img2.fourmizzz.fr/images/bouton/fleche-champs-droite.gif'/></a>");
				}
				if(lieuDep != 1){
					var lieuArr  = ~~(lieuDep) - 1;
					var securite = $("#t").attr('name') + "=" + $("#t").attr('value');
					var lien     = "Armee.php?Transferer&nbTroupes=" + nbUnit + "&ChoixUnite=" + nomUnit + "&LieuOrigine=" + lieuDep + "&LieuDestination=" + lieuArr + "&" + securite;
					$(this).prev().html("<a href=" + lien + " class='cursor'><img width='9' height='15' src='http://img2.fourmizzz.fr/images/bouton/fleche-champs-gauche.gif'/></a>");
				}
			}
		});
		// Affichage des infos sur l'armée selon son placement
		this.afficherLigneVie(armeeT, armeeD, armeeL);
		this.afficherLigneAttaque(armeeT, armeeD, armeeL);
		this.afficherLigneDefense(armeeT, armeeD, armeeL);
		this.afficherLigneConsommation(armeeT, armeeD, armeeL);
		// Sauvegarde des attaques en cours
		this.verifierAttaque();
		// Affichage du retour des attaques
		$("#centre center > .gras").each(function(){
			if($(this).find("a").length)
				$(this).next().after("<span class='small'> Retour le " + moment().add($(this).next().next().text().split(",")[0].split("(")[1], 's').format("D MMM YYYY à HH[h]mm") + "</span>");
		});
	},
	/**
	* Affiche les informations supplémentaires sur la vie des armées.
    *
	* @private
	* @method afficherLigneVie
	* @param {Object} armeeT
	* @param {Object} armeeD
	* @param {Object} armeeL
	* @return
	*/
	afficherLigneVie : function(armeeT, armeeD, armeeL)
	{
		var bouclier  = Utils.data.niveauRecherche[1];
		var line = "<tr align='center' class='vie cursor'>"
			 + "<td>Vie (AB)</td>"
			 + "<td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' width='19' height='19' title='Vie' \> " + numeral(armeeT.getTotalVie(bouclier, 1, 0)).format() + "</td>"
			 + "<td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' width='19' height='19' title='Vie' \> " + numeral(armeeD.getTotalVie(bouclier, 2, ~~($('span:contains("Dôme")').text().replace(/\D/g, '')))).format() + "</td>"
			 + "<td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' width='19' height='19' title='Vie' \> " + numeral(armeeL.getTotalVie(bouclier, 3, ~~($('span:contains("Loge")').text().replace(/\D/g, '')))).format() + "</td>"
			 + "</tr>"
			 + "<tr align='center' class='vie cursor' style='display:none;'>"
			 + "<td>Vie (HB)</td>"
			 + "<td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' width='19' height='19' title='Vie' \> " + numeral(armeeT.getBaseVie()).format() + "</td>"
			 + "<td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' width='19' height='19' title='Vie' \> " + numeral(armeeD.getBaseVie()).format() + "</td>"
			 + "<td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' width='19' height='19' title='Vie' \> " + numeral(armeeL.getBaseVie()).format() + "</td>"
			 + "</tr>";
		$(".simulateur tr[align=center]:last").after(line);
		$(".vie").click(function(){$(".vie").toggle();});
	},
    /**
	* Affiche les informations supplémentaires sur l'attaque des armées.
    *
	* @private
	* @method afficherLigneAttaque
	* @param {Object} armeeT
	* @param {Object} armeeD
	* @param {Object} armeeL
	* @return
	*/
	afficherLigneAttaque : function(armeeT, armeeD, armeeL)
	{
		var armes = Utils.data.niveauRecherche[2];
		var line = "<tr align='center' class='att ligne_paire cursor'>"
			 + "<td>Dégats en Attaque (AB)</td>"
			 + "<td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' width='18' height='18' title='Dégat en défense :' /> " + numeral(armeeT.getTotalAtt(armes)).format() + "</td>"
			 + "<td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' width='18' height='18' title='Dégat en défense :' /> " + numeral(armeeD.getTotalAtt(armes)).format() + "</td>"
			 + "<td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' width='18' height='18' title='Dégat en défense :' /> " + numeral(armeeL.getTotalAtt(armes)).format() + "</td>"
			 + "</tr>"
			 + "<tr align='center' class='ligne_paire att' style='display:none;'>"
			 + "<td>Dégats en Attaque (HB)</td>"
			 + "<td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' width='18' height='18' title='Dégat en défense :' /> " + numeral(armeeT.getBaseAtt()).format() + "</td>"
			 + "<td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' width='18' height='18' title='Dégat en défense :' /> " + numeral(armeeD.getBaseAtt()).format() + "</td>"
			 + "<td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' width='18' height='18' title='Dégat en défense :' /> " + numeral(armeeL.getBaseAtt()).format() + "</td>"
			 + "</tr>";
		$(".simulateur tr[align=center]:last").after(line);
		$(".att").click(function(){$(".att").toggle();});
	},
    /**
	* Affiche les informations supplémentaires sur la defense des armées.
    *
	* @private
	* @method afficherLigneDefense
	* @param {Object} armeeT
	* @param {Object} armeeD
	* @param {Object} armeeL
	* @return
	*/
	afficherLigneDefense : function(armeeT, armeeD, armeeL)
	{
		var armes = Utils.data.niveauRecherche[2];
		var line = "<tr align='center' class='def cursor'>"
			 + "<td>Dégats en Défense (AB)</td>"
			 + "<td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' width='18' height='18' title='Dégats en attaque :' /> " + numeral(armeeT.getTotalDef(armes)).format() + "</td>"
			 + "<td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' width='18' height='18' title='Dégats en attaque :' /> " + numeral(armeeD.getTotalDef(armes)).format() + "</td>"
			 + "<td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' width='18' height='18' title='Dégats en attaque :' /> " + numeral(armeeL.getTotalDef(armes)).format() + "</td>"
			 + "</tr>"
			 + "<tr align='center' class='def' style='display:none;'>"
			 + "<td>Dégats en Défense (HB)</td>"
			 + "<td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' width='18' height='18' title='Dégats en attaque :' /> " + numeral(armeeT.getBaseDef()).format() + "</td>"
			 + "<td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' width='18' height='18' title='Dégats en attaque :' /> " + numeral(armeeD.getBaseDef()).format() + "</td>"
			 + "<td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' width='18' height='18' title='Dégats en attaque :' /> " + numeral(armeeL.getBaseDef()).format() + "</td>"
			 + "</tr>";
		$(".simulateur tr[align=center]:last").after(line);
		$(".def").click(function(){$(".def").toggle();});
	},
    /**
	* Affiche les informations supplémentaires sur la consommation des armées.
    *
	* @private
	* @method afficherLigneConsommation
	* @param {Object} armeeT
	* @param {Object} armeeD
	* @param {Object} armeeL
	* @return
	*/
	afficherLigneConsommation : function(armeeT, armeeD, armeeL)
	{
		var line = "<tr align='center' class='ligne_paire'>"
			 + "<td>Consommation Journalière</td>"
			 + "<td colspan=3><img alt='Consommation Journalière' class='o_vAlign' src='images/icone/icone_pomme.gif' width='18' height='18' title='Consommation Journalière' /> " + numeral(armeeT.getConsommation(1)).format() + "</td>"
			 + "<td colspan=3><img alt='Consommation Journalière' class='o_vAlign' src='images/icone/icone_pomme.gif' width='18' height='18' title='Consommation Journalière' /> " + numeral(armeeD.getConsommation(2)).format() + "</td>"
			 + "<td colspan=3><img alt='Consommation Journalière' class='o_vAlign' src='images/icone/icone_pomme.gif' width='18' height='18' title='Consommation Journalière' /> " + numeral(armeeL.getConsommation(3)).format() + "</td>"
			 + "</tr>";
		$(".simulateur tr[align=center]:last").after(line);
	},
	/**
	* Verifie les attaques en cours avec ce qui est sauvegarder.
    *
	* @private
	* @method verifierAttaque
	* @return
	*/
	verifierAttaque : function()
	{
		// Si on a des pontes en cours
		var nbAttaque = $("#centre").text().split("- Vous allez attaquer").length - 1;
		if(nbAttaque){
			var listeAttaque = [];
			$("#centre center > .gras").each(function(){
				if($(this).find("a").length)
					listeAttaque.push({"cible" : $(this).text(), "exp" : moment().add($(this).next().next().text().split(",")[0].split("(")[1], 's')});
			});
			// Verification si les données sont deja enregistré
			if(!Utils.data.attaque || Utils.data.attaque.length != nbAttaque || Utils.data.attaque[0]["cible"] != listeAttaque[0]["cible"] || listeAttaque[0]["exp"].diff(Utils.data.attaque[0]["exp"], 's') > 1)
				this.saveAttaque(listeAttaque);
		}
	},
	/**
	* Sauvegarde les attaques en cours.
    *
	* @private
	* @method saveAttaque
	* @param {Array} Liste des attaques en cours.
	* @return
	*/
	saveAttaque : function(liste)
	{
		Utils.data.attaque = liste;
		Utils.data.startAttaque = moment();
		localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
		if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majAttaque();
	}
});
