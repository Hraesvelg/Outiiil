/*
 * BoiteRang.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant de modifier le rang d'un membre sur l'utilitaire.
*
* @class BoiteRang
* @constructor
* @extends Boite
*/
class BoiteRang extends Boite
{
    constructor(joueur, utilitaire, page)
    {
        super("o_boiteRang" + joueur.id, "Attribuer un rang", `<form id="o_form${joueur.id}" class="o_rangForm">
            <div class="group"><input id="o_libRang${joueur.id}" name="o_rang" type="text" class="o_input" value="${joueur.rang}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Rang de ${joueur.pseudo}</label></div>
            <div class="group"><input id="o_ordRang${joueur.id}" name="o_ordre" class="o_input" type="text" value="${joueur.ordreRang}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Prioritè du rang</label></div><br/>
            <button name="o_btnRang" class="o_button f_success">Valider</button>
            </form>`);
        /**
        *
        */
        this._joueur = joueur;
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
            this.css().event();
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
        $("#o_form" + this._joueur.id + " button[name='o_btnRang']").click((e) => {
            e.preventDefault();
            // on sauvegarde le rang du joueur
            this._joueur.rang = $("#o_libRang" + this._joueur.id).val();
            this._joueur.ordreRang = $("#o_ordRang" + this._joueur.id).val();
            this._utilitaire.alliance.joueurs[this._joueur.pseudo] = this._joueur;
            // mise a jour de forum
            this._utilitaire.modifierSujet(this._joueur.toUtilitaire(), " ", this._joueur.sujetForum).then((data) => {
                $.toast({...TOAST_INFO, text : "Mise à jour correctement effectuée."});
                this._page.actualiserMembre();
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la mise à jour des membres de l'alliance."});
            });
            this.masquer();
            return false;
        });
        return this;
	}
}
