
				var evalFilterSelection = new Array();
				var renderSizeArray = new Array(9);
				
				var eval3DWidth = 500;
				var eval3DHeight = 500;
				var	faceMakerStarted = false;
				
				var documentRoot;
				

				
				if (window.location.hostname == "localhost") {
					documentRoot = "http://localhost/www/"
				} else {
					documentRoot = "http://facemaker.uvrg.org/";
				}
				
				var currentSlider = "";
				var zoom, targetZoom;
				var zoomSpeed = .1;
				var sliderInUse = false;
				var skipMovement = false;
				var isSavingAvatarImages = false;
				var imageID = 0;
				
				start();
				//console.log($.cookie());
				// findMetaData();
				
				
				function start(){
					$('#loadingScreen').show();
					$('#renderAvatarBox').hide();
					$("#sidebarRight").hide();
					$("#sidebarLeft").hide();
					$("#newface").hide();
					$("#sidebarLeft").mouseover(function(){ mouseOverUIElement = true; });
					$("#sidebarLeft").mouseout(function() { mouseOverUIElement = false; });
					$("#sidebarRight").mouseover(function(){ mouseOverUIElement = true; });
					$("#sidebarRight").mouseout(function() { mouseOverUIElement = false; });
					
					$("#evaluationResult").mouseover(function(){ mouseOverUIElement = true; });
					$("#evaluationResult").mouseout(function() { mouseOverUIElement = false; });
					
				}
				
				
				
				$( document ).ready(function() {
					loadLanguage();	
					initOne();
					animate();
				});
				
				function appChooser(){
					faceMakerStarted = true;
					lockIncreaseCountOf = true;
					var param = gup( 'param' );
					
					switch ( param ) 
					{
						case "eval": 
							openEvaluationBoard();
							showFace = true; 
						break;
						case "agen": {
							var loadTrialID = gup( 'trialid' );
							var loadUserUID = gup( 'useruid' );
							// openAvatarRenderer(loadTrialID,loadUserUID); 
							showFace = true;
						break;
						}
						default: 
                        console.log("open face generator!")
                        openFaceGenerator();
					}
					
				}
				
				function gup( name )
				{
					name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
					var regexS = "[\\?&]"+name+"=([^&#]*)";
					var regex = new RegExp( regexS );
					var results = regex.exec( window.location.href );
					if( results == null )
						return "";
					else
						return results[1];
				}
				
			//	checkForUserID();
				
				function shuffle(o){ //v1.0
					var splitter = parseInt(parseFloat(getDataCookie("userUID")));
					var str = "0." + splitter;
					var quasiRnd = parseFloat(str);
					//console.log("quasiRnd" + quasiRnd);
					
					for(var j, x, i = o.length; i; j = Math.floor(quasiRnd * i), x = o[--i], o[i] = o[j], o[j] = x);
					return o;
				};
				
				function generateSliders(){

					var sidebarAlignment = "sidebarLeft";
					var sliderItemCounterLeft = 0;
					var sliderItemCounterRight = 0;
					var maxSliderPerSidebar = 22;
					
					sliderCollection = shuffle(sliderCollection);
					
					for(var sliderGrp = 0; sliderGrp < sliderCollection.length; sliderGrp++){
						
						if(sliderItemCounterLeft > (sliderItemCounterRight + 2)) sidebarAlignment = "sidebarRight";
						else sidebarAlignment = "sidebarLeft";
						
						if(sidebarAlignment == "sidebarLeft") {
							sliderItemCounterLeft += sliderCollection[sliderGrp].length;
						} else {
							sliderItemCounterRight += sliderCollection[sliderGrp].length;
						}
						
						if(sidebarAlignment == "sidebarLeft") toolTipAlignment = "right";
						if(sidebarAlignment == "sidebarRight") toolTipAlignment = "left";

						var ctrlgrp = document.createElement("div");
						ctrlgrp.id = sliderCollection[sliderGrp][0][0] + "SliderGrp";
						ctrlgrp.className = "ctrlgrp";	
						
						
						sliderCollection[sliderGrp] = shuffle(sliderCollection[sliderGrp]);
						
						for(var slider = 0; slider < sliderCollection[sliderGrp].length; slider++){
							//console.log("slider " + sliderCollection[sliderGrp][slider][0]);
							var ctrlgrpWrapper = document.createElement("div");
							ctrlgrpWrapper.className = "ctrlgrpWrapper";
							ctrlgrpWrapper.id = sliderCollection[sliderGrp][slider][1] + "MM";
							
							var jawAndPitch = new Array();
							jawAndPitch[0] = sliderCollection[sliderGrp][slider][4];
							jawAndPitch[1] = sliderCollection[sliderGrp][slider][5];
							jawAndPitch[2] = sliderCollection[sliderGrp][slider][6];
							jawAndPitch[3] = sliderCollection[sliderGrp][slider][7];
							jawAndPitch[4] = sliderCollection[sliderGrp][slider][1];
							
							$(ctrlgrpWrapper).on( "mousemove", { value: jawAndPitch }, function(event) {
								if(sliderInUse == false) {
									_jawAndPitch = event.data.value;
									camTargetYaw = _jawAndPitch[0];
									camTargetPitch = _jawAndPitch[1];
									targetZoom = _jawAndPitch[2];
									targetCamHeight = camHeightOffset + _jawAndPitch[3];
									zoomSpeed = .1;
									if(currentSlider != _jawAndPitch[4]){
										currentSlider = _jawAndPitch[4]
										increaseCountOf(_jawAndPitch[4], "MM");
										//console.log("Name " + _jawAndPitch[4] + " " + parseInt(getDataCookie(_jawAndPitch[4])));
									}
								}
							});
							
							var ctrlGrpSliderCol = document.createElement("div");
							var ctrlGrpTextCol = document.createElement("div");
							var ctrlGrpButtonCol = document.createElement("div");
							
							ctrlGrpSliderCol.className = "ctrlGrpSliderCol";
							if(sliderCollection[sliderGrp][slider].length == 9) ctrlGrpSliderCol.className += " " + sliderCollection[sliderGrp][slider][8];
							ctrlGrpTextCol.className = "ctrlGrpTextCol";
							ctrlGrpButtonCol.className = "ctrlGrpButtonCol";
							
							ctrlGrpTextCol.innerHTML = languageMapping["label_" + sliderCollection[sliderGrp][slider][1]];
							if(languageFontSizeMapping["label_" + sliderCollection[sliderGrp][slider][1]] != null)
								ctrlGrpTextCol.style.fontSize = "6px";

							ctrlGrpSliderCol.innerHTML = "<input type='text' id='slider_" + sliderCollection[sliderGrp][slider][1] + "'/>";
							// ctrlGrpButtonCol.innerHTML = "<a class='tooltip tooltip" + toolTipAlignment + "' href='#'><input type='button' class='reload' onclick='reset(\"" + sliderCollection[sliderGrp][slider][1] + "\","+sliderCollection[sliderGrp][slider][3]+",true"+")'><span >" +  languageMapping['resetBtn_' + sliderCollection[sliderGrp][slider][1]] + "</span></input></a>";
							
							ctrlgrpWrapper.appendChild(ctrlGrpTextCol);
							ctrlgrpWrapper.appendChild(ctrlGrpSliderCol);
							ctrlgrpWrapper.appendChild(ctrlGrpButtonCol);
							
							ctrlgrp.appendChild(ctrlgrpWrapper);
						}
						
						if(sidebarAlignment == "sidebarLeft"){
							document.getElementById(sidebarAlignment).appendChild(ctrlgrp);
						}else {
							var node = document.getElementById("settingsSliderGrp");
							document.getElementById(sidebarAlignment).insertBefore(ctrlgrp, node);
						}
					}

					transformSliders();

				}
				
				function openFaceGenerator(){
					
					$("#sidebarRight").show();
					$("#sidebarLeft").show();
					
					var timeStartStamper = new Date();
					setDataCookie("timeStart", timeStartStamper.getTime());
					
		
					generateSliders();
					

					
					$("#generalSliderGrp").data({ 'originalLeft': $("#generalSliderGrp").css('left'), 'originalTop': $("#generalSliderGrp").css('top') });
					$("#eyesSliderGrp").data({ 'originalLeft': $("#eyesSliderGrp").css('left'), 'originalTop': $("#eyesSliderGrp").css('top') });
					$("#eyebrowsSliderGrp").data({ 'originalLeft': $("#eyebrowsSliderGrp").css('left'), 'originalTop': $("#eyebrowsSliderGrp").css('top') });
					$("#noseSliderGrp").data({ 'originalLeft': $("#noseSliderGrp").css('left'), 'originalTop': $("#noseSliderGrp").css('top') });
					$("#outerfaceSliderGrp").data({ 'originalLeft': $("#outerfaceSliderGrp").css('left'), 'originalTop': $("#outerfaceSliderGrp").css('top') });
					$("#jawSliderGrp").data({ 'originalLeft': $("#jawSliderGrp").css('left'), 'originalTop': $("#jawSliderGrp").css('top') });
					$("#mouthSliderGrp").data({ 'originalLeft': $("#mouthSliderGrp").css('left'), 'originalTop': $("#mouthSliderGrp").css('top') });
					$("#makeUpSliderGrp").data({ 'originalLeft': $("#makeUpSliderGrp").css('left'), 'originalTop': $("#makeUpSliderGrp").css('top') });
					$("#settingsSliderGrp").data({ 'originalLeft': $("#settingsSliderGrp").css('left'), 'originalTop': $("#settingsSliderGrp").css('top') });
					
				}
				
				function btnResetUI() {
					$("#generalSliderGrp").css({ 'left': $("#generalSliderGrp").data('originalLeft'), 'top': $("#generalSliderGrp").data('originalTop')});
					$("#eyesSliderGrp").css({ 'left': $("#eyesSliderGrp").data('originalLeft'), 'top': $("#eyesSliderGrp").data('originalTop')});
					$("#eyebrowsSliderGrp").css({ 'left': $("#eyebrowsSliderGrp").data('originalLeft'), 'top': $("#eyebrowsSliderGrp").data('originalTop')});
					$("#noseSliderGrp").css({ 'left': $("#noseSliderGrp").data('originalLeft'), 'top': $("#noseSliderGrp").data('originalTop')});
					$("#outerfaceSliderGrp").css({ 'left': $("#outerfaceSliderGrp").data('originalLeft'), 'top': $("#outerfaceSliderGrp").data('originalTop')});
					$("#jawSliderGrp").css({ 'left': $("#jawSliderGrp").data('originalLeft'), 'top': $("#jawSliderGrp").data('originalTop')});
					$("#mouthSliderGrp").css({ 'left': $("#mouthSliderGrp").data('originalLeft'), 'top': $("#mouthSliderGrp").data('originalTop')});
					$("#makeUpSliderGrp").css({ 'left': $("#mouthSliderGrp").data('originalLeft'), 'top': $("#mouthSliderGrp").data('originalTop')});
					$("#settingsSliderGrp").css({ 'left': $("#settingsSliderGrp").data('originalLeft'), 'top': $("#settingsSliderGrp").data('originalTop')});
					setDataCookie("interfaceResetClicked",(parseInt(getDataCookie("interfaceResetClicked"))+1));
				}
				
				function openEvaluationBoard(){
					$("#sidebarRight").hide();
					$("#sidebarLeft").hide();
					
					fileName = "evalAvatar.png";
					
					// generateSliders();
					resetAllSlider(true);
					
					evalMode = true;
					
					$('#container3D div canvas').css("width", eval3DWidth);
					$('#container3D div canvas').css("height", eval3DHeight);
					$('#container3D div canvas').css("border", "2px solid #fff");
					$('#container3D div canvas').css("position", "absolute");
					$('#container3D div canvas').css("top", 10);
					$('#container3D div canvas').css("left", 10);
					
					$("#container3D").mouseover(function(){ mouseOverUIElement = false; });
					$("#container3D").mouseout(function() { mouseOverUIElement = true; });
				
					camera.aspect = eval3DWidth / eval3DHeight;
					camera.updateProjectionMatrix();

					$('#evaluationBackground').show();
					
					if(evalMode == true) {
						canvas3DHalfX = eval3DWidth / 2;
						canvas3DHalfY = eval3DHeight / 2;
					}
					renderer.setSize( eval3DWidth, eval3DHeight );
					render();
					dataUrl = renderer.domElement.toDataURL("image/png");
					
					var showOnlyCompleteTrials = false;
					
					evalFilter();
					
					function evalFilter(){
						$("#filterTable").empty();
						
						
						evalFace();
					}
					
					
					
					 
					function evalFace() {					
						$("#faceResultTable").empty();
						$("#demoResultTable").empty();
						
						var str = "";
						str += "(";
						for(var item in evalFilterSelection){
							
							if(item != "theCountry" ){
								var selectedItems = $("#" +item).val();
								
								for(var field in selectedItems){
									str += "(" + item + ":'" + selectedItems[field]+"')OR";
								}
								
								if(selectedItems != null) {
									str = str.substring(0, str.length - 2);
									str += ")AND(";
								}
								
							}
							
							
						}
						str = str.substring(0, str.length - 4);
						
						str = "query=" + str;				
						
						var faceDataEval = new Array();
						var aggregatedData = new Array();
										
						
						loadFaceWithStr(str);
						
					}

					console.log("eval mode");
				}
				
                


				
				function loadFaceWithStr(str) {
					
					//console.log("Sended: " + str);	
					
					$.ajax({ async: true, crossDomain: false, cache: true, type: "POST", url: "php/getAvgData.php", data: str, success: function(response) {
                       // console.log("Received: " + response);
						
						if(response!=""){
							
							var responseColumns = response.split("|");
							
							document.getElementById("resultsTitle").innerHTML = "No Results";
							document.getElementById("demoTitle").innerHTML = "";
							
							//search for MaxRsts
							
							function searchForMax(_theColumn, _theSearchValues){
								var maxValue = 0.0;
								for(var _theColumn in responseColumns) {
									var responseNameAndValue = responseColumns[_theColumn].split("=");
									var fieldNameAndCount = responseNameAndValue[0].split("_");
									
									var field = fieldNameAndCount[0];
									if ( field.search(_theSearchValues) > 0 ){
										var theValue = parseFloat(responseNameAndValue[1]);
										var theRstArray = new Array();
										if ( theValue > maxValue ) maxValue = theValue;
									}
								}
								return maxValue;
							}
							
							maxRstValue = searchForMax(column, "Rst");
							maxMMValue = searchForMax(column, "MM");
							maxClkValue = searchForMax(column, "Clk");
							maxClickedValue = searchForMax(column, "Clicked");
							
							for(var column in responseColumns) {
								var responseNameAndValue = responseColumns[column].split("=");
								var fieldNameAndCount = responseNameAndValue[0].split("_");
								
								var field = fieldNameAndCount[0];
								var count = "";
								
								if (fieldNameAndCount[1] != null) count = " <i>(" + fieldNameAndCount[1] + ")</i>"
								
								var value = responseNameAndValue[1];
								var resultRow = document.createElement("div"); resultRow.className = "sp_sub_table_row";
								var resultName = document.createElement("div"); resultName.className = "sp_sub_table_cell question";
								var resultValue = document.createElement("div"); resultValue.className = "sp_sub_table_cell";
								var resultValueBar = document.createElement("div"); resultValueBar.className = "sp_sub_table_cell_bar";
								
								var barWidth = 130;
								var valBarWidth = ((value * barWidth) - (barWidth / 2));
								var valBarOffsetVal = 0;
										
								resultName.innerHTML = ((languageMapping["label_" + field] == null) ? field : languageMapping["label_" + field]) + count; 
								resultValue.innerHTML = value;
							
								resultRow.appendChild(resultName);
								resultRow.appendChild(resultValue);
									
								if( field == "found"){
									document.getElementById("resultsTitle").innerHTML = "Average from " + value + " results";
									document.getElementById("demoTitle").innerHTML = value + " demographic data sets";
								}else if(field == "latinSquare" ||field == "trialid" || field == "latinSquare"|| field == "timeDate"|| field == "cookies"|| field == "webgl"|| field == "acceptTOU" ||field == "sessions" || field == "userUID" || field == "systemLanguage"|| field == "userLanguage" || field == "ipadress" || field == "theAge" || field == "theGender" || field == "theCountry" ||  field == "appVersion" || field == "product" || field == "playingGames" || field == "watchingMovies" || field == "screenHeight"  || field == "screenWidth" || field == "browser"|| field == "appCodeName" || field == "platform"|| field == "browser" )
								{
									if(field == "trialid") fileName = "avatar.png";
									
									if(field == "theCountry") {
										var str = "";
										value = value.substr(0, (value.length - 1))
										var values = value.split(",");
										for(vals in values){
											var countryAndCount = values[vals].split(" ");
											str += "<b>" + countryList['en'][parseInt(countryAndCount[0])] +"</b> " + " <i>(" + countryAndCount[1] +")</i><br />";
										}
										var values = values[0].split(",");					
										resultValue.innerHTML = str;
									}
									
									document.getElementById("demoResultTable").appendChild(resultRow);
									
								} else if ( field == "faceGender" || field == "faceStyle" || field == "skinDetails" || field == "skinColor" || field == "hairColor" || field == "eyeColor" || field == "eyeShape" || field == "eyeOpening" ||  field == "eyeSize" || field == "eyeHeight" || field == "eyeDistance" || field == "eyeDepth" || field == "eyeRotation" || field == "eyebrowsColor" || field == "eyebrowsShape" || field == "eyebrowsLine" || field == "noseShape" || field == "noseLength" || field == "noseWidth" || field == "noseBridge" || field == "foreheadHeight" || field == "cheeksBone" || field == "jawShape" || field == "jawChin" || field == "jawLength" || field == "earSize" || field == "throatSize" || field == "lipRatio" || field == "mouthVolume" || field == "mouthWidth" || field == "mouthHeight" || field == "mouthDepth" || field == "mouthOverlap" || field == "noseCartilage" || field == "eyeShadow" || field == "lipStick" || field == "rouge" || field == "finalQuestion1" || field == "finalQuestion2" || field == "finalQuestion3" || field == "finalQuestion4" ) {
									dataArray[field] = parseFloat(value);
									//console.log("field: " + field + " - "+ dataArray[field]);
									resultName.innerHTML = ((languageMapping["label_" + field] == null) ? field : languageMapping["label_" + field]) + count;
									
									if( value < 1 && field != "finalQuestion1" && field != "finalQuestion2" && field != "finalQuestion3" && field != "finalQuestion4"	){
									
										if( field == "lipStick" || field == "eyeShadow" ||  field == "rouge" || field == "faceStyle" ){
											valBarWidth = ((value * barWidth));
											valBarOffsetVal = 0;
										} else {	
											if (valBarWidth < 0){
												valBarWidth = valBarWidth * -1;
												valBarOffsetVal = (barWidth / 2) - valBarWidth;
											} else {
												valBarOffsetVal = (barWidth / 2);
											}												
										}
										var valBarOffset = "translate(" +  valBarOffsetVal + "px, -20px)";
										valBarWidth = valBarWidth + 1;
										
										resultValueBar.style.width  =  valBarWidth + "px";
										resultValueBar.style.transform  =  valBarOffset;
										resultValue.appendChild(resultValueBar);
									}
									document.getElementById("faceResultTable").appendChild(resultRow);

									//resultValueBar.css("transform",valBarOffset);
								
								} else if ( field.search("Clk") > 0 ) {						
									resultName.innerHTML = ((languageMapping["label_" + field] == null) ? field : languageMapping["label_" + field]) + count;
									valBarWidth = ((value / maxClkValue) * barWidth);
									resultValueBar.style.width  =  valBarWidth + "px";
									valBarOffsetVal = 0;
									var valBarOffset = "translate(" +  valBarOffsetVal + "px, -20px)";
									
									resultValueBar.style.transform  =  valBarOffset;
									resultValue.appendChild(resultValueBar);
									document.getElementById("faceResultTable").appendChild(resultRow);										
								} else if ( field.search("Clicked") > 0 ) {						
									resultName.innerHTML = ((languageMapping["label_" + field] == null) ? field : languageMapping["label_" + field]) + count;
									valBarWidth = ((value / maxClickedValue) * barWidth);
									resultValueBar.style.width  =  valBarWidth + "px";
									valBarOffsetVal = 0;
									var valBarOffset = "translate(" +  valBarOffsetVal + "px, -20px)";
									
									resultValueBar.style.transform  =  valBarOffset;
									resultValue.appendChild(resultValueBar);
									document.getElementById("faceResultTable").appendChild(resultRow);								
								} else if ( field.search("MM") > 0 ) {						
									resultName.innerHTML = ((languageMapping["label_" + field] == null) ? field : languageMapping["label_" + field]) + count;
									valBarWidth = ((value / maxMMValue) * barWidth);
									resultValueBar.style.width  =  valBarWidth + "px";
									valBarOffsetVal = 0;
									var valBarOffset = "translate(" +  valBarOffsetVal + "px, -20px)";
									
									resultValueBar.style.transform  =  valBarOffset;
									resultValue.appendChild(resultValueBar);
									document.getElementById("faceResultTable").appendChild(resultRow);
								} else if ( field.search("Rst") > 0 ) {						
									resultName.innerHTML = ((languageMapping["label_" + field] == null) ? field : languageMapping["label_" + field]) + count;
									valBarWidth = ((value / maxRstValue) * barWidth);
									resultValueBar.style.width  =  valBarWidth + "px";
									valBarOffsetVal = 0;
									var valBarOffset = "translate(" +  valBarOffsetVal + "px, -20px)";
									
									resultValueBar.style.transform  =  valBarOffset;
									resultValue.appendChild(resultValueBar);
									document.getElementById("faceResultTable").appendChild(resultRow);
								} else {
									if(field == "timeDuration" || field == "timeMainSessionTime") resultValue.innerHTML = round(parseFloat((value) / 1000 / 60),2) + " min ";
									if(field == "timeWelcome" || field == "timeStart"|| field == "timeEnd")
									{
										myDate = new Date(parseInt(value));
										resultValue.innerHTML = myDate.toLocaleString();
									}
									document.getElementById("faceResultTable").appendChild(resultRow);
								}
							}
							// mapCookiesToFace();
							
							if(isSavingAvatarImages){
							
								var fileURL = renderer.domElement.toDataURL("image/png");
								console.log("IMAGE ID: " + (imageID - 1) + " pitch " + camPitch + " yaw " + camYaw)
								$.ajax({
									url: "php/uploadFile.php?id=" + pad((imageID-1),4) + "_" + camPitch + "_" + camYaw, // Url to which the request is send
									type: "POST",             // Type of request to be send, called as method
									data: fileURL, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
									contentType: "image/png",       // The content type used when sending data to the server.
									cache: false,             // To unable request pages to be cached
									processData: false,        // To send DOMDocument or non processed data file it is set to false
									success: function(data)   // A function to be called if request succeeds
									{
										//$('#loading').hide();
										console.log("Sended: " + data);
                                        imageID++;
                                        // saveAvatarImageOnServer();
										
										
									}
								});
							}
							
							
						}else{
							document.getElementById("resultsTitle").innerHTML = "No Results";
							document.getElementById("demoTitle").innerHTML = "";
							$('#container3D div canvas').hide();
						}
						
					}});
					
					
				}
				function pad(num, size) {
                    var s = "000000000" + num;
                    return s.substr(s.length-size);
                }
				
				$("body").css("overflow","hidden");
			

				var dataUrl;
				

				
				function round(zahl,n){
					var faktor;
					faktor = Math.pow(10,n);
					return (Math.round(zahl * faktor) / faktor);
				}
				
				
				function fallbackStart(){

					resetAllSlider(false);
					resetCounterCookies();
					clearListCookies();
					removeAllDataCookies();
					clearOldUserUID();
					deleteNeedTask();
					deleteCookieString();
					setDataCookie("acceptTOU", 0);
					$.cookie("sessionFinished", 1);
					$.cookie("sessions",0)
					window.location.assign(documentRoot);
					
				}
				
				function restartFaceMaker(){
					
					resetAllSlider();
					start();
					loadLanguage();	
					init();
					animate();
				}

				
				
				if(languageMapping == null)
				var languageMapping = new Array();				
				
				if(languageFontSizeMapping == null)
				var languageFontSizeMapping = new Array();
				
				function loadLanguage(){
					$.ajax({async: true, crossDomain: false, cache: true,  type: "GET", url: "data/sites.xml", dataType: "xml", success: function(xml) {
						$(xml).find('static[id="facelab"]').children().each(function(){	
							if( $(this).attr('fontSize') != null) 
							updateHTML((this).nodeName, $(xml).find('static[id="facelab"]').find((this).nodeName + '[lang="' + 'en' + '"]').text(), $(this).attr('fontSize'));
							else 
							updateHTML((this).nodeName, $(xml).find('static[id="facelab"]').find((this).nodeName + '[lang="' + 'en' + '"]').text());
						});
						$(xml).find('dynamic[id="facelab"]').children().each(function(){	
							if( $(this).attr('fontSize') != null) {
								languageMapping[(this).nodeName] = $(xml).find('dynamic[id="facelab"]').find((this).nodeName + '[lang="' + 'en' + '"]').text();
								languageFontSizeMapping[(this).nodeName] = $(xml).find('dynamic[id="facelab"]').find((this).nodeName + '[lang="' + 'en' + '"]').text();
							} else {
								languageMapping[(this).nodeName] = $(xml).find('dynamic[id="facelab"]').find((this).nodeName + '[lang="' + 'en' + '"]').text();
							}
						});
					}}).done(function() {
						
						$('#sendFace').prop('value', languageMapping["sendFace"]);
					});
				}
				
				function updateHTML(_id, _value, _fontsize) {
					var elem = document.getElementById(_id);
					if(elem != null) document.getElementById(_id).innerHTML = _value;
					if(elem != null && _fontsize != null){ $("#"+_id).css("font-size", _fontsize + "px");}
				}

				function transformSliders() {	
					
					$("#slider_faceGender").ionRangeSlider({ values: [ languageMapping["female"], "asex", languageMapping["male"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
							sliderInUse = true;
							faceMorphingWeights["face"][1] = obj.fromPers/100;
							faceMorphingWeights["shirt"][1] = obj.fromPers/100;
							faceMorphingWeights["lashes"][21] = obj.fromPers/100;
							faceMaps["lashes"][0]["opacity"] = 1 - obj.fromPers/100;
							faceMaps["lashes"][1]["opacity"] = obj.fromPers/100;
							faceMaps["face"][4]["opacity"] = obj.fromPers/100;

							
							// setDataCookie("faceGender", obj.fromPers/100);
							increaseCountOf("faceGender", "Clk");
							computeMorphing("all"); 
							computeBlending("all"); 
						}
					});			
					
					$("#slider_faceStyle").ionRangeSlider({ values: [ languageMapping["real"], "normal", languageMapping["cartoon"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 0, hasGrid: true, onChange: function (obj) { 
							sliderInUse = true;
							faceMorphingWeights["plane"][1] = (obj.fromPers/100) * 1;
							faceMorphingWeights["lashes"][16] = (obj.fromPers/100) * 1;
							faceMorphingWeights["face"][2] =  (obj.fromPers/100) * 1;	
							faceMorphingWeights["eyes"][10] = (obj.fromPers/100) * 1;	
							faceMorphingWeights["shirt"][2] = (obj.fromPers/100) * 1;
							
							faceMaps["eyes"][1]["opacity"] = 1 - (obj.fromPers/100);	
							// setDataCookie("faceStyle", obj.fromPers/100);
							increaseCountOf("faceStyle", "Clk");
							
							computeMorphing("all"); 
							computeBlending("eyes"); 
						}
					});
				
					$("#slider_skinDetails").ionRangeSlider({ values: [ languageMapping["smooth"], "normal", languageMapping["porous"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1, hasGrid: true, onChange: function (obj) {   // callback is called on every slider change
							sliderInUse = true;
							faceMaps["face"][3]["opacity"] = obj.fromPers/100;
							// setDataCookie("skinDetails", obj.fromPers/100);
							increaseCountOf("skinDetails", "Clk");
							computeBlending("face");
					}});
						
					$("#slider_skinColor").ionRangeSlider({ values: [ languageMapping["dark"], "Normal", languageMapping["bright"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1, hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var blendingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(blendingBalance < 0){
							faceMaps["face"][1]["opacity"] = 0;
							faceMaps["face"][2]["opacity"] = blendingBalance * -1;
						} else {
							faceMaps["face"][1]["opacity"] = blendingBalance;
							faceMaps["face"][2]["opacity"] = 0;
						}
						// setDataCookie("skinColor", obj.fromPers/100);
						increaseCountOf("skinColor", "Clk");
						computeBlending("face");
					}});

					$("#slider_hairColor").ionRangeSlider({ values: [ languageMapping["black"], languageMapping["brunette"], languageMapping["mediumblonde"], languageMapping["red"], languageMapping["brightblonde"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 98, hasGrid: true, onLoad: function(obj) {
							$(".haircolor").find( ".irs-line" ).css("background-image","url(img/sprite-hair-color.png)");
							$(".haircolor").find( ".irs-line-left" ).hide();
							$(".haircolor").find( ".irs-line-mid" ).hide();
							$(".haircolor").find( ".irs-line-right" ).hide();
						}, onLoad: function (obj) {   // callback is called on every slider change
							sliderInUse = true;
							var blendingBalance = obj.fromPers/100;
							
							if(blendingBalance <= 0.25){
								faceMaps["face"][5]["opacity"] = 1;
								faceMaps["face"][6]["opacity"] = (blendingBalance - 0.00) * 4;
								faceMaps["face"][7]["opacity"] = 0;
								faceMaps["face"][8]["opacity"] = 0;
								faceMaps["face"][9]["opacity"] = 0;
							} else if(blendingBalance > 0.25 && blendingBalance <= 0.50){
								faceMaps["face"][5]["opacity"] = (blendingBalance - 0.00) * 4;
								faceMaps["face"][6]["opacity"] = (blendingBalance - 0.00) * 4;
								faceMaps["face"][7]["opacity"] = (blendingBalance - 0.25) * 4;
								faceMaps["face"][8]["opacity"] = 0;
								faceMaps["face"][9]["opacity"] = 0;
							} else if(blendingBalance > 0.50 && blendingBalance <= 0.75){
								faceMaps["face"][5]["opacity"] = (blendingBalance - 0.00) * 4;
								faceMaps["face"][6]["opacity"] = (blendingBalance - 0.00) * 4;
								faceMaps["face"][7]["opacity"] = (blendingBalance - 0.25) * 4 ;
								faceMaps["face"][8]["opacity"] = (blendingBalance - 0.50) * 4 ;
								faceMaps["face"][9]["opacity"] = 0;
							} else {
								faceMaps["face"][5]["opacity"] = (blendingBalance - 0.00) * 4;
								faceMaps["face"][6]["opacity"] = (blendingBalance - 0.00) * 4;
								faceMaps["face"][7]["opacity"] = (blendingBalance - 0.25) * 4 ;
								faceMaps["face"][8]["opacity"] = (blendingBalance - 0.50) * 4 ;
								faceMaps["face"][9]["opacity"] = (blendingBalance - 0.75) * 4 ;		
							}
							
							for(var i = 0; i < 5; i++) {
								if(faceMaps["face"][5+i]["opacity"] >= 1) faceMaps["face"][5+i]["opacity"] = -faceMaps["face"][5+i]["opacity"] + 2;
								if(faceMaps["face"][5+i]["opacity"] < 0) faceMaps["face"][5+i]["opacity"] = 0;
							}
							// setDataCookie("hairColor", obj.fromPers/100);
							increaseCountOf("hairColor", "Clk");
							//computeEyeBrowBlendings();
							computeBlending("face");
					}});
					
					$("#slider_eyeColor").ionRangeSlider({ values: [ languageMapping["black"], languageMapping["brown"], languageMapping["amber"], languageMapping["green"], languageMapping["blue"], languageMapping["brightblue"], languageMapping["grey"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1, hasGrid: true, onLoad: function(obj) {
						$(".eyecolor").find( ".irs-line" ).css("background-image","url(img/sprite-skin-color.png)");
						$(".eyecolor").find( ".irs-line-left" ).hide();
						$(".eyecolor").find( ".irs-line-mid" ).hide();
						$(".eyecolor").find( ".irs-line-right" ).hide();
					}, onChange: function (obj) {
						sliderInUse = true;
						var blendingBalance = obj.fromPers/100;
						var segmentos = 6;
						
						if(blendingBalance <= (1/segmentos)){ 
							faceMaps["eyes"][2]["opacity"] = 1; 
							faceMaps["eyes"][3]["opacity"] = (blendingBalance - 0.00) * segmentos;
							faceMaps["eyes"][4]["opacity"] = 0;
							faceMaps["eyes"][5]["opacity"] = 0;
							faceMaps["eyes"][6]["opacity"] = 0;
							faceMaps["eyes"][7]["opacity"] = 0;
							faceMaps["eyes"][8]["opacity"] = 0;
						} else if(blendingBalance > (1/segmentos) && blendingBalance <= (2/segmentos)){
							faceMaps["eyes"][2]["opacity"] = 1;
							faceMaps["eyes"][3]["opacity"] = (-(blendingBalance - 1/segmentos) * segmentos) + 1;
							faceMaps["eyes"][4]["opacity"] = ( (blendingBalance - 1/segmentos) * segmentos); 
							faceMaps["eyes"][5]["opacity"] = 0;
							faceMaps["eyes"][6]["opacity"] = 0;
							faceMaps["eyes"][7]["opacity"] = 0;
							faceMaps["eyes"][8]["opacity"] = 0;
							
						} else if(blendingBalance > (2/segmentos) && blendingBalance <= (3/segmentos)){
							faceMaps["eyes"][2]["opacity"] = 1;
							faceMaps["eyes"][3]["opacity"] = 0;
							faceMaps["eyes"][4]["opacity"] = (-(blendingBalance - 2/segmentos) * segmentos) + 1;
							faceMaps["eyes"][5]["opacity"] = ( (blendingBalance - 2/segmentos) * segmentos); 
							faceMaps["eyes"][6]["opacity"] = 0;
							faceMaps["eyes"][7]["opacity"] = 0;
							faceMaps["eyes"][8]["opacity"] = 0;
							
						} else if(blendingBalance > (3/segmentos) && blendingBalance <= (4/segmentos)){
							faceMaps["eyes"][2]["opacity"] = 1;
							faceMaps["eyes"][3]["opacity"] = 0;
							faceMaps["eyes"][4]["opacity"] = 0;
							faceMaps["eyes"][5]["opacity"] = 1 - ( (blendingBalance - 3/segmentos) * segmentos);
							faceMaps["eyes"][6]["opacity"] = ( (blendingBalance - 3/segmentos) * segmentos);
							faceMaps["eyes"][7]["opacity"] = 0;
							faceMaps["eyes"][8]["opacity"] = 0;
							
						} else if(blendingBalance > (4/segmentos) && blendingBalance <= (5/segmentos)){
							faceMaps["eyes"][2]["opacity"] = 1;
							faceMaps["eyes"][3]["opacity"] = 0;
							faceMaps["eyes"][4]["opacity"] = 0;
							faceMaps["eyes"][5]["opacity"] = 0;
							faceMaps["eyes"][6]["opacity"] = 1 - ( (blendingBalance - 4/segmentos) * segmentos);
							faceMaps["eyes"][7]["opacity"] = ( (blendingBalance - 4/segmentos) * segmentos); 
							faceMaps["eyes"][8]["opacity"] = 0;
						} else {
							faceMaps["eyes"][2]["opacity"] = 1;
							faceMaps["eyes"][3]["opacity"] = 0;
							faceMaps["eyes"][4]["opacity"] = 0;
							faceMaps["eyes"][5]["opacity"] = 0;
							faceMaps["eyes"][6]["opacity"] = 0;
							faceMaps["eyes"][7]["opacity"] = 1 - ( (blendingBalance - 5/segmentos) * segmentos);
							faceMaps["eyes"][8]["opacity"] = ( (blendingBalance - 5/segmentos) * segmentos); 
						}	

						//if(faceMaps["eyes"][2]["opacity"] < 0) { faceMaps["eyes"][2]["opacity"] = 0;}else if(faceMaps["eyes"][2]["opacity"] > 1){faceMaps["eyes"][2]["opacity"] = 1;}
						if(faceMaps["eyes"][3]["opacity"] < 0) { faceMaps["eyes"][3]["opacity"] = 0;}else if(faceMaps["eyes"][3]["opacity"] > 1){faceMaps["eyes"][3]["opacity"] = 1;}
						if(faceMaps["eyes"][4]["opacity"] < 0) { faceMaps["eyes"][4]["opacity"] = 0;}else if(faceMaps["eyes"][4]["opacity"] > 1){faceMaps["eyes"][4]["opacity"] = 1;}
						if(faceMaps["eyes"][5]["opacity"] < 0) { faceMaps["eyes"][5]["opacity"] = 0;}else if(faceMaps["eyes"][5]["opacity"] > 1){faceMaps["eyes"][5]["opacity"] = 1;}
						if(faceMaps["eyes"][6]["opacity"] < 0) { faceMaps["eyes"][6]["opacity"] = 0;}else if(faceMaps["eyes"][6]["opacity"] > 1){faceMaps["eyes"][6]["opacity"] = 1;}
						if(faceMaps["eyes"][7]["opacity"] < 0) { faceMaps["eyes"][7]["opacity"] = 0;}else if(faceMaps["eyes"][7]["opacity"] > 1){faceMaps["eyes"][7]["opacity"] = 1;}
						if(faceMaps["eyes"][8]["opacity"] < 0) { faceMaps["eyes"][8]["opacity"] = 0;}else if(faceMaps["eyes"][8]["opacity"] > 1){faceMaps["eyes"][8]["opacity"] = 1;}
						
						// setDataCookie("eyeColor", obj.fromPers/100);
						increaseCountOf("eyeColor", "Clk");
						computeBlending("eyes");
					}});
					
					$("#slider_eyeShape").ionRangeSlider({ values: [ languageMapping["droopy"], languageMapping["downturned"], languageMapping["round"], languageMapping["oval"], languageMapping["almond"], languageMapping["upturned"],languageMapping["asian"]], type: "single",hideFromTo: false, min: 0, max: 100, from: 3,	hasGrid: true, onChange: function (obj) {
						var morphingBalance = obj.fromPers/100;					
						var segments = 6;
						sliderInUse = true;
						if(morphingBalance <= 0.16){ // droopy
							faceMorphingWeights["face"][48] = faceMorphingWeights["lashes"][12] = (-(morphingBalance - 0.00) * segments) + 1; 
							faceMorphingWeights["face"][47] = faceMorphingWeights["lashes"][13] =  (morphingBalance - 0.00) * segments;
							faceMorphingWeights["face"][49] = faceMorphingWeights["lashes"][14] = 0; 
							faceMorphingWeights["face"][40] = faceMorphingWeights["lashes"][2] 	= 0;
							faceMorphingWeights["face"][50] = faceMorphingWeights["lashes"][15] = 0;
							faceMorphingWeights["face"][39] = faceMorphingWeights["lashes"][3] 	= 0;
											
						} else if(morphingBalance > 0.16 && morphingBalance <= 0.32){
							faceMorphingWeights["face"][48] = faceMorphingWeights["lashes"][12] = 0;
							faceMorphingWeights["face"][47] = faceMorphingWeights["lashes"][13] = (-(morphingBalance - 1/segments) * segments) + 1;
							faceMorphingWeights["face"][49] = faceMorphingWeights["lashes"][14] = ( (morphingBalance - 1/segments) * segments); 
							faceMorphingWeights["face"][40] = faceMorphingWeights["lashes"][2] 	= 0;
							faceMorphingWeights["face"][50] = faceMorphingWeights["lashes"][15] = 0;
							faceMorphingWeights["face"][39] = faceMorphingWeights["lashes"][3] 	= 0;
							
						} else if(morphingBalance > 0.32 && morphingBalance <= 0.50){
							faceMorphingWeights["face"][48] = faceMorphingWeights["lashes"][12] = 0;
							faceMorphingWeights["face"][47] = faceMorphingWeights["lashes"][13] = 0;
							faceMorphingWeights["face"][49] = faceMorphingWeights["lashes"][14] = (-(morphingBalance - 2/segments) * segments) + 1;
							faceMorphingWeights["face"][40] = faceMorphingWeights["lashes"][2] 	= 0;
							faceMorphingWeights["face"][50] = faceMorphingWeights["lashes"][15] = 0;
							faceMorphingWeights["face"][39] = faceMorphingWeights["lashes"][3] 	= 0;
							
						} else if(morphingBalance > 0.50 && morphingBalance <= 0.66){
							faceMorphingWeights["face"][48] = faceMorphingWeights["lashes"][12] = 0;
							faceMorphingWeights["face"][47] = faceMorphingWeights["lashes"][13] = 0;
							faceMorphingWeights["face"][49] = faceMorphingWeights["lashes"][14] = 0;
							faceMorphingWeights["face"][40] = faceMorphingWeights["lashes"][2] = ( (morphingBalance - 3/segments) * segments);
							faceMorphingWeights["face"][50] = faceMorphingWeights["lashes"][15] = 0;
							faceMorphingWeights["face"][39] = faceMorphingWeights["lashes"][3] 	= 0;
							
						} else if(morphingBalance > 0.66 && morphingBalance <= 0.83){
							faceMorphingWeights["face"][48] = faceMorphingWeights["lashes"][12] = 0;
							faceMorphingWeights["face"][47] = faceMorphingWeights["lashes"][13] = 0;
							faceMorphingWeights["face"][49] = faceMorphingWeights["lashes"][14] = 0;
							faceMorphingWeights["face"][40] = faceMorphingWeights["lashes"][2] 	= 1 - ( (morphingBalance - 4/segments) * segments);
							faceMorphingWeights["face"][50] = faceMorphingWeights["lashes"][15] = ( (morphingBalance - 4/segments) * segments); 
							faceMorphingWeights["face"][39] = faceMorphingWeights["lashes"][3] 	= 0;
						} else {
							faceMorphingWeights["face"][48] = faceMorphingWeights["lashes"][12] = 0;
							faceMorphingWeights["face"][47] = faceMorphingWeights["lashes"][13] = 0;
							faceMorphingWeights["face"][49] = faceMorphingWeights["lashes"][14] = 0;
							faceMorphingWeights["face"][40] = faceMorphingWeights["lashes"][2] 	= 0;
							faceMorphingWeights["face"][50] = faceMorphingWeights["lashes"][15] = 1 - ( (morphingBalance - 5/segments) * segments);
							faceMorphingWeights["face"][39] = faceMorphingWeights["lashes"][3] 	= ( (morphingBalance - 5/segments) * segments); 
						}
						
						// setDataCookie("eyeShape", obj.fromPers/100);
						//console.log("Eye Shape", obj.fromPers/100);	
						
						increaseCountOf("eyeShape", "Clk");
						computeMorphing("face");
						computeMorphing("lashes");
						
					}});

					
					$("#slider_eyeOpening").ionRangeSlider({ values: [ languageMapping["narrow"], "normal", languageMapping["wide"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {

     

						sliderInUse = true;
                        // sliderInUse = false;

                        // obj.fromPers = Math.random()*99
                        console.log(obj.fromPers)

                        // console.log($("#slider_eyeOpening")[0].value)
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][55] = faceMorphingWeights["lashes"][17] = 0;
							faceMorphingWeights["face"][56] = faceMorphingWeights["lashes"][18] = morphingBalance * -1;
						} else {
							faceMorphingWeights["face"][56] = faceMorphingWeights["lashes"][18] = 0;
							faceMorphingWeights["face"][55] = faceMorphingWeights["lashes"][17] = morphingBalance;
						}

                        
						// setDataCookie("eyeOpening", obj.fromPers/100);

                       
                            increaseCountOf("eyeOpening", "Clk");
                            computeMorphing("all");
                            computeBlending("all")
                            // computeMorphing("all");
                            console.log("changing eye opening");
              



					}});	







					
					$("#slider_eyeSize").ionRangeSlider({ values: [ languageMapping["small"], "normal", languageMapping["big"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
                        // obj.fromPers = Math.random()*99
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][43] = faceMorphingWeights["lashes"][7] = faceMorphingWeights["eyes"][2] = faceMorphingWeights["eyes"][2] = morphingBalance * -1;
							faceMorphingWeights["face"][44] = faceMorphingWeights["lashes"][6] = faceMorphingWeights["eyes"][3] = faceMorphingWeights["eyes"][3] = 0;
						} else {
							faceMorphingWeights["face"][44] = faceMorphingWeights["lashes"][6] = faceMorphingWeights["eyes"][3] = faceMorphingWeights["eyes"][3] = morphingBalance;
							faceMorphingWeights["face"][43] = faceMorphingWeights["lashes"][7] = faceMorphingWeights["eyes"][2] = faceMorphingWeights["eyes"][2] = 0;
						}
						// setDataCookie("eyeSize", obj.fromPers/100);
						increaseCountOf("eyeSize", "Clk");
						computeMorphing("all");
					}});
					
					$("#slider_eyeHeight").ionRangeSlider({ values: [ languageMapping["up"], "normal", languageMapping["down"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][37] = faceMorphingWeights["lashes"][9] = faceMorphingWeights["eyes"][4] = faceMorphingWeights["eyes"][4] = 0;
							faceMorphingWeights["face"][38] = faceMorphingWeights["lashes"][8] = faceMorphingWeights["eyes"][5] = faceMorphingWeights["eyes"][5] = morphingBalance * -1;
						} else {
							faceMorphingWeights["face"][38] = faceMorphingWeights["lashes"][8] = faceMorphingWeights["eyes"][5] = faceMorphingWeights["eyes"][5] = 0;
							faceMorphingWeights["face"][37] = faceMorphingWeights["lashes"][9] = faceMorphingWeights["eyes"][4] = faceMorphingWeights["eyes"][4] = morphingBalance;
						}
						// setDataCookie("eyeHeight", obj.fromPers/100);
						increaseCountOf("eyeHeight", "Clk");
						computeMorphing("all");
					}});
					
					$("#slider_eyeDistance").ionRangeSlider({ values: [ languageMapping["narrow"], "normal", languageMapping["wide"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][46] = faceMorphingWeights["lashes"][10] = faceMorphingWeights["eyes"][7] = faceMorphingWeights["eyes"][7] = morphingBalance * -1;
							faceMorphingWeights["face"][45] = faceMorphingWeights["lashes"][11] = faceMorphingWeights["eyes"][6] = faceMorphingWeights["eyes"][6] = 0;
						} else {
							faceMorphingWeights["face"][45] = faceMorphingWeights["lashes"][11] = faceMorphingWeights["eyes"][6] = faceMorphingWeights["eyes"][6] = morphingBalance;
							faceMorphingWeights["face"][46] = faceMorphingWeights["lashes"][10] = faceMorphingWeights["eyes"][7] = faceMorphingWeights["eyes"][7] = 0;
						}
						// setDataCookie("eyeDistance", obj.fromPers/100);
						
						increaseCountOf("eyeDistance", "Clk");
						computeMorphing("all");
					}});
					
					$("#slider_eyeDepth").ionRangeSlider({ values: [ languageMapping["bulgy"], "normal", languageMapping["cavernous"]], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][41] = faceMorphingWeights["lashes"][4] = faceMorphingWeights["eyes"][9] = faceMorphingWeights["eyes"][9] = morphingBalance * -1;
							faceMorphingWeights["face"][42] = faceMorphingWeights["lashes"][5] = faceMorphingWeights["eyes"][8] = faceMorphingWeights["eyes"][8] = 0;
						} else {
							faceMorphingWeights["face"][42] = faceMorphingWeights["lashes"][5] = faceMorphingWeights["eyes"][8] = faceMorphingWeights["eyes"][8] = morphingBalance;
							faceMorphingWeights["face"][41] = faceMorphingWeights["lashes"][4] = faceMorphingWeights["eyes"][9] = faceMorphingWeights["eyes"][9] = 0;
						}
						// setDataCookie("eyeDepth", obj.fromPers/100);
						increaseCountOf("eyeDepth", "Clk");
						computeMorphing("all");
					}});
					
					$("#slider_eyeRotation").ionRangeSlider({ values: [ languageMapping["inner"], "normal", languageMapping["outer"]], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][57] = faceMorphingWeights["lashes"][19] = morphingBalance * -1;
							faceMorphingWeights["face"][58] = faceMorphingWeights["lashes"][20] = 0;
						} else {
							faceMorphingWeights["face"][58] = faceMorphingWeights["lashes"][20] = morphingBalance;
							faceMorphingWeights["face"][57] = faceMorphingWeights["lashes"][19] = 0;
						}
						// setDataCookie("eyeRotation", obj.fromPers/100);
						increaseCountOf("eyeRotation", "Clk");
						computeMorphing("all");
					}});
					
				
					$("#slider_eyebrowsColor").ionRangeSlider({ values: [ languageMapping["black"], languageMapping["brunette"], languageMapping["mediumblonde"], languageMapping["red"], languageMapping["brightblonde"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 2, hasGrid: true, onLoad: function(obj) {
							$(".haircolor").find( ".irs-line" ).css("background-image","url(img/sprite-hair-color.png)");
							$(".haircolor").find( ".irs-line-left" ).hide();
							$(".haircolor").find( ".irs-line-mid" ).hide();
							$(".haircolor").find( ".irs-line-right" ).hide();
						}, onChange: function (obj) {   // callback is called on every slider change
							eyebrowsColor = obj.fromPers/100;
							sliderInUse = true;

							// setDataCookie("eyebrowsColor", eyebrowsColor);
							increaseCountOf("eyebrowsColor", "Clk");
							computeEyeBrowBlendings();
							computeBlending("face");
					}});
					
					$("#slider_eyebrowsShape").ionRangeSlider({ values: [ languageMapping["pointed"], languageMapping["straight"], "normal", languageMapping["round"], languageMapping["hooked"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 2,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = obj.fromPers/100;
						
						if(morphingBalance <= 0.25){
							faceMorphingWeights["face"][6] = -(morphingBalance - 0.25) * 4;
							faceMorphingWeights["face"][10]  =  (morphingBalance       ) * 4;
							faceMorphingWeights["face"][9] = 0;
							faceMorphingWeights["face"][5] = 0;
						} else if(morphingBalance > 0.25 && morphingBalance <= 0.50){
							faceMorphingWeights["face"][6] = 0;
							faceMorphingWeights["face"][10]  = -(morphingBalance - 0.50) * 4;
							faceMorphingWeights["face"][9] = 0;
							faceMorphingWeights["face"][5] = 0;
						} else if(morphingBalance > 0.50 && morphingBalance <= 0.75){
							faceMorphingWeights["face"][6] = 0;
							faceMorphingWeights["face"][10]  = 0;
							faceMorphingWeights["face"][9] =  (morphingBalance - 0.50) * 4;
							faceMorphingWeights["face"][5] = 0;
						} else {
							faceMorphingWeights["face"][6] = 0;
							faceMorphingWeights["face"][10]  = 0;
							faceMorphingWeights["face"][9] = -(morphingBalance - 1.00) * 4;
							faceMorphingWeights["face"][5] =  (morphingBalance - 0.75) * 4;
						}
						
						// setDataCookie("eyebrowsShape", obj.fromPers/100);
						increaseCountOf("eyebrowsShape", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_eyebrowsLine").ionRangeSlider({ values: [ languageMapping["thin"], "normal", languageMapping["thick"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						eyebrowsLineBalance = -(2-((obj.fromPers/100) + 0.5) * 2);
						// setDataCookie("eyebrowsLine", obj.fromPers/100);
						increaseCountOf("eyebrowsLine", "Clk");
						computeEyeBrowBlendings();
						computeBlending("face");
					}});
					
					$("#slider_noseShape").ionRangeSlider({ values: [ languageMapping["snub"], "normal", languageMapping["hooked"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][16] = morphingBalance * -1;
							faceMorphingWeights["face"][15] = 0;
						} else {
							faceMorphingWeights["face"][15] = morphingBalance;
							faceMorphingWeights["face"][16] = 0;
						}
						// setDataCookie("noseShape", obj.fromPers/100);
						increaseCountOf("noseShape", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_noseLength").ionRangeSlider({ values: [ languageMapping["short"], "normal", languageMapping["long"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][12] = morphingBalance * -1;
							faceMorphingWeights["face"][11] = 0;
						} else {
							faceMorphingWeights["face"][11] = morphingBalance;
							faceMorphingWeights["face"][12] = 0;
						}
						// setDataCookie("noseLength", obj.fromPers/100);
						increaseCountOf("noseLength", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_noseWidth").ionRangeSlider({ values: [ languageMapping["thin"], "normal", languageMapping["thick"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][14] = morphingBalance * -1;
							faceMorphingWeights["face"][13] = 0;
						} else {
							faceMorphingWeights["face"][13] = morphingBalance;
							faceMorphingWeights["face"][14] = 0;
						}
						// setDataCookie("noseWidth", obj.fromPers/100);
						increaseCountOf("noseWidth", "Clk");
						computeMorphing("face");
					}});
					

					
					$("#slider_noseBridge").ionRangeSlider({ values: [ languageMapping["thin"], "normal", languageMapping["thick"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][17] = morphingBalance * -1;
							faceMorphingWeights["face"][18] = 0;
						} else {
							faceMorphingWeights["face"][18] = morphingBalance;
							faceMorphingWeights["face"][17] = 0;
						}
						// setDataCookie("noseBridge", obj.fromPers/100);
						increaseCountOf("noseBridge", "Clk");
						computeMorphing("all");
					}});
					
					$("#slider_foreheadHeight").ionRangeSlider({ values: [ languageMapping["down"], "normal", languageMapping["up"] ], type: "single", hideFromTo: false, min: 0, max: 100, from: 1, hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][3] = morphingBalance * -1;
							faceMorphingWeights["face"][4] = 0;
						} else {
							faceMorphingWeights["face"][4] = morphingBalance;
							faceMorphingWeights["face"][3] = 0;
						}
						// setDataCookie("foreheadHeight", obj.fromPers/100);
						increaseCountOf("foreheadHeight", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_cheeksBone").ionRangeSlider({ values: [ languageMapping["fat"], "normal", languageMapping["scraggy"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][19] = morphingBalance * -1;
							faceMorphingWeights["face"][20] = 0;
						} else {
							faceMorphingWeights["face"][20] = morphingBalance;
							faceMorphingWeights["face"][19] = 0;
						}
						// setDataCookie("cheeksBone", obj.fromPers/100);
						increaseCountOf("cheeksBone", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_jawShape").ionRangeSlider({ values: [ languageMapping["triangle"], "normal", languageMapping["squared"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][31] = morphingBalance * -1;
							faceMorphingWeights["face"][32] = 0;
						} else {
							faceMorphingWeights["face"][32] = morphingBalance;
							faceMorphingWeights["face"][31] = 0;
						}
						// setDataCookie("jawShape", obj.fromPers/100);
						increaseCountOf("jawShape", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_jawChin").ionRangeSlider({ values: [ languageMapping["pointed"], "normal", languageMapping["cleft"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][27] = morphingBalance * -1;
							faceMorphingWeights["face"][28] = 0;
						} else {
							faceMorphingWeights["face"][28] = morphingBalance;
							faceMorphingWeights["face"][27] = 0;
						}
						// setDataCookie("jawChin", obj.fromPers/100);
						increaseCountOf("jawChin", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_jawLength").ionRangeSlider({ values: [ languageMapping["short"], "normal", languageMapping["long"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][30] = morphingBalance * -1;
							faceMorphingWeights["face"][29] = 0;
						} else {
							faceMorphingWeights["face"][29] = morphingBalance;
							faceMorphingWeights["face"][30] = 0;
						}
						// setDataCookie("jawLength", obj.fromPers/100);
						increaseCountOf("jawLength", "Clk");
						computeMorphing("face");
					}});				
					
					$("#slider_throatSize").ionRangeSlider({ values: [ languageMapping["thin"], "normal", languageMapping["thick"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][33] = morphingBalance * -1;
							faceMorphingWeights["face"][34] = 0;
						} else {
							faceMorphingWeights["face"][34] = morphingBalance;
							faceMorphingWeights["face"][33] = 0;
						}
						// setDataCookie("throatSize", obj.fromPers/100);
						increaseCountOf("throatSize", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_earSize").ionRangeSlider({ values: [ languageMapping["small"], "normal", languageMapping["big"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][35] = morphingBalance * -1;
							faceMorphingWeights["face"][36] = 0;
						} else {
							faceMorphingWeights["face"][36] = morphingBalance;
							faceMorphingWeights["face"][35] = 0;
						}
						// setDataCookie("earSize", obj.fromPers/100);
						increaseCountOf("earSize", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_mouthVolume").ionRangeSlider({ values: [ languageMapping["thin"], "normal", languageMapping["full"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][23] = morphingBalance * -1;
							faceMorphingWeights["face"][24] = 0;
						} else {
							faceMorphingWeights["face"][24] = morphingBalance;
							faceMorphingWeights["face"][23] = 0;
						}
						// setDataCookie("mouthVolume", obj.fromPers/100);
						increaseCountOf("mouthVolume", "Clk");
						computeMorphing("face");
					}});

					$("#slider_lipRatio").ionRangeSlider({ values: [ languageMapping["upperlip"], "normal", languageMapping["lowerlip"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][22] = morphingBalance * -1;
							faceMorphingWeights["face"][21] = 0;
						} else {
							faceMorphingWeights["face"][21] = morphingBalance;
							faceMorphingWeights["face"][22] = 0;
						}
						// setDataCookie("lipRatio", obj.fromPers/100);
						increaseCountOf("lipRatio", "Clk");
						computeMorphing("face");
					}});

					$("#slider_mouthOverlap").ionRangeSlider({ values: [ languageMapping["down"], "normal", languageMapping["up"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][61] = morphingBalance * -1;
							faceMorphingWeights["face"][62] = 0;
						} else {
							faceMorphingWeights["face"][62] = morphingBalance;
							faceMorphingWeights["face"][61] = 0;
						}
						// setDataCookie("mouthOverlap", obj.fromPers/100);
						increaseCountOf("mouthOverlap", "Clk");
						computeMorphing("face");
					}});
							
					$("#slider_mouthWidth").ionRangeSlider({ values: [ languageMapping["wide"], "normal", languageMapping["narrow"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][60] = morphingBalance * -1;
							faceMorphingWeights["face"][59] = 0;
						} else {
							faceMorphingWeights["face"][59] = morphingBalance;
							faceMorphingWeights["face"][60] = 0;
						}
						// setDataCookie("mouthWidth", obj.fromPers/100);
						increaseCountOf("mouthWidth", "Clk");
						computeMorphing("face");
					}});
								
					$("#slider_mouthHeight").ionRangeSlider({ values: [ languageMapping["up"], "normal", languageMapping["down"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][26] = morphingBalance * -1;
							faceMorphingWeights["face"][25] = 0;
						} else {
							faceMorphingWeights["face"][25] = morphingBalance;
							faceMorphingWeights["face"][26] = 0;
						}
						// setDataCookie("mouthHeight", obj.fromPers/100);
						increaseCountOf("mouthHeight", "Clk");
						computeMorphing("face");
					}});

					$("#slider_mouthDepth").ionRangeSlider({ values: [ languageMapping["backwards"], "normal", languageMapping["forwards"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][53] = morphingBalance * -1;
							faceMorphingWeights["face"][54] = 0;
						} else {
							faceMorphingWeights["face"][54] = morphingBalance;
							faceMorphingWeights["face"][53] = 0;
						}
						// setDataCookie("mouthDepth", obj.fromPers/100);
						increaseCountOf("mouthDepth", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_noseCartilage").ionRangeSlider({ values: [ languageMapping["round"], "normal", languageMapping["flat"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 1,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var morphingBalance = (1 - ((obj.fromPers/100) + 0.5)) * 2;
						if(morphingBalance < 0){
							faceMorphingWeights["face"][51] = morphingBalance * -1;
							faceMorphingWeights["face"][52] = 0;
						} else {
							faceMorphingWeights["face"][52] = morphingBalance;
							faceMorphingWeights["face"][51] = 0;
						}
						// setDataCookie("noseCartilage", obj.fromPers/100);
						increaseCountOf("noseCartilage", "Clk");
						computeMorphing("face");
					}});
					
					$("#slider_eyeShadow").ionRangeSlider({ values: [ languageMapping["nothing"], "normal", languageMapping["strong"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 0,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var blendingBalance = obj.fromPers/100;
						faceMaps["face"][25]["opacity"] = blendingBalance;
						// setDataCookie("eyeShadow", obj.fromPers/100);
						increaseCountOf("eyeShadow", "Clk");
						computeBlending("face");
					}});
					
					$("#slider_lipStick").ionRangeSlider({ values: [ languageMapping["nothing"], "normal", languageMapping["strong"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 0,	hasGrid: true, onChange: function (obj) {	
						sliderInUse = true;
						var blendingBalance = obj.fromPers/100;
						faceMaps["face"][26]["opacity"] = blendingBalance;
						// setDataCookie("lipStick", obj.fromPers/100);
						increaseCountOf("lipStick", "Clk");
						computeBlending("face");
					}});
					
					$("#slider_rouge").ionRangeSlider({ values: [ languageMapping["nothing"], "normal", languageMapping["strong"] ], type: "single",hideFromTo: false, min: 0, max: 100, from: 0,	hasGrid: true, onChange: function (obj) {
						sliderInUse = true;
						var blendingBalance = obj.fromPers/100;
						faceMaps["face"][27]["opacity"] = blendingBalance;
						// setDataCookie("rouge", obj.fromPers/100);
						increaseCountOf("rouge", "Clk");
						computeBlending("face");
					}});

					function convertGeometryToFiveBufferGeometry(geometry){
						console.log(geometry)
						console.log(geometry)
						// console.log(geometry.toJSON());
						console.log(THREE)
		
		//convert geometry to fiveGeometry
		var fiveGeometry = new THREE.Geometry();
		console.log(fiveGeometry)
		// fiveGeometry.faceVertexUvs = geometry.faceVertexUvs //an array of arrays that contains six.uv that have a u and a v
		// fiveGeometry.vertices = geometry.vertices //an array of six.vertex that has a position attribute that contains six.vector3 that has an object with x y z
		
		for (var i=0; i<geometry.vertices.length;i++){
		fiveGeometry.vertices.push(new THREE.Vector3(geometry.vertices[i].x,geometry.vertices[i].y,geometry.vertices[i].z))
		}
		
		
		
		
		// fiveGeometry.faces = geometry.faces //an array of six.face4 (oh no)
		// console.log(Object.keys(geometry.faces))
		let indices = []
		let uvs = []
		
		if(geometry.faces[0] instanceof ONE.Face3){
		
		
		for ( var i=0, vl=geometry.faces.length; i<vl; i+=1) {
		
		
		
		if(geometry.faces[i] instanceof ONE.Face3){
			// console.log("IS an instance of face3")
			fiveGeometry.faceVertexUvs[0].push([new THREE.Vector2(geometry.faceVertexUvs[0][i][0].x,geometry.faceVertexUvs[0][i][0].y),new THREE.Vector2(geometry.faceVertexUvs[0][i][1].x,geometry.faceVertexUvs[0][i][1].y),new THREE.Vector2(geometry.faceVertexUvs[0][i][2].x,geometry.faceVertexUvs[0][i][2].y)])
		uvs.push(geometry.faceVertexUvs[0][i][0].u,geometry.faceVertexUvs[0][i][0].v)
		uvs.push(geometry.faceVertexUvs[0][i][1].u,geometry.faceVertexUvs[0][i][1].v)
		uvs.push(geometry.faceVertexUvs[0][i][2].u,geometry.faceVertexUvs[0][i][2].v)
		
			fiveGeometry.faces.push( new THREE.Face3( geometry.faces[i].a, geometry.faces[i].b, geometry.faces[i].c ) );
			// console.log("pushed faces!")
			indices.push(geometry.faces[i].a, geometry.faces[i].b, geometry.faces[i].c)
		
		} else {
			// console.log("not an instance of face3")
			fiveGeometry.faceVertexUvs[0].push([new THREE.Vector2(geometry.faceVertexUvs[0][i][0].u,geometry.faceVertexUvs[0][i][0].v),new THREE.Vector2(geometry.faceVertexUvs[0][i][1].u,geometry.faceVertexUvs[0][i][1].v),new THREE.Vector2(geometry.faceVertexUvs[0][i][2].u,geometry.faceVertexUvs[0][i][2].v)])
			// console.log(i)
			// console.log(geometry.faceVertexUvs[0][i][3].u,geometry.faceVertexUvs[0][i][3].v)
			fiveGeometry.faceVertexUvs[0].push([new THREE.Vector2(geometry.faceVertexUvs[0][i][0].u,geometry.faceVertexUvs[0][i][0].v),new THREE.Vector2(geometry.faceVertexUvs[0][i][2].u,geometry.faceVertexUvs[0][i][2].v),new THREE.Vector2(geometry.faceVertexUvs[0][i][3].u,geometry.faceVertexUvs[0][i][3].v)])
			uvs.push(geometry.faceVertexUvs[0][i][0].u,geometry.faceVertexUvs[0][i][0].v)
			uvs.push(geometry.faceVertexUvs[0][i][1].u,geometry.faceVertexUvs[0][i][1].v)
			uvs.push(geometry.faceVertexUvs[0][i][2].u,geometry.faceVertexUvs[0][i][2].v)
			uvs.push(geometry.faceVertexUvs[0][i][0].u,geometry.faceVertexUvs[0][i][0].v)
			uvs.push(geometry.faceVertexUvs[0][i][2].u,geometry.faceVertexUvs[0][i][2].v)
			uvs.push(geometry.faceVertexUvs[0][i][3].u,geometry.faceVertexUvs[0][i][3].v)
		
		
		
			fiveGeometry.faces.push( new THREE.Face3( geometry.faces[i].a, geometry.faces[i].b, geometry.faces[i].c ) );
			fiveGeometry.faces.push( new THREE.Face3( geometry.faces[i].a, geometry.faces[i].c, geometry.faces[i].d ) );
		
			indices.push( geometry.faces[i].a, geometry.faces[i].b, geometry.faces[i].c ) ;
			indices.push( geometry.faces[i].a, geometry.faces[i].c, geometry.faces[i].d ) ;
		
		
		}
		
		
		
		// fiveGeometry.computeBoundingBox();
		
		// var max = fiveGeometry.boundingBox.max,
		//     min = fiveGeometry.boundingBox.min;
		// var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		// var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		// var faces = fiveGeometry.faces;
		
		// fiveGeometry.faceVertexUvs[0] = [];
		
		// for (var i = 0; i < faces.length ; i++) {
		
		//     var v1 = fiveGeometry.vertices[faces[i].a], 
		//         v2 = fiveGeometry.vertices[faces[i].b], 
		//         v3 = fiveGeometry.vertices[faces[i].c];
		
		//     fiveGeometry.faceVertexUvs[0].push([
		//         new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
		//         new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
		//         new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
		//     ]);
		// }
		// fiveGeometry.uvsNeedUpdate = true;
		
			
		
		}
		}
		
		
		console.log(fiveGeometry) // error
		let uv = []
		let faceSetn = false
		fiveGeometry.faceVertexUvs[0].forEach( function ( faceUvs ) {
				for (let i=0; i < 3; i++) {
					// if(faceSetn == false){
					// 	faceSetn = true
					// 	console.log(faceUvs[i])
					// }
					// faceUvs[i].x = 0.4
					// faceUvs[i].y = 0.4
					uv.push( ...faceUvs[i].toArray() );
					// uv.push(0.5)
				}
			} );
		
			
		
		// console.log(fiveGeometry.toJSON())
		
		fiveGeometry.mergeVertices();
		fiveGeometry.computeVertexNormals(true);

		let bGeometry = new THREE.BufferGeometry().fromGeometry(fiveGeometry)
		
		console.log(fiveGeometry.toJSON())
		

		
		
						let points = []
		
						console.log(bGeometry.attributes.position.array[123])
		
						for (var i=0; i<bGeometry.attributes.position.array.length; i++){
							points.push(bGeometry.attributes.position.array[i])
						}
		
						console.log(points)
		
						//																							IMPORTANT: SET INDICES (set index) for FACES of BUFFERGEOM https://stackoverflow.com/questions/64129505/add-array-of-faces-to-buffergeometry-in-three-js 
						window.fromPoints = new THREE.BufferGeometry().setFromPoints( fiveGeometry.vertices );
						window.fromPoints.setIndex( indices );
						window.fromPoints.computeVertexNormals(true);
						// bGeometry.setIndex( indices );
						bGeometry.computeVertexNormals();
		
						
		
						var uvs32 = new Float32Array( uv );
						console.log(uvs32)
		// // Use the four vertices to draw the two triangles that make up the square.
		// var indices = new Uint32Array( quad_indices )
		
		// // itemSize = 3 because there are 3 values (components) per vertex
		// geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		console.log(window.fromPoints)
		// window.fromPoints.setAttribute("uv", new THREE.BufferAttribute( uvs32, 2 ))
		bGeometry.attributes.uv =  new THREE.BufferAttribute( uvs32, 2 );
		bGeometry.attributes.uv.needsUpdate = true;

		bGeometry.computeFaceNormals();
		// bGeometry.mergeVertices();
		bGeometry.computeVertexNormals();

		// this.attributes.uv = new BufferAttribute( newUvs, 2 );
		
		// this.index.needsUpdate = true;
		
		// this.attributes.position.needsUpdate = true;
		// this.attributes.uv.needsUpdate = true;
		
		
		//SOLUTION 2
		
		
		//END SOLUTION 2
		
		
		
						// window.fromPoints.setDrawRange( 0, fiveGeometry.vertices.length );
						// window.fromPoints.setAttribute("normal", )
						// window.fromPoints.setAttribute("uv", fiveGeometry.)
						// window.fromPoints.computeVertexNormals()
						// window.fromPoints.normalizeNormals()
		
		console.log(fromPoints)
		console.log()
		
		
		// bGeometry.toJSON();
		// bGeometry.model.geometry.attributes.position.needsUpdate = true;
		


	


		const tempGeo = new THREE.Geometry().fromBufferGeometry(bGeometry);

		tempGeo.mergeVertices();
		
		// after only mergeVertices my textrues were turning black so this fixed normals issues
		tempGeo.computeVertexNormals();
		tempGeo.computeFaceNormals();
		
		let merged = new THREE.BufferGeometry().fromGeometry(tempGeo);


		// return bGeometry
		return merged
		// return fiveGeometry
					}


function updateFaceParams(){
	$("#slider_faceGender").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_faceGender").ionRangeSlider("update").updateData;

	$("#slider_faceStyle").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*40
	});

	$("#slider_faceStyle").ionRangeSlider("update").updateData;

	$("#slider_skinDetails").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_skinDetails").ionRangeSlider("update").updateData;

	$("#slider_skinColor").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: (Math.random()*59)+40
	});

	$("#slider_skinColor").ionRangeSlider("update").updateData;

	$("#slider_hairColor").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_hairColor").ionRangeSlider("update").updateData;

	$("#slider_eyeColor").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeColor").ionRangeSlider("update").updateData;

	$("#slider_eyeShape").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeShape").ionRangeSlider("update").updateData;

	$("#slider_eyeOpening").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeOpening").ionRangeSlider("update").updateData;


	$("#slider_eyeSize").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeSize").ionRangeSlider("update").updateData;


	$("#slider_eyeHeight").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeHeight").ionRangeSlider("update").updateData;


	$("#slider_eyeDistance").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeDistance").ionRangeSlider("update").updateData;


	$("#slider_eyeDepth").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeDepth").ionRangeSlider("update").updateData;


	$("#slider_eyeRotation").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeRotation").ionRangeSlider("update").updateData;


	$("#slider_eyebrowsColor").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyebrowsColor").ionRangeSlider("update").updateData;


	$("#slider_eyebrowsShape").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyebrowsShape").ionRangeSlider("update").updateData;


	$("#slider_eyebrowsLine").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyebrowsLine").ionRangeSlider("update").updateData;


	$("#slider_noseShape").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_noseShape").ionRangeSlider("update").updateData;


	$("#slider_noseLength").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_noseLength").ionRangeSlider("update").updateData;



	$("#slider_noseWidth").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_noseWidth").ionRangeSlider("update").updateData;


	$("#slider_noseBridge").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_noseBridge").ionRangeSlider("update").updateData;




	$("#slider_foreheadHeight").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_foreheadHeight").ionRangeSlider("update").updateData;




	$("#slider_cheeksBone").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_cheeksBone").ionRangeSlider("update").updateData;



	$("#slider_jawShape").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_jawShape").ionRangeSlider("update").updateData;



	$("#slider_jawChin").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_jawChin").ionRangeSlider("update").updateData;



	$("#slider_jawLength").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_jawLength").ionRangeSlider("update").updateData;



	$("#slider_throatSize").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_throatSize").ionRangeSlider("update").updateData;



	$("#slider_earSize").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_earSize").ionRangeSlider("update").updateData;



	$("#slider_mouthVolume").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_mouthVolume").ionRangeSlider("update").updateData;



	$("#slider_lipRatio").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_lipRatio").ionRangeSlider("update").updateData;



	$("#slider_mouthOverlap").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_mouthOverlap").ionRangeSlider("update").updateData;


	$("#slider_mouthWidth").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_mouthWidth").ionRangeSlider("update").updateData;




	$("#slider_mouthHeight").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_mouthHeight").ionRangeSlider("update").updateData;



	// $("#slider_mouthDepth").ionRangeSlider("update", {
	// 	min: 0, 
	// 	max: 100, 
	// 	from: 50
	// });

	// $("#slider_mouthDepth").ionRangeSlider("update").updateData;



	$("#slider_noseCartilage").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_noseCartilage").ionRangeSlider("update").updateData;



	$("#slider_eyeShadow").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_eyeShadow").ionRangeSlider("update").updateData;



	$("#slider_lipStick").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_lipStick").ionRangeSlider("update").updateData;




	$("#slider_rouge").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: Math.random()*99
	});

	$("#slider_rouge").ionRangeSlider("update").updateData;


	$("#slider_mouthDepth").ionRangeSlider("update", {
		min: 0, 
		max: 100, 
		from: 50
	});

	$("#slider_mouthDepth").ionRangeSlider("update").updateData;

	computeMorphing("all");
	computeEyeBrowBlendings();
	computeBlending("face");
}





                    setTimeout(()=>{
                       updateFaceParams()

       
						setTimeout(()=>{

						
                    

                    console.log(scene)
                    
                    //send the model from ONE to THREE, init THREE
					// document.querySelector("#ONEJS").style.height = "10vh!important;"
					// document.querySelector("#ONEJS").style.width = "10vw!important;"
					document.querySelector("#ONEJS").style.position = `absolute`
					document.querySelector("#ONEJS").style.top = `0px`
					document.querySelector("#ONEJS").style.right = `0px`

					initTHREE();
					let materialClone = window.THREEmaterial.clone()

					var facePortion = scene.getObjectByName("face").geometry 
					console.log("FACE", scene.getObjectByName("face"))
					var geometryConvert = convertGeometryToFiveBufferGeometry(facePortion)
				var transferMesh = new THREE.Mesh( geometryConvert, window.THREEmaterial ); 
				transferMesh.position.y = - 50;
				transferMesh.rotation.y=3*Math.PI
				// transferMesh.scale.set( scale, scale, scale );
				transferMesh.scale.set(200,200,200)
				transferMesh.doubleSided = true;
				// console.log(transferMesh)
				transferMesh.name = "face"

				transferMesh.rotateY(Math.PI/180 * 180);
				transferMesh.material.flatShading = false
				transferMesh.material.shading = THREE.SmoothShading
				THREEscene.add( transferMesh );
						
			    // console.log("test",transferMesh)
				// console.log(THREEscene)
				

					//
				}, 1000)
                    


setTimeout(()=>{
	updateFaceParams()
	setTimeout(()=>{
	var facePortion = scene.getObjectByName("face").geometry 
					console.log("FACE", scene.getObjectByName("face"))
					var geometryConvert = convertGeometryToFiveBufferGeometry(facePortion)
				var transferMesh = new THREE.Mesh( geometryConvert, window.THREEmaterial.clone() ); 
				transferMesh.position.y = - 50;
				transferMesh.rotation.y=3*Math.PI
				// transferMesh.scale.set( scale, scale, scale );
				transferMesh.scale.set(200,200,200)
				transferMesh.doubleSided = true;
				// console.log(transferMesh)
				transferMesh.name = "face"

				transferMesh.rotateY(Math.PI/180 * 180);
				transferMesh.material.flatShading = false
				transferMesh.material.shading = THREE.SmoothShading
				transferMesh.position.set(transferMesh.position.x+200, transferMesh.position.y, transferMesh.position.z)
				THREEscene.add( transferMesh );

				var THREErenderModelUV = new THREE.RenderPass( THREEscene,THREEcamera, window.THREEmaterialUV.clone(), new THREE.Color( 0x575757 ) );
				THREEcomposer.addPass( THREErenderModelUV );

				//TODO: write a stack overflow question about copying shaders!!!





				setTimeout(()=>{
					updateFaceParams()
					setTimeout(()=>{
					var facePortion = scene.getObjectByName("face").geometry 
									console.log("FACE", scene.getObjectByName("face"))
									var geometryConvert = convertGeometryToFiveBufferGeometry(facePortion)
								var transferMesh = new THREE.Mesh( geometryConvert, window.THREEmaterial.clone() ); 
								// \var transferMesh = new THREE.Mesh( geometryConvert, new THREE.MeshPhongMaterial({color:0xffffff}) );
								transferMesh.position.y = - 50;
								transferMesh.rotation.y=3*Math.PI
								// transferMesh.scale.set( scale, scale, scale );
								transferMesh.scale.set(200,200,200)
								transferMesh.doubleSided = true;
								// console.log(transferMesh)
								transferMesh.name = "face"
				
								transferMesh.rotateY(Math.PI/180 * 180);
								transferMesh.material.flatShading = false
								transferMesh.material.shading = THREE.SmoothShading
								transferMesh.position.set(transferMesh.position.x-200, transferMesh.position.y, transferMesh.position.z)
								THREEscene.add( transferMesh );

								// var THREErenderModelUV = new THREE.RenderPass( THREEscene,THREEcamera, window.THREEmaterialUV.clone(), new THREE.Color( 0x575757 ) );
								// THREEcomposer.addPass( THREErenderModelUV );

								var THREErenderModelUV = new THREE.RenderPass( THREEscene,THREEcamera, THREEmaterialUV.clone(), new THREE.Color( 0x575757 ) );

								// var THREEeffectCopy = new THREE.ShaderPass( THREE.CopyShader );
				
								// var THREEeffectBloom1 = new THREE.BloomPass( 1, 15, 2, 512 );
								// var THREEeffectBloom2 = new THREE.BloomPass( 1, 25, 3, 512 );
								// var THREEeffectBloom3 = new THREE.BloomPass( 1, 25, 4, 512 );
				
								// THREEeffectBloom1.clear = true;
								// THREEeffectBloom2.clear = true;
								// THREEeffectBloom3.clear = true;
				
								// THREEeffectCopy.renderToScreen = true;
				
								// //
				
								// var THREEpars = {
								// 	generateMipmaps: true,
								// 	minFilter: THREE.LinearMipmapLinearFilter,
								// 	magFilter: THREE.LinearFilter,
								// 	format: THREE.RGBFormat,
								// 	stencilBuffer: false
								// };
				
								// var THREErtwidth = 512;
								// var THREErtheight = 512;
				
								//
				
								// THREEcomposer = new THREE.EffectComposer( THREErenderer, new THREE.WebGLRenderTarget( THREErtwidth, THREErtheight, THREEpars ) );
								THREEcomposer.addPass( THREErenderModelUV );
					
								console.log(THREEcomposer)
				
					}, 2000)
				
				}, 2000)



	

	}, 2000)

}, 2000)

                    },1000)



					
					console.log("end transform slider!")





				}

        //BEGIN ONEJS
        
				if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

				var statsEnabled = true;
				var container, stats, loader, filesToLoad = 0, fileCount = 0;
				var camera, scene, renderer;
				var THREEcamera, THREEscene, THREErenderer, controls;
				
				var mesh;
				var skyMesh;
				// var clock; 
				var composer, composerUV1, composerUV2, composerUV3, composerBeckmann;
				var THREEcomposer, THREEcomposerUV1, THREEcomposerUV2, THREEcomposerUV3, THREEcomposerBeckmann;
				var waitAfterLoad = 250; // ms
				
				var directionalLight, pointLight, ambientLight;
				var camYaw = Math.PI / 2, camTargetYaw = Math.PI / 2;
				var camPitch = 0, camTargetPitch = 0;
				var camDistance = 1000, camRotationSpeed = .1;
				var camLookAt = new ONE.Vector3(0,-100,0);
				var camHeight = 0;
				var targetCamHeight = 0;
				var camHeightOffset = 100;
				
				var mouseIsDown;
				
				var canvas3DHalfX = (window.innerWidth / 2);
				var canvas3DHalfY = (window.innerHeight / 2);

				var firstPass = true;
				var lightSetting = 1;
				var lightDistance = 0;
				var lightSwitchBlocked = false;
				var infoBoxOpen = false;
				var mouseOverUIElement = false;
				var renderBoxDragging = false;
				
				var highLightIntensity = 1.0;
				var mediumLightIntensity = 0.3;		
				var lowLightIntensity = 0.1;
				
				var eyebrowsLineBalance = 0, eyebrowsColor = 0;
				
				var canvasImages = new Array();
				var canvasTextures = new Array();
				var canvasContexts = new Array();
				
				var materials = new Array();
				var uniformsUV;
				// MESH & MORPHING ARRAYS
				
				var faceMesh = new Array()
					
				// Initialize faceMorphingVerts and their influences
				var faceMorphingVerts = new Array();
					faceMorphingVerts["face"] = new Array();
					faceMorphingVerts["lashes"] = new Array();
					faceMorphingVerts["eyes"] = new Array();
					faceMorphingVerts["shirt"] = new Array();
					faceMorphingVerts["plane"] = new Array();
					
				var faceMorphingFiles = new Array();
					faceMorphingFiles["face"] = new Array(
						"models/face_female.js", 		// 0
						"models/face_male.js", 				// 1
						"models/face_cartoon.js",		// 2
						"models/face_forehead_up.js",		// 3
						"models/face_forehead_down.js",	// 4
						"models/face_eyebrows_hooked.js",		// 5
						"models/face_eyebrows_pointed.js",		// 6
						"models/face_eyebrows_near.js",		// 7
						"models/face_eyebrows_wide.js",		// 8
						"models/face_eyebrows_round.js",		// 9
						"models/face_eyebrows_straight.js",	// 10
						"models/face_nose_short.js",			// 11
						"models/face_nose_long.js",			// 12	
						"models/face_nose_thin.js",			// 13
						"models/face_nose_thick.js",			// 14
						"models/face_nose_snub.js",			// 15
						"models/face_nose_hooked.js",			// 16
						"models/face_nose_bridgethick.js",// 17
						"models/face_nose_bridgethin.js",// 18
						"models/face_cheeks_scraggy.js",		// 19
						"models/face_cheeks_fat.js",			// 20
						"models/face_lips_upbig.js",			// 21
						"models/face_lips_downbig.js",			// 22	
						"models/face_lips_full.js",			// 23
						"models/face_lips_thin.js",			// 24
						"models/face_lips_up.js",				// 25
						"models/face_lips_down.js",			// 26
						"models/face_chin_cleft.js",			// 27
						"models/face_chin_pointed.js",		// 28	
						"models/face_chin_short.js",			// 29
						"models/face_chin_long.js",			// 30
						"models/face_chin_square.js",			// 31
						"models/face_chin_round.js",			// 32
						"models/face_throat_thick.js",		// 33
						"models/face_throat_thin.js",			// 34
						"models/face_ears_big.js",			// 35
						"models/face_ears_small.js",			// 36
						"models/face_eyes_up.js",				// 37
						"models/face_eyes_down.js",			// 38
						"models/face_eyes_asian.js",			// 39
						"models/face_eyes_almond.js",			// 40	
						"models/face_eyes_cavernous.js",		// 41
						"models/face_eyes_bulgy.js",			// 42
						"models/face_eyes_big.js",			// 43
						"models/face_eyes_small.js",			// 44
						"models/face_eyes_narrow.js",			// 45
						"models/face_eyes_wide.js",			// 46
						"models/face_eyes_downturned.js",			// 47
						"models/face_eyes_droopy.js",			// 48	
						"models/face_eyes_round.js",			// 49
						"models/face_eyes_upturned.js",			// 50	
						"models/face_nose_cartilage_small.js",		// 51
						"models/face_nose_cartilage_big.js",		// 52
						"models/face_lips_forward.js",		// 53
						"models/face_lips_backward.js",		// 54
						"models/face_eyes_slim.js",		// 55
						"models/face_eyes_open.js",		// 56
						"models/face_eyes_rotation_out.js",		// 57
						"models/face_eyes_rotation_in.js",		// 58
						"models/face_lips_wide.js",		// 59
						"models/face_lips_narrow.js",		// 60
						"models/face_lips_upturned.js",		// 61
						"models/face_lips_downturned.js"		// 62
					);
					
					faceMorphingFiles["lashes"] = new Array(
						"models/face_lashes_normal.js",		// 0
						"models/face_lashes_cartoon.js",	// 1
						"models/face_lashes_almond.js",	// 2
						"models/face_lashes_asian.js",		// 3
						"models/face_lashes_cavernous.js",	// 4
						"models/face_lashes_bulgy.js",		// 5
						"models/face_lashes_small.js",		// 6
						"models/face_lashes_big.js",		// 7
						"models/face_lashes_down.js",		// 8
						"models/face_lashes_up.js",			// 9
						"models/face_lashes_wide.js",		// 10
						"models/face_lashes_narrow.js",		// 11
						"models/face_lashes_droopy.js",		// 12
						"models/face_lashes_downturned.js",		// 13
						"models/face_lashes_round.js",		// 14
						"models/face_lashes_upturned.js",		// 15
						"models/face_lashes_cartoon.js",	// 16
						"models/face_lashes_slim.js",		// 17
						"models/face_lashes_open.js",		// 18
						"models/face_lashes_rotation_out.js",		// 19
						"models/face_lashes_rotation_in.js",		// 20
						"models/face_lashes_male.js"		// 21
					);
					
					faceMorphingFiles["eyes"] = new Array(
						"models/eyes_normal.js",		// 0
						"models/eyes_cartoon.js",		// 1
						"models/eyes_big.js",			// 2
						"models/eyes_small.js",			// 3
						"models/eyes_up.js",			// 4
						"models/eyes_down.js",			// 5
						"models/eyes_narrow.js",		// 6
						"models/eyes_wide.js",			// 7
						"models/eyes_bulgy.js",			// 8
						"models/eyes_cavernous.js",		// 9
						"models/eyes_cartoon.js"		// 10
					);
				
					
					faceMorphingFiles["shirt"] = new Array(
						"models/shirt_female.js",
						"models/shirt_male.js",
						"models/shirt_cartoon.js"
					);
										
					faceMorphingFiles["plane"] = new Array(
						"models/_plane.js",
						"models/_plane2.js"
					);
					
					// defining the weights...
					
					// [0] = base
					// [1] = gender
					// [2] = cartoon
					
				//Array Weights s.o.
				
				var faceMorphingWeights = new Array();
				faceMorphingWeights["face"] = new Array();
				for(var i = 0; i < faceMorphingFiles["face"].length; i++) {
					var val = (i == 0) ? 1 : (i == 1) ? 0.5 : 0;
					faceMorphingWeights["face"].push(val);
				}
				
				faceMorphingWeights["lashes"] = new Array();
				for(var i = 0; i < faceMorphingFiles["lashes"].length; i++) {
					var val = (i == 0) ? 1 : 0;
					faceMorphingWeights["lashes"].push(val);
				}
				
				faceMorphingWeights["eyes"] = new Array();
				for(var i = 0; i < faceMorphingFiles["eyes"].length; i++) {
					var val = (i == 0) ? 1 : 0;
					faceMorphingWeights["eyes"].push(val);
				}
				
				faceMorphingWeights["shirt"] = new Array();
				for(var i = 0; i < faceMorphingFiles["shirt"].length; i++) {
					var val = (i == 0) ? 1 : (i == 1) ? 0.5 : 0;
					faceMorphingWeights["shirt"].push(val);
				}
				
				faceMorphingWeights["plane"] = new Array();
				for(var i = 0; i < faceMorphingFiles["plane"].length; i++) {
					var val = (i == 0) ? 1 : 0;
					faceMorphingWeights["plane"].push(val);
				}
					
				
				// defining the faceMap blendings
				
				// [0] = base skin
				// [1] = dark skin
				// [2] = bright skin
				// [3] = beard
				// [4] = medium blonde hair

				
				var faceMaps = new Array();
				
					faceMaps["face"] = new Array();
					faceMaps["face"]["width"] 			= 1000;
					faceMaps["face"][0] = new Object();
					faceMaps["face"][0]["src"] 			= "models/skin_base.png";
					faceMaps["face"][0]["blending"] 	= "source-over";
					faceMaps["face"][0]["opacity"] 		= 1;
					faceMaps["face"][1] = new Object();
					faceMaps["face"][1]["src"] 			= "models/skin_noDetails_dark.png";
					faceMaps["face"][1]["blending"] 	= "source-over";
					faceMaps["face"][1]["opacity"] 		= 0;
					faceMaps["face"][2] = new Object();
					faceMaps["face"][2]["src"] 			= "models/skin_noDetails_bright.png";
					faceMaps["face"][2]["blending"] 	= "source-over";
					faceMaps["face"][2]["opacity"] 		= 0;
					faceMaps["face"][3] = new Object();
					faceMaps["face"][3]["src"] 			= "models/skin_details.png";
					faceMaps["face"][3]["blending"] 	= "multiply";
					faceMaps["face"][3]["opacity"] 		= 0.5;
					faceMaps["face"][4] = new Object();
					faceMaps["face"][4]["src"] 			= "models/skin_male.png";		
					faceMaps["face"][4]["blending"] 	= "source-over";				
					faceMaps["face"][4]["opacity"] 		= 0.5;
					faceMaps["face"][5] = new Object();
					faceMaps["face"][5]["src"] 			= "models/hair_black.png";
					faceMaps["face"][5]["blending"] 	= "source-over";	
					faceMaps["face"][5]["opacity"] 		= 0;
					faceMaps["face"][6] = new Object();
					faceMaps["face"][6]["src"] 			= "models/hair_brunette.png";
					faceMaps["face"][6]["blending"] 	= "source-over";	
					faceMaps["face"][6]["opacity"] 		= 0;
					faceMaps["face"][7] = new Object();
					faceMaps["face"][7]["src"] 			= "models/hair_mediumblonde.png";
					faceMaps["face"][7]["blending"] 	= "source-over";	
					faceMaps["face"][7]["opacity"] 		= 1;
					faceMaps["face"][8] = new Object();
					faceMaps["face"][8]["src"] 			= "models/hair_red.png";
					faceMaps["face"][8]["blending"] 	= "source-over";	
					faceMaps["face"][8]["opacity"] 		= 0;
					faceMaps["face"][9] = new Object();
					faceMaps["face"][9]["src"] 			= "models/hair_brightblonde.png";
					faceMaps["face"][9]["blending"] 	= "source-over";	
					faceMaps["face"][9]["opacity"] 		= 0;
					faceMaps["face"][10] = new Object();
					faceMaps["face"][10]["src"] 		= "models/eyebrows_black_thin.png";
					faceMaps["face"][10]["blending"] 	= "multiply";	
					faceMaps["face"][10]["opacity"] 	= 0;
					faceMaps["face"][11] = new Object();
					faceMaps["face"][11]["src"] 		= "models/eyebrows_black_normal.png";
					faceMaps["face"][11]["blending"] 	= "multiply";	
					faceMaps["face"][11]["opacity"] 	= 0;
					faceMaps["face"][12] = new Object();
					faceMaps["face"][12]["src"] 		= "models/eyebrows_black_thick.png";
					faceMaps["face"][12]["blending"] 	= "multiply";	
					faceMaps["face"][12]["opacity"] 	= 0;
					faceMaps["face"][13] = new Object();
					faceMaps["face"][13]["src"] 		= "models/eyebrows_brunette_thin.png";
					faceMaps["face"][13]["blending"] 	= "multiply";	
					faceMaps["face"][13]["opacity"] 	= 0;
					faceMaps["face"][14] = new Object();
					faceMaps["face"][14]["src"] 		= "models/eyebrows_brunette_normal.png";
					faceMaps["face"][14]["blending"] 	= "multiply";	
					faceMaps["face"][14]["opacity"] 	= 0;
					faceMaps["face"][15] = new Object();
					faceMaps["face"][15]["src"] 		= "models/eyebrows_brunette_thick.png";
					faceMaps["face"][15]["blending"] 	= "multiply";	
					faceMaps["face"][15]["opacity"] 	= 0;		
					faceMaps["face"][16] = new Object();
					faceMaps["face"][16]["src"] 		= "models/eyebrows_mediumblonde_thin.png";
					faceMaps["face"][16]["blending"] 	= "multiply";	
					faceMaps["face"][16]["opacity"] 	= 0;
					faceMaps["face"][17] = new Object();
					faceMaps["face"][17]["src"] 		= "models/eyebrows_mediumblonde_normal.png";
					faceMaps["face"][17]["blending"] 	= "multiply";	
					faceMaps["face"][17]["opacity"] 	= 1;
					faceMaps["face"][18] = new Object();
					faceMaps["face"][18]["src"] 		= "models/eyebrows_mediumblonde_thick.png";
					faceMaps["face"][18]["blending"] 	= "multiply";	
					faceMaps["face"][18]["opacity"] 	= 0;	
					faceMaps["face"][19] = new Object();
					faceMaps["face"][19]["src"] 		= "models/eyebrows_red_thin.png";
					faceMaps["face"][19]["blending"] 	= "multiply";	
					faceMaps["face"][19]["opacity"] 	= 0;
					faceMaps["face"][20] = new Object();
					faceMaps["face"][20]["src"] 		= "models/eyebrows_red_normal.png";
					faceMaps["face"][20]["blending"] 	= "multiply";	
					faceMaps["face"][20]["opacity"] 	= 0;
					faceMaps["face"][21] = new Object();
					faceMaps["face"][21]["src"] 		= "models/eyebrows_red_thick.png";
					faceMaps["face"][21]["blending"] 	= "multiply";	
					faceMaps["face"][21]["opacity"] 	= 0;	
					faceMaps["face"][22] = new Object();
					faceMaps["face"][22]["src"] 		= "models/eyebrows_brightblonde_thin.png";
					faceMaps["face"][22]["blending"] 	= "multiply";	
					faceMaps["face"][22]["opacity"] 	= 0;
					faceMaps["face"][23] = new Object();
					faceMaps["face"][23]["src"] 		= "models/eyebrows_brightblonde_normal.png";
					faceMaps["face"][23]["blending"] 	= "multiply";	
					faceMaps["face"][23]["opacity"] 	= 0;
					faceMaps["face"][24] = new Object();
					faceMaps["face"][24]["src"] 		= "models/eyebrows_brightblonde_thick.png";
					faceMaps["face"][24]["blending"] 	= "multiply";	
					faceMaps["face"][24]["opacity"] 	= 0;		
					faceMaps["face"][25] = new Object();
					faceMaps["face"][25]["src"] 		= "models/skin_eyeshadow.png";
					faceMaps["face"][25]["blending"] 	= "multiply";	
					faceMaps["face"][25]["opacity"] 	= 0;	
					faceMaps["face"][26] = new Object();
					faceMaps["face"][26]["src"] 		= "models/skin_lipstick.png";
					faceMaps["face"][26]["blending"] 	= "multiply";	
					faceMaps["face"][26]["opacity"] 	= 0;		
					faceMaps["face"][27] = new Object();
					faceMaps["face"][27]["src"] 		= "models/skin_rouge.png";
					faceMaps["face"][27]["blending"] 	= "multiply";	
					faceMaps["face"][27]["opacity"] 	= 0;			

					faceMaps["lashes"] = new Array();
					faceMaps["lashes"]["width"] 		= 1000;
					faceMaps["lashes"][0] = new Object();
					faceMaps["lashes"][0]["src"] 		= "models/lashes_female.png";
					faceMaps["lashes"][0]["blending"] 	= "copy";
					faceMaps["lashes"][0]["opacity"] 	= 0.5;
					faceMaps["lashes"][1] = new Object();
					faceMaps["lashes"][1]["src"] 		= "models/lashes_male.png";
					faceMaps["lashes"][1]["blending"] 	= "source-over";
					faceMaps["lashes"][1]["opacity"] 	= 0.5;
					
					faceMaps["eyes"] = new Array();
					faceMaps["eyes"]["width"] 			= 512;
					faceMaps["eyes"][0] = new Object();
					faceMaps["eyes"][0]["src"] 			= "models/eye_white.png";
					faceMaps["eyes"][0]["blending"] 	= "source-over";
					faceMaps["eyes"][0]["opacity"] 		= 1;
					faceMaps["eyes"][1] = new Object();
					faceMaps["eyes"][1]["src"] 			= "models/eye_details.png";
					faceMaps["eyes"][1]["blending"] 	= "source-over";
					faceMaps["eyes"][1]["opacity"] 		= 1;
					faceMaps["eyes"][2] = new Object();
					faceMaps["eyes"][2]["src"] 			= "models/eye_black.png";
					faceMaps["eyes"][2]["blending"] 	= "source-over";
					faceMaps["eyes"][2]["opacity"] 		= 0;
					faceMaps["eyes"][3] = new Object();
					faceMaps["eyes"][3]["src"] 			= "models/eye_brown.png";
					faceMaps["eyes"][3]["blending"] 	= "source-over";
					faceMaps["eyes"][3]["opacity"] 		= 1;
					faceMaps["eyes"][4] = new Object();
					faceMaps["eyes"][4]["src"] 			= "models/eye_amber.png";
					faceMaps["eyes"][4]["blending"] 	= "source-over";
					faceMaps["eyes"][4]["opacity"] 		= 0;
					faceMaps["eyes"][5] = new Object();
					faceMaps["eyes"][5]["src"] 			= "models/eye_green.png";
					faceMaps["eyes"][5]["blending"] 	= "source-over";
					faceMaps["eyes"][5]["opacity"] 		= 0;
					faceMaps["eyes"][6] = new Object();
					faceMaps["eyes"][6]["src"] 			= "models/eye_blue.png";
					faceMaps["eyes"][6]["blending"] 	= "source-over";
					faceMaps["eyes"][6]["opacity"] 		= 0;
					faceMaps["eyes"][7] = new Object();
					faceMaps["eyes"][7]["src"] 			= "models/eye_brightblue.png";
					faceMaps["eyes"][7]["blending"] 	= "source-over";
					faceMaps["eyes"][7]["opacity"] 		= 0;
					faceMaps["eyes"][8] = new Object();
					faceMaps["eyes"][8]["src"] 			= "models/eye_grey.png";
					faceMaps["eyes"][8]["blending"] 	= "source-over";
					faceMaps["eyes"][8]["opacity"] 		= 0;
					faceMaps["eyes"][9] = new Object();
					faceMaps["eyes"][9]["src"] 			= "models/eye_bump.png";
					faceMaps["eyes"][9]["blending"] 	= "source-over";
					faceMaps["eyes"][9]["opacity"] 		= 0;
					
					
					faceMaps["shirt"] = new Array();
					faceMaps["shirt"]["width"] 			= 1000;
					faceMaps["shirt"][0] = new Object();
					faceMaps["shirt"][0]["src"] 		= "models/shirt_grey.png";
					faceMaps["shirt"][0]["blending"] 	= "source-over";
					faceMaps["shirt"][0]["opacity"] 	= 1;		
					
					faceMaps["plane"] = new Array();
					faceMaps["plane"]["width"] 			= 256;
					faceMaps["plane"][0] = new Object();
					faceMaps["plane"][0]["src"] 		= "models/_plane.jpg";
					faceMaps["plane"][0]["blending"] 	= "source-over";
					faceMaps["plane"][0]["opacity"] 	= 1;	
					
					
				function btnChangeLight() {
					if (lightSwitchBlocked == false) {
						function completeLight() {
							lightSwitchBlocked = false;
							if(lightSetting == 3) lightSetting = 1;
							else lightSetting++;
						}
						
						if(lightSetting == 1) {
							// lightSwitchBlocked = true;
							pointLight.position.x = lightDistance;
							keyLight.position.x = -lightDistance;
							document.getElementById("statusText").innerHTML = languageMapping["leftLightOn"];	
						}
						
						if(lightSetting == 2) {
							// lightSwitchBlocked = true;
							pointLight.position.x = -lightDistance;
							keyLight.position.x = lightDistance;
							document.getElementById("statusText").innerHTML = languageMapping["rightLightOn"];	
						}
						
						if(lightSetting == 3) {
							// lightSwitchBlocked = true;
							pointLight.position.x = 0;
							keyLight.position.x = 0;
							document.getElementById("statusText").innerHTML = languageMapping["rightAndLeftLightOn"];
						}
						// $("#statusText").fadeIn(100).delay(1000).fadeOut(100, completeLight);
					}
					// setDataCookie("lightsClicked", parseInt(getDataCookie("lightsClicked")) + 1);
				}
								
				function reset(name, value, setCookie) {
					
					$("#slider_" + name).ionRangeSlider("update", {
						from: value
					});
					
					$("#slider_" + name).ionRangeSlider("update").updateData;

					if(setCookie == true && evalMode == false && agenMode == false && faceMakerStarted == true){
						//countResetBtnOf(name, "Rst");
						increaseCountOf(name, "Rst");
						//console.log("reset of "+name);
						//setDataCookie(name + "Rst", parseInt(getDataCookie(name + "Rst")) + 1);
					}
				}
			
				
				function resetAllSlider(_msg) {
					function completeReset() {
						for(var slidergrp in sliderCollection) {
							for(var slider in sliderCollection[slidergrp]){
								lockIncreaseCountOf =!_msg;
								reset(sliderCollection[slidergrp][slider][1], sliderCollection[slidergrp][slider][3], false); 
							}				
						}
						
						targetZoom = 10;
						//targetCamHeight = 0;
						if(_msg != true) document.getElementById("statusText").innerHTML = languageMapping["faceResetted"];
						if(_msg != true) $("#statusText").delay(1000).fadeOut(20);
					}
					
					if(_msg != true) document.getElementById("statusText").innerHTML = languageMapping["resetFace"];
					if(_msg != true) $("#statusText").fadeIn(20, completeReset);
					else completeReset();
					if(_msg != true) setDataCookie("mainResetClicked", parseInt(getDataCookie("mainResetClicked")) + 1);
				}
					
				function computeEyeBrowBlendings(){		
				
					var eyebrowsColorMap = new Array();
					if(eyebrowsColor <= 0.25){
						eyebrowsColorMap[0] = 1
						eyebrowsColorMap[1] = (eyebrowsColor - 0.00) * 4;
						eyebrowsColorMap[2] = 0;
						eyebrowsColorMap[3] = 0;
						eyebrowsColorMap[4] = 0;
					} else if(eyebrowsColor > 0.25 && eyebrowsColor <= 0.50){
						eyebrowsColorMap[0] = (eyebrowsColor - 0.00) * 4;
						eyebrowsColorMap[1] = (eyebrowsColor - 0.00) * 4;
						eyebrowsColorMap[2] = (eyebrowsColor - 0.25) * 4;
						eyebrowsColorMap[3] = 0;
						eyebrowsColorMap[4] = 0;
					} else if(eyebrowsColor > 0.50 && eyebrowsColor <= 0.75){
						eyebrowsColorMap[0] = (eyebrowsColor - 0.00) * 4;
						eyebrowsColorMap[1] = (eyebrowsColor - 0.00) * 4;
						eyebrowsColorMap[2] = (eyebrowsColor - 0.25) * 4 ;
						eyebrowsColorMap[3] = (eyebrowsColor - 0.50) * 4 ;
						eyebrowsColorMap[4] = 0;
					} else {
						eyebrowsColorMap[0] = (eyebrowsColor - 0.00) * 4;
						eyebrowsColorMap[1] = (eyebrowsColor - 0.00) * 4;
						eyebrowsColorMap[2] = (eyebrowsColor - 0.25) * 4 ;
						eyebrowsColorMap[3] = (eyebrowsColor - 0.50) * 4 ;
						eyebrowsColorMap[4] = (eyebrowsColor - 0.75) * 4 ;		
					}

					for (var i = 0; i < 5; i++) {		
						if(eyebrowsColorMap[i] >= 1) eyebrowsColorMap[i] = -eyebrowsColorMap[i] + 2;
						if(eyebrowsColorMap[i] < 0) eyebrowsColorMap[i] = 0;
						
						if(eyebrowsLineBalance < 0){					
							faceMaps["face"][10+i*3]["opacity"] = (eyebrowsLineBalance * -1) * eyebrowsColorMap[i];
							faceMaps["face"][11+i*3]["opacity"] = (1 + eyebrowsLineBalance) * eyebrowsColorMap[i];
							faceMaps["face"][12+i*3]["opacity"] = 0;
						} else {
							faceMaps["face"][10+i*3]["opacity"] = 0;
							faceMaps["face"][11+i*3]["opacity"] = (1 - eyebrowsLineBalance) * eyebrowsColorMap[i];
							faceMaps["face"][12+i*3]["opacity"] = (eyebrowsLineBalance) * eyebrowsColorMap[i];
						}
					}
				}




				function removeLoadingBar() {
					
					filesToLoad--;
					
					if(filesToLoad > 0)
					{
						if(languageMapping["label_loader"] != null){
							document.getElementById("statusText").innerHTML = languageMapping["label_loader"] + (100 - Math.round((filesToLoad/fileCount)*100)) + "%";			
						} else {
							document.getElementById("statusText").innerHTML = "";
						}
						if(!renderer) document.getElementById("statusText").innerHTML = languageMapping["noGlContext"];
						filesToLoad--;
					} else if (filesToLoad == 0) {
						filesToLoad = 0;
						$('#statusText').fadeOut(40, function(){
							//$('#loadingGIF').fadeOut(400, function(){
								$('#loadingScreen').fadeOut(40, function(){

								});
							//});
						});
						//var t1 = setTimeout(function(){
							function completeLoading() {			
								computeBlending("all"); 
								computeMorphing("all"); 
								appChooser();
							}
							
							$('#statusText').fadeOut( 20, completeLoading );
					//	},1000);
					} else {
						filesToLoad = 0;
					}
					
				}
				
				function recursiveLoader(name, count){
					removeLoadingBar();
					if (count < faceMorphingFiles[name].length){
						loader.load(faceMorphingFiles[name][count], function( geometry ) { 
							loader.onLoadComplete = function() {
								
								faceMorphingVerts[name].push(geometry.vertices);
								
								for ( var v = 0; v < geometry.vertices.length; v++ ) 
								{
									faceMorphingVerts[name][count][v].x = geometry.vertices[v].x - faceMorphingVerts[name][0][v].x;
									faceMorphingVerts[name][count][v].y = geometry.vertices[v].y - faceMorphingVerts[name][0][v].y;
									faceMorphingVerts[name][count][v].z = geometry.vertices[v].z - faceMorphingVerts[name][0][v].z;
								}
								recursiveLoader(name, count + 1);
							}
							
						});	
					} else { return; }
				}
				
				function computeBlending(blending){
					console.log("facemaps", faceMaps)
					console.log("facemaps", "canvastexture", canvasTextures)
					console.log("facemaps", "canvascontext", canvasContexts)

					for(var map in faceMaps){
						if(map == blending || blending == "all"){
							for(var i = 0; i < faceMaps[map].length; i++){
								canvasContexts[map].globalAlpha = faceMaps[map][i]["opacity"];
								canvasContexts[map].globalCompositeOperation = faceMaps[map][i]["blending"];
								canvasContexts[map].drawImage(faceMaps[map][i]["img"], 0, 0);
							}
							if ( canvasTextures[map] ) canvasTextures[map].needsUpdate = true;
						}
					}
					
					window.faceImage = canvasContexts["face"]
					if(window.faceTextureUSeCase){
						window.faceTextureUSe.needsUpdate = "true"
					}
					
				}
				
				function computeMorphing(morphing) {
                    console.log("computing morphing!")
                    console.log(faceMorphingWeights)
                    console.log(faceMorphingVerts)
					for (var part in faceMorphingVerts)
					{
						if(part == morphing || morphing == "all") {
							var newVertices = [];
							
							for(var v = 0; v < faceMesh[part].geometry.vertices.length; v++)
							{
								var weightAllMorphs = new ONE.Vector3(0,0,0);
								
								if(faceMorphingWeights[part]){									
									for( var m = 0; m < faceMorphingWeights[part].length; m++){
										
										if(faceMorphingVerts[part][m] != undefined)
										{
											if(faceMorphingWeights[part][m] > 0 ) {
												weightAllMorphs.x += faceMorphingVerts[part][m][v].x * faceMorphingWeights[part][m];
												weightAllMorphs.y += faceMorphingVerts[part][m][v].y * faceMorphingWeights[part][m];
												weightAllMorphs.z += faceMorphingVerts[part][m][v].z * faceMorphingWeights[part][m];
											}
										}
									}
								}
								
								newVertices.push(new ONE.Vector3(
									weightAllMorphs.x,
									weightAllMorphs.y,
									weightAllMorphs.z
								));
							}

							faceMesh[part].geometry.dynamic = true;
							faceMesh[part].geometry.verticesNeedUpdate = true;
							faceMesh[part].geometry.vertices = newVertices;
						}
					}
				}
				
				
				function onWindowResize() {
					canvas3DHalfX = window.innerWidth / 2;
					canvas3DHalfY = window.innerHeight / 2;

					if(evalMode == true){
						camera.aspect = eval3DWidth / eval3DHeight;
						camera.updateProjectionMatrix();
						renderer.setSize( eval3DWidth, eval3DHeight );
					}
					else
					{
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
						renderer.setSize( window.innerWidth, window.innerHeight );
					}
					

					if(evalMode == true) renderer.setSize( eval3DWidth, eval3DHeight );
					else renderer.setSize( window.innerWidth, window.innerHeight );
				}

				function addObjectToScene( geometry, scale, skinMaterial, name="" ) {
					geometry.computeTangents();
					mesh = new ONE.Mesh( geometry, skinMaterial );
					mesh.scale.set( scale, scale, scale );
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					console.log("MESH", mesh)
                    if(name !== ""){
                        mesh.name = name
                    }
					scene.add( mesh );
					loader.statusDomElement.style.display = "none";
				}

				function onDocumentMouseMove( event ) {
					event.preventDefault();
					if(mouseIsDown && !renderBoxDragging){
						var testYaw = (((event.clientX - canvas3DHalfX ) / canvas3DHalfX )*2 + Math.PI / 2);	
						if(testYaw < Math.PI && testYaw > 0) camTargetYaw = testYaw ;
						
						var testPitch = ((event.clientY - canvas3DHalfY ) / canvas3DHalfY ) / 4;	
						camTargetPitch = testPitch ;	
					}
					if(sliderInUse == false && mouseOverUIElement == false){
						targetZoom = 10;
						targetCamHeight = 0;
					}
				}

				function onDocumentMouseDown( event ) {
					event.preventDefault();
					
					if(infoBoxOpen == true || mouseOverUIElement == true) 
					{
						mouseIsDown = false;
					}else{
						mouseIsDown = true;
						targetZoom = 10;
						targetCamHeight = 0;
						var testYaw = ((event.clientX - canvas3DHalfX ) / canvas3DHalfX ) * 2 + Math.PI / 2;	
						if(testYaw < Math.PI && testYaw > 0) camTargetYaw = testYaw ;
						
						var testPitch = ((event.clientY - canvas3DHalfY ) / canvas3DHalfY ) / 4 ;	
						camTargetPitch = testPitch ;
						
						//console.log(camera.position.x + " " + camera.position.y + " " + camera.position.z);
					}
				}

				function onDocumentMouseUp( event ) {
					event.preventDefault();
					mouseIsDown = false;
					sliderInUse = false;
					lockIncreaseCountOf = false;
					//console.log("lockincreaseCountOf " + lockincreaseCountOf);
				}
				
				function animate() {
					setTimeout( function() {
						
						requestAnimationFrame( animate );

					}, 1000 / 100 );
					
					render();
					if ( statsEnabled ) stats.update();
				}

				function render() {	
					if(skipMovement == false){
						camYaw += (camTargetYaw - camYaw) * camRotationSpeed ;
						camPitch += (camTargetPitch - camPitch) * camRotationSpeed ;
						camHeight += (targetCamHeight - camHeight) * camRotationSpeed; 
						zoom += (targetZoom - zoom) * zoomSpeed;
					} else {
						camYaw = camTargetYaw;
						camPitch = camTargetPitch;
						camHeight = targetCamHeight;
						zoom = targetZoom;
					}
					
					camLookAt.y = camHeight+10;
					// camera.fov = zoom;
					
					camera.updateProjectionMatrix();
					

					


	

	
					// renderer.render( scene, camera );

				renderer.render( scene, camera );


				if(window.THREESETUP){
					if ( firstPass ) {
	
						THREEcomposerBeckmann.render();
						firstPass = false;
	
					}

					controls.update();

					THREErenderer.clear();
					THREEcomposer.render();
	
					THREEcomposerUV1.render();
					THREEcomposerUV2.render();
					THREEcomposerUV3.render();
					THREErenderer.render( THREEscene, THREEcamera );
				}
				


				}
				
				window.onunload = function() {

					for(var map in faceMaps){
						canvasTextures[map].dispose();
					}
					
					for(var mesh in scene) {
						scene.remove( mesh );
					}					
					
					for(var part in faceMesh){
						scene.remove( faceMesh[part] );
						faceMesh[part].geometry.dispose();
						faceMesh[part].material.dispose();
					}
						
					for(var material in materials) {
						materials[material].dispose();
					}
					canvasImages = null;
					canvasTextures = null;
					canvasContexts = null;
					materials = null;	
					faceMaps = null;
					faceMesh = null;
					faceMorphingVerts = null;
					faceMorphingFiles = null;
					//console.log("unloaded");
				}