/*
 * Util.js
 * Hraesvelg
 **********************************************************************/

/**
 * Données globales du projet, de fourmizzz et des fonctions utilisables partout dans le code.
 *
 * @class Utils
 */
class Utils
{
    /**
    * Renvoie le serveur sur lequel joue le joueur.
    *
    * @static
    * @method serveur
    * @return {String} le serveur en cours.
    */
    static get serveur()
    {
        return location.hostname.split(".")[0].toUpperCase();
    }
    /**
    *
    */
    static get alliance()
    {
        return $("#tag_alliance").text();
    }
    /**
    * Renvoie si le joueur à du compte plus.
    *
    * @static
    * @method comptePlus
    * @return {Boolean} Vrai si le joueur a du compte plus, faux sinon.
    */
    static get comptePlus()
    {
        return $("#menuComptePlus a.boutonStatJoueur").length && $("#menuComptePlus a.boutonStatJoueur").text() == "Stat" ? true : false;
    }
    /**
    * Renvoie le terrain du joueur en cm².
    *
    * @static
    * @method tag
    * @return {Integer} le de nombre de cm².
    */
    static get terrain()
    {
        return parseInt($("#quantite_tdc").text());
    }
    /**
    * Renvoie le nombre d'ouvrières.
    *
    * @static
    * @method ouvrieres
    * @return {Integer} le nombre d'ouvriére.
    */
    static get ouvrieres()
    {
        return parseInt($("#nb_ouvrieres").text());
    }
    /**
    * Renvoie le nombre de nourritures en stock dans l'entrepot.
    *
    * @static
    * @method nourriture
    * @return {Integer} le quantité de nourritures.
    */
    static get nourriture()
    {
        return parseInt($("#nb_nourriture").text());
    }
    /**
    * Renvoie le nombre de materiaux en stock dans l'entrepot.
    *
    * @static
    * @method materiaux
    * @return {Integer} le quantité de materiaux.
    */
    static get materiaux()
    {
        return parseInt($("#nb_materiaux").text());
    }
    /**
    * Calcul des quantités de ressources commandées - fdthierry
    */
    static calculQuantite(evo_commande)
    {
        switch(true){
            // cas Champi
            case evo_commande == 0 :
                return [0, COUT_CONSTUCTION[evo_commande] * Math.pow(1.85, monProfil.niveauConstruction[evo_commande])];
            // cas construction
            case evo_commande > 0 && evo_commande < 13 :
                return [0, COUT_CONSTUCTION[evo_commande] * Math.pow(2, monProfil.niveauConstruction[evo_commande])];
            // cas recherche
            case evo_commande >= 13 && evo_commande < 23 :
                return [COUT_RECHERCHE_POM[evo_commande - 13] * Math.pow(2, monProfil.niveauRecherche[evo_commande - 13]), COUT_RECHERCHE_BOI[evo_commande - 13] * Math.pow(2, monProfil.niveauRecherche[evo_commande - 13])];
            default :
                return [0, 0];
        }
    }
    /**
    *
    */
    static arrondiQuantite(val)
    {
        if(val > 10000000000) return Math.floor(val / 1000000000) * 1000000000;
        if(val > 10000000) return Math.floor(val / 1000000) * 1000000;
        if(val > 1000) return Math.floor(val / 1000) * 1000;
        return val;
    }
	/**
	* Formate un nombre entier en temps.
    *
    * @static
	* @method intToTime
	* @param {Integer} val
	* @return {String} La chaine formatée.
	*/
	static intToTime(val)
	{
        return val ? moment.duration(val, 's').format("Y[A ]d[J ]h[h ]m[m ]s[s]").split(" ").filter((elt) => {return parseInt(elt);}).join(" ") : "0 sec";
	}
    /**
	* Convertit une chaine de caractere en entier.
    *
    * @static
	* @method timeToInt
	* @param {String} val
	* @return {Integer} le nombre de seconde correspondant la chaine.
	*/
	static timeToInt(val)
	{
		let regexp = new RegExp("((\\d+)J ?)?\s*((\\d+)h ?)?\s*((\\d+)m ?)?\s*((\\d+)s)?\s*", "i"), duree = 0, sec, minute, heure, jour;
		if(sec = val.replace(regexp, "$8"))
			duree += ~~sec;
		if(minute = val.replace(regexp, "$6"))
			duree += (~~minute * 60);
		if(heure = val.replace(regexp, "$4"))
			duree += (~~heure * 3600);
		if(jour = val.replace(regexp, "$2"))
			duree += (~~jour * 86400);
		return duree;
	}
    /**
	* Arrondie un temps à la minute.
    *
    * @static
	* @method roundMinute
	* @param {Object} temps
	* @return {Object} temps à arrondi a la minute supérieur.
	*/
	static roundMinute(temps)
	{
        return moment().add(temps, 's').add(1, "minute").startOf("minute");
	}
	/**
	* Decremente un chrono dynamique toutes les secondes.
	*
    * @static
	* @method decreaseTime
	* @param {Integer} time
	* @param {String} id
	* @return L'affichage du contenue de l'id est decrementé d'une seconde.
	*/
	static decreaseTime(time, id)
	{
		$("#" + id).text(this.intToTime(time));
		if(time > 0)
			setTimeout(() => {Utils.decreaseTime(time - 1, id);}, 1000);
	}
    /**
	* Incremente un chrono dynamique toutes les secondes.
	*
    * @static
	* @method incrementTime
	* @param {Integer} time
	* @param {String} id
    * @param {String} idRound
	* @return L'affichage du contenue de l'id est incrementé d'une seconde.
	*/
	static incrementTime(time, id, idRound = "")
	{
        let retour = moment().add(time, 's');
		$("#" + id).text(retour.format("D MMM à HH[h]mm[m]ss[s]"));
        if(idRound && retour.seconds() % 60 == 0) $("#" + idRound).text(Utils.roundMinute(time).format("D MMM à HH[h]mm"));
		setTimeout(() => {Utils.incrementTime(time, id, idRound);}, 1000);
	}
	/**
	* Réduit la taille d'une chaine de caractére qui représente une durée.
	*
    * @static
	* @method shortcutTime
	* @param {String} time
	* @return {String} La chaine coupée.
	*/
	static shortcutTime(time)
	{
		let tmp = this.intToTime(time).split(" ");
		if(tmp.length > 4)
			return tmp.splice(0, tmp.length - 3).join(" ");
		else if(tmp.length > 3)
			return tmp.splice(0, tmp.length - 2).join(" ");
		else if(tmp.length > 2)
			return tmp.splice(0, tmp.length - 1).join(" ");
		else
			return tmp.join(" ");
	}
	/**
	* Extrait les paramétres d'une URL.
	*
    * @static
	* @method extractUrlParams
	* @return {Array} La liste associatives des paramétres.
	*/
	static extractUrlParams()
	{
		let f = new Array(), t = location.search.substring(1).split('&');
		if(t != ''){
            for(let elt of t){
                let x = elt.split('=');
				f["" + x[0]] = "" + x[1];
            }
		}
		return f;
	}
    /**
    *
    */
    static extraitRecherche(data, joueur = true, alliance = true)
    {
        let element = new Array(), cptJ = alliance ? 3 : 6, cptA = joueur ? 3 : 6;
        // si la recherche renvoi ne renvoi qu'un resultat on tombe sur un profil de joueur
        if($(data).find("h2").length){
            let pseudo = $(data).find("h2").text();
            element.push({value : pseudo, value_avec_html : pseudo, url : "Membre.php?Pseudo=" + pseudo});
        }else{
            $(data).find(".simulateur:eq(0) tr").each((i, elt) => {
                // les joueurs et les alli ont 6 cellules
                if($(elt).find("td").length == 6){
                    let cellule = $(elt).find("td:eq(1) a"), lien = cellule.attr("href"), nom = cellule.text();
                    // c'est un joueur si on trouve un lien de profil cellule 2
                    if(joueur && lien.includes("Membre.php") && cptJ){
                        element.push({value : nom, value_avec_html : nom, url : "Membre.php?Pseudo=" + nom});
                        cptJ--;
                    }
                    // c'est une alliance
                    if(alliance && lien.includes("classementAlliance.php") && cptA){
                        let tag = $(elt).find("td:eq(0)").text();
                        element.push({value : nom, value_avec_html : `<span style="white-space:nowrap;"><strong>${tag}</strong> ${nom}</span>`, tag : tag, url : "classementAlliance.php?alliance=" + tag});
                        cptA--;
                    }
                }
            });
        }
        return element;
    }
}
