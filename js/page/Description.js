/*
 * Description.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /classementAlliance.php?alliance=?.
*
* @class PageDescription
* @constructor
*/
class PageDescription
{
    constructor()
    {
        /**
        *
        */
        this._alliance = new Alliance({tag : Utils.extractUrlParams()["alliance"]});
        /*
        * Accés à l'utilitaire
        */
        this._utilitaire = new Utilitaire();
        // Récupération du localstorage pour savoir si l'alliance est dans l'utilitaire
        this._alliance.sujetForum = this._utilitaire.getSujetForum(this._alliance.tag);
        /**
        * Accés au radar
        */
        this._boiteRadar = new BoiteRadar();

        this.initialise();
    }
    /**
    *
	* @private
	* @method initialize
	* @return
	*/
    initialise()
    {
        // Suppression du cadre classement
        $("#centre center:first").remove();
        // construction de l'alliance
        let tmpJoueurs = {};
        $("#tabMembresAlliance tr:gt(0)").each((i, elt) => {
            let pseudo = $(elt).find("td:eq(2)").text(), terrain = numeral($(elt).find("td:eq(4)").text()).value();
            tmpJoueurs[pseudo] = new Joueur({
                pseudo : pseudo,
                terrain : terrain,
                fourmiliere : ~~($(elt).find("td:eq(7)").text()),
                technologie : ~~($(elt).find("td:eq(6)").text())
            });
            if(!Utils.comptePlus && !tmpJoueurs[pseudo].estJoueurCourant()){
                if(tmpJoueurs[pseudo].estAttaquable())
                    $(elt).find("td:eq(5)").html(`<img width='18' src='images/icone/icone_degat_attaque.gif' alt='Attaquable'/>`);
                if(tmpJoueurs[pseudo].estAttaquant())
                    $(elt).find("td:eq(3)").html(`<img width='18' src='images/icone/icone_degat_defense.gif' alt='Attaquant'/>`);
            }
        });
        this._alliance.joueurs = tmpJoueurs;

        $("#tabMembresAlliance tr:first").remove();
		$("#tabMembresAlliance")
            .append(`<tfoot><tr class='gras centre'><td colspan='8'>Terrain : <span id='totalTerrain'>${numeral(this._alliance.calculTerrain()).format()}</span> cm² | Fourmilière : ${numeral(this._alliance.calculFourmiliere()).format()} | Technologie : ${numeral(this._alliance.calculTechnologie()).format()}.</td></tr></tfoot>`)
            .wrap("<div class='simulateur'>")
            .css({"border" : "0px", "width" : "100%", "padding" : "0px"})
            .prepend(`<thead><tr class='alt'><th></th><th>Rang</th><th>Pseudo</th><th></th><th>Terrain</th><th></th><th><span style='padding-right:10px'>Technologie</span></th><th><span style='padding-right:10px'>Fourmiliere</span></th></tr></thead>`)
            .after(`<div id='o_bouton_alliance' class='o_group_bouton'><span id='o_historique' class='option_gestion'><img src="${O_HISTORIQUE}" alt="historique"/> Historique</span><span id='o_surveiller' class='option_gestion'><img src="${O_RADAR}" alt="surveiller"/>${this._boiteRadar.alliances.hasOwnProperty(this._alliance.tag) ? " Ignorer" : " Surveiller"}</span><span id='o_analyser' class='option_gestion'><img src="${O_UTILITAIRE}" alt="analyser"/>${this._alliance.sujetForum == -1 ? " Ajouter à l'utilitaire" : " Analyser"}</span></div><div id='o_separation_graph' class='clear'></div>`);
        this.tableau();

        $("#o_historique").click((e) => {
            $(e.currentTarget).off().css("backgroundColor", "#bbb");
			this.historique();
		});
        $("#o_surveiller").click((e) => {
            if(!this._boiteRadar.alliances.hasOwnProperty(this._alliance.tag)){
				$(e.currentTarget).html($(e.currentTarget).html().replace(/Surveiller/, "Ignorer"));
                this._boiteRadar.ajouteAlliance(this._alliance);
			}else{
				$(e.currentTarget).html($(e.currentTarget).html().replace(/Ignorer/, "Surveiller"));
                this._boiteRadar.supprimeAlliance(this._alliance);
			}
            this._boiteRadar.sauvegarde().actualise();
		});
        $("#o_analyser").click((e) => {
            // il faut un utilitaire pour utiliser cette fonction
            if(monProfil.parametre["forumAlliance"] && monProfil.parametre["forumAlliance"].valeur){
                $(e.currentTarget).off().css("backgroundColor", "#bbb");
                // si l'alliance n'est dans l'utilitaire
                let promiseJoueur = new Array(), pseudoJoueur = new Array();
                if(this._alliance.sujetForum == -1){
                    // pour chaque membre on recup x,y et id
                    for(let joueur in this._alliance.joueurs){
                        promiseJoueur.push(this._alliance.joueurs[joueur].getProfil());
                        pseudoJoueur.push(joueur);
                    }
                    // on doit utiliser self pour garder le contexte dans la methode then l'utilisation de function est obligatoire
                    let self = this;
                    $.when.apply($, promiseJoueur).then(function(){
                        for(let reponse in arguments)
                            self._alliance.joueurs[pseudoJoueur[reponse]].chargeDataProfil(arguments[reponse][0]);
                        // on enregistre
                        self._utilitaire.enregistreAlliance(self._alliance).then((data) => {
                            $.toast({...TOAST_SUCCESS, text : "Alliance correctement ajoutée."});
                            // mise à jour du localstorage
                            let allianceSuivi = {};
                            $("<div/>").append($(data).find("cmd:eq(1)").text()).find(".topic_forum").each((i, elt) => {
                                allianceSuivi[$(elt).text()] = $(elt).attr("onclick").match(/\d+/)[0];
                            });
                            // on sauvegarde si il y a eu un changement
                            localStorage.setItem("outiiil_alliance", JSON.stringify(allianceSuivi));
                            self.afficherAnalyse();
                        }, (jqXHR, textStatus, errorThrown) => {
                             $.toast({...TOAST_ERROR, text : "Une erreur a été rencontré lors de l'enregistrement des informations sur l'alliance."});
                        });
                    });
                }else{
                    this._utilitaire.getInfoAlliance(this._alliance.sujetForum).then((data) => {
                        let content = JSON.parse($("<div/>").append($(data).find("cmd:eq(1)").text()).find("div[id^='editTopic']").text().trim()) || {};
                        for(let joueurJS in content["joueurs"]){
                            if(this._alliance.joueurs.hasOwnProperty(joueurJS)){
                                this._alliance.joueurs[joueurJS].id = content["joueurs"][joueurJS].id;
                                this._alliance.joueurs[joueurJS].x = content["joueurs"][joueurJS].x;
                                this._alliance.joueurs[joueurJS].y = content["joueurs"][joueurJS].y;
                                this._alliance.joueurs[joueurJS].mv = content["joueurs"][joueurJS].mv;
                            }
                        }
                        this.afficherAnalyse();
                    }, (jqXHR, textStatus, errorThrown) => {
                         $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de la récupération des informations sur l'alliance."});
                    });
                }
            }else
                $.toast({...TOAST_INFO, text : "Désolé, un utilitaire est necessaire pour utiliser cette fonctionnalité."});
		});
    }
    /**
	* Ajoute le tri sur le tableau des membres.
    *
	* @private
	* @method tableau
	*/
	tableau()
	{
		$("#tabMembresAlliance").DataTable({
            bInfo : false,
            bPaginate : false,
            bAutoWidth : false,
            dom : "Bfrti",
            order : [],
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
                {type : "quantite-grade", targets : 4},
                {sortable : false, targets : [0, 3, 5]}
            ]
        });
	}
    /**
	* Ajoute le tri sur le tableau des membres.
    *
	* @private
	* @method tableau
	*/
	tableauUtilitaire()
	{
        $("#tabMembresAlliance th:eq(6), #tabMembresAlliance th:eq(7)").css({maxWidth:"50px",textOverflow:"ellipsis",overflow:"hidden"});
		$("#tabMembresAlliance").DataTable({
            bInfo : false,
            bPaginate : false,
            bAutoWidth : false,
            dom : "Bfrti",
            order : [],
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
                {type : "quantite-grade", targets : 4},
                {type : "moment-D MMM YYYY", targets : 9},
                {type : "time-unformat", targets : 8},
                {visible : false, targets : [1]},
                {sortable : false, targets : [0, 3, 5]}
            ]
        });
	}
	/**
	* Récupére et Affiche l'historique de l'alliance.
    *
	* @private
	* @method historique
	*/
	historique()
	{
        $("#o_separation_graph").after(`<div id='o_boiteAlliance' class='simulateur o_marginT15'><div id='o_bouton_range' class='o_group_bouton'><span id='o_selectHisto_1' class='active option_gestion ligne_paire' data='30'>30J</span><span id='o_selectHisto_2' class='option_gestion' data='90'>90J</span><span id='o_selectHisto_3' class='option_gestion' data='180'>180J</span><span id='o_selectHisto_4' class='option_gestion' data='all'>Tout</span></div><div id='o_chartAlliance'></div></div>`);
        this._alliance.getHistorique("o_chartAlliance");
	}
	/**
	* Récupére les points de combats des joueurs et calcule les temps de trajet.
    *
	* @private
	* @method afficherAnalyse
	*/
	afficherAnalyse()
	{
        // destruction du datable d'origine
        $("#tabMembresAlliance").DataTable().destroy();
        $("#tabMembresAlliance th:eq(7)").after(`<th>Tdt</th><th>Retour</th>`);
        $("#tabMembresAlliance tfoot td:eq(0)").attr("colspan", 10);
        // On compléte les données
        $("#tabMembresAlliance tr:gt(0):lt(-1)").each((i, elt) => {
            let joueur = $(elt).find("td:eq(2)").text();
            // joueur en vacance
            if(this._alliance.joueurs.hasOwnProperty(joueur) && this._alliance.joueurs[joueur].mv){
                $(elt).addClass("blue");
                $(elt).find("a").addClass("blue");
            }
            // calcul du temps de trajet
            if(this._alliance.joueurs.hasOwnProperty(joueur) && this._alliance.joueurs[joueur].x != -1 && this._alliance.joueurs[joueur].y != -1)
                $(elt).find("td:eq(7)").after(`<td>${Utils.intToTime(this._alliance.joueurs[joueur].getTempsParcours())}</td><td>${Utils.roundMinute(this._alliance.joueurs[joueur].getTempsParcours()).format("D MMM à HH[h]mm")}</td>`);
            else
                $(elt).find("td:eq(7)").after(`<td>N/C</td><td>N/C</td>`);
        });
        this.tableauUtilitaire();
	}
}
