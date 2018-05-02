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
        /**
        * liste des commandes.
        */
        this._commande = {};
        /**
        * liste des joueurs.
        */
        this._monAlliance = null;
    }
    /**
    *
    */
    get commande()
    {
        return this._commande;
    }
    /*
    *
    */
    set commande(newCommande)
    {
        this._commande = newCommande;
    }
    /*
    *
    */
    get alliance()
    {
        return this._monAlliance;
    }
    /*
    *
    */
    set alliance(newAlliance)
    {
        this._monAlliance = newAlliance;
    }
    /**
    *
    */
    creerSection(nomSection)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "ajoutCategorie",
                "xajaxargs[]" : `<xjxquery><q>nom=${nomSection}</q></xjxquery>`,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    modifierSection(nomSection, id, categorie)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "renommerCategorie",
                "xajaxargs[]" : `<xjxquery><q>nom=${nomSection}&type=${categorie}&ID_cat=${id}&del=Supprimer</q></xjxquery>`,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    consulterSection(id)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "callGetForum",
                "xajaxargs[]" : id,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    creerSujet(nomSujet, contenu, id, type = "normal")
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "envoiNouveauSujet",
                "xajaxargs[]" : `<xjxquery><q>cat=${id}&sujet=${nomSujet}&message=${encodeURIComponent(contenu)}&type=${type}&modifiable=envoyer&send=Envoyer&question=&reponse[]=&reponse[]=&reponse[]=</q></xjxquery>`,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    modifierSujet(nomSujet, contenu, id)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "envoiEditTopic",
                "xajaxargs[]" : `<xjxquery><q>IDTopic=${id}&sujet=${nomSujet}&message=${encodeURIComponent(contenu)}&modifiable=envoyer&send=Envoyer</q></xjxquery>`,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    consulterSujet(id)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "callGetTopic",
                "xajaxargs[]" : id,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    envoyerMessage(id, message)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/alliance.php?forum_menu",
            data : {
                "xajax" : "envoiNouveauMessage",
                "xajaxargs[]" : `<xjxquery><q>topic=${id}&message=${message}&send=Envoyer</q></xjxquery>`,
                "xajaxr" : moment().valueOf()
            }
        });
    }
    /**
    *
    */
    executer()
    {
        // si le forum est deja chargé lance le traitement
        if($("#cat_forum").length) this.traitementSection("#alliance");
        // Récupération des données du forum pour communiquer.
        let observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                this.traitementSection(mutation.target);
            });
        });
        observer.observe($("#alliance")[0], {childList : true});
        return this;
    }
    /**
    *
    */
    traitementSection(element)
    {
        // ajoute les options pour outiiil
        if($(element).find("div.simulateur").length) this.optionAdmin();
        // on enregistre les id des topic si on utilise l'utilitaire
        if(!monProfil.parametre["forumCommande"].valeur && $(element).find("span[class^='forum']:contains('Outiiil_Commande')").length){
            monProfil.parametre["forumCommande"].valeur = $(element).find("span[class^='forum']:contains('Outiiil_Commande')").attr("class").match(/\d+/)[0];
            monProfil.parametre["forumCommande"].sauvegarde();
        }
        if(!monProfil.parametre["forumMembre"].valeur && $(element).find("span[class^='forum']:contains('Outiiil_Membre')").length){
            monProfil.parametre["forumMembre"].valeur = $(element).find("span[class^='forum']:contains('Outiiil_Membre')").attr("class").match(/\d+/)[0];
            monProfil.parametre["forumMembre"].sauvegarde();
        }
        // selon la section ACTIVE on ajoute les outils necessaires
        switch($(element).find("span[class^='forum'][class$='ligne_paire']").html()){
            case "Outiiil_Commande" :
                // on verifie si on n'est dans un sujet mais bien sur la liste des topics
                if($("#form_cat").length && !$("#o_afficherEtat").length)
                    this.optionAdminCommande();
                break;
            default :
                break;
        }
        return this;
    }
    /**
    *
    */
    chargerCommande(data)
    {
        let response = $(data).find("cmd:eq(1)").text();
        if(response.includes("Vous n'avez pas accès à ce forum."))
            $.toast({...TOAST_ERROR, text : "L'identifiant du sujet pour les commandes est érroné."});
        else{
            let commande = null;
            $("<div/>").append(response).find("#form_cat tr:gt(0)").each((i, elt) => {
                let titreSujet = $(elt).find("td:eq(1)").text().trim(), id = -1;
                // les lignes des commandes ont 3 td et du contenu
                if(titreSujet){
                    id = $(elt).find("a.topic_forum").attr("onclick").match(/\d+/)[0];
                    commande = new Commande();
                    this._commande[id] = commande.parseUtilitaire(id, $(elt).next().find("a").text(), titreSujet.split("] ")[0].split("[")[1], titreSujet.split("] ")[1].split(" / "), $(elt).find("td:last :not(a)").contents().filter(function(){return (this.nodeType === 3);}).text());
                }
            });
            return true;
        }
        return false;
    }
    /**
    *
    */
    chargerJoueur(data)
    {
        let response = $(data).find("cmd:eq(1)").text();
        if(response.includes("Vous n'avez pas accès à ce forum."))
            $.toast({...TOAST_ERROR, text : "L'identifiant du sujet pour les membres est érroné."});
        else{
            let joueurs = {};
            $("<div/>").append(response).find("#form_cat tr:gt(0)").each((i, elt) => {
                let titreSujet = $(elt).find("td:eq(1)").text().trim(), id = $(elt).find("input[name='topic[]']").val();
                // les lignes des commandes ont 3 td et du contenu
                if(titreSujet){
                    let infos = titreSujet.split(" / ");
                    joueurs[infos[0]] = {id : infos[1], pseudo : infos[0], x : infos[2], y : infos[3], sujetForum : id};
                    if(infos.length > 4){
                        joueurs[infos[0]].rang = infos[4];
                        joueurs[infos[0]].ordreRang = infos[5];
                    }
                }
            });
            this._monAlliance = new Alliance({tag : Utils.alliance, joueurs : joueurs});
            return true;
        }
        return false;
    }
    /**
    *
    */
    optionAdmin()
    {
        // il faut etre chef pour preparer le fofo
        if($("img[src='images/icone/outil.gif']").length && !$("#o_afficheMenuUtilitaire").length){
            $("#cat_forum").prepend(`<span id="o_afficheMenuUtilitaire" class="o_forumOption categorie_forum"><img src="${IMG_OUTIIIL}" alt="outiiil"/></span>
                <span id="o_menuUtilitaire" class="ligne_paire o_prepareUtilitaire">
                    <a href="#" id="o_creerUtilitaire">» Préparer le forum pour un SDC</a><br/>
                    <a href="#" id="o_preparerGuerre">» Préparer une section pour une guerre</a>
            </span>`);
            $("#o_afficheMenuUtilitaire").click((e) => {$("#o_menuUtilitaire").toggle();return false;});
            // ajout de l'input pour la selection du tag alliance
            $("#alliance .simulateur").append(`<div id="o_formGuerre" style="display:none;"><input id="o_tagGuerre" type="text"/> <button id="o_creerSectionGuerre">Créer section</button></div>`);
            // Creation de l'utilitaire
            $("#o_creerUtilitaire").click((e) => {
                // Creation du sujet "Outiiil_Commande"
                if(!$(`#cat_forum span:contains(Outiiil_Commande)`).length){
                    this.creerSection("Outiiil_Commande").then((data) => {
                        let response = $("<div/>").append($(data).find("cmd:eq(1)").html());
                        let idCat = $(response).find(`input[value='Outiiil_Commande']`).parent().attr("id").match(/\d+/)[0];
                        // on ne peut pas creer directement une section caché donc on cache aprés
                        this.modifierSection("Outiiil_Commande", idCat, "cache").then((data) => {
                            $.toast({...TOAST_SUCCESS, text : "La section commande a été correctement créée."});
                        }, (jqXHR, textStatus, errorThrown) => {
                            $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la protection de la section commande."});
                        });
                    }, (jqXHR, textStatus, errorThrown) => {
                        $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la création de la section commande."});
                    });
                }else
                    $.toast({...TOAST_WARNING, text : "Section commande est déjà créée !"});
                // creation de la section membre pour les membres de l'alliance
                if(!$(`#cat_forum span:contains(Outiiil_Membre)`).length){
                    this.creerSection("Outiiil_Membre").then((data) => {
                        let response = $("<div/>").append($(data).find("cmd:eq(1)").html());
                        let idCat = $(response).find(`input[value='Outiiil_Membre']`).parent().attr("id").match(/\d+/)[0];
                        // on ne peut pas creer directement une section caché donc on cache aprés
                        this.modifierSection("Outiiil_Membre", idCat, "cache").then((data) => {
                            $.toast({...TOAST_SUCCESS, text : "La section membre a été correctement créée."});
                        }, (jqXHR, textStatus, errorThrown) => {
                            $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la protection de la section membre."});
                        });
                    }, (jqXHR, textStatus, errorThrown) => {
                        $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la création de la section membre."});
                    });
                }else
                    $.toast({...TOAST_WARNING, text : "Section membre est déjà créée !"});
                return false;
            });
            // Preparation d'une guerre
            $("#o_preparerGuerre").click((e) => {$("#o_formGuerre").toggle();});
            $("#o_tagGuerre").autocomplete({
                source : (request, response) => {Alliance.rechercher(request.term).then((data) => {response(Utils.extraitRecherche(data, false, true));});},
                position : {my : "left top-6", at : "left bottom"},
                delay : 0,
                minLength : 1,
                select : (e, ui) => {$("#o_tagGuerre").val(ui.item.tag);return false;}
            }).data("ui-autocomplete")._renderItem = (ul, item) => {
                let style = '';
                return $("<li>").append(`<a style="${style}">${item.value_avec_html}</a>`).appendTo(ul);
            };
            // event sur le bouton guerre
            $("#o_creerSectionGuerre").click((e) => {
                let alliance = new Alliance({tag : $("#o_tagGuerre").val()}), titreSection = "Guerre " + alliance.tag;
                if(!$("#cat_forum span[class^='forum']").text().toUpperCase().includes(titreSection.toUpperCase())){
                    // on créer la section "Guerre " + tag
                    this.creerSection(titreSection).then((data) => {
                        // on recup la section pour ajouter les sujets des joueurs
                        let response = $("<div/>").append($(data).find("cmd:eq(1)").html());
                        let idCat = $(response).find(`input[value='${titreSection}']`).parent().attr("id").match(/\d+/)[0];
                        alliance.getDescription().then((data) => {
                            // on construit les appels de creation des sujets
                            let promiseJoueur = new Array();
                            $(data).find("#tabMembresAlliance tr:gt(0)").each((i, elt) => {
                                let pseudo = $(elt).find("td:eq(2)").text();
                                promiseJoueur.push(this.creerSujet(pseudo, `[player]${pseudo}[/player]`, idCat));
                            });
                            // on creer les sujets
                            Promise.all(promiseJoueur).then((values) => {location.reload();});
                        },(jqXHR, textStatus, errorThrown) => {
                             $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la récupération de la desciption."});
                        });
                    }, (jqXHR, textStatus, errorThrown) => {
                         $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la création de la section guerre."});
                    });
                }else
                    $.toast({...TOAST_WARNING, text : `La section "Guerre ${alliance.tag}" existe déjà !`});
            });
        }
        return this;
    }
    /**
    *
    */
    optionAdminCommande()
    {
        if($("img[src='images/icone/outil.gif']").length){
            let options = "";
            for(let etat in ETAT_COMMANDE) options += `<option value="${ETAT_COMMANDE[etat]}">${etat}</option>`;
            $("#form_cat td:last")
                .prepend(`<img class="cursor" id="o_afficherEtat" src="${IMG_CHANGE}" height="16" alt="changer" title="Changer l'etat des commandes selectionnées"/>`)
                .append(`<select id="o_selectEtatCommande" style="display:none;">${options}</select> <button id="o_changerEtat" style="display:none;">Modifier l'état</button>`);
            $("#o_afficherEtat").click((e) => {$("#o_changerEtat, #o_selectEtatCommande").toggle();});
            $("#o_changerEtat").click((e) => {
                let promiseCmdModif = new Array();
                $("#form_cat tr:gt(0)").each((i, elt) => {
                    // si la commande est selectionné
                    if($(elt).find("input[name='topic[]']:checked").length){
                        let titreSujet = $(elt).find("td:eq(1)").text().trim(), id = $(elt).find("input[name='topic[]']").val();
                        if(titreSujet){
                            let commande = new Commande();
                            commande.parseUtilitaire(id, $(elt).next().find("a").text(), titreSujet.split("] ")[0].split("[")[1], titreSujet.split("] ")[1].split(" / "));
                            commande.etat = $("#o_selectEtatCommande").val();
                            promiseCmdModif.push(this.modifierSujet(commande.toUtilitaire(), " ", id));
                        }
                    }
                });
                Promise.all(promiseCmdModif).then((values) => {
                    $.toast({...TOAST_SUCCESS, text : promiseCmdModif.length > 1 ? "Commandes mises à jour avec succès." : "Commande mise à jour avec succès."});
                    location.reload();
                });
                return false;
            });
        }
        return this;
    }
}
