/**
* Creer une boite radar pour la surveillance des joueurs/alliances.
*
* @class BoiteRadar
* @constructor
* @extends Boite
*/
class BoiteRadar
{
    constructor()
    {
        /**
        * Singleton : on affecte l'objet à l'instance globale
        */
        if(instanceBR) return instanceBR;
        instanceBR = this;
        /**
        *
        */
        this._joueurs = {};
        /**
        *
        */
        this._alliances = {};
        // on recupére les données
        this.getData();
    }
    /**
    *
    */
    get joueurs()
    {
        return this._joueurs;
    }
    /**
    *
    */
    set joueurs(newJoueurs)
    {
        this._joueurs = newJoueurs;
    }
    /**
    *
    */
    get alliances()
    {
        return this._alliances;
    }
    /**
    *
    */
    set alliances(newAlliances)
    {
        this._alliances = newAlliances;
    }
    /**
    *
    */
    ajouteJoueur(joueur)
    {
        this._joueurs[joueur.pseudo] = joueur;
    }
    /**
    *
    */
    supprimeJoueur(joueur)
    {
        delete this._joueurs[joueur.pseudo];
    }
    /**
    *
    */
    ajouteAlliance(alliance)
    {
        this._alliances[alliance.tag] = alliance;
    }
    /**
    *
    */
    supprimeAlliance(alliance)
    {
        delete this._alliances[alliance.tag];
    }
    /**
	* Récupére les données sur les joueurs sous surveillance.
    *
	* @method getRadar
	*/
	getData()
	{
		let data = JSON.parse(localStorage.getItem("outiiil_radar")) || {};
		// Si des données sont deja presente et à jour on les charges
        if(data.hasOwnProperty("joueurs"))
            for(let item in data.joueurs)
                this._joueurs[item] = new Joueur(data.joueurs[item]);
        if(data.hasOwnProperty("alliances"))
            for(let item in data.alliances)
                this._alliances[item] = new Alliance(data.alliances[item]);
	}
    /**
    *
    */
    toJSON()
    {
        let joueurs = {};
        for(let j in this._joueurs)
            joueurs[j] = JSON.parse(JSON.stringify(this._joueurs[j], ["pseudo", "id", "x", "y", "mv", "terrain"]));
        let alliances = {};
        for(let a in this._alliances)
            alliances[a] = JSON.parse(JSON.stringify(this._alliances[a], ["tag", "terrain"]));
        return {joueurs : joueurs, alliances : alliances};
    }
    /**
    *
    */
    sauvegarde()
    {
        localStorage.setItem("outiiil_radar", JSON.stringify(this));
        return this;
    }
	/**
	* Affiche la boie.
    *
	* @private
	* @method afficher
	*/
	afficher()
	{
        // si il y a des joueurs ou des alliances surveillés on affiche la boite
        if(Object.keys(this._joueurs).length || Object.keys(this._alliances).length){
            // Modification de la boite compte plus pour faire apparaitre la boite radar
            $("#boiteComptePlus .titre_colonne_cliquable").replaceWith(() => {return `<div class='titre_colonne_cliquable'><img src='images/icone/fleche-bas-claire.png' style='vertical-align:1px;' alt='changer' height='8'> <span class='titre_compte_plus'>Outiiil ${VERSION.substring(0, 2)}<span class='reduce'>${VERSION.substring(2)}</span></span> <img src='images/icone/fleche-bas-claire.png' style='vertical-align:1px;' alt='changer' height='8'></div>`;});
            // Event sur le titre si on utilise le radar
            $("#boiteComptePlus .titre_colonne_cliquable").click((e) => {
                if($(e.currentTarget).next().find("table:visible").attr("id"))
                    sessionStorage.setItem("boiteActive", "C");
                else
                    sessionStorage.setItem("boiteActive", "R");
                $("#boiteComptePlus .contenu_boite_compte_plus table").toggle();
            });
            // Remplissage de la boite
            this.actualise();
        }
        return this;
	}
	/**
	* Rafraichie la boite radar quand un element est inséré ou retiré.
    *
	* @private
	* @method actualiseBoite
	*/
	actualise()
	{
        let affiche = sessionStorage.getItem("boiteActive"), html = `<table id='o_radar' ${!affiche || affiche == "C" ? `style="display:none"` : ""}></table>`;
        // on remplace le contenu ou l'ajoute
        if($("#o_radar").length)
            $("#o_radar").replaceWith(html);
        else
            $("#boiteComptePlus .contenu_boite_compte_plus table").after(html);
        // Event pour mettre à jour les données d'un joueur ou une alliance
        $("#o_radar").off();
        // Affichage des joueurs
        for(let joueur in this._joueurs)
            this._joueurs[joueur].getLigneRadar(this, "o_radar");
        // Affichage des alliances
        for(let alliance in this._alliances)
            this._alliances[alliance].getLigneRadar(this, "o_radar");
        return this;
	}
}
