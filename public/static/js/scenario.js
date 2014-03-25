$(document).ready(function(){
	var api_base = 'http://localhost/api/';

	var canvas = $('#scenariocanvas');

	var scenario = Object();
	var scenarioitems = Array();

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
			var startx = 230, starty = 230, increment = 2;
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

	function setphase(phase) {
		switch (phase) {
			case 1:
				// change background to x axis
				$("#scenariocanvas").css("background", 'url("/static/img/upload/prefmapbgx.png"');
				// change draggables to x only
				$(".ui-draggable").draggable("option", "axis", "x");
				// create next button
				var phasebutton = $('<button/>',
				{
					id: 'phasebutton',
					text: 'Next',
				        click: function () {
							setphase(2);
						}
				});
				phasebutton.css({
					position: "absolute",
					bottom: "0px",
					right: "0px",
					"z-index": 200000
				});
				canvas.append(phasebutton);
				break;
			case 2:
				// change backgound to y axis
				$("#scenariocanvas").css("background", 'url("/static/img/upload/prefmapbgy.png"');
				// change draggables to y only
				$(".ui-draggable").draggable("option", "axis", "y");
				// move draggables to zero
				// change next to finish
				$("#phasebutton").text('Finish');
				$("#phasebutton").off('click').on('click', function() {setphase(3);});
				break;
			case 3:
				// change background to both axis
				$("#scenariocanvas").css("background", 'url("/static/img/upload/prefmapbg.png"');
				// disable draggables
				$(".ui-draggable").draggable("destroy");
				// disable button
				$("#phasebutton").attr("disabled", true);
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
					$.post(api_base + 'projects/' + projectid + '/scenarios/' + scenarioid + '/items', item, function(saveresponse) {
						item._id = saveresponse._id;
						createitem(item);
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
				opacity: 0.7
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
});
