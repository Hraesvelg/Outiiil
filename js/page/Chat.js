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
        /**
        * Compteur pour l'autoactualisation
        */
        this._timeoutChat = -1;
    }
    /**
    *
    */
    executer()
    {
        // fonction plus
        if(!Utils.comptePlus) this.plus();
        // Couleur du texte
        this.couleur();
        // Emoticone
        this.emoticone();
        // Reaffichage message
        this.afficheMessage();
        // Modification pour l'envoie du formulaire
        $("#message").on("keypress", (e) => {
            let code = e.keyCode || e.which;
            if(code == 13)
                this.parserMessage();
        });
        $("input[name='Envoyer']").click((e) => {this.parserMessage();});
        return this;
    }
	/**
	* Change l'apparance de l'affichage des messages, "Pseudo (datetime) :" au lieu de "datetime pseudo :"
    *
	* @private
	* @method afficheMessage
	*/
	afficheMessage()
	{
        // ajoute du cite sur les anciens messages
		$("#anciensMessages p, #nouveauxMessages p").each((i, elt) => {
			$(elt).html((i, html) => {
				let nth = 0;
				return html.replace(/:/g, (match, j) => {
					nth++;
					return nth == 3 ? ` <span id="o_cite${$(elt).attr("id")}" class="reduce souligne cursor">citer</span> :` : match;
				});
			});
		});
        // event sur les anciens message
        $("span[id^='o_cite']").click((e) => {
            let texte = this.citerMessage(e);
            texte.length && $("#message").val(`[i]${texte}[/i] // `).focus();
        });
        // ajotu du cite pour les nouveaux messages
		$("#nouveauxMessages").on("DOMNodeInserted", (e) => {
            let element = $(e.target);
			if(element.is("p") && !element.hasClass("o_parsed")){
				$(element).addClass("o_parsed");
				element.html((i, html) => {
					let nth = 0;
					return html.replace(/:/g, (match, i) => {
						nth++;
						return nth == 3 ? ` <span id="o_cite${element.attr("id")}" class="reduce souligne cursor">citer</span> :` : match;
					});
				});
                $(`#o_cite${element.attr("id")}`).click((e) => {
                    let texte = this.citerMessage(e);
                    texte.length && $("#message").val(`[i]${texte}[/i] // `).focus();
                });
			}
		});
        // ajout de l'event lorsqu'on actualise et que les nouveaux messages passent en anciens messages
        $("#anciensMessages").on("DOMNodeInserted", (e) => {
            $("span[id^='o_cite']").off().click((e) => {
                let texte = this.citerMessage(e);
                texte.length && $("#message").val(`[i]${texte}[/i] // `).focus();
            });
		});
        return this;
	}
    /**
    *
    */
    getMessage()
    {
        return $.ajax({url : "http://" + Utils.serveur + ".fourmizzz.fr/appelAjax.php", data : "actualiserChat=" + ($(".titre:first").text().includes("Alliance") ? "alliance" : "general")});
    }
	/**
	* Ajoute la Couleur, options de chat.
    *
	* @private
	* @method plus
	*/
	plus()
	{
        // ajout de l'auto actualisation
        $("#actualiser").after(" --- <label><input id='o_autoActualiser' type='checkbox' name='autoActualiser'/>auto</label> ");
        $("#o_autoActualiser").change(() => {
            if($("#o_autoActualiser").prop("checked"))
                this.actualiserMessage();
            else
                clearTimeout(this._timeoutChat);
        });
        // Ajout des fonctions de mise en forme
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
        // Ajout des emoticone
        $("#listeSmiley20").html(LISTESMILEY1);
        $("#listeSmiley30").html(LISTESMILEY2);
		$("#listeSmiley40").html(LISTESMILEY3);
		$("#listeSmiley50").html(LISTESMILEY4);
		$("#listeSmiley60").html(LISTESMILEY5);
		$("#listeSmiley70").html(LISTESMILEY6);
	}
    /**
    *
    */
    actualiserMessage(nbTour = 40)
    {
        if(nbTour){
            this.getMessage().then((data) => {
                $("#anciensMessages").prepend($('#nouveauxMessages').html());
                $("#nouveauxMessages").html(data.message);
                $("#NonLuMess").html(data.NonLuMess);
                $("#NonLuRapComb").html(data.NonLuRapComb);
                $("#NonLuRapChass").html(data.NonLuRapChass);
            }, (jqXHR, textStatus, errorThrown) => {
                $.toast({...TOAST_ERROR, text : "Mise à jour des messages impossible."});
            });
            this._timeoutChat = setTimeout(() => {this.actualiserMessage(--nbTour);}, 5000);
        }else
            $("#o_autoActualiser").prop("checked", false);
        return this;
    }
    /**
    *
    */
    citerMessage(e)
    {
        let clone = $(e.currentTarget).parent().clone();
        $("span", clone).remove();
        let texte = clone.text();
        if(texte.length > 80) texte = texte.substring(0, 80) + "...";
        return texte;
    }
	/**
	* Parse le message pour convertir les smiley par le bbcode correspondant.
    *
	* @private
	* @method parserMessage
	*/
	parserMessage()
	{
		let color = $("#inputCouleur").val();
		if(color != "000000" && color != "0000000")
			$("#message").val("[color=#" + color + "]" + $("#message").val() + "[/color]");
		$("#message").val($("#message").val().replace(/\{outiiil([1-9]|1[0-9]|2[0-6])\}/g, "[img]http://outiiil.fr/images/outiiil/$1.gif[/img]"));
        return this;
	}
	/**
	* Ajoute/modifie le color picker.
    *
	* @private
	* @method couleur
	*/
	couleur()
    {
		$("#inputCouleur").val(monProfil.parametre["couleurChat"].valeur.substring(1));
		$("#boutonCouleur").remove();
		$("#smileySuivant0").after(`<span><input id='color' type='color' name='couleur' value='${monProfil.parametre["couleurChat"].valeur}'/></span>`);
		$("#color").change((e) => {
            let color = e.currentTarget.value;
			$("#inputCouleur").val(color.substring(1));
			monProfil.parametre["couleurChat"].valeur = color;
            monProfil.parametre["couleurChat"].sauvegarde();
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
		// Ajout des emoticones d'outiiil
		let ligne = `<div id='listeSmiley80' style='display:none'>`;
		for(let i = 0 ; ++i < 27 ; ligne += `<img id='smiley_${i}' src='http://outiiil.fr/images/outiiil/${i}.gif'>`);
		$("#tousLesSmiley0").append(ligne + `</div>`);
		$("img[id^=smiley_]").click((e) => {$("#message").val($("#message").val() + "{outiiil" + $(e.currentTarget).attr("id").slice(7) + "}");});
        // Modification de la fleche preedante
        $("#smileyPrecedent0").replaceWith(() => {return `<span id="smileyPrecedent0"><img title='Précédent' class='cursor' src='images/bouton/fleche-champs-gauche.gif'/></span>`;});
        // Event sur la fleche preedante
		$("#smileyPrecedent0").click((e) => {
            let div = $("#tousLesSmiley0 > div:visible");
            div.hide();
            div.is(':first-child') ? $("#tousLesSmiley0 div:last").show() : div.prev().show();
        });
        // Modification de la fleche suivante
        $("#smileySuivant0").replaceWith(() => {return `<span id="smileySuivant0"><img title='Suivant' class='cursor' src='images/bouton/fleche-champs-droite.gif'/></span>`;});
        // Event sur la fleche suivante
		$("#smileySuivant0").click((e) => {
            let div = $("#tousLesSmiley0 > div:visible");
            div.hide();
            div.is(':last-child') ? $("#tousLesSmiley0 div:first").show() : div.next().show();
        });
	}
}
