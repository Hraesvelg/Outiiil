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
    constructor(boiteRadar)
    {
        /**
        * Creation de la classe modele d'une alliance
        */
        this._alliance = new Alliance({tag : Utils.extractUrlParams()["alliance"]});
        /**
        * Accés au radar
        */
        this._boiteRadar = boiteRadar;
    }
    /**
    *
	* @private
	* @method initialize
	* @return
	*/
    executer()
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
                    $(elt).find("td:eq(5)").html(IMG_ATT);
                if(tmpJoueurs[pseudo].estAttaquant())
                    $(elt).find("td:eq(3)").html(IMG_DEF);
            }
        });
        this._alliance.joueurs = tmpJoueurs;

        $("#tabMembresAlliance tr:first").remove();
		$("#tabMembresAlliance")
            .append(`<tfoot><tr class='gras centre'><td colspan='8'>Terrain : <span id='totalTerrain'>${numeral(this._alliance.calculTerrain()).format()}</span> cm² | Fourmilière : ${numeral(this._alliance.calculFourmiliere()).format()} | Technologie : ${numeral(this._alliance.calculTechnologie()).format()}.</td></tr></tfoot>`)
            .wrap("<div class='simulateur'>")
            .css({"border" : "0px", "width" : "100%", "padding" : "0px"})
            .prepend(`<thead><tr class='alt'><th></th><th>Rang</th><th>Pseudo</th><th></th><th>Terrain</th><th></th><th><span style='padding-right:10px'>Technologie</span></th><th><span style='padding-right:10px'>Fourmiliere</span></th></tr></thead>`)
            .after(`<div id='o_bouton_alliance' class='o_group_bouton'><span id='o_historique' class='option_gestion'><img src="${IMG_HISTORIQUE}" alt="historique"/> Historique</span><span id='o_surveiller' class='option_gestion'><img src="${IMG_RADAR}" alt="surveiller"/>${this._boiteRadar.alliances.hasOwnProperty(this._alliance.tag) ? " Ignorer" : " Surveiller"}</span></div><div id='o_separation_graph' class='clear'></div>`);
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
            this._boiteRadar.sauvegarder().actualiser();
		});
        return this;
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
        return this;
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
        return this;
	}
}
