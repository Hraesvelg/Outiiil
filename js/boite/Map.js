/*
 * BoiteMap.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe pour creer la map du serveur (position des joueurs sur un graph)
*
* @class BoiteMap
* @constructor
* @extends Boite
*/
class BoiteMap extends Boite
{
    constructor()
    {
        super("o_boiteMap", "Carte du serveur " + Utils.serveur, `<div id='o_mapContent'></div>`);
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
            this.getMap().then((data) => {
                let donnees = JSON.parse(data);
                if(donnees.error == "0") this.afficherMap(donnees.message);
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Une erreur réseau a été rencontrée lors de la récupération de la map."});
            });
            this.css().event();
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
    *
    */
    getMap()
    {
        return $.get("http://outiiil.fr/fzzz/" + Utils.serveur + "/map");
    }
    /**
    *
    */
    afficherMap(data)
    {
        // on parsed les données pour le graph
        let mesDatas = new Array();
        for(let i = 0, l = data.split("\n") ; i < l.length ; i++){
            let tmp = l[i].split(";");
            // si c'est moi on met en evidence
            if(tmp[1] == monProfil.pseudo)
                mesDatas.push({x : parseInt(tmp[3]), y : parseInt(tmp[2]), id : tmp[0], name : tmp[1], color : "#00FF00", marker : {radius : 4}});
            else
                mesDatas.push({x : parseInt(tmp[3]), y : parseInt(tmp[2]), id : tmp[0], name : tmp[1]});
        }
        // affichage du graph
        let chart = new Highcharts.Chart({
            chart : {
                renderTo : "o_mapContent",
                height : "45%",
                backgroundColor : null
            },
            title : {text: ''},
            credits : {enabled : false},
            xAxis : {
                lineColor : "#333333",
                gridLineColor : "#333333",
                gridLineWidth : 0,
                tickInterval : 1,
                minorGridLineColor : "#333333",
                minorTickInterval : 4,
                labels : {style : {color : monProfil.parametre["couleurTexte"].valeur}},
                min : Math.max(0, monProfil.y - 10),
                max : monProfil.y + 10 + (monProfil.y - 10 < 10 ? Math.abs(monProfil.y - 10) : 0),
                scrollbar : {
                    enabled : true
                }
            },
            yAxis : {
                lineColor : "#333333",
                gridLineColor : "#333333",
                labels : {align : "left", x : 0, y : -2, style : {color : monProfil.parametre["couleurTexte"].valeur}},
                min : 0,
                max : 50
            },
            tooltip : {
                crosshairs : true,
                formatter : function(){
                    return `<b>${this.point.name}</b><br/>x : ${this.x}, y : ${this.y}<br/>Temps de trajet : ${Utils.intToTime(monProfil.getTempsParcours(this.y, this.x))}`;
                }
            },
            plotOptions : {
                series : {
                    cursor : 'pointer',
                    point : {
                        events : {
                            click : function(){
                                window.open("/Membre.php?Pseudo=" + this.name, "_blank");
                            }
                        }
                    }
                }
            },
            series : [{
                type : "scatter",
                data : mesDatas,
                showInLegend : false,
                marker : {
                    radius : 3,
                    symbol : "diamond"
                },
                turboThreshold : 0
            }]
        });
    }
}
