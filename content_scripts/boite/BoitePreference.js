/*
 * BoitePreference.js
 * author           Hraesvelg
 * version          1.4.0
 **********************************************************************/
 
/**
* Classe permettant de choisir ses préférences.
* 
* @class BoitePreference
* @constructor
* @extends Boite
*/
var BoitePreference = Boite.extend({ 
	/**
	* Méthode principale de l'objet, initialise la classe.
    *
	* @private
	* @method initialize
	* @return 
	*/
	initialize : function()
	{
		this.html = "<div><span class='o_titrePref'>Style</span><table class='o_tablePref'>"
			+ "<tr><td class='left'>Thème</td><td class='right'><select id='o_themePref'><option value='0'>Classique</option><option value='1'>Tango</option><option value='2'>Matrix</option><option value='3'>Ubuntu</option></select></td></tr>"
			// Couleur primaire fond des boites
			+ "<tr><td class='left'>Fond</td><td class='right'><input id='o_color1Pref' type='color' value='" + Utils.data.couleur1 + "'/> <button id='o_defColor1'>Défaut</button></td></tr>"
			// Couleur secondaire complementaire des boites
			+ "<tr><td class='left'>Complémentaire</td><td class='right'><input id='o_color2Pref' type='color' value='" + Utils.data.couleur2 + "'/> <button id='o_defColor2'>Défaut</button></td></tr>"
			// Couleur tertiaire bordure des boites
			+ "<tr><td class='left'>Bordure</td><td class='right'><input id='o_color3Pref' type='color' value='" + Utils.data.couleur3 + "'/> <button id='o_defColor3'>Défaut</button></td></tr>"
			// Couleur du texte
			+ "<tr><td class='left'>Texte</td><td class='right'><input id='o_color4Pref' type='color' value='" + Utils.data.couleur4 + "'/> <button id='o_defColor4'>Défaut</button></td></tr>"
			// Position d'outiiil
			+ "<tr><td class='left'>Position</td><td class='right'><select id='o_positionPref'><option value='0' " + (Utils.data.position == '0' ? "selected" : "") + ">Droite</option><option value='1' " + (Utils.data.position == '1' ? "selected" : "") + ">Bas</option></select></td></tr>"
			+ "<tr><td colspan='2'><button id='o_savePref' class='o_marginT15'>Sauvegarder</button></td></tr>"
			+ "</table></div>";
		$("#o_boitePreference").append(this.html);
        $("#o_themePref, #o_positionPref").outerWidth($("#o_color1Pref").outerWidth() + $("#o_defColor1").outerWidth() + 5);
		
		this.css();
		this.event();
	},
	/**
	* Applique le style propre à la boite.
    *
	* @private
	* @method css
	* @return 
	*/
	css : function()
	{
		$(".o_titrePref").css("border-bottom-color", Utils.data.couleur2);
	},
	/**
	* Ajoute les evenements propres à la boite.
    *
	* @private
	* @method event
	* @return
	*/
	event : function()
	{
		$("#o_themePref").change(function(){
			var theme = $(this).val();
			// Classique
			if(theme == 0){
				$("#o_color1Pref").val("#d7c384");
				$("#o_color2Pref").val("#c9ad63");
				$("#o_color3Pref").val("#bd8d46");
				$("#o_color4Pref").val("#000000");
			// Tango
			}else if(theme == 1){
				$("#o_color1Pref").val("#9ad784");
				$("#o_color2Pref").val("#63a1c9");
				$("#o_color3Pref").val("#466dbd");
				$("#o_color4Pref").val("#000000");
			// Matrix
			}else if(theme == 2){
				$("#o_color1Pref").val("#555555");
				$("#o_color2Pref").val("#222222");
				$("#o_color3Pref").val("#1eff00");
				$("#o_color4Pref").val("#1eff00");
			// Ubuntu
			}else{
				$("#o_color1Pref").val("#ffda8c");
				$("#o_color2Pref").val("#feb489");
				$("#o_color3Pref").val("#d40000");
				$("#o_color4Pref").val("#000000");
			}
			$("#o_color1Pref").trigger("change");
			$("#o_color2Pref").trigger("change");
			$("#o_color3Pref").trigger("change");
			$("#o_color4Pref").trigger("change");
		});
		$("#o_color1Pref").change(function(){
			Utils.data.couleur1 = $(this).val();
			$(".o_closeElement b:nth-child(1)").css("border-top-color", $(this).val());
			$(".o_closeElement b:nth-child(2)").css("border-left-color", $(this).val());
			$(".o_closeElement b:nth-child(3)").css("border-bottom-color", $(this).val()); 
			$(".o_closeElement b:nth-child(4)").css("border-right-color", $(this).val());
			$(".o_contentElement, .o_contentElementB").css("background-color", $(this).val()); 
		});
		$("#o_color2Pref").change(function(){
			Utils.data.couleur2 = $(this).val();
			$(".o_item, .o_itemB, .o_closeElement, #o_ponteContent table tr:even, #o_tableLivraison tr:even, #o_tableCommande tr:even, #o_listeCommande table tr:even, #o_resultatChasse tr:even, #o_resultatCombat tr:even, #o_tabsJoueur3 table tr:even, .o_tabs .ui-widget-header .ui-tabs-anchor").css("background-color", $(this).val()); 
			$("#o_tableRess tr:nth-child(3n-2) td:first-child").css("border-bottom-color", $(this).val());
			$(".o_titrePref, .o_tabs > .ui-widget-header").css("border-bottom-color", $(this).val());
		});
		$("#o_color3Pref").change(function(){	  
			Utils.data.couleur3 = $(this).val(); 
			$(".o_item, .o_contentElement, .o_itemB, .o_contentElementB").css("border-left-color", $(this).val());
			$(".o_item, .o_contentElement, .o_itemB, .o_contentElementB").css("border-top-color", $(this).val());
			$(".o_item, .o_contentElement").css("border-bottom-color", $(this).val());
			$(".o_itemB, .o_contentElementB").css("border-right-color", $(this).val());
		});
		$("#o_color4Pref").change(function(){
			Utils.data.couleur4 = $(this).val();
			$(".o_contentElement, .o_contentElement table, .o_contentElementB, .o_contentElementB table").css("color", $(this).val());
		});
		$("#o_defColor1").click(function(){$("#o_color1Pref").val("#d7c384");$("#o_color1Pref").trigger("change");});
		$("#o_defColor2").click(function(){$("#o_color2Pref").val("#c9ad63");$("#o_color2Pref").trigger("change");});
		$("#o_defColor3").click(function(){$("#o_color3Pref").val("#bd8d46");$("#o_color3Pref").trigger("change");});
		$("#o_defColor4").click(function(){$("#o_color4Pref").val("#000000");$("#o_color4Pref").trigger("change");});
		$("#o_positionPref").change(function(){alert("Veuillez sauvegarder et recharger une page pour appliquer ce changement.")});
		$("#o_savePref").click(function(){
			Utils.data.couleur1 = $("#o_color1Pref").val();
			Utils.data.couleur2 = $("#o_color2Pref").val();
			Utils.data.couleur3 = $("#o_color3Pref").val();
			Utils.data.couleur4 = $("#o_color4Pref").val();
			Utils.data.position = $("#o_positionPref").val();
			localStorage.setItem("outiiil_data", JSON.stringify(Utils.data));
			alert("Données enrengistrées !");
		});
	}
});
