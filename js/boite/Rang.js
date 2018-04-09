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
        super("o_boiteRang" + joueur.id, "Attribuer un rang");
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
        let form = `<form id="o_form${this._joueur.id}" class="o_rangForm">
            <div class="group"><input id="o_libRang${this._joueur.id}" name="o_rang" type="text" class="o_input" value="${this._joueur.rang.libelle}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Rang de ${this._joueur.pseudo}</label></div>
            <div class="group"><input id="o_ordRang${this._joueur.id}" name="o_ordre" class="o_input" type="text" value="${this._joueur.rang.ordre}" required/><span class="o_inputHighlight"></span><span class="o_inputBar"></span><label class='o_label'>Prioritè du rang</label></div><br/>
            <button name="o_btnRang" class="o_button f_success">Valider</button>
            </form>`;
        $("#o_boiteRang" + this._joueur.id).append(form);
        // event
        $("#o_libRang" + this._joueur.id).autocomplete({
            minLength : 0,
            source : this._utilitaire.alliance.rangs.map((r) => {return r.libelle;}).sort((a, b) => {return b < a}),
            classes : {"ui-autocomplete" : "o_autocomplete"},
            select : (e, ui) => {
                let rg = this._utilitaire.alliance.chercheRang(ui.item.label);
                if(rg) $("#o_ordRang" + this._joueur.id).val(rg.ordre);
            }
        }).on("focus", (e) => {$(e.currentTarget).autocomplete("search");});
        $("#o_form" + this._joueur.id + " button[name='o_btnRang']").click((e) => {
            e.preventDefault();
            let newRang = new Rang($("#o_libRang" + this._joueur.id).val(), $("#o_ordRang" + this._joueur.id).val());
            // on sauvegarde le rang du joueur
            this._utilitaire.alliance.joueurs[this._joueur.pseudo].rang = newRang;
            // on ajoute le rang à la liste des rangs de l'alliance
            this._utilitaire.alliance.ajouteRang(newRang);
            // mise a jour de forum
            this._utilitaire.enregistreMembre().then((data) => {
                $.toast({...TOAST_INFO, text : "Mise à jour correctement effectuée."});
                this._page.actualiserMembre();
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de la mise à jour des membres de l'alliance."});
            });
            this.masquer();
            return false;
        });
        return this;
    }
}
