/*
 * Boite.js
 * Hraesvelg
 **********************************************************************/

/**
 * Classe abstraite pour la creation de boite.
 *
 * @class Boite
 * @constructor
 */
class Boite
{
    constructor(idBoite, titre, content = "")
    {
        /**
        * id de la boite.
        *
        * @private
        * @property titre
        * @type string
        */
        this._id = idBoite;
        /**
        * titre de la boite.
        *
        * @private
        * @property titre
        * @type string
        */
        this._titre = titre;
        /**
        * Contenue html de la boite.
        *
        * @private
        * @property content
        * @type string
        */
        this._content = content;
    }
    /**
    * Supprime la boite.
    *
    * @private
    * @method desctructor
    */
    destructor()
    {
        $("#" + this._id).remove();
    }
    /**
    * Affiche la boite.
    *
    * @private
    * @method afficher
    */
    afficher()
    {
        let bCreate = false;
        if(!$("#" + this._id).length){
            $("body").append(`<div id='${this._id}' class='o_content'><span class='o_titre'>${this._titre}</span><div id="${this._id}Close" class='o_close'><b/><b/><b/><b/></div>${this._content}</div>`);
            $("#" + this._id)
                .css({top : (Math.random() * 100 + 50) + "px", left : (Math.random() * 250 + 100) + "px"})
                .draggable({handle: ".o_titre", stack : "div"});
            bCreate = true;
        }
        $("#" + this._id).show(EFFET[monProfil.parametre["boiteShow"].valeur].toLowerCase(), () => {
            $(".o_content").css({
                "background-color" : monProfil.parametre["couleur1"].valeur,
                "border-color" : monProfil.parametre["couleur3"].valeur
            });
        });
        return bCreate;
    }
    /**
	* Cache la boite avec un effet de slide.
    *
	* @private
	* @method masquer
	*/
    masquer()
    {
        $("#" + this._id).hide(EFFET[monProfil.parametre["boiteHide"].valeur].toLowerCase());
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
        $(".o_titre").css("color", monProfil.parametre["couleurTitre"].valeur);
        $(".o_content").css({
            "background-color" : monProfil.parametre["couleur1"].valeur,
            "border-color" : monProfil.parametre["couleur3"].valeur
        });
        $(".o_close b:nth-child(1)").css("border-top-color", monProfil.parametre["couleur1"].valeur);
        $(".o_close b:nth-child(2)").css("border-left-color", monProfil.parametre["couleur1"].valeur);
        $(".o_close b:nth-child(3)").css("border-bottom-color", monProfil.parametre["couleur1"].valeur);
        $(".o_close b:nth-child(4)").css("border-right-color", monProfil.parametre["couleur1"].valeur);
        $(".o_close").css("background-color", monProfil.parametre["couleur2"].valeur).hover(
            (e) => {$(e.currentTarget).animate({"background-color" : "#bb3333"}, 400);},
            (e) => {$(e.currentTarget).animate({"background-color" : monProfil.parametre["couleur2"].valeur}, 400);}
		);
        $(".o_tabs > .ui-widget-header").css("border-bottom-color", monProfil.parametre["couleur2"].valeur);
        $(".o_content p, .o_content .o_label, .o_content label, .o_content table").css("color", monProfil.parametre["couleurTexte"].valeur);
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
        $("#" + this._id + "Close").click((e) => {this.masquer();});
        return this;
	}
}
