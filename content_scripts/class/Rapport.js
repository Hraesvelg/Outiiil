/*
 * Rapport.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe de fonctions pour analyser les rapports.
* 
* @class Rapport
* @constructor
* @extends Class
*/
var Rapport = Class.extend({
	/**
	* Convertit une armée sous forme de chaine de caractére en l'objet Armee.
    *
	* @private
	* @method analyseArmee
	* @param {String} str
	* @return {Object} Armee
	*/
	analyseArmee : function(str)
	{
		var armee = new Armee(), tmp = str.split(",");
		// pour chaque unités séparées par des virgules
		for(var i = 0, l = tmp.length ; i < l ; i++){
			var unit = (tmp[i] + " ").replace(/[0-9]/g, '').replace(/s /g, ' ').trim();
			armee.unite[Utils.nomU.indexOf(unit) - 1] = parseInt(tmp[i].replace(/\D+/g, ''));
		}
		return armee;
	},
	/**
	* Retourne l'armée en retirant d'aprés le rapport les unités perdues suivant le texte.
    *
	* @private
	* @method getPerte
	* @param {Object} armee
	* @param {String} rapport
	* @param {String} texte
	* @return {Object} armee perdue
	*/
	getPerte : function(armee, rapport, texte)
	{
		var res = new Armee(), tmp = rapport.split(texte), total = 0;
		res.unite = armee.unite.slice(0);
		// Si le rc à plusieurs tours on additionne d'abords les pertes.
		for(var i = 1, l = tmp.length ; i < l ; total += parseInt(tmp[i++].split('.')[0].replace(/ /g, '')));
		// Tant que le total n'est pas 0 on retire les unités
		for(var i = 0 ; i < 14 ; i++){
			if(res.unite[i] >= total){
				res.unite[i] -= total;
				break;
			}else{
				total -= res.unite[i];
				res.unite[i] = 0;
			}
		}
		return res;
	},
	/**
	* Retourne l'armée en ajoutant l'xp.
    *
	* @private
	* @method getXP
	* @param {Object} armee
	* @param {String} rapport
	* @return {Object} armee avec XP
	*/
	getXP : function(armee, rapport)
	{
		var res = new Armee(), tmp = rapport.split("- "), tableXP = [-1, 1, 2, -1, 4, 9, 6, -1, 8, -1, -1, 11, -1, 13, -1]; 
		res.unite = armee.unite.slice(0);
		// Pour chaques types d'unitées qui ont XP.
		for(var i = 1, l = tmp.length ; i < l ; i++){
			var uniteXP = Utils.nomU.indexOf(tmp[i].replace(/[0-9]/g, '').split("sont")[0].replace(/s /g, ' ').trim()), qteXP = parseInt(tmp[i].replace(/ /g, ''));
			res.unite[uniteXP - 1] -= qteXP;
			res.unite[tableXP[uniteXP]] += qteXP;
		}
		return res;
	},
	/**
	* Calcule le niveau d'armes en fonction des degats.
    *
	* @private
	* @method getArmes
	* @param {Integer} base
	* @param {Integer} bonus
	* @return {Integer} le niveau d'armes
	*/
	getArmes : function(base, bonus)
	{
		return Math.round(bonus / base * 10);
	},
	/**
	* Calcule la vie perdu de l'armée en fonction du nombre de victime.
    *
	* @private
	* @method getViePerdue
	* @param {Object} armee
	* @param {Integer} victime
	* @return {Integer} Point de vie perdue
	*/
	getViePerdue : function(armee, victime)
	{
		var uniteSupp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		// unitées tuées
		for(var i = 0 ; i < 14 ; i++){
			if(armee.unite[i]){
				if(armee.unite[i] > victime){
					uniteSupp[i] = victime;
					break;
				}else{
					uniteSupp[i] = armee.unite[i];
					victime -= armee.unite[i];
				}
			}
		}
		// calcule de la vie HB des unitées tuées
		var base = 0;
		for(var i = 0 ; i < 14 ; base += (uniteSupp[i] * Utils.vieU[i + 1]), i++);
		return base;
	},
	/**
	* Calcule le niveau du bouclier.
    *
	* @private
	* @method getBouclier
	* @param {Integer} degat
	* @param {Object} armee
	* @param {Integer} victime
	* @return {Integer} le niveau de bouclier
	*/
	getBouclier : function(degat, armee, victime)
	{
		var viePerdue = this.getViePerdue(armee, victime);
		return Math.round(((degat - viePerdue) / viePerdue) * 10);
	},
	/**
	* Calcule le bonus vie selon le lieu.
    *
	* @private
	* @method getBouclierLieu
	* @param {Integer} degat
	* @param {Object} armee
	* @param {Integer} victime
	* @param {Integer} armes2
	* @param {String} place
	* @return {String} les solutions possibles.
	*/
	getBouclierLieu : function(degat, armee, victime, armes2, place)
	{
		var viePerdue = this.getViePerdue(armee, victime), solution = "", lieu = -1;
		if(place == "dome"){
			for(var bouclier = armes2 - 3 ; bouclier <= armes2 + 2 ; bouclier++){
				lieu = (((degat - viePerdue) / viePerdue) * 20 - 2) - (2 * bouclier);
				if(lieu <= 45)
					solution += bouclier + '/' + Math.round(lieu) + " - ";
			}
		}
		if(place == "loge"){
			for(var bouclier = armes2 - 3 ; bouclier <= armes2 + 2 ; bouclier++){
				lieu = (((degat - viePerdue) / viePerdue) * 20 / 3 - 2) - (2 * bouclier / 3);
				//alert(bouclier + " " + lieu + " " + degat + " " + (viePerdue + Math.round(viePerdue * bouclier / 10) + Math.round(viePerdue * (((lieu + 2) * 3) /20))));
				if(Math.abs(lieu - Math.round(lieu)) < 0.1 && lieu <= 45)
					solution += bouclier + '/' + Math.round(lieu) + " - ";
			}
		}
		return _.trimEnd(solution, " - ");
	}
});

/**
* Classe de fonction pour l'analyse d'un rapport de combat, herite des fonctions de la classe Rapport.
* 
* @class Combat
* @constructor
* @extends Rapport
*/
var Combat = Rapport.extend({
	/**
	* Initialise une rapport de combat.
    *
	* @private
	* @method initialize
	* @return
	*/
	initialize : function()
	{
		// Info Lieu
		this.lieu      = "";
		// Info vous
		this.armee1    = new Armee();
		this.armee1Pe  = new Armee();
		this.armee1XP  = new Armee();
		this.bonusAtt1 = -1;
		this.bonusVie1 = "";
		// Info ennemie
		this.armee2    = new Armee();
		this.armee2Pe  = new Armee();
		this.bonusAtt2 = -1;
		this.bonusVie2 = "";
	},
	/**
	* Analyse un rapport sous forme de string.
    *
	* @private
	* @method analyse
	* @param {String} rapport
	* @return
	*/
	analyse : function(rapport)
	{
		// Récuperation des armées
		if(rapport.indexOf("Vous attaquez") != -1){
			this.armee1 = this.analyseArmee(rapport.split("Troupes en attaque : ")[1].split(".")[0]);
			this.armee2 = this.analyseArmee(rapport.split("Troupes en défense : ")[1].split(".")[0]);
		}else{
			this.armee1 = this.analyseArmee(rapport.split("Troupes en défense : ")[1].split(".")[0]);
			this.armee2 = this.analyseArmee(rapport.split("Troupes en attaque : ")[1].split(".")[0]);
		}
		this.armee1Pe = this.getPerte(this.armee1, rapport, "et en tue");
		this.armee1XP = this.getXP(this.armee1Pe, rapport);
		this.armee2Pe = this.getPerte(this.armee2, rapport, "et tuez");
		// Calcule du niveau d'arme du "Vous"
		var tmp1   = rapport.split("Vous infligez")[1].split("dégâts")[0]; 
		var base1  = parseInt(tmp1.split("(")[0].replace(/ /g, ""));
		var bonus1 = parseInt(tmp1.split("+")[1].split(")")[0].replace(/ /g, "")); 
		this.bonusAtt1 = this.getArmes(base1, bonus1);
		// Calcule du niveau d'arme de "l'ennemie"
		var tmp2   = rapport.split("ennemie inflige")[1].split("dégâts")[0]; 
		var base2  = parseInt(tmp2.split("(")[0].replace(/ /g, ""));
		var bonus2 = parseInt(tmp2.split("+")[1].split(")")[0].replace(/ /g, "")); 
		this.bonusAtt2 = this.getArmes(base2, bonus2);
		// Calcule du niveau bouclier de "l'ennemie"
		// On peut calculer le bouclier du joueur 2 ("ennemie") si on n'est pas en OS ou qu'on à perdu
		if(rapport.split("et tuez").length > 2 || rapport.indexOf("Vous avez gagné") == -1){
			var nbVictime = parseInt(rapport.split("et tuez")[1].split(".")[0].replace(/ /g, ""));
			// Si on est en terrain ou en defense pas de bonus de lieu
			if(rapport.indexOf("Vous attaquez") == -1 || rapport.indexOf("Terrain") != -1)
				this.bonusVie2 = this.getBouclier(base1 + bonus1, this.armee2, nbVictime);
			else
				this.bonusVie2 = this.getBouclierLieu(base1 + bonus1, this.armee2, nbVictime, this.bonusAtt2, rapport.indexOf("fourmilière") != -1 ? "dome" : "loge");
		}
		// Calcule du niveau bouclier pour "vous"
		// On peut calculer le bouclier du joueur 1 ("vous") si on n'est pas en OS ou qu'on à gagner
		if(rapport.split("et en tue").length > 2 || rapport.indexOf("Vous avez gagné") != -1){
			var nbVictime = parseInt(rapport.split("et en tue")[1].split(".")[0].replace(/ /g, ""));
			// Si on est en terrain ou en attaque
			if(rapport.indexOf("Vous attaquez") != -1 || rapport.indexOf("Terrain") != -1)
				this.bonusVie1 = this.getBouclier(base2 + bonus2, this.armee1, nbVictime);
			else                              
				this.bonusVie1 = this.getBouclierLieu(base2 + bonus2, this.armee1, nbVictime, this.bonusAtt1, rapport.indexOf("fourmilière") != -1 ? "dome" : "loge");
		}
		// Recuperation du lieu du combat
		if(rapport.indexOf("Terrain de Chasse") != -1) this.lieu = "terrain";       
		if(rapport.indexOf("fourmilière") != -1) this.lieu = "dome";       
		if(rapport.indexOf("Loge Impériale") != -1) this.lieu = "loge";       
	}
});
	
/**
* Classe de fonction pour l'analyse d'un rapport de chasse, herite des fonctions de la classe Rapport.
*
* @class Chasse
* @constructor
* @extends Rapport
*/
var Chasse = Rapport.extend({
    /**
	* Initialise une rapport de chasse.
    *
	* @private
	* @method initialize
	* @return
	*/
	initialize : function()
	{
		this.armee   = new Armee();
		this.armeePe = new Armee();
		this.armeeXP = new Armee();
	},
	/**
	* Récupére l'armée, les pertes et l'xp d'un rapport de chasse. 
    *
	* @private
	* @method analyse
	* @param {String} rapport
	* @return
	*/
	analyse : function(rapport)
	{
		this.armee   = this.analyseArmee(rapport.split("Troupes en attaque : ")[1].split(".")[0]);
		this.armeePe = this.getPerte(this.armee, rapport, "et en tue");
		this.armeeXP = this.getXP(this.armeePe, rapport);
	},
	/**
	* Ajoute les données des chasses pour faire un bilan.
    *
	* @private
	* @method ajoute
	* @param {Object} chasse
	* @return
	*/
	ajoute : function(chasse)
	{
		for(var i = 0 ; i < 14 ; this.armee.unite[i] += chasse.armee.unite[i++]);
		for(var i = 0 ; i < 14 ; this.armeePe.unite[i] += chasse.armeePe.unite[i++]);
		for(var i = 0 ; i < 14 ; this.armeeXP.unite[i] += chasse.armeeXP.unite[i++]);
	}
});
