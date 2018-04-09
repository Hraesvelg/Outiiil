/*
 * BoiteCommande.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant d'ajouter et modifier une commande.
*
* @class BoiteCommande
* @constructor
* @extends Boite
*/
class BoiteCommande extends Boite
{
    constructor(commande, utilitaire, page)
    {
        super("o_boiteCommande" + commande.id, "Commander des ressources");
        /**
        *
        */
        this._commande = commande;
        /**
        *
        */
        this._utilitaire = utilitaire;
        /**
        *
        */
        this._page = page;
    }
	/**
    * Affiche la boite.
    *
    * @private
    * @method afficher
    */
	afficher()
	{
        if(super.afficher())
            this.getForm().css().event();
        return this;
	}
	/**
	* Applique le style propre à la boite.
    *
	* @private
	* @method css
	*/
	css()
	{
        super.css();
        return this;
    }
	/**
	* Ajoute les evenements propres à la boite.
    *
	* @private
	* @method event
	*/
	event()
	{
        super.event();
        return this;
	}
    /**
    *
    */
    getForm()
    {
        let select = "", evolution = [...CONSTRUCTION, ...RECHERCHE, "Nourriture", "Materiaux"], qte = Utils.calculQuantite(0);
        for(let i = 0 ; i < evolution.length ; select += `<option value="${i}" ${i == this._commande.evolution ? "selected" : ""}>${evolution[i++]}</option>`);
        $("#o_boiteCommande" + this._commande.id).append(`<div class="o_commandeForm"><form id="o_form${this._commande.id}">
            <div class="group"><select name="o_evolution" class="o_input" required>${select}</select><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Evolution</label></div>
            <div class="group"><input name="o_quantiteNou" class="o_input" type="text" value="${this._commande.nourriture ? this._commande.nourriture : (qte[0] ? numeral(qte[0]).format() : 0)}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Nourriture</label></div>
            <div class="group"><input name="o_quantiteMat" class="o_input" type="text" value="${this._commande.materiaux ? this._commande.materiaux : (qte[1] ? numeral(qte[1]).format() : 0)}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Materiaux</label></div>
            <div class="group"><input name="o_dateCommande" class="o_input" type="text" value="${this._commande.dateSouhaite}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Pour le*</label></div>
            <div class="group"><input name="o_dateApres" class="o_input" type="text" value="${this._commande.dateApres ? this._commande.dateApres : ""}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>&Agrave; Partir du</label></div>
            <br/><button id="o_commander${this._commande.id}" name="o_btnCommande" class="o_button f_success">Commander</button>
            </form></div>`);
        $("input[name='o_dateCommande'], input[name='o_dateApres']").datepicker({minDate : new Date(), dateFormat : "yy-mm-dd"});
        // si la commande est en ajout on autocomplete les champs en fonction de l'evo
        if(!this._utilitaire.commande.hasOwnProperty(this._commande.id))
            $("#o_form" + this._commande.id + " select[name='o_evolution']").change((e) => {
                let qte = Utils.calculQuantite(parseInt(e.currentTarget.value));
                $("#o_form" + this._commande.id + " input[name='o_quantiteNou']").val(numeral(qte[0]).format());
                $("#o_form" + this._commande.id + " input[name='o_quantiteMat']").val(numeral(qte[1]).format());
            });
        $("#o_commander" + this._commande.id).click((e) => {
            e.preventDefault();
            this._commande.evolution = $("#o_form" + this._commande.id + " select[name='o_evolution']").val();
            let qteNourriture = numeral($("#o_form" + this._commande.id + " input[name='o_quantiteNou']").val()).value();
            let qteMateriaux = numeral($("#o_form" + this._commande.id + " input[name='o_quantiteMat']").val()).value();
            let dateDemande = moment($("#o_form" + this._commande.id + " input[name='o_dateCommande']").val(), "YYYY-MM-DD");
            let dateApres = $("#o_form" + this._commande.id + " input[name='o_dateApres']").val();
            let message = this.verifierCommande(qteNourriture, qteMateriaux, dateDemande, dateApres);
            if(!message){
                this._commande.nourriture = qteNourriture;
                this._commande.materiaux = qteMateriaux;
                this._commande.dateSouhaite = dateDemande;
                this._commande.dateApres = moment(dateApres, "YYYY-MM-DD");
                let action = this._utilitaire.commande.hasOwnProperty(this._commande.id) ? "MODIF" : "AJOUT";
                this._utilitaire.commande[this._commande.id] = this._commande;
                this._utilitaire.enregistreCommande().then((data) => {
                    // si la commande est deja dans l'utilitaire c'est qu'on la modifie sinon c'est un ajout
                    if(action == "MODIF")
                        $.toast({...TOAST_INFO, text : "Commande mise à jour avec succès."});
                    else
                        $.toast({...TOAST_SUCCESS, text : "Commande ajoutée avec succès."});
                    this._page.actualiserCommande();
                }, (jqXHR, textStatus, errorThrown) => {
                     $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de la mise à jour des commandes."});
                });
                this.masquer();
            }else
                $.toast({...TOAST_ERROR, text : message});
            return false;
        });
        return this;
    }
    /**
    *
    */
    verifierCommande(qteNourriture, qteMateriaux, dateDemande, dateApres)
    {
        if(qteNourriture && qteNourriture < 0)
            return "Quantité nourriture incorrecte.";
        if(qteMateriaux && qteMateriaux < 0)
            return "Quantité materiaux incorrecte.";
        if(!dateDemande.isValid())
            return "Date de la demande invalide.";
        if(dateApres && !moment(dateApres, "YYYY-MM-DD").isValid())
            return "Date de commencement livraison invalide.";
        return "";
    }
}
