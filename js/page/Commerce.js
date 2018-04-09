/*
 * Commerce.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour la page /commerce.php.
*
* @class PageCommerce
* @constructor
*/
class PageCommerce
{
    constructor()
    {
        /**
        *
        */
        this._boiteComptePlus = new BoiteComptePlus();
        /**
        * Connexion à l'utilitaire.
        *
        * @private
        * @property utilitaire
        * @type Class
        */
        this._utilitaire = new Utilitaire();
        // ajout d'information
        $("form table").append(`<tr class='centre'><td colspan=6>Info : Niveau d'étable <strong>${monProfil.niveauConstruction[11]}</strong>, 1 ouvrière peut transporter : <strong>${(10 + (monProfil.niveauConstruction[11] / 2))}</strong> ressources.</td></tr>`);
        // ajout des boutons pour arrondir les quantités
        $("#bouton_nourriture_max").html(`Nourriture donnée <span id="o_arrondirNou" class="gras small">arrondir...</span>`);
        $("#o_arrondirNou").click((e) => {
            e.preventDefault();
            let value = Math.floor($("#nbNourriture").val()), nbMat = Math.floor($("#nbMateriaux").val()), newValue = Utils.arrondiQuantite(value);
            $("#input_nbNourriture").val(numeral(newValue).format());
            $("#nbNourriture").val(newValue);
            // mise à jour des ouvrieres
            $("#input_nbOuvriere").val(numeral(Math.floor((newValue + nbMat) / (10 + (monProfil.niveauConstruction[11] / 2)))).format());
            $("#nbOuvriere").val(Math.floor((newValue + nbMat) / (10 + (monProfil.niveauConstruction[11] / 2))));
            return false;
        });
        // materiaux
        $("#bouton_materiaux_max").html(`Matériaux donnés <span id="o_arrondirMat" class="gras small">arrondir...</span>`);
        $("#o_arrondirMat").click((e) => {
            e.preventDefault();
            let value = Math.floor($("#nbMateriaux").val()), nbNou = Math.floor($("#nbNourriture").val()), newValue = Utils.arrondiQuantite(value);
            $("#input_nbMateriaux").val(numeral(newValue).format());
            $("#nbMateriaux").val(newValue);
            // mise à jour des ouvrieres
            $("#input_nbOuvriere").val(numeral(Math.floor((newValue + nbNou) / (10 + (monProfil.niveauConstruction[11] / 2)))).format());
            $("#nbOuvriere").val(Math.floor((newValue + nbNou) / (10 + (monProfil.niveauConstruction[11] / 2))));
            return false;
        });
        // option c+
        if(!Utils.comptePlus) this.plus();
        // Si on dispose d'un utilitaire pour le commerce on affiche les outils
        if(monProfil.parametre["sujetCommande"].valeur && monProfil.parametre["sujetConvoi"].valeur){
            // recuperation des commandes sur l'utilitaire
            this._utilitaire.getCommande().then((data) => {
                let response = $(data).find("cmd:eq(1)").text();
                if(response.includes("Vous n'avez pas accès à ce forum."))
                    $.toast({...TOAST_ERROR, text : "L'identifiant du sujet pour les commandes est érroné."});
                else{
                    let content = JSON.parse($("<div/>").append(response).find("div[id^='editTopic']").text().trim()) || {};
                    for(let id in content) this._utilitaire.commande[id] = new Commande(content[id]);
                    this.afficherCommande();
                }
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de la récupération des commandes."});
            });
            // récuperation des convois sur l'utilitaire
            this._utilitaire.getConvoi().then((data) => {
                let response = $(data).find("cmd:eq(1)").text();
                if(response.includes("Vous n'avez pas accès à ce forum."))
                    $.toast({...TOAST_ERROR, text : "L'identifiant du sujet pour les convois est érroné."});
                else{
                    let content = JSON.parse($("<div/>").append(response).find("div[id^='editTopic']").text().trim()) || {};
                    for(let id in content) this._utilitaire.convoi[id] = new Convoi(content[id]);
                    this.afficherConvoi();
                }
            }, (jqXHR, textStatus, errorThrown) => {
                 $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de la récupération des convois."});
            });
            this.formulaireConvoi();
        }
    }
	/**
	* Affiche les retours, et sauvegarde les convois en cours pour la boite compte plus.
    *
	* @private
	* @method plus
	*/
	plus()
	{
		let listeConvoi = new Array(), nombres = new Array();
		$("#centre > strong").each((i, elt) => {
            // Affichage du retour des convois
            if($(elt).next().text().indexOf("Retour") == -1)
                $(elt).after(`<span class='small'>- Retour le ${Utils.roundMinute(Utils.timeToInt($(elt).text().split("dans")[1].trim())).format("D MMM YYYY à HH[h]mm")}</span>`);
            nombres = $(elt).text().replace(/ /g, '').split("dans")[0].match(/^\d+|\d+\b|\d+(?=\w)/g);
            listeConvoi.push({"cible" : $(elt).find("a").text(), "sens" : $(elt).text().includes("livrer"), "nou" : nombres[0], "mat" : nombres[1], "exp" : moment().add(Utils.timeToInt($(elt).text().split("dans")[1].trim()), 's')});
        });
        // tri les convois par ordre d'arrivée
        listeConvoi.sort((a, b) => {return moment(a.exp).diff(moment(b.exp));});
        // Verification si les données sont deja enregistrées
        this.saveConvoi(listeConvoi);
	}
	/**
	* Sauvegarde les convois en cours.
    *
	* @private
	* @method saveConvoi
	* @param {Array} liste des convois en cours.
	*/
	saveConvoi(liste)
	{

        let dataEvo = JSON.parse(localStorage.getItem("outiiil_data")) || {};
        if(!dataEvo.hasOwnProperty("convoi") || dataEvo.convoi.length != liste.length || dataEvo.convoi[0]["cible"] != liste[0]["cible"] || liste[0]["exp"].diff(dataEvo.convoi[0]["exp"], 's') > 1){
            dataEvo.convoi = liste;
            dataEvo.startConvoi = moment();
            localStorage.setItem("outiiil_data", JSON.stringify(dataEvo));
            if(!Utils.comptePlus && $("#boiteComptePlus").length){
                this._boiteComptePlus.convoi = dataEvo.convoi;
                this._boiteComptePlus.startConvoi = dataEvo.startConvoi;
                this._boiteComptePlus.majConvoi();
            }
        }
	}
    /**
	* Affiche les commandes en cours issu de l'utilitaire.
    *
	* @private
	* @method afficherCommande
    * @param {Object} liste des lignes de commandes.
	*/
	afficherCommande()
	{
        let nbCommande = 0, total = 0, totalRouge = 0,
            contenu = `<div id="o_listeCommande" class="simulateur centre o_marginT15"><h2>Commandes</h2><table id='o_tableListeCommande' class="o_maxWidth" cellspacing=0>
            <thead><tr class="ligne_paire"><th>Pseudo</th><th><img height='18' src='images/icone/icone_pomme.gif'/></th><th><img height='18' src='images/icone/icone_bois.gif'/></th><th>Echéance</th><th>État</th><th>Temps de trajet</th><th>Livrer</th><th>Options</th></tr></thead>`;
        for(let id in this._utilitaire.commande){
            if(!this._utilitaire.commande[id].estTermine()){
                contenu += this._utilitaire.commande[id].toHTML();
                total += parseInt(this._utilitaire.commande[id].materiaux);
                nbCommande++;
                if(this._utilitaire.commande[id].estHorsTard()) totalRouge += parseInt(this._utilitaire.commande[id].materiaux);
            }
        }
        contenu += `<tfoot><tr class='gras ${nbCommande % 2 ? "ligne_paire" : ""}'><td colspan='8'>${nbCommande} commande(s) : ${numeral(total).format("0.00 a")} ~ <span class='red'>${numeral(totalRouge).format("0.00 a")}</span> en retard !</td></tr></tfoot></table></div><br/>`;
        $("#centre .Bas").before(contenu);
        // event
        for(let id in this._utilitaire.commande)
            this._utilitaire.commande[id].ajouteEvent(this, this._utilitaire);
        $("#o_tableListeCommande").DataTable({
            bInfo : false,
            bPaginate : false,
            bAutoWidth : false,
            dom : "Bfrti",
            buttons : ["colvis", "copyHtml5", "csvHtml5", "excelHtml5"],
            order : [],
            stripeClasses : ["", "ligne_paire"],
            responsive : true,
            language : {
                zeroRecords : "Aucune commande trouvée",
                infoEmpty : "Aucun enregistrement",
                infoFiltered : "(Filtré par _MAX_ enregistrements)",
                search : "Rechercher : ",
                buttons : {colvis : "Colonne"}
            },
            columnDefs : [
                {type : "quantite-grade", targets : [1, 2]},
                {type : "moment-D MMM YYYY", targets : 3},
                {type : "time-unformat", targets : 5},
                {sortable : false, targets : [6, 7]}
            ]
        });
        $("#o_tableListeCommande_wrapper .dt-buttons").prepend(`<a id="o_ajouterCommande" class="dt-button" href="#"><span>Commander</span></a>`);
        $("#o_ajouterCommande").click((e) => {
            let boiteCommande = new BoiteCommande(new Commande(), this._utilitaire, this);
            boiteCommande.afficher();
        });
    }
    /**
    *
    */
    actualiserCommande()
    {
        let table = $("#o_tableListeCommande").DataTable(), data = new Array(), total = 0, totalRouge = 0, nbCommande = 0;  // current table data
        for(let id in this._utilitaire.commande){
            if(!this._utilitaire.commande[id].estTermine()){
                data.push($(this._utilitaire.commande[id].toHTML())[0]);
                total += parseInt(this._utilitaire.commande[id].materiaux);
                if(this._utilitaire.commande[id].estHorsTard())
                    totalRouge += parseInt(this._utilitaire.commande[id].materiaux);
                nbCommande++;
            }
        }
        table.clear().rows.add(data).draw();
        for(let id in this._utilitaire.commande)
            this._utilitaire.commande[id].ajouteEvent(this, this._utilitaire);
        // mise à jour du tfoot
        $("#o_tableListeCommande tfoot").html(`<tr class='gras ${nbCommande % 2 ? "ligne_paire" : ""}'><td colspan='8'>${nbCommande} commande(s) : ${numeral(total).format("0.00 a")} ~ <span class='red'>${numeral(totalRouge).format("0.00 a")}</span> en retard !</td></tr>`);
        return this;
    }
    /**
    * Afficher les convois en cours.
    *
    * @private
	* @method afficherConvoi
    */
    afficherConvoi()
    {
        if(!Utils.comptePlus){
            for(let id in this._utilitaire.convoi)
                // si la commande est toujours en cours et que je suis le destinaitaire et que le convoi est n'est pas encore arrivée
                if(this._utilitaire.convoi[id].estDestinataire() && !this._utilitaire.convoi[id].estTermine())
                    this._utilitaire.convoi[id].toHTML($("h3:contains('Convois en cours:')").length ? "h3" : ".simulateur:first", this._utilitaire.convoi[id].type);
            this.plus();
        }
    }
    /**
	* Modifie le bouton d'envoie des convois pour prendre ne compte l'utilitaire.
    *
	* @private
	* @method formulaireConvoi
	*/
	formulaireConvoi()
	{
        $("input[name='convoi']").before("<input id='o_idCommande' type='hidden' value='-1' name='o_idCommande'/>").after(` <button id='o_resetConvoi'>Effacer</button>`).click((e) => {
            let idCommande = $("#o_idCommande").val();
            if(idCommande != -1){ // Enrengistrement du convoi
                e.preventDefault();
                let monConvoi = new Convoi({
                    expediteur  : Utils.pseudo,
                    destinataire : $("#pseudo_convoi").val(),
                    materiaux   : numeral($("#nbMateriaux").val()).value(),
                    nourriture  : numeral($("#nbNourriture").val()).value(),
                    idCommande  : numeral(idCommande).value(),
                    dateArrivee : moment().add(this._utilitaire.commande[idCommande].demandeur.getTempsParcours(), 's')
                });
                // mise a jour des convois
                this._utilitaire.convoi[monConvoi.id] = monConvoi;
                // Mise a jour des commandes
                this._utilitaire.commande[idCommande].ajouteConvoi(monConvoi);
                // enregistrement
                this._utilitaire.enregistreConvoi().then((data) => {
                    this._utilitaire.enregistreCommande().then((data) => {
                        // Lancement du convoi dans fourmizzz
                        $("input[name='convoi']").trigger("click");
                    }, (jqXHR, textStatus, errorThrown) => {
                         $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de la mise à jour des commandes."});
                    });
                }, (jqXHR, textStatus, errorThrown) => {
                    $.toast({...TOAST_ERROR, text : "Une erreur a été rencontrée lors de l'enregistrement de votre convoi."});
                });
                $("#o_idCommande").val("-1");
            }
        });
        $("#o_resetConvoi").click((e) => {
            e.preventDefault();
            $("#pseudo_convoi, #input_nbNourriture, #input_nbMateriaux, #input_nbOuvriere, #o_idCommande").val("");
            return false;
        });
	}
}
