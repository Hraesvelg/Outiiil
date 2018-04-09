/*
 * Chat.js
 * Hraesvelg
 **********************************************************************/

/**
* Classe de fonction pour les chats.
*
* @class PageChat
* @constructor
*/
class PageChat
{
    constructor()
    {
        if(!Utils.comptePlus) this.plus();
        // Couleur du texte
        this.couleur();
        // Emoticone
        this.emoticone();
        // Reaffichage message
        this.afficheMessage();
        // Modification pour l'envoie du formulaire
        $("#message").bind("keypress", (e) => {
            let code = e.keyCode || e.which;
            if(code == 13)
                this.parseMessage();
        });
        $("input[name='Envoyer']").click((e) => {this.parseMessage();});
    }
	/**
	* Change l'apparance de l'affichage des messages, "Pseudo (datetime) :" au lieu de "datetime pseudo :"
    *
	* @private
	* @method afficheMessage
	*/
	afficheMessage()
	{
		$("#anciensMessages p, #nouveauxMessages p").each((i, elt) => {
			$(elt).contents().eq(0).wrap("<span class='small'> <em>");
			let html = $(elt).html((i, html) => {
				let nth = 0;
				return html.replace(/:/g, (match, i) => {
					nth++;
					return nth == 3 ? "<span class='o_marker'>:</span>" : match;
				});
			});
			$(elt).find(".o_marker").before($(elt).find("span"));
		});
		$("#nouveauxMessages").bind("DOMNodeInserted", (e) => {
			let element = $(e.target);
			if(element.is("p") && !element.hasClass("o_parsed")){
				$(element).addClass("o_parsed");
				element.contents().eq(0).wrap("<span class='small'> <em>");
				let html = element.html((i, html) => {
					let nth = 0;
					return html.replace(/:/g, (match, i) => {
						nth++;
						return nth == 3 ? "<span class='o_marker'>:</span>" : match;
					});
				});
				element.find(".o_marker").before($(element).find("span"));
			}
		});
	}
	/**
	* Ajoute la Couleur, options de chat.
    *
	* @private
	* @method plus
	*/
	plus()
	{
        $("#formulaireChat").append(`<div class='o_group_bouton o_group_bouton_chat'><span id='o_msgUp' class='option_gestion'>aA</span><span id='o_msgDown' class='option_gestion'>Aa</span></div>
            <div class='o_group_bouton o_group_bouton_chat'><span id='o_msgB' class='option_gestion gras' onclick="miseEnForme('message','gras');">B</span><span id='o_msgI' class='option_gestion' onclick="miseEnForme('message','italic');"><em>I</em></span><span id='o_msgU' class='option_gestion' onclick="miseEnForme('message','souligne');" style='text-decoration:underline'>U</span></div>
            <div class='o_group_bouton o_group_bouton_chat'><span id='o_msgImg' class='option_gestion' onclick="miseEnForme('message','img');"><img height='12' src='images/BBCode/picture.png' title='Image' /></span><span id='o_msgLink' class='option_gestion' class='btn' onclick="miseEnForme('message','url');"><img height='12' src='images/BBCode/link.png' title='Lien' /></span><span id='o_msgPlay' class='option_gestion' onclick="miseEnForme('message','player');"><img height='12' src='images/BBCode/membre.gif' title='Pseudo'/></span><span id='o_msgAlly' class='option_gestion' onclick="miseEnForme('message','ally');"><img height='12' src='images/BBCode/groupe.gif' title='Alliance'/></span></div>`);
        $(".o_group_bouton span").css("background-color", monProfil.couleur1);

		$("#o_msgUp").click((e) => {
			e.preventDefault();
			$("#message").val("[size=4]" + $("#message").val() + "[/size]");
			$("#message")[0].selectionStart += 8;
			$("#message")[0].selectionEnd -= 7;
			$("#message").focus();
		});
		$("#o_msgDown").click((e) => {
			e.preventDefault();
			$("#message").val("[size=2]" + $("#message").val() + "[/size]");
			$("#message")[0].selectionStart += 8;
			$("#message")[0].selectionEnd -= 7;
			$("#message").focus();
		});
		$("#o_msgB, #o_msgI, #o_msgU, #o_msgImg, #o_msgLink, #o_msgPlay, #o_msgAlly").click((e) => {e.preventDefault();});
	}
	/**
	* Parse le message pour convertir les smiley par le bbcode correspondant.
    *
	* @private
	* @method parseMessage
	*/
	parseMessage()
	{
		let color = $("#inputCouleur").val();
		if(color != "000000" && color != "0000000")
			$("#message").val("[color=#" + color + "]" + $("#message").val() + "[/color]");
		let mess = $("#message").val();
		for(let i = 1 ; i < 27 ; i++){
			if(mess.indexOf("{outiiil" + i + "}") >= 0)
				mess = mess.replace("{outiiil" + i + "}", "[img]http://outiiil.fr/images/outiiil/" + i + ".gif[/img]");
		}
		$("#message").val(mess);
	}
	/**
	* Ajoute/modifie le color picker.
    *
	* @private
	* @method couleur
	*/
	couleur()
    {
		if(monProfil.parametre.couleurChat)
            $("#inputCouleur").val(monProfil.parametre.couleurChat.valeur.substring(1));
		$("#boutonCouleur").remove();
		$("#smileySuivant0").after(`<span><input id='color' type='color' name='couleur' value='${monProfil.parametre.couleurChat.valeur}'/></span>`);
		$("#color").change((e) => {
            let color = e.currentTarget.value;
			$("#inputCouleur").val(color.substring(1));
			monProfil.parametre.couleurChat.valeur = color;
            monProfil.parametre.couleurChat.sauvegarde();
		});
	}
	/**
	* Ajoute les emoticones de base pour les non compte+.
    *
	* @private
	* @method emoticone
	*/
	emoticone()
    {
		if(!Utils.comptePlus){
			$("#listeSmiley20").html(LISTESMILEY1);
			$("#listeSmiley30").html(LISTESMILEY2);
			$("#listeSmiley40").html(LISTESMILEY3);
			$("#listeSmiley50").html(LISTESMILEY4);
			$("#listeSmiley60").html(LISTESMILEY5);
			$("#listeSmiley70").html(LISTESMILEY6);
		}
		// Ajout des emoticones d'outiiil
		let ligne = `<div id='listeSmiley80' style='display:none'>`;
		for(let i = 0 ; ++i < 27 ; ligne += `<img id='smiley_${i}' src='http://outiiil.fr/images/outiiil/${i}.gif'>`);
		$("#tousLesSmiley0").append(ligne + `</div>`);

		$("img[id^=smiley_]").click((e) => {$("#message").val($("#message").val() + "{outiiil" + $(e.currentTarget).attr("id").slice(7) + "}");});
		// Changement des actions pour les listes
		$("#smileyPrecedent0")
            .html(`<img title='Précédent' class='cursor' src='images/bouton/fleche-champs-gauche.gif' />`)
            .removeAttr("onclick")
            .click(() => {
                let div = $("#tousLesSmiley0").find("div:visible");
                div.hide();
                div.prev().length ? div.prev().show() : $("#tousLesSmiley0 div:last").show();
            });
		$("#smileySuivant0")
            .html(`<img title='Suivant' class='cursor' src='images/bouton/fleche-champs-droite.gif'/>`)
            .removeAttr("onclick")
            .click(() => {
                let div = $("#tousLesSmiley0").find("div:visible");
                div.hide();
                div.next().length ? div.next().show() : $("#tousLesSmiley0 div:first").show();
            });
	}
}
