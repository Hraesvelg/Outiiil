/*
 * Chat.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
  
/**
* Classe de fonction pour les chats.
* 
* @class PageChat
* @constructor
* @extends Page
*/
var PageChat = Page.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		if(!Utils.comptePlus) this.plus();
		// Couleur du texte
		this.couleur();
		// Emoticone
		this.emoticone();
		// Reaffichage message
		this.afficheMessage();
	},
	/**
	* Change l'apparance de l'affichage des messages, "Pseudo (datetime) :" au lieu de "datetime pseudo :"
    *
	* @private
	* @method afficheMessage
	* @return
	*/
	afficheMessage : function()
	{
		$("#anciensMessages p, #nouveauxMessages p").each(function(){
			$(this).contents().eq(0).wrap("<span class='small o_marginL5'><em>");
			var html = $(this).html(function(i, html){
				nth = 0;
				return html.replace(/:/g, function(match, i){
					nth++;
					return nth == 3 ? "<span class='o_marker'>:</span>" : match;
				});
			});
			$(this).find(".o_marker").before($(this).find("span"));
		});
		$("#nouveauxMessages").bind("DOMNodeInserted", function(e){
			var element = $(e.target);
			if(element.is("p") && !element.hasClass("o_parsed")){
				$(element).addClass("o_parsed");
				element.contents().eq(0).wrap("<span class='small o_marginL5'><em>");
				var html = element.html(function(i, html){
					nth = 0;
					return html.replace(/:/g, function(match, i){
						nth++;
						return nth == 3 ? "<span class='o_marker'>:</span>" : match;
					});
				});
				element.find(".o_marker").before($(e.target).find("span"));
			}
		});
	},
	/**
	* Ajoute les fonctionnalités du compte+. Couleur, options de chat.
    *
	* @private
	* @method plus
	* @return
	*/
	plus : function()
	{
		// Bouton
		this.bouton();
		// Modification pour l'envoie du formulaire
		$("#message").bind("keypress", function(e){
			var code = e.keyCode || e.which; 
			if(code == 13)
				page.parseMessage();
		});
		$("input[name='Envoyer']").click(function(e){
			page.parseMessage();
		});
	},
	/**
	* Parse le message pour convertir les smiley par le bbcode correspondant.
    *
	* @private
	* @method parseMessage
	* @return
	*/
	parseMessage : function()
	{
		var color = $("#inputCouleur").val();
		if(color != "000000" && color != "0000000")
			$("#message").val("[color=#" + color + "]" + $("#message").val() + "[/color]");
		var mess = $("#message").val();
		for(var i = 1 ; i < 27 ; i++){
			if(mess.indexOf("{outiiil" + i + "}") >= 0)
				mess = mess.replace("{outiiil" + i + "}", "[img]http://outiiil.fr/images/outiiil/" + i + ".gif[/img]");
		}
		$("#message").val(mess);
	},
	/**
	* Ajoute/modifie le color picker.
    *
	* @private
	* @method couleur
	* @return
	*/
	couleur : function(){
		if(Utils.data.couleurChat) 
			$("#inputCouleur").val(Utils.data.couleurChat.substring(1));
		$("#boutonCouleur").remove();
		$("#smileySuivant0").after("<span><input id='color' type='color' name='couleur' value='" + Utils.data.couleurChat + "'/></span>");
		$("#color").change(function(){
			var col = $(this).val();
			$("#inputCouleur").val(col.substring(1));
			Utils.data.couleurChat = $(this).val();
			localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
		});
	},
	/**
	* Ajoute les boutons de BBcode.
    *
	* @private
	* @method bouton
	* @return
	*/
	bouton : function(){
		block = "<span class='btn-group'><button id='o_msgUp' class='btn'>aA</button><button id='o_msgDown' class='btn'>Aa</button></span>"
			+ "<span class='btn-group'><button id='o_msgB' class='btn gras' onclick=\"miseEnForme('message','gras');\">B</button><button id='o_msgI' class='btn' onclick=\"miseEnForme('message','italic');\"><em>I</em></button><button id='o_msgU' class='btn' style='text-decoration:underline' onclick=\"miseEnForme('message','souligne');\">U</button></span>"
			+ "<span class='btn-group'><button id='o_msgImg' class='btn' onclick=\"miseEnForme('message','img');\"><img height='12' src='images/BBCode/picture.png' title='Image' onclick=\"miseEnForme('message','img');\"></button><button id='o_msgLink' class='btn' onclick=\"miseEnForme('message','url');\"><img height='12' src='images/BBCode/link.png' title='Lien' onclick=\"miseEnForme('message','url');\"></button><button id='o_msgPlay' class='btn' onclick=\"miseEnForme('message','player');\"><img height='12' src='images/BBCode/membre.gif' title='Pseudo'/></button><button id='o_msgAlly' class='btn' onclick=\"miseEnForme('message','ally');\"><img height='12' src='images/BBCode/groupe.gif' title='Alliance'/></button></span>";
		$("#formulaireChat").append(block);

		$("#o_msgUp").click(function(e){
			e.preventDefault();
			$("#message").val("[size=4]" + $("#message").val() + "[/size]");
			$("#message")[0].selectionStart += 8;
			$("#message")[0].selectionEnd -= 7;
			$("#message").focus();
		});
		$("#o_msgDown").click(function(e){
			e.preventDefault();
			$("#message").val("[size=2]" + $("#message").val() + "[/size]");
			$("#message")[0].selectionStart += 8;
			$("#message")[0].selectionEnd -= 7;
			$("#message").focus();
		});	
		$("#o_msgB, #o_msgI, #o_msgU, #o_msgImg, #o_msgLink, #o_msgPlay, #o_msgAlly").click(function(e){e.preventDefault();});	
	},
	/**
	* Ajoute les emoticones de base pour les non compte+.
    *
	* @private
	* @method emoticone
	* @return
	*/
	emoticone : function(){
		if(!Utils.comptePlus){
			$("#listeSmiley20").html(
				"<img src='images/smiley/ant_pouce.gif' onclick='addRaccourciSmiley(\"message\",\"ant_pouce\")'>" +
				" <img src='images/smiley/ant_smile.gif' onclick='addRaccourciSmiley(\"message\",\"ant_smile\")'>" +
				" <img src='images/smiley/ant_biggrin.gif' onclick='addRaccourciSmiley(\"message\",\"ant_biggrin\")'>" +
				" <img src='images/smiley/ant_laugh.gif' onclick='addRaccourciSmiley(\"message\",\"ant_laugh\")'>" +
				" <img src='images/smiley/ant_tongue.gif' onclick='addRaccourciSmiley(\"message\",\"ant_tongue\")'>" +
				" <img src='images/smiley/ant_bye.gif' onclick='addRaccourciSmiley(\"message\",\"ant_bye\")'>" +
				" <img src='images/smiley/ant_cool.gif' onclick='addRaccourciSmiley(\"message\",\"ant_cool\")'>" +
				" <img src='images/smiley/ant_interest.gif' onclick='addRaccourciSmiley(\"message\",\"ant_interest\")'>" +
				" <img src='images/smiley/ant_angel.gif' onclick='addRaccourciSmiley(\"message\",\"ant_angel\")'>" +
				" <img src='images/smiley/ant_smug.gif' onclick='addRaccourciSmiley(\"message\",\"ant_smug\")'>" +
				" <img src='images/smiley/ant_nudgewink.gif' onclick='addRaccourciSmiley(\"message\",\"ant_nudgewink\")'>" +
				" <img src='images/smiley/ant_blink.gif' onclick='addRaccourciSmiley(\"message\",\"ant_blink\")'>" +
				" <img src='images/smiley/ant_unsure.gif' onclick='addRaccourciSmiley(\"message\",\"ant_unsure\")'>" +
				" <img src='images/smiley/ant_shy.gif' onclick='addRaccourciSmiley(\"message\",\"ant_shy\")'>" +
				" <img src='images/smiley/ant_oh.gif' onclick='addRaccourciSmiley(\"message\",\"ant_oh\")'>" +
				" <img src='images/smiley/ant_sleep.gif' onclick='addRaccourciSmiley(\"message\",\"ant_sleep\")'>" +
				" <img src='images/smiley/ant_sad.gif' onclick='addRaccourciSmiley(\"message\",\"ant_sad\")'>" +
				" <img src='images/smiley/ant_mad.gif' onclick='addRaccourciSmiley(\"message\",\"ant_mad\")'>" +
				" <img src='images/smiley/ant_doctor.gif' onclick='addRaccourciSmiley(\"message\",\"ant_doctor\")'>"
			);		
			$("#listeSmiley30").html(
				"<img onclick='addRaccourciSmiley(\"message\",\"doctor\")' src='images/smiley/doctor.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"borg\")' src='images/smiley/borg.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"pirate\")' src='images/smiley/pirate.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"sick2\")' src='images/smiley/sick2.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"asian\")' src='images/smiley/asian.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"dunce\")' src='images/smiley/dunce.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"canadian\")' src='images/smiley/canadian.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"captain\")' src='images/smiley/captain.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"police\")' src='images/smiley/police.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"santa\")' src='images/smiley/santa.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"cook\")' src='images/smiley/cook.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"farmer\")' src='images/smiley/farmer.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"smurf\")' src='images/smiley/smurf.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"gangster\")' src='images/smiley/gangster.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"king\")' src='images/smiley/king.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"king2\")' src='images/smiley/king2.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"pixie\")' src='images/smiley/pixie.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"pirate2\")' src='images/smiley/pirate2.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"pirate3\")' src='images/smiley/pirate3.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"warrior\")' src='images/smiley/warrior.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"card\")' src='images/smiley/card.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"egypt\")' src='images/smiley/egypt.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"fool\")' src='images/smiley/fool.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"hat\")' src='images/smiley/hat.gif'>"
			);			
			$("#listeSmiley40").html(
				"<img onclick='addRaccourciSmiley(\"message\",\"dead\")' src='images/smiley/dead.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"inv\")' src='images/smiley/inv.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"stretcher\")' src='images/smiley/stretcher.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"blue\")' src='images/smiley/blue.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"sick\")' src='images/smiley/sick.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"love\")' src='images/smiley/love.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"cupid\")' src='images/smiley/cupid.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"diablo\")' src='images/smiley/diablo.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"crossbones\")' src='images/smiley/crossbones.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"fish\")' src='images/smiley/fish.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"cupid2\")' src='images/smiley/cupid2.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"construction\")' src='images/smiley/construction.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"flower\")' src='images/smiley/flower.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"drinks\")' src='images/smiley/drinks.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"burp\")' src='images/smiley/burp.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"rain\")' src='images/smiley/rain.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"surf\")' src='images/smiley/surf.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"baloon\")' src='images/smiley/baloon.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"sleep2\")' src='images/smiley/sleep2.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"rip\")' src='images/smiley/rip.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"scooter\")' src='images/smiley/scooter.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"moto\")' src='images/smiley/moto.gif'>"
			);
			$("#listeSmiley50").html(
				"<img onclick='addRaccourciSmiley(\"message\",\"whip\")' src='images/smiley/whip.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"shades\")' src='images/smiley/shades.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"kiss\")' src='images/smiley/kiss.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"boxer\")' src='images/smiley/boxer.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"gun\")' src='images/smiley/gun.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"bross\")' src='images/smiley/bross.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"whistling\")' src='images/smiley/whistling.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"showoff\")' src='images/smiley/showoff.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"noel_vache\")' src='images/smiley/noel_vache.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"app\")' src='images/smiley/app.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"book\")' src='images/smiley/book.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"cake\")' src='images/smiley/cake.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"dance\")' src='images/smiley/dance.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"harhar\")' src='images/smiley/harhar.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"juggle\")' src='images/smiley/juggle.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"worthy\")' src='images/smiley/worthy.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"fishing\")' src='images/smiley/fishing.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"stereo\")' src='images/smiley/stereo.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"music\")' src='images/smiley/music.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"prison\")' src='images/smiley/prison.gif'>" +
				"<img onclick='addRaccourciSmiley(\"message\",\"piece\")' src='images/smiley/piece.gif'>"
			);
			$("#listeSmiley60").html(
				"<img onclick='addRaccourciSmiley(\"message\",\"noel_etoile\")' src='images/smiley/noel_etoile.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_snowman10\")' src='images/smiley/noel_snowman10.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_snowman11\")' src='images/smiley/noel_snowman11.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_cadeau3\")' src='images/smiley/noel_cadeau3.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_vache\")' src='images/smiley/noel_vache.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"santa\")' src='images/smiley/santa.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_pere\")' src='images/smiley/noel_pere.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_santa\")' src='images/smiley/noel_santa.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_bougie\")' src='images/smiley/noel_bougie.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_chien2\")' src='images/smiley/noel_chien2.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_chapeau\")' src='images/smiley/noel_chapeau.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_cadeau\")' src='images/smiley/noel_cadeau.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_sapin3\")' src='images/smiley/noel_sapin3.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_snowman4\")' src='images/smiley/noel_snowman4.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_snowman3\")' src='images/smiley/noel_snowman3.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_chaussette\")' src='images/smiley/noel_chaussette.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_flocon\")' src='images/smiley/noel_flocon.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_snowman5\")' src='images/smiley/noel_snowman5.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_sapin2\")' src='images/smiley/noel_sapin2.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_snowman8\")' src='images/smiley/noel_snowman8.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_bonnet\")' src='images/smiley/noel_bonnet.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_renne\")' src='images/smiley/noel_renne.gif'>" +
				" <img onclick='addRaccourciSmiley(\"message\",\"noel_renne3\")' src='images/smiley/noel_renne3.gif'>"
			);
			$("#listeSmiley70").html(
				"<img src='images/smiley/dollar.gif' onclick='addRaccourciSmiley(\"message\",\"dollar\")'>" +
				" <img src='images/smiley/ninja.gif' onclick='addRaccourciSmiley(\"message\",\"ninja\")'>" +
				" <img src='images/smiley/bat.gif' onclick='addRaccourciSmiley(\"message\",\"bat\")'>" +
				" <img src='images/smiley/whistles.gif' onclick='addRaccourciSmiley(\"message\",\"whistles\")'>" +
				" <img src='images/smiley/showoff2.gif' onclick='addRaccourciSmiley(\"message\",\"showoff2\")'>" +
				" <img src='images/smiley/barbarian.gif' onclick='addRaccourciSmiley(\"message\",\"barbarian\")'>" +
				" <img src='images/smiley/magi.gif' onclick='addRaccourciSmiley(\"message\",\"magi\")'>" +
				" <img src='images/smiley/prof.gif' onclick='addRaccourciSmiley(\"message\",\"prof\")'>" +
				" <img src='images/smiley/witch.gif' onclick='addRaccourciSmiley(\"message\",\"witch\")'>" +
				" <img src='images/smiley/pirate4.gif' onclick='addRaccourciSmiley(\"message\",\"pirate4\")'>" +
				" <img src='images/smiley/bicycle.gif' onclick='addRaccourciSmiley(\"message\",\"bicycle\")'>" +
				" <img src='images/smiley/scooter2.gif' onclick='addRaccourciSmiley(\"message\",\"scooter2\")'>" +
				" <img src='images/smiley/police2.gif' onclick='addRaccourciSmiley(\"message\",\"police2\")'>" +
				" <img src='images/smiley/dragon.gif' onclick='addRaccourciSmiley(\"message\",\"dragon\")'>" +
				" <img src='images/smiley/panic.gif' onclick='addRaccourciSmiley(\"message\",\"panic\")'>" +
				" <img src='images/smiley/dog.gif' onclick='addRaccourciSmiley(\"message\",\"dog\")'>" +
				" <img src='images/smiley/plane.gif' onclick='addRaccourciSmiley(\"message\",\"plane\")'>"
			);
		}
		// Ajout des emoticones d'outiiil
		var ligne = "<div id='listeSmiley80' style='display:none'>";
		for(i = 0 ; ++i < 27 ; ligne += "<img id='smiley_" + i + "' src='http://outiiil.fr/images/outiiil/" + i + ".gif'>");
		$("#tousLesSmiley0").append(ligne + "</div>");
			
		$("img[id^=smiley_]").click(function(){
			$("#message").val($("#message").val() + "{outiiil" + $(this).attr("id").slice(7) + "}");
		});
		// Changement des actions pour les listes
		$("#smileyPrecedent0").html("<img title='Précédent' class='cursor' src='images/bouton/fleche-champs-gauche.gif' />");
		$("#smileyPrecedent0").removeAttr("onclick");
		$("#smileyPrecedent0").click(function(){
			var div = $("#tousLesSmiley0").find("div:visible");
			div.hide();
			div.prev().length ? div.prev().show() : $("#tousLesSmiley0 div:last").show();
		});
		
		$("#smileySuivant0").html("<img title='Suivant' class='cursor' src='images/bouton/fleche-champs-droite.gif'/>");
		$("#smileySuivant0").removeAttr("onclick");
		$("#smileySuivant0").click(function(){
			var div = $("#tousLesSmiley0").find("div:visible");
			div.hide();
			div.next().length ? div.next().show() : $("#tousLesSmiley0 div:first").show();
		});
	}
});
