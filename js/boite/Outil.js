/**
* Classe pour la gestion des différents outils globals à fourmizzz.
*
* @class Outil
* @constructor
* @extends Boite
*/
class Outil
{
    constructor()
    {
        /**
        *
        */
        this._html = `<div id="o_toolbarOutiiil" class="${monProfil.parametre.toolbarPosition.valeur == "1" ? "o_toolbarBas" : "o_toolbarDroite"}" ${monProfil.parametre.toolbarVisible.valeur == 1 ? "style='display:none'" : ""}>
            <div id="o_toolbarItem1" class="o_toolbarItem"><span id="o_itemPonte" style="background-image: url(${O_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem2" class="o_toolbarItem"><span id="o_itemChasse" style="background-image: url(${O_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem3" class="o_toolbarItem"><span id="o_itemCombat" style="background-image: url(${O_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem4" class="o_toolbarItem"><span id="o_itemParametre" style="background-image: url(${O_SPRITE_MENU})"/></div>
            </div>`;
        /**
        *
        */
        this._boitePonte = new BoitePonte();
        /**
        *
        */
        this._boiteChasse = new BoiteChasse();
        /**
        *
        */
        this._boiteCombat = new BoiteCombat();
        /**
        *
        */
        this._boiteParametre = new BoiteParametre();
    }
	/**
    * Affiche la boite.
    *
    * @private
    * @method afficher
    */
	afficher()
	{
        $("body").append(this._html);
        // selon la pref on cache l'element
        if(monProfil.parametre.toolbarVisible.valeur == "1"){
            $(document).mousemove((e) => {
                if(monProfil.parametre.toolbarPosition.valeur == "1"){ // boite en bas
                    if($(window).height() - e.pageY < 60)
                        $("#o_toolbarOutiiil").slideDown(500);
                    else
                        $("#o_toolbarOutiiil").slideUp(500);
                }else{ // boite à droite
                    if($(window).width() - e.pageX < 60)
                        $("#o_toolbarOutiiil").show("slide", {direction : "right"}, 500);
                    else
                        $("#o_toolbarOutiiil").hide("slide", {direction : "right"}, 500);
                }
            });
        }
        // evenement sur le clic d'un item de la boite d'outil
        $(".o_toolbarItem").click((e) => {
            // affichage de la boite
            switch($(e.currentTarget).find("span").attr("id")){
                case "o_itemPonte" :
                    this._boitePonte.afficher();
                    break;
                case "o_itemChasse" :
                    this._boiteChasse.afficher();
                    break;
                case "o_itemCombat" :
                    this._boiteCombat.afficher();
                    break;
                case "o_itemParametre" :
                    this._boiteParametre.afficher();
                    break;
                default :
                    break;
            }
        });
	}
}
