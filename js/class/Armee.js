 /*
 * Armee.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de gestion de l'armée.
*
* @class Armee
* @constructor
*/
class Armee
{
	constructor(parametres = {})
	{
		/**
        * Tableau du nombre des unités.
        *
        * @private
        * @property unite
        * @type array
        */
        this._unite = new Array(14).fill(0);
        if(parametres.hasOwnProperty("unite"))
            for(let i = 0 ; i < 14 ; i++)
                if(parametres.unite.hasOwnProperty(NOM_UNITE[i + 1]))
                    this._unite[i] = parametres.unite[NOM_UNITE[i + 1]];
        /**
        * Sauvegarde du nombre de JSN pour le lancement des chasses.
        *
        * @private
        * @property nbrJSN
        * @type integer
        */
		this._nbrJSN = 0;
        /**
        * tableau de la repartition des floods.
        *
        * @private
        * @property floods
        * @type array
        */
		this._floods = new Array();
        /**
        * Repartition de l'armée en fonction des floods ou des chasses.
        *
        * @private
        * @property repartition
        * @type array
        */
		this._repartition = new Array();
	}
    /**
    *
    */
    get unite()
    {
        return this._unite;
    }
    /**
    *
    */
    set unite(newUnite)
    {
        this._unite = newUnite;
    }
    /**
    *
    */
    get nbrJSN()
    {
        return this._nbrJSN;
    }
    /**
    *
    */
    set nbrJSN(nbr)
    {
        this._nbrJSN = nbr;
    }
    /**
    *
    */
    get floods()
    {
        return this._floods;
    }
    /**
    *
    */
    set floods(newFloods)
    {
        this._floods = newFloods;
    }
    /**
    *
    */
    get repartition()
    {
        return this._repartition;
    }
	/**
	* Récupére l'armée du joueur via un appel ajax.
    *
	* @private
	* @method getArmee
	*/
	getArmee()
	{
		return $.ajax({url : "http://" + Utils.serveur + ".fourmizzz.fr/Armee.php"});
	}
    /**
    *
    */
    chargeData(html)
    {
        $(html).find(".simulateur tr[align='center']:lt(14)").each((i, elt) => {
            let label = $(elt).find(".pas_sur_telephone").text();
            if(label)
				$(elt).find("td span").each((i2, elt2) => {this._unite[NOM_UNITE.indexOf(label) - 1] += parseInt($(elt2).text().replace(/[^0-9]/g, ''));});
        });
		this._nbrJSN = this._unite[0];
        return this;
    }
	/**
	* Donne le compte rendu de l'armée.
    *
	* @private
	* @method toString
	* @return {String} description
	*/
	toString()
	{
		let s = "";
        this._unite.forEach((elt, ind) => {return s += (elt ? numeral(elt).format() + " " + (elt > 1 ? NOM_UNITES[ind + 1] : NOM_UNITE[ind + 1]) + ", " : "");});
		return s.slice(0, -2) + ".";
	}
    /**
	* Convertie une armée sous forme de chaine de caractére en l'objet Armee.
    *
	* @private
	* @method toString
    * @param {String} armee au format string.
	*/
    parseArmee(texte)
    {
        let RegExpToutSaufChiffre = new RegExp("[^0-9]", "g"); //Capture tout sauf les chiffres
        let unite0 = new RegExp("(\\bgs\\b)|(Goules? Sauvages?)|(\\bjsn\\b)|(Jeunes? Soldates? Naines?)|(Young dwarf)|(Young dwarves)", "gi");
        let unite1 = new RegExp("(\\bg\\b)|(Goules?)|(\\bsn\\b)|(Soldates? Naines?)|(Dwarf)|(Dwarves)", "gi");
        let unite2 = new RegExp("(\\bcd?g\\b)|(Chefs? des Goules?)|(\\bne\\b)|(Naines? d')|(Naines? d’)|(Top dwarf)|(Top dwarves)", "gi");
        let unite3 = new RegExp("(\\bmer?\\b)|(Mercenaires?)|(\\bjs\\b)|(Jeunes? Soldates?)|(Young soldiers?)", "gi");
        let unite4 = new RegExp("(\\bpil?\\b)|(Pillards?)|(\\bs\\b)|(Soldates?)|(Soldiers?)", "gi");
        let unite5 = new RegExp("(\\pro?\\b)|(Protectrons?)|(\\bc\\b)|(Concierges?)|(doorkeepers?)", "gi");
        let unite6 = new RegExp("(\\bce\\b)|(Concierges? d')|(Concierges? d’)|(Top doorkeepers?)", "gi");
        let unite7 = new RegExp("(\\bmut?\\b)|(Mutants?)|(\\ba\\b)|(Artilleuses?)|(Fire ants?)", "gi");
        let unite8 = new RegExp("(\\bsm\\b)|(\\bsmut?\\b)|(Supers? Mutants?)|(\\bae\\b)|(Artilleuses? d')|(Artilleuses? d’)|(Top fire ants?)", "gi");
        let unite9 = new RegExp("(\\bcom?\\b)|(Commandos?)|(\\bse\\b)|(Soldates? d')|(Soldates? d’)|(Top soldiers?)", "gi");
        let unite10 = new RegExp("(\\bnu?\\b)|(Nucleotrons?)|(\\bta\\b)|(\\btk\\b)|(Tanks?)", "gi");
        let unite11 = new RegExp("(\\btae\\b)|(\\btke\\b)|(Tanks? d')|(Tanks? d’)|(Top tanks?)", "gi");
        let unite12 = new RegExp("(\\bche?\\b)|(Chevaliers?)(\\btu\\b)|(Tueuses?)|(Killers?)", "gi");
        let unite13 = new RegExp("(\\bpa?\\b)|(Paladins?)|(\\btue\\b)|(Tueuses? d'?)|(Tueuses? d’?)|(Top killers?)", "gi");
        let unite = new Array (unite0, unite1, unite2, unite3, unite4, unite5, unite6, unite7, unite8, unite9, unite10, unite11, unite12, unite13);
        let interdit = new RegExp("(Vos raiders.*secondes?)|(Vos chasseuses.*secondes?)|(Vous allez attaquer.*secondes?)|(inflige.*\.)|(Arriv.*[0-9]{2}h[0-9]{2})|(\\(s\\))", "gi");
        let kilo = new RegExp("([0-9]+)k\\b|(kilos?)", "gi");
        let mega = new RegExp("([0-9]+)m\\b|(megas?)", "gi");
        let giga = new RegExp("([0-9]+)g\\b|(gigas?)", "gi");
        let tera = new RegExp("([0-9]+)t\\b|(teras?)", "gi");
        // L'ordre est important car sans lui �a va remplacer Top soldiers par Top unite5 qui est le soldier.
        let ordre = new Array (0, 2, 1, 3, 9, 4, 8, 7, 6, 5, 11, 10, 13, 12);
        // initialistion du nombre d'unité
        this._unite = new Array(14).fill(0);
        // on match le texte d'entrée
        texte = texte.replace(interdit, "");
        for(let i = 0 ; i < unite.length ; i++)
            texte = texte.replace(unite[ordre[i]], "{separateur}unite" + ordre[i] + "{separateur}");
        texte = texte.replace(kilo, "$1 000");
        texte = texte.replace(mega, "$1 000 000");
        texte = texte.replace(giga, "$1 000 000 000");
        texte = texte.replace(tera, "$1 000 000 000 000");

        let texteSplit = texte.split("{separateur}");
        // On regarde si il y a des chiffres dans le premier split
        let decalage = texteSplit[0].replace(RegExpToutSaufChiffre, '').length > 0 ? -1 : 1;

        let temp = "";
        for(let i = 0 ; i < texteSplit.length ; i++){
            for(let j = unite.length - 1 ; j >= 0 ; j--){
                if(texteSplit[i].indexOf("unite" + j) >= 0){
                    if(texteSplit[i + decalage].indexOf('\t') < 0){
                        temp = parseInt(texteSplit[i + decalage].replace(RegExpToutSaufChiffre, ''));
                        if(isNaN(temp)) temp = 0;
                        this._unite[j] += temp;
                    }else{
                        let splitQuantite = texteSplit[i + decalage].split('\t');
                        for(let k = 0 ; k < splitQuantite.length ; k++){
                            temp = parseInt(splitQuantite[k].replace(RegExpToutSaufChiffre, ''), 10);
                            if(isNaN(temp)) temp = 0;
                            this._unite[j] += temp;
                        }
                    }
                    break;
                }
            }
        }
        return this;
    }
	/**
	* calcul le nombre d'unité de l'armee.
    *
	* @private
	* @method getSommeUnite
	* @return {Integer} la somme des unités
	*/
	getSommeUnite()
	{
        return this._unite.reduce((acc, val) => {return acc + Math.ceil(val);}, 0);
	}
	/**
	* calcul le temps de ponte de l'armée en fonction de la vitesse de ponte.
    *
	* @private
	* @method getTemps
	* @param {Integer} vitesse de ponte
	* @return {Integer} nombre de secondes
	*/
	getTemps(tdp)
	{
        return this._unite.reduce((acc, val, i) => {return acc + (val * TEMPS_UNITE[i + 1] * Math.pow(0.9, tdp))}, 0);
	}
	/**
	* calcul le nombre de point de vie de base.
    *
	* @private
	* @method getBaseVie
	* @return {Integer} Points de vie hors bonus.
	*/
	getBaseVie()
	{
        return this._unite.reduce((acc, val, i) => {return acc + (val * VIE_UNITE[i + 1])}, 0);
	}
	/**
	* calcul le nombre de point de vie bonus.
    *
	* @private
	* @method getBonusVie
	* @param {Integer} bonus
	* @return {Integer} Points de vie avec bonus bouclier
	*/
	getBonusVie(bonus)
	{
		return Math.round(this.getBaseVie() * bonus / 10);
	}
	/**
	* calcul le nombre de point de vie bonus du lieu.
    *
	* @private
	* @method getBonusLieuVie
	* @param {Integer} bonus
	* @param {Integer} lieu
	* @return {Integer} Points de vie avec bonus bouclier et dome ou loge.
	*/
	getBonusLieuVie(bonus, lieu)
	{
		if(lieu == LIEU.DOME)
			return Math.round(this.getBaseVie() * ((bonus + 2) /20));
		if(lieu == LIEU.LOGE)
			return Math.round(this.getBaseVie() * (((bonus + 2) * 3) /20));
		else
			return 0;
	}
	/**
	* calcul le nombre de point de vie total de l'armée.
    *
	* @private
	* @method getTotalVie
	* @param {Integer} bonus
	* @param {Integer} lieu
	* @param {Integer} bonusLieu
	* @return {Integer} Somme des points de vie de l'armée.
	*/
	getTotalVie(bonus, lieu = LIEU.TERRAIN, bonusLieu = 0)
	{
		return this.getBaseVie() + this.getBonusVie(bonus) + this.getBonusLieuVie(bonusLieu, lieu);
	}
    /**
    *
    */
    getNonXpBaseVie()
    {
        let tabNonXp = [1, 2, 4, 5, 6, 8, 11, 13];
        return this._unite.reduce((acc, val, i) => {return tabNonXp.includes(i+ 1) ? acc + val * VIE_UNITE[i + 1] : acc}, 0);
    }
    /**
    *
    */
    getNonXPBonusVie(bonus)
	{
		return Math.round(this.getNonXpBaseVie() * bonus / 10);
	}
    /**
    *
    */
    getNonXpTotalVie(bonus)
    {
        return this.getNonXpBaseVie() + this.getNonXPBonusVie(bonus);
    }
	/**
	* calcul le nombre de point d'attaque de base.
    *
	* @private
	* @method getBaseAtt
	* @return {Integer} Points de combat hors bonus.
	*/
	getBaseAtt()
	{
        return this._unite.reduce((acc, val, i) => {return acc + (val * ATT_UNITE[i + 1])}, 0);
	}
	/**
	* calcul le nombre de point d'attaque avec bonus.
    *
	* @private
	* @method getBonusAtt
	* @param {Integer} bonus
	* @return {Integer} Points de combat avec bonus.
	*/
	getBonusAtt(bonus)
	{
		return Math.round(this.getBaseAtt() * bonus / 10);
	}
	/**
	* calcul le nombre de point d'attaque total de l'armée.
    *
	* @private
	* @method getTotalAtt
	* @param {Integer} bonus
	* @return {Integer} Somme des points de combat de l'armée.
	*/
	getTotalAtt(bonus)
	{
		return this.getBaseAtt() + this.getBonusAtt(bonus);
	}
    /**
    *
    */
    getNonXpBaseAtt()
    {
        let tabNonXp = [1, 2, 4, 5, 6, 8, 11, 13];
        return this._unite.reduce((acc, val, i) => {return tabNonXp.includes(i+ 1) ? acc + val * ATT_UNITE[i + 1] : acc}, 0);
    }
    /**
    *
    */
    getNonXPBonusAtt(bonus)
	{
		return Math.round(this.getNonXpBaseAtt() * bonus / 10);
	}
    /**
    *
    */
    getNonXpTotalAtt(bonus)
    {
        return this.getNonXpBaseAtt() + this.getNonXPBonusAtt(bonus);
    }
	/**
	* calcul le nombre de point en défense de base.
    *
	* @private
	* @method getBaseDef
	* @return {Integer} Points de défense hors bonus.
	*/
	getBaseDef()
	{
        return this._unite.reduce((acc, val, i) => {return acc + (val * DEF_UNITE[i + 1])}, 0);
	}
	/**
	* calcul le nombre de point en défense avec bonus.
    *
	* @private
	* @method getBonusDef
	* @param {Integer} bonus
	* @return {Integer} Points de défense avec bonus.
	*/
	getBonusDef(bonus)
	{
		return Math.round(this.getBaseDef() * bonus / 10);
	}
	/**
	* calcul le nombre de point en défense total de l'armée.
    *
	* @private
	* @method getTotalDef
	* @param {Integer} bonus
	* @return {Integer} Somme des points de défense de l'armée.
	*/
	getTotalDef(bonus)
	{
		return this.getBaseDef() + this.getBonusDef(bonus);
	}
    /**
    *
    */
    getNonXpBaseDef()
    {
        let tabNonXp = [1, 2, 4, 5, 6, 8, 11, 13];
        return this._unite.reduce((acc, val, i) => {return tabNonXp.includes(i+ 1) ? acc + val * DEF_UNITE[i + 1] : acc}, 0);
    }
    /**
    *
    */
    getNonXPBonusDef(bonus)
	{
		return Math.round(this.getNonXpBaseDef() * bonus / 10);
	}
    /**
    *
    */
    getNonXpTotalDef(bonus)
    {
        return this.getNonXpBaseDef() + this.getNonXPBonusDef(bonus);
    }
	/**
	* calcul la consommation en nourriture de l'armée.
    *
	* @private
	* @method getConsommation
	* @param {Integer} lieu
	* @return {Integer} Consommation de l'armée.
	*/
	getConsommation(lieu)
	{
        return this._unite.reduce((acc, val, i) => {return acc + (val * COUT_UNITE[i + 1] * 0.05 * lieu)}, 0);
	}
	/**
	* Modifier le nombre de JSN de l'armée.
    *
	* @private
	* @method setJSN
	* @param {Integer} nbr
	* @return
	*/
	setJSN(nbr)
	{
		this._unite[0] = this._nbrJSN - nbr;
	}

	/* ------------------------------------------------------------------ */
	/* ---- Méthode pour chasser ---------------------------------------- */
	/* ------------------------------------------------------------------ */

	/**
	* calcul le nombre de chasse et le terrain par chasse en fonction de la difficulté du terrain de depart et du nombre de chasse restante.
    *
	* @private
	* @method calculChasse
	* @param {Integer} tdcDep
	* @param {Float} diffChasse
	* @param {Integer} fixNB
	* @param {Integer} fixHF
	* @param {Integer} reste
	* @return {Object} Objet avec le nombre de chasse et le terrain par chasse.
	*/
	calculChasse(tdcDep, diffChasse, fixNB, fixHF, reste)
	{
		let iHuntCm2 = fixHF ? fixHF : Math.round(tdcDep * 3 / 10);
		let iHuntNb  = fixNB ? fixNB : 1;
		// Try to set the number of hunt.
		if(!fixNB)
			while(this.calculRatio(tdcDep, iHuntNb + 1, iHuntCm2) >= diffChasse && iHuntNb < reste)
				iHuntNb += 1;
		// If the hunt is too difficult, try to reduce hunted amount.
		if(!fixHF){
			let bBoucle = (iHuntCm2 > 5000000000000);
			for(let j = 5000000000000 ; j > 4 ; j = j / 10){
				bBoucle = (iHuntCm2 > j);
				if(bBoucle)
					bBoucle = (this.calculRatio(tdcDep, iHuntNb, iHuntCm2 - j) < diffChasse && iHuntCm2 > 1);
				while(bBoucle){
					iHuntCm2 -= j;
					bBoucle = iHuntCm2 > j;
					if (bBoucle)
						bBoucle = (this.calculRatio(tdcDep, iHuntNb, iHuntCm2 - j) < diffChasse && iHuntCm2 > 1);
				}
			}
			bBoucle = iHuntCm2 > 1;
			if(bBoucle)
				bBoucle = (this.calculRatio(tdcDep, iHuntNb, iHuntCm2 - 1) < diffChasse && iHuntCm2 > 1);
			while(bBoucle){
				iHuntCm2 -= 1;
				bBoucle = iHuntCm2 > 1;
				if (bBoucle)
					bBoucle = (this.calculRatio(tdcDep, iHuntNb, iHuntCm2 - 1) < diffChasse && iHuntCm2 > 1);
			}
			// if the hunt is easier than specified, try to increase hunt amount.
			for(let j = 5000000000000 ; j > 4 ; j = j / 10)
				while(this.calculRatio(tdcDep, iHuntNb, iHuntCm2 + j) >= diffChasse)
					iHuntCm2 += j;
			while(this.calculRatio(tdcDep, iHuntNb, iHuntCm2 + 1) >= diffChasse)
				iHuntCm2 += 1;
		}
		return {"NB" : iHuntNb, "HF" : iHuntCm2};
	}
	/**
	* calcul le rapport entre la force de frappe et la difficulté
    *
	* @private
	* @method calculRatio
	* @param {Integer} tdcDep
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @return {Float} ratio de la chasse
	*/
	calculRatio(tdcDep, nbChasse, terrainChasse)
	{
		return this.getTotalAtt(monProfil.niveauRecherche[2]) / this.calculDifficulte(tdcDep, nbChasse, terrainChasse);
	}
	/**
	* calcul la référence du ratio donné en paramétre si la chasse est paramétre manuellement.
    *
	* @private
	* @method calculRefRatio
	* @param {Float} ratio
	* @return {Float} indice du ratio
	*/
	calculRefRatio(ratio)
	{
        return RATIO_CHASSE.reduce((prev, curr) => {return (Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev);});
	}
	/**
	* calcul la difficulté de la chasse.
    *
	* @private
	* @method calculDifficulte
	* @param {Integer} tdcDep
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @return {Float} Difficulté de la chasse.
	*/
	calculDifficulte(tdcDep, nbChasse, terrainChasse)
	{
		let dDiff = 0, dStart;
		for(let iIter = 0 ; iIter < nbChasse ; iIter++){
			dStart = tdcDep + terrainChasse * iIter;
			dDiff += ((terrainChasse + dStart * 0.01) * (Math.pow(1.04, (Math.round(Math.log(dStart / 50) / Math.log(Math.pow(10, 0.1)))))) * 3);
		}
		return dDiff;
	}
	/**
	* calcul la difficulté par chasse.
    *
	* @private
	* @method calculDifficultes
	* @param {Integer} tdcDep
	* @param {Integer} nbChasse
	* @param {Integer} terrainChasse
	* @return {Array}
	*/
	calculDifficultes(tdcDep, nbChasse, terrainChasse)
	{
		let dTabDiff = new Array(), dStart;
		for(let iIter = 0 ; iIter < nbChasse ; iIter++){
			dStart = tdcDep + terrainChasse * iIter;
			dTabDiff[iIter] = (terrainChasse + dStart * 0.01) * (Math.pow(1.04, (Math.round(Math.log(dStart / 50) / Math.log(Math.pow(10, 0.1)))))) * 3;
		}
		return dTabDiff;
	}
	/**
	* calcul les pertes minimales, maximales et moyennes en fonction de la difficulté de la chasse.
    *
	* @private
	* @method calculPerte
	* @param {Float} ratioIndex
	* @param {Float} diff
	* @return {Object} les pertes MIN, MAX et AVG
	*/
	calculPerte(ratioIndex, diff)
	{
		return {"MIN" : (PERTE_MIN_CHASSE[ratioIndex]) * diff / (10 + monProfil.niveauRecherche[1]) * 10, "MAX" : (PERTE_MAX_CHASSE[ratioIndex]) * diff / (10 + monProfil.niveauRecherche[1]) * 10, "AVG" :  (PERTE_MOY_CHASSE[ratioIndex]) * diff / (10 + monProfil.niveauRecherche[1]) * 10};
	}
    /**
	* Répartie l'armée sur les chasses souhaitées.
    *
	* @private
	* @method repartirUniteChasse
	* @param {Integer} nbChasse
	* @param {Float} diff
	* @param {Array} tabDiff
	* @param {Float} refMaxLoss
	* @param {Float} securityFactor
	* @return
	*/
	repartirUniteChasse(nbChasse, diff, tabDiff, refMaxLoss, securityFactor)
	{
		this._repartition = new Array();
		// Available units.
		let iTabAvailableUnits = this._unite.slice();

		for(let iHuntNum = nbChasse - 1 ; iHuntNum >= 0 ; iHuntNum--){
			// Initialise unit array for this hunt.
			this._repartition[iHuntNum] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
			// Base attack of units to send for this hunt.
			let iHuntBaseAtt = (tabDiff[iHuntNum] / diff) * this.getBaseAtt();
			// Check for available Xp-able units.
			let bXp = false;
			for(let j = 0 ; j < ORDRE_XP_CHASSE.length ; j++)
				bXp = bXp || ((iTabAvailableUnits[ORDRE_XP_CHASSE[j]]) > 0);
			// compute YD number. If Xp : Max * factor, Else dispatch
			// between lasting hunts according to difficulty.
			if(bXp)
				this._repartition[iHuntNum][0] = Math.round(refMaxLoss * tabDiff[iHuntNum] / (10 + monProfil.niveauRecherche[1]) * 10 * securityFactor);
			else{
				let iDiffLet = tabDiff[iHuntNum];
				for(let iHL = iHuntNum - 1 ; iHL >= 0 ; iHL--)
					iDiffLet += tabDiff[iHL];
				this._repartition[iHuntNum][0] = Math.round(iTabAvailableUnits[0] * tabDiff[iHuntNum] / iDiffLet);
			}
			// Deal with last hunt and check the round do not give more unit
			// than available.
			if(!iHuntNum || this._repartition[iHuntNum][0] > iTabAvailableUnits[0] || this._repartition[iHuntNum][0] < 0)
				this._repartition[iHuntNum][0] = iTabAvailableUnits[0];
			// Decrease lasting YD by the amount allocated to this hunt.
			iTabAvailableUnits[0] -= this._repartition[iHuntNum][0];
			// Decrease also required Att for this hunt
			iHuntBaseAtt -= (this._repartition[iHuntNum][0] * ATT_UNITE[1]);
			// Dispatch other units.
			for(let j = 0 ; j < 13 ; j++){
				// Get unit index in dispatch order.
				let u = ORDRE_UNITE_CHASSE[j];
				if(iTabAvailableUnits[u] > 0 && iHuntBaseAtt > 0){
					if(iTabAvailableUnits[u] * ATT_UNITE[u + 1] > iHuntBaseAtt)
						this._repartition[iHuntNum][u] = Math.round(iHuntBaseAtt / ATT_UNITE[u + 1]);
					else
						this._repartition[iHuntNum][u] = iTabAvailableUnits[u];
					// Deal with last hunt and check the round do not give
					// more unit than available.
					if(!iHuntNum || this._repartition[iHuntNum][u] > iTabAvailableUnits[u] || this._repartition[iHuntNum][u] < 0)
						this._repartition[iHuntNum][u] = iTabAvailableUnits[u];
					// Decrease lasting units
					iTabAvailableUnits[u] -= this._repartition[iHuntNum][u];
					// Decrease also required Att for this hunt
					iHuntBaseAtt -= (this._repartition[iHuntNum][u] * ATT_UNITE[u + 1]);
				}
			}
			// Si il maque de la force de frappe, malgré le placement des unités on utilise des JSN
//			if(iHuntBaseAtt > 0){
//				this._repartition[iHuntNum][0] += Math.round(iHuntBaseAtt / ATT_UNITE[1]);
//                if(!iHuntNum || this._repartition[iHuntNum][0] > iTabAvailableUnits[0] || this._repartition[iHuntNum][0] < 0)
//				    this._repartition[iHuntNum][0] = iTabAvailableUnits[0];
//				iTabAvailableUnits[0] -= this._repartition[iHuntNum][0];
//			}
		}
	}
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
	simulerChasse(tdcDep, nbChasse, terrainChasse, diffChasse, fixNB, fixHF, reste)
	{
		let iTabChasse = this.calculChasse(tdcDep, diffChasse, fixNB, fixHF, reste), dDiff = this.calculDifficulte(tdcDep, iTabChasse["NB"], iTabChasse["HF"]), iTabPerte = this.calculPerte(RATIO_CHASSE.indexOf(parseFloat(diffChasse)), dDiff);
        if($("#o_chasseNbrAuto").is(':checked')){
			$("#o_chasseNbr").spinner("value", iTabChasse["NB"]);
			nbChasse = iTabChasse["NB"];
		}
		if($("#o_chasseTDCRepAuto").is(':checked')){
			$("#o_chasseTDCRep").spinner("value", iTabChasse["HF"]);
			terrainChasse = iTabChasse["HF"];
		}
		let ratio = this.calculRatio(tdcDep, nbChasse, terrainChasse);
		this.repartirUniteChasse(nbChasse, this.calculDifficulte(tdcDep, nbChasse, terrainChasse), this.calculDifficultes(tdcDep, nbChasse, terrainChasse), PERTE_MAX_CHASSE[RATIO_CHASSE.indexOf(this.calculRefRatio(ratio))], 1.0);
		return {repartition : this._repartition, nbChasse : nbChasse, terrainChasse : terrainChasse, ratio : ratio, ratioRef : this.calculRefRatio(ratio).toFixed(1), iTabPerte : iTabPerte};
	}
    /**
	* Envoie une chasse.
    *
	* @private
	* @method envoyerChasse
	* @param {Integer} indice
	* @param {String} securite
	*/
	envoyerChasse(terrainChasse, nbChasse, indice, intervalle, securite)
	{
        if(indice < nbChasse){
            let donnees = {};
            donnees["" + securite.split("=")[0]] = securite.split("=")[1];
            donnees["ChoixArmee"] = "1";
            donnees["AcquerirTerrain"] = terrainChasse;
            donnees["unite1"] = this._repartition[indice][0];
            donnees["unite2"] = this._repartition[indice][1];
            donnees["unite3"] = this._repartition[indice][2];
            donnees["unite4"] = this._repartition[indice][3];
            donnees["unite5"] = this._repartition[indice][4];
            donnees["unite6"] = this._repartition[indice][5];
            donnees["unite7"] = this._repartition[indice][7];
            donnees["unite8"] = this._repartition[indice][8];
            donnees["unite9"] = this._repartition[indice][9];
            donnees["unite10"] = this._repartition[indice][10];
            donnees["unite11"] = this._repartition[indice][12];
            donnees["unite12"] = this._repartition[indice][13];
            donnees["unite13"] = this._repartition[indice][11];
            donnees["unite14"] = this._repartition[indice][6];
            // Requete
            $.post("http://" + Utils.serveur + ".fourmizzz.fr/AcquerirTerrain.php", donnees, (data) => {
                if(data.indexOf("La chasse est lancée.") > -1)
                    $("#o_simulationChasse tr:eq(" + (indice + 1) + ")").html(`<td class='green'>${indice + 1}</td><td colspan='14' class='green'>La chasse est lancée.</td>`);
                else
                    $("#o_simulationChasse tr:eq(" + (indice + 1) + ")").html(`<td class='red'>${indice + 1}</td><td colspan='14' class='red'>La chasse n'a pas pu être lancée.</td>`);
                setTimeout(() => {this.envoyerChasse(terrainChasse, nbChasse, ++indice, intervalle, securite);}, intervalle);
            });
        }else // on a fini, on recharge la page
            location.reload();
	}

	/* ------------------------------------------------------------------ */
	/* ---- Méthode pour Flooder ---------------------------------------- */
	/* ------------------------------------------------------------------ */

    /**
    *
    */
    placeAntisonde(donneesFlood)
    {
        if(donneesFlood.attaques[0]){
			let priseMax = Math.floor(donneesFlood.tdcCible * 0.2);
            priseMax = donneesFlood.attaques[0] > priseMax ? priseMax : donneesFlood.attaques[0];
            donneesFlood.tdcAtt += priseMax;
            donneesFlood.tdcCible -= priseMax;
            donneesFlood.unite -= donneesFlood.attaques[0];
            donneesFlood.reste--;
		}
        // on place l'antisonde quand même pour garder l'ordre
        this._floods.push(donneesFlood.attaques[0]);
    }
    /**
    *
    */
    standardFlood(donneesFlood)
    {
        let prise = 0, priseMax = 0;
        for(let i = 1 ; i < donneesFlood.attaques.length ; i++){
            prise = donneesFlood.unite >= donneesFlood.attaques[i] ? donneesFlood.attaques[i] : donneesFlood.unite;
            priseMax = Math.floor(donneesFlood.tdcCible * 0.2);
            priseMax = prise > priseMax ? priseMax : prise;
            this._floods.push(prise);
            donneesFlood.tdcAtt += priseMax;
            donneesFlood.tdcCible -= priseMax;
            donneesFlood.unite -= prise;
            donneesFlood.reste--;
            if(donneesFlood.unite <= 0 || donneesFlood.reste == 0) break;
        }
    }
    /**
	* Optimisation de la prise de terrain sur une cible en fonction du nombre d'unité et du nombre d'attaque.
    *
	* @private
	* @method optimiserFlood
	* @param {Integer} tdcAtt
	* @param {Integer} tdcCible
	* @param {Integer} unite
	* @param {Integer} reste
	*/
	optimiserFlood(donneesFlood)
	{
		let prise = 0;
		// -20% -20% -20%
		while(donneesFlood.tdcAtt < Math.floor(donneesFlood.tdcCible * 1.4) && donneesFlood.reste > 0){
			prise = Math.floor(donneesFlood.tdcCible * 0.2);
            prise = donneesFlood.unite >= prise ? prise : donneesFlood.unite;
            this._floods.push(prise);
            donneesFlood.tdcAtt += prise;
            donneesFlood.tdcCible -= prise;
            donneesFlood.unite -= prise;
            donneesFlood.reste--;
            if(donneesFlood.unite <= 0) return;
		}
		if(donneesFlood.reste > 1){ // limite
			let limite = Math.floor((donneesFlood.tdcCible * 2 - donneesFlood.tdcAtt) / 3) - 1;
            limite = limite && donneesFlood.unite >= limite ? limite : donneesFlood.unite;
            this._floods.push(limite);
            donneesFlood.tdcAtt += limite;
            donneesFlood.tdcCible -= limite;
            donneesFlood.unite -= limite;
            donneesFlood.reste--;
			if(donneesFlood.unite <= 0) return;
        }
        if(donneesFlood.reste > 0){ // dernier
			prise = Math.floor(donneesFlood.tdcCible * 0.2);
            prise = donneesFlood.unite >= prise ? prise : donneesFlood.unite;
            this._floods.push(prise);
            donneesFlood.tdcAtt += prise;
            donneesFlood.tdcCible -= prise;
            donneesFlood.unite -= prise;
            donneesFlood.reste--;
		}
	}
    /**
    *
    */
    degressifFlood(donneesFlood)
    {
        let prise = 0, nbFlood = donneesFlood.reste;
        for(let i = 0 ; i < nbFlood ; i++){
            prise = Math.floor(donneesFlood.tdcCible * 0.2);
            prise = donneesFlood.unite >= prise ? prise : donneesFlood.unite;
            this._floods.push(prise);
            donneesFlood.tdcAtt += prise;
            donneesFlood.tdcCible -= prise;
            donneesFlood.unite -= prise;
            donneesFlood.reste--;
            if(donneesFlood.unite <= 0) break;
        }
    }
    /**
    *
    */
    uniformeFlood(donneesFlood)
    {
        let prise = 0, priseMax = 0, nbFlood = donneesFlood.reste;
        for(let i = 0 ; i < nbFlood ; i++){
            prise = donneesFlood.unite >= donneesFlood.tdcUniforme ? donneesFlood.tdcUniforme : donneesFlood.unite;
            priseMax = Math.floor(donneesFlood.tdcCible * 0.2);
            priseMax = prise > priseMax ? priseMax : prise;
            this._floods.push(prise);
            donneesFlood.tdcAtt += priseMax;
            donneesFlood.tdcCible -= priseMax;
            donneesFlood.unite -= prise;
            donneesFlood.reste--;
            if(donneesFlood.unite <= 0) break;
        }
    }
	/**
	* Répartie l'armée sur les floods souhaitées.
    *
	* @private
	* @method repartirUniteFlood
	*/
	repartirUniteFlood()
	{
		this._repartition = new Array();
		// Available units.
		let iTabAvailableUnits = this._unite.slice(), floods = this._floods.slice();
        floods.forEach((f, i, tabFloods) => {
            this._repartition[i] = new Array(14).fill(0);
            iTabAvailableUnits.forEach((unite, j, tabUnite) => {
                if(unite){
					this._repartition[i][j] = tabUnite[j] >= tabFloods[i] ? tabFloods[i] : tabUnite[j];
					tabFloods[i] -= this._repartition[i][j];
                    tabUnite[j] -= this._repartition[i][j];
					if(!tabFloods[i]) return false;
				}
            });
        });
	}
    /**
	* Simule le placement des unités pour une methode de flood choisie.
    *
	* @private
	* @method calculeFlood
	*/
	simulerFlood(tdcAtt, tdcCible, methode, attaques, tdcUniforme, reste, indSupp){
		this._floods = new Array();
        // on a besoin d'un objet pour le passer au différentes fonctions
        let data = {"attaques" : attaques, "tdcUniforme" : tdcUniforme, "tdcAtt" : tdcAtt, "tdcCible" : tdcCible, "unite" : this.getSommeUnite(), "reste" : reste}
		// Placement de l'antisonde
        this.placeAntisonde(data);
        if(data.unite <= 0) return this._floods;
		// Placement selon la méthode
        switch(methode){
            case "0" : // defini manuellement
                this.standardFlood(data);
                break;
            case "1" : // Opti
                this.optimiserFlood(data);
                break;
            case "2" : // uniforme
                this.uniformeFlood(data);
                break;
            case "3" : // Degressive
                this.degressifFlood(data);
                break;
            default :
                break;
        }
        // Placement de toute les unités si il en reste
        if(indSupp != -1 && data.unite > 0) this._floods[indSupp] += data.unite;
        // des qu'on simule on prepare la repartition des unités pour le lancement
        this.repartirUniteFlood();
		return this._floods;
	}
    /**
	* Envoie un flood.
    *
	* @private
	* @method envoyerFlood
	* @param {Integer} indice
	* @param {String} securite
	*/
	envoyerFlood(idCible, indice, securite)
	{
        // si on a encore des attaques à lancer
        if(indice < this._floods.length){
            // si l'attaque est différente de 0
            if(this._floods[indice]){
                let donnees = {};
                donnees["" + securite.split("=")[0]] = securite.split("=")[1];
                donnees["ChoixArmee"] = "1";
                donnees["lieu"] = "1"; //$("input[name=o_domeFlood]:checked").val() == "Oui" ? "2" : "1";
                donnees["pseudoCible"] = $("input[name=pseudoCible]").val();
                donnees["unite1"] = this._repartition[indice][0];
                donnees["unite2"] = this._repartition[indice][1];
                donnees["unite3"] = this._repartition[indice][2];
                donnees["unite4"] = this._repartition[indice][3];
                donnees["unite5"] = this._repartition[indice][4];
                donnees["unite6"] = this._repartition[indice][5];
                donnees["unite7"] = this._repartition[indice][7];
                donnees["unite8"] = this._repartition[indice][8];
                donnees["unite9"] = this._repartition[indice][9];
                donnees["unite10"] = this._repartition[indice][10];
                donnees["unite11"] = this._repartition[indice][12];
                donnees["unite12"] = this._repartition[indice][13];
                donnees["unite13"] = this._repartition[indice][11];
                donnees["unite14"] = this._repartition[indice][6];
                // Requete
                $.post("http://" + Utils.serveur + ".fourmizzz.fr/ennemie.php?Attaquer=" + idCible, donnees, (data) => {
                    let res = $("<div/>").append(data).find("center:last").text();
                    $("#o_simulationFlood tr:eq(" + (indice + 2) + ")").addClass(res.indexOf("Vos troupes sont en marche") == -1 ? "red" : "green");
                    setTimeout(() => {this.envoyerFlood(idCible, ++indice, securite);}, 1000);
                });
            }else // on passe à l'attaque suivante
                this.envoyerFlood(idCible, ++indice, securite);
        }else // on a fini, on recharge la page
            location.reload();
	}

    /* ------------------------------------------------------------------ */
	/* ---- Méthode pour les combats ------------------------------------ */
	/* ------------------------------------------------------------------ */

    /**
    *
    */
    retirerPerte(nbUnite)
    {
        // Tant que le total n'est pas 0 on retire les unites
        this._unite.every((elt, ind) => {
            if(elt >= nbUnite){
				this._unite[ind] -= nbUnite;
				return false;
			}else{
				nbUnite -= elt;
				this._unite[ind] = 0;
                return true;
			}
        });
		return this;
    }
}
