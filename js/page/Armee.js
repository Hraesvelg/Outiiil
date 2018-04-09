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
    constructor()
    {
        /**
        *
        */
        this._boiteComptePlus = new BoiteComptePlus();
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
        this.initialise();
    }
    /**
    *
    */
    initialise()
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
            let securite = $("#t").attr("name") + "=" + $("#t").val();
            let nbUniteTotale = this._armeeLoge.getSommeUnite() + this._armeeDome.getSommeUnite() + this._armeeTdc.getSommeUnite();
            if(nbUniteTotale){
                if(this._armeeLoge.getSommeUnite() < nbUniteTotale * 0.7){
                    $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?deplacement=3&" + securite, (data) => {
                        this.placeAntisondeDome(securite);
                    });
                }else
                    this.placeAntisondeDome(securite);
            }else
                $.toast({...TOAST_ERROR, text : "Aucune unité n'est transférable."});
            return false;
        });

        if(!Utils.comptePlus) this.plus();
        // Affichage du temps Hof de votre armée
        $(".simulateur:first").append("<tr><td colspan=10>Temps <span class='gras' title='Hall Of Fame' >HOF : " + Utils.shortcutTime(this._armeeTdc.getTemps(0) + this._armeeDome.getTemps(0) + this._armeeLoge.getTemps(0)) + "</span>, Temps relatif : <span class='gras'>" + Utils.shortcutTime(this._armeeTdc.getTemps(monProfil.getTDP()) + this._armeeDome.getTemps(monProfil.getTDP()) + this._armeeLoge.getTemps(monProfil.getTDP())) + "</span></td></tr>");
        // Affichage des statistiques detaillés
        this.afficheStatistique();
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
    placeAntisondeDome(securite)
    {
        let unite = -1, nbUniteDispo = -1;
        for(let i = 0 ; i < 14 ; i++){
            nbUniteDispo = this._armeeTdc.unite[i] + this._armeeDome.unite[i] + this._armeeLoge.unite[i];
            if(nbUniteDispo > 0){
                unite = i + 1;
                break;
            }
        }
        let nbTroupes = Math.round(Math.random() * (monProfil.parametre["uniteAntisonde"].valeur - monProfil.parametre["uniteAntisonde"].valeur * 0.9) + monProfil.parametre["uniteAntisonde"].valeur * 0.9);
        if(nbUniteDispo < nbTroupes)
            nbTroupes = Math.round(Math.random() * (nbUniteDispo - nbUniteDispo * 0.9) + nbUniteDispo * 0.9);
        if(nbTroupes){
            $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?Transferer=Envoyer&LieuOrigine=3&LieuDestination=2&ChoixUnite=unite" + unite + "&nbTroupes=" + nbTroupes + "&" + securite, (data) => {
                this.placeAntisondeTerrain(unite, securite);
            });
        }else
            this.placeAntisondeTerrain(unite, securite);
        return this;
    }
    /**
    *
    */
    placeAntisondeTerrain(unite, securite)
    {
        $.post("http://" + Utils.serveur + ".fourmizzz.fr/Armee.php?Transferer=Envoyer&LieuOrigine=3&LieuDestination=1&ChoixUnite=unite" + unite + "&nbTroupes=1&" + securite, (data) => {
            location = "/Armee.php";
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
			 <td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' height='18' title='Vie' \> ${numeral(this._armeeTdc.getTotalVie(bouclier, 1, 0)).format()}</td>
			 <td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' height='18' title='Vie' \> ${numeral(this._armeeDome.getTotalVie(bouclier, 2, ~~($('span:contains("Dôme")').text().replace(/\D/g, '')))).format()}</td>
			 <td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' height='18' title='Vie' \> ${numeral(this._armeeLoge.getTotalVie(bouclier, 3, ~~($('span:contains("Loge")').text().replace(/\D/g, '')))).format()}</td>
			 </tr>
			 <tr align='center' class='vie cursor' style='display:none;'>
			 <td>Vie (HB)</td>
			 <td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' height='18' title='Vie' \> ${numeral(this._armeeTdc.getBaseVie()).format()}</td>
			 <td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' height='18' title='Vie' \> ${numeral(this._armeeDome.getBaseVie()).format()}</td>
			 <td colspan=3><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' height='18' title='Vie' \> ${numeral(this._armeeLoge.getBaseVie()).format()}</td>
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
			 <td>Dégats en Attaque (AB)</td>
			 <td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' height='18' title='Dégat en attaque :' /> ${numeral(this._armeeTdc.getTotalAtt(armes)).format()}</td>
			 <td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' height='18' title='Dégat en attaque :' /> ${numeral(this._armeeDome.getTotalAtt(armes)).format()}</td>
			 <td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' height='18' title='Dégat en attaque :' /> ${numeral(this._armeeLoge.getTotalAtt(armes)).format()}</td>
			 </tr>
			 <tr align="center" class="att ligne_paire cursor" style="display:none;">
			 <td>Dégats en Attaque (HB)</td>
			 <td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' height='18' title='Dégat en attaque :' /> ${numeral(this._armeeTdc.getBaseAtt()).format()}</td>
			 <td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' height='18' title='Dégat en attaque :' /> ${numeral(this._armeeDome.getBaseAtt()).format()}</td>
			 <td colspan=3><img alt='Dégats en attaque :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' height='18' title='Dégat en attaque :' /> ${numeral(this._armeeLoge.getBaseAtt()).format()}</td>
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
			 <td>Dégats en Défense (AB)</td>
			 <td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' height='18' title='Dégats en défense :' /> ${numeral(this._armeeTdc.getTotalDef(armes)).format()}</td>
			 <td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' height='18' title='Dégats en défense :' /> ${numeral(this._armeeDome.getTotalDef(armes)).format()}</td>
			 <td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' height='18' title='Dégats en défense :' /> ${numeral(this._armeeLoge.getTotalDef(armes)).format()}</td>
			 </tr>
			 <tr align="center" class="def cursor" style="display:none;">
			 <td>Dégats en Défense (HB)</td>
			 <td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' height='18' title='Dégats en défense :' /> ${numeral(this._armeeTdc.getBaseDef()).format()}</td>
			 <td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' height='18' title='Dégats en défense :' /> ${numeral(this._armeeDome.getBaseDef()).format()}</td>
			 <td colspan=3><img alt='Dégat en défense :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' height='18' title='Dégats en défense :' /> ${numeral(this._armeeLoge.getBaseDef()).format()}</td>
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
			 <td colspan=3><img alt='Consommation Journalière' class='o_vAlign' src='images/icone/icone_pomme.gif' height='18' title='Consommation Journalière' /> ${numeral(this._armeeTdc.getConsommation(1)).format()}</td>
			 <td colspan=3><img alt='Consommation Journalière' class='o_vAlign' src='images/icone/icone_pomme.gif' height='18' title='Consommation Journalière' /> ${numeral(this._armeeDome.getConsommation(2)).format()}</td>
			 <td colspan=3><img alt='Consommation Journalière' class='o_vAlign' src='images/icone/icone_pomme.gif' height='18' title='Consommation Journalière' /> ${numeral(this._armeeLoge.getConsommation(3)).format()}</td>
			 </tr>`;
		$(".simulateur tr[align=center]:last").after(line);
	}
    /**
    *
    */
    afficheStatistique()
    {
        let bouclier = monProfil.niveauRecherche[1], armes = monProfil.niveauRecherche[2];
        $(".simulateur:first").after(`<br/><div id="o_statArmee" class="simulateur">
            <h3>Statistiques</h3>
            <table class="centre o_maxWidth" cellspacing=0>
                <tr class="ligne_paire gras"><td></td><td colspan="2">Non XP</td><td colspan="2">Total</td></tr>
                <tr class="gras"><td></td><td>HB</td><td>AB</td><td>HB</td><td>AB</td></tr>
                <tr class="ligne_paire"><td class="left"><img alt='Vie :' class='o_vAlign' src='images/icone/icone_coeur.gif' height='18' title='Vie' \> Vie</td><td>${numeral(this._armeeTdc.getNonXpBaseVie() + this._armeeDome.getNonXpBaseVie() + this._armeeLoge.getNonXpBaseVie()).format()}</td><td>${numeral(this._armeeTdc.getNonXpTotalVie(bouclier) + this._armeeDome.getNonXpTotalVie(bouclier) + this._armeeLoge.getNonXpTotalVie(bouclier)).format()}</td><td>${numeral(this._armeeTdc.getBaseVie() + this._armeeDome.getBaseVie() + this._armeeLoge.getBaseVie()).format()}</td><td>${numeral(this._armeeTdc.getTotalVie(bouclier, 0, 0) + this._armeeDome.getTotalVie(bouclier, 0, 0) + this._armeeLoge.getTotalVie(bouclier, 0, 0)).format()}</td></tr>
                <tr><td class="left"><img alt='Dégat en attaque :' class='o_vAlign' src='images/icone/icone_degat_attaque.gif' height='18' title='Dégat en attaque :' /> Attaque</td><td>${numeral(this._armeeTdc.getNonXpBaseAtt() + this._armeeDome.getNonXpBaseAtt() + this._armeeLoge.getNonXpBaseAtt()).format()}</td><td>${numeral(this._armeeTdc.getNonXpTotalAtt(armes) + this._armeeDome.getNonXpTotalAtt(armes) + this._armeeLoge.getNonXpTotalAtt(armes)).format()}</td><td>${numeral(this._armeeTdc.getBaseAtt() + this._armeeDome.getBaseAtt() + this._armeeLoge.getBaseAtt()).format()}</td><td>${numeral(this._armeeTdc.getTotalAtt(armes) + this._armeeDome.getTotalAtt(armes) + this._armeeLoge.getTotalAtt(armes)).format()}</td></tr>
                <tr class="ligne_paire"><td class="left"><img alt='Dégats en défense :' class='o_vAlign' src='images/icone/icone_degat_defense.gif' height='18' title='Dégats en défense :' /> Défense</td><td>${numeral(this._armeeTdc.getNonXpBaseDef() + this._armeeDome.getNonXpBaseDef() + this._armeeLoge.getNonXpBaseDef()).format()}</td><td>${numeral(this._armeeTdc.getNonXpTotalDef(armes) + this._armeeDome.getNonXpTotalDef(armes) + this._armeeLoge.getNonXpTotalDef(armes)).format()}</td><td>${numeral(this._armeeTdc.getBaseDef() + this._armeeDome.getBaseDef() + this._armeeLoge.getBaseDef()).format()}</td><td>${numeral(this._armeeTdc.getTotalDef(armes) + this._armeeDome.getTotalDef(armes) + this._armeeLoge.getTotalDef(armes)).format()}</td></tr>
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
        let dataEvo = JSON.parse(localStorage.getItem("outiiil_data")) || {};
        if(!dataEvo.hasOwnProperty("attaque") || dataEvo.attaque.length != listeAttaque.length || dataEvo.attaque[0]["cible"] != listeAttaque[0]["cible"] || listeAttaque[0]["exp"].diff(dataEvo.attaque[0]["exp"], 's') > 1){
            dataEvo.attaque = listeAttaque;
            dataEvo.startAttaque = moment();
            localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
            if(!Utils.comptePlus && $("#boiteComptePlus").length){
                this._boiteComptePlus.attaque = dataEvo.attaque;
                this._boiteComptePlus.startAttaque = dataEvo.startAttaque;
                this._boiteComptePlus.majAttaque();
            }
        }
	}
}
