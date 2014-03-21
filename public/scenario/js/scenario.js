$(document).ready(function(){
	var canvas = $('#collagecanvas');
	var api_base = 'http://acdccloud.vtt.fi/collageapi/api/';

	var collageid = $('#collagecanvas').attr('title');

	var scenario = Object();
	var collageitems = Array();

	var loggedin = false;

	// Internet Explorer really wants to fuck up everything
	var date = new Date();

	// check if scenario exists already
	$.get(api_base + 'collages/' + collageid + '?_=' + date.getTime(), function(data) {
		if (data.length > 0) {
			$('#login').show();
			$.get(api_base + 'collages/' + collageid + '/items?_=' + date.getTime(), function(data) {
				collageitems = data;
				// render items
				$.each(collageitems, function(index, item) {
					createitem(item);
				});
			});
		} else {
			$('#collagecanvas').replaceWith('Kollaasia ei löydy');
		}
	});

	$('#loginsubmit').click(function(event) {
		event.preventDefault();
		checklogin();
	});

	// check if logged in
	if ($.cookie('vttcollagepw') != undefined) {
		var data = {
			password : $.cookie('vttcollagepw')
		};
		checkapilogin(data);
	}

	function enable_editing() {
		$('#collagetoolbar').show();

		canvas.droppable({
			drop: function( event, ui ) {
				console.log('dropped: y:' + ui.position.top + ' x:' + ui.position.left );
				// update item position
				var item = {
					posx: ui.position.left,
					posy: ui.position.top,
					posz: ui.draggable.css('z-index')
				};
				updateitem(collageid, ui.draggable.attr('id'), item);
			}
		});

		$('#collagepicture').ajaxfileupload({
			action : '/scenario/imgupload',
			onStart : function() {},
			onComplete : function(response) {
				var newitem = $('#newcollageitem');

				// switch image to correct one
				var image = $('<a href="' + response.filename + '" rel="lightbox"><img src="' + response.thumbfilename + '" style="width: 200px;" /></a>');
				var imagecontainer = newitem.find('img');
				imagecontainer.replaceWith(image);

				setTimeout(function() {
					// save data
					var position = newitem.position();
					var image = newitem.find('img');
					var item = {
						collageid: collageid,
						thumbnailurl: response.thumbfilename,
						imageurl: response.filename,
						posx: position.left,
						posy: position.top,
						posz: getmaxz(collageitems) + 1,
						width: newitem.width(),
						height: newitem.height(),
						imagewidth: image.width(),
						imageheight: image.height(),
						password: $.cookie('vttcollagepw')
					};
					makedraggable(newitem);
					makeresizable(newitem);
					makeeditable(newitem);
					makedeletable(newitem);
					$.post(api_base + 'collages/' + collageid + '/items', item, function(saveresponse) {
						newitem.attr('id', saveresponse._id);
					});
				}, 1000); // wait for the image for size calculations to work
			},
			submit_button : $('#uploadsubmit')
		});

		$('#collagepicture').change(function(event) { $('#uploadsubmit').click(); });

		$('#addpicture').submit(function(event) {
			// note: this is a visual placeholder, submit is handled by ajaxfileupload
			event.preventDefault();

			if ($('#collagepicture').val() !== "") {
				// create new item visuals
				var newitem = {
					posx: 100 + Math.floor((Math.random()*200)),
					posy: 100 + Math.floor((Math.random()*200)),
					posz: getmaxz(collageitems),
					width: 200
				};
				createitem(newitem, false);
			}
		});

		makedraggable($('.collageitem'));
		makeresizable($('.collageitem'));
		makeeditable($('.collageitem'));
		makedeletable($('.collageitem'));
	}

	function makedraggable(items) {
		items.each(function () {
			$(this).draggable({
				containment: 'parent',
				start: function(event, ui ) {
					var maxz = getmaxz(collageitems) + 1;
					collageitems.maxz = maxz;
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
					updateitem(collageid, $(this).attr('id'), item);
				}
			});
		});
	}

	function makeeditable(items) {
		items.each(function () {
			$(this).children('.text:first').editable(
				function(value, settings) {
					updateitem(collageid, $(this).parent().attr('id'), {text : value});
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
				deleteitem(collageid, $(this).parent().attr('id'));
			});
		});
	}

	function createitem(item, editable) {
		editable = typeof editable !== 'undefined' ? editable : true;
		var newitem = $('<div class="collageitem" id="newcollageitem"><img src="/scenario/img/ajax-loader.gif" /><div class="text"></div><div class="delete ui-icon ui-icon-close" title="Poista"></div></div>');
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

	function updateitem(collageid, id, item) {
		$.extend(item, {password: $.cookie('vttcollagepw')});
		$.ajax({
			url: api_base + 'collages/' + collageid + '/items/' + id,
			type: 'PUT',
			data: item,
			success: function(result) { console.log(result); }
		});
	}

	function deleteitem(collageid, id) {
		var data = {password: $.cookie('vttcollagepw')};
		$.ajax({
			url: api_base + 'collages/' + collageid + '/items/' + id,
			type: 'DELETE',
			data: data,
			success: function(result) { console.log(result); }
		});
	}

	function checklogin() {
		var data = {
			path: '/scenario/' + collageid,
			password: $('#password').val()
		};
		$.post('/scenario/' + collageid + '/logincookie', data, function(response) {
			var data = {
				password: response.digest
			};
			checkapilogin(data);
		});
	}

	function checkapilogin(data) {
		$.post(api_base + 'collages/' + collageid + '/login', data, function(data) {
			if (data.result == 'ok') {
				// display logout button and enable editing
				var logout = $('<button type="button">Kirjaudu ulos</button>');
				logout.click(function(event) {
					$.cookie('vttcollagepw', null);
					$.ajax({
						url: '/scenario/' + collageid + '/logincookie',
						data: {path: '/scenario/' + collageid},
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
