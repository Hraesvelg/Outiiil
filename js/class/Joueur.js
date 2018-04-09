/*
 * Joueur.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe pour creer et gérer un joueur
*
* @class Joueur
*/
class Joueur
{
    constructor(parametres)
    {
        /**
        * id du joueur
        */
        this._id = parametres["id"] || -1;
        /**
        * pseudo du joueur
        */
        this._pseudo = parametres["pseudo"];
        /**
        * abscisse du joueur
        */
        this._x = parametres["x"] || -1;
        /**
        * ordonné du joueur
        */
        this._y = parametres["y"] || -1;
        /**
        *
        */
        this._terrain = parametres["terrain"] || -1;
        /**
        *
        */
        this._niveauRecherche = parametres["niveauRecherche"] || new Array(10).fill(-1);
        /**
        *
        */
        this._technologie = parametres["technologie"] || -1;
        /**
        *
        */
        this._niveauConstruction = parametres["niveauConstruction"] || new Array(13).fill(-1);
        /**
        *
        */
        this._fourmiliere = parametres["fourmiliere"] || -1;
        /**
        *
        */
        this._mv = parametres["mv"] || false;
        /**
        *
        */
        this._rang = parametres.hasOwnProperty("rang") ? new Rang(parametres["rang"].libelle || "", parametres["rang"].ordre) : new Rang("");
        /**
        * Préférence du joueur.
        *
        * @private
        * @property _parametre
        * @type Object
        */
        this._parametre = {};
    }
    /**
    *
    */
    get id()
    {
        return this._id;
    }
    /**
    *
    */
    set id(newId)
    {
        this._id = newId;
    }
    /**
    *
    */
    get pseudo()
    {
        return this._pseudo;
    }
    /**
    *
    */
    set pseudo(newPseudo)
    {
        this._pseudo = newPseudo;
    }
    /**
    *
    */
    get x()
    {
        return this._x;
    }
    /**
    *
    */
    set x(newX)
    {
        this._x = newX;
    }
    /**
    *
    */
    get y()
    {
        return this._y;
    }
    /**
    *
    */
    set y(newY)
    {
        this._y = newY;
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
    get niveauRecherche()
    {
        return this._niveauRecherche;
    }
    /**
    *
    */
    set niveauRecherche(newNiveau)
    {
        this._niveauRecherche = newNiveau;
    }
    /**
    *
    */
    get technologie()
    {
        return this._technologie;
    }
    /**
    *
    */
    set technologie(newTechnologie)
    {
        this._technologie = newTechnologie;
    }
    /**
    *
    */
    get niveauConstruction()
    {
        return this._niveauConstruction;
    }
    /**
    *
    */
    set niveauConstruction(newNiveau)
    {
        this._niveauConstruction = newNiveau;
    }
    /**
    *
    */
    get fourmiliere()
    {
        return this._fourmiliere;
    }
    /**
    *
    */
    set fourmiliere(newFourmiliere)
    {
        this._fourmiliere = newFourmiliere;
    }
    /**
    *
    */
    get mv()
    {
        return this._mv;
    }
    /**
    *
    */
    set mv(newMV)
    {
        this._mv = newMV;
    }
    /**
    *
    */
    get rang()
    {
        return this._rang;
    }
    /**
    *
    */
    set rang(newRang)
    {
        this._rang = newRang;
    }
    /**
    * Renvoie les joueurs et les alliances sous surveillance.
    *
    * @method Radar
    * @return {Object} les joueurs et alliances format JSON.
    */
    get parametre()
    {
        return this._parametre;
    }
    /**
    *
    */
    toJSON()
    {
        return {id : this._id, pseudo : this._pseudo, x : this._x, y : this._y, terrain : this._terrain, mv : this._mv, rang : this._rang, niveauConstruction : this._niveauConstruction, niveauRecherche : this._niveauRecherche};
    }
    /**
    *
    */
    estJoueurCourant()
    {
        return this._pseudo == Utils.pseudo;
    }
    /**
    *
    */
    estAttaquable()
    {
        return this._terrain >= ((Utils.terrain * 0.5) + 1) && this._terrain <= ((Utils.terrain * 3) - 1);
    }
    /**
    *
    */
    estAttaquant()
    {
        return ((this._terrain * 0.5) + 1) <= Utils.terrain && ((this._terrain * 3) - 1) >= Utils.terrain;
    }
    /**
    *
    */
    getTDP()
    {
        return this._niveauConstruction[3] + this._niveauConstruction[4] + this._niveauRecherche[0];
    }
    /**
    *
    */
    getTempsParcours()
    {
        return Math.ceil(Math.pow(0.9, monProfil.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(Math.sqrt(Math.pow(monProfil.x - this._x, 2) + Math.pow(monProfil.y - this._y, 2))/350))));
    }
    /**
    *
    */
    getLienFourmizzz()
    {
        return this._pseudo != "Vous" || this._pseudo != "Ennemie" ? `<a href="Membre.php?Pseudo=${this._pseudo}" class='o_lien'>${this._pseudo}</a>` : this._pseudo;
    }
    /**
    *
    */
    attenteSynchro()
    {
        return 60 - (moment().add(this.getTempsParcours, 's').seconds() % 60);
    }
    /**
    *
    */
    getProfil()
    {
        return $.ajax({url : "http://" + Utils.serveur + ".fourmizzz.fr/Membre.php?Pseudo=" + this._pseudo});
    }
    /**
    *
    */
    getProfilCourant()
    {
        // si on est le joueur courant on a peut etre les infos dans le storage
        if(Utils.pseudo == this._pseudo){
            // si on est le joueur courant on regarde dans le localstorage
            let data = JSON.parse(localStorage.getItem("outiiil_joueur")) || {};
            // Si des données sont deja presente et à jour on les charges
            if(data.hasOwnProperty("id") && data.hasOwnProperty("x") && data.hasOwnProperty("y")){
                this._id = data.id;
                this._x = data.x;
                this._y = data.y;
            }
        }
        // sinon
        if(this._x == -1 || this._y == -1 || this._id == -1)
            return this.getProfil();
        return null;
    }
    /**
    *
    */
    chargeDataProfil(html)
    {
        let regexp = new RegExp("x=(\\d*) et y=(\\d*)"), ligne = $(html).find(".boite_membre a[href^='carte2.php?']").text();
        this._id = $(html).find("a[href^='commerce.php?ID=']").attr("href").match(/\d+/g)[0];
        this._x = ~~(ligne.replace(regexp, "$1"));
        this._y = ~~(ligne.replace(regexp, "$2"));
        this._mv = $(html).find("table:eq(0) tr:eq(0) td:eq(0)").text().includes("Joueur en vacances");
        this._terrain = numeral($(html).find(".tableau_score tr:eq(1) td:eq(1)").text()).value();
        if(Utils.pseudo == this._pseudo)
            localStorage.setItem("outiiil_joueur", JSON.stringify(this, ["id", "x", "y", "niveauConstruction", "niveauRecherche"]));
        return this;
    }
    /**
	* Récupére les niveaux des constructions du joueur ainsi que la construction en cours.
    *
	* @method getConstruction
	*/
	getConstruction()
	{
        // si on est le joueur courant on regarde dans le localstorage
        let data = JSON.parse(localStorage.getItem("outiiil_joueur")) || {};
        // Si des données sont deja presente et à jour on les charges
        if(data.hasOwnProperty("niveauConstruction"))
            this._niveauConstruction = data.niveauConstruction;
        // si on pas les infos en localstorage
        if(this._niveauConstruction.every((elt) => {return elt == -1}))
            return $.ajax({url : "http://" + Utils.serveur + ".fourmizzz.fr/construction.php"});
        return null;
	}
    /**
    *
    */
    chargeDataConstruction(html)
    {
        let parsed = $("<div/>").append(html);
        // Niveau des batiments
        parsed.find(".ligneAmelioration").each((i, elt) => {this._niveauConstruction[i] = parseInt($(elt).find(".niveau_amelioration").text().split(" ")[1]);});
        // Construction en cours ?!
        let ligne = parsed.find("#centre strong").text(),
            construction = ligne.substring(2, ligne.indexOf("se termine") - 1),
            time = parseInt(ligne.split(',')[0].split('(')[1]);
        // si il y a une construction en cours les données expirent à la fin de cette construction
    	if(construction){
            let dataEvo = JSON.parse(localStorage.getItem("outiiil_data")) || {};
            // si on a pas de donné ou que la consutrction n'est pas deja enregistré
            if(!dataEvo.hasOwnProperty("construction")){
                // si on pas les infos en localstorage
                dataEvo.construction = construction.substr(0,1).toUpperCase() + construction.substr(1);
                dataEvo.expConstruction = moment().add(time, 's');
                dataEvo.startConstruction = moment();
                localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
            }
        }
        localStorage.setItem("outiiil_joueur", JSON.stringify(this, ["id", "x", "y", "niveauConstruction", "niveauRecherche"]));
        return this;
    }
	/**
	* Récupére les niveaux des recherches du joueur ainsi que la recherche en cours.
    *
	* @method getLaboratoire
	*/
	getLaboratoire()
	{
        // si on est le joueur courant on regarde dans le localstorage
        let data = JSON.parse(localStorage.getItem("outiiil_joueur")) || {};
        // Si des données sont deja presente et à jour on les charges
        if(data.hasOwnProperty("niveauRecherche"))
            this._niveauRecherche = data.niveauRecherche;
        // si on pas les infos en localstorage
        if(this._niveauRecherche.every((elt) => {return elt == -1}))
            return $.ajax({url : "http://" + Utils.serveur + ".fourmizzz.fr/laboratoire.php"});
        return null;
	}
    /**
    *
    */
    chargeDataLaboratoire(html)
    {
        let parsed = $("<div/>").append(html);
        // Niveau des recherches
        parsed.find(".ligneAmelioration").each((i, elt) => {this._niveauRecherche[i] = parseInt($(elt).find(".niveau_amelioration").text().split(" ")[1]);});
        // Recherche en cours ?!
        let ligne = parsed.find("#centre strong").text();
        let recherche = ligne.substring(2, ligne.indexOf("termin") - 1), time = parseInt(ligne.split(",")[0].split("(")[1]);
        // si il y a une recherche en cours les données expirent à la fin de cette construction
    	if(recherche){
            let dataEvo = JSON.parse(localStorage.getItem("outiiil_data")) || {};
            // si on a pas de donné ou que la recherche n'est pas deja enregistré
            if(!dataEvo.hasOwnProperty("recherche")){
                // si on pas les infos en localstorage
                dataEvo.recherche = recherche;
                dataEvo.expRecherche = moment().add(time, 's');
                dataEvo.startRecherche = moment();
                localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
            }
        }
        localStorage.setItem("outiiil_joueur", JSON.stringify(this, ["id", "x", "y", "niveauConstruction", "niveauRecherche"]));
        return this;
    }
    /**
    *
    */
    getParametre()
    {
        let data = JSON.parse(localStorage.getItem("outiiil_parametre")) || {};
		// Si des données sont deja presente et à jour on les charges
        for(let cle in data)
            this._parametre[cle] = new Parametre(data[cle].id, data[cle].libelle, data[cle].type, data[cle].valeur, data[cle].valeurPossible);
        // si pas de données on charge les valeurs par defaut.
        if(!this._parametre.hasOwnProperty("couleur1")) this._parametre["couleur1"] = new Parametre("couleur1", "Couleur de fond", "color", "#d7c384");
        if(!this._parametre.hasOwnProperty("couleur2")) this._parametre["couleur2"] = new Parametre("couleur2", "Couleur secondaire", "color", "#c9ad63");
        if(!this._parametre.hasOwnProperty("couleur3")) this._parametre["couleur3"] = new Parametre("couleur3", "Couleur bordure", "color", "#bd8d46");
        if(!this._parametre.hasOwnProperty("couleurTexte")) this._parametre["couleurTexte"] = new Parametre("couleurTexte", "Couleur du texte", "color", "#000000");
        if(!this._parametre.hasOwnProperty("couleurTitre")) this._parametre["couleurTitre"] = new Parametre("couleurTitre", "Couleur des titres", "color", "#787423");
        if(!this._parametre.hasOwnProperty("toolbarPosition")) this._parametre["toolbarPosition"] = new Parametre("toolbarPosition", "Position des outils", "select", 0, ["Droite", "Bas"]);
        if(!this._parametre.hasOwnProperty("toolbarVisible")) this._parametre["toolbarVisible"] = new Parametre("toolbarVisible", "Outils toujours visible ?", "select", 0, ["Oui", "Non"]);
        if(!this._parametre.hasOwnProperty("boiteShow")) this._parametre["boiteShow"] = new Parametre("boiteShow", "Effet appariation des boites", "select", 0, EFFET);
        if(!this._parametre.hasOwnProperty("boiteHide")) this._parametre["boiteHide"] = new Parametre("boiteHide", "Effet disparition des boites", "select", 0, EFFET);
        if(!this._parametre.hasOwnProperty("sujetMembre")) this._parametre["sujetMembre"] = new Parametre("sujetMembre", "Membre", "input");
        if(!this._parametre.hasOwnProperty("sujetConvoi")) this._parametre["sujetConvoi"] = new Parametre("sujetConvoi", "Convoi", "input");
        if(!this._parametre.hasOwnProperty("sujetCommande")) this._parametre["sujetCommande"] = new Parametre("sujetCommande", "Commande", "input");
        if(!this._parametre.hasOwnProperty("forumAlliance")) this._parametre["forumAlliance"] = new Parametre("forumAlliance", "Alliance", "input");
        if(!this._parametre.hasOwnProperty("methodeFlood")) this._parametre["methodeFlood"] = new Parametre("methodeFlood", "Méthode de flood", "select", 0, METHODE_FLOOD);
        if(!this._parametre.hasOwnProperty("uniteAntisonde")) this._parametre["uniteAntisonde"] = new Parametre("uniteAntisonde", "Antisonde", "number", "0");
        if(!this._parametre.hasOwnProperty("uniteSonde")) this._parametre["uniteSonde"] = new Parametre("uniteSonde", "Sonde", "number", "0");
        if(!this._parametre.hasOwnProperty("couleurChat")) this._parametre["couleurChat"] = new Parametre("couleurChat", "Couleur chat", "color", "#000000");
        return this;
    }
    /**
    *
    */
    getHistorique(id)
    {
        $.get("http://outiiil.fr/fzzz/player/" + Utils.serveur + "/" + $("a[href^='commerce.php?ID=']").attr("href").match(/\d+/g)[0], (data) => {
            // Creation du graphique
            let histoAlliance = new Array(), histoDate = new Array();
            let chart = new Highcharts.Chart({
                chart : {
                    renderTo : id,
                    type : "spline",
                    backgroundColor : null,
                    height : 320
                },
                data : {
                    csv : data,
                    itemDelimiter : ';',
                    parsed : (columns) => {
                        histoDate = columns.slice().splice(0, 1)[0];
                        histoAlliance = columns.splice(1, 1)[0];
                    },
                    firstRowAsNames : false
                },
                title : {text: ''},
                credits : {enabled : false},
                tooltip : {
                    crosshairs : [true],
                    formatter : function(){
                        let s = Highcharts.dateFormat("%A %e %b", new Date(this.x));
                        $.each(this.points, function(){s += "<br/><span style='color:" + this.series.color + "'>\u25CF</span> " + this.series.name + ": <b>" + numeral(this.y).format() + "</b>";});
                        return s;
                    },
                    shared : true,
                    useHTML : true,
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
                    title : {text : null},
                    lineColor : "#333333",
                    gridLineColor : "#333333",
                    labels : {align : "left", x : 0, y : -2, style : {color : "#222222"}}
                },
                series : [
                    {name : "Terrain", color : "#21610B", type : "areaspline"},
                    {name : "Fourmilière", color : "#DF7401", type : "areaspline", visible : false},
                    {name : "Technologie", color : "#FF0000", type : "areaspline", visible : false},
                    {name : "Banni", color : "#6E6E6E", visible : false},
                    {name : "Vacance", color : "#013ADF", visible : false}
                ]
            });
            $("span[id^=o_selectHisto]").click((e) => {
                let chart = $("#o_chartJoueur").highcharts(), histo = $(e.currentTarget).attr("data");
                $("span[id^=o_selectHisto]").removeClass("active");
                $(e.currentTarget).addClass("active");
                if(histo == "all")
                    chart.xAxis[0].update({min : moment("2014-01-01").valueOf()});
                else
                    chart.xAxis[0].update({min : moment().subtract(histo, "days").valueOf()});
                // Style
                $("#o_bouton_range span.active").addClass("ligne_paire");
                $("#o_bouton_range span:not(.active)").removeClass("ligne_paire");
            });
            // ajout d'un tableau pour l'historique des alliance
            if(histoDate.length){
                let html = "", ligne = "", i = 0, nbJour = 0, cDate = moment(histoDate[0]), cTeam = histoAlliance[0], fDate = moment(cDate);
                while(!moment().isSame(cDate, "day")){ // tant qu'on est pas arrivé à aujourd'hui
                    if(moment(histoDate[i]).isSame(cDate, "day")){ // si les dates sont continue
                        if(cTeam != histoAlliance[i]){ // si on a changé d'alli
                            html += `<tr><td class='left'>${fDate.format("DD/MM/YYYY")} -> ${cDate.format("DD/MM/YYYY")} (${(nbJour > 1 ? nbJour + " jours" : nbJour + " jour")})</td><td class='centre'>${cTeam != "0" ? `<a href='/classementAlliance.php?alliance=${cTeam}'>${cTeam}` : "Sans alliance"}</a></td></tr>`;
                            nbJour = 1;
                            cTeam = histoAlliance[i];
                            fDate = moment(cDate).add(1, "days");
                        }else
                            nbJour++;
                        i++;
                    }
                    cDate.add(1, "days");
                }
                if(nbJour != 1)
                    html += `<tr><td class='left'>${fDate.format("DD/MM/YYYY")} -> ${cDate.format("DD/MM/YYYY")} (${(nbJour > 1 ? nbJour + " jours" : nbJour + " jour")})</td><td class='centre'>${cTeam != "0" ? `<a href='/classementAlliance.php?alliance=${cTeam}'>${cTeam}` : "Sans alliance"}</a></td></tr>`;
                $("#" + id).after("<table id='o_historiqueAlliance' cellspacing=0><thead><tr class='gras even'><th>Date</th><th>Alliance</th></tr></thead><tbody>" + html + "</tbody></table>");
                $("#o_historiqueAlliance tr:even").addClass("ligne_paire");
            }
        });
    }
    /**
    *
    */
    getLigneRadar(radar, id)
    {
        let cellTerrain = this.estAttaquable() ? `<a class="gras ${this._mv ? "blue_light" : ""} href="/ennemie.php?Attaquer=${this._id}&lieu=1">${numeral(this._terrain).format()}</a>` : `<span ${this._mv ? `class="blue_light" title="En vacances"` : ""}>${numeral(this._terrain).format()}</span>`;
        $("#" + id).append(`<tr class="lien"><td><a id="o_maj_${this._pseudo}" class='o_actualiser' href=""><img src="${O_ACTUALISER}" alt="rang" height="20"/></a></td><td id="o_nom_${this._pseudo}" class="left" title=""><a class="gras ${this._mv ? "blue_light" : ""}" href="Membre.php?Pseudo=${this._pseudo}">${this._pseudo}</a></td><td id="o_terrain_${this._pseudo}" class="right reduce" title="">${cellTerrain}</td></tr>`);
        // event
        $("#o_maj_" + this._pseudo).click((e) => {
            let oldTerrain = numeral($("#o_terrain_" + this._pseudo).text()).value(), oldMV = this._mv, bSave = false;
            $({deg : 0}).animate({deg : 360}, {duration : 600, step: (now) => {$(e.currentTarget).find("img").css({transform: "rotate(" + now + "deg)"});}});
            this.getProfil().then((data) => {
                this.chargeDataProfil(data);
                // si il y une différence de terrain
                let diff = this._terrain - oldTerrain;
                let cellTerrain = this.estAttaquable() ? `<a class="gras ${this._mv ? "blue_light" : ""} href="/ennemie.php?Attaquer=${this._id}&lieu=1">${numeral(this._terrain).format()}</a>` : `<span ${this._mv ? `class="blue_light" title="En vacances"` : ""}>${numeral(this._terrain).format()}</span>`;
                // si le joueur est sortie de MV ou si il a mis le MV
                if(oldMV != this._mv){
                    $("#o_terrain_" + this._pseudo).html(cellTerrain);
                    if(this._mv)
                        $("#o_nom_" + this._pseudo + " a").addClass("blue_light");
                    else
                        $("#o_nom_" + this._pseudo + " a").removeClass("blue_light");
                    bSave = true;
                }
                if(diff){
                    $("#o_terrain_" + this._pseudo)
                        .html(cellTerrain)
                        .effect("highlight", {color : (diff > 0 ? "#458D58" : "#8D4545")}, 1000)
                        .attr("title", numeral(diff).format())
                        .tooltip({
                            position : {my : "left+10 center", at : "right center"},
                            content : `<span class='${diff > 0 ? "green_light" : "red_xlight"}'>${diff > 0 ? "+ " + $("#o_terrain_" + this._pseudo).attr("title") : $("#o_terrain_" + this._pseudo).attr("title")} cm²</span>`,
                            hide : {effect: "fade", duration: 10},
                            tooltipClass : "warning-tooltip ui-tooltip-right"
                        }).tooltip("open");
                    bSave = true;
                }
                bSave && radar.sauvegarde();
            });
            return false;
        });
        // tooltip vacance...
        $("#o_terrain_" + this._pseudo).tooltip({position : {my : "left+10 center", at : "right center"}, tooltipClass : "warning-tooltip"});
        // creation du tooltip sur les joueurs pour avoir le temps de trajet
        $("#o_nom_" + this._pseudo).tooltip({
            position : {my : "left+10 bottom", at : "right center"},
            content : "NC",
            open : (e, ui) => {
                if(radar.joueurs.hasOwnProperty(this._pseudo)){
                    $(e.currentTarget).tooltip({
                        position : {my : "left+10 center", at : "right center"},
                        content : `<table><tr><td>Temps de trajet</td><td class="right">${Utils.intToTime(radar.joueurs[this._pseudo].getTempsParcours())}</td></tr><td>Retour le</td><td class="right">${moment().add(radar.joueurs[this._pseudo].getTempsParcours(), 's').format("D MMM à HH[h]mm[m]ss[s]")}</td><tr></tr></table>`,
                        hide : {effect: "fade", duration: 10},
                        tooltipClass : "warning-tooltip ui-tooltip-right"
                    });
                }
            },
            hide : {effect: "fade", duration: 10},
			tooltipClass : "warning-tooltip ui-tooltip-right"
        });
    }
}
