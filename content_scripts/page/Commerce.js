/*
 * Commerce.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
  
/**
* Classe de fonction pour la page /commerce.php.
* 
* @class PageCommerce
* @constructor
* @extends Page
*/
var PageCommerce = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		$("form table").append("<tr class='centre'><td colspan=6>Info : Niveau d'étable <strong>" + Utils.data.niveauConstruction[11] + "</strong>, 1 ouvrière peut transporter : <strong>" + (10 + (Utils.data.niveauConstruction[11] / 2)) + "</strong> ressources.</td></tr>");
		if(!Utils.comptePlus) this.plus();
	},
	/**
	* Ajoute les fonctionnalités du compte+. Affiche les retours, et sauvegarde les convois en cours pour la boite compte plus.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{
		// Si on a des convois en cours
		var nbConvoi = $("#centre > strong").length;
		if(nbConvoi > 0){
			var listeConvoi = [];
			$("#centre > strong").each(function(){
				listeConvoi.push({"cible" : $(this).find("a").text(), "exp" : moment().add(Utils.timeToInt($(this).text().split("dans")[1].trim()), 's')});
			});
			// Verification si les données sont deja enregistrées
			if(!Utils.data.convoi || Utils.data.convoi.length != nbConvoi || Utils.data.convoi[0]["cible"] != listeConvoi[0]["cible"] || listeConvoi[0]["exp"].diff(Utils.data.convoi[0]["exp"], 's') > 1)
				this.saveConvoi(listeConvoi);
		}
		// Affichage du retour des convois
		$("#centre > strong").each(function(){
			$(this).after("<span class='small'> Retour le " + moment().add(Utils.timeToInt($(this).text().split("dans")[1].trim()), 's').format("D MMM YYYY à HH[h]mm") + "</span>");
		});
	},
	/**
	* Sauvegarde les convois en cours.
    *
	* @private
	* @method saveConvoi
	* @param {Array} liste des convois en cours.
	* @return
	*/
	saveConvoi : function(liste)
	{
		Utils.data.convoi = liste;
		Utils.data.startConvoi = moment();
		localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
		if(!Utils.comptePlus && $("#boiteComptePlus").length) boiteComptePlus.majConvoi();
	}
});

/*getCommande : function(element)
	{
		return element.afficherCommande({"error":0,"nourriture":[{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"}],"materiaux":[{"id":5591,"pseudo":"Fonfland","coord_x":20,"coord_y":8,"priorite":2000,"date_prevue":"2015-10-25","date_soumise":"2015-10-15","date_apres":null,"reste":3338177057379,"etat":"P1"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"P1"},{"id":5593,"pseudo":"Cali","coord_x":35,"coord_y":94,"priorite":5.3089939144389,"date_prevue":"2015-11-30","date_soumise":"2015-10-17","date_apres":null,"reste":1,"etat":"P3"},{"id":5628,"pseudo":"Creve","coord_x":45,"coord_y":495,"priorite":-6.656784981552,"date_prevue":"2015-11-21","date_soumise":"2015-11-01","date_apres":"2015-11-20","reste":187904819200,"etat":"P1"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"P1"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":200000000000,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":600000000000,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"WAIT"},{"id":5633,"pseudo":"Kariamoss","coord_x":18,"coord_y":1100,"priorite":10.710395137555,"date_prevue":"2015-11-19","date_soumise":"2015-11-04","date_apres":"2015-11-15","reste":187904819200,"etat":"WAIT"}]});*/
		/*$.ajax({
			url       : Utils.data.utility + "liste_commande.php",
			dataType  : "json",
			timeout   : 5000,
			xhrFields : {withCredentials : true},
			error     : function(xhr, status){ 
				$("#o_listeCommande").append("<p>Désolé, utilitaire indisponible, veuillez réessayer plus tard !</p>");
				$("#boite_demande").remove();
			},
			success   : function(data){
				if(!data.errorcode)
					return boiteRessource.afficherCommande({"error" : 0, "materiaux" : Utils.noHTML(data.liste_materiaux), "nourriture" : Utils.noHTML(data.liste_nourriture)}), boiteRessource.afficherConvoi({"error" : 0, "convoi": Utils.noHTML(data.incoming)});	
			
				else{
					var parsed = $("<div/>").append(data.errortext);
					$("#o_listeCommande").append("<p>" + parsed.text() + "</p>");
				}
			}
		});*/
//	},
//	ajouterConvoi : function(id, quantite){
		/*$.ajax({
			url       : Utils.data.utility + "ajout_livraison.php",
			dataType  : "json",
			xhrFields : {withCredentials : true},
			data      : {"commande_id" : id, "quantite" : quantite},
			error     : function(xhr, status){alert('Désolé, utilitaire indisponible, veuillez réessayer plus tard !');},
			success   : function(data){
				var data = {};
				data.convoi = "1";
				data.pseudo_convoi = $("#pseudo_convoi").val();
				data.nbMateriaux = numeral().unformat($("#input_nbMateriaux").val());
				data.nbNourriture = numeral().unformat($("#input_nbNourriture").val());
				data[String($("#t").attr('name'))] = $("#t").attr('value');
				$.post("/commerce.php", data, function(data){document.location = "/commerce.php"});
			}
		});*/
//	},
//	ajouterCommande : function(evolution, date_prevue, date_apres){
		/*var tabEvo = ["champi", "ent_nourriture", "ent_materiaux", "couveuse", "solarium", "laboratoire", "salle_analyse", "salle_combat", "caserne", "dome", "loge", "etable_pucerons", "etable_cochenille", "technique_ponte", "bouclier", "armes", "architecture", "com_annimaux", "vitesse_chasse", "vitesse_attaque", "genetique", "acide", "poison"];
		var regexp = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$", "g");
		if(regexp.test(date_prevue) && evolution >= 0 && evolution <= 22){
			$.ajax({
				url       : Utils.data.utility + "ajout_commande.php",
				dataType  : "json",
				xhrFields : {withCredentials : true},
				data      : {"evolution" : tabEvo[evolution], "date_prevue" : date_prevue, "date_apres" : date_apres},
				error     : function(xhr, status){alert('Désolé, utilitaire indisponible, veuillez réessayer plus tard !');},
				success   : function(data){alert(data["errortext"]);}
			});
		}else{
			alert("Erreur de saisie !");
		}*/
//	},
//	getDataPlayer : function()
//	{
		/*$.ajax({
			url       : Utils.data.utility + "info_player.php",
			dataType  : "json",
			timeout   : 5000,
			xhrFields : {withCredentials : true},
			success   : function(data){
				data = Utils.noHTML(data);
				if(!data.errorcode)
					return box.afficherDataPlayer({"error" : 0, "activite" : data["mul_tantieme"], "solde" : data["solde_virtuel"], "ent_mat" : data["ent_materiaux"], "tdc_virtuel" : data["tdc_virtuel"]});
			}
		});*/
//	},
//	getStatus : function(){
		/*$.ajax({
			url       : Utils.data.utility + "info_sdc.php",
			dataType  : "json",
			timeout   : 5000,
			xhrFields : {withCredentials : true},
			error     : function(xhr, status){alert('Désolé, utilitaire indisponible, veuillez réessayer plus tard !');},
			success   : function(data){
				if(!data.errorcode){
					return page.afficherStatus({"error" : 0, "data" : Utils.noHTML(data.info)});
				}else{
					var parsed = $("<div/>").append(data.errortext);
					return page.afficherStatus({"error" : 1, "message" : "<p>" + parsed.text() + "</p>"});
				}
			}
		});*/
//	},

