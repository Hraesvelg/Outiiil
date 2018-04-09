/*
 * Commande.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe pour creer et gérer une commande
*
* @class Commande
*/
class Commande
{
    constructor(parametres = {})
    {
        /**
        * id de la commande
        */
        this._id = parametres["id"] || moment().valueOf();
        /**
        * date de la commande
        */
        this._dateCommande = parametres["dateCommande"] || moment();
        /**
        * date à laquelle on souhaite être livré
        */
        this._dateSouhaite = parametres["dateSouhaite"] || "";
        /**
        * date à partir de quand livrer
        */
        this._dateApres = parametres["dateApres"] || "";
        /**
        * personne qui fait la commande
        */
        this._demandeur = parametres.hasOwnProperty("demandeur") ? new Joueur(parametres["demandeur"]) : monProfil;
        /**
        * contruction ou recherche demanndée
        */
        this._evolution = parametres["evolution"] || -1;
        /**
        * materiaux ou nourriture
        */
        this._nourriture = parametres["nourriture"] || 0;
        /**
        * quantité restante à livrer
        */
        this._materiaux = parametres["materiaux"] || 0;
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
    get dateCommande()
    {
        return this._dateCommande;
    }
    /**
    *
    */
    set dateCommande(newDate)
    {
        this._dateCommande = newDate;
    }
    /**
    *
    */
    get dateSouhaite()
    {
        return this._dateSouhaite;
    }
    /**
    *
    */
    set dateSouhaite(newDate)
    {
        this._dateSouhaite = newDate;
    }
    /**
    *
    */
    get dateApres()
    {
        return this._dateApres;
    }
    /**
    *
    */
    set dateApres(newDate)
    {
        this._dateApres = newDate;
    }
    /**
    *
    */
    get demandeur()
    {
        return this._demandeur;
    }
    /**
    *
    */
    set demandeur(newJoueur)
    {
        this._demandeur = newJoueur;
    }
    /**
    *
    */
    get evolution()
    {
        return this._evolution;
    }
    /**
    *
    */
    set evolution(newEvo)
    {
        this._evolution = newEvo;
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
    * override JSON
    */
    toJSON()
    {
        let maCommande = {id : this._id, dateCommande : this._dateCommande, demandeur : {pseudo : this._demandeur.pseudo, x : this._demandeur.x, y : this._demandeur.y}};
        if(this._evolution) maCommande.evolution = numeral(this._evolution).value();
        if(this._dateSouhaite) maCommande.dateSouhaite = this._dateSouhaite;
        if(this._dateApres) maCommande.dateApres = this._dateApres;
        if(this._nourriture) maCommande.nourriture = numeral(this._nourriture).value();
        if(this._materiaux) maCommande.materiaux = numeral(this._materiaux).value();
        return maCommande;
    }
    /**
    *
    */
    estHorsTard()
    {
        return moment().diff(moment(this._dateSouhaite), "days") > 0;
    }
    /**
    *
    */
    getAttente()
    {
        return moment().diff(moment(this._dateSouhaite), "days");
    }
    /**
    *
    */
    estTermine()
    {
        return !this._nourriture && !this._materiaux;
    }
    /**
    *
    */
    toHTML()
    {
        let apres = !this._dateApres || moment().diff(moment(this._dateApres), "days") >= 0;
        let html = `<tr data="${this._id}">
            <td>${this._demandeur.getLienFourmizzz()}</a></td><td>${numeral(this._nourriture).format()}</td><td class='right'>${numeral(this._materiaux).format()}</td>
            <td>${moment(this._dateSouhaite).format("D MMM YYYY")}</td>`;
        if(apres){
            let attente = this.getAttente();
            switch(true){
                case attente > 0 :
                    html += `<td><img src='images/icone/3rondrouge.gif'/></td>`;
                    break;
                case attente > -3 :
                    html += `<td><img src='images/icone/2rondorange.gif'/></td>`;
                    break;
                default :
                    html += `<td><img src='images/icone/1rondvert.gif'/></td>`;
                    break;
            }
        }else
            html += `<td><img src="${O_CROIX}" alt='supprimer' title='Ne pas livrer avant le ${moment(this._dateApres).format("DD-MM-YYYY")}'/></td>`;
        // Temps de trajet
        html += `<td>${Utils.intToTime(this._demandeur.getTempsParcours())}</td>
            ${apres ? "<td><a id='o_commande" + this._id + "' href=''><img src='" + O_LIVRAISON + "' alt='livrer'/></a></td>" : "<td></td>"}
            ${(this._demandeur.pseudo == Utils.pseudo) ? "<td><a id='o_modifierCommande" + this._id + "' href=''><img src='" + O_CRAYON + "' alt='modifier'/></a> <a id='o_supprimerCommande" + this._id + "' href=''><img src='" + O_CROIX + "' alt='supprimer'/></a></td></tr>" : "<td></td></tr>"}`;
        return html;
    }
    /**
    *
    */
    ajouteEvent(page, utilitaire)
    {
        $("#o_commande" + this._id).click((e) => {
            let livraison = Math.floor((Utils.ouvrieres - Utils.terrain) * (10 + (monProfil.niveauConstruction[11] / 2))),
                max = livraison && livraison > Utils.materiaux ? Utils.materiaux : livraison;
            if(this._materiaux < max){
                $("#input_nbMateriaux").val(numeral(this._materiaux).format());
                $("#nbMateriaux").val(this._materiaux);
                max -= this._materiaux;
                $("#input_nbNourriture").val(numeral(this._nourriture < max ? this._nourriture : max).format());
                $("#nbNourriture").val(this._nourriture < max ? this._nourriture : max);
            }else{
                $("#input_nbMateriaux").val(numeral(max).format());
                $("#nbMateriaux").val(max);
            }
            $("#pseudo_convoi").val(this._demandeur.pseudo);
            $("#o_idCommande").val(this._id);
            $("html").animate({scrollTop : 0}, 600);
            return false;
        });
        $("#o_modifierCommande" + this._id).click((e) => {
            let boiteCommande = new BoiteCommande(this, utilitaire, page);
            boiteCommande.afficher();
            return false;
        });
        $("#o_supprimerCommande" + this._id).click((e) => {
            if(confirm("Supprimer cette commande ?")){
                delete utilitaire.commande[this._id];
                utilitaire.enregistreCommande().then((data) => {
                    $.toast({...TOAST_INFO, text : "Commande supprimée avec succès."});
                    page.actualiserCommande();
                }, (jqXHR, textStatus, errorThrown) => {
                    $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de la mise à jour des commandes."});
                });
            }
            return false;
        });
    }
    /**
    *
    */
    ajouteConvoi(convoi)
    {
        this._nourriture -= convoi.nourriture;
        if(this._nourriture < 0)
            this._nourriture = 0;
        this._materiaux -= convoi.materiaux;
        if(this._materiaux < 0)
            this._materiaux = 0;
        return this;
    }
}
