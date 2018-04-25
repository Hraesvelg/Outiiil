/*
 * Armee.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /Armee.php.
*
* @class PageArmee
* @constructor
*/
class PageArmee
{
    constructor(boiteComptePlus)
    {
        /**
        * Accés à la boite compte+
        */
        this._boiteComptePlus = boiteComptePlus;
        /**
        * Armée sur le terrain.
        *
        * @private
        * @property armeeTdc
        * @type Class
        */
        this._armeeTdc = null;
        /**
        * Armée en dome.
        *
        * @private
        * @property armeeDome
        * @type Class
        */
        this._armeeDome = null;
        /**
        * Armée en loge.
        *
        * @private
        * @property armeeLoge
        * @type Class
        */
        this._armeeLoge = null;
        /**
        * Nombre d'attaque en cours.
        *
        * @private
        * @property nbAttaque
        * @type Integer
        */
        this._nbAttaque = $("#centre").text().split(/- Vous allez attaquer|- Des renforts arrivent/g).length - 1;
    }
    /**
    *
    */
    executer()
    {
        this.recupereArmeeTdc();
        this.recupereArmeeDome();
        this.recupereArmeeLoge();
        // Affichage du nombre d'attaque restante
        $("h3:eq(2)").append(` ${this._nbAttaque}, reste : ${(monProfil.niveauRecherche[6] + 1 - this._nbAttaque)}.</p>`);
        // Affichage du nombre total d'unité
        $("h3:first").append(` (${numeral(this._armeeTdc.getSommeUnite() + this._armeeDome.getSommeUnite() + this._armeeLoge.getSommeUnite()).format()})</p>`);
        // Bouton antisonde
        $(".simulateur:eq(0) tr:eq(0)").after(`<tr><td colspan="10" class='right'><button id='o_replaceArmee' class='o_button f_success'>Replacer l'armée</button></td></tr>`);
        $("#o_replaceArmee").click(() => {
            if(this._armeeLoge.getSommeUnite() + this._armeeDome.getSommeUnite() + this._armeeTdc.getSommeUnite()){
                let premiereUnite = this.indicePremiereUnite();
                let nbUniteDispo = this._armeeLoge.unite[premiereUnite] + this._armeeDome.unite[premiereUnite] + this._armeeTdc.unite[premiereUnite];
                // si j'ai assez d'unité pour mettre les antisonde en param
                if(nbUniteDispo >= monProfil.parametre["uniteAntisondeDome"].valeur + monProfil.parametre["uniteAntisondeTerrain"].valeur){
                    // si les unités en terrain et dome ne sont pas dans les bornes dasn antisonde on replace tout sinon on est bon
                    if(!this.estPlacePourAntiSonde(premiereUnite, monProfil.parametre["uniteAntisondeTerrain"].valeur, monProfil.parametre["uniteAntisondeDome"].valeur))
                        this.placerAntisondeSuffisant(premiereUnite, nbUniteDispo);
                    else
                        $.toast({...TOAST_INFO, text : "Votre armée est déjà placée correctement."});
                }else{
                    if(!this.estPlacePourAntiSonde(premiereUnite, 1, nbUniteDispo * 0.3))
                        this.placerAntisondeInsuffisant(premiereUnite, nbUniteDispo);
                    else
                        $.toast({...TOAST_INFO, text : "Votre armée est déjà placée correctement."});
                }
            }else
                $.toast({...TOAST_ERROR, text : "Aucune unité n'est transférable."});
            return false;
        });

        if(!Utils.comptePlus) this.plus();
        // Affichage du temps Hof de votre armée
        $(".simulateur:first").append("<tr><td colspan=10>Temps <span class='gras' title='Hall Of Fame' >HOF : " + Utils.shortcutTime(this._armeeTdc.getTemps(0) + this._armeeDome.getTemps(0) + this._armeeLoge.getTemps(0)) + "</span>, Temps relatif : <span class='gras'>" + Utils.shortcutTime(this._armeeTdc.getTemps(monProfil.getTDP()) + this._armeeDome.getTemps(monProfil.getTDP()) + this._armeeLoge.getTemps(monProfil.getTDP())) + "</span></td></tr>");
        // Affichage des statistiques detaillés
        this.afficherStatistique();
        return this;
    }
    /**
	* Initialise l'armée en terrain de chasse.
    *
    * @private
	* @method getArmeeTdc
	*/
	recupereArmeeTdc()
	{
        let unites = {};
		$(".simulateur tr[align=center]:lt(14)").each((i, elt) => {
			let unite = $(elt).find(".pas_sur_telephone").text(), nbr = numeral($(elt).find("td:nth-child(3) span").text()).value();
            if(unite && nbr) unites[unite] = nbr;
		});
        this._armeeTdc = new Armee({unite : unites});
	}
	/**
	* Initialise l'armée en dome.
    *
	* @private
	* @method getArmeeDome
	*/
	recupereArmeeDome()
	{
        let unites = {};
		$(".simulateur tr[align=center]:lt(14)").each((i, elt) => {
			let unite = $(elt).find(".pas_sur_telephone").text();
			$(elt).find("td").slice(3, ($(elt).find("td").length - 2)).each((i2, elt2) => {
				let nbr = numeral($(elt2).text()).value();
                if(unite && nbr) unites[unite] = nbr;
			});
		});
        this._armeeDome = new Armee({unite : unites});
	}
	/**
	* Initialise l'armée en loge.
    *
	* @private
	* @method getArmeeLoge
	*/
	recupereArmeeLoge()
	{
        let unites = {};
		$(".simulateur tr[align=center]:lt(14)").each((i, elt) => {
			let unite = $(elt).find('.pas_sur_telephone').text(), nbr = numeral($(elt).find("td:nth-last-child(2)").text()).value();
			if(unite && nbr) unites[unite] = nbr;
		});
        this._armeeLoge = new Armee({unite : unites});
	}
    /**
    *
    */
    indicePremiereUnite()
    {
        // on trouve d'abord la premiere unite dispo c'est elle qui sert d'antisonde
        for(let i = 0 ; i < this._armeeTdc.unite.length ; i++)
            if(this._armeeTdc.unite[i] + this._armeeDome.unite[i] + this._armeeLoge.unite[i])
                return i;
        return -1;
    }
    /**
    *
    */
    estPlacePourAntiSonde(indUnite, nbUniteTerrain, nbUniteDome)
    {
        if(indUnite != -1){
            // si on a des unites autres que la premiere en terrain ou dome on est mal place
            for(let i = 0 ; i < this._armeeTdc.unite.length ; i++){
                if(this._armeeTdc.unite[i] > 0 && i != indUnite)
                    return false;
                if(this._armeeDome.unite[i] > 0 && i != indUnite)
                    return false;
            }
            // si on assez d'unite on doit respecter les bornes
            if(this._armeeTdc.unite[indUnite] + this._armeeDome.unite[indUnite] + this._armeeLoge.unite[indUnite] > nbUniteTerrain + nbUniteDome){
                // si la premiere unite n'est pas dans les bornes on est mal place
                if(this._armeeDome.unite[indUnite] > nbUniteDome || this._armeeDome.unite[indUnite] < nbUniteDome * 0.9 || this._armeeTdc.unite[indUnite] > nbUniteTerrain || this._armeeTdc.unite[indUnite] < nbUniteTerrain * 0.9)
                    return false;
            }
            return true;
        }else
            return false;
    }
    /**
    *
    */
    placerAntisondeSuffisant(indUnite, nbTroupeDispo)
    {
        let securite = $("#t").attr("name") + "=" + $("#t").val();
        $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?deplacement=3&" + securite, (data) => {
            let correspondanceUnite = [1, 2, 3 , 4 , 5, 6, 14, 7, 8, 9, 10, 13, 11, 12];
            // si on a pas assez de troupes on prend un nombre au hasard
            let nbTroupes = Math.round(Math.random() * (monProfil.parametre["uniteAntisondeDome"].valeur - monProfil.parametre["uniteAntisondeDome"].valeur * 0.9) + monProfil.parametre["uniteAntisondeDome"].valeur * 0.9);
            if(nbTroupeDispo < nbTroupes) nbTroupes = Math.round(Math.random() * (nbTroupeDispo - nbTroupeDispo * 0.9) + nbTroupeDispo * 0.9);
            // on place l'antisonde en dome
            $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?Transferer=Envoyer&LieuOrigine=3&LieuDestination=2&ChoixUnite=unite" + correspondanceUnite[indUnite] + "&nbTroupes=" + nbTroupes + "&" + securite, (data) => {
                nbTroupeDispo -= nbTroupes;
                nbTroupes = Math.round(Math.random() * (monProfil.parametre["uniteAntisondeTerrain"].valeur - monProfil.parametre["uniteAntisondeTerrain"].valeur * 0.9) + monProfil.parametre["uniteAntisondeTerrain"].valeur * 0.9);
                // si on a pas assez de troupes on prend un nombre au hasard
                if(nbTroupeDispo < nbTroupes) nbTroupes = Math.round(Math.random() * (nbTroupeDispo - nbTroupeDispo * 0.9) + nbTroupeDispo * 0.9);
                $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?Transferer=Envoyer&LieuOrigine=3&LieuDestination=1&ChoixUnite=unite" + correspondanceUnite[indUnite] + "&nbTroupes=" + nbTroupes + "&" + securite, (data) => {
                    location = "/Armee.php";
                });
            });
        });
        return this;
    }
    /**
    *
    */
    placerAntisondeInsuffisant(indUnite, nbTroupeDispo)
    {
        let securite = $("#t").attr("name") + "=" + $("#t").val();
        $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?deplacement=3&" + securite, (data) => {
            let correspondanceUnite = [1, 2, 3 , 4 , 5, 6, 14, 7, 8, 9, 10, 13, 11, 12];
            // on place l'antisonde en dome
            $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?Transferer=Envoyer&LieuOrigine=3&LieuDestination=2&ChoixUnite=unite" + correspondanceUnite[indUnite] + "&nbTroupes=" + Math.round(nbTroupeDispo * 0.3) + "&" + securite, (data) => {
                $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?Transferer=Envoyer&LieuOrigine=3&LieuDestination=1&ChoixUnite=unite" + correspondanceUnite[indUnite] + "&nbTroupes=1&" + securite, (data) => {
                    location = "/Armee.php";
                });
            });
        });
        return this;
    }
	/**
	* Ajoute les fonctionnalités du compte+. Affiche les infos sur l'armée et les fléches dans le tableau des unités.
    *
	* @private
	* @method plus
	*/
	plus()
	{
		// Affiche les fléches de deplacement des unités
		$(".simulateur td").each((i, elt) => {
			if(/^[0-9,]+$/.test($(elt).text().replace(/ /g, ''))){
				let info   = $(elt).find('span').attr('id').replace(/\(|\)/g, '');
				let nbUnit = info.split(',')[0], nomUnit = info.split(',')[1].replace(/\'/g, ''), lieuDep = info.split(',')[2];
				if(lieuDep != 3){
					let lien = "Armee.php?Transferer&nbTroupes=" + nbUnit + "&ChoixUnite=" + nomUnit + "&LieuOrigine=" + lieuDep + "&LieuDestination=" + (~~(lieuDep) + 1) + "&" + $("#t").attr('name') + "=" + $("#t").attr('value');
					$(elt).next().html(`<a href="${lien}" class='cursor'><img width='9' height='15' src='http://img2.fourmizzz.fr/images/bouton/fleche-champs-droite.gif'/></a>`);
				}
				if(lieuDep != 1){
					let lien = "Armee.php?Transferer&nbTroupes=" + nbUnit + "&ChoixUnite=" + nomUnit + "&LieuOrigine=" + lieuDep + "&LieuDestination=" + (~~(lieuDep) - 1) + "&" +  $("#t").attr('name') + "=" + $("#t").attr('value');
					$(elt).prev().html(`<a href="${lien}" class='cursor'><img width='9' height='15' src='http://img2.fourmizzz.fr/images/bouton/fleche-champs-gauche.gif'/></a>`);
				}
			}
		});
		// Affichage des infos sur l'armée selon son placement
		this.afficherLigneVie();
		this.afficherLigneAttaque();
		this.afficherLigneDefense();
		this.afficherLigneConsommation();
		// Sauvegarde des attaques en cours
        let listeAttaque = new Array();
        $("span[id^='attaque_']").each((i, elt) => {
            if( $(elt).prev().find("a").length){ // attaque normale
                listeAttaque.push({"cible" : $(elt).prev().text(), "exp" : moment().add($(elt).next().text().split(",")[0].split("(")[1], 's')});
                // Affichage du retour
                $(elt).after(`<span class='small'> - Retour le ${Utils.roundMinute($(elt).next().text().split(",")[0].split("(")[1]).format("D MMM YYYY à HH[h]mm")}</span>`);
            }else // renfort
                $(elt).after(`<span class='small'> - Retour le ${Utils.roundMinute($(elt).next().next().text().split(",")[0].split("(")[1]).format("D MMM YYYY à HH[h]mm")}</span>`);
        });
        // Verification si les données sont deja enregistré
		this.saveAttaque(listeAttaque);
	}
	/**
	* Affiche les informations supplémentaires sur la vie des armées.
    *
	* @private
	* @method afficherLigneVie
	*/
	afficherLigneVie()
	{
		let bouclier = monProfil.niveauRecherche[1];
		let line = `<tr align='center' class='vie cursor'>
			 <td>Vie (AB)</td>
			 <td colspan=3>${IMG_VIE} ${numeral(this._armeeTdc.getTotalVie(bouclier)).format()}</td>
			 <td colspan=3>${IMG_VIE} ${numeral(this._armeeDome.getTotalVie(bouclier, LIEU.DOME, ~~($('span:contains("Dôme")').text().replace(/\D/g, '')))).format()}</td>
			 <td colspan=3>${IMG_VIE} ${numeral(this._armeeLoge.getTotalVie(bouclier, LIEU.LOGE, ~~($('span:contains("Loge")').text().replace(/\D/g, '')))).format()}</td>
			 </tr>
			 <tr align='center' class='vie cursor' style='display:none;'>
			 <td>Vie (HB)</td>
			 <td colspan=3>${IMG_VIE} ${numeral(this._armeeTdc.getBaseVie()).format()}</td>
			 <td colspan=3>${IMG_VIE} ${numeral(this._armeeDome.getBaseVie()).format()}</td>
			 <td colspan=3>${IMG_VIE} ${numeral(this._armeeLoge.getBaseVie()).format()}</td>
			 </tr>`;
		$(".simulateur tr[align=center]:last").after(line);
		$(".vie").click(() => {$(".vie").toggle();});
	}
    /**
	* Affiche les informations supplémentaires sur l'attaque des armées.
    *
	* @private
	* @method afficherLigneAttaque
	*/
	afficherLigneAttaque()
	{
		let armes = monProfil.niveauRecherche[2];
		let line = `<tr align="center" class="att ligne_paire cursor">
			 <td>Dégâts en Attaque (AB)</td>
			 <td colspan=3>${IMG_ATT} ${numeral(this._armeeTdc.getTotalAtt(armes)).format()}</td>
			 <td colspan=3>${IMG_ATT} ${numeral(this._armeeDome.getTotalAtt(armes)).format()}</td>
			 <td colspan=3>${IMG_ATT} ${numeral(this._armeeLoge.getTotalAtt(armes)).format()}</td>
			 </tr>
			 <tr align="center" class="att ligne_paire cursor" style="display:none;">
			 <td>Dégâts en Attaque (HB)</td>
			 <td colspan=3>${IMG_ATT} ${numeral(this._armeeTdc.getBaseAtt()).format()}</td>
			 <td colspan=3>${IMG_ATT} ${numeral(this._armeeDome.getBaseAtt()).format()}</td>
			 <td colspan=3>${IMG_ATT} ${numeral(this._armeeLoge.getBaseAtt()).format()}</td>
			 </tr>`;
		$(".simulateur tr[align=center]:last").after(line);
		$(".att").click(() => {$(".att").toggle();});
	}
    /**
	* Affiche les informations supplémentaires sur la defense des armées.
    *
	* @private
	* @method afficherLigneDefense
	*/
	afficherLigneDefense()
	{
		let armes = monProfil.niveauRecherche[2];
		let line = `<tr align="center" class="def cursor">
			 <td>Dégâts en Défense (AB)</td>
			 <td colspan=3>${IMG_DEF} ${numeral(this._armeeTdc.getTotalDef(armes)).format()}</td>
			 <td colspan=3>${IMG_DEF} ${numeral(this._armeeDome.getTotalDef(armes)).format()}</td>
			 <td colspan=3>${IMG_DEF} ${numeral(this._armeeLoge.getTotalDef(armes)).format()}</td>
			 </tr>
			 <tr align="center" class="def cursor" style="display:none;">
			 <td>Dégâts en Défense (HB)</td>
			 <td colspan=3>${IMG_DEF} ${numeral(this._armeeTdc.getBaseDef()).format()}</td>
			 <td colspan=3>${IMG_DEF} ${numeral(this._armeeDome.getBaseDef()).format()}</td>
			 <td colspan=3>${IMG_DEF} ${numeral(this._armeeLoge.getBaseDef()).format()}</td>
			 </tr>`;
		$(".simulateur tr[align=center]:last").after(line);
		$(".def").click(() => {$(".def").toggle();});
	}
    /**
	* Affiche les informations supplémentaires sur la consommation des armées.
    *
	* @private
	* @method afficherLigneConsommation
	*/
	afficherLigneConsommation()
	{
		let line = `<tr align='center' class='ligne_paire'>
			 <td>Consommation Journalière</td>
			 <td colspan=3>${IMG_POMME} ${numeral(this._armeeTdc.getConsommation(1)).format()}</td>
			 <td colspan=3>${IMG_POMME} ${numeral(this._armeeDome.getConsommation(2)).format()}</td>
			 <td colspan=3>${IMG_POMME} ${numeral(this._armeeLoge.getConsommation(3)).format()}</td>
			 </tr>`;
		$(".simulateur tr[align=center]:last").after(line);
	}
    /**
    *
    */
    afficherStatistique()
    {
        let bouclier = monProfil.niveauRecherche[1], armes = monProfil.niveauRecherche[2];
        $(".simulateur:first").after(`<br/><div id="o_statArmee" class="simulateur">
            <h3>Statistiques</h3>
            <table class="centre o_maxWidth" cellspacing=0>
                <tr class="ligne_paire gras"><td></td><td colspan="2">Non XP</td><td colspan="2">Total</td></tr>
                <tr class="gras"><td></td><td>HB</td><td>AB</td><td>HB</td><td>AB</td></tr>
                <tr class="ligne_paire"><td class="left">${IMG_VIE} Vie</td><td>${numeral(this._armeeTdc.getNonXpBaseVie() + this._armeeDome.getNonXpBaseVie() + this._armeeLoge.getNonXpBaseVie()).format()}</td><td>${numeral(this._armeeTdc.getNonXpTotalVie(bouclier) + this._armeeDome.getNonXpTotalVie(bouclier) + this._armeeLoge.getNonXpTotalVie(bouclier)).format()}</td><td>${numeral(this._armeeTdc.getBaseVie() + this._armeeDome.getBaseVie() + this._armeeLoge.getBaseVie()).format()}</td><td>${numeral(this._armeeTdc.getTotalVie(bouclier) + this._armeeDome.getTotalVie(bouclier) + this._armeeLoge.getTotalVie(bouclier)).format()}</td></tr>
                <tr><td class="left">${IMG_ATT} Attaque</td><td>${numeral(this._armeeTdc.getNonXpBaseAtt() + this._armeeDome.getNonXpBaseAtt() + this._armeeLoge.getNonXpBaseAtt()).format()}</td><td>${numeral(this._armeeTdc.getNonXpTotalAtt(armes) + this._armeeDome.getNonXpTotalAtt(armes) + this._armeeLoge.getNonXpTotalAtt(armes)).format()}</td><td>${numeral(this._armeeTdc.getBaseAtt() + this._armeeDome.getBaseAtt() + this._armeeLoge.getBaseAtt()).format()}</td><td>${numeral(this._armeeTdc.getTotalAtt(armes) + this._armeeDome.getTotalAtt(armes) + this._armeeLoge.getTotalAtt(armes)).format()}</td></tr>
                <tr class="ligne_paire"><td class="left">${IMG_DEF} Défense</td><td>${numeral(this._armeeTdc.getNonXpBaseDef() + this._armeeDome.getNonXpBaseDef() + this._armeeLoge.getNonXpBaseDef()).format()}</td><td>${numeral(this._armeeTdc.getNonXpTotalDef(armes) + this._armeeDome.getNonXpTotalDef(armes) + this._armeeLoge.getNonXpTotalDef(armes)).format()}</td><td>${numeral(this._armeeTdc.getBaseDef() + this._armeeDome.getBaseDef() + this._armeeLoge.getBaseDef()).format()}</td><td>${numeral(this._armeeTdc.getTotalDef(armes) + this._armeeDome.getTotalDef(armes) + this._armeeLoge.getTotalDef(armes)).format()}</td></tr>
            </table>
        </div>`);
        $("#o_statArmee").width($(".simulateur:first").width());
    }
	/**
	* Verifie les attaques en cours avec ce qui est sauvegarder.
    *
	* @private
	* @method saveAttaque
	*/
	saveAttaque(listeAttaque)
	{
        if(!this._boiteComptePlus.hasOwnProperty("attaque") || this._boiteComptePlus.attaque.length != listeAttaque.length || this._boiteComptePlus.attaque[0]["cible"] != listeAttaque[0]["cible"] || listeAttaque[0]["exp"].diff(this._boiteComptePlus.attaque[0]["exp"], 's') > 1 && !Utils.comptePlus && $("#boiteComptePlus").length){
            this._boiteComptePlus.attaque = listeAttaque;
            this._boiteComptePlus.startAttaque = moment();
            this._boiteComptePlus.sauvegarder().majAttaque();
        }
        return this;
	}
}
