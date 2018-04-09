/*
 * Laboratoire.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /laboratoire.php.
*
* @class PageLaboratoire
* @constructor
*/
class PageLaboratoire
{
    constructor()
    {
        /**
        *
        */
        this._boiteComptePlus = new BoiteComptePlus();
        /**
        *
        */
        this._armee = new Armee();
        this._armee.getArmee().then((data) => {
            this._armee.chargeData(data);
            // Affichage de la rentabilité du bouclier
            this.titleBouclier();
            // Affichage de la rentabilité de l'armes
            this.titleArmes();
        });
        // Sauvegarde recherche
        if(!Utils.comptePlus) this.plus();
    }
    /**
    * Ajoute un title detaillé pour connaitre la rentabilité du niveau bouclier.
    *
    * @private
    * @method titleBouclier
    */
    titleBouclier()
    {
        let vieAB = this._armee.getBaseVie() + this._armee.getBonusVie(monProfil.niveauRecherche[1]);
		let tOuv = numeral($(".ligneAmelioration:eq(1)").find(".ouvriere").text()).value() * (TEMPS_UNITE[0] * Math.pow(0.9, monProfil.getTDP()));
        let apportPonte = Math.round(parseInt(tOuv / (TEMPS_UNITE[1] * Math.pow(0.9, monProfil.getTDP()))) * (8 + 8 * monProfil.niveauRecherche[1] / 10));
        let vieABSupp = this._armee.getBaseVie() + this._armee.getBonusVie(monProfil.niveauRecherche[1] + 1);
        let bLigneGras = vieAB + apportPonte >= vieABSupp ? true : false;
        let title = `<table>
            <tr><td>Vie AB actuelle</td><td class='right'>${numeral(vieAB).format()}</td></tr>
            <tr${(bLigneGras ? " class='gras' " : "")}><td>Vie AB + ponte JSN</td><td class='right' style='padding-left:10px'>${numeral(vieAB + apportPonte).format()} (+ ${numeral(apportPonte).format()})</td></tr>
            <tr${(!bLigneGras ? " class='gras' " : "")}><td>Vie AB niveau ${(monProfil.niveauRecherche[1] + 1)}</td><td class='right'>${numeral(vieABSupp).format()} (+ ${numeral(vieABSupp - vieAB).format()})</td></tr>
            </table>`;
        $(".cout_amelioration:eq(1) table").prepend("<tr class='centre'><td colspan='2' id='o_rentabiliteBouclier' title=''>Rentabilité</td></tr>");
        $("#o_rentabiliteBouclier").tooltip({
            position : {my : "right+15 top", at : "left center"},
            content : title,
            tooltipClass : "ui-tooltip-brown ui-tooltip-lightBrown"
        });
    }
    /**
    * Ajoute un title detaillé pour connaitre la rentabilité du niveau d'armes.
    *
    * @private
    * @method titleArmes
    */
    titleArmes()
    {
        let attAB = this._armee.getTotalAtt(monProfil.niveauRecherche[2]);
		let tOuv = numeral($(".ligneAmelioration:eq(2)").find(".ouvriere").text()).value() * (TEMPS_UNITE[0] * Math.pow(0.9, monProfil.getTDP()));
        let apportPonteJS = Math.round(parseInt(tOuv / (TEMPS_UNITE[4] * Math.pow(0.9, monProfil.getTDP()))) * (10 + 10 * monProfil.niveauRecherche[1] / 10));
        let apportPonteTk = Math.round(parseInt(tOuv / (TEMPS_UNITE[11] * Math.pow(0.9, monProfil.getTDP()))) * (55 + 55 * monProfil.niveauRecherche[1] / 10));
        let attABSupp = this._armee.getTotalAtt(monProfil.niveauRecherche[2] + 1);
        let bLigneGrasJS = attAB + apportPonteJS >= attABSupp ? true : false;
        let bLigneGrasTk = attAB + apportPonteTk >= attABSupp ? true : false;

        let defAB = this._armee.getTotalDef(monProfil.niveauRecherche[2]);
        let apportPonteTuE = Math.round(parseInt(tOuv / (TEMPS_UNITE[14] * Math.pow(0.9, monProfil.getTDP()))) * (55 + 55 * monProfil.niveauRecherche[1] / 10));
        let defABSupp = this._armee.getTotalDef(monProfil.niveauRecherche[2] + 1);
        let bLigneGrasTuE = defAB + apportPonteTuE >= defABSupp ? true : false;

        let title = `<table>
            <tr><td>Attaque AB actuelle</td><td class='right'>${numeral(attAB).format()}</td></tr>
            <tr${(bLigneGrasJS ? " class='gras' " : "")}><td>Attaque AB + ponte JS</td><td class='right' style='padding-left:10px'>${numeral(attAB + apportPonteJS).format()} (+ ${numeral(apportPonteJS).format()})</td></tr>
            <tr${(bLigneGrasTk ? " class='gras' " : "")}><td>Attaque AB + ponte Tank</td><td class='right' style='padding-left:10px'>${numeral(attAB + apportPonteTk).format()} (+ ${numeral(apportPonteTk).format()})</td></tr>
            <tr${(!bLigneGrasTk ? " class='gras' " : "")}><td>Attaque AB niveau ${(monProfil.niveauRecherche[2] + 1)}</td><td class='right'>${numeral(attABSupp).format()} (+ ${numeral(attABSupp - attAB).format()})</td></tr></table><hr/><table>
            <tr><td>Défense AB actuelle</td><td class='right'>${numeral(defAB).format()}</td></tr>
            <tr${(bLigneGrasTuE ? " class='gras' " : "")}><td>Défense AB + ponte TuE</td><td class='right' style='padding-left:10px'>${numeral(defAB + apportPonteTuE).format()} (+ ${numeral(apportPonteTuE).format()})</td></tr>
            <tr${(!bLigneGrasTuE ? " class='gras' " : "")}><td>Défense AB niveau ${(monProfil.niveauRecherche[2] + 1)}</td><td class='right'>${numeral(defABSupp).format()} (+ ${numeral(defABSupp - defAB).format()})</td></tr>
            </table>`;

        $(".cout_amelioration:eq(2) table").prepend("<tr class='centre'><td colspan='2' id='o_rentabiliteArmes' title=''>Rentabilité</td></tr>");
        $("#o_rentabiliteArmes").tooltip({
            position : {my : "right+15 top", at : "left center"},
            content : title,
            tooltipClass : "ui-tooltip-brown ui-tooltip-lightBrown"
        });
    }
	/**
	* Sauvegarde la recherche en cours.
    *
	* @private
	* @method plus
	*/
	plus()
	{
		// Affichage de la fin de la recherche
		if($("#centre > strong").length)
			$("#centre > strong").after(`<span class='small'> Terminé le ${Utils.roundMinute($("#centre > strong").text().split(',')[0].split('(')[1]).format("D MMM YYYY à HH[h]mm")}</span>`);
		// Sauvegarde de la recherche en cours
		this.saveRecherche();
        // Suppresion de la recherche en cours si on annule
        if($("a:contains('Je confirme')").length)
			$("a:contains('Je confirme')").click((e) => {
                let dataEvo = JSON.parse(localStorage.getItem("outiiil_data"));
                // si on a pas de donné ou que la consutrction n'est pas deja enregistré
                if(dataEvo){
                    delete dataEvo.expRecherche;
				    delete dataEvo.recherche;
				    delete dataEvo.startRecherche;
                    localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
                }
			});
	}
	/**
	* Sauvegarde la recherche en cours.
    *
	* @private
	* @method saveRecherche
	* @return
	*/
	saveRecherche()
	{
        let str = $("#centre strong").text();
		let recherche = str.substring(2, str.indexOf("termin") - 1);
        let dataEvo = JSON.parse(localStorage.getItem("outiiil_data")) || {};
        if(recherche && (!dataEvo.recherche || moment().diff(moment(dataEvo.expRecherche), 's') > 0)){
            dataEvo.expRecherche = moment().add(parseInt(str.split(",")[0].split("(")[1]), 's');
            dataEvo.startRecherche = moment();
            dataEvo.recherche = recherche.substr(0,1).toUpperCase() + recherche.substr(1);
            localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
            if(!Utils.comptePlus && $("#boiteComptePlus").length){
                this._boiteComptePlus.recherche = dataEvo.recherche;
                this._boiteComptePlus.expRecherche = dataEvo.expRecherche;
                this._boiteComptePlus.startRecherche = dataEvo.startRecherche;
                this._boiteComptePlus.majRecherche();
            }
        }
	}
}
