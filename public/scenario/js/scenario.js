$(document).ready(function(){
	var canvas = $('#scenariocanvas');
	var api_base = 'http://localhost:3000/scenarioapi/api/';

	var scenarioid = $('#scenariocanvas').attr('title');

	var scenario = Object();
	var scenarioitems = Array();

	var loggedin = false;

	// Internet Explorer really wants to fuck up everything
	var date = new Date();

	// check if scenario exists already
	$.get(api_base + 'scenarios/' + scenarioid + '?_=' + date.getTime(), function(data) {
		if (data.length > 0) {
			$('#login').show();
			$.get(api_base + 'scenarios/' + scenarioid + '/items?_=' + date.getTime(), function(data) {
				scenarioitems = data;
				// render items
				$.each(scenarioitems, function(index, item) {
					createitem(item);
				});
			});
		} else {
			$('#scenariocanvas').replaceWith('Kollaasia ei löydy');
		}
	});

	$('#loginsubmit').click(function(event) {
		event.preventDefault();
		checklogin();
	});

	// check if logged in
	if ($.cookie('scenariopw') != undefined) {
		var data = {
			password : $.cookie('scenariopw')
		};
		checkapilogin(data);
	}

	function enable_editing() {
		$('#scenariotoolbar').show();

		canvas.droppable({
			drop: function( event, ui ) {
				console.log('dropped: y:' + ui.position.top + ' x:' + ui.position.left );
				// update item position
				var item = {
					posx: ui.position.left,
					posy: ui.position.top,
					posz: ui.draggable.css('z-index')
				};
				updateitem(scenarioid, ui.draggable.attr('id'), item);
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
				containment: 'parent',
				start: function(event, ui ) {
					var maxz = getmaxz(scenarioitems) + 1;
					scenarioitems.maxz = maxz;
					$(this).css('z-index', maxz);
				}
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
				placeholder: '<span class="placeholder">Kirjoita kuvateksti...</span>'
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
//			imagenode.replaceWith($('<a href="' + item.imageurl + '" rel="lightbox"><img src="' + item.thumbnailurl + '" /></a>'));
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

		if (loggedin) {
			if (editable) {
				makedraggable(newitem);
				makeresizable(newitem);
				makeeditable(newitem);
				makedeletable(newitem);
			}
		}
		canvas.append(newitem);
	}

	function updateitem(scenarioid, id, item) {
		$.extend(item, {password: $.cookie('scenariopw')});
		$.ajax({
			url: api_base + 'scenarios/' + scenarioid + '/items/' + id,
			type: 'PUT',
			data: item,
			success: function(result) { console.log(result); }
		});
	}

	function deleteitem(scenarioid, id) {
		var data = {password: $.cookie('scenariopw')};
		$.ajax({
			url: api_base + 'scenarios/' + scenarioid + '/items/' + id,
			type: 'DELETE',
			data: data,
			success: function(result) { console.log(result); }
		});
	}

	function checklogin() {
		var data = {
			path: '/scenario/' + scenarioid,
			password: $('#password').val()
		};
		$.post('/scenario/' + scenarioid + '/logincookie', data, function(response) {
			var data = {
				password: response.digest
			};
			checkapilogin(data);
		});
	}

	function checkapilogin(data) {
		$.post(api_base + 'scenarios/' + scenarioid + '/login', data, function(data) {
			if (data.result == 'ok') {
				// display logout button and enable editing
				var logout = $('<button type="button">Kirjaudu ulos</button>');
				logout.click(function(event) {
					$.cookie('scenariopw', null);
					$.ajax({
						url: '/scenario/' + scenarioid + '/logincookie',
						data: {path: '/scenario/' + scenarioid},
						type: 'DELETE',
						success: function(data) {
							location.reload();
						}
					});
				});
				$('#login').html(logout);
				enable_editing();
				loggedin = true;
			} else {
				$('#password').effect("highlight", {color: '#faa'}, 2000);
				loggedin = false;
			}
		});
	}

	function getmaxz(items) {
		var maxz = 0;
		$.each(items, function(index, item) {
			if (items.maxz !== undefined) {
				maxz = items.maxz;
				return false;
			}
			if (item.posz > maxz) maxz = item.posz;
		});
		return maxz;
	};
});
