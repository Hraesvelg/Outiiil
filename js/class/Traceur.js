/*
 * Traceur.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de gestion de traceur
*
* @class Traceur
*/
class Traceur
{
    /**
    *
    */
    constructor(type, etat, intervalle, nbPage)
    {
        /**
        *
        */
        this._etat = etat;
        /**
        *
        */
        this._type = type;
        /**
        *
        */
        this._intervalle = intervalle;
        /**
        *
        */
        this._nbPage = nbPage;
        /**
        *
        */
        this._data = {};
    }
    /**
    *
    */
    get etat()
    {
        return this._etat;
    }
    /**
    *
    */
    set etat(newEtat)
    {
        this._etat = newEtat;
    }
    /**
    *
    */
    get intervalle()
    {
        return this._intervalle;
    }
    /**
    *
    */
    set intervalle(newIntervalle)
    {
        this._intervalle = newIntervalle;
    }
    /**
    *
    */
    get nbPage()
    {
        return this._nbPage;
    }
    /**
    *
    */
    set nbPage(newNbPage)
    {
        this._nbPage = newNbPage;
    }
    /**
    *
    */
    get data()
    {
        return this._data;
    }
    /**
    *
    */
    set data(newData)
    {
        this._data = newData;
    }
    /**
    *
    */
    envoyerData()
    {
        return $.ajax({
            type : "post",
            url : "http://outiiil.fr/fzzz/traceur",
            data : {
                cle : monProfil.parametre["cleTraceur"].valeur,
                serveur : Utils.serveur,
                type : this._type,
                date : moment().format("DD-MM-YYYY HH:mm:ss"),
                data : this._data
            }
        });
    }
    /**
    *
    */
    getTempsAvantMAJ()
    {
        // on recupere le datetime dans le storage
        let dateHeureStorage = localStorage.getItem("outiiil_traceur_" + this._type);
        if(dateHeureStorage)
            return moment().isAfter(moment(dateHeureStorage, "DD-MM-YYYY HH:mm:ss")) ? 0 : parseInt(moment(dateHeureStorage, "DD-MM-YYYY HH:mm:ss").diff(moment()) / 1000);
        // si on a pas de dateheure en session on fait une mise à jour
        return 0;
    }
    /**
    *
    */
    parseJoueur(texte)
    {
        return texte.replace(/\[p\](.*?)\[\/p\]/g, "<a href='Membre.php?Pseudo=$1'>$1</a>");
    }
    /**
    *
    */
    parseAlliance(texte)
    {
        return texte.replace(/\[t\](.*?)\[\/t\]/g, "<a href='classementAlliance.php?alliance=$1'>$1</a>");
    }
}
