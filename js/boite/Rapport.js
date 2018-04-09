/*
 * BoiteRapport.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant d'afficher un RC.
*
* @class BoiteRang
* @constructor
* @extends Boite
*/
class BoiteRapport extends Boite
{
    constructor(id, contenu)
    {
        super("o_boiteRapport" + id, "Rapport de combat", "<div class='o_contentRapport'>" + contenu + "</div>");
    }
	/**
    * Affiche la boite.
    *
    * @private
    * @method afficher
    */
	afficher()
	{
        if(super.afficher()){
            this.css().event();
        }
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

}
