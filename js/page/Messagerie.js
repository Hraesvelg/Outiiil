/*
 * Messagerie.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /messagerie.php.
*
* @class PageMessagerie
* @constructor
*/
class PageMessagerie
{
    constructor()
    {
        /**
        * Liste des messages analysés.
        */
        this._messagesOuvert = {};
        /**
        * Connexion à l'utilitaire.
        */
        this._utilitaire = new PageForum();
    }
    /**
    *
    */
    executer()
    {
        // ajout des boutons pour les nouveaux messages
        if(!Utils.comptePlus) this.plus(0);
        // recupération des joueurs de l'utilitaire
        if(monProfil.parametre["forumMembre"].valeur){
            // recuperation des commandes sur l'utilitaire
            this._utilitaire.consulterSection(monProfil.parametre["forumMembre"].valeur).then((data) => {
                if(this._utilitaire.chargerJoueur(data)) this.couleurMessageUtilitaire();
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la récupération des membres."});
            });
        }else
            this.couleurMessage();
        // Evenement lorsque de nouveaux elements sont affiches
        this.analyseMessage();
        return this;
    }
    /**
    *
    */
    analyseMessage()
    {
        // Listener pour l'ouverture des rapports de combat ou de chasse.
        $("#corps_messagerie").on("DOMNodeInserted", (e) => {
            // Si on ouvre le message pour la première fois
            if($(e.target).hasClass("contenu_conversation")){
                // correction pour chrome
                $(".message").removeAttr("colspan");
                let titreMess = $(e.target).prev().prev().find(".td_objet").text();
                // Si on est sur des rapports des chasses
                if(titreMess.includes("chasseuses ont conquis")){
                    let conv = $(e.target).prev().prev().attr("id").split("_")[1];
                    $(e.target).find(".message").each((i, elt) => {this.analyseChasse(conv, $(elt).parent().attr("id"), $(elt).text());});
                    // on affiche un bilan que lorsqu'il y a plus d'une chasse
                    if($(e.target).find(".message").length > 1) this.analyseChasses(conv);
                // Si on est sur des rapports de combat
                }else if(titreMess.includes("Attaque réussie") || titreMess.includes("Attaque échouée") || titreMess.includes("Invasion") || titreMess.includes("Rebellion")){
                    $(e.target).find(".message").each((i, elt) => {this.analyseCombat($(elt).parent().attr("id"), $(elt).prev().text(), $(elt).text());});
                    this.optionMessage($(e.target).find(".message:first").parent().attr("id"));
                }
                // Ajout des balises de mise en forme pour envoyer des messages
                if($(e.target).find("div[id^='champ_bbcode_']").length && !Utils.comptePlus)
                    this.plus($(e.target).find("div[id^='champ_bbcode_']").attr("id").match(/\d+$/));
            }
            // Si on affiche plus de message
            else if($(e.target).attr("id") && $(e.target).attr("id").includes("message_")){
                // Si on affiche plus de message d'un rapport de chasse
                if($(e.target).closest(".contenu_conversation").prev().prev().find(".td_objet").text().includes("chasseuses ont conquis")){
                    let conv = $(e.target).parents().eq(3).prevAll().eq(1).attr("id").split("_")[1];
                    this.analyseChasse(conv, $(e.target).find(".message").parent().attr("id"), $(e.target).find(".message").text()).analyseChasses(conv);
                }
            }
            if($(e.target).attr("id") && $(e.target).attr("id").includes("liste_conversations"))
                this.couleurMessage();
        });
    }
    /**
    *
    */
    plus(id)
    {
        let champsReponse = id != 0 ? "champ_reponse_" + id : "message_envoi";
        $("#smileySuivant" + id).after(` <span style='cursor:pointer;position:relative;top:3px;'>
            <span style="position:relative;top:-4px"><input id="o_colorMess${champsReponse}" type="color" name="couleur" value="${monProfil.parametre["couleurMessagerie"].valeur}"/></span>
            <img onclick='miseEnForme("${champsReponse}","gras");' title='Gras' src='images/BBCode/bold.png'>
            <img onclick='miseEnForme("${champsReponse}","italic");' title='Italique' src='images/BBCode/italic.png'>
            <img onclick='miseEnForme("${champsReponse}","souligne");' title='Souligné' src='images/BBCode/underline.png'>
            <img onclick='miseEnForme("${champsReponse}","img");' title='Image' src='images/BBCode/picture.png'>
            <img onclick='miseEnForme("${champsReponse}","url");' title='Lien' src='images/BBCode/link.png'>
            <img onclick='miseEnForme("${champsReponse}","player");' title='Pseudo' src='images/BBCode/membre.gif' height='15'>
            <img onclick='miseEnForme("${champsReponse}","ally");' title='Alliance' src='images/BBCode/groupe.gif' height='15'>
            </span>`);
        // event sur le changement de couleur
		$("#o_colorMess" + champsReponse).change((e) => {
            let color = e.currentTarget.value;
			$(this).val(color.substring(1));
			monProfil.parametre["couleurMessagerie"].valeur = color;
            monProfil.parametre["couleurMessagerie"].sauvegarde();
		});
        $(`#${id != 0 ? "repondre_tous_" + id : "bt_envoi_message"}`).click((e) => {
            let color = $("#o_colorMess" + champsReponse).val(), idChamps = `#${id != 0 ? "champ_reponse_" + id : "message_envoi"}`;
            if(color != "#000000")
                $(idChamps).val("[color=" + color + "]" + $(idChamps).val() + "[/color]");
        });
        // Ajoute des emoticones
        $("#listeSmiley2" + id).html(LISTESMILEY1.replace(/message/g, champsReponse));
        $("#listeSmiley3" + id).html(LISTESMILEY2.replace(/message/g, champsReponse));
        $("#listeSmiley4" + id).html(LISTESMILEY3.replace(/message/g, champsReponse));
        $("#listeSmiley5" + id).html(LISTESMILEY4.replace(/message/g, champsReponse));
        $("#listeSmiley6" + id).html(LISTESMILEY5.replace(/message/g, champsReponse));
		$("#listeSmiley7" + id).html(LISTESMILEY6.replace(/message/g, champsReponse));
        // event pour selectionner les listes de smiley
        if(id != 0){
            if($("#tousLesSmiley" + id).find("div:visible").length)
                $("#smileySuivant" + id + ", #smileyPrecedent" + id).toggle();
            $("#smileySuivant" + id).prev().click((e) => {$("#smileySuivant" + id + ", #smileyPrecedent" + id).toggle();});
        }
        // event pour selectionner la liste precedante
        $("#smileyPrecedent" + id)
            .html(`<img title='Précédent' class='cursor' src='images/bouton/fleche-champs-gauche.gif'/>`)
            .removeAttr("onclick")
            .click((e) => {
                let div = $("#tousLesSmiley" + id + " div:visible");
                div.hide();
                div.prev().length ? div.prev().show() : $("#tousLesSmiley" + id + " div:last").show();
            });
        // event pour selectionner la liste suivante
		$("#smileySuivant" + id)
            .html(`<img title='Suivant' class='cursor' src='images/bouton/fleche-champs-droite.gif'/>`)
            .removeAttr("onclick")
            .click((e) => {
                let div = $("#tousLesSmiley" + id + " div:visible");
                div.hide();
                div.next().length ? div.next().show() : $("#tousLesSmiley" + id + " div:first").show();
            });
        return this;
    }
    /**
    *
    */
    analyseCombat(id, dateHeure, message)
    {
        let id_mess = id.split("_")[1], combat = new Combat({id : id_mess, dateHeure : dateHeure, RC : message});
        let simulation = message.includes("Vos troupes ont échoué") ? ` <span id="o_simuler_${id_mess}">Simuler</span>` : "";
        // preparation de l'analyse
        combat.analyse();
        // affichage des optiosn
        $("#" + id + " td:eq(1)").append(`<p class="o_optionMessage gras cursor"><span id="show_info_${id_mess}">+</span>${simulation}</p><div id="o_analyse_${id_mess}" class="info_supp separateur_messages_meme_expe" style="display:none">${combat.toHTMLMessagerie()}</div>`);
        $("#show_info_" + id_mess).click((e) => {$(e.currentTarget).text($(e.currentTarget).text() == "+" ? "-" : "+").parent().next().toggle("blind", 400);});
        $("#o_simuler_" + id_mess).click((e) => {
            // ouverture de la boite combat sur l'onglet de simulation
            $("#o_itemCombat").parent().click();
            $("#o_tabsCombat").tabs("option", "active", 1);
            // autocomplete des unites ennemies
            for(let i = 0 ; i < 14 ; i++)
                $("input[name='o_unite2_" + (i + 1) + "']").spinner("value", combat.armee2Ap.unite[i]);
            // si je suis en defense dans le rc j'autocomplete les donnes de l'attaquant sinon l'inverse
            if(combat.position == 1){
                $("#o_armes2").spinner("value", combat.attaquant.niveauRecherche[2]);
                $("#o_bouclier2").spinner("value", combat.attaquant.niveauRecherche[1] != -1 ? combat.attaquant.niveauRecherche[1] : 0);
            }else{
                $("#o_armes2").spinner("value", combat.defenseur.niveauRecherche[2]);
                $("#o_bouclier2").spinner("value", combat.defenseur.niveauRecherche[1] != -1 ? combat.defenseur.niveauRecherche[1] : 0);
                if(combat.lieu == LIEU.DOME){
                    $("#o_dome").prop("checked", true);
                    if(combat.bonusDefenseur.length){
                        $("#o_bouclier2").spinner("value", combat.bonusDefenseur[0].split('/')[0]);
                        $("#o_domeNiveau").spinner("value", combat.bonusDefenseur[0].split('/')[1]);
                        $("#o_logeNiveau").spinner("value", 0);
                    }
                }
                if(combat.lieu == LIEU.LOGE){
                    $("#o_loge").prop("checked", true);
                    if(combat.bonusDefenseur.length){
                        $("#o_bouclier2").spinner("value", combat.bonusDefenseur[0].split('/')[0]);
                        $("#o_logeNiveau").spinner("value", combat.bonusDefenseur[0].split('/')[1]);
                        $("#o_domeNiveau").spinner("value", 0);
                    }
                }
            }
            return false;
        });
        return this;
    }
    /**
    *
    */
    analyseChasse(id_conv, id, message)
    {
        let id_mess = id.split("_")[1];
        if(!this._messagesOuvert.hasOwnProperty(id_mess)){
            let chasse = new Chasse(message);
            chasse.analyse();
            $("#" + id + " td:eq(1)").append(`<p id="show_info_${id_mess}" class="gras cursor">+</p><div id="o_analyse_${id_mess}" class="info_supp separateur_messages_meme_expe" style="display:none">${chasse.toHTMLMessagerie()}</div>`);
            $("#show_info_" + id_mess).click((e) => {$(e.currentTarget).text($(e.currentTarget).text() == "+" ? "-" : "+").next().toggle("blind", 400);});
            // ajout de la chasse dans les chasses analysés
            this._messagesOuvert[id_mess] = chasse;
            // ajoute de la chasse au bilan
            this._messagesOuvert["conv_" + id_conv] = this._messagesOuvert.hasOwnProperty("conv_" + id_conv) ? this._messagesOuvert["conv_" + id_conv].ajoute(chasse) : chasse;
        }
        return this;
    }
    /**
    *
    */
    analyseChasses(id_conv)
    {
        if(!$("#o_bilan_" + id_conv).length){
            $("#conversation_" + id_conv).next().next().find(".message:last").append(`<p id="show_bilan_${id_conv}" class="gras cursor souligne">Bilan</p><div id="o_bilan_${id_conv}" class="info_supp separateur_messages_meme_expe" style="display:none">${this._messagesOuvert["conv_" + id_conv].toHTMLMessagerie()}</div>`);
            $("#show_bilan_" + id_conv).click((e) => {$(e.currentTarget).next().toggle("blind", 400);});
        }else
            $("#o_bilan_" + id_conv).html(this._messagesOuvert["conv_" + id_conv].toHTMLMessagerie());
    }
    /**
    *
    */
    optionMessage(id_conv)
    {
        $("#" + id_conv + " td:eq(0)").append(`<div class="cursor_copy o_group_bouton_mess">
            <img id="copier_${id_conv}" src="${IMG_COPIER}" height="16" alt="copy" title="copier dans le presse papier"/></span>
            <span id="copier_plus_${id_conv}"><img class="afficher_plus" src="images/icone/more_options.gif" title="Afficher les options" width="10" style="position:relative; top:-4px; margin-left:8px;"/>
            <div id="choix_supp_${id_conv}" class="choix_supplementaires_option" style="z-index: 3;display: none;">
                <div id="copier_hof_${id_conv}" class="choix_option option_deplacement" style="border-bottom:1px solid #B99D53;">
                    <span class="intitule_choix">Copier avec Temps HOF</span>
                </div>
                <div id="copier_bonus_${id_conv}" class="choix_option option_deplacement" style="border-bottom:1px solid #B99D53;">
                    <span class="intitule_choix">Copier avec Bonus</span>
                </div>
                <div id="copier_hof_bonus_${id_conv}" class="choix_option option_deplacement" style="border-bottom:1px solid #B99D53;">
                    <span class="intitule_choix">Copier avec Temps HOF + Bonus</span>
                </div>
			</div></div>`);
        // action menu plus
        $("#copier_plus_" + id_conv).click((e) => {$("#choix_supp_" + id_conv).toggle();});
        // action bouton principale
        let messDefaut = new Clipboard("#copier_" + id_conv, {text : () => {return this.formatMessage(id_conv);}});
        messDefaut.on("success", (e) => {$.toast({...TOAST_SUCCESS, text : "Le rapport a été correctement copié dans le presse papier."});});
        messDefaut.on("error", (e) => {$.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée, la copie a échoué."});});
        // action bouton supplementaire
        let messHOF = new Clipboard("#copier_hof_" + id_conv, {text : () => {return this.formatMessage(id_conv, true);}});
        messHOF.on("success", (e) => {$.toast({...TOAST_SUCCESS, text : "Le rapport a été correctement copié dans le presse papier."});});
        messHOF.on("error", (e) => {$.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée, la copie a échoué."});});
        let messBonus = new Clipboard("#copier_bonus_" + id_conv, {text : () => {return this.formatMessage(id_conv, false, true);}});
        messBonus.on("success", (e) => {$.toast({...TOAST_SUCCESS, text : "Le rapport a été correctement copié dans le presse papier."});});
        messBonus.on("error", (e) => {$.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée, la copie a échoué."});});
        let messHOFBonus = new Clipboard("#copier_hof_bonus_" + id_conv, {text : () => {return this.formatMessage(id_conv, true, true);}});
        messHOFBonus.on("success", (e) => {$.toast({...TOAST_SUCCESS, text : "Le rapport a été correctement copié dans le presse papier."});});
        messHOFBonus.on("error", (e) => {$.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée, la copie a échoué."});});
    }
    /**
    * Ajout d'un code couleur sur les messages par defaut
    */
    couleurMessage()
    {
        $("tr[id^='conversation_']").each((i, elt) => {
            let titre = $(elt).find("td:eq(3) .intitule_message").text();
            if(titre.includes("Colonie perdue") || titre.includes("conquis par") || titre.includes("Vol par") || titre.includes("Invasion") || titre.includes("Attaque échouée contre") || titre.includes("Rebellion échouée"))
                $(elt).find("td:eq(3)").children().addClass("red");
            if(titre.includes("Colonie conquise") || titre.includes("Butin chez") || titre.includes("Attaque réussie contre") || titre.includes("Rebellion réussie"))
                $(elt).find("td:eq(3)").children().addClass("green");
        });
        return this;
    }
    /**
    *
    */
    couleurMessageUtilitaire()
    {
        $("tr[id^='conversation_']").each((i, elt) => {
            let titre = $(elt).find("td:eq(3) .intitule_message").text(), color = "";
            // une colonie perdue est toujours rouge
            // Attaque échouée contre xXx : votre armée...
            if(titre.includes("Colonie perdue") || titre.includes("conquis par") || titre.includes("Attaque échouée contre") || titre.includes("Rebellion échouée"))
                color = "red";
            // Colonie conquise est toujours verte
            // Butin chez Verratti : ...
            // Attaque réussie contre xXx : votre armée...
            else if(titre.includes("Colonie conquise") || titre.includes("Butin chez") || titre.includes("Attaque réussie contre") || titre.includes("Rebellion réussie"))
                color = "green";
            // Vol par XxX : .
            // Invasion de xXx: votre armée
            else if(titre.includes("Vol par") || titre.includes("Invasion"))
                color = this._utilitaire.alliance.joueurs.hasOwnProperty(titre.split(" ")[2]) ? "green" : "red";
            if(color) $(elt).find("td:eq(3)").children().addClass(color);
        });
        return this;
    }
    /**
    *
    */
    formatMessage(id_conv, hof = false, bonus = false)
    {
        let html = ``;
        // pour chaque message de la conversation (attaque terrain + dome + loge par exemple)
        $("#" + id_conv).parent().find("tr[id^='message_']").each((i, elt) => {
            let message = $(elt).find(".message").clone(), pseudo = "", armee = "", id = $(elt).attr("id").split("_")[1];
            // on remplace les br par des retours à la ligne
            message.find("br").replaceWith("\n");
            // on supprime le plus/moins
            let detail = $("div[id^='o_analyse']", message).remove();
            // on supprimer l'analyse
            $(".o_optionMessage", message).remove();
            // en fonction du rc on on met en evidence l'ennemie
            let texte = message.text();
            if(texte.includes("Vous attaquez")){
                pseudo = texte.split("e de ")[1].split("\nTroupes")[0].split(",")[0];
                // on met en gras l'armée
                texte = texte.replace("Troupes en défense : ", "Troupes en défense : [b]");
                texte = texte.replace("Vous infligez", "[/b]Vous infligez");
            }else{
                pseudo = texte.split(" attaque")[0];
                // on met en gras l'armée
                texte = texte.replace("Troupes en attaque : ", "Troupes en attaque : [b]");
                texte = texte.replace("Troupes en défense : ", "[/b]Troupes en défense : ");
            }
            // on met le lien sur le joueur
            texte = texte.replace(pseudo, "[player]" + pseudo + "[/player]");
            // on met en gras le lieu
            texte = texte.replace(/Terrain de Chasse/gi, "[b]Terrain de Chasse[/b]").replace(/fourmilière/gi, "[b]fourmilière[/b]").replace(/Loge Impériale/gi, "[b]Loge Impériale[/b]");
            // on ajoute l'heure du RC
            html += "[b]" + $(elt).find(".expe span > span").text() + "[/b] " + texte + "\n";
            // si on veut le temps HOF
            if(hof) html += `Perte ${monProfil.pseudo} : ${detail.find("#temps_hof_vous_" + id).text()}\nPerte ${pseudo} : ${detail.find("#temps_hof_ennemie_" + id).text()}\nPerte totale : ${detail.find("#temps_hof_total_" + id).text()}\n\n`;
            // si on veut les bonus
            if(bonus) html += `${detail.find("#bonus_ennemie_" + id).text()}\n`;
        });
        return html;
    }
}
