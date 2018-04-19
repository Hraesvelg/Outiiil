/*
 * RapportChasse.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour l'analyse d'un rapport de chasse, herite des fonctions de la classe Rapport.
*
* @class Chasse
* @constructor
* @extends Rapport
*/
class Chasse
{
	constructor(rc)
    {
        /**
        *
        */
        this._rc = rc;
        /**
        *
        */
		this._armeeAv = new Armee();
        /**
        *
        */
		this._armeePe = new Armee();
        /**
        *
        */
		this._armeeAp = new Armee();
	}
    /**
    *
    */
    get armeeAv()
    {
        return this._armeeAv;
    }
    /**
    *
    */
    get armeePe()
    {
        return this._armeePe;
    }
    /**
    *
    */
    get armeeAp()
    {
        return this._armeeAp;
    }
    /**
	* Calcule le niveau d'armes en fonction des degats.
    *
	* @private
	* @method getArmes
	* @param {Integer} fdf de base
	* @param {Integer} fdf avec bonus
	* @return {Integer} le niveau d'armes
	*/
	calculArmes(base, bonus)
	{
		return Math.round(bonus / base * 10);
	}
    /**
	* Calcule le niveau du bouclier.
    *
	* @private
	* @method getBouclier
	* @param {Integer} degat
	* @param {Object} armee1
	* @param {Object} armee2
	* @return {Integer} le niveau de bouclier
	*/
	calculBouclier(degat, armee1, armee2)
	{
		let viePerdue = armee1.getBaseVie() - armee2.getBaseVie();
		return Math.round(((degat - viePerdue) / viePerdue) * 10);
	}
	/**
	* Retourne l'armée en retirant d'aprés le rapport les unités perdues suivant le texte.
    *
	* @private
	* @method retirePerte
	* @param {Object} armee
	* @return {Object} armee perdue
	*/
	retirePerte(armee)
	{
		let res = new Armee(), tmp = this._rc.split("et en tue"), total = 0;
		res.unite = armee.unite.slice(0);
		// Si le rc à plusieurs tours on additionne d'abords les pertes.
		for(let i = 1 ; i < tmp.length ; total += parseInt(tmp[i++].split('.')[0].replace(/ /g, '')));
		// Tant que le total n'est pas 0 on retire les unités
		for(let i = 0 ; i < 14 ; i++){
			if(res.unite[i] >= total){
				res.unite[i] -= total;
				break;
			}else{
				total -= res.unite[i];
				res.unite[i] = 0;
			}
		}
		return res;
	}
	/**
	* Retourne l'armée en ajoutant l'xp.
    *
	* @private
	* @method ajouteXP
	* @param {Object} armee
	* @return {Object} armee avec XP
	*/
	ajouteXP(armee)
	{
		let res = new Armee(), tmp = this._rc.split("- "), tableXP = [-1, 1, 2, -1, 4, 9, 6, -1, 8, -1, -1, 11, -1, 13, -1];
		res.unite = armee.unite.slice(0);
		// Pour chaques types d'unitées qui ont XP.
		for(let i = 1, l = tmp.length ; i < l ; i++){
			let uniteXP = NOM_UNITE.indexOf(tmp[i].replace(/[0-9]/g, '').split("sont")[0].replace(/s /g, ' ').trim()), qteXP = parseInt(tmp[i].replace(/ /g, ''));
			res.unite[uniteXP - 1] -= qteXP;
			res.unite[tableXP[uniteXP]] += qteXP;
		}
		return res;
	}
	/**
	* Récupére l'armée, les pertes et l'xp d'un rapport de chasse.
    *
	* @private
	* @method analyse
	*/
	analyse()
	{
        let motCle = new Array("Troupes en attaque : ", "et en tue");
        if(motCle.some((substring) => {return this._rc.includes(substring);})){
            this._armeeAv.parseArmee(this._rc.split("Troupes en attaque : ")[1].split(".")[0]);
            this._armeePe = this.retirePerte(this._armeeAv);
            this._armeeAp = this.ajouteXP(this._armeePe);
            return true;
        }
        return false;
	}
	/**
	* Ajoute les données des chasses pour faire un bilan.
    *
	* @private
	* @method ajoute
	* @param {Object} chasse
	*/
	ajoute(chasse)
	{
		for(let i = 0 ; i < 14 ; i++){
            this._armeeAv.unite[i] += chasse.armeeAv.unite[i];
            this._armeePe.unite[i] += chasse.armeePe.unite[i];
            this._armeeAp.unite[i] += chasse.armeeAp.unite[i];
        }
        return this;
	}
    /**
    *
    */
    toHTMLMessagerie()
    {
        let tdp = monProfil.getTDP(),
            sommeUnite = this._armeePe.getSommeUnite() - this._armeeAv.getSommeUnite(),
            baseAtt = this._armeeAp.getBaseAtt() - this._armeeAv.getBaseAtt(),
            baseDef = this._armeeAp.getBaseDef() - this._armeeAv.getBaseDef(),
            baseVie = this._armeeAp.getBaseVie() - this._armeeAv.getBaseVie(),
            bonusAtt = this._armeeAp.getTotalAtt(monProfil.niveauRecherche[2]) - this._armeeAv.getTotalAtt(monProfil.niveauRecherche[2]),
            bonusDef = this._armeeAp.getTotalDef(monProfil.niveauRecherche[2]) - this._armeeAv.getTotalDef(monProfil.niveauRecherche[2]),
            bonusVie = this._armeeAp.getTotalVie(monProfil.niveauRecherche[1]) - this._armeeAv.getTotalVie(monProfil.niveauRecherche[1]),
            pAtt = (baseAtt * 100/ this._armeeAv.getBaseAtt()).toFixed(2),
            pDef = (baseDef * 100/ this._armeeAv.getBaseDef()).toFixed(2),
            pVie = (baseVie * 100/ this._armeeAv.getBaseVie()).toFixed(2);
		return `<p class='retour'>Perte HOF : ${Utils.intToTime(this._armeeAv.getTemps(0) - this._armeePe.getTemps(0))} - Perte (TDP ${tdp}) : ${Utils.intToTime(this._armeeAv.getTemps(tdp) - this._armeePe.getTemps(tdp))}</p>
            <table class='o_tabAnalyse right' cellspacing='0'>
			<tr><td><img width='35' src='images/icone/icone_ouvriere.png' alt='nb_unite'/></td><td colspan='2' style='padding-left:10px'>${numeral(sommeUnite).format()}</td><td style='padding-left:10px'>${(sommeUnite * 100 / this._armeeAv.getSommeUnite()).toFixed(2)}%</td></tr>
			<tr><td>${IMG_VIE}</td><td class='right'>${(baseVie > 0 ? "+" : "") + numeral(baseVie).format()}(HB)</td><td class='right'>${(bonusVie > 0 ? "+" : "") + numeral(bonusVie).format()}(AB)</td><td style='padding-left:10px'>${(pVie > 0 ? "+" : "") + pVie}%</td></tr>
			<tr><td>${IMG_ATT}</td><td style='padding-left:10px' class='right'>${(baseAtt > 0 ? "+" : "") + numeral(baseAtt).format()}(HB)</td><td style='padding-left:10px' class='right'>${(bonusAtt > 0 ? "+" : "") + numeral(bonusAtt).format()}(AB)</td><td style='padding-left:10px'>${(pAtt > 0 ? "+" : "") + pAtt}%</td></tr>
			<tr><td>${IMG_DEF}</td><td class='right'>${(baseDef > 0 ? "+" : "") +  numeral(baseDef).format()}(HB)</td><td class='right'>${(bonusDef > 0 ? "+" : "") + numeral(bonusDef).format()}(AB)</td></td><td style='padding-left:10px'>${(pDef > 0 ? "+" : "") + pDef}%</td></tr>
			</table>`;
    }
    /**
    *
    */
    toHTMLBoite(bVisible)
    {
		let diffNbr = this._armeeAp.getSommeUnite() - this._armeeAv.getSommeUnite(), diffVie = this._armeeAp.getBaseVie() - this._armeeAv.getBaseVie(), diffAtt = this._armeeAp.getBaseAtt() - this._armeeAv.getBaseAtt(), diffDef = this._armeeAp.getBaseDef() - this._armeeAv.getBaseDef();
		let html = `<tr ${bVisible ? "" : "style='display:none'"}><td><img height='20' src='images/icone/fourmi.png'/></td><td>${numeral(this._armeeAv.getSommeUnite()).format()}</td><td><img height='20' src='images/icone/fourmi.png'/></td><td>${numeral(diffNbr).format("+0,0")} (${numeral(diffNbr / this._armeeAv.getSommeUnite()).format("+0.00%")})</td><td><img height='20' src='images/icone/fourmi.png'/></td><td>${numeral(this._armeeAp.getSommeUnite()).format()}</td></tr>
            <tr ${bVisible ? "" : "style='display:none'"}><td>${IMG_VIE}</td><td>${numeral(this._armeeAv.getBaseVie()).format()}</td><td>${IMG_VIE}</td><td>${numeral(diffVie).format("+0,0")} (${numeral(diffVie / this._armeeAv.getBaseVie()).format("+0.00%")})</td><td>${IMG_VIE}</td><td>${numeral(this._armeeAp.getBaseVie()).format()}</td></tr>
			<tr ${bVisible ? "" : "style='display:none'"}><td>${IMG_ATT}</td><td>${numeral(this._armeeAv.getBaseAtt()).format()}</td><td>${IMG_ATT}</td><td>${numeral(diffAtt).format("+0,0")} (${numeral(diffAtt / this._armeeAv.getBaseAtt()).format("+0.00%")})</td><td>${IMG_ATT}</td><td>${numeral(this._armeeAp.getBaseAtt()).format()}</td></tr>
			<tr ${bVisible ? "" : "style='display:none'"}><td>${IMG_DEF}</td><td>${numeral(this._armeeAv.getBaseDef()).format()}</td><td>${IMG_DEF}</td><td>${numeral(diffDef).format("+0,0")} (${numeral(diffDef / this._armeeAv.getBaseDef()).format("+0.00%")})</td><td>${IMG_DEF}</td><td>${numeral(this._armeeAp.getBaseDef()).format()}</td></tr>`;
        return html;
    }
}
