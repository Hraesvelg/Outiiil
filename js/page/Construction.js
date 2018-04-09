/*
 * Construction.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /construction.php.
*
* @class PageConstruction
* @constructor
*/
class PageConstruction
{
    constructor()
    {
        /**
        *
        */
        this._boiteComptePlus = new BoiteComptePlus();
        // Affichage de la rentabilité
        if(!$(".desciption_amelioration:eq(11) table").find(".verificationOK").length) this.titleEtable();
        // Sauvegarde construction
        if(!Utils.comptePlus) this.plus();
    }
    /**
    * Ajoute un title detaillé pour connaitre la rentabilité de la construction : etable à pucerons.
    *
    * @private
    * @method titleEtable
    */
    titleEtable()
    {
        let ouvDispo = Utils.ouvrieres - Utils.terrain, perte = 80 * Math.pow(2, monProfil.niveauRecherche[4]);
        let title = `<table>
            <tr><td>Ouvrières</td><td class='right'>${numeral(Utils.ouvrieres).format()}</td></tr>
            <tr><td>Disponible</td><td class='right'>${numeral(ouvDispo).format()}</td></tr>
            <tr><td>Capacité de livraison actuelle</td><td class='right'>${numeral(ouvDispo * (10 + (monProfil.niveauConstruction[11] / 2))).format()}</td></tr>
            <tr><td>Perte ouvrières pour niveau ${(monProfil.niveauConstruction[11] + 1)}</td><td class='right'>${numeral(perte).format()}</td></tr>
            <tr><td>Capacité de livraison niveau suivant</td><td class='right' style='padding-left:10px'>${numeral((ouvDispo - perte) * (10 + ((monProfil.niveauConstruction[11] + 1) / 2))).format()}</td></tr>
            <tr><td>Seuil rentabilité ouvrière</td><td class='right gras' style='padding-left:10px'>${numeral((21 + monProfil.niveauConstruction[11]) * 40 * Math.pow(2, (monProfil.niveauConstruction[11] + 3))).format()}</td></tr>
            </table>`;
        $(".cout_amelioration:eq(11) table").prepend("<tr class='centre'><td colspan='2' id='o_rentabiliteEtable' title=''>Rentabilité</td></tr>");
        $("#o_rentabiliteEtable").tooltip({
            position : {my : "right+15 center", at : "left center"},
            content : title,
            tooltipClass : "ui-tooltip-brown ui-tooltip-lightBrown"
        });
    }
	/**
	* Sauvegarde la construction en cours.
    *
	* @private
	* @method plus
	*/
	plus()
	{
		// Affichage de la fin de la construction
		if($("#centre > strong").length)
			$("#centre > strong").after(`<span class='small'> Terminé le ${Utils.roundMinute($("#centre > strong").text().split(',')[0].split('(')[1]).format("D MMM YYYY à HH[h]mm")}</span>`);
		// Sauvegarde de la construction en cours
        this.saveConstruction();
        // Suppresion de la construction en cours si on annule
        if($("a:contains('Annuler')").length)
			$("a:contains('Annuler')").click((e) => {
                let dataEvo = JSON.parse(localStorage.getItem("outiiil_data"));
                // si on a pas de donné ou que la consutrction n'est pas deja enregistré
                if(dataEvo){
                    delete dataEvo.expConstruction;
				    delete dataEvo.construction;
				    delete dataEvo.startConstruction;
                    localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
                }
			});
	}
	/**
	* Sauvegarde la construction en cours.
    *
	* @private
	* @method saveConstruction
	*/
	saveConstruction()
	{
        let str = $("#centre > strong").text();
		let construction = str.substring(2, str.indexOf("se termine") - 1);
        let dataEvo = JSON.parse(localStorage.getItem("outiiil_data")) || {};
        if(construction && (!dataEvo.construction || moment().diff(moment(dataEvo.expConstruction), 's') > 0)){
            dataEvo.expConstruction = moment().add(parseInt(str.split(',')[0].split('(')[1]), 's');
            dataEvo.startConstruction = moment();
            dataEvo.construction = construction.substr(0,1).toUpperCase() + construction.substr(1);
            localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
            if(!Utils.comptePlus && $("#boiteComptePlus").length){
                this._boiteComptePlus.construction = dataEvo.construction;
                this._boiteComptePlus.expConstruction = dataEvo.expConstruction;
                this._boiteComptePlus.startConstruction = dataEvo.startConstruction;
                this._boiteComptePlus.majConstruction();
            }
        }
	}
}
