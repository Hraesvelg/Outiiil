/*
 * RapportCombat.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour l'analyse d'un rapport de combat, herite des fonctions de la classe Rapport.
*
* @class Combat
* @constructor
* @extends Rapport
*/
class Combat
{
    constructor(id, dateHeureRC, RC)
    {
        /**
        *
        */
        this._id = id;
        /**
        *
        */
        this._dateHeure = dateHeureRC;
        /**
        *
        */
        this._rc = RC;
        /**
        *
        */
        this._lieu = RC.includes("Loge") ? "loge" : (RC.includes("fourmilière") ? "dôme" : "terrain");
        /**
        *
        */
        this._vous = new Joueur({pseudo : "Vous"});
        /*
        *
        */
        this._vousBonusLieu = "";
        /**
        *
        */
		this._armeeAv = new Armee();
        /**
        *
        */
		this._armeePe = null;
        /**
        *
        */
		this._armeeAp = null;
        /**
        *
        */
        this._ennemie = new Joueur({pseudo : "Ennemie"});
        /*
        *
        */
        this._ennemieBonusLieu = "";
        /**
        *
        */
        this._ennemieTDP = new Array();
        /**
        *
        */
        this._armeeEnnemieAv = new Armee();
        /**
        *
        */
		this._armeeEnnemieAp = null;
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
		return viePerdue ? Math.round(((degat - viePerdue) / viePerdue) * 10) : -1;
	}
    /**
	* Calcule le bonus vie selon le lieu.
    *
	* @private
	* @method getBouclierLieu
	* @param {Integer} degat
	* @param {Object} armee1
	* @param {Object} armee2
	* @param {Integer} armes
	* @return {String} les solutions possibles.
	*/
	calculBouclierLieu(degat, armee1, armee2, armes)
	{
        let viePerdue = armee1.getBaseVie() - armee2.getBaseVie(), solution = "", lieu = -1;
        switch(this._lieu){
            case "dôme" :
                for(let bouclier = armes - 3 ; bouclier <= armes + 2 ; bouclier++){
                    lieu = (((degat - viePerdue) / viePerdue) * 20 - 2) - (2 * bouclier);
                    if(lieu <= 45 && lieu >= 0)
                        solution += bouclier + '/' + Math.round(lieu) + " - ";
                }
                break;
            case "loge" :
                for(let bouclier = armes - 3 ; bouclier <= armes + 2 ; bouclier++){
                    lieu = (((degat - viePerdue) / viePerdue) * 20 / 3 - 2) - (2 * bouclier / 3);
                    if(Math.abs(lieu - Math.round(lieu)) < 0.2 && lieu <= 45 && lieu >= 0)
                        solution += bouclier + '/' + Math.round(lieu) + " - ";
                }
                break;
            default :
                break;
        }
		return solution.slice(0, -3);
	}
    /**
    *
    */
    calculTDP(armee)
    {
        let tmpTDP = new Array();
        for(let i = 0 ; i < 140 ; i++){
            let tempsPonte = armee.getTemps(i) % 60;
            // si le nombre est trés proche de 60 ou de 0
            if(Math.abs(tempsPonte - 60) < 0.01 || tempsPonte < 0.01)
                tmpTDP.push(i);
        }
        return tmpTDP;
    }
	/**
	* Retourne l'armée en retirant d'aprés le rapport les unités perdues suivant le texte.
    *
	* @private
	* @method retirePerte
	* @param {Object} armee
	* @param {String} separateur
	* @return {Object} armee perdue
	*/
	retirePerte(armee, separateur, nbTour = 100000)
	{
		let res = new Armee(), tmp = this._rc.split(separateur), total = 0;
		res.unite = armee.unite.slice(0);
		// Si le rc à plusieurs tours on additionne d'abords les pertes.
		for(let i = 1 ; i < Math.min(tmp.length, nbTour) ; total += parseInt(tmp[i++].split('.')[0].replace(/ /g, '')));
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
	* Analyse un rapport sous forme de string.
    *
	* @private
	* @method analyse
	*/
	analyse()
	{
        let motCle = new Array("Troupes en défense : ", "Troupes en attaque : ", "Vous infligez", "ennemie inflige", "et en tue", "et tuez", "dégâts");
        if(motCle.some((substring) => {return this._rc.includes(substring);})){
            let tmpPseudo = new Array();
            // Récuperation des armées si on nous attaque on est en défense
            if(this._rc.includes("attaque votre")){
                this._armeeAv.parseArmee(this._rc.split("Troupes en défense : ")[1].split(".")[0]);
                this._armeeEnnemieAv.parseArmee(this._rc.split("Troupes en attaque : ")[1].split(".")[0]);
                tmpPseudo = this._rc.split(" attaque")[0].split(" ");
                this._ennemie.pseudo = tmpPseudo.length > 1 ? tmpPseudo[tmpPseudo.length - 1] : tmpPseudo[0];
            }else{ // sinon en attaque
                this._armeeAv.parseArmee(this._rc.split("Troupes en attaque : ")[1].split(".")[0]);
                this._armeeEnnemieAv.parseArmee(this._rc.split("Troupes en défense : ")[1].split(".")[0]);
                tmpPseudo = this._rc.split("e de ");
                if(tmpPseudo.length > 1){ // en rebellion pas de pseudo
                    this._ennemie.pseudo = tmpPseudo[1].split("\nTroupes")[0];
                    // en attaque classique on peut essayer de calculer le tdp
                    this._ennemieTDP = this.calculTDP(this._armeeEnnemieAv);
                }
            }
            // On calcule l'armée du joueur 1 en sortie
            this._armeePe = this.retirePerte(this._armeeAv, "et en tue");
            this._armeeAp = this.ajouteXP(this._armeePe);
            // On calcule l'armée du joueur 2 en sortie
            this._armeeEnnemieAp = this.retirePerte(this._armeeEnnemieAv, "et tuez");
            // Calcule du niveau d'arme du "Vous"
            let tmp1 = this._rc.split("Vous infligez")[1].split("dégâts")[0], base1 = parseInt(tmp1.split("(")[0].replace(/ /g, "")), bonus1 = parseInt(tmp1.split("+")[1].split(")")[0].replace(/ /g, ""));
            this._vous.niveauRecherche[2] = this.calculArmes(base1, bonus1);
            // Calcule du niveau d'arme de "l'ennemie"
            let tmp2 = this._rc.split("ennemie inflige")[1].split("dégâts")[0], base2 = parseInt(tmp2.split("(")[0].replace(/ /g, "")), bonus2 = parseInt(tmp2.split("+")[1].split(")")[0].replace(/ /g, ""));
            this._ennemie.niveauRecherche[2] = this.calculArmes(base2, bonus2);
            // On peut calculer le bouclier du joueur 2 ("ennemie") si on n'est pas en OS ou qu'on à perdu
            if(this._rc.split("et tuez").length > 2 || this._rc.indexOf("Vous avez gagné") == -1){
                // Si on est en terrain ou en defense pas de bonus de lieu
                if(this._rc.includes("attaque votre") || this._lieu == "terrain")
                    this._ennemie.niveauRecherche[1] = this.calculBouclier(base1 + bonus1, this._armeeEnnemieAv, this.retirePerte(this._armeeEnnemieAv, "et tuez", 2));
                else
                    this._ennemieBonusLieu = this.calculBouclierLieu(base1 + bonus1, this._armeeEnnemieAv, this.retirePerte(this._armeeEnnemieAv, "et tuez", 2), this._ennemie.niveauRecherche[2]);
            }
            // On peut calculer le bouclier du joueur 1 ("vous") si on n'est pas en OS ou qu'on à gagner
            if(this._rc.split("et en tue").length > 2 || this._rc.includes("Vous avez gagné")){
                // Si on est en terrain ou en attaque
                if(!this._rc.includes("attaque votre") || this._lieu == "terrain")
                    this._vous.niveauRecherche[1] = this.calculBouclier(base2 + bonus2, this._armeeAv, this.retirePerte(this._armeeAv, "et en tue", 2));
                else
                    this._vousBonusLieu = this.calculBouclierLieu(base2 + bonus2, this._armeeAv, this.retirePerte(this._armeeAv, "et en tue", 2), this._vous.niveauRecherche[2]);
            }
            return true;
        }
        return false;
	}
    /**
    *
    */
    toHTMLMessagerie()
    {
        let html = `<p class='small'>HoF : <span id="temps_hof_total_${this._id}">${Utils.intToTime((this._armeeAv.getTemps(0) - this._armeePe.getTemps(0)) + (this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0)))}</span><br/>Ennemie : <span id="temps_hof_ennemie_${this._id}">${Utils.intToTime(this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0))}</span> - Vous : <span id="temps_hof_vous_${this._id}">${Utils.intToTime(this._armeeAv.getTemps(0) - this._armeePe.getTemps(0))}</span></p>
            <span style='text-decoration:underline;' class='gras'>Niveau(x)</span><br/>
            <p id="bonus_ennemie_${this._id}">${this._ennemieBonusLieu ? "Bouclier (/ " + this._lieu + ") : " + this._ennemieBonusLieu + " | " : (this._ennemie.niveauRecherche[1] != -1 ? "Bouclier : " + this._ennemie.niveauRecherche[1] + " | " : "")}Armes : ${this._ennemie.niveauRecherche[2]}`;
		if(this._armeeAv.getSommeUnite() < 1000 || this._armeeEnnemieAv.getSommeUnite() < 1000)
			html += ` <img src='images/attention.gif' alt='attention' title='les unitées sont peut être insuffisantes pour être sur' class='o_vAlign'/> `;
		html += `</p>`;
        // Affichage des TDP possibles
        if(this._ennemieTDP.length){
            html += `<table class='o_tabTDP centre' cellspacing="0"><tr class="gras"><td>TDP</td><td>Temps ponte</td><td>Heure de départ</td></tr>`;
            for(let i = 0 ; i < this._ennemieTDP.length ; i++){
                let tempsPonte = Math.round(this._armeeEnnemieAv.getTemps(this._ennemieTDP[i]));
                html += `<tr><td>${this._ennemieTDP[i]}</td><td class="right">${Utils.intToTime(tempsPonte)}</td><td>${moment(this._dateHeure, "D[/]M[/]YY[ à ]HH[h]mm").subtract(tempsPonte, 's').format("D MMM YYYY à HH[h]mm")}</td></tr>`;
            }
            html += `</table><br/>`;
        }
		// Affichage des infos sur l'armée restante de l'ennemie
		if(this._armeeEnnemieAp.getSommeUnite()){
			html += `<span style='text-decoration:underline;' class='gras'>Armee (après combat, sans XP)</span><br/><table class='o_tabAnalyse' cellspacing='0'>
				<tr><td><img width='35' src='images/icone/icone_ouvriere.png' alt='nb_unite' class='o_vAlign'/></td><td class='right'>${numeral(this._armeeEnnemieAp.getSommeUnite()).format()}</td>
				<td class='right' style='width:30px;'><img height='18' width='18' src='images/icone/icone_coeur.gif' class='o_vAlign'/></td><td class='right'>${numeral(this._armeeEnnemieAp.getBaseVie()).format()} (HB)</td>`;
            if(this._ennemie.niveauRecherche[1] != -1)
				html += `<td class='right'>${numeral(this._armeeEnnemieAp.getTotalVie(this._ennemie.niveauRecherche[1], 0, 0)).format()} (AB)<img src='images/attention.gif' alt='attention' title='Vie sans le bonus lieu !' class='o_vAlign'/></td></tr>`;
			else if(this._ennemieBonusLieu != "")
				html += `<td class='right'>${numeral(this._armeeEnnemieAp.getTotalVie(parseInt(this._ennemieBonusLieu.split(" - ")[0].split("/")[0]), this._lieu == "dôme" ? 2 : 3, parseInt(this._ennemieBonusLieu.split(" - ")[0].split("/")[1]))).format()} (AB) <img src='images/attention.gif' alt='attention' title='vie en ${this._lieu}' class='o_vAlign'/></td></tr>`;
			else
				html += `<td></td></tr>`;
			html += `<tr><td><img width='18' height='18' src='images/icone/horloge.png' class='o_vAlign'/></td><td class='right'>${Utils.intToTime(this._armeeEnnemieAp.getTemps(0))}</td>
                <td class='right' style='width:30px;'><img height='18' width='18' src='images/icone/icone_degat_attaque.gif' class='o_vAlign'/></td><td class='right'>${numeral(this._armeeEnnemieAp.getBaseAtt()).format()} (HB)</td><td class='right'>${numeral(this._armeeEnnemieAp.getTotalAtt(this._ennemie.niveauRecherche[2])).format()} (AB)</td></tr>
				<tr><td>Perte JSN 10%</td><td class='right'>${numeral(Math.round(this._armeeEnnemieAp.getTotalDef(this._ennemie.niveauRecherche[2]) / 10 / (8 + 8 * monProfil.niveauRecherche[1] / 10))).format()} <img src='images/attention.gif' alt='attention' title='Avec votre bonus Bouclier de : ${monProfil.niveauRecherche[1]}' class='o_vAlign'/></td>
				<td class='right' style='width:30px;'><img height='18' width='18' src='images/icone/icone_degat_defense.gif' class='o_vAlign'/></td><td class='right'>${numeral(this._armeeEnnemieAp.getBaseDef()).format()} (HB)</td><td class='right'>${numeral(this._armeeEnnemieAp.getTotalDef(this._ennemie.niveauRecherche[2])).format()} (AB)</td></tr>
				</table><br/>`;
		}
		// Affichage des infos sur "votre" armée avec l'XP
		if(this._armeePe.getSommeUnite()){
			let nbUnite = this._armeeAp.getSommeUnite() - this._armeeAv.getSommeUnite(),
                attHB = this._armeeAp.getBaseAtt() - this._armeeAv.getBaseAtt(),
                defHB = this._armeeAp.getBaseDef() - this._armeeAv.getBaseDef(),
                vieHB = this._armeeAp.getBaseVie() - this._armeeAv.getBaseVie();
			html += `<span style='text-decoration:underline;' class='gras'>Bilan après combat</span><br/><table class='o_tabAnalyse right' cellspacing='0'>
				<tr><td><img width='35' src='images/icone/icone_ouvriere.png' alt='nb_unite' class='o_vAlign'/></td><td colspan='2' style='padding-left:10px'>${numeral(nbUnite).format()}</td><td style='padding-left:10px'>${(nbUnite * 100 / this._armeeAv.getSommeUnite()).toFixed(2)}%</td></tr>
				<tr><td><img height='18' width='18' src='images/icone/icone_coeur.gif' class='o_vAlign'/></td><td class='right'>${(vieHB > 0 ? '+' : '') + numeral(vieHB).format()}(HB)</td><td class='right'>${(vieHB > 0 ? '+' : '') + numeral(this._armeeAp.getTotalVie(monProfil.niveauRecherche[1], 0, 0) - this._armeeAv.getTotalVie(monProfil.niveauRecherche[1], 0, 0)).format()}(AB)</td><td style='padding-left:10px'>${(vieHB > 0 ? '+' : '') + (vieHB * 100 / this._armeeAv.getBaseVie()).toFixed(2)}%</td></tr>
				<tr><td><img height='18' width='18' src='images/icone/icone_degat_attaque.gif' class='o_vAlign'/></td><td style='padding-left:10px' class='right'>${(attHB > 0 ? '+' : '') + numeral(attHB).format()}(HB)</td><td style='padding-left:10px' class='right'>${(attHB > 0 ? '+' : '') + numeral(this._armeeAp.getTotalAtt(monProfil.niveauRecherche[2]) - this._armeeAv.getTotalAtt(monProfil.niveauRecherche[2])).format()}(AB)</td><td style='padding-left:10px'>${(attHB > 0 ? '+' : '') + (attHB * 100 / this._armeeAv.getBaseAtt()).toFixed(2)}%</td></tr>
				<tr><td><img height='18' width='18' src='images/icone/icone_degat_defense.gif' class='o_vAlign'/></td><td class='right'>${(defHB > 0 ? '+' : '') + numeral(defHB).format()}(HB)</td><td class='right'>${(defHB > 0 ? '+' : '') + numeral(this._armeeAp.getTotalDef(monProfil.niveauRecherche[2]) - this._armeeAv.getTotalDef(monProfil.niveauRecherche[2])).format()}(AB)</td></td><td style='padding-left:10px'>${(defHB > 0 ? '+' : '') + (defHB * 100 / this._armeeAv.getBaseDef()).toFixed(2)}%</td></tr>
				</table><br/>`;
		}
		html += "</div>";
        return html;
    }
    /**
    *
    */
    toHTMLBoite()
    {
        let html = `<tr class='gras'><td></td><td style='width:38%'>${this._vous.pseudo}</td><td style='width:38%'>${this._ennemie.getLienFourmizzz()}</td></tr>
			<tr><td>Bouclier (/ ${this._lieu})</td><td>${(this._vousBonusLieu ? this._vousBonusLieu : (this._vous.niveauRecherche[1] != -1 ? this._vous.niveauRecherche[1] : "N/A"))}</td><td>${(this._ennemieBonusLieu ? this._ennemieBonusLieu : (this._ennemie.niveauRecherche[1] != -1 ? this._ennemie.niveauRecherche[1] : "N/A"))}</td></tr>
			<tr><td>Armes</td><td>${this._vous.niveauRecherche[2]}</td><td>${this._ennemie.niveauRecherche[2]}</td></tr>
			<tr><td></td><td colspan='2' class='gras'>Bilan unités</td></tr>`;
		for(let i = 0 ; i < 14 ; i++){
			if(this._armeeAv.unite[i] || this._armeeEnnemieAv.unite[i] || this._armeeAp.unite[i]){
				let diff1 = this._armeeAp.unite[i] - this._armeeAv.unite[i];
				html += `<tr><td>${NOM_UNITE[i + 1]}</td><td>${numeral(this._armeeAp.unite[i]).format()} (${(diff1 > 0 ? "+" : "") + numeral(diff1).format()})</td><td>${numeral(this._armeeEnnemieAp.unite[i]).format()} (${numeral(this._armeeEnnemieAp.unite[i] - this._armeeEnnemieAv.unite[i]).format()})</td></tr>`;
			}
		}
		html += `<tr><td></td><td colspan='2' class='gras'>Bilan Perte</td></tr>
			<tr><td><img width='35' class='o_vAlign' src='images/icone/icone_ouvriere.png' alt='nb_unite'/></td><td>${numeral(this._armeePe.getSommeUnite()).format()} (${numeral(this._armeePe.getSommeUnite() - this._armeeAv.getSommeUnite()).format()})</td><td>${numeral(this._armeeEnnemieAp.getSommeUnite()).format()} (${numeral(this._armeeEnnemieAp.getSommeUnite() - this._armeeEnnemieAv.getSommeUnite()).format()})</td></tr>
			<tr><td><img height='18' class='o_vAlign' src='images/icone/icone_coeur.gif'/></td><td>${numeral(this._armeePe.getBaseVie()).format()} (${numeral(this._armeePe.getBaseVie() - this._armeeAv.getBaseVie()).format()})</td><td>${numeral(this._armeeEnnemieAp.getBaseVie()).format()} (${numeral(this._armeeEnnemieAp.getBaseVie() - this._armeeEnnemieAv.getBaseVie()).format()})</td></tr>
			<tr><td><img height='18' class='o_vAlign' src='images/icone/icone_degat_attaque.gif'></td><td>${numeral(this._armeePe.getBaseAtt()).format()} (${numeral(this._armeePe.getBaseAtt() - this._armeeAv.getBaseAtt()).format()})</td><td>${numeral(this._armeeEnnemieAp.getBaseAtt()).format()} (${numeral(this._armeeEnnemieAp.getBaseAtt() - this._armeeEnnemieAv.getBaseAtt()).format()})</td></tr>
			<tr><td><img height='18' class='o_vAlign' src='images/icone/icone_degat_defense.gif'/></td><td>${numeral(this._armeePe.getBaseDef()).format()} (${numeral(this._armeePe.getBaseDef() - this._armeeAv.getBaseDef()).format()})</td><td>${numeral(this._armeeEnnemieAp.getBaseDef()).format()} (${numeral(this._armeeEnnemieAp.getBaseDef() - this._armeeEnnemieAv.getBaseDef()).format()})</td></tr>
			<tr><td><img width='18' class='o_vAlign' src='images/icone/horloge.png'/></td><td>${Utils.intToTime(this._armeeAv.getTemps(0) - this._armeePe.getTemps(0))}</td><td>${Utils.intToTime(this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0))}</td></tr>
			<tr><td>Temps HOF</td><td colspan='2'>${Utils.intToTime((this._armeeAv.getTemps(0) - this._armeePe.getTemps(0)) + (this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0)))}</td></tr>`;
		if(this._armeePe.getBaseAtt() != this._armeeAp.getBaseAtt()){
			let diff1 = this._armeeAp.getBaseVie() - this._armeeAv.getBaseVie();
			let diff2 = this._armeeAp.getBaseAtt() - this._armeeAv.getBaseAtt();
			let diff3 = this._armeeAp.getBaseDef() - this._armeeAv.getBaseDef();
			html += `<tr><td colspan='3' class='gras'>Bilan XP</td></tr>
				<tr><td colspan='3'><img height='18' class='o_vAlign' src='images/icone/icone_coeur.gif'/> ${(diff1 > 0 ? "+" : "") + numeral(diff1).format()}</td></tr>
				<tr><td colspan='3'><img height='18' class='o_vAlign' src='images/icone/icone_degat_attaque.gif'> ${(diff2 > 0 ? "+" : "") + numeral(diff2).format()}</td></tr>
				<tr><td colspan='3'><img height='18' class='o_vAlign' src='images/icone/icone_degat_defense.gif'/> ${(diff3 > 0 ? "+" : "") + numeral(diff3).format()}</td></tr>`;
		}
        return html;
    }
}
