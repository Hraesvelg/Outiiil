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
    constructor(boiteComptePlus)
    {
        /**
        * Accés à la boite compte+
        */
        this._boiteComptePlus = boiteComptePlus;
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
        if(monProfil.parametre["forumCommande"].valeur){
            // recuperation des commandes sur l'utilitaire
            this._utilitaire.consulterSection(monProfil.parametre["forumCommande"].valeur).then((data) => {
                if(this._utilitaire.chargerCommande(data)) this.afficherCommande();
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la récupération des commandes."});
            });
            this.formulaireConvoi();
        }
        return this;
    }
	/**
	* Affiche les retours, et sauvegarde les convois en cours pour la boite compte plus.
    *
	* @private
	* @method plus
	*/
	plus()
	{
        // autocomplete sur le champs pseudo
        $("#pseudo_convoi").autocomplete({
            source : (request, response) => {
                // requete pour autocomplete
                Joueur.rechercher(request.term).then((data) => {response(Utils.extraitRecherche(data, true, false));});
            },
            position : {my : "left top-5", at : "left bottom"},
            delay : 0,
            minLength : 3
        });
        // sauvegarde des convois
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
        if(listeConvoi.length) this.saveConvoi(listeConvoi);
        return this;
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
        if(!this._boiteComptePlus.hasOwnProperty("convoi") || this._boiteComptePlus.convoi.length != liste.length || this._boiteComptePlus.convoi[0]["cible"] != liste[0]["cible"] || liste[0]["exp"].diff(this._boiteComptePlus.convoi[0]["exp"], 's') > 1 && !Utils.comptePlus && $("#boiteComptePlus").length){
            this._boiteComptePlus.convoi = liste;
            this._boiteComptePlus.startConvoi = moment();
            this._boiteComptePlus.sauvegarder().majConvoi();
        }
        return this;
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
        let total = 0, totalRouge = 0, tabCommandeAff = new Array(), tabCommandePersoEnCours = new Array(),
            contenu = `<div id="o_listeCommande" class="simulateur centre o_marginT15"><h2>Commandes</h2><table id='o_tableListeCommande' class="o_maxWidth" cellspacing=0>
            <thead><tr class="ligne_paire"><th>Pseudo</th><th>${IMG_POMME}</th><th>${IMG_MAT}</th><th>Echéance</th><th>Status</th><th>État</th><th>Temps de trajet</th><th>Livrer</th><th>Options</th></tr></thead>`;
        for(let id in this._utilitaire.commande){
            if(this._utilitaire.commande[id].estAFaire()){
                contenu += this._utilitaire.commande[id].toHTML();
                total += parseInt(this._utilitaire.commande[id].materiaux);
                if(this._utilitaire.commande[id].estHorsTard()) totalRouge += parseInt(this._utilitaire.commande[id].materiaux);
                tabCommandeAff.push(id);
            }
            // ajout des commandes à verifier pour vois les convois
            // on affiche les convois pour nos commandes en cours
            // on affiche les conboi pour les commandes terminés de moins de 1 jour
            if(this._utilitaire.commande[id].demandeur.pseudo == monProfil.pseudo)
                if(this._utilitaire.commande[id].etat == ETAT_COMMANDE["En cours"] || (this._utilitaire.commande[id].etat == ETAT_COMMANDE["Terminée"] && this._utilitaire.commande[id].estTermineRecent()))
                    tabCommandePersoEnCours.push(id);
        }
        contenu += `<tfoot><tr class='gras ${tabCommandeAff.length % 2 ? "ligne_paire" : ""}'><td colspan='9'>${tabCommandeAff.length} commande(s) : ${numeral(total).format("0.00 a")} ~ <span class='red'>${numeral(totalRouge).format("0.00 a")}</span> en retard !</td></tr></tfoot></table></div><br/>`;
        $("#centre .Bas").before(contenu);
        // event
        for(let id of tabCommandeAff)
             this._utilitaire.commande[id].ajouterEvent(this, this._utilitaire);
        $("#o_tableListeCommande").DataTable({
            bInfo : false,
            bPaginate : false,
            bAutoWidth : false,
            dom : "Bfrti",
            buttons : ["colvis", "copyHtml5", "csvHtml5", "excelHtml5"],
            order : [[5, "desc"]],
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
                {type : "time-unformat", targets : 6},
                {sortable : false, targets : [7, 8]}
            ]
        });
        $("#o_tableListeCommande_wrapper .dt-buttons").prepend(`<a id="o_ajouterCommande" class="dt-button" href="#"><span>Commander</span></a>`);
        $("#o_ajouterCommande").click((e) => {
            let boiteCommande = new BoiteCommande(new Commande(), this._utilitaire, this);
            boiteCommande.afficher();
        });
        // récuperation des convois sur l'utilitaire
        this.afficherConvoi(tabCommandePersoEnCours);
        return this;
    }
    /**
    *
    */
    actualiserCommande()
    {
        let data = new Array(), total = 0, totalRouge = 0, tabCommandeAff = new Array();  // current table data
        for(let id in this._utilitaire.commande){
            if(this._utilitaire.commande[id].estAFaire()){
                data.push($(this._utilitaire.commande[id].toHTML())[0]);
                total += parseInt(this._utilitaire.commande[id].materiaux);
                if(this._utilitaire.commande[id].estHorsTard()) totalRouge += parseInt(this._utilitaire.commande[id].materiaux);
                tabCommandeAff.push(id);
            }
        }
        $("#o_tableListeCommande").DataTable().clear().rows.add(data).draw();
        for(let id of tabCommandeAff)
            this._utilitaire.commande[id].ajouterEvent(this, this._utilitaire);
        // mise à jour du tfoot
        $("#o_tableListeCommande tfoot").html(`<tr class='gras ${tabCommandeAff.length % 2 ? "ligne_paire" : ""}'><td colspan='9'>${tabCommandeAff.length} commande(s) : ${numeral(total).format("0.00 a")} ~ <span class='red'>${numeral(totalRouge).format("0.00 a")}</span> en retard !</td></tr>`);
        return this;
    }
    /**
    * Afficher les convois en cours.
    *
    * @private
	* @method afficherConvoi
    */
    afficherConvoi(tabCommande)
    {
        if(!Utils.comptePlus){
            for(let id of tabCommande){
                this._utilitaire.consulterSujet(id).then((data) => {
                    let response = $(data).find("cmd:eq(1)").text();
                    if(response.includes("Vous n'avez pas accès à ce forum."))
                        $.toast({...TOAST_ERROR, text : "L'identifiant du sujet pour les convois est érroné."});
                    else{
                        let convoi = null, message = "", nombres = new Array();
                        $("<div/>").append(response).find(".messageForum").each((i, elt) => {
                            message = $(elt).text();
                            if(message.trim()){
                                nombres = message.replace(/ /g, '').split("dans")[0].match(/^\d+|\d+\b|\d+(?=\w)/g);
                                convoi = new Convoi({expediteur : $(elt).prev().find("a").text(), destinataire : monProfil.pseudo, nourriture : nombres[0], materiaux : nombres[1], idCommande : id, dateArrivee : moment(message.split("Retour le ")[1], "D MMM YYYY à HH[h]mm")});
                                // si la commande est toujours en cours et que je suis le destinaitaire et que le convoi est n'est pas encore arrivée
                                if(!convoi.estTermine())
                                    convoi.toHTML($("h3:contains('Convois en cours:')").length ? "h3" : ".simulateur:first", convoi.type);
                            }
                        });
                    }
                }, (jqXHR, textStatus, errorThrown) => {
                     $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la récupération des convois."});
                });
            }
            this.plus();
        }
        return this;
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
                    expediteur  : monProfil.pseudo,
                    destinataire : $("#pseudo_convoi").val(),
                    materiaux   : numeral($("#nbMateriaux").val()).value(),
                    nourriture  : numeral($("#nbNourriture").val()).value(),
                    idCommande  : numeral(idCommande).value(),
                    dateArrivee : moment().add(monProfil.getTempsParcours2(this._utilitaire.commande[idCommande].demandeur), 's')
                });
                // enregistrement
                this._utilitaire.envoyerMessage(idCommande, monConvoi.toUtilitaire()).then((data) => {
                    // Mise a jour des commandes
                    this._utilitaire.commande[idCommande].ajouteConvoi(monConvoi);
                    this._utilitaire.modifierSujet(this._utilitaire.commande[idCommande].toUtilitaire(), " ", idCommande).then((data) => {
                        // si la commande est terminé on passe la suivante en attente en cours si il n'y a pas d'autres en cours
                        let cmdSuivante = 99999999999999999;
                        for(let id in this._utilitaire.commande){
                            if(this._utilitaire.commande[id].etat == ETAT_COMMANDE["En cours"]){
                                cmdSuivante = 99999999999999999
                                break;
                            }
                            if(this._utilitaire.commande[id].etat == ETAT_COMMANDE["En attente"] && id < cmdSuivante)
                                cmdSuivante = id;
                        }
                        if(cmdSuivante != 99999999999999999){
                            this._utilitaire.commande[cmdSuivante].etat = ETAT_COMMANDE["En cours"];
                            this._utilitaire.modifierSujet(this._utilitaire.commande[cmdSuivante].toUtilitaire(), " ", cmdSuivante).then((data) => {
                                $.toast({...TOAST_SUCCESS, text : "Nouvelle commande en cours à jour."});
                            }, (jqXHR, textStatus, errorThrown) => {
                                $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la mise à jour des commandes."});
                            });
                        }
                        // Lancement du convoi dans fourmizzz
                        $("input[name='convoi']").trigger("click");
                    }, (jqXHR, textStatus, errorThrown) => {
                         $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la mise à jour des commandes."});
                    });
                }, (jqXHR, textStatus, errorThrown) => {
                    $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de l'enregistrement de votre convoi."});
                });
                $("#o_idCommande").val("-1");
            }
        });
        $("#o_resetConvoi").click((e) => {
            e.preventDefault();
            $("#pseudo_convoi, #input_nbNourriture, #input_nbMateriaux, #input_nbOuvriere, #o_idCommande").val("");
            return false;
        });
        return this;
	}
}
