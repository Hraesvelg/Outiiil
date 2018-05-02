/*
 * TraceurAlliance.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de gestion du traceur des alliances
*
* @class TraceurAlliance
*/
class TraceurAlliance extends Traceur
{
    /**
    *
    */
    constructor(etat = false, intervalle = 5)
    {
        super(1, etat, intervalle, 1);
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
                "type_classement" : "alliance_total",
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
        return $.get(`http://outiiil.fr/fzzz/${Utils.serveur}/event/team`);
    }
    /**
    *
    */
    tracer()
    {
        // si le traceur est actif
        if(this._etat){
            let tempsMAJ = this.getTempsAvantMAJ();
            if(!tempsMAJ){
                // mise à jour du timer directement pour eviter les doubles envois (multionglet, multifenetre)
                localStorage.setItem("outiiil_traceur_" + this._type, moment().add(this._intervalle, 'm').format("DD-MM-YYYY HH:mm:ss"));
                // recupérer des données
                this.getClassement(1).then((data) => {
                    this._data = {};
                    $("<div/>").append(data["tableau_classement"]).find("tr:gt(0)").each((i, elt) => {
                        // on enregistre un tablea avec [alliance, terrain, construction, recherche, trophée]
                        this._data[$(elt).find("td:eq(1)").text()] = numeral($(elt).find("td:eq(2)").text()).value() + ";" + numeral($(elt).find("td:eq(3)").text()).value() + ";" + numeral($(elt).find("td:eq(4)").text()).value() + ";" + numeral($(elt).find("td:eq(5)").text()).value() + ";" + ~~$(elt).find("td:eq(6)").text();
                    });
                    // on poste les données sur l'utilitaire
                    this.envoyerData().then((data) => {
                        let donnees = JSON.parse(data);
                        if(donnees.error == "0"){
                             $.toast({...TOAST_INFO, text : "Traceur alliance mis à jour"});
                            // lancement de la boucle
                            setTimeout(() => {this.tracer();}, this._intervalle * 60000);
                        }else
                            $.toast({...TOAST_ERROR, text : donnees.message});
                    }, (jqXHR, textStatus, errorThrown) => {
                        $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la sauvegarde des données du traceur."});
                    });
                }, (jqXHR, textStatus, errorThrown) => {
                    $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencntrée lors de la récupération du classement alliance."});
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
        $(id).append(`<table id='o_infosTraceurAlliance'><thead style="background-color:${monProfil.parametre["couleur2"].valeur}"><tr><th>Date</th><th>Tag</th><th>Evènement</th></tr></thead></table>`);
        $("#o_infosTraceurAlliance").DataTable({
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
            let rows = new Array(), info = null, donnees = JSON.parse(data);
            if(donnees.error == "0"){
                for(let line of donnees.message.split("\n")){
                    if(line){
                        info = line.split(", ");
                        rows.push($(`<tr><td>${info[0]}</td><td>${this.parseAlliance(info[1])}</td><td>${this.parseAlliance(info[2])}</td></tr>`)[0]);
                    }
                }
                $("#o_infosTraceurAlliance").DataTable().clear().rows.add(rows).draw();
            }
        }, (jqXHR, textStatus, errorThrown) => {
            return false;
        });
        return this;
    }
}
