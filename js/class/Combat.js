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
    constructor(parametres = {})
    {
        /**
        * id du RC dans la messagerie sinon un datetime pour l'analyse dans la boite ou la simulation
        */
        this._id = parametres["id"] || -1;
        /**
        * texte correspondant au RC pour l'analyse
        */
        this._rc = parametres["RC"] || "";
        /**
        * lieu du combat
        */
        this._lieu = parametres["lieu"] || 0;
        /**
        * dateheure du RC seulement pour l'analyse dans la messagerie
        */
        this._dateHeure = parametres["dateHeure"] || -1;
        /**
        * si on est attaquant ou defenseur
        * 0 : attaquant
        * 1 : defenseur
        */
        this._pointDeVue = parametres["pointDeVue"] || 0;
        /**
        * attaquant dans le combat
        */
        this._attaquant = new Joueur({pseudo : "Attaquant"});
        /*
        * pour l'analyse on peut calculer plusieurs solutions de bonus
        */
        this._attaquantBonusLieu = new Array();
        /**
        * armée du joueur 1 correspondant au vous
        */
		this._armeeAv = parametres["attaquant"] || new Armee();
        /**
        * armee du joueur 1 aprés combat
        */
		this._armeePe = null;
        /**
        * armée du joueur 1 aprés combat avec xp
        */
		this._armeeAp = null;
        /**
        * defenseur dans le combat
        */
        this._defenseur = new Joueur({pseudo : "Défenseur"});
        /*
        * pour l'analyse on peut calculer plusieurs solutions de bonus
        */
        this._defenseurBonusLieu = new Array();
        /**
        *
        */
        this._defenseurTDP = new Array();
        /**
        * arméee du joueur 2 avant combat
        */
        this._armeeEnnemieAv = parametres["defenseur"] || new Armee();
        /**
        * armée du joueur 2 aprés combat
        */
		this._armeeEnnemieAp = null;
        /**
        *
        */
        this._tour = new Array();
    }
    /**
    *
    */
    get lieu()
    {
        return this._lieu;
    }
    /**
    *
    */
    set lieu(newLieu)
    {
        this._lieu = newLieu;
    }
    /**
    *
    */
    get position()
    {
        return this._pointDeVue;
    }
    /**
    *
    */
    set position(newPosition)
    {
        this._pointDeVue = newPosition;
    }
    /**
    *
    */
    get attaquant()
    {
        return this._attaquant;
    }
    /**
    *
    */
    set attaquant(newJoueur)
    {
        this._attaquant = newJoueur;
    }
    /**
    *
    */
    get defenseur()
    {
        return this._defenseur;
    }
    /**
    *
    */
    set defenseur(newJoueur)
    {
        this._defenseur = newJoueur;
    }
    /**
    *
    */
    get armee1()
    {
        return this._armeeAv;
    }
    /**
    *
    */
    set armee1(newArmee)
    {
        this._armeeAv = newArmee;
    }
    /**
    *
    */
    get armee1Ap()
    {
        return this._armeeAp;
    }
    /**
    *
    */
    set armee1Ap(newArmee)
    {
        this._armeeAp = newArmee;
    }
    /**
    *
    */
    get armee2()
    {
        return this._armeeEnnemieAv;
    }
    /**
    *
    */
    set armee2(newArmee)
    {
        this._armeeEnnemieAv = newArmee;
    }
    /**
    *
    */
    get armee2Ap()
    {
        return this._armeeEnnemieAp;
    }
    /**
    *
    */
    set armee2Ap(newArmee)
    {
        this._armeeEnnemieAp = newArmee;
    }
    /**
    *
    */
    get bonusAttaquant()
    {
        return this._attaquantBonusLieu;
    }
    /**
    *
    */
    set bonusAttaquant(newBonus)
    {
        this._attaquantBonusLieu = newBonus;
    }
    /**
    *
    */
    get bonusDefenseur()
    {
        return this._defenseurBonusLieu;
    }
    /**
    *
    */
    set bonusDefenseur(newBonus)
    {
        this._defenseurBonusLieu = newBonus;
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
	calculerArmes(base, bonus)
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
	calculerBouclier(degat, armee1, armee2)
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
	calculerBouclierLieu(lieu, degat, armee1, armee2, armes)
	{
        let solution = new Array(), viePerdue = armee1.getBaseVie() - armee2.getBaseVie(), tmpLieu = -1;
        switch(lieu){
            case 1 :
                for(let bouclier = armes - 3 ; bouclier <= armes + 2 ; bouclier++){
                    tmpLieu = (((degat - viePerdue) / viePerdue) * 20 - 2) - (2 * bouclier);
                    if(tmpLieu <= 45 && tmpLieu >= 0)
                        solution.push(bouclier + '/' + Math.round(tmpLieu));
                }
                break;
            case 2 :
                for(let bouclier = armes - 3 ; bouclier <= armes + 2 ; bouclier++){
                    tmpLieu = (((degat - viePerdue) / viePerdue) * 20 / 3 - 2) - (2 * bouclier / 3);
                    if(Math.abs(tmpLieu - Math.round(tmpLieu)) < 0.2 && tmpLieu <= 45 && tmpLieu >= 0)
                        solution.push(bouclier + '/' + Math.round(tmpLieu));
                }
                break;
            default :
                break;
        }
		return solution;
	}
    /**
    *
    */
    calculerTDP(armee)
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
	* Analyse un rapport sous forme de string.
    *
	* @private
	* @method analyse
	*/
	analyse()
	{
        let motCle = new Array("Troupes en défense : ", "Troupes en attaque : ", "Vous infligez", "ennemie inflige", "et en tue", "et tuez", "dégâts");
        // si le RC contient bien les mots clés
        if(motCle.some((substring) => {return this._rc.includes(substring);})){
            let tmpPseudo = new Array();
            // recup du lieu
            this._lieu = this._rc.includes("Loge") ? 2 : (this._rc.includes("fourmilière") ? 1 : 0);
            this._attaquant.pseudo = "Vous";
            // Récuperation des armées si on nous attaque on est en défense
            if(this._rc.includes("attaque votre") || this._rc.includes("attaque une de vos colonies")){
                this._pointDeVue = 1;
                this._armeeAv.parseArmee(this._rc.split("Troupes en défense : ")[1].split(".")[0]);
                this._armeeEnnemieAv.parseArmee(this._rc.split("Troupes en attaque : ")[1].split(".")[0]);
                tmpPseudo = this._rc.split(" attaque")[0].split(" ");
                this._defenseur.pseudo = tmpPseudo.length > 1 ? tmpPseudo[tmpPseudo.length - 1] : tmpPseudo[0];
            }else{ // sinon en attaque
                this._armeeAv.parseArmee(this._rc.split("Troupes en attaque : ")[1].split(".")[0]);
                this._armeeEnnemieAv.parseArmee(this._rc.split("Troupes en défense : ")[1].split(".")[0]);
                // attaque attaque sur colonisateur
                if(this._rc.includes("mais une armée d'occupation est déjà présente")){
                    this._defenseur.pseudo = this._rc.split("e de ")[1].split(",")[0];
                // attaque normale
                }else if(this._rc.includes("Vous attaquez l")){
                    this._defenseur.pseudo = this._rc.split("e de ")[1].split("\nTroupes")[0];
                    this._defenseurTDP = this.calculerTDP(this._armeeEnnemieAv);
                // rebellion
                }else{
                    this._defenseur.pseudo = this._rc.split("contre ")[1].split("\nTroupes")[0];
                }
            }
            // On calcule l'armée du joueur 1 en sortie
            this._armeePe = this.retirerPerte(this._armeeAv, "et en tue");
            this._armeeAp = this.ajouterXP(this._armeePe);
            // On calcule l'armée du joueur 2 en sortie
            this._armeeEnnemieAp = this.retirerPerte(this._armeeEnnemieAv, "et tuez");
            // Calcule du niveau d'arme du "Vous"
            if(this._pointDeVue == 1){
                let tmp1 = this._rc.split("Vous infligez")[1].split("dégâts")[0], base1 = parseInt(tmp1.split("(")[0].replace(/ /g, "")), bonus1 = parseInt(tmp1.split("+")[1].split(")")[0].replace(/ /g, ""));
                this._defenseur.niveauRecherche[2] = this.calculerArmes(base1, bonus1);
                // Calcule du niveau d'arme de "l'ennemie"
                let tmp2 = this._rc.split("ennemie inflige")[1].split("dégâts")[0], base2 = parseInt(tmp2.split("(")[0].replace(/ /g, "")), bonus2 = parseInt(tmp2.split("+")[1].split(")")[0].replace(/ /g, ""));
                this._attaquant.niveauRecherche[2] = this.calculerArmes(base2, bonus2);
                // On peut calculer le bouclier du joueur 2 ("ennemie") si on n'est pas en OS ou qu'on à perdu
                if(this._rc.split("et tuez").length > 2 || this._rc.indexOf("Vous avez gagné") == -1){
                    if(this._rc.includes("attaque votre") || this._lieu == LIEU.TERRAIN)
                        this._attaquant.niveauRecherche[1] = this.calculerBouclier(base1 + bonus1, this._armeeEnnemieAv, this.retirerPerte(this._armeeEnnemieAv, "et tuez", 2));
                    else
                        this._attaquantBonusLieu = this.calculerBouclierLieu(this._lieu, base1 + bonus1, this._armeeEnnemieAv, this.retirerPerte(this._armeeEnnemieAv, "et tuez", 2), this._defenseur.niveauRecherche[2]);
                }
                // On peut calculer le bouclier du joueur 1 ("vous") si on n'est pas en OS ou qu'on à gagner
                if(this._rc.split("et en tue").length > 2 || this._rc.includes("Vous avez gagné")){
                    if(!this._rc.includes("attaque votre") || this._lieu == LIEU.TERRAIN)
                        this._defenseur.niveauRecherche[1] = this.calculerBouclier(base2 + bonus2, this._armeeAv, this.retirerPerte(this._armeeAv, "et en tue", 2));
                    else
                        this._defenseurBonusLieu = this.calculerBouclierLieu(this._lieu, base2 + bonus2, this._armeeAv, this.retirerPerte(this._armeeAv, "et en tue", 2), this._attaquant.niveauRecherche[2]);
                }
            }else{
                let tmp1 = this._rc.split("Vous infligez")[1].split("dégâts")[0], base1 = parseInt(tmp1.split("(")[0].replace(/ /g, "")), bonus1 = parseInt(tmp1.split("+")[1].split(")")[0].replace(/ /g, ""));
                this._attaquant.niveauRecherche[2] = this.calculerArmes(base1, bonus1);
                // Calcule du niveau d'arme de "l'ennemie"
                let tmp2 = this._rc.split("ennemie inflige")[1].split("dégâts")[0], base2 = parseInt(tmp2.split("(")[0].replace(/ /g, "")), bonus2 = parseInt(tmp2.split("+")[1].split(")")[0].replace(/ /g, ""));
                this._defenseur.niveauRecherche[2] = this.calculerArmes(base2, bonus2);
                // On peut calculer le bouclier du joueur 2 ("ennemie") si on n'est pas en OS ou qu'on à perdu
                if(this._rc.split("et tuez").length > 2 || this._rc.indexOf("Vous avez gagné") == -1){
                    if(this._rc.includes("attaque votre") || this._lieu == LIEU.TERRAIN)
                        this._defenseur.niveauRecherche[1] = this.calculerBouclier(base1 + bonus1, this._armeeEnnemieAv, this.retirerPerte(this._armeeEnnemieAv, "et tuez", 2));
                    else
                        this._defenseurBonusLieu = this.calculerBouclierLieu(this._lieu, base1 + bonus1, this._armeeEnnemieAv, this.retirerPerte(this._armeeEnnemieAv, "et tuez", 2), this._defenseur.niveauRecherche[2]);
                }
                // On peut calculer le bouclier du joueur 1 ("vous") si on n'est pas en OS ou qu'on à gagner
                if(this._rc.split("et en tue").length > 2 || this._rc.includes("Vous avez gagné")){
                    if(!this._rc.includes("attaque votre") || this._lieu == LIEU.TERRAIN)
                        this._attaquant.niveauRecherche[1] = this.calculerBouclier(base2 + bonus2, this._armeeAv, this.retirerPerte(this._armeeAv, "et en tue", 2));
                    else
                        this._attaquantBonusLieu = this.calculerBouclierLieu(this._lieu, base2 + bonus2, this._armeeAv, this.retirerPerte(this._armeeAv, "et en tue", 2), this._attaquant.niveauRecherche[2]);
                }
            }
            return true;
        }
        return false;
	}
	/**
	* Retourne l'armée en retirant d'aprés le rapport les unités perdues suivant le texte.
    *
	* @private
	* @method retirerPerte
	* @param {Object} armee
	* @param {String} separateur
	* @param {String} nbTour on peut choisir de retirer les pertes sur 1 tour ou plusieurs
	* @return {Object} armee perdue
	*/
	retirerPerte(armee, separateur, nbTour = 100000)
	{
		let res = new Armee(), total = 0;
		res.unite = armee.unite.slice(0);
		// Si le rc à plusieurs tours on additionne d'abords les pertes.
		for(let i = 1, tmp = this._rc.split(separateur) ; i < Math.min(tmp.length, nbTour) ; total += parseInt(tmp[i++].split('.')[0].replace(/ /g, '')));
		// Tant que le total n'est pas 0 on retire les unités
        return res.retirerPerte(total);
	}
	/**
	* Retourne l'armée en ajoutant l'xp.
    *
	* @private
	* @method ajouterXP
	* @param {Object} armee
	* @return {Object} armee avec XP
	*/
	ajouterXP(armee)
	{
		let res = new Armee();
		res.unite = armee.unite.slice(0);
		// Pour chaques types d'unitées qui ont XP.
		for(let i = 1, tmp = this._rc.split("- "), tableXP = [-1, 1, 2, -1, 4, 9, 6, -1, 8, -1, -1, 11, -1, 13, -1] ; i < tmp.length ; i++){
			let uniteXP = NOM_UNITE.indexOf(tmp[i].replace(/[0-9]/g, '').split("sont")[0].replace(/s /g, ' ').trim()), qteXP = parseInt(tmp[i].replace(/ /g, ''));
			res.unite[uniteXP - 1] -= qteXP;
			res.unite[tableXP[uniteXP]] += qteXP;
		}
		return res;
	}
    /**
    *
    */
    toHTMLMessagerie()
    {
        let bonusEnnemie = "";
        if(this._pointDeVue == 1)
            bonusEnnemie = `${this._attaquantBonusLieu.length ? "Bouclier (/ " + LIBELLE_LIEU[this._lieu] + ") : " + this._attaquantBonusLieu.join(" - ") + " | " : (this._attaquant.niveauRecherche[1] != -1 ? "Bouclier : " + this._attaquant.niveauRecherche[1] + " | " : "")}Armes : ${this._attaquant.niveauRecherche[2]}`;
        else
            bonusEnnemie = `${this._defenseurBonusLieu.length ? "Bouclier (/ " + LIBELLE_LIEU[this._lieu] + ") : " + this._defenseurBonusLieu.join(" - ") + " | " : (this._defenseur.niveauRecherche[1] != -1 ? "Bouclier : " + this._defenseur.niveauRecherche[1] + " | " : "")}Armes : ${this._defenseur.niveauRecherche[2]}`;
        let html = `<p class='small'>HoF : <span id="temps_hof_total_${this._id}">${Utils.intToTime((this._armeeAv.getTemps(0) - this._armeePe.getTemps(0)) + (this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0)))}</span><br/>Ennemie : <span id="temps_hof_ennemie_${this._id}">${Utils.intToTime(this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0))}</span> - Vous : <span id="temps_hof_vous_${this._id}">${Utils.intToTime(this._armeeAv.getTemps(0) - this._armeePe.getTemps(0))}</span></p>
            <span style='text-decoration:underline;' class='gras'>Niveau(x)</span><br/>
            <p id="bonus_ennemie_${this._id}">${bonusEnnemie}`;
		if(this._armeeAv.getSommeUnite() < 1000 || this._armeeEnnemieAv.getSommeUnite() < 1000)
			html += ` <img src='images/attention.gif' alt='attention' title='les unitées sont peut être insuffisantes pour être sur' class='o_vAlign'/> `;
		html += `</p>`;
        // Affichage des TDP possibles
        if(this._defenseurTDP.length){
            html += `<table class='o_tabTDP centre' cellspacing="0"><tr class="gras"><td>TDP</td><td>Temps ponte</td><td>Heure de départ</td></tr>`;
            for(let i = 0 ; i < this._defenseurTDP.length ; i++){
                let tempsPonte = Math.round(this._armeeEnnemieAv.getTemps(this._defenseurTDP[i]));
                html += `<tr><td>${this._defenseurTDP[i]}</td><td class="right">${Utils.intToTime(tempsPonte)}</td><td>${moment(this._dateHeure, "D[/]M[/]YY[ à ]HH[h]mm").subtract(tempsPonte, 's').format("D MMM YYYY à HH[h]mm")}</td></tr>`;
            }
            html += `</table><br/>`;
        }
		// Affichage des infos sur l'armée restante de l'ennemie
		if(this._armeeEnnemieAp.getSommeUnite()){
			html += `<span style='text-decoration:underline;' class='gras'>Armee (après combat, sans XP)</span><br/><table class='o_tabAnalyse' cellspacing='0'>
				<tr><td><img width='35' src='images/icone/icone_ouvriere.png' alt='nb_unite' class='o_vAlign'/></td><td class='right'>${numeral(this._armeeEnnemieAp.getSommeUnite()).format()}</td>
				<td class='right' style='width:30px;'>${IMG_VIE}</td><td class='right'>${numeral(this._armeeEnnemieAp.getBaseVie()).format()} (HB)</td>`;
            if(this._defenseur.niveauRecherche[1] != -1)
				html += `<td class='right'>${numeral(this._armeeEnnemieAp.getTotalVie(this._defenseur.niveauRecherche[1])).format()} (AB)<img src='images/attention.gif' alt='attention' title='Vie sans le bonus lieu !' class='o_vAlign'/></td></tr>`;
			else if(this._defenseurBonusLieu.length)
				html += `<td class='right'>${numeral(this._armeeEnnemieAp.getTotalVie(parseInt(this._defenseurBonusLieu[0].split("/")[0]), this._lieu, parseInt(this._defenseurBonusLieu[0].split("/")[1]))).format()} (AB) <img src='images/attention.gif' alt='attention' title='vie en ${LIBELLE_LIEU[this._lieu]}' class='o_vAlign'/></td></tr>`;
			else
				html += `<td></td></tr>`;
			html += `<tr><td><img width='18' height='18' src='images/icone/horloge.png' class='o_vAlign'/></td><td class='right'>${Utils.intToTime(this._armeeEnnemieAp.getTemps(0))}</td>
                <td class='right' style='width:30px;'>${IMG_ATT}</td><td class='right'>${numeral(this._armeeEnnemieAp.getBaseAtt()).format()} (HB)</td><td class='right'>${numeral(this._armeeEnnemieAp.getTotalAtt(this._defenseur.niveauRecherche[2])).format()} (AB)</td></tr>
				<tr><td>Perte JSN 10%</td><td class='right'>${numeral(Math.round(this._armeeEnnemieAp.getTotalDef(this._defenseur.niveauRecherche[2]) / 10 / (8 + 8 * monProfil.niveauRecherche[1] / 10))).format()} <img src='images/attention.gif' alt='attention' title='Avec votre bonus Bouclier de : ${monProfil.niveauRecherche[1]}' class='o_vAlign'/></td>
				<td class='right' style='width:30px;'>${IMG_DEF}</td><td class='right'>${numeral(this._armeeEnnemieAp.getBaseDef()).format()} (HB)</td><td class='right'>${numeral(this._armeeEnnemieAp.getTotalDef(this._defenseur.niveauRecherche[2])).format()} (AB)</td></tr>
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
				<tr><td>${IMG_VIE}</td><td class='right'>${(vieHB > 0 ? '+' : '') + numeral(vieHB).format()}(HB)</td><td class='right'>${(vieHB > 0 ? '+' : '') + numeral(this._armeeAp.getTotalVie(monProfil.niveauRecherche[1]) - this._armeeAv.getTotalVie(monProfil.niveauRecherche[1])).format()}(AB)</td><td style='padding-left:10px'>${(vieHB > 0 ? '+' : '') + (vieHB * 100 / this._armeeAv.getBaseVie()).toFixed(2)}%</td></tr>
				<tr><td>${IMG_ATT}</td><td style='padding-left:10px' class='right'>${(attHB > 0 ? '+' : '') + numeral(attHB).format()}(HB)</td><td style='padding-left:10px' class='right'>${(attHB > 0 ? '+' : '') + numeral(this._armeeAp.getTotalAtt(monProfil.niveauRecherche[2]) - this._armeeAv.getTotalAtt(monProfil.niveauRecherche[2])).format()}(AB)</td><td style='padding-left:10px'>${(attHB > 0 ? '+' : '') + (attHB * 100 / this._armeeAv.getBaseAtt()).toFixed(2)}%</td></tr>
				<tr><td>${IMG_DEF}</td><td class='right'>${(defHB > 0 ? '+' : '') + numeral(defHB).format()}(HB)</td><td class='right'>${(defHB > 0 ? '+' : '') + numeral(this._armeeAp.getTotalDef(monProfil.niveauRecherche[2]) - this._armeeAv.getTotalDef(monProfil.niveauRecherche[2])).format()}(AB)</td></td><td style='padding-left:10px'>${(defHB > 0 ? '+' : '') + (defHB * 100 / this._armeeAv.getBaseDef()).toFixed(2)}%</td></tr>
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
        let bonusAtt = "", bonusDef = "";
        if(this._pointDeVue == 0){
            bonusAtt = `${(this._attaquantBonusLieu.length ? this._attaquantBonusLieu.join(" - ") : (this._attaquant.niveauRecherche[1] != -1 ? this._attaquant.niveauRecherche[1] : "N/A"))}`;
            bonusDef = `${(this._defenseurBonusLieu.length ? this._defenseurBonusLieu.join(" - ") : (this._defenseur.niveauRecherche[1] != -1 ? this._defenseur.niveauRecherche[1] : "N/A"))}`;
        }else{
            bonusAtt = `${(this._defenseurBonusLieu.length ? this._defenseurBonusLieu.join(" - ") : (this._defenseur.niveauRecherche[1] != -1 ? this._defenseur.niveauRecherche[1] : "N/A"))}`;
            bonusDef = `${(this._attaquantBonusLieu.length ? this._attaquantBonusLieu.join(" - ") : (this._attaquant.niveauRecherche[1] != -1 ? this._attaquant.niveauRecherche[1] : "N/A"))}`;
        }
        let html = `<tr class='gras'><td></td><td style='width:38%'>${this._attaquant.pseudo}</td><td style='width:38%'>${this._defenseur.getLienFourmizzz()}</td></tr>
			<tr><td>Bouclier (/ ${LIBELLE_LIEU[this._lieu]})</td><td>${bonusAtt}</td><td>${bonusDef}</td></tr>
			<tr><td>Armes</td><td>${this._pointDeVue == 0 ? this._attaquant.niveauRecherche[2] : this._defenseur.niveauRecherche[2]}</td><td>${this._pointDeVue == 0 ? this._defenseur.niveauRecherche[2] : this._attaquant.niveauRecherche[2]}</td></tr>
			<tr><td></td><td colspan='2' class='gras'>Bilan unités</td></tr>`;
		for(let i = 0 ; i < 14 ; i++){
			if(this._armeeAv.unite[i] || this._armeeEnnemieAv.unite[i] || this._armeeAp.unite[i]){
				let diff1 = this._armeeAp.unite[i] - this._armeeAv.unite[i];
				html += `<tr><td>${NOM_UNITE[i + 1]}</td><td>${numeral(this._armeeAp.unite[i]).format()} (${(diff1 > 0 ? "+" : "") + numeral(diff1).format()})</td><td>${numeral(this._armeeEnnemieAp.unite[i]).format()} (${numeral(this._armeeEnnemieAp.unite[i] - this._armeeEnnemieAv.unite[i]).format()})</td></tr>`;
			}
		}
		html += `<tr><td></td><td colspan='2' class='gras'>Bilan Perte</td></tr>
			<tr><td><img width='35' class='o_vAlign' src='images/icone/icone_ouvriere.png' alt='nb_unite'/></td><td>${numeral(this._armeePe.getSommeUnite()).format()} (${numeral(this._armeePe.getSommeUnite() - this._armeeAv.getSommeUnite()).format()})</td><td>${numeral(this._armeeEnnemieAp.getSommeUnite()).format()} (${numeral(this._armeeEnnemieAp.getSommeUnite() - this._armeeEnnemieAv.getSommeUnite()).format()})</td></tr>
			<tr><td>${IMG_VIE}</td><td>${numeral(this._armeePe.getBaseVie()).format()} (${numeral(this._armeePe.getBaseVie() - this._armeeAv.getBaseVie()).format()})</td><td>${numeral(this._armeeEnnemieAp.getBaseVie()).format()} (${numeral(this._armeeEnnemieAp.getBaseVie() - this._armeeEnnemieAv.getBaseVie()).format()})</td></tr>
			<tr><td>${IMG_ATT}</td><td>${numeral(this._armeePe.getBaseAtt()).format()} (${numeral(this._armeePe.getBaseAtt() - this._armeeAv.getBaseAtt()).format()})</td><td>${numeral(this._armeeEnnemieAp.getBaseAtt()).format()} (${numeral(this._armeeEnnemieAp.getBaseAtt() - this._armeeEnnemieAv.getBaseAtt()).format()})</td></tr>
			<tr><td>${IMG_DEF}</td><td>${numeral(this._armeePe.getBaseDef()).format()} (${numeral(this._armeePe.getBaseDef() - this._armeeAv.getBaseDef()).format()})</td><td>${numeral(this._armeeEnnemieAp.getBaseDef()).format()} (${numeral(this._armeeEnnemieAp.getBaseDef() - this._armeeEnnemieAv.getBaseDef()).format()})</td></tr>
			<tr><td><img width='18' class='o_vAlign' src='images/icone/horloge.png'/></td><td>${Utils.intToTime(this._armeeAv.getTemps(0) - this._armeePe.getTemps(0))}</td><td>${Utils.intToTime(this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0))}</td></tr>
			<tr><td>Temps HOF</td><td colspan='2'>${Utils.intToTime((this._armeeAv.getTemps(0) - this._armeePe.getTemps(0)) + (this._armeeEnnemieAv.getTemps(0) - this._armeeEnnemieAp.getTemps(0)))}</td></tr>`;
		if(this._armeePe.getBaseAtt() != this._armeeAp.getBaseAtt()){
			let diff1 = this._armeeAp.getBaseVie() - this._armeeAv.getBaseVie(), diff2 = this._armeeAp.getBaseAtt() - this._armeeAv.getBaseAtt(), diff3 = this._armeeAp.getBaseDef() - this._armeeAv.getBaseDef();
			html += `<tr><td colspan='3' class='gras'>Bilan XP</td></tr>
				<tr><td colspan='3'>${IMG_VIE} ${(diff1 > 0 ? "+" : "") + numeral(diff1).format()}</td></tr>
				<tr><td colspan='3'>${IMG_ATT} ${(diff2 > 0 ? "+" : "") + numeral(diff2).format()}</td></tr>
				<tr><td colspan='3'>${IMG_DEF} ${(diff3 > 0 ? "+" : "") + numeral(diff3).format()}</td></tr>`;
		}
        return html;
    }
    /**
	* Simule un combat
    *
	* @private
	* @method simuler
	*/
    simuler()
    {
        let baseDegatAtt = 0, bonusDegatAtt = 0, baseDegatDef = 0, bonusDegatDef = 0, retourVieTmp = null, armeeAttTmp = null, armeeDefTmp = null;
        // initialisation des armées pour le combat
        this._armeeAp = new Armee();
		this._armeeAp.unite = this._armeeAv.unite.slice(0);
        this._armeeEnnemieAp = new Armee();
		this._armeeEnnemieAp.unite = this._armeeEnnemieAv.unite.slice(0);
        // variable de vie du combat
        let vieAttaquant = new Array().fill(0), vieDefenseur = new Array().fill(0);
        this._armeeAv.unite.forEach((elt, i) => {vieAttaquant[i] = this.calculerVieUnite(elt, i + 1, this._attaquant.niveauRecherche[1], 0, 0);});
        this._armeeEnnemieAv.unite.forEach((elt, i) => {vieDefenseur[i] = this.calculerVieUnite(elt, i + 1, this._defenseur.niveauRecherche[1], this._lieu, this._lieu == LIEU.TERRAIN ? 0 : (this._lieu == LIEU.DOME ? this._defenseur.niveauConstruction[9] : this._defenseur.niveauConstruction[10]));});
        // on repique à 10% si l'attaque est strictement supérieur à la vie en def
        let replique = this.calculerReplique(this._armeeAv.getTotalAtt(this._attaquant.niveauRecherche[2]), vieDefenseur);
        // tant qu'il rete de la vie sur la defense ou l'attaque on enchaine les tours
        while(vieAttaquant.reduce((acc, val) => {return acc + val;}, 0) > 0 && vieDefenseur.reduce((acc, val) => {return acc + val;}, 0) > 0){
            baseDegatAtt = this._attaquant.niveauRecherche[2] ? this._armeeAp.getBaseAtt() : Math.ceil(this._armeeAp.getBaseAtt());
            bonusDegatAtt = baseDegatAtt * this._attaquant.niveauRecherche[2] / 10;
            // le defenseur replique à 10% si l'attauant inglige suffisament de degat
            baseDegatDef = this._defenseur.niveauRecherche[2] ? this._armeeEnnemieAp.getBaseDef() * replique : Math.ceil(this._armeeEnnemieAp.getBaseDef() * replique);
            bonusDegatDef = baseDegatDef * this._defenseur.niveauRecherche[2] / 10;
            // l'attaquant inflige les degats en premier, on calcule l'armée aprés les degats et on met à jour la vie restante
            retourVieTmp = this.retirerVie(this._armeeEnnemieAp, vieDefenseur, baseDegatAtt + bonusDegatAtt);
            armeeDefTmp = retourVieTmp.armeeFinale;
            vieDefenseur = retourVieTmp.vieFinale;
            // le defenseur inflige les degats on calcule l'armée de l'attaquant puis on met a jour sa vie restante
            retourVieTmp = this.retirerVie(this._armeeAp, vieAttaquant, baseDegatDef + bonusDegatDef);
            armeeAttTmp = retourVieTmp.armeeFinale;
            vieAttaquant = retourVieTmp.vieFinale;
            // ajoute des infos sur le tour pour le rapport
            this._tour.push([Math.ceil(baseDegatAtt), Math.ceil(bonusDegatAtt), this._armeeEnnemieAp.getSommeUnite() - armeeDefTmp.getSommeUnite(), Math.ceil(baseDegatDef), Math.ceil(bonusDegatDef), this._armeeAp.getSommeUnite() - armeeAttTmp.getSommeUnite()]);
            // mise à jour des armées finales
            this._armeeAp = armeeAttTmp;
            this._armeeEnnemieAp = armeeDefTmp;
        }
        // le combat est terminé on remet le nombre d'unité sous forme d'entier
        for(let i = 0 ; i < 14 ; i++){
            this._armeeAp.unite[i] = Math.ceil(this._armeeAp.unite[i]);
            this._armeeEnnemieAp.unite[i] = Math.ceil(this._armeeEnnemieAp.unite[i]);
        }
        //alert(this.calculeUniteXP(this._armeeAp, this.calculeRatioXPAttaquant()).unite);
        return this;
    }
    /**
    *
    */
    calculerReplique(pointAtt, pointVie)
    {
        if(pointAtt > pointVie)
            return 0.1;
        return 1;
    }
    /**
    *
    */
    retirerVie(armee, vieUnite, degatInflige)
    {
        let armeePerdu = new Armee();
		armeePerdu.unite = armee.unite.slice(0);
        for(let i = 0 ; i < armeePerdu.unite.length ; i++){
            if(armeePerdu.unite[i]){ // si on a des unités
                if(vieUnite[i] >= degatInflige){ // est ce que la vie de cette unité suffit pour couvrir les degat
                    armeePerdu.unite[i] = (armee.unite[i] * (vieUnite[i] - degatInflige)) / vieUnite[i];
                    vieUnite[i] -= degatInflige;
                    break;
                }else{
                    armeePerdu.unite[i] = 0;
                    degatInflige -= vieUnite[i];
                    vieUnite[i] = 0;
                }
            }
        }
        return {armeeFinale : armeePerdu, vieFinale : vieUnite};
    }
    /**
    *
    */
    calculerVieUnite(nombre, unite, bonusBouclier, lieu, bonusLieu)
    {
        let vie = nombre * VIE_UNITE[unite] + Math.round(nombre * VIE_UNITE[unite] * bonusBouclier / 10);
        switch(parseInt(lieu)){
            case LIEU.DOME :
                vie += Math.round(nombre * VIE_UNITE[unite] * ((bonusLieu + 2) / 20));
                break;
            case LIEU.LOGE :
                vie += Math.round(nombre * VIE_UNITE[unite] * (((bonusLieu + 2) * 3) / 20));
                break;
            default :
                break;
        }
        return vie;
    }
    /**
    *
    */
    calculeRatioXPAttaquant()
    {
        //let coeff = new Array(0, 0.05, 0.15);
        //return Math.pow(this._armeeEnnemieAv.getPotentielXP() / this._armeeAv.getPotentielXP() * 0.66, 2) * (1 + 0.1 * EtableATT) * 1 / (1 + 0.1 * armesATT) * (1 + armesDef * 0.1) * 1 / (1 + 0.1 * bouclierAtt) * (1 + bouclierDef * 0.1 + (niveauLieuDef + 2) * coeff[this._lieu]);
        return 0;
    }
    /**
    *
    */
//    calculeRatioXPDefenseur()
//    {
//        let coef = new Array(0, 0.05, 0.15);
//        return Math.pow(this._armeeAv.getPotentielXP() / this._armeeEnnemieAv.getPotentielXP() * 0.66, 2) * (1 + 0.1 * etableDef) * 1 / (1 + 0.1 * armesDef) * (1 + armesAtt * 0.1) * 1 / (1 + 0.1 * niveauBouclier + (niveauLieu + 2) * coef[this._lieu]) *  (1 + ennemieBouclier * 0.1);
//    }
//    $nous = $this->defenseur_RC;
//    $lui = $this->attaquant_RC;
//    $this->ratio_XP = pow($lui->get_PuissanceXP()/$nous->get_PuissanceXP()*0.66,2);
   // $this->ratio_XP *= 1/(1 + 0.1*$nous->niveaux['bouclier'] + ($this->defenseur->niveaux['niveau_lieu'] + 2)*$coeffs[$this->defenseur->niveaux['lieu']]) *  (1 + $lui->niveaux['bouclier']*0.1);
    /**
    *
    */
    calculeUniteXP(armee, ratio)
    {
        let ordreXp = new Array(0, 1, 3, 4, 5, 7, 10, 12), armeeXP = new Armee();
        ordreXP.forEach((val, i) => {armeeXP.unite[val] = Math.round(armee.unite[val] * ratio);});
        return armee;
    }
    /**
    *
    */
    genererRC()
    {
        let boiteRC = new BoiteRapport(this._id, this._pointDeVue == 0 ? this.genererRCAttaquant() : this.genererRCDefenseur());
        boiteRC.afficher();
        return this;
    }
    /**
    *
    */
    genererRCAttaquant()
    {
        this._rc = `<span class="gras">Vous attaquez ${this._lieu ? "la " + LIBELLE_LIEU[this._lieu] : "le " + LIBELLE_LIEU[this._lieu]} de Inconnu :</span><br/><br/>`;
        // troupe en attaques
        this._rc += `Troupes en attaque : ${this._armeeAv.toString()}<br/>`;
        // troupe en défenses
        this._rc += `Troupes en défense : ${this._armeeEnnemieAv.toString()}<br/><br/>`;
        // on affiche les tours
        for(let i = 0 ; i < this._tour.length ; i++){
            this._rc += `Vous infligez <span class="gras">${numeral(this._tour[i][0]).format()} (+${numeral(this._tour[i][1]).format()})</span> dégats et tuez <span class="gras">${numeral(this._tour[i][2]).format()}</span> ennemies.<br/>`;
            this._rc += `L'ennemie inflige <span class="gras">${numeral(this._tour[i][3]).format()} (+${numeral(this._tour[i][4]).format()})</span> dégats à vos fourmis et en tue <span class="gras">${numeral(this._tour[i][5]).format()}</span>.<br/><br/>`;
        }
        // j'ai gagné
        if(this._armeeAp.getBaseVie()){
            if(this._tour.length > 1)
                this._rc += `L’adversaire y a cru, mais vous sortez victorieux de ce combat acharné.<br/>Vous avez gagné cette bataille !<br/>`;
            else
                this._rc += `Ecrasante victoire !<br/>A peine le temps de se dégourdir les pattes qu'ils étaient tous morts ...<br/>Vous avez gagné cette bataille !<br/>`;
        // j'ai perdu
        }else{
            if(this._tour.length > 1)
                this._rc += `Vos troupes ont été courageuses et combattantes, mais pas assez. L’ennemi se souviendra toutefois de votre passage.<br/>Vos troupes ont échoué.<br/>`;
            else
                this._rc += `Vous avez infiltré l’ennemi. Les informations sont bien rentrées ... mais pas vos soldates !<br/>Vos troupes ont échoué.<br/>`;
        }
        return this._rc;
    }
    /**
    *
    */
    genererRCDefenseur()
    {
        this._rc = `<span class="gras">Inconnu attaque votre ${LIBELLE_LIEU[this._lieu]} :</span><br/><br/>`;
        // troupe en attaques
        this._rc += `Troupes en attaque : ${this._armeeAv.toString()}<br/>`;
        // troupe en défenses
        this._rc += `Troupes en défense : ${this._armeeEnnemieAv.toString()}<br/><br/>`;
        // on affiche les tours
        for(let i = 0 ; i < this._tour.length ; i++){
            this._rc += `L'ennemie inflige <span class="gras">${numeral(this._tour[i][0]).format()} (+${numeral(this._tour[i][1]).format()})</span> dégats à vos fourmis et en tue <span class="gras">${numeral(this._tour[i][2]).format()}</span>.<br/><br/>`;
            this._rc += `Vous infligez <span class="gras">${numeral(this._tour[i][3]).format()} (+${numeral(this._tour[i][4]).format()})</span> dégats et tuez <span class="gras">${numeral(this._tour[i][5]).format()}</span> ennemies.<br/>`;
        }
        // j'ai perdu
        if(this._armeeAp.getBaseVie()){
            if(this._tour.length > 1)
                this._rc += `Les troupes étaient de force égale, cependant il manqua aux nôtres ce petit plus qui fait gagner la bataille.<br/>Vos troupes ont échoué, l’ennemi pénètre vos défenses.<br/>`;
            else
                this._rc += `Vous venez de subir une cuisante défaite.<br/>Vos troupes ont échoué, l’ennemi pénètre vos défenses.<br/>`;
        // j'ai gagné
        }else{
            if(this._tour.length > 1)
                this._rc += `Le combat était difficile, l’ennemi était résistant, mais votre stratégie l’a emporté.<br/>Vous avez gagné cette bataille ! L’ennemie est repoussé.<br/>`;
            else
                this._rc += `Vous n’avez fait qu’une bouchée des espions de l’ennemi ... Restez vigilant, le gros de ses troupes est sûrement déjà en route.<br/>Vous avez gagné cette bataille ! L’ennemie est repoussé.<br/>`;
        }
        return this._rc;
    }
}
