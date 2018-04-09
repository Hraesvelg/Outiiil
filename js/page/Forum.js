/*
 * Forum.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /alliance.php?forum_menu.
*
* @class PageForum
* @constructor
*/
class PageForum
{
    constructor()
    {
        // Récupération des données du forum pour communiquer.
        $("#alliance").on("DOMNodeInserted", (e) => {
            // selon la section on enregistre les id des topics
            let forum = $(e.currentTarget).find("span[class^='forum'][class$='ligne_paire']");
            switch(forum.html()){
                case "Outiiil_Alliance" :
                    // on verifie si on n'est dans un sujet mais bien sur la liste des topics
                    if($("#form_cat").length){
                        // on enregistre l'id de la section pour ajouter plus tard des nouvelles allis
                        if(!monProfil.parametre["forumAlliance"].valeur){
                            monProfil.parametre["forumAlliance"].valeur = forum.attr("class").match(/\d+/)[0];
                            monProfil.parametre["forumAlliance"].sauvegarde();
                        }
                        let allianceSuivi = {};
                        // on enregistre les sujets des alliances
                        $(e.currentTarget).find(".topic_forum").each((i, elt) => {
                            allianceSuivi[$(elt).text()] = $(elt).attr("onclick").match(/\d+/)[0];
                        });
                        // on sauvegarde si il y a eu un changement
                        localStorage.setItem("outiiil_alliance", JSON.stringify(allianceSuivi));
                    }
                    break;
                case "Outiiil_SDC" :
                    // on verifie si on n'est dans un sujet mais bien sur la liste des topics
                    if($("#form_cat").length){
                        if(!monProfil.parametre["sujetMembre"].valeur || !monProfil.parametre["sujetCommande"].valeur || !monProfil.parametre["sujetConvoi"].valeur){
                            // Si le forum courant est "Outiiil_SDC"
                            if($(".ligne_paire:contains('Outiiil_SDC')").length){
                                if($(".topic_forum:contains('Membre')").length){
                                    monProfil.parametre["sujetMembre"].valeur = $(".topic_forum:contains('Membre')").attr("onclick").match(/\d+/)[0];
                                    monProfil.parametre["sujetMembre"].sauvegarde();
                                }
                                if($(".topic_forum:contains('Demande')").length){
                                    monProfil.parametre["sujetCommande"].valeur = $(".topic_forum:contains('Demande')").attr("onclick").match(/\d+/)[0];
                                    monProfil.parametre["sujetCommande"].sauvegarde();
                                }
                                if($(".topic_forum:contains('Convoi')").length){
                                    monProfil.parametre["sujetConvoi"].valeur = $(".topic_forum:contains('Convoi')").attr("onclick").match(/\d+/)[0];
                                    monProfil.parametre["sujetConvoi"].sauvegarde();
                                }
                            }
                        }
                    }
                    break;
                default :
                    break;
            }
        });
    }
}
