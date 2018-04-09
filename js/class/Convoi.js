/*
 * Convoi.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe pour creer et gérer un convoi
*
* @class Convoi
*/
class Convoi
{
    constructor(parametres)
    {
        /**
        * id du convoi
        */
        this._id = parametres["id"] || moment().valueOf();
        /**
        * qui envoie le convoi
        */
        this._expediteur = parametres["expediteur"];
        /**
        * qui recoit les ressources
        */
        this._destinataire = parametres["destinataire"];
        /**
        * quantité livrée
        */
        this._nourriture = parametres["nourriture"] || 0;
        /**
        * quantité livrée
        */
        this._materiaux = parametres["materiaux"] || 0;
        /**
        * id de la commande pour le convoi
        */
        this._idCommande = parametres["idCommande"] || -1;
        /**
        * date d'arrivée du convoi
        */
        this._dateArrivee = parametres["dateArrivee"];
    }
    /**
    *
    */
    get id()
    {
        return this._id;
    }
    /**
    *
    */
    set id(newId)
    {
        this._id = newId;
    }
    /**
    *
    */
    get expediteur()
    {
        return this._expediteur;
    }
    /**
    *
    */
    set expediteur(newExpediteur)
    {
        this._expediteur = newExpediteur;
    }
    /**
    *
    */
    get destinataire()
    {
        return this._destinataire;
    }
    /**
    *
    */
    set destinataire(newDestinataire)
    {
        this._destinataire = newDestinataire;
    }
    /**
    *
    */
    get nourriture()
    {
        return this._nourriture;
    }
    /**
    *
    */
    set nourriture(newNourriture)
    {
        this._nourriture = newNourriture;
    }
    /**
    *
    */
    get materiaux()
    {
        return this._materiaux;
    }
    /**
    *
    */
    set materiaux(newMateriaux)
    {
        this._materiaux = newMateriaux;
    }
    /**
    *
    */
    get idCommande()
    {
        return this._idCommande;
    }
    /**
    *
    */
    set idCommande(newIdCommande)
    {
        this._idCommande = newIdCommande;
    }
    /**
    *
    */
    get dateArrivee()
    {
        return this._dateArrivee;
    }
    /**
    *
    */
    set dateArrivee(newArrivee)
    {
        this._dateArrivee = newArrivee;
    }
    /**
    * override JSON
    */
    toJSON()
    {
        return {id : this._id, expediteur : this._expediteur, destinataire : this._destinataire, nourriture : this._nourriture, materiaux : this._materiaux, idCommande : this._idCommande, dateArrivee : this._dateArrivee};
    }
    /**
    *
    */
    toHTML(id)
    {
        // Si le convoi m'est destiné et que le datetime d'arrivée n'est pas dépassé
        let tempsRestant = moment(this._dateArrivee).diff(moment()) / 1000;
        $(id).after(`<strong>- Vous allez recevoir ${numeral(this._nourriture).format()} <img height='18' src='images/icone/icone_pomme.gif'/> et ${numeral(this._materiaux).format()} <img height='18' src='images/icone/icone_bois.gif'/> de <a href="Membre.php?Pseudo=${this._expediteur}">${this._expediteur}</a> dans <span id='convoi_${this._id}'>${Utils.intToTime(tempsRestant)}</span></strong> - <small>Retour le ${Utils.roundMinute(tempsRestant).format("D MMM YYYY à HH[h]mm")}</small><br/>`);
        Utils.decreaseTime(moment(this._dateArrivee).diff(moment()) / 1000, "convoi_" + this._id);
        return this;
    }
    /**
    *
    */
    estDestinataire()
    {
        return this._destinataire == Utils.pseudo;
    }
    /**
    *
    */
    estTermine()
    {
        return moment(this._dateArrivee).diff(moment()) < 0;
    }
}
