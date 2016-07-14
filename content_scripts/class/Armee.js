/*
 * Armee.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/

/**
* Classe de gestion de l'armée.
* 
* @class Armee
* @constructor
* @extends Class
*/
var Armee = Class.extend({
	/**
	* Initialise les données de l'armée.
    *
	* @private
	* @method initialize
	* @return
	*/
	initialize : function()
	{
		// Nombre d'unite
		this.unite         = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.nbrJSN        = 0;
		
		this.hunt_ratio    = [1, 2, 3, 4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10];
		this.hunt_reply    = [0, 0, 0, 0.016, 0.093, 0.345, 0.577777778, 0.753, 0.837, 0.874, 0.937, 0.96, 0.989];

		this.hunt_lossMin  = [0.103971824, 0.066805442, 0.036854146, 0.014477073, 0.010067247, 0.008361713, 0.00751662, 0.007060666, 0.006692853, 0.006402339, 0.006090569, 0.0057788, 0.005080623];
		this.hunt_lossAvg  = [0.14183641, 0.089382202, 0.065595625, 0.037509208, 0.024982573, 0.018532185, 0.014281932, 0.011725921, 0.010437083, 0.009834768, 0.009339662, 0.008844556, 0.008502895];
		this.hunt_lossMax  = [0.33333334, 0.176739357, 0.113191158, 0.08245817, 0.051342954, 0.036955988, 0.03395735, 0.032083615, 0.026461955, 0.024588162, 0.021774264, 0.018960366, 0.017190797];
		
		this.data_dispatch = [10, 3, 4, 1, 12, 7, 5, 13, 11, 9, 8, 6, 2];
		this.data_xp       = [10, 3, 4, 1, 12, 7, 5];

		this.floods        = [];
		this.repartition   = [];
	},
	/**
	* Récupére l'armée du joueur via un appel ajax.
    *
	* @private
	* @method getArmee
	* @return
	*/
	getArmee : function()
	{
		var self = this;
		$.ajax({
			url     : "/Armee.php",
			async   : false,
			success : function(data){
				$(data).find(".simulateur tr[align='center']:lt(14)").each(function(){
					var label = $(this).find(".pas_sur_telephone").text();
					if(label)
						$(this).find("td span").each(function(){self.unite[Utils.nomU.indexOf(label) - 1] += parseInt($(this).text().replace(/[^0-9]/g, ''));});
				});
				self.nbrJSN = self.unite[0];
				// On garde de coté le nombre d'attaque restante
				Utils.resteAttaque = Utils.data.niveauRecherche[6] + 2 - $(data).text().split("- Vous allez attaquer").length;
			}
		});
	},
	/**
	* Donne le compte rendu de l'armée.
    *
	* @private
	* @method toString
	* @return {String} description
	*/
	toString : function()
	{
		var s = "";
		for(var i = 0 ; i < 14 ; i++)
			if(this.unite[i])
				s += numeral(this.unite[i]).format() + " " + Utils.nomU[i + 1] + ", ";
		return s.slice(0, -2) + ".";
	},
	/**
	* Calcule le nombre d'unité de l'armee.
    *
	* @private
	* @method getSommeUnite
	* @return {Integer} la somme des unités
	*/
	getSommeUnite : function()
	{
		return _.sum(this.unite);
	},
	/**
	* Calcule le temps de ponte de l'armée en fonction de la vitesse de ponte.
    *
	* @private
	* @method getTemps
	* @param {Integer} vitesse de ponte
	* @return {Integer} nombre de secondes
	*/
	getTemps : function(vdp)
	{
		var total = 0;
		for(var i = 0 ; i < 14 ; i++)
			total += (this.unite[i] * Utils.tempsU[i + 1] * Math.pow(0.9, vdp));
		return total;
	},
	/**
	* Calcule le nombre de point de vie de base.
    *
	* @private
	* @method getBaseVie
	* @return {Integer} Points de vie hors bonus.
	*/
	getBaseVie : function()
	{
		var total = 0;
		for(var i = 0 ; i < 14 ; i++)
			total += (this.unite[i] * Utils.vieU[i + 1]);
		return total;
	},
	/**
	* Calcule le nombre de point de vie bonus.
    *
	* @private
	* @method getBonusVie
	* @param {Integer} bonus
	* @return {Integer} Points de vie avec bonus bouclier
	*/
	getBonusVie : function(bonus)
	{
		return Math.round(this.getBaseVie() * bonus / 10);
	},
	/**
	* Calcule le nombre de point de vie bonus du lieu.
    *
	* @private
	* @method getBonusLieuVie
	* @param {Integer} bonus
	* @param {Integer} lieu
	* @return {Integer} Points de vie avec bonus bouclier et dome ou loge.
	*/
	getBonusLieuVie : function(bonus, lieu)
	{
		if(lieu == 2)
			return Math.round(this.getBaseVie() * ((bonus + 2) /20));
		if(lieu == 3)
			return Math.round(this.getBaseVie() * (((bonus + 2) * 3) /20));
		else
			return 0;
	},
	/**
	* Calcule le nombre de point de vie total de l'armée.
    *
	* @private
	* @method getTotalVie
	* @param {Integer} bonus
	* @param {Integer} lieu
	* @param {Integer} bonusLieu
	* @return {Integer} Somme des points de vie de l'armée.
	*/
	getTotalVie : function(bonus, lieu, bonusLieu)
	{
		return this.getBaseVie() + this.getBonusVie(bonus) + this.getBonusLieuVie(bonusLieu, lieu);
	},
	/**
	* Calcule le nombre de point d'attaque de base.
    *
	* @private
	* @method getBaseAtt
	* @return {Integer} Points de combat hors bonus.
	*/
	getBaseAtt : function()
	{
		var total = 0;
		for(var i = 0 ; i < 14 ; i++)
			total += (this.unite[i] * Utils.attU[i + 1]);
		return total;
	},
	/**
	* Calcule le nombre de point d'attaque avec bonus.
    *
	* @private
	* @method getBonusAtt
	* @param {Integer} bonus
	* @return {Integer} Points de combat avec bonus.
	*/
	getBonusAtt : function(bonus)
	{
		return Math.round(this.getBaseAtt() * bonus / 10);
	},
	/**
	* Calcule le nombre de point d'attaque total de l'armée.
    *
	* @private
	* @method getTotalAtt
	* @param {Integer} bonus
	* @return {Integer} Somme des points de combat de l'armée.
	*/
	getTotalAtt : function(bonus)
	{
		return this.getBaseAtt() + this.getBonusAtt(bonus);
	},
	/**
	* Calcule le nombre de point en défense de base.
    *
	* @private
	* @method getBaseDef
	* @return {Integer} Points de défense hors bonus.
	*/
	getBaseDef : function()
	{
		var total = 0;
		for(var i = 0 ; i < 14 ; i++)
			total += (this.unite[i] * Utils.defU[i + 1]);
		return total;
	},
	/**
	* Calcule le nombre de point en défense avec bonus.
    *
	* @private
	* @method getBonusDef
	* @param {Integer} bonus
	* @return {Integer} Points de défense avec bonus.
	*/
	getBonusDef : function(bonus)
	{
		return Math.round(this.getBaseDef() * bonus / 10);
	},
	/**
	* Calcule le nombre de point en défense total de l'armée.
    *
	* @private
	* @method getTotalDef
	* @param {Integer} bonus
	* @return {Integer} Somme des points de défense de l'armée.
	*/
	getTotalDef : function(bonus)
	{
		return this.getBaseDef() + this.getBonusDef(bonus);
	},
	/**
	* Calcule la consommation en nourriture de l'armée.
    *
	* @private
	* @method getConsommation
	* @param {Integer} lieu
	* @return {Integer} Consommation de l'armée.
	*/
	getConsommation : function(lieu)
	{
		var total = 0;
		for(var i = 0 ; i < 14 ; i++)
			total += Math.round(this.unite[i] * Utils.coutU[i + 1] * 0.05 * lieu);
		return total;
	},
	/**
	* Modifier le nombre de JSN de l'armée.
    *
	* @private
	* @method setJSN
	* @param {Integer} nbr
	* @return
	*/
	setJSN : function(nbr)
	{
		this.unite[0] = this.nbrJSN - nbr;
	},

	/* ------------------------------------------------------------------ */
	/* ---- Méthode pour chasser ---------------------------------------- */
	/* ------------------------------------------------------------------ */

	/**
	* Calcule le nombre de chasse et le terrain par chasse en fonction de la difficulté du terrain de depart et du nombre de chasse restante.
    *
	* @private
	* @method calculeChasse
	* @param {Integer} tdcDep
	* @param {Float} diffChasse
	* @param {Integer} fixNB
	* @param {Integer} fixHF
	* @param {Integer} reste
	* @return {Object} Objet avec le nombre de chasse et le terrain par chasse.
	*/
	calculeChasse : function(tdcDep, diffChasse, fixNB, fixHF, reste)
	{
		var iHuntCm2 = fixHF ? fixHF : Math.round(tdcDep * 3 / 10);
		var iHuntNb  = fixNB ? fixNB : 1;
		// Try to set the number of hunt.
		if(!fixNB)
			while(this.calculeRatio(tdcDep, iHuntNb + 1, iHuntCm2) >= diffChasse && iHuntNb < reste)
				iHuntNb += 1;
		// If the hunt is too difficult, try to reduce hunted amount.
		if(!fixHF){
			var bBoucle = (iHuntCm2 > 5000000000000);
			for(var j = 5000000000000 ; j > 4 ; j = j / 10){
				bBoucle = (iHuntCm2 > j);
				if(bBoucle)
					bBoucle = (this.calculeRatio(tdcDep, iHuntNb, iHuntCm2 - j) < diffChasse && iHuntCm2 > 1);
				while(bBoucle){
					iHuntCm2 -= j;
					bBoucle = iHuntCm2 > j;
					if (bBoucle)
						bBoucle = (this.calculeRatio(tdcDep, iHuntNb, iHuntCm2 - j) < diffChasse && iHuntCm2 > 1);
				}
			}
			bBoucle = iHuntCm2 > 1;
			if(bBoucle)
				bBoucle = (this.calculeRatio(tdcDep, iHuntNb, iHuntCm2 - 1) < diffChasse && iHuntCm2 > 1);
			while(bBoucle){
				iHuntCm2 -= 1;
				bBoucle = iHuntCm2 > 1;
				if (bBoucle)
					bBoucle = (this.calculeRatio(tdcDep, iHuntNb, iHuntCm2 - 1) < diffChasse && iHuntCm2 > 1);
			}
			// if the hunt is easier than specified, try to increase hunt amount.
			for(var j = 5000000000000 ; j > 4 ; j = j / 10)
				while(this.calculeRatio(tdcDep, iHuntNb, iHuntCm2 + j) >= diffChasse)
					iHuntCm2 += j;
			while(this.calculeRatio(tdcDep, iHuntNb, iHuntCm2 + 1) >= diffChasse)
				iHuntCm2 += 1;
		}
		return {"NB" : iHuntNb, "HF" : iHuntCm2};
	},
	/**
	* Calcule le rapport entre la force de frappe et la difficulté
    *
	* @private
	* @method calculeRatio
	* @param {Integer} tdcDep
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @return {Float} ratio de la chasse
	*/
	calculeRatio : function(tdcDep, nbChasse, terrainChasse)
	{
		return this.getTotalAtt(Utils.data.niveauRecherche[2]) / this.calculeDifficulte(tdcDep, nbChasse, terrainChasse);
	},
	/**
	* Calcule la référence du ratio donné en paramétre si la chasse est paramétre manuellement.
    *
	* @private
	* @method calculeRefRatio
	* @param {Float} ratio
	* @return {Float} indice du ratio
	*/
	calculeRefRatio : function(ratio)
	{
		var iRet = 0.0;
		for(var i = 0, l = this.hunt_ratio.length ; i < l ; i++){
			if(ratio >= this.hunt_ratio[i])
				iRet = this.hunt_ratio[i];
		}
		return iRet;
	},
	/**
	* Calcule la difficulté de la chasse.
    *
	* @private
	* @method calculeDifficulte
	* @param {Integer} tdcDep
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @return {Float} Difficulté de la chasse.
	*/
	calculeDifficulte : function(tdcDep, nbChasse, terrainChasse)
	{
		var dDiff = 0;
		for(var iIter = 0 ; iIter < nbChasse ; iIter++){
			var dStart = tdcDep + terrainChasse * iIter;
			dDiff += ((terrainChasse + dStart * 0.01) * (Math.pow(1.04, (Math.round(Math.log(dStart / 50) / Math.log(Math.pow(10, 0.1)))))) * 3);
		}
		return dDiff;
	},
	/**
	* Calcule la difficulté par chasse.
    *
	* @private
	* @method calculeDifficultes
	* @param {Integer} tdcDep
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @return {Array} 
	*/
	calculeDifficultes : function(tdcDep, nbChasse, terrainChasse)
	{
		var dTabDiff = new Array();
		for(var iIter = 0 ; iIter < nbChasse ; iIter++){
			var dStart = tdcDep + terrainChasse * iIter;
			dTabDiff[iIter] = (terrainChasse + dStart * 0.01) * (Math.pow(1.04, (Math.round(Math.log(dStart / 50) / Math.log(Math.pow(10, 0.1)))))) * 3;
		}
		return dTabDiff;
	},
	/**
	* Calcule les pertes minimales, maximales et moyennes en fonction de la difficulté de la chasse.
    *
	* @private
	* @method calculePerte
	* @param {Float} ratioIndex
	* @param {Float} diff
	* @return {Object} les pertes MIN, MAX et AVG 
	*/
	calculePerte : function(ratioIndex, diff)
	{
		return {"MIN" : (this.hunt_lossMin[ratioIndex]) * diff / (10 + Utils.data.niveauRecherche[1]) * 10, "MAX" : (this.hunt_lossMax[ratioIndex]) * diff / (10 + Utils.data.niveauRecherche[1]) * 10, "AVG" :  (this.hunt_lossAvg[ratioIndex]) * diff / (10 + Utils.data.niveauRecherche[1]) * 10};
	},
	/**
	* Retourne la repartition des unités pour la chasse demandée.
    *
	* @private
	* @method simulerChasse
	* @param {Integer} tdcDep
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @param {Float} diffChasse
	* @param {Integer} fixNB
	* @param {Integer} fixHF
	* @param {Integer} reste
	* @return
	*/
	simulerChasse : function(tdcDep, nbChasse, terrainChasse, diffChasse, fixNB, fixHF, reste)
	{
		var iTabChasse = this.calculeChasse(tdcDep, diffChasse, fixNB, fixHF, reste), dDiff = this.calculeDifficulte(tdcDep, iTabChasse["NB"], iTabChasse["HF"]), iTabPerte = this.calculePerte(_.indexOf(this.hunt_ratio, parseFloat(diffChasse)), dDiff);
        if($("#o_chasseNbrAuto").is(':checked')){
			$("#o_chasseNbr").spinner("value", iTabChasse["NB"]);
			nbChasse = iTabChasse["NB"];
		}
		if($("#o_chasseTDCRepAuto").is(':checked')){
			$("#o_chasseTDCRep").spinner("value", iTabChasse["HF"]);
			terrainChasse = iTabChasse["HF"];
		}
		var ratio = this.calculeRatio(tdcDep, nbChasse, terrainChasse);
		this.repUniteChasse(nbChasse, this.calculeDifficulte(tdcDep, nbChasse, terrainChasse), this.calculeDifficultes(tdcDep, nbChasse, terrainChasse), this.hunt_lossMax[this.hunt_ratio.indexOf(this.calculeRefRatio(ratio))], 1.0);
		return {"repartition" : this.repartition, "nbChasse" : nbChasse, "terrainChasse" : terrainChasse, "ratio" : ratio, "ratioRef" : this.calculeRefRatio(ratio).toFixed(1), "iTabPerte" : iTabPerte};
        
	},
	/**
	* Répartie l'armée sur les chasses souhaitées.
    *
	* @private
	* @method repUniteChasse
	* @param {Integer} nbChasse
	* @param {Float} diff
	* @param {Array} tabDiff
	* @param {Float} refMaxLoss
	* @param {Float} securityFactor
	* @return
	*/
	repUniteChasse : function(nbChasse, diff, tabDiff, refMaxLoss, securityFactor)
	{
		this.repartition = new Array();
		// Available units.
		var iTabAvailableUnits = this.unite.slice();
		
		for(var iHuntNum = nbChasse - 1 ; iHuntNum >= 0 ; iHuntNum--){
			// Initialise unit array for this hunt.
			this.repartition[iHuntNum] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
			// Base attack of units to send for this hunt.
			var iHuntBaseAtt = (tabDiff[iHuntNum] / diff) * this.getBaseAtt();
			// Check for available Xp-able units.
			var bXp = false;
			for(var j = 0 ; j < 7 ; j++) 
				bXp = bXp || ((iTabAvailableUnits[this.data_xp[j]]) > 0);
			// compute YD number. If Xp : Max * factor, Else dispatch
			// between lasting hunts according to difficulty.
			if(bXp)
				this.repartition[iHuntNum][0] = Math.round(refMaxLoss * tabDiff[iHuntNum] / (10 + Utils.data.niveauRecherche[1]) * 10 * securityFactor);
			else{
				var iDiffLet = tabDiff[iHuntNum];
				for(var iHL = iHuntNum - 1 ; iHL >= 0 ; iHL--)
					iDiffLet += tabDiff[iHL];
				this.repartition[iHuntNum][0] = Math.round(iTabAvailableUnits[0] * tabDiff[iHuntNum] / iDiffLet);
			}
			// Deal with last hunt and check the round do not give more unit
			// than available.
			if(!iHuntNum || this.repartition[iHuntNum][0] > iTabAvailableUnits[0] || this.repartition[iHuntNum][0] < 0)
				this.repartition[iHuntNum][0] = iTabAvailableUnits[0];
			// Decrease lasting YD by the amount allocated to this hunt.
			iTabAvailableUnits[0] -= this.repartition[iHuntNum][0];
			// Decrease also required Att for this hunt
			iHuntBaseAtt -= (this.repartition[iHuntNum][0] * 3);
			// Dispatch other units.
			for(var j = 0 ; j < 13 ; j++){
				// Get unit index in dispatch order.
				var u = this.data_dispatch[j];
				if(iTabAvailableUnits[u] > 0 && iHuntBaseAtt > 0){
					if(iTabAvailableUnits[u] * Utils.attU[u + 1] > iHuntBaseAtt)
						this.repartition[iHuntNum][u] = Math.round(iHuntBaseAtt / Utils.attU[u + 1]);
					else
						this.repartition[iHuntNum][u] = iTabAvailableUnits[u];
					// Deal with last hunt and check the round do not give
					// more unit than available.
					if(!iHuntNum || this.repartition[iHuntNum][u] > iTabAvailableUnits[u] || this.repartition[iHuntNum][u] < 0)
						this.repartition[iHuntNum][u] = iTabAvailableUnits[u];
					// Decrease lasting units
					iTabAvailableUnits[u] -= this.repartition[iHuntNum][u];
					// Decrease also required Att for this hunt
					iHuntBaseAtt -= (this.repartition[iHuntNum][u] * Utils.attU[u + 1]);		
				}
			}
			// Si il maque de la force de frappe, malgré le placement des unités on utilise des JSN
			if(iHuntBaseAtt > 0){
				this.repartition[iHuntNum][0] += Math.round(iHuntBaseAtt / 3);
				iTabAvailableUnits[0] -= Math.round(iHuntBaseAtt / 3);
			}
		}
	},

	/* ------------------------------------------------------------------ */
	/* ---- Méthode pour Flooder ---------------------------------------- */
	/* ------------------------------------------------------------------ */

	/**
	* Optimisation de la prise de terrain sur une cible en fonction du nombre d'unité et du nombre d'attaque.
    *
	* @private
	* @method optimiserFlood
	* @param {Integer} tdcAtt
	* @param {Integer} tdcCible
	* @param {Integer} unite
	* @param {Integer} reste
	* @return
	*/
	optimiserFlood : function(tdcAtt, tdcCible, unite, reste)
	{
		var prise = 0;
		// -20% -20% -20%
		while(tdcAtt < Math.floor(tdcCible * 1.4) && reste > 0){
			prise = Math.floor(tdcCible * 0.2);
			if(unite >= prise){
				this.floods.push(prise);
				tdcAtt += prise, tdcCible -= prise, reste--, unite -= prise;
			}else{
				this.floods.push(unite);
				return;
			}
		}
		if(reste >= 2){
			// limite
			var limite = Math.floor((tdcCible * 2 - tdcAtt) / 3) - 1;
			if(limite && unite >= limite){
				this.floods.push(limite);
				tdcAtt += limite, tdcCible -= limite, unite -= limite;
			}else{
				this.floods.push(unite);
				return;
			}
			// dernier
			prise = Math.floor(tdcCible * 0.2);
			unite >= prise ? this.floods.push(prise) : this.floods.push(unite);
		}else if(reste == 1){
			// dernier
			prise = Math.floor(tdcCible * 0.2);
			unite >= prise ? this.floods.push(prise) : this.floods.push(unite);
		}
	},
	/**
	* Simule le placement des unités pour une methode de flood choisie.
    *
	* @private
	* @method simulerFlood
	* @param {Integer} tdcAtt
	* @param {Integer} tdcCible
	* @param {Integer} methode
	* @param {Integer} nbFlood
	* @param {Integer} qteFlood
	* @param {Boolean} antisonde
	* @param {Boolean} all
	* @param {Boolean} reste
	* @return {Object} Répartition des unités selon la méthode de flood.
	*/
	simulerFlood : function(tdcAtt, tdcCible, methode, nbFlood, qteFlood, antisonde, all, reste){
		this.floods = new Array();
		var sommeUnite = this.getSommeUnite();
		// Placement de l'antisonde
		if(antisonde){
			var priseMax = Math.floor(tdcCible * 0.2);
			if(antisonde > priseMax){
				tdcAtt += priseMax;
				tdcCible -= priseMax;
			}else{
				tdcAtt += antisonde;
				tdcCible -= antisonde;
			}
		}
		this.floods.push(antisonde);
		sommeUnite -= antisonde;
		if(sommeUnite <= 0) return this.floods;
		// Placement selon la méthode
		if(methode == 1) // Opti
			this.optimiserFlood(tdcAtt, tdcCible, sommeUnite, reste);
		if(methode == 2) // Uniforme
			for(var i = 0 ; i < nbFlood ; i++){
				if(sommeUnite >= qteFlood){
					this.floods.push(qteFlood);
					sommeUnite -= qteFlood;
				}else{
					this.floods.push(sommeUnite);
					break;
				}
			}
		if(methode == 3){ // Degressive
			var tdctmp = tdcCible;
			for(var i = 0 ; i < nbFlood ; i++){
				prise = Math.floor(tdctmp * 0.2);
				if(sommeUnite >= prise){
					tdctmp -= prise, sommeUnite -= prise;
					this.floods.push(prise);
				}else{
					this.floods.push(sommeUnite);
					break;
				}
			}
		}
		// Placement de toute les unités si il en reste
		if(all){
			// calcule du nombre d'unité restante
			var reste = this.getSommeUnite() - _.sum(this.floods);
			if(reste){
				// on cherche la premiere position à 20% de prise aprés l'antisonde
				var tdcTmp = tdcCible;
				for(var i = 1, l = this.floods.length ; i < l ; i++){
					var pourcentage = Math.ceil(this.floods[i] * 100 / tdcTmp);
					if(pourcentage >= 20){
						this.floods[i] += reste;
						break;
					}
					tdcTmp -= Math.floor(tdcTmp * 0.2);
				}
			}
		}
		return this.floods;
	},
	/**
	* Répartie l'armée sur les floods souhaitées.
    *
	* @private
	* @method repUniteFlood
	* @return
	*/
	repUniteFlood : function()
	{
		this.repartition = new Array();
		// Available units.
		var iTabAvailableUnits = this.unite.slice();
		for(var i = 0, l = this.floods.length ; i < l ; i++){
			this.repartition[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for(var j = 0 ; j < 14 ; j++){
				if(iTabAvailableUnits[j]){
					this.repartition[i][j] = iTabAvailableUnits[j] >= this.floods[i] ? this.floods[i] : iTabAvailableUnits[j];
					this.floods[i] -= this.repartition[i][j], iTabAvailableUnits[j] -= this.repartition[i][j];
					if(!this.floods[i]) break;
				}
			}
		}
	}
});
