/*
 * Util.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
 * Données globales du projet, de fourmizzz et des fonctions utilisables partout dans le code.
 *
 * @class Utils
 * @static
 */
var Utils = {
	// Version de outiiil
	version : "Outiiil 1.<span class='reduce'>4.1</span>",
	// Url courante
	uri : location.pathname,
	// booleen si l'utilisateur à la compte+
	comptePlus : $("#boiteComptePlus").find("table").length ? true : false,
	// Données generale
	pseudo : $("#pseudo").text(),
	ouvrieres : parseInt($("#nb_ouvrieres").text()),
	nourriture : parseInt($("#nb_nourriture").text()),
	materiaux : parseInt($("#nb_materiaux").text()),
	terrain : parseInt($("#quantite_tdc").text()),
	tag : $("#tag_alliance").text(),
	// Données Jeu
	nomU : ["Ouvrière", "Jeune Soldate Naine", "Soldate Naine", "Naine d’Elite", "Jeune Soldate", "Soldate", "Concierge", "Concierge d’élite", "Artilleuse", "Artilleuse d’élite", "Soldate d’élite", "Tank", "Tank d’élite", "Tueuse", "Tueuse d’élite"],
	nomUs : ["Ouvrières", "Jeunes Soldates Naines", "Soldates Naines", "Naines d’Elites", "Jeunes Soldates", "Soldates", "Concierges", "Concierges d’élites", "Artilleuses", "Artilleuses d’élites", "Soldates d’élites", "Tanks", "Tanks d’élites", "Tueuses", "Tueuses d’élites"],
	tempsU : [60, 300, 450, 570, 740, 1000, 1410, 1410, 1440, 1520, 1450, 1860, 1860, 2740, 2740],
	coutU : [5, 16, 20, 26, 30, 36, 70, 100, 30, 34, 44, 100, 150, 80, 90],
	vieU : [-1, 8, 10, 13, 16, 20, 30, 40, 10, 12, 27, 35, 50, 50, 55],
	attU : [-1, 3, 5, 7, 10, 15, 1, 1, 30, 35, 24, 55, 80, 50, 55],
	defU : [-1, 2, 4, 6, 9, 14, 25, 35, 15, 18, 23, 1, 1, 50, 55],
	nomConstruction : ["Champignonnière", "Entrepôt de Nourriture", "Entrepôt de Matériaux", "Couveuse", "Solarium", "Laboratoire", "Salle d'analyse", "Salle de combat", "Caserne", "Dôme", "Loge Impériale", "Etable à pucerons", "Etable à cochenilles"],
	nomRecherche : ["Technique de ponte", "Bouclier Thoracique", "Armes", "Architecture", "Communication avec les animaux", "Vitesse de chasse", "Vitesse d'attaque", "Génétique", "Acide", "Poison"],
	// Données profil
	data : {},
	radar : {},
	/**
	* Récupére les données du joueur courant dans le localstorage.
    *
	* @method getData
	* @return Charge les données dans la classe et sont utilisable partout.
	*/
	getData : function()
	{
		var data = localStorage.getItem("outiiil_data");
		// Si des données sont deja presente et à jour on les charges
		if(data && data != "undefined"){
			this.data = JSON.parse(data);
			if(!this.data.niveauConstruction || (this.data.expConstruction != -1 && moment(this.data.expConstruction).diff(moment()) < 0)) this.getConstruction();
			if(!this.data.niveauRecherche || (this.data.expRecherche != -1 && moment(this.data.expRecherche).diff(moment()) < 0)) this.getLaboratoire();
			if(!this.data.x || !this.data.y || !this.data.id) this.getProfil();
			if(!this.data.couleur1) this.data.couleur1 = "#d7c384";
			if(!this.data.couleur2) this.data.couleur2 = "#c9ad63";
			if(!this.data.couleur3) this.data.couleur3 = "#bd8d46";
			if(!this.data.couleur4)	this.data.couleur4 = "#000000";
			if(!this.data.position) this.data.position = "0";
			// Suppression des données obsoletes
			if(this.data.ponte){
				for(var i = this.data.ponte.length ; i-- ; )
					  if(moment(this.data.ponte[i]["exp"]).diff(moment()) < 0)
						  this.data.ponte.splice(i, 1);
				if(this.data.ponte.length == 0){
					delete this.data.startPonte;
					delete this.data.ponte;
				}
			}
			if(this.data.construction && moment(this.data.expConstruction).diff(moment()) < 0){
				this.data.expConstruction = -1;
				delete this.data.construction;
			}
			if(this.data.recherche && moment(this.data.expRecherche).diff(moment()) < 0){
				this.data.expRecherche = -1;
				delete this.data.recherche;
			}
			if(this.data.convoi){
				for(var i = this.data.convoi.length ; i-- ; )
					  if(moment(this.data.convoi[i]["exp"]).diff(moment()) < 0)
						  this.data.convoi.splice(i, 1);
				if(this.data.convoi.length == 0){
					delete this.data.startConvoi;
					delete this.data.convoi;
				}
			}
			if(this.data.attaque){
				for(var i = this.data.attaque.length ; i-- ; )
					  if(moment(this.data.attaque[i]["exp"]).diff(moment()) < 0)
						  this.data.attaque.splice(i, 1);
				if(this.data.attaque.length == 0){
					delete this.data.startAttaque;
					delete this.data.attaque;
				}
			}
			if(this.data.chasse && moment(this.data.expChasse).diff(moment()) < 0){
				delete this.data.expChasse;
				delete this.data.chasse;
				delete this.data.startChasse;
			}
			localStorage.setItem("outiiil_data", JSON.stringify(this.data));
		// Sinon on va les chercher
		}else{
			this.getConstruction();
			this.getLaboratoire();
			this.getProfil();
			this.data.couleur1 = "#d7c384";
			this.data.couleur2 = "#c9ad63";
			this.data.couleur3 = "#bd8d46";
			this.data.couleur4 = "#000000";
			this.data.position = "0";
			localStorage.setItem("outiiil_data", JSON.stringify(this.data));
		}
	},
	/**
	* Récupére les niveaux des constructions du joueur ainsi que la construction en cours.
    *
	* @method getConstruction
	* @return Charge les niveaux de construction dans la class et sauvegarde en localstorage.
	*/
	getConstruction : function()
	{
		$.ajax({
			url     : "/construction.php",
			async   : false,
			success : function(data){
				var parsed = $("<div/>").append(data);
				// Niveau des batiments
				Utils.data.niveauConstruction = [];
				parsed.find(".ligneAmelioration").each(function(i){Utils.data.niveauConstruction[i] = parseInt($(this).find(".niveau_amelioration").text().split(" ")[1]);});
				// Construction en cours ?!
				var ligne = parsed.find("#centre strong").text();
				var construction = ligne.substring(2, ligne.indexOf("se termine") - 1), time = parseInt(ligne.split(',')[0].split('(')[1]);
				// si il y a une construction en cours les données expirent à la fin de cette construction
				if(construction){
					Utils.data.construction = construction;
					Utils.data.expConstruction = moment().add(time, 's');
					Utils.data.startConstruction = moment();
				// sinon les données sont toujours valide dans le temps
				}else
					Utils.data.expConstruction = -1;
			}
		});
	},
	/**
	* Récupére les niveaux des recherches du joueur ainsi que la recherche en cours.
    *
	* @method getLaboratoire
	* @return Charge les niveaux de recherche dans la classe et sauvegarde en localstorage.
	*/
	getLaboratoire : function()
	{
		$.ajax({
			url     : "/laboratoire.php",
			async   : false,
			success : function(data) {
				var parsed = $("<div/>").append(data);
				// Niveau des recherches
				Utils.data.niveauRecherche = [];
				parsed.find(".ligneAmelioration").each(function(i){Utils.data.niveauRecherche[i] = parseInt($(this).find(".niveau_amelioration").text().split(" ")[1]);});
				// Recherche en cours ?!
				var ligne = parsed.find("#centre strong").text();
				var recherche = ligne.substring(2, ligne.indexOf("termin") - 1), time = parseInt(ligne.split(",")[0].split("(")[1]);
				// si il y a une recherche en cours les données expirent à la fin de cette recherche
				if(recherche){
					Utils.data.recherche = recherche;
					Utils.data.expRecherche = moment().add(time, 's');
					Utils.data.startRecherche = moment();
				// sinon les données sont toujours valide dans le temps
				}else
					Utils.data.expRecherche = -1;
			}
		});
	},
    /**
	* Récupére les coordonnées et l'id du joueur.
    *
	* @method getProfil
	* @return Charge les données dans la classe.
	*/
	getProfil : function()
	{
		$.ajax({
			url     : "/Membre.php?Pseudo=" + this.pseudo,
			async   : false,
			success : function(data){
				var regexp = new RegExp("x=(\\d*) et y=(\\d*)");
				var ligne  = $(data).find(".boite_membre a[href^='carte2.php?']").text();
				Utils.data.x = ~~(ligne.replace(regexp, "$1"));
				Utils.data.y = ~~(ligne.replace(regexp, "$2"));
				Utils.data.id = $(data).find("a[href^='commerce.php?ID=']").attr("href").match(/\d+/g)[0];
			}
		});
	},
	/**
	* Récupére les données sur les joueurs sous surveillance.
    *
	* @method getRadar
	* @return Charge les données dans la classe.
	*/
	getRadar : function()
	{
		var data = localStorage.getItem("outiiil_radar");
		// Si des données sont deja presente et à jour on les charges
		if(data) this.radar = JSON.parse(data);
	},
	/**
	* Formate un nombre entier en temps.
    *
	* @method intToTime
	* @param {Integer} val
	* @return {String} La chaine formatée.
	*/
	intToTime : function(val)
	{
		var annee, jours, temp, heures, minutes, secondes;
		var message = "";
			
		if(val > 0){
			annee = Math.floor(val / 31536000);
			val = val - (Math.floor(val / 31536000) * 31536000);
			jours = Math.floor(val / 86400);
			temp = val - jours * 86400;
			heures = Math.floor(temp / 3600);
			minutes = Math.floor( ( (temp / 3600) - Math.floor(temp / 3600) ) * 60);
			secondes = temp - ((Math.floor(temp / 60)) * 60);
			if(annee) message += numeral(annee).format() + "A ";
			if(jours) message += jours + "J ";
			if(heures) message += heures + "h ";
			if(minutes) message += minutes + "m ";
			if(secondes) message += secondes.toFixed(0) + "s";
		}else
			return "0 sec";
		return message;
	},
    /**
	* Convertit une chaine de caractere en entier.
    *
	* @method timeToInt
	* @param {String} val
	* @return {Integer} le nombre de seconde correspondant la chaine.
	*/
	timeToInt : function(val)
	{
		var regexp = new RegExp("((\\d+)J )?\s*((\\d+)h )?\s*((\\d+)m )?\s*((\\d+)s)?\s*", "i"), duree = 0, sec, minute, heure, jour;
		if(sec = val.replace(regexp, "$8"))
			duree += ~~sec;
		if(minute = val.replace(regexp, "$6"))
			duree += (~~minute * 60);
		if(heure = val.replace(regexp, "$4"))
			duree += (~~heure * 3600);
		if(jour = val.replace(regexp, "$2"))
			duree += (~~jour * 86400);
		return duree;
	},
	/**
	* Decremente un chrono dynamique toute les secondes.
	* 
	* @method decreaseTime
	* @param {Integer} time
	* @param {String} id
	* @return L'affichage du contenue de l'id est decrementé d'une seconde.
	*/
	decreaseTime : function(time, id)
	{
		$("#" + id).text(this.intToTime(time));
		if(time > 0)
			setTimeout(function(){Utils.decreaseTime(time - 1, id);}, 1000);
	},
	/**
	* Réduit la taille d'une chaine de caractére qui représente une durée.
	* 
	* @method shortcutTime
	* @param {String} time
	* @return {String} La chaine coupée.
	*/
	shortcutTime : function(time)
	{
		var tmp = time.split(" ");
		if(tmp.length > 4)
			return tmp.splice(0, tmp.length - 3).join(" ");
		else if(tmp.length > 3)
			return tmp.splice(0, tmp.length - 2).join(" ");
		else if(tmp.length > 2)
			return tmp.splice(0, tmp.length - 1).join(" ");
		else
			return tmp.join(" ");
	},
	/**
	* Extrait les paramétres d'une URL.
	* 
	* @method extractUrlParams
	* @return {Array} La liste associatives des paramétres.
	*/
	extractUrlParams : function()
	{
		var f = new Array();
		var t = location.search.substring(1).split('&');
		if(t != ''){
			for (i = 0, l = t.length ; i < l ; i++){
				var x = t[i].split('=');
				f["" + x[0]] = "" + x[1];
			}
		}
		return f;
	},
	/**
	* Supprime les elements HTML d'un objet element.
	* 
	* @method noHTML
	* @param {String} element
	* @return {String} La chaine sans les balises HTML.
	*/
	noHTML : function(element)
	{
		var tmp = JSON.stringify(element);
		var parsed = $("<div/>").append(tmp);
		var res = parsed.text();
		return JSON.parse(res);
	}
};
