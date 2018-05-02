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
        this._dateSouhaite = parametres["dateSouhaite"] || null;
        /**
        * date à partir de quand livrer
        */
        this._dateApres = parametres["dateApres"] || null;
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
        /**
        * etat de la commande
        */
        this._etat = parametres["etat"] || ETAT_COMMANDE["Nouvelle"];
        /**
        * date de la derniere mise à jour
        */
        this._derniereMiseAJour = parametres["miseAJour"] || moment();
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
    get dernierMiseAJour()
    {
        return this._dernierMiseAJour;
    }
    /**
    *
    */
    set dernierMiseAJour(newDernier)
    {
        this._dernierMiseAJour = newDernier;
    }
    /**
    *
    */
    toUtilitaire()
    {
        return "[" + Object.keys(ETAT_COMMANDE).find(key => ETAT_COMMANDE[key] == this._etat) + "] " + this._demandeur.x + " / " + this._demandeur.y + " / " + EVOLUTION[this._evolution] + " / " + this._materiaux + " / " + this._nourriture + " / " + moment(this._dateSouhaite).format(("D MMM YYYY")) + (this._dateApres ? " / " + moment(this._dateApres).format(("D MMM YYYY")) : "");
    }
    /**
    *
    */
    parseUtilitaire(id, demandeur, etat, infos, dernierConvoi)
    {
        this._id = id;
        this._dateSouhaite = moment(infos[5], "D MMM YYYY");
        this._dateApres = infos.length > 6 ? moment(infos[6], "D MMM YYYY") : "";
        this._demandeur = new Joueur({pseudo : demandeur, x : infos[0], y : infos[1]});
        this._evolution = EVOLUTION.indexOf(infos[2]);
        this._nourriture = infos[4];
        this._materiaux = infos[3];
        this._etat = ETAT_COMMANDE[etat];
        this._derniereMiseAJour = moment(dernierConvoi, "D MMM [à] HH[h]mm");
        return this;
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
    estTermineRecent()
    {
        return this._derniereMiseAJour.isAfter(moment().subtract(1, 'days'));
    }
    /**
    *
    */
    estAFaire()
    {
        return !(this._etat == ETAT_COMMANDE["Supprimée"] || this._etat == ETAT_COMMANDE["Annulée"] || this._etat == ETAT_COMMANDE["Terminée"] || (this._etat == ETAT_COMMANDE["Nouvelle"] && this._demandeur.pseudo != monProfil.pseudo));
    }
    /**
    *
    */
    estValide()
    {
        if(this._nourriture && this._nourriture < 0)
            return "Quantité nourriture incorrecte.";
        if(this._materiaux && this._materiaux < 0)
            return "Quantité materiaux incorrecte.";
        if(!this._dateSouhaite.isValid())
            return "Date de la demande invalide.";
        if(this._dateApres && !moment(this._dateApres, "YYYY-MM-DD").isValid())
            return "Date de commencement livraison invalide.";
        return "";
    }
    /**
    *
    */
    toHTML()
    {
        let apres = !this._dateApres || moment().isSameOrAfter(moment(this._dateApres));
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
            html += `<td><img src="${IMG_CROIX}" alt='supprimer' title='Ne pas livrer avant le ${moment(this._dateApres).format("DD-MM-YYYY")}'/></td>`;
        // Etat
        html += `<td ${this._etat == ETAT_COMMANDE.Nouvelle ? "title='Un chef doit valider cette commande.'" : ""}>${Object.keys(ETAT_COMMANDE).find(key => ETAT_COMMANDE[key] === this._etat)}</td>`;
        // Temps de trajet
        html += `<td>${Utils.intToTime(monProfil.getTempsParcours2(this._demandeur))}</td>
            ${apres && this._etat == ETAT_COMMANDE["En cours"] ? "<td><a id='o_commande" + this._id + "' href=''><img src='" + IMG_LIVRAISON + "' alt='livrer'/></a></td>" : "<td></td>"}
            ${(this._demandeur.pseudo == monProfil.pseudo) ? "<td><a id='o_modifierCommande" + this._id + "' href=''><img src='" + IMG_CRAYON + "' alt='modifier'/></a> <a id='o_supprimerCommande" + this._id + "' href=''><img src='" + IMG_CROIX + "' alt='supprimer'/></a></td></tr>" : "<td></td></tr>"}`;
        return html;
    }
    /**
    *
    */
    ajouterEvent(page, utilitaire)
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
                this._etat = ETAT_COMMANDE.Supprimée;
                utilitaire.modifierSujet(this.toUtilitaire(), " ", this._id).then((data) => {
                    $.toast({...TOAST_INFO, text : "Commande supprimée avec succès."});
                    page.actualiserCommande();
                }, (jqXHR, textStatus, errorThrown) => {
                    $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la mise à jour des commandes."});
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
        // on retire la nourrtiure
        this._nourriture -= convoi.nourriture;
        if(this._nourriture < 0) this._nourriture = 0;
        // on retire les materiaux
        this._materiaux -= convoi.materiaux;
        if(this._materiaux < 0) this._materiaux = 0;
        // on met a jour le status
        if(!this._nourriture && !this._materiaux) this._etat = ETAT_COMMANDE.Terminée;
        return this;
    }
}
