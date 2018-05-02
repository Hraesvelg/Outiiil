/*
 * TraceurJoueur.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de gestion du traceur des joueurs
*
* @class TraceurJoueur
*/
class TraceurJoueur extends Traceur
{
    /**
    *
    */
    constructor(etat = false, intervalle = 5, nbPage = 1)
    {
        super(0, etat, intervalle, nbPage);
    }
    /**
    *
    */
    getClassement(numeroPage)
    {
        return $.ajax({
            type : "get",
            url : "http://" + Utils.serveur + ".fourmizzz.fr/classement2.php",
            data : {
                "changer_classement" : "ok",
                "type_classement" : "undefined",
                "league" : 0,
                "critere" : "terrain",
                "page" : numeroPage
            }
        });
    }
    /**
    *
    */
    getInformation()
    {
        return $.get(`http://outiiil.fr/fzzz/${Utils.serveur}/event/player`);
    }
    /**
    *
    */
    tracer()
    {
        // si le traceur est actif
        if(this._etat){
            let tempsMAJ = this.getTempsAvantMAJ();
            // si on doit effectuer un relever
            if(!tempsMAJ){
                // mise à jour du timer directement pour eviter les doubles envois (multionglet, multifenetre)
                localStorage.setItem("outiiil_traceur_" + this._type, moment().add(this._intervalle, 'm').format("DD-MM-YYYY HH:mm:ss"));
                // creation des requetes
                let promiseClassement = new Array();
                for(let i = 1 ; i <= this._nbPage ; i++) promiseClassement.push(this.getClassement(i));
                // recupérer des données
                Promise.all(promiseClassement).then((values) => {
                    this._data = {};
                    for(let i = 0 ; i < values.length ; i++){
                        $("<div/>").append(values[i]["tableau_classement"]).find("tr:gt(0)").each((i, elt) => {
                            let cellule1 = $(elt).find("td:eq(1)").text(), pseudo = cellule1.split(" (")[0], alliance = "";
                            // si le joueur à une alliance on extrait le tag
                            if(cellule1.includes("("))
                                alliance = cellule1.split(" (")[1].split(")")[0];
                            // on enregistre un tablea avec [alliance, terrain, construction, recherche, trophée]
                            this._data[pseudo] = alliance + ";" + numeral($(elt).find("td:eq(2)").text()).value() + ";" + ~~$(elt).find("td:eq(3)").text() + ";" + ~~$(elt).find("td:eq(4)").text() + ";" + numeral($(elt).find("td:eq(5)").text()).value();
                        });
                    }
                    // on poste les données sur l'utilitaire
                    this.envoyerData().then((data) => {
                        let donnees = JSON.parse(data);
                        if(donnees.error == "0"){
                            $.toast({...TOAST_INFO, text : "Traceur joueur mis à jour"});
                            // lancement de la boucle
                            setTimeout(() => {this.tracer();}, this._intervalle * 60000);
                        }else
                            $.toast({...TOAST_ERROR, text : donnees.message});
                    }, (jqXHR, textStatus, errorThrown) => {
                        $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la sauvegarde des données du traceur."});
                    });
                });
            }else{
                setTimeout(() => {this.tracer();}, tempsMAJ * 1000);
            }
        }
        return this;
    }
    /**
    *
    */
    afficher(id)
    {
        $(id).append(`<table id='o_infosTraceurJoueur'><thead style="background-color:${monProfil.parametre["couleur2"].valeur}"><tr><th>Date</th><th>Pseudo</th><th>Evènement</th></tr></thead></table>`);
        $("#o_infosTraceurJoueur").DataTable({
            bInfo : false,
            bAutoWidth : false,
            dom : "Bfrtip",
            buttons : ["copyHtml5", "csvHtml5", "excelHtml5"],
            order : [[0, "desc"]],
            pageLength: 25,
            responsive : true,
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
            rowCallback : (row, data, index) => {
                $(row).css("background-color", index % 2 == 0 ? "inherit" : monProfil.parametre["couleur2"].valeur);
            },
            drawCallback : (settings) => {
                $(".o_content a, .o_content table, .o_content label").css("color", monProfil.parametre["couleurTexte"].valeur);
            }
        });
        this.getInformation().then((data) => {
            let info = null, rows = new Array(), donnees = JSON.parse(data);
            if(donnees.error == "0"){ // si pas d'erreur coté serveur
                for(let line of donnees.message.split("\n")){
                    if(line){
                        info = line.split(", ");
                        rows.push($(`<tr><td>${info[0]}</td><td>${this.parseAlliance(this.parseJoueur(info[1]))}</td><td>${this.parseAlliance(info[2])}</td></tr>`)[0]);
                    }
                }
                $("#o_infosTraceurJoueur").DataTable().clear().rows.add(rows).draw();
            }
        }, (jqXHR, textStatus, errorThrown) => {
            return false;
        });
        return this;
    }
}
