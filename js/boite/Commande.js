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
        $("input[name='o_dateCommande'], input[name='o_dateApres']").datepicker({...DATEPICKER_OPTION, minDate : new Date(), dateFormat : "dd-mm-yy"});
        // si la commande est en ajout on autocomplete les champs en fonction de l'evo
        if(!this._utilitaire.commande.hasOwnProperty(this._commande.id))
            $("#o_form" + this._commande.id + " select[name='o_evolution']").change((e) => {
                let qte = Utils.calculQuantite(parseInt(e.currentTarget.value));
                $("#o_form" + this._commande.id + " input[name='o_quantiteNou']").val(numeral(qte[0]).format());
                $("#o_form" + this._commande.id + " input[name='o_quantiteMat']").val(numeral(qte[1]).format());
            });
        $("#o_form" + this._commande.id + " input[name^='o_quantite']").on("input", (e) => {
            return $(e.currentTarget).val(numeral($(e.currentTarget).val()).format());
        });
        $("#o_commander" + this._commande.id).click((e) => {
            e.preventDefault();
            this._commande.evolution = $("#o_form" + this._commande.id + " select[name='o_evolution']").val();
            this._commande.nourriture = numeral($("#o_form" + this._commande.id + " input[name='o_quantiteNou']").val()).value();
            this._commande.materiaux = numeral($("#o_form" + this._commande.id + " input[name='o_quantiteMat']").val()).value();
            this._commande.dateSouhaite = moment($("#o_form" + this._commande.id + " input[name='o_dateCommande']").val(), "DD-MM-YYYY");
            let dateApres = $("#o_form" + this._commande.id + " input[name='o_dateApres']").val();
            this._commande.dateApres = dateApres ? moment($("#o_form" + this._commande.id + " input[name='o_dateApres']").val(), "DD-MM-YYYY") : null;
            let message = this._commande.estValide();
            if(!message){
                // si la commande n'est pas dans l'utilitaire on est en ajout
                if(!this._utilitaire.commande.hasOwnProperty(this._commande.id)){
                    // si la commande n'est pas dans l'utilitaire c'est un ajout
                    this._utilitaire.creerSujet(this._commande.toUtilitaire(), " ", monProfil.parametre["forumCommande"].valeur).then((data) => {
                        let response = $(data).text();
                        if(response.includes("Accès refusé."))
                            $.toast({...TOAST_WARNING, text : response + " Vous n'avez pas les droits de créer de commandes."});
                        else{
                            $.toast({...TOAST_SUCCESS, text : "Commande ajoutée avec succès."});
                            this._utilitaire.commande[this._commande.id] = this._commande;
                            this._page.actualiserCommande();
                        }
                    }, (jqXHR, textStatus, errorThrown) => {
                         $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de l'ajout de votre commande."});
                    });
                }else{
                    // si la commande est deja dans l'utilitaire c'est qu'on la modifie sinon c'est un ajout
                    this._utilitaire.modifierSujet(this._commande.toUtilitaire(), " ", this._commande.id).then((data) => {
                        $.toast({...TOAST_INFO, text : "Commande mise à jour avec succès."});
                        this._utilitaire.commande[this._commande.id] = this._commande;
                        this._page.actualiserCommande();
                    }, (jqXHR, textStatus, errorThrown) => {
                         $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la mise à jour des commandes."});
                    });
                }
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
    getForm()
    {
        let select = "", qte = Utils.calculQuantite(0);
        for(let i = 0 ; i < EVOLUTION.length ; select += `<option value="${i}" ${i == this._commande.evolution ? "selected" : ""}>${EVOLUTION[i++]}</option>`);
        $("#" + this._id).append(`<div class="o_commandeForm"><form id="o_form${this._commande.id}">
            <div class="group"><select name="o_evolution" class="o_input" required>${select}</select><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Evolution</label></div>
            <div class="group"><input name="o_quantiteNou" class="o_input" type="text" value="${this._commande.nourriture ? numeral(this._commande.nourriture).format() : (qte[0] ? numeral(qte[0]).format() : 0)}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Nourriture</label></div>
            <div class="group"><input name="o_quantiteMat" class="o_input" type="text" value="${this._commande.materiaux ? numeral(this._commande.materiaux).format() : (qte[1] ? numeral(qte[1]).format() : 0)}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Materiaux</label></div>
            <div class="group"><input name="o_dateCommande" class="o_input" type="text" value="${this._commande.dateSouhaite ? moment(this._commande.dateSouhaite).format("DD-MM-YYYY") : ""}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Pour le*</label></div>
            <div class="group"><input name="o_dateApres" class="o_input" type="text" value="${this._commande.dateApres ? moment(this._commande.dateApres).format("DD-MM-YYYY") : ""}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>&Agrave; Partir du</label></div>
            <br/><button id="o_commander${this._commande.id}" name="o_btnCommande" class="o_button f_success">Commander</button>
            </form></div>`);
        return this;
    }
}
