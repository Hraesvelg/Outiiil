/*
 * Utilitaire.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe pour le gestion d'un utilitaire outiiil.
*
* @class Utilitaire
*/
class Utilitaire
{
    constructor()
    {
        /**
        * liste des commandes.
        *
        * @private
        * @property _commande
        * @type Object
        */
        this._commande = {};
        /**
        * liste des convois.
        *
        * @private
        * @property _convoi
        * @type Object
        */
        this._convoi = {};
        /**
        * liste des joueurs.
        *
        * @private
        * @property _joueurs
        * @type Object
        */
        this._monAlliance = null;
    }
    /**
    *
    */
    get commande()
    {
        return this._commande;
    }
    /**
    *
    */
    get convoi()
    {
        return this._convoi;
    }
    /*
    *
    */
    get alliance()
    {
        return this._monAlliance;
    }
    /*
    *
    */
    set alliance(newAlliance)
    {
        this._monAlliance = newAlliance;
    }
    /**
    *
    */
    getMembre()
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "callGetTopic",
                "xajaxargs[]" : monProfil.parametre["sujetMembre"].valeur,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    enregistreMembre()
    {
        let monAlliance = {tag : Utils.alliance, joueurs : {}, rangs : this._monAlliance.rangs};
        for(let j in this._monAlliance.joueurs)
            monAlliance.joueurs[j] = JSON.parse(JSON.stringify(this._monAlliance.joueurs[j], ["pseudo", "id", "x", "y", "rang", "libelle", "ordre"]));
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "envoiEditTopic",
                "xajaxargs[]" : "<xjxquery><q>IDTopic=" + monProfil.parametre["sujetMembre"].valeur + "&sujet=Membre&message=" + encodeURIComponent(JSON.stringify(monAlliance).replace(/{/g, "{ ").replace(/}/g, " }")) + "&modifiable=envoyer&send=Envoyer</q></xjxquery>",
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    getCommande()
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "callGetTopic",
                "xajaxargs[]" : monProfil.parametre["sujetCommande"].valeur,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    enregistreCommande()
    {
        // Mise à jour des commandes sur l'utilitaire (le forum)
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "envoiEditTopic",
                "xajaxargs[]" : "<xjxquery><q>IDTopic=" + monProfil.parametre["sujetCommande"].valeur + "&sujet=Demande&message=" + encodeURIComponent(JSON.stringify(this._commande).replace(/}/g, " }").replace(/{/g, "{ "))+ "&modifiable=envoyer&send=Envoyer</q></xjxquery>",
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    getConvoi()
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "callGetTopic",
                "xajaxargs[]" : monProfil.parametre["sujetConvoi"].valeur,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    enregistreConvoi()
    {
        // Nettoyage des convois finis
        for(let id in this._convoi)
            if(this._convoi[id].estTermine())
                delete this._convoi[id];
        // Enrengistrement des convois
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "envoiEditTopic",
                "xajaxargs[]" : "<xjxquery><q>IDTopic=" + monProfil.parametre["sujetConvoi"].valeur + "&sujet=Convoi&message=" + encodeURIComponent(JSON.stringify(this._convoi).replace(/{/g, "{ ").replace(/}/g, " }")) + "&modifiable=envoyer&send=Envoyer</q></xjxquery>",
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    getSujetForum(tag)
    {
        let data = JSON.parse(localStorage.getItem("outiiil_alliance")) || {};
		// Si des données sont deja presente et à jour on les charges
		return data.hasOwnProperty(tag) ? data[tag] : -1;
    }
    /**
    *
    */
    getInfoAlliance(idSujetForum)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "callGetTopic",
                "xajaxargs[]" : idSujetForum,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    enregistreAlliance(alliance)
    {
        let tmpAlliance = {tag : alliance.tag, joueurs : {}};
        for(let j in alliance.joueurs)
            tmpAlliance.joueurs[j] = JSON.parse(JSON.stringify(alliance.joueurs[j], ["pseudo", "id", "x", "y", "mv"]));
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "envoiNouveauSujet",
                "xajaxargs[]" : "<xjxquery><q>cat=" + monProfil.parametre["forumAlliance"].valeur + "&sujet=" + alliance.tag + "&message=" + encodeURIComponent(JSON.stringify(tmpAlliance).replace(/{/g, "{ ").replace(/}/g, " }")) + "&type=normal&modifiable=envoyer&send=Envoyer&question=&reponse[]=&reponse[]=&reponse[]=</q></xjxquery>",
                "xajaxr" : moment().valueOf()
            }
        });
    }
}

