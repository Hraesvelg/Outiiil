/*
 * Alliance.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe pour creer et gérer une alliance
*
* @class Alliance
*/
class Alliance
{
    constructor(parametres)
    {
        /**
        * tag de l'alliance
        */
        this._tag = parametres["tag"];
        /**
        * nom de l'alliance
        */
        this._nom = parametres["nom"] || "";
        /**
        * terrain globale de l'alliance
        */
        this._terrain = parametres["terrain"] || -1;
        /**
        *
        */
        this._fourmiliere = parametres["fourmiliere"] || -1;
        /**
        *
        */
        this._technologie = parametres["technologie"] || -1;
        /**
        * liste des joueurs
        */
        this._joueurs = {};
        if(parametres.hasOwnProperty("joueurs"))
            for(let pseudo in parametres["joueurs"])
                this._joueurs[pseudo] = new Joueur(parametres["joueurs"][pseudo]);
        /**
        *
        */
        this._ordreRadar = parametres["ordreRadar"] || 0;
        /**
        *
        */
        this._sujetForum = parametres["sujetForum"] || -1;
    }
    /**
    *
    */
    get tag()
    {
        return this._tag;
    }
    /**
    *
    */
    set tag(newTag)
    {
        this._tag = newTag;
    }
    /**
    *
    */
    get nom()
    {
        return this._nom;
    }
    /**
    *
    */
    set nom(newNom)
    {
        this._nom = newNom;
    }
    /**
    *
    */
    get terrain()
    {
        return this._terrain;
    }
    /**
    *
    */
    set terrain(newTerrain)
    {
        this._terrain = newTerrain;
    }
    /**
    *
    */
    get joueurs()
    {
        return this._joueurs;
    }
    /**
    *
    */
    set joueurs(newJoueurs)
    {
        this._joueurs = newJoueurs;
    }
    /**
    *
    */
    get ordreRadar()
    {
        return this._ordreRadar;
    }
    /**
    *
    */
    set ordreRadar(newOrdre)
    {
        this._ordreRadar = newOrdre;
    }
    /**
    *
    */
    get sujetForum()
    {
        return this._sujetForum;
    }
    /**
    *
    */
    set sujetForum(newSujet)
    {
        this._sujetForum = newSujet;
    }
    /**
    *
    */
    calculTerrain()
    {
        this._terrain = Object.keys(this._joueurs).reduce((acc, key) => {return acc + this._joueurs[key].terrain;}, 0);
        return this._terrain;
    }
    /**
    *
    */
    calculTechnologie()
    {
        this._technologie = Object.keys(this._joueurs).reduce((acc, key) => {return acc + this._joueurs[key].technologie;}, 0);
        return this._technologie;
    }
    /**
    *
    */
    calculFourmiliere()
    {
        this._fourmiliere = Object.keys(this._joueurs).reduce((acc, key) => {return acc + this._joueurs[key].fourmiliere;}, 0);
        return this._fourmiliere;
    }
    /**
    *
    */
    toJSON()
    {
        return {tag : this._tag, joueurs : this._joueurs, terrain : this._terrain, technologie : this._technologie, fourmiliere : this._fourmiliere, ordreRadar : this._ordreRadar, sujetForum : this._sujetForum};
    }
    /**
	* Récupére la description d'une alliance.
    *
	* @private
	* @method getDescription
	*/
    getDescription()
    {
        return $.ajax({url : "http://" + Utils.serveur + ".fourmizzz.fr/classementAlliance.php?alliance=" + this._tag});
    }
    /**
    *
    */
    getHistorique(id)
    {
        // Récuperation des données
		$.get("http://outiiil.fr/fzzz/" + Utils.serveur + "/team/" + this._tag, (data) => {
			// Creation du graphique
            let donnees = JSON.parse(data);
			let chart = new Highcharts.Chart({
				chart : {
					renderTo : id,
					type : "spline",
					backgroundColor : null,
					height : 320
				},
                data : {
                    csv : donnees.message,
                    itemDelimiter: ';',
                    firstRowAsNames : false
                },
				title : {text: ''},
				credits : {enabled : false},
				tooltip : {
					crosshairs : [true],
					formatter : function(){
						let s = Highcharts.dateFormat("%A %e %b", this.x);
						$.each(this.points, function(){s += "<br/><span style='color:" + this.series.color + "'>\u25CF</span> " + this.series.name + ": <b>" + numeral(this.y).format() + "</b>";});
						return s;
					},
					shared : true,
					useHTML : true
				},
                plotOptions : {
                    series : {
                        marker : {
                            radius : 3
                        }
                    }
                },
				xAxis : {
					lineColor : "#333333",
					labels : {style : {color : "#222222"}},
                    min : moment().subtract(30, "days").valueOf()
				},
				yAxis : {
					lineColor : "#333333",
					gridLineColor : "#333333",
					labels : {align : "left", x : 0, y : -2, style : {color : "#222222"}},
                    title : {text : null}
				},
				series : [
                    {name : "Membre", color : "#013ADF", visible : false},
					{name : "Terrain", color : "#21610B", type : "areaspline"},
					{name : "Fourmilière", color : "#DF7401", type : "areaspline", visible : false},
					{name : "Technologie", color : "#FF0000", type : "areaspline", visible : false}
				]
			});

			$("span[id^=o_selectHisto]").click((e) => {
				let chart = $("#o_chartAlliance").highcharts(), histo = $(e.currentTarget).attr("data");
				$("span[id^=o_selectHisto]").removeClass("active");
				$(e.currentTarget).addClass("active");
				if(histo == "all")
					chart.xAxis[0].update({min : moment("2016-01-01").valueOf()});
				else
					chart.xAxis[0].update({min : moment().subtract(histo, "days").valueOf()});
                $("#o_bouton_range span.active").addClass("ligne_paire");
                $("#o_bouton_range span:not(.active)").removeClass("ligne_paire");
			});
		});
        return this;
    }
    /**
    *
    */
    getLigneRadar(radar, id, indice)
    {
        $(id).append(`<tr id="o_item_${indice}" class="lien"><td><a id="o_maj_${this._tag}" class='o_actualiser' href=""><img src="${IMG_ACTUALISER}" alt="rang" height="20"/></a></td><td class="left"><a class="gras" href="classementAlliance.php?alliance=${this._tag}">${this._tag}</a></td><td id="o_terrain_${this._tag}" class="right reduce" title="">${numeral(this._terrain).format()}</td></tr>`);
        // event
        $("#o_maj_" + this._tag).click((e) => {
            let oldTerrain = numeral($("#o_terrain_" + this._tag).text()).value();
            $({deg : 0}).animate({deg : 360}, {duration : 600, step : (now) => {$(e.currentTarget).find("img").css({transform: "rotate(" + now + "deg)"});}});
            this.getDescription().then((data) => {
                this._terrain = 0;
				$(data).find("#tabMembresAlliance tr:gt(0)").each((i, elt) => {this._terrain += numeral($(elt).find("td:eq(4)").text()).value();});
                let diff = this._terrain - oldTerrain;
                if(diff){
                    $("#o_terrain_" + this._tag).text(numeral(this._terrain).format())
                        .effect("highlight", {color : (diff > 0 ? "#458D58" : "#8D4545")}, 1000)
                        .attr("title", numeral(diff).format())
                        .tooltip({
                            position : {my : "left+10 center", at : "right center"},
                            content : `<span class='${diff > 0 ? "green_light" : "red_xlight"}'>${diff > 0 ? "+ " + $("#o_terrain_" + this._tag).attr("title") : $("#o_terrain_" + this._tag).attr("title")} cm²</span>`,
                            hide : {effect: "fade", duration: 10},
                            tooltipClass : "warning-tooltip ui-tooltip-right"
                        }).tooltip("open");
                    radar.sauvegarder();
                }
            });
            return false;
        });
        return this;
    }
    /**
    *
    */
    static rechercher(elt)
    {
        return $.ajax({
            type : "post",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/classementAlliance.php",
            data : {
                "requete" : elt,
                "recherche" : 1,
                "prioriteRecherche" : "alliance"
            }
        });
    }
}
