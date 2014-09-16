$(document).ready(function(){
	var api_base = 'http://owela.fi/api/';

	var canvas = $('#scenariocanvas');

	var scenario = Object();
	var scenarioitems = Array();

	var phase = 1;
	var done = false;

	var attributes = [
		{left: 'Pidän', right: 'En pidä '},
		{left: 'Luotettava', right: 'Epäluotettava'},
		{left: 'Hyödyllinen', right: 'Hyödytön'},
		{left: 'Etuuden lunastaminen on vaivatonta ostamisen yhteydessä', right: 'Etuuden lunastaminen on vaivalloista ostamisen yhteydessä'},
		{left: 'Käytettävissä olevista eduista on helppo saada tietoa', right: 'Käytettävissä olevista eduista on hankalaa saada tietoa'},
		{left: 'Kätevä', right: 'Hankala'},
		{left: 'Edullinen', right: 'Kallis'},
		{left: 'Motivoi säännölliseen käyttöön', right: 'Ei motivoi säännölliseen käyttöön'},
		{left: 'Houkutteleva', right: 'Ei houkutteleva'},
		{left: 'Miellyttävä', right: 'Epämiellyttävä'},
		{left: 'Etu tulee helposti hyödynnettyä', right: 'Etua ei tule hyödynnettyä'},
		{left: 'Nopea', right: 'Hidas'},
		{left: 'Nykyaikainen', right: 'Vanhanaikainen'},
		{left: 'Kiinnostava', right: 'Tylsä'},
		{left: 'Rento', right: 'Ahdistava'},
		{left: 'Sopii minulle', right: 'Ei sovi minulle'}];

	var res = scenarioid.split('-');
	var scenariomaker = res[0];
	var scenarionumber = res[1];
	Math.seed = Math.abs(hash(scenariomaker));
	shuffleattrs(attributes);

	var date = new Date(); // using date to ensure avoiding cache problems

	$.get(api_base + 'projects/' + projectid + '/scenarios/' + scenarioid + '/items?_=' + date.getTime(), function(data) {
		scenarioitems = data;
		var itemids = [];
		$.each(data, function(index, item) {
			itemids.push(item.frompaletteitem);
		});

		// get palette items too
		$.get(api_base + 'projects/' + projectid + '/scenarios/' + scenarioid + '/paletteitems?_=' + date.getTime(), function(data) {
			shuffle(data);
			var startx = 326, starty = 326, increment = 2;
			var i = 0;
			$.each(data, function(index, item) {
				item.posx = startx + i * increment;
				item.posy = starty;
				i++;
				if ($.inArray(item._id, itemids) === -1) {
					scenarioitems.push(item);
				}
			});

			// render items
			$.each(scenarioitems, function(index, item) {
				createitem(item);
			});
		});
	});

	enable_editing();
	setphase(1);

	function setphase(newphase) {
		phase = newphase;
		switch (phase) {
			case 1:
				// change background to x axis
				$("#scenariocanvas").css("background", 'url("/static/img/upload/prefmapbgx.png")');
				// change draggables to x only
				$(".ui-draggable").draggable("option", "axis", "x");
				// hide crosshairs
				$(".hair").hide();
				// set labels
				$("#labelleft").text(attributes[scenarionumber - 1].left);
				$("#labelright").text(attributes[scenarionumber - 1].right);
				$("#labeltop").text('');
				$("#labelbottom").text('');
				// create next button
				var phasebutton = $('<button/>',
				{
					id: 'phasebutton',
					text: 'Seuraava',
				    click: function () {
						//check if all moved, if not flash those which are not
						if (done) {
							setphase(2);
						} else {
							$(".scenarioitem").not(".moved").effect('highlight', {}, 2000);
						}
					}
				});
				phasebutton.css({
					position: "absolute",
					bottom: "0px",
					right: "0px",
					"z-index": 200000
				});
				phasebutton.addClass('ui-state-disabled');
				canvas.append(phasebutton);
				break;
			case 2:
				done = false;
				// change backgound to y axis
				$("#scenariocanvas").css("background", 'url("http://owela.fi/static/img/upload/prefmapbgy.png")');
				// change draggables to y only
				$(".ui-draggable").draggable("option", "axis", "y");
				// hide crosshairs
				$(".hair").hide();
				// set labels
				$("#labelleft").text('');
				$("#labelright").text('');
				$("#labeltop").text(attributes[scenarionumber].left);
				$("#labelbottom").text(attributes[scenarionumber].right);
				// move draggables to zero
				$(".ui-draggable").removeClass("moved");
				// change next to finish
				phasebutton = $("#phasebutton");
				phasebutton.addClass('ui-state-disabled');
				if (scenarionumber < 15) {
					phasebutton.off('click').on('click', function() {
						//check if all moved, if not flash those which are not
						if (done) {
							newscenarionumber = parseInt(scenarionumber) + 2;
							window.location.replace('http://owela.fi/scenario/pace/' + scenariomaker + '-' + newscenarionumber);
						} else {
							$(".scenarioitem").not(".moved").effect('highlight', {}, 2000);
						}
					});
				} else {
					phasebutton.text('Valmis');
					phasebutton.off('click').on('click', function() {
						//check if all moved, if not flash those which are not
						if (done) {
							window.parent.location.replace('http://owela.fi/pace/kiitos/');
						} else {
							$(".scenarioitem").not(".moved").effect('highlight', {}, 2000);
						}
					});
				}
				break;
		}
	}

	function enable_editing() {
		$('#scenariotoolbar').show();

		canvas.droppable({
			drop: function( event, ui ) {
				// find scenarioitem with correct id
				var item = Object();
				$.each(scenarioitems, function(index, val) {
					if (val.ispaletteitem) {
						if (val._id == ui.draggable.attr('id')) {
							$.extend(item, val);
							item.frompaletteitem = val._id;
							item.ispaletteitem = false;
							delete item._id; // delete the original id to get new one
							return;
						}
					}
				});

				// update item position
				$.extend(item, {
					posx: ui.position.left,
					posy: ui.position.top,
					posz: ui.draggable.css('z-index')
				});

				console.log('dropped: y:' + ui.position.top + ' x:' + ui.position.left );
				if (item.frompaletteitem !== undefined) {
					item.axis = attributes[scenarionumber - 2 + phase].left;
					$.post(api_base + 'projects/' + projectid + '/scenarios/' + scenarioid + '/items', item, function(saveresponse) {
						item._id = saveresponse._id;
						newitem = createitem(item);
						newitem.addClass("moved");
						if (phase == 1) {
							newitem.children('.crosshairx').hide();
							newitem.children('.crosshairy').show();
						}
						if (phase == 2) {
							newitem.children('.crosshairx').show();
							newitem.children('.crosshairy').hide();
						}
						ui.draggable.remove();
					});
				} else {
					updateitem(scenarioid, ui.draggable.attr('id'), item);
				}
			}
		});

		$('#scenariopicture').ajaxfileupload({
			action : '/scenario/imgupload',
			onStart : function() {},
			onComplete : function(response) {
				var newitem = $('#newscenarioitem');

				// switch image to correct one
				var image = $('<a href="' + response.filename + '" rel="lightbox"><img src="' + response.thumbfilename + '" style="width: 200px;" /></a>');
				var imagecontainer = newitem.find('img');
				imagecontainer.replaceWith(image);

				setTimeout(function() {
					// save data
					var position = newitem.position();
					var image = newitem.find('img');
					var item = {
						scenarioid: scenarioid,
						thumbnailurl: response.thumbfilename,
						imageurl: response.filename,
						posx: position.left,
						posy: position.top,
						posz: getmaxz(scenarioitems) + 1,
						width: newitem.width(),
						height: newitem.height(),
						imagewidth: image.width(),
						imageheight: image.height(),
						password: $.cookie('scenariopw')
					};
					makedraggable(newitem);
					makeresizable(newitem);
					makeeditable(newitem);
					makedeletable(newitem);
					$.post(api_base + 'scenarios/' + scenarioid + '/items', item, function(saveresponse) {
						newitem.attr('id', saveresponse._id);
					});
				}, 1000); // wait for the image for size calculations to work
			},
			submit_button : $('#uploadsubmit')
		});

		$('#scenariopicture').change(function(event) { $('#uploadsubmit').click(); });

		$('#addpicture').submit(function(event) {
			// note: this is a visual placeholder, submit is handled by ajaxfileupload
			event.preventDefault();

			if ($('#scenariopicture').val() !== "") {
				// create new item visuals
				var newitem = {
					posx: 100 + Math.floor((Math.random()*200)),
					posy: 100 + Math.floor((Math.random()*200)),
					posz: getmaxz(scenarioitems),
					width: 200
				};
				createitem(newitem, false);
			}
		});

		makedraggable($('.scenarioitem'));
		makeresizable($('.scenarioitem'));
		makeeditable($('.scenarioitem'));
		makedeletable($('.scenarioitem'));
	}

	function makedraggable(items) {
		items.each(function () {
			$(this).draggable({
				axis: 'x', //xxx: remove after demo!
				containment: 'parent',
				start: function(event, ui ) {
					var maxz = getmaxz(scenarioitems) + 1;
					scenarioitems.maxz = maxz;
					$(this).css('z-index', maxz);
				},
				drag: function(event, ui ) {
					$(this).addClass("moved");
					if (phase == 1) {
						$(this).children('.crosshairx').hide().css('top', ui.position.top + 34);
						$(this).children('.crosshairy').show().css('left', ui.position.left + 34);
					}
					if (phase == 2) {
						$(this).children('.crosshairx').show().css('top', ui.position.top + 34);
						$(this).children('.crosshairy').hide().css('left', ui.position.left + 34);
					}
				},
				stop: function(event, ui ) {
					// check if all moved and enable button
					if(allmoved()) {
						$("#phasebutton").removeClass('ui-state-disabled');
						done = true;
					}
				},
				opacity: 0.7
				/*stack: ".scenariocanvas div.scenarioitem"*/
			});
		});
	}

	function makeresizable(items) {
		items.each(function () {
			$(this).resizable({
				alsoResize: $(this).find('img'),
				minHeight: 100,
				minWidth: 100,
				maxHeight: 300,
				maxWidth: 300,
				stop: function (event, ui) {
					var image = $(this).find('img');
					var item = {
						width: $(this).width(),
						height: $(this).height(),
						imagewidth: image.width(),
						imageheight: image.height(),
						posx: ui.position.left,
						posy: ui.position.top
					};
					updateitem(scenarioid, $(this).attr('id'), item);
				}
			});
		});
	}

	function makeeditable(items) {
		items.each(function () {
			$(this).children('.text:first').editable(
				function(value, settings) {
					updateitem(scenarioid, $(this).parent().attr('id'), {text : value});
					return(value);
				}, {
				placeholder: '<span class="placeholder">Text</span>'
			});
		});
	}

	function makedeletable(items) {
		items.each(function () {
			var deletebutton = $(this).children('.delete:first');
			deletebutton.show();
			deletebutton.click(function (event) {
				$(this).parent().remove();
				deleteitem(scenarioid, $(this).parent().attr('id'));
			});
		});
	}

	function createitem(item, editable) {
		editable = typeof editable !== 'undefined' ? editable : true;
		var newitem = $('<div class="scenarioitem" id="newscenarioitem"><img src="/scenario/img/ajax-loader.gif" /><div class="text"></div><div class="delete ui-icon ui-icon-close" title="Poista"></div></div>');
		// replace data only if _id exists (== the item comes from a database)
		if (item._id !== undefined) {
			newitem.attr('id', item._id);

			var imagenode = newitem.children('img:first');
			var newimagenode = $('<img src="' + item.thumbnailurl + '" />');
			imagenode.replaceWith(newimagenode);
			newimagenode.css({width: item.imagewidth, height: item.imageheight});

			var textnode = newitem.children('.text:first');
			textnode.text(item.text);

			var crosshairy = $('<div class="crosshairy hair"></div>').hide();
			crosshairy.css({left: item.posx + 34});
			newitem.append(crosshairy);
			var crosshairx = $('<div class="crosshairx hair"></div>').hide();
			crosshairx.css({top: item.posy + 34});
			newitem.append(crosshairx);
		}
		newitem.css({
			left: item.posx,
			top: item.posy,
			'z-index': item.posz,
			width: item.width,
			height: item.height
		});

		if (editable) {
			makedraggable(newitem);
		}
		canvas.append(newitem);
		return newitem;
	}

	function updateitem(scenarioid, id, item) {
		$.extend(item, {password: $.cookie('scenariopw')});
		$.ajax({
			url: api_base + 'projects/' + projectid + '/scenarios/' + scenarioid + '/items/' + id,
			type: 'PUT',
			data: item,
			success: function(result) { console.log(result); }
		});
	}

	function deleteitem(scenarioid, id) {
		var data = {password: $.cookie('scenariopw')};
		$.ajax({
			url: api_base + 'scenarios/' + projectid + '/scenarios/' + scenarioid + '/items/' + id,
			type: 'DELETE',
			data: data,
			success: function(result) { console.log(result); }
		});
	}

	function getmaxz(items) { //todo: DEPRECATED: stack option is now available in jQueryUI, see http://jqueryui.com/draggable/#visual-feedback
		var maxz = 0;
		$.each(items, function(index, item) {
			if (items.maxz !== undefined) {
				maxz = items.maxz;
				return false;
			}
			if (item.posz > maxz) maxz = item.posz;
		});
		return maxz;
	}

	function shuffle(array) {
		var currentIndex = array.length
			, temporaryValue
			, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	function seededrandom(max, min) {
		max = max || 1;
		min = min || 0;

		Math.seed = (Math.seed * 9301 + 49297) % 233280;
		var rnd = Math.seed / 233280;

		return min + rnd * (max - min);
	}

	function shuffleattrs(array) {
		var currentIndex = array.length
			, temporaryValue
			, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(seededrandom() * (array.length-2)+1);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	function allmoved() {
		var allmoved = true;

		$(".scenarioitem").each(function (index) {
			if ($(this).hasClass("moved") == false) {
				allmoved = false;
				return false;
			};
		});

		return allmoved;
	}

	function hash(str) {
	  var hash = 0, i, chr, len;
	  if (str.length == 0) return hash;
	  for (i = 0, len = str.length; i < len; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	  }
	  return hash;
	};

});
