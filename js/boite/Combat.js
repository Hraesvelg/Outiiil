/*
 * BoiteCombat.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe permettant d'analyser simuler et lancer des attaques.
*
* @class BoiteCombat
* @constructor
* @extends Boite
*/
class BoiteCombat extends Boite
{
    constructor()
    {
        super("o_boiteCombat", "Outils d'Attaque", `<div id='o_tabsCombat' class='o_tabs'><ul><li><a href='#o_tabsCombat1'>Analyser</a></li><li><a href='#o_tabsCombat2'>Simuler</a></li><li><a href='#o_tabsCombat3'>Multi-flood</a></li><li><a href='#o_tabsCombat4'>Temps de trajet</a></li></ul><div id='o_tabsCombat1'/><div id='o_tabsCombat2'/><div id='o_tabsCombat3'/><div id='o_tabsCombat4'/></div>`);
        /**
        *
        */
        this._armee = null;
        /**
        *
        */
        this._coordonnees = {};
    }
	/**
    * Affiche la boite.
    *
    * @private
    * @method afficher
    */
	afficher()
	{
        if(super.afficher()){
            $("#o_tabsCombat").tabs({disabled: [2], activate : (e ,ui) => {this.css();}}).removeClass("ui-widget");
            this.analyser().simuler().calculatrice().css().event();
        }
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
        super.css();
        $("#o_resultatCombat tr:even, .o_tabs .ui-widget-header .ui-tabs-anchor, #o_calculatriceCombat tr:even").css("background-color", monProfil.parametre["couleur2"].valeur);
        $(".o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", monProfil.parametre["couleur2"].valeur);
        $(".o_content a").unbind("mouseenter mouseleave").css("color", monProfil.parametre["couleurTexte"].valeur);
        $(".o_content li:not(.ui-state-active) a").css("color", "inherit")
        let matches = monProfil.parametre["couleurTexte"].valeur.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i);
        $(".o_content li:not(.ui-state-active):not(.ui-state-disabled) a").hover(
            (e) => {$(e.currentTarget).css("color", "rgba(" + matches.slice(1).map((m) => {return parseInt(m, 16);}).concat('0.5') + ")");},
            (e) => {$(e.currentTarget).css("color", "inherit");}
        );
        $(".o_content .ui-state-disabled a").css({cursor : "not-allowed", "pointer-events" : "all"});
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
        super.event();
        return this;
	}
    /**
	* Formulaire pour analyser une rapport de combat.
    *
	* @private
	* @method analyse
	*/
	analyser()
	{
		$("#o_tabsCombat1").append("<textarea id='o_rcCombat' class='o_maxWidth' placeholder='Rapport de combat...'></textarea><div class='o_marginT15' style='max-height:200px;overflow:auto'><table id='o_resultatCombat' class='o_maxWidth'></table></div>");
        return this.eventAnalyser();
    }
    /**
    *
    */
    eventAnalyser()
    {
        // event Analyse
        $("#o_rcCombat").on("input", (e) => {
			let combat = new Combat({RC : e.currentTarget.value});
			if(combat.analyse()){
                $("#o_resultatCombat").html(combat.toHTMLBoite());
                this.css();
            }else
                $.toast({...TOAST_WARNING, text : "Le rapport de combat ne peut pas être analysé."});
		});
        return this;
    }
    /**
    *
    */
    simuler()
    {
        let html = `<table id="o_simulateur">
            <tr><td valign="top">
                <table id="o_simulateurArmee">
                <tr style="display:none"><td id="o_switchAvantApres" colspan="5" class="centre">Avant combat / Après combat</td></td></tr>
                <tr class="gras"><td><span id="o_placementAtt" class="cursor">${IMG_FLECHE} Attaquant ${IMG_FLECHE}</span> <span id="o_copierAtt">${IMG_COPY}</span></td><td colspan="3"><span id="o_switchArmee" class="cursor">${IMG_GAUCHE}  ${IMG_DROITE}</span></td><td><span id="o_copierDef">${IMG_COPY}</span> <span id="o_placementDef" class="cursor">${IMG_FLECHE} Défenseur ${IMG_FLECHE}</span></td>
                <tr><td><input value='0' size='12' name='o_unite1_1'/></td><td colspan="3">${NOM_UNITE[1]}</td><td><input value='0' size='12' name='o_unite2_1'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_2'/></td><td colspan="3">${NOM_UNITE[2]}</td><td><input value='0' size='12' name='o_unite2_2'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_3'/></td><td colspan="3">${NOM_UNITE[3]}</td><td><input value='0' size='12' name='o_unite2_3'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_4'/></td><td colspan="3">${NOM_UNITE[4]}</td><td><input value='0' size='12' name='o_unite2_4'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_5'/></td><td colspan="3">${NOM_UNITE[5]}</td><td><input value='0' size='12' name='o_unite2_5'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_6'/></td><td colspan="3">${NOM_UNITE[6]}</td><td><input value='0' size='12' name='o_unite2_6'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_7'/></td><td colspan="3">${NOM_UNITE[7]}</td><td><input value='0' size='12' name='o_unite2_7'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_8'/></td><td colspan="3">${NOM_UNITE[8]}</td><td><input value='0' size='12' name='o_unite2_8'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_9'/></td><td colspan="3">${NOM_UNITE[9]}</td><td><input value='0' size='12' name='o_unite2_9'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_10'/></td><td colspan="3">${NOM_UNITE[10]}</td><td><input value='0' size='12' name='o_unite2_10'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_11'/></td><td colspan="3">${NOM_UNITE[11]}</td><td><input value='0' size='12' name='o_unite2_11'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_12'/></td><td colspan="3">${NOM_UNITE[12]}</td><td><input value='0' size='12' name='o_unite2_12'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_13'/></td><td colspan="3">${NOM_UNITE[13]}</td><td><input value='0' size='12' name='o_unite2_13'/></td></tr>
                <tr><td><input value='0' size='12' name='o_unite1_14'/></td><td colspan="3">${NOM_UNITE[14]}</td><td><input value='0' size='12' name='o_unite2_14'/></td></tr>
                <tr><td id="o_vieAtt" class="right">0</td><td>${IMG_VIE}</td><td>Vie</td><td>${IMG_VIE}</td><td id="o_vieDef" class="right">0</td></tr>
                <tr><td id="o_degatAtt" class="right">0</td><td>${IMG_ATT}</td><td>Dégât</td><td>${IMG_DEF}</td><td id="o_degatDef" class="right">0</td></tr>
                </table>
            </td><td valign="top">
                <table id="o_simulateurNiveau">
                <tr class="gras entete"><td id="o_bonusAtt" class="cursor">${IMG_FLECHE} Attaquant ${IMG_FLECHE}</td><td colspan="2"></td><td id="o_bonusDef" class="cursor">${IMG_FLECHE} Défenseur ${IMG_FLECHE}</td>
                <tr><td><input id="o_bouclier1" value='${monProfil.niveauRecherche[1]}' size='6' name='o_bouclier1'/></td><td colspan="2">Bouclier</td><td><input id="o_bouclier2" value='${monProfil.niveauRecherche[1]}' size='6' name='o_bouclier2'/></td></tr>
                <tr><td><input id="o_armes1" value='${monProfil.niveauRecherche[2]}' size='6' name='o_armes1'/></td><td colspan="2">Armes</td><td><input id="o_armes2" value='${monProfil.niveauRecherche[2]}' size='6' name='o_armes2'/></td></tr>
                <tr><td><input id="o_etable1" value='${monProfil.niveauConstruction[12]}' size='6' name='o_etable1'/></td><td colspan="2">Etable à cochenilles</td><td><input id="o_etable2" value='${monProfil.niveauConstruction[12]}' size='6' name='o_etable2'/></td></tr>
                <tr><td colspan="4" height="20"></td></tr>
                <tr class="gras entete centre"><td id="o_bonusLieu" colspan="4" class="cursor">${IMG_FLECHE} Lieu ${IMG_FLECHE}</td></tr>
                <tr><td></td><td class="right"><input id="o_terrain" type="radio" name="o_lieu" value="${LIEU.TERRAIN}" checked></td><td class="left">Terrain</td><td></td></tr>
                <tr><td></td><td class="right"><input id="o_dome" type="radio" value="${LIEU.DOME}" name="o_lieu"></td><td class="left">Dome</td><td><input id="o_domeNiveau" value='${monProfil.niveauConstruction[9]}' size='6' name='o_dome'/></td></tr>
                <tr><td></td><td class="right"><input id="o_loge" type="radio" value="${LIEU.LOGE}" name="o_lieu"></td><td class="left">Loge</td><td><input id="o_logeNiveau" value='${monProfil.niveauConstruction[10]}' size='6' name='o_loge'/></td></tr>
                <tr><td colspan="4" height="20"></td></td></tr>
                <tr class="gras entete centre"><td colspan="5">Position</td></tr>
                <tr><td id="o_positionAtt" class="gras">Attaquant</td><td colspan="2"><div id="o_positionJoueur"></div></td><td id="o_positionDef">Défenseur</td></tr>
                <tr><td colspan="4" height="20"></td></td></tr>
                <tr><td colspan="4" class="centre"><button id="o_simuler" class="o_button">Simuler</button></td></td></tr>
                </table>
            </td></tr>
            </table>`;
        $("#o_tabsCombat2").append(html);
        // spinner
        $("#o_simulateurArmee input").spinner({min : 0, numberFormat : "i"});
        $("#o_bouclier1, #o_armes1, #o_bouclier2, #o_armes2, #o_etable1, #o_etable2").spinner({min : 0, max : 50, numberFormat: "d2"});
        $("#o_logeNiveau, #o_domeNiveau").spinner({min : 0, max : 50, numberFormat: "d2"});
        $("#o_positionJoueur").slider({
            min: 0,
            max : 1,
            change : (e, ui) => {
                if(ui.value){ // si != 0 alors on est defenseur
                    $("#o_positionAtt").removeClass("gras");
                    $("#o_positionDef").addClass("gras");
                }else{ // sinon on est attaquant
                    $("#o_positionDef").removeClass("gras");
                    $("#o_positionAtt").addClass("gras");
                }
            }
        });
        return this.eventSimulateur();
    }
    /**
    *
    */
    eventSimulateur()
    {
        $("#o_simulateurArmee input").on("input spin", (e, ui) => {
			let nombre = numeral(ui ? ui.value : e.currentTarget.value).value();
            let name = $(e.currentTarget).attr("name"), armee = new Armee();
            // si le name contient 1 c'est l'attaquant sinon la defense
            if(name.includes("1_"))
                this.actualiserStatistique(name, nombre);
            else
                this.actualiserStatistique("", 0, name, nombre);
            $(e.currentTarget).spinner("value", nombre);
		});
        $("#o_placementAtt").click((e) => {
            if(this._armee)
                this.placerArmee(1).actualiserStatistique();
            else{
                this._armee = new Armee();
                this._armee.getArmee().then((data) => {
                    this._armee.chargeData(data);
                    this.placerArmee(1).actualiserStatistique();
                });
            }
            return false;
        });
        $("#o_placementDef").click((e) => {
            if(this._armee)
                this.placerArmee(0).actualiserStatistique();
            else{
                this._armee = new Armee();
                this._armee.getArmee().then((data) => {
                    this._armee.chargeData(data);
                    this.placerArmee(0).actualiserStatistique();
                });
            }
            return false;
        });
        $("#o_switchArmee").click((e) => {
            this.permuterArmee().actualiserStatistique();
            return false;
        });
        $("#o_copierAtt").click((e) => {this.copierCollerArmee("ATT");});
        $("#o_copierDef").click((e) => {this.copierCollerArmee("DEF");});
        // event sur les bonus joueurs
        $("#o_bonusAtt").click((e) => {
            $("#o_armes1").spinner("value", $("#o_armes1").spinner("value") == monProfil.niveauRecherche[2] ? 0 : monProfil.niveauRecherche[2]);
            $("#o_bouclier1").spinner("value", $("#o_bouclier1").spinner("value") == monProfil.niveauRecherche[1] ? 0 : monProfil.niveauRecherche[1]);
            $("#o_etable1").spinner("value", $("#o_etable1").spinner("value") == monProfil.niveauConstruction[12] ? 0 : monProfil.niveauConstruction[12]);
            this.actualiserStatistique();
            return false;
        });
        $("#o_bonusDef").click((e) => {
            $("#o_armes2").spinner("value", $("#o_armes2").spinner("value") ==  monProfil.niveauRecherche[2] ? 0 : monProfil.niveauRecherche[2]);
            $("#o_bouclier2").spinner("value", $("#o_bouclier2").spinner("value") == monProfil.niveauRecherche[1] ? 0 : monProfil.niveauRecherche[1]);
            $("#o_etable2").spinner("value", $("#o_etable2").spinner("value") == monProfil.niveauConstruction[12] ? 0 : monProfil.niveauConstruction[12]);
            this.actualiserStatistique();
            return false;
        });
        $("#o_bouclier1").on("input spin", (e, ui) => {this.actualiserStatistique("", 0, "", 0, numeral(ui ? ui.value : e.currentTarget.value).value());});
        $("#o_armes1").on("input spin", (e, ui) => {this.actualiserStatistique("", 0, "", 0, -1, numeral(ui ? ui.value : e.currentTarget.value).value());});
        $("#o_bouclier2").on("input spin", (e, ui) => {this.actualiserStatistique("", 0, "", 0, -1, -1, numeral(ui ? ui.value : e.currentTarget.value).value());});
        $("#o_armes2").on("input spin", (e, ui) => {this.actualiserStatistique("", 0, "", 0, -1, -1, -1, numeral(ui ? ui.value : e.currentTarget.value).value());});
        // event bonus lieu
        $("#o_simulateurNiveau input[name='o_lieu']").change((e) => {this.actualiserStatistique();});
        $("#o_bonusLieu").click((e) => {
            $("#o_domeNiveau").spinner("value", $("#o_domeNiveau").spinner("value") == monProfil.niveauConstruction[9] ? 0 : monProfil.niveauConstruction[9]);
            $("#o_logeNiveau").spinner("value", $("#o_logeNiveau").spinner("value") == monProfil.niveauConstruction[10] ? 0 : monProfil.niveauConstruction[10]);
            this.actualiserStatistique();
            return false;
        });
        $("#o_domeNiveau").on("input spin", (e, ui) => {this.actualiserStatistique("", 0, "", 0, -1, -1, -1, -1, numeral(ui ? ui.value : e.currentTarget.value).value());});
        $("#o_logeNiveau").on("input spin", (e, ui) => {this.actualiserStatistique("", 0, "", 0, -1, -1, -1, -1, -1, numeral(ui ? ui.value : e.currentTarget.value).value());});
        $("#o_simuler").click((e) => {
            this.lancerSimulation();
            return false;
        });
        return this;
    }
    /**
    *
    */
    lancerSimulation()
    {
        let uniteATT = {}, uniteDef = {};
        // données attaquant
        $("#o_simulateurArmee tr:gt(1)").find("input:eq(0)").each((i, elt) => {uniteATT[NOM_UNITE[i + 1]] = $(elt).spinner("value");});
        // données defenseur
        $("#o_simulateurArmee tr:gt(1)").find("input:eq(1)").each((i, elt) => {uniteDef[NOM_UNITE[i + 1]] = $(elt).spinner("value");});
        // preparation du combat
        let combat = new Combat({id : moment().valueOf(),lieu : $("input[name='o_lieu']:checked").val(), attaquant : new Armee({unite : uniteATT}), defenseur : new Armee({unite : uniteDef}), pointDeVue : $("#o_positionJoueur").slider("value")});
        // modification des niveaux des joueurs
        combat.attaquant.niveauRecherche[1] = $("#o_bouclier1").spinner("value");
        combat.attaquant.niveauRecherche[2] = $("#o_armes1").spinner("value");
        combat.defenseur.niveauRecherche[1] = $("#o_bouclier2").spinner("value");
        combat.defenseur.niveauRecherche[2] = $("#o_armes2").spinner("value");
        combat.defenseur.niveauConstruction[9] = $("#o_domeNiveau").spinner("value");
        combat.defenseur.niveauConstruction[10] = $("#o_logeNiveau").spinner("value");
        // lancement du combat
        if(combat.armee1.getSommeUnite() && combat.armee2.getSommeUnite()){
            combat.simuler().genererRC();
            // affichage des armées retours dans le formulaire
            for(let i = 0 ; i < 14 ; i++){
                $("input[name='o_unite1_" + (i + 1) + "']").spinner("value", combat.armee1Ap.unite[i]);
                $("input[name='o_unite2_" + (i + 1) + "']").spinner("value", combat.armee2Ap.unite[i]);
            }
            this.actualiserStatistique();
            // ajout de l'event pour switch les armées avant et aprés combat
            $("#o_switchAvantApres").off().click((e) => {
                let armeeAttTmp = new Array(), armeeDefTmp = new Array();
                for(let i = 0 ; i < 14 ; i++){
                    armeeAttTmp.push($("input[name='o_unite1_" + (i + 1) + "']").spinner("value"));
                    armeeDefTmp.push($("input[name='o_unite2_" + (i + 1) + "']").spinner("value"));
                }
                // si dans le formulaire on a l'armée aprés on plalce l'armée avant sinon l'armée aprés
                if(combat.armee1Ap.unite.every((elt, i) => {return elt == armeeAttTmp[i];}) && combat.armee2Ap.unite.every((elt, i) => {return elt == armeeDefTmp[i];})){
                    for(let i = 0 ; i < 14 ; i++){
                        $("input[name='o_unite1_" + (i + 1) + "']").spinner("value", combat.armee1.unite[i]);
                        $("input[name='o_unite2_" + (i + 1) + "']").spinner("value", combat.armee2.unite[i]);
                    }
                }else{
                    for(let i = 0 ; i < 14 ; i++){
                        $("input[name='o_unite1_" + (i + 1) + "']").spinner("value", combat.armee1Ap.unite[i]);
                        $("input[name='o_unite2_" + (i + 1) + "']").spinner("value", combat.armee2Ap.unite[i]);
                    }
                }
                this.actualiserStatistique();
            }).parent().show();
        }else
            $.toast({...TOAST_ERROR, text : "Le combat ne peut pas etre simulé : aucune unité."});
        return this;
    }
    /**
    *
    */
    placerArmee(position)
    {
        let armeeTmp = new Array();
        if(position){
            // on prepare un tableau des unités pour savoir si on renseigne l'armée ou on vide des champs
            for(let i = 0 ; i < this._armee.unite.length ; i++) armeeTmp.push($(`#o_simulateurArmee tr:eq(${i + 1}) input:eq(0)`).spinner("value"));
            if(this._armee.unite.every((elt, i) => {return elt == armeeTmp[i];})){
                for(let i = 0 ; i < this._armee.unite.length ; i++)
                    $(`#o_simulateurArmee tr:eq(${i + 2}) input:eq(0)`).spinner("value", 0);
            }else{
                for(let i = 0 ; i < this._armee.unite.length ; i++)
                    $(`#o_simulateurArmee tr:eq(${i + 2}) input:eq(0)`).spinner("value", this._armee.unite[i]);
            }
        }else{
            for(let i = 0 ; i < this._armee.unite.length ; i++) armeeTmp.push($(`#o_simulateurArmee tr:eq(${i + 1}) input:eq(1)`).spinner("value"));
            if(this._armee.unite.every((elt, i) => {return elt == armeeTmp[i];})){
                for(let i = 0 ; i < this._armee.unite.length ; i++)
                    $(`#o_simulateurArmee tr:eq(${i + 2}) input:eq(1)`).spinner("value", 0);
            }else{
                for(let i = 0 ; i < this._armee.unite.length ; i++)
                    $(`#o_simulateurArmee tr:eq(${i + 2}) input:eq(1)`).spinner("value", this._armee.unite[i]);
            }
        }
        return this;
    }
    /**
    *
    */
    permuterArmee()
    {
        // switch des armées
        for(let i = 0 ; i < 14 ; i++){
            let valueTmp = $("input[name='o_unite1_" + (i + 1) + "']").spinner("value");
            $("input[name='o_unite1_" + (i + 1) + "']").spinner("value", $("input[name='o_unite2_" + (i + 1) + "']").spinner("value"));
            $("input[name='o_unite2_" + (i + 1) + "']").spinner("value", valueTmp);
        }
        // switch des bonus
        let tmpBonusArme = $("#o_armes1").spinner("value"), tmpBonusBouclier = $("#o_bouclier1").spinner("value");
        $("#o_armes1").spinner("value", $("#o_armes2").spinner("value"));
        $("#o_bouclier1").spinner("value", $("#o_bouclier2").spinner("value"));
        $("#o_armes2").spinner("value", tmpBonusArme);
        $("#o_bouclier2").spinner("value", tmpBonusBouclier);
        // switch de la position
        let tmpPosition = $("#o_positionJoueur").slider("option", "value");
        $("#o_positionJoueur").slider("option", "value", 1 - tmpPosition);
        return this;
    }
    /**
    *
    */
    actualiserStatistique(nameAtt = "", valueAtt = 0, nameDef = "", valueDef = 0, bouclier1 = -1, armes1 = -1, bouclier2 = -1, armes2 = -1, niveauDome = -1, niveauLoge = -1)
    {
        let armesAtt = armes1 != -1 ? armes1 : $("#o_armes1").spinner("value"), bouclierAtt = bouclier1 != -1 ? bouclier1 : $("#o_bouclier1").spinner("value");
        let armesDef = armes2 != -1 ? armes2 : $("#o_armes2").spinner("value"), bouclierDef = bouclier2 != -1 ? bouclier2 : $("#o_bouclier2").spinner("value");
        let lieu = parseInt($("#o_simulateurNiveau input[name='o_lieu']:checked").val()), bonusLieu = 0;
        switch(lieu){
            case LIEU.DOME :
                bonusLieu = niveauDome != -1 ? niveauDome : $("#o_domeNiveau").spinner("value");
                break;
            case LIEU.LOGE :
                bonusLieu = niveauLoge != -1 ? niveauLoge : $("#o_logeNiveau").spinner("value");
                break;
            default :
                break;
        }
        let armee = new Armee();
        // données attaquant
        $("#o_simulateurArmee tr:gt(1)").find("input:eq(0)").each((i, elt) => {armee.unite[i] = $(elt).attr("name") == nameAtt ? valueAtt : $(elt).spinner("value");});
        $("#o_vieAtt").text(numeral(armee.getTotalVie(bouclierAtt)).format());
        $("#o_degatAtt").text(numeral(armee.getTotalAtt(armesAtt)).format());
        // données defenseur
        armee = new Armee();
        $("#o_simulateurArmee tr:gt(1)").find("input:eq(1)").each((i, elt) => {armee.unite[i] = $(elt).attr("name") == nameDef ? valueDef : $(elt).spinner("value");});
        $("#o_vieDef").text(numeral(armee.getTotalVie(bouclierDef, lieu, bonusLieu)).format());
        $("#o_degatDef").text(numeral(armee.getTotalDef(armesDef)).format());
        return this;
    }
    /**
    *
    */
    copierCollerArmee(position)
    {
        if($("#o_divccarmee").length){
            $("#o_divccarmee").show();
            $("#o_camp").val(position);
        }else{
            $("body").append(`<div class="voile" id="o_divccarmee">
                <div class="message_voile">
                    <input type="hidden" id="o_camp" value="${position}"/>Importer une Armée
                    <textarea id="o_textAreaArmee" name="textAreaArmee" rows="9" cols="50" style="width:100%;"></textarea>
                    <p>
                        <input id="o_annulerCopie" type="button" value="Annuler"/>
                        <input id="o_afficherAide" type="button" value="Aide"/>
                        <input id="o_importerArmee" type="button" value="Valider" />
                    </p>
                    <p id="o_aideCopierArmee" style="text-align:left; font-size: 0.8em;display:none">
                        Vous pouvez importer une armée de plusieurs façons :
                        <br/>- Ecrire directement une phrase : je veux 30 jsn et 27 artilleuses et encore 50 jeunes soldates naines.
                        <br/>- Copiez une armée de Fourmizzz (Rapport de combat, Page Armée, Armée en attaque...).
                        <br/>- Copiez un fichier Excel.
                        <br/><br/>Vous pouvez utiliser certaines abréviations :
                        <br/>- Pour les armées : jsn, sn, ne, js, s, c, ce, a, ae, se, ta ou tk, tae ou tke, tu, tue.
                        <br/>- Pour les nombres : k ou kilo, M ou mega, G ou giga, T ou tera.
                    </p>
                </div>
            </div>`);
            // event
            $("#o_annulerCopie").click((e) => {
                $("#o_divccarmee").hide();
                $("#o_textAreaArmee").val("");
                return false;
            });
            $("#o_afficherAide").click((e) => {
                $("#o_aideCopierArmee").is(":visible") ? $("#o_aideCopierArmee").hide() : $("#o_aideCopierArmee").show();
                return false;
            });
            $("#o_importerArmee").click((e) => {
                let armee = new Armee(), camp = $("#o_camp").val() == "ATT" ? 1 : 2;
                armee.parseArmee($("#o_textAreaArmee").val());
                for(let i = 0 ; i < armee.unite.length ; i++)
                    $("input[name='o_unite" + camp + "_" + (i + 1) + "']").spinner("value", armee.unite[i]);
                $("#o_divccarmee").hide();
                $("#o_textAreaArmee").val("");
                this.actualiserStatistique();
                return false;
            });
        }
    }
	/**
	* Affiche une calculatrice pour calculer les temps de trajets, les horraires.
    *
	* @private
	* @method calculatrice
	*/
	calculatrice()
	{
        let html = `<table id="o_calculatriceCombat" class="centre">
            <thead><tr><th id="o_placementJ" class="cursor" colspan="2">${IMG_FLECHE} Joueur 1 ${IMG_FLECHE}</th><th></th><th>Joueur ou Alliance</th></tr></thead>
            <tr><td></td><td><input type="text" id="o_pseudoTemps" placeholder="Pseudo"/></td><td>-></td><td><input type="text" id="o_cibleJoueurTemps" placeholder="Pseudo1, Pseudo2..."/> <input type="text" id="o_cibleTagTemps" placeholder="tag1, tag2..."/></td></tr>
            <tr><td>Vitesse d'attaque</td><td><input type="number" id="o_vaTemps" value="0" min="0" max="50"/></td><td></td><td></td></tr>
            <tr><td>Dernier mouvement</td><td><input id="o_dernierMvt" placeholder="JJ-MM-AAAA HH:mm"/></td><td></td><td><button id="o_calculerTemps">Calculer</button></td></tr>
            <tr class="reduce"><td colspan="4"><em>Le temps maximal d'un trajet est de <span id="o_indicationTemps">${this.calculerLimiteTemps(0)}</span>.</em></td></tr>
            </table>`;
		$("#o_tabsCombat4").append(html);
        return this.eventCalculatrice();
	}
    /**
    *
    */
    eventCalculatrice()
    {
        $("#o_placementJ").click(() => {
            // si les infos sont deja renseigné on vide
            if($("#o_pseudoTemps").val() == monProfil.pseudo){
                $("#o_pseudoTemps").val("");
                $("#o_vaTemps").val(0);
                $("#o_indicationTemps").text(this.calculerLimiteTemps(0));
            }else{
                $("#o_pseudoTemps").val(monProfil.pseudo);
                $("#o_vaTemps").val(monProfil.niveauRecherche[6]);
                $("#o_indicationTemps").text(this.calculerLimiteTemps(monProfil.niveauRecherche[6]));
            }
        });
        $("#o_pseudoTemps").autocomplete({
            source : (request, response) => {
                Joueur.rechercher(request.term).then((data) => {response(Utils.extraitRecherche(data, true, false));});
            },
            position : {my : "left top-5", at : "left bottom"},
            minLength : 3
        });
        $("#o_cibleJoueurTemps").autocomplete({
            source : (request, response) => {Alliance.rechercher(request.term.split(/,\s*/g).pop()).then((data) => {response(Utils.extraitRecherche(data, true, false));});},
            position : {my : "left top-6", at : "left bottom"},
            minLength : 2,
            focus : function(){return false;},
            select : function(event, ui){
                let terms = this.value.split(/,\s*/g);
                terms.pop();
                terms.push(ui.item.value);
                terms.push("");
                this.value = terms.join(", ");
                return false;
            }
        });
        $("#o_cibleTagTemps").autocomplete({
            source : (request, response) => {Alliance.rechercher(request.term.split(/,\s*/g).pop()).then((data) => {response(Utils.extraitRecherche(data, false));});},
            position : {my : "left top-6", at : "left bottom"},
            minLength : 0,
            focus : function(){return false;},
            select : function(event, ui){
                let terms = this.value.split(/,\s*/g);
                terms.pop();
                terms.push(ui.item.tag);
                terms.push("");
                this.value = terms.join(", ");
                return false;
            }
        }).data("ui-autocomplete")._renderItem = (ul, item) => {
            let style = '';
            return $("<li>").append(`<a style="${style}">${item.value_avec_html}</a>`).appendTo(ul);
        };
        $("#o_dernierMvt").datetimepicker({
            ...DATEPICKER_OPTION, dateFormat : "dd-mm-yy", timeFormat : "HH:mm", timeText : "Horaire", hourText : "Heure", minuteText : "Minute"
        });
        $("#o_vaTemps").on("input", (e) => {$("#o_indicationTemps").text(this.calculerLimiteTemps($(e.currentTarget).val()));});
        $("#o_calculerTemps").click(() => {
            let ref = new Joueur({pseudo : $("#o_pseudoTemps").val()});
            ref.niveauRecherche[6] = $("#o_vaTemps").val();
            // si pas de referentiel on ne peut rien calculer
            if(!ref.pseudo){
                $.toast({...TOAST_ERROR, text : "Le joueur 1 n'est pas renseigné."});
                return false;
            }
            // preparation des joueurs
            let joueurs = new Array(), alliances = new Array();
            for(let i = 0, tmp = $("#o_cibleJoueurTemps").val().split(", ") ; i < tmp.length ; i++)
                if(tmp[i])
                    joueurs.push(new Joueur({pseudo : tmp[i]}));
            // preparation des alliances
            for(let i = 0, tmp = $("#o_cibleTagTemps").val().split(", ") ; i < tmp.length ; i++)
                if(tmp[i])
                    alliances.push(new Alliance({tag : tmp[i]}));

            if(!joueurs.length && !alliances.length){
                $.toast({...TOAST_ERROR, text : "Vous n'avez pas renseigné de joueur ni d'alliance pour lancer le calcul."});
            }else{
                if(!$("#o_infosTemps").length) this.afficherTemps();
                this.calculerTemps(ref, joueurs, alliances, $("#o_dernierMvt").val());
            }
            return false;
        });
        return this;
    }
    /**
    *
    */
    calculerLimiteTemps(va)
    {
        return Utils.intToTime(Math.pow(0.9, va) * 637200);
    }
    /**
    *
    */
    calculerTemps(ref, joueurs, alliances, dernierMvt = "")
    {
        // promise pour recupérer les joueurs et leurs coordonnées
        let promise = new Array();
        // promise pour recup les coordonnées
        if(!Object.keys(this._coordonnees).length) promise.push($.get("http://outiiil.fr/fzzz/" + Utils.serveur + "/map"));
        // promise qui recup le profil du ref
        if(!ref.estJoueurCourant()) promise.push(ref.getProfil());
        // promise pour recup les joueurs et les descriptions d'alliance
        for(let joueur of joueurs) promise.push(joueur.getProfil());
        for(let alliance of alliances) promise.push(alliance.getDescription());
        // Execution des requetes
        Promise.all(promise).then((values) => {
            let rows = new Array(), ind = 0;
            // on extrait les coordonnées
            if(!Object.keys(this._coordonnees).length){
                let donnees = JSON.parse(values[ind]);
                for(let i = 0, l = donnees.message.split("\n") ; i < l.length ; i++){
                    let tmp = l[i].split(";");
                    this._coordonnees[tmp[1]] = {x : parseInt(tmp[3]), y : parseInt(tmp[2])};
                }
                ind++;
            }
            // charge les donnes du ref
            if(!ref.estJoueurCourant()){
                ref.chargerProfil(values[ind]);
                ind++;
            }
            // on calcule les temps de trajet vers les joueurs
            for(let i = 0 ; i < joueurs.length ; i++){
                joueurs[i].chargerProfil(values[i + ind]);
                let tempsP = ref.getTempsParcours2(joueurs[i]);
                rows.push($(`<tr><td>${joueurs[i].pseudo}</td><td>${numeral(joueurs[i].terrain).format()}</td><td>${Utils.intToTime(tempsP)}</td><td>${dernierMvt ? moment(dernierMvt, "DD-MM-YYYY HH:mm").add(tempsP, 's').format("D MMM à HH[h]mm[m]ss[s]") : ""}</td></tr>`)[0]);
            }
            // on recup les pseudos des alliances
            for(let i = 0 ; i < alliances.length ; i++){
                $(values[i + ind + joueurs.length]).find("#tabMembresAlliance tr:gt(0)").each((j, elt) => {
                    let pseudo = $(elt).find("td:eq(2)").text(), terrain = numeral($(elt).find("td:eq(4)").text()).value();
                    if(this._coordonnees.hasOwnProperty(pseudo)){
                        let tempsP = ref.getTempsParcours(this._coordonnees[pseudo].x, this._coordonnees[pseudo].y);
                        rows.push($(`<tr><td>${pseudo}</td><td>${numeral(terrain).format()}</td><td>${Utils.intToTime(tempsP)}</td><td>${dernierMvt ? moment(dernierMvt, "DD-MM-YYYY HH:mm").add(tempsP, 's').format("D MMM à HH[h]mm[m]ss[s]") : ""}</td></tr>`)[0]);
                    }
                });
            }
            // affichage du tableau des distances
            $("#o_infosTemps").DataTable().clear().rows.add(rows).draw();
        });
        return this;
    }
    /**
    *
    */
    afficherTemps()
    {
        $("#o_tabsCombat4").append(`<br/><table id='o_infosTemps'><thead style="background-color:${monProfil.parametre["couleur2"].valeur}"><tr><th>Pseudo</th><th>Terrain</th><th>Temps de trajet</th><th>Retour le</th></tr></thead></table>`);
        $("#o_infosTemps").DataTable({
            bInfo : false,
            bAutoWidth : false,
            dom : "Bfrtip",
            buttons : ["copyHtml5", "csvHtml5", "excelHtml5"],
            pageLength: 15,
            responsive : true,
            order : [[1, "desc"]],
            language : {
                zeroRecords : "Aucune information trouvée",
                infoEmpty : "Aucun enregistrement",
                infoFiltered : "(Filtré par _MAX_ enregistrements)",
                search : "Rechercher : ",
                paginate : {
                    previous : "Préc.",
                    next : "Suiv."
                }
            },
            columnDefs : [
                {type : "quantite-grade", targets : 1, visible: false},
                {type : "moment-D MMM YYYY", targets : 3},
                {type : "time-unformat", targets : 2},
            ],
            rowCallback : (row, data, index) => {
                $(row).css("background-color", index % 2 == 0 ? "inherit" : monProfil.parametre["couleur2"].valeur);
            },
            drawCallback : (settings) => {
                $(".o_content a, .o_content table, .o_content label").css("color", monProfil.parametre["couleurTexte"].valeur);
            }
        });
        return this;
    }
}

