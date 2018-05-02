/*
 * Alliance.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /alliance.php.
*
* @class PageAlliance
* @constructor
*/
class PageAlliance
{
    constructor()
    {
        /**
        * Creation du modele Alliance
        */
        this._alliance = new Alliance({tag : Utils.alliance});
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
        // si les membres sont deja chargé on peux executé la fonction sinon on observe
        if($("#tabMembresAlliance").length)
            this.traitementMembre();
        else{
            // Ajout des infos sur le tableau des membres
            let observer = new MutationObserver((mutationsList) => {
                this.traitementMembre();
                observer.disconnect();
            });
            observer.observe($("#alliance")[0], {childList : true});
        }
        return this;
    }
    /**
	* Affiche les modifications du tableau des membres.
    *
	* @private
	* @method traitementMembre
    */
    traitementMembre()
    {
        $("#tabMembresAlliance td:eq(5)").css("white-space", "nowrap");
        $(".simulateur table[class='ligne_paire'] tr:eq(0) td:eq(1)").append(` (${$("img[alt='Actif']").length})`);
        $(".simulateur table[class='ligne_paire'] tr:eq(0) td:eq(3)").append(` (${$("img[alt='Vacances']").length})`);
        $(".simulateur table[class='ligne_paire'] tr:eq(1) td:eq(1)").append(` (${$("img[alt='Inactif depuis 3 jours']").length})`);
        $(".simulateur table[class='ligne_paire'] tr:eq(1) td:eq(3)").append(` (${$("img[alt='Bannie']").length})`);
        $(".simulateur table[class='ligne_paire'] tr:eq(2) td:eq(1)").append(` (${$("img[alt='Inactif depuis 10 jours']").length})`);
        $(".simulateur table[class='ligne_paire'] tr:eq(2) td:eq(3)").append(` (${$("img[alt='Colonisé']").length})`);
        // ajout des totaux de l'alliance
        let tmpJoueurs = {};
        $("#tabMembresAlliance tr:gt(0)").each((i, elt) => {
            let pseudo = $(elt).find("td:eq(3)").text(), terrain = numeral($(elt).find("td:eq(5)").text()).value();
            tmpJoueurs[pseudo] = new Joueur({
                pseudo : pseudo,
                terrain : terrain,
                fourmiliere : ~~($(elt).find("td:eq(8)").text()),
                technologie : ~~($(elt).find("td:eq(7)").text())
            });
            if(!Utils.comptePlus && !tmpJoueurs[pseudo].estJoueurCourant()){
                if(tmpJoueurs[pseudo].estAttaquable())
                    $(elt).find("td:eq(6)").html(IMG_ATT);
                if(tmpJoueurs[pseudo].estAttaquant())
                    $(elt).find("td:eq(4)").html(IMG_DEF);
            }
        });
        this._alliance.joueurs = tmpJoueurs;

        $("#tabMembresAlliance").append(`<tfoot class='${Object.keys(this._alliance.joueurs).length % 2 ? "ligne_paire" : ""}'><tr class='gras centre'><td colspan='12'>Terrain : <span id='totalTerrain'>${numeral(this._alliance.calculTerrain()).format()}</span> cm² | Fourmilière : ${numeral(this._alliance.calculFourmiliere()).format()} | Technologie : ${numeral(this._alliance.calculTechnologie()).format()}.</td></tr></tfoot>`);
        // Recupération des données de l'utilitaire sinon on met en forme le tableau directement
        $("#tabMembresAlliance tr:first").remove();
		$("#tabMembresAlliance").prepend(`<thead><tr class='alt'><th></th><th></th><th>Rang</th><th>Pseudo</th><th></th><th>Terrain</th><th></th><th><span style='padding-right:10px'>Technologie</span></th><th><span style='padding-right:10px'>Fourmiliere</span></th><th colspan='2'>Etat</th><th></th></tr></thead>`);

        // Si on dispose d'un utilitaire pour la gestion des membres
        if(monProfil.parametre["forumMembre"].valeur){
            // recuperation des commandes sur l'utilitaire
            this._utilitaire.consulterSection(monProfil.parametre["forumMembre"].valeur).then((data) => {
                if(this._utilitaire.chargerJoueur(data)) this.traitementUtilitaire();
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la récupération des membres."});
            });
        }else
            this.tableau();
        return this;
    }
    /**
	* Ajoute le tri.
    *
	* @private
	* @method tableau
	*/
	tableau()
	{
        $("#tabMembresAlliance th:eq(7), #tabMembresAlliance th:eq(8)").css({maxWidth:"50px",textOverflow:"ellipsis",overflow:"hidden"});
        $("#tabMembresAlliance").DataTable({
            bInfo : false,
            bPaginate : false,
            bAutoWidth : false,
            dom : "Bfrti",
            buttons : ["colvis", "copyHtml5", "csvHtml5", "excelHtml5"],
            order : [],
            stripeClasses : ["", "alt"],
            responsive : true,
            language : {
                zeroRecords : "Aucun joueur trouvé",
                infoEmpty : "Aucun enregistrement",
                infoFiltered : "(Filtré par _MAX_ enregistrements)",
                search : "Rechercher : ",
                buttons : {colvis : "Colonne"}
            },
            columnDefs : [
                {type : "quantite-grade", targets : 5},
                {sortable : false, targets : [0, 1, 4, 6, 10, 11]}
            ]
        });
        return this;
	}
    /**
	* Ajout des infos du SDC.
    *
	* @private
	* @method traitementUtilitaire
	*/
    traitementUtilitaire()
    {
        for(let pseudo in this._utilitaire.alliance.joueurs){
            // si la clé est une clé du tableau des memres
            if(this._alliance.joueurs.hasOwnProperty(pseudo)){
                this._alliance.joueurs[pseudo].x = this._utilitaire.alliance.joueurs[pseudo].x;
                this._alliance.joueurs[pseudo].y = this._utilitaire.alliance.joueurs[pseudo].y;
                this._alliance.joueurs[pseudo].id = this._utilitaire.alliance.joueurs[pseudo].id;
                this._alliance.joueurs[pseudo].sujetForum = this._utilitaire.alliance.joueurs[pseudo].sujetForum;
                this._alliance.joueurs[pseudo].rang = this._utilitaire.alliance.joueurs[pseudo].rang;
                this._alliance.joueurs[pseudo].ordreRang = this._utilitaire.alliance.joueurs[pseudo].ordreRang;
            }
        }
        // On retraicie les colonnes des niveaux
        $("#tabMembresAlliance th:eq(1)").after(`<th>Grade</th>`);
        $("#tabMembresAlliance th:eq(9)").after(`<th>Tdt</th><th>Retour</th>`);
        $("#tabMembresAlliance tfoot td:eq(0)").attr("colspan", 15);
        // On compléte les données
        $("#tabMembresAlliance tr:gt(0):lt(-1)").each((i, elt) => {
            let pseudo = $(elt).find("td:eq(3)").text();
            // si nous avons les coordonnées on affiche les tempts de trajet
            $(elt).find("td:eq(1)").after(`<td align="center">${this._alliance.joueurs.hasOwnProperty(pseudo) ? this._alliance.joueurs[pseudo].rang : Utils.alliance}</td>`);
            $(elt).find("td:eq(9)").after(this._alliance.joueurs[pseudo].x != -1 && this._alliance.joueurs[pseudo].y != -1 ? `<td>${Utils.intToTime(monProfil.getTempsParcours2(this._alliance.joueurs[pseudo]))}</td><td>${Utils.roundMinute(monProfil.getTempsParcours2(this._alliance.joueurs[pseudo])).format("D MMM à HH[h]mm")}</td>` : `<td>N/C</td><td>N/C</td>`);
            // si on est chef de l'alliance on peut modifier les rangs et que le joueur est dans l'utilitaire
            if($("img[src='images/crayon.gif']").length && this._alliance.joueurs.hasOwnProperty(pseudo)){
                $(elt).find("td:eq(0)").append(`<a id="o_rang${this._alliance.joueurs[pseudo].id}" href=""><img src="${IMG_UTILITY}" alt="rang"/></a>`);
                $("#o_rang" + this._alliance.joueurs[pseudo].id).click((e) => {
                    let boiteForm = new BoiteRang(this._alliance.joueurs[pseudo], this._utilitaire, this);
                    boiteForm.afficher();
                    return false;
                });
            }
        });
        this.tableauUtilitaire().optionAdmin();
        return this;
    }
    /**
    *
    */
    optionAdmin()
    {
        // si on est chef de l'alliance on peut mettre à jour les membres
        if($("img[src='images/crayon.gif']").length){
            $("#tabMembresAlliance_wrapper .dt-buttons").prepend(`<a id="o_actualiserAlliance" class="dt-button" href="#"><span>Actualiser l'alliance</span></a>`);
            $("#o_actualiserAlliance").click((e) => {
                let promiseJoueur = new Array(), pseudoJoueur = new Array();
                // si coordonnée inconnu on va les chercher
                for(let joueur in this._alliance.joueurs){
                    // si le joueur n'est pas connu dans l'utilitaire
                    if(!this._utilitaire.alliance.joueurs.hasOwnProperty(joueur))
                        this._utilitaire.alliance.joueurs[joueur] = this._alliance.joueurs[joueur];
                    // si ses coordonnées ne sont pas connu
                    if(this._utilitaire.alliance.joueurs[joueur].x == -1 && this._utilitaire.alliance.joueurs[joueur].y == -1){
                        promiseJoueur.push(this._utilitaire.alliance.joueurs[joueur].getProfil());
                        pseudoJoueur.push(joueur);
                    }
                }
                // on recup les profils de tout les joueurs
                Promise.all(promiseJoueur).then((values) => {
                    let promiseForum = new Array(), joueur = null;
                    for(let i = 0 ; i < values.length ; i++){
                        joueur = this._utilitaire.alliance.joueurs[pseudoJoueur[i]];
                        joueur.chargerProfil(values[i]);
                        // on enregistre
                        if(!joueur.sujetForum)
                            promiseForum.push(this._utilitaire.creerSujet(joueur.toUtilitaire(), " ", monProfil.parametre["forumMembre"].valeur));
                    }
                    // on creer les sujets pour les membres qui n'en disposent pas
                    Promise.all(promiseForum).then((values) => {
                        $.toast({...TOAST_SUCCESS, text : "la mise à jour c'est correctement effectuée."});
                        this.actualiserMembre();
                    });
                });
                return false;
            });
        }
        return this;
    }
    /**
    *
    */
    actualiserMembre()
    {
        $("#tabMembresAlliance").DataTable().destroy();
        // mise à jour de l'alliance
        for(let pseudo in this._utilitaire.alliance.joueurs){
            // si la clé est une clé du tableau des membres
            if(this._alliance.joueurs.hasOwnProperty(pseudo)){
                this._alliance.joueurs[pseudo].x = this._utilitaire.alliance.joueurs[pseudo].x;
                this._alliance.joueurs[pseudo].y = this._utilitaire.alliance.joueurs[pseudo].y;
                this._alliance.joueurs[pseudo].id = this._utilitaire.alliance.joueurs[pseudo].id;
                this._alliance.joueurs[pseudo].rang = this._utilitaire.alliance.joueurs[pseudo].rang;
                this._alliance.joueurs[pseudo].ordreRang = this._utilitaire.alliance.joueurs[pseudo].ordreRang;
            }
        }
        $("#tabMembresAlliance tr:gt(0):lt(-1)").each((i, elt) => {
            let pseudo = $(elt).find("td:eq(4)").text();
            $(elt).find("td:eq(2)").text(this._alliance.joueurs.hasOwnProperty(pseudo) ? this._alliance.joueurs[pseudo].rang : Utils.alliance);
            $(elt).find("td:eq(10)").text(Utils.intToTime(monProfil.getTempsParcours2(this._alliance.joueurs[pseudo])));
            $(elt).find("td:eq(11)").text(Utils.roundMinute(monProfil.getTempsParcours2(this._alliance.joueurs[pseudo])).format("D MMM à HH[h]mm"));
        });
        this.tableauUtilitaire().optionAdmin();
        return this;
    }
    /**
	* Ajoute le tri.
    *
	* @private
	* @method tableauUtilitaire
	*/
	tableauUtilitaire()
	{
        $("#tabMembresAlliance th:eq(8), #tabMembresAlliance th:eq(9)").css({maxWidth:"50px",textOverflow:"ellipsis",overflow:"hidden"});
        $("#tabMembresAlliance").DataTable({
            bInfo : false,
            bPaginate : false,
            bAutoWidth : false,
            dom : "Bfrti",
            order : [],
            stripeClasses: ["", "alt"],
            buttons : ["colvis", "copyHtml5", "csvHtml5", "excelHtml5"],
            responsive : true,
            language : {
                zeroRecords : "Aucun joueur trouvé",
                info : "Page _PAGE_ de _PAGES_",
                infoEmpty : "Aucun enregistrement",
                infoFiltered : "(Filtré par _MAX_ enregistrements)",
                search : "Rechercher : ",
                buttons : {colvis : "Colonne"}
            },
            columnDefs : [
                {type : "quantite-grade", targets : 6},
                {visible : false, targets : [3, 8, 9]},
                {sortable : false, targets : [0, 1, 5, 7, 12, 13, 14]}
            ]
        });
        return this;
	}
}
