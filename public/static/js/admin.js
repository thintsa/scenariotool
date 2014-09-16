/*
	scenarioadmin.js
*/
/*
	How to get the value from URL Parameter?
	http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
	www.test.com/t.html?a=1&b=3&c=m2-m3-m4-m5
	You can then access QueryString.c
*/
var QueryString = function () {
	// This function is anonymous, is executed immediately and
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
}();

(function($) {

	var apipath = 'http://' + document.domain + '/api/';

	var SIMULATE = false;
	var globalObjectCount = 0;

	var project = {};
	/* project is an object containing array of "phases". Each phase has an array of paletteitems:
		{
			"id": 1,
			"name": "Foobar",
			"width": 1024,
			"height": 512,
			"phases": [
				{
					"id": 2,
					"name": "1st phase",
					"imageurl": "kukka.jpg",
					"navileft": {
						"display": false,
						"enabled": false,
						"position": "bottom left",
						"text": "Previous"
					},
					"naviright": {
						"display": true,
						"enabled": true,
						"position": "bottom right",
						"text": "Next"
					},
					"script": {
						"enabled": false,
						"text": ""
					},
					"palette" : {
						"orientation": "vertical",
						"position": "top left"
					},
					"paletteitems": [
						{
							"id": 3,
							"name": "paletteitem 1",
							"text": "Here are properties of paletteitem 1",
							"modify" : true,
							"imageurl": "kukka.jpg"
						},
						{
							...
						}
					]
				},
				{
					...
				}
			]
		}

	This project variable represents model, which is updated initially from server
	and each interaction by user results as 1) model update, 2) a REST-call and finally 3) refresh to UI.

	(1) Get project				GET		'http://owela.fi/api/projects/' + proid
	(2) Delete project			DELETE	'http://owela.fi/api/projects/' + proid
	(3) Save/Update project		POST	'http://owela.fi/api/projects'

	(4) Get phases				GET		'http://owela.fi/api/projects/' + proid + '/phases'
	(5) Delete phase			DELETE	'http://owela.fi/api/projects/' + proid + '/phases/' + phaseid
	(6) Save/Update phase		POST	'http://owela.fi/api/projects/' + proid + '/phases'

	(7) Get paletteitems 		GET		'http://owela.fi/api/projects/' + proid + '/phases/' + phaseid + '/paletteitems'
	(8) Delete paletteitem		DELETE	'http://owela.fi/api/projects/' + proid + '/phases/' + phaseid + '/paletteitems/' + palitemid
	(9) Save/Update paletteitem	POST	'http://owela.fi/api/projects/' + proid + '/phases/' + phaseid + '/paletteitems'

	POST contains object properties in data-attribute:

						type: 'POST',
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify({
								'property1':prop1,
								'property2':prop2,
								...
								'propertyn':propn
						})

	Phases are rendered with Accordion widget. Each phase has nested accordion inside, to represent paletteitems.

	Resulting HTML mark-up looks like this:

		<div id="projectid">

			<div id="projectid_properties">
				<h3>General properties:</h3>
				<label>
				<input>
				<label>
				<input>
				<button>
			</div>

			<div id="projectid-accordion">

				<h2 id="phaseid-name">phase name here.</h2>

				<div id="phaseid-root">

					<div class="row">
						<div id="phaseid-left-properties">

						</div>
						<div id="phaseid-right-properties">

						</div>
					</div>
					<div class="row">
						<div id="phaseid-left" class="small-6 columns">

							<div id="phaseid-accordion">
								<h3 id="paletteitem-id-name">paletteitem id</h3>
								<div id="paletteitem-id-properties">
									<label>
									<input>
									<button>
								</div>
							</div>

						</div>
						<div id="phaseid-right" class="small-6 columns">
							<ul id="phaseid-ul-root" class="paletteitem-ul-root">
								<li>
									<img id="paletteitemid-image" class="paletteitem-r-image" src="noimage.jpg">
									<p id="paletteitemid-text" class="paletteitem-r-text">Insert text for paletteitem 1</p>
								</li>
							</ul>
						</div>
					</div>

				</div>
			</div>
		</div>


	LIST OF FUNCTIONS AND CUSTOM EVENTS:

	$('body').on('scenariotool.admin.file.uploaded', function(e,options) {
	var AjaxFileUpload = function(formData, index, paletteitem, phase) {
	var render_fileupload_form = function(parent_id, index, paletteitem, phase) {

	var render_paletteitem = function(parent_id, index, paletteitem, phase) {
	var render_paletteitem_right = function(parent_id, index, paletteitem, phase) {

	var clonePhase = function(newphase, phase) {
	var clonePaletteitem = function(newpi, pi) {

	var showNaviPropertiesInput = function(index, phase, parent_id, right) {
	var hideNaviPropertiesInput = function(phase, right) {
	var showScriptTextArea = function(index, phase, parent_id) {
	var hideScriptTextArea = function(phase) {
	var showPaletteProperties = function(phase, index) {
	var hidePaletteProperties = function(phase) {

	var render_phase = function(parent_id, index, phase) {

	var refreshAccordion = function(id, arr) {
	var rebuildPhaseDom = function(phase) {
	var rebuildProjectDom = function() {

	$('body').on('scenariotool.admin.phase.deleted', function(e,options) {
	var AjaxDeletePhase = function(phase) {
	$('body').on('scenariotool.admin.phase.remove', function(e,options) {

	$('body').on('scenariotool.admin.paletteitem.deleted', function(e,options) {
	var AjaxDeletePaletteitem = function(paletteitem, phase) {
	$('body').on('scenariotool.admin.paletteitem.remove', function(e,options) {

	$('body').on('scenariotool.admin.phase.saved', function(e,options) {
	var AjaxSavePhase = function(index, phase, clone) {
	$('body').on('scenariotool.admin.phase.change', function(e,options) {

	$('body').on('scenariotool.admin.paletteitem.saved', function(e,options) {
	var AjaxSavePaletteitem = function(index, paletteitem, phase, clone) {
	$('body').on('scenariotool.admin.paletteitem.change', function(e,options) {

	$('body').on('scenariotool.admin.project.saved', function(e,options) {
	var AjaxSaveProject = function(project) {
	$('body').on('scenariotool.admin.project.change', function(e,options) {

	$('body').on('scenariotool.admin.update.project', function(e,options) {
	$('body').on('scenariotool.admin.rest.fail', function(e,options) {
	var AjaxGetProject = function(id) {



	Here is a list of actual REST-calls, arguments and expected responses.

	ACTION:			Upload image
	METHOD:			POST
	URL:			'http://owela.fi/api/fileupload'
	POST DATA:		formData
	RESPONSE:		{ 'status':'ok', 'imageurl':'/path/server/image.jpg'} or { 'status':'error', 'message':'error details' }
	PURPOSE:		Upload phase background image or paletteitem icon image.

	ACTION:			Delete phase
	METHOD:			DELETE
	URL:			'http://owela.fi/api/projects/' + projectid + '/phases/' + phaseid
	RESPONSE:		{'status':'ok'} or {'status':'failure'}

	ACTION:			Delete paletteitem
	METHOD:			DELETE
	URL:			'http://owela.fi/api/projects/' + projectid + '/phases/' + phaseid + '/paletteitems/' + paletteitemid
	RESPONSE:		{'status':'ok'} or {'status':'failure'}

	ACTION:			Save phase
	METHOD:			POST
	URL:			'http://owela.fi/api/projects/' + projectid + '/phases'
	POST DATA:		JSON.stringify(phase)
	RESPONSE:		{phase:phase}

	ACTION:			Save paletteitem
	METHOD:			POST
	URL:			'http://owela.fi/api/projects/' + projectid + '/phases/' + phaseid + '/paletteitems'
	POST DATA:		JSON.stringify(paletteitem)
	RESPONSE:		{paletteitem:paletteitem}

	ACTION:			Save project
	METHOD:			POST
	URL:			'http://owela.fi/api/projects'
	POST DATA:		JSON.stringify(project)
	RESPONSE:		{project:project}

	ACTION:			Get project
	METHOD:			GET
	URL:			'http://owela.fi/api/projects/' + projectid
	RESPONSE:		{project:project}

	*/


	/*
		This event is triggered when REST call to save image file has returned with JSON response:
		{ 'status':'ok', 'imageurl':'greenflower.jpg'} or
		{ 'status':'error', 'message':'error details' }
	*/
	$('body').on('scenariotool.admin.file.uploaded', function(e,options) {
		var imageurl = options.json.imageurl;
		var index = options.info.index;
		var paletteitem = options.info.paletteitem;
		var phase = options.info.phase;

		//if (window.console) console.log(['paletteitem id = ', paletteitem.id]);
		//if (window.console) console.log(['phase id = ', phase.id]);

		if (typeof paletteitem !== 'undefined') {
			//if (window.console) console.log(['Palette item file uploaded OK. imageurl=',imageurl]);
			// Set the new imageurl value for this paletteitem.
			paletteitem.imageurl = imageurl;
			// Save the paletteitem and it gets automatically updated to "right" view.
			AjaxSavePaletteitem(index, paletteitem, phase);

		} else {
			//if (window.console) console.log(['Phase background image file uploaded OK. imageurl=',imageurl]);
			// image is for phase background.
			phase.imageurl = imageurl;
			AjaxSavePhase(index, phase);
		}
	});

	var AjaxFileUpload = function(formData, index, paletteitem, phase) {
		if (SIMULATE) {
			if (window.console) console.log('AjaxFileUpload SIMULATE');
			var json = { 'status':'ok', 'imageurl':'greenflower.jpg'};
			var info = {'index':index, 'paletteitem':paletteitem, 'phase':phase};
			$('body').trigger('scenariotool.admin.file.uploaded', {'json':json, 'info':info});
		} else {
			var _url = apipath + 'fileupload';
			if (window.console) console.dir(['AjaxFileUpload URL=',_url]);
			$.ajax({
				url: _url,
				type: 'POST',
				data:  formData,
				mimeType:"multipart/form-data",
				contentType: false,
				cache: false,
				dataType: 'json',
				processData: false
			}).done(function(json) {
				// Response is { 'status':'ok', 'imageurl':'/path/server/image.jpg'} or { 'status':'error', 'message':'error details' }
				if (window.console) console.log(['AjaxFileUpload done json=',json]);
				if (typeof json.status === 'ok') {
					var info = {'index':index, 'paletteitem':paletteitem, 'phase':phase};
					$('body').trigger('scenariotool.admin.file.uploaded', {'json':json, 'info':info});
				} else {
					var message = 'AjaxFileUpload for project id = ' + project.id + ' failed!';
					var tStatus = 'json.status = ' + json.status;
					var eThrown = 'json.message =' + json.message;
					$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				var message = 'AjaxFileUpload for project id = ' + project.id + ' failed!';
				var tStatus = 'textStatus = ' + textStatus;
				var eThrown = 'errorThrown = ' + errorThrown;
				$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
			});
		}
	};


	var render_fileupload_form = function(parent_id, index, paletteitem, phase) {

		var form_id = phase.id + '-file-upload-form';
		var browse_id = phase.id + '-file-browse-button';
		var upload_id = phase.id + '-file-upload-button';
		var image_placeholder_id = phase.id + '-image-placeholder';
		var form_label =  'Background image:';
		var button_text = 'Add background image...';

		if (typeof paletteitem !== 'undefined') {
			form_id = paletteitem.id + '-file-upload-form';
			browse_id = paletteitem.id + '-file-browse-button';
			upload_id = paletteitem.id + '-file-upload-button';
			image_placeholder_id = paletteitem.id + '-image-placeholder';
			form_label = 'Icon image:';
			button_text = 'Add icon image...';
		}

		$('<label>').attr('for',form_id).append(form_label).appendTo('#'+parent_id);
		$('<form>').attr('id', form_id).attr('action','javascript:void(0);').attr('method','POST').attr('enctype','multipart/form-data')
			.append($('<span>', {
						'class':'fileinput-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary',
						'role':'button',
						'aria-disabled':'false'
						}
					)
					.append($('<span>',{'class':'ui-button-icon-primary ui-icon ui-icon-plusthick'}))
					.append($('<span>',{'class':'ui-button-text'})
						.append($('<span>').append(button_text))
					)
					.append($('<input>', {id:browse_id, type:'file', name:'file'})
						.on('change', function() {
							//if (window.console) console.log('File selection changed!');
							var file = $(this).val();
							if (file === '') {
								//if (window.console) console.log('No File selected!');
								// No file selected. Disable "Upload"-button.
								if ($('#'+upload_id).hasClass('ui-state-disabled')) {
									// Already disabled -> do nothing.
								} else {
									$('#'+upload_id).addClass('ui-state-disabled');
								}
							} else {
								//if (window.console) console.log('File selected OK!');
								// Enable "Upload"-button.
								if ($('#'+upload_id).hasClass('ui-state-disabled')) {
									$('#'+upload_id).removeClass('ui-state-disabled');
								}
							}
						})
					)
				)
			.append($('<button>', {
						'class':'ui-button ui-widget ui-state-default ui-state-disabled ui-corner-all ui-button-text-icon-primary',
						'id': upload_id,
						'type':'submit',
						'role':'button',
						'aria-disabled':'false'
						}
					)
					.append($('<span>',{'class':'ui-button-icon-primary ui-icon ui-icon-circle-arrow-e'}))
					.append($('<span>',{'class':'ui-button-text'})
						.append($('<span>').append('Upload'))
					)
				)
			.submit(function(e) {
				if ($('#'+upload_id).hasClass('ui-state-disabled')) {
					//if (window.console) console.log('Upload WAS DISABLED!!!!');
				} else {
					//if (window.console) console.log('Upload clicked!');
					var file = $('#'+browse_id).val();
					//if (window.console) { console.log(['ON SUBMIT file=',file]); }
					if (file === '') {
						// No file selected.
					} else {
						var formData = new FormData(this);
						AjaxFileUpload(formData, index, paletteitem, phase);
					}
				}
				e.preventDefault(); // Prevent Default action.
			})
		.appendTo('#'+parent_id);
	};

	var render_paletteitem = function(parent_id, index, paletteitem, phase) {
		//if (window.console) console.log(['render_paletteitem parent_id=',parent_id,' index=',index,' paletteitem=',paletteitem]);
		// Each paletteitem generates two HTML-elements: H3 and DIV.
		var paletteitemid_name = paletteitem.id + '-name';
		var paletteitemid_properties = paletteitem.id + '-properties';
		var paletteitemid_input_name = paletteitem.id + '-input-name';
		var paletteitemid_input_text = paletteitem.id + '-input-text';
		var paletteitemid_input_checkbox_modify = paletteitem.id + '-input-checkbox-modify';

		// Header
		if ($('#'+paletteitemid_name).length > 0) {
			//if (window.console) console.log('paletteitem header exists!');
			// NOTE: We don't want to loose extra spans generated by Accordion Widget.
			//<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s"></span>
			//<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>
			if ($('#'+paletteitemid_name+' > span').hasClass('ui-icon-triangle-1-s')) {
				$('#'+paletteitemid_name).empty()
					.append($('<span>').attr('class','ui-accordion-header-icon ui-icon ui-icon-triangle-1-s'))
					.append(paletteitem.name);
			} else {
				$('#'+id_header).empty()
					.append($('<span>').attr('class','ui-accordion-header-icon ui-icon ui-icon-triangle-1-e'))
					.append(paletteitem.name);
			}
		} else {
			//if (window.console) console.log('paletteitem header does not exist.');
			$('<h3>').attr('id',paletteitemid_name).append(paletteitem.name).appendTo('#'+parent_id);
		}

		// Content
		if ($('#'+paletteitemid_properties).length > 0) {
			//if (window.console) console.log('paletteitem content exists!');

			$('#'+paletteitemid_input_name).val(paletteitem.name);
			// These are probably not needed to change here...
			//$('#'+paletteitemid_input_text).val(paletteitem.text);
			//$('#'+paletteitemid_input_checkbox_modify).prop('checked',paletteitem.modify);

		} else {
			//if (window.console) console.log('paletteitem content does not exist.');
			$('<div>').attr('id',paletteitemid_properties).appendTo('#'+parent_id);

			// **************** Palette item name *****************
			$('<label>').attr('for',paletteitemid_input_name).append('Name: ').appendTo('#'+paletteitemid_properties);
			$('<input>').attr('id',paletteitemid_input_name).val(paletteitem.name).on('change',function(e) {

				var text = $(this).val();
				paletteitem.name = text;
				$('body').trigger('scenariotool.admin.paletteitem.change',{"index":index, "paletteitem":paletteitem, "phase":phase});

			}).appendTo('#'+paletteitemid_properties);


			$('<button>').attr('class','remove-paletteitem-button').append('remove paletteitem')
				.on('click', function() {
					//if (window.console) console.log(['remove paletteitem index=',index]);
					phase.paletteitems.splice(index, 1);
					$('body').trigger('scenariotool.admin.paletteitem.remove',{'paletteitem':paletteitem,'phase':phase});
				})
			.appendTo('#'+paletteitemid_properties);


			$('<br>').appendTo('#'+paletteitemid_properties);
			$('<br>').appendTo('#'+paletteitemid_properties);

			// **************** Palette item image upload *****************

			render_fileupload_form(paletteitemid_properties, index, paletteitem, phase);

			$('<br>').appendTo('#'+paletteitemid_properties);

			// **************** Palette item text *****************
			$('<label>').attr('for',paletteitemid_input_text).append('Text: ').appendTo('#'+paletteitemid_properties);
			$('<input>').attr('id',paletteitemid_input_text).attr('class','paletteitem-text-input').val(paletteitem.text).on('change',function(e) {

				var text = $(this).val();
				paletteitem.text = text;
				$('body').trigger('scenariotool.admin.paletteitem.change',{"index":index, "paletteitem":paletteitem, "phase":phase});

			}).appendTo('#'+paletteitemid_properties);

			$('<br>').appendTo('#'+paletteitemid_properties);

			// **************** Palette item check box *****************
			var name = 'User can modify text';
			$('<input>', { type: 'checkbox', id: paletteitemid_input_checkbox_modify, value: name })
				.prop('checked',paletteitem.modify)
				.on('change',function(e) {
					var state = $(this).prop('checked');
					paletteitem.modify = state;
					//if (window.console) console.log(['STATE OF CHECKBOX CHANGED, it is now:',state]);
					$('body').trigger('scenariotool.admin.paletteitem.change',{"index":index, "paletteitem":paletteitem, "phase":phase});
				})
				.appendTo('#'+paletteitemid_properties);
			$('<label>', { 'for': paletteitemid_input_checkbox_modify, text: name }).appendTo('#'+paletteitemid_properties);


		}
	};

	/*
		This is the second view to paletteitem list.
		The user can see all paletteitems (icons, text) in one view, without need to open and close accordions.
	*/
	var render_paletteitem_right = function(parent_id, index, paletteitem, phase) {

		//if (window.console) console.log('render_paletteitem_right');

		var paletteitemid_li = paletteitem.id + '-li';

		if ($('#'+paletteitemid_li).length > 0) {
			// No need to add <li> -element for this paletteitem.
		} else {
			// Add <li> -element for this paletteitem.
			$('<li>').attr('id',paletteitemid_li).appendTo('#'+parent_id);
		}

		if (typeof paletteitem.imageurl !== 'undefined') {
			// Create or update paletteitem icon image.
			var paletteitemid_image = paletteitem.id + '-image';
			if ($('#'+paletteitemid_image).length > 0) {
				// Update.
				$('#'+paletteitemid_image).attr('src',paletteitem.imageurl);
			} else {
				// Create.
				$('<img>').attr('id',paletteitemid_image).attr('src',paletteitem.imageurl).attr('class','paletteitem-r-image')
					.appendTo('#'+paletteitemid_li);
			}
		} else { // Create or update "noimage.jpg"
			var paletteitemid_image = paletteitem.id + '-image';
			if ($('#'+paletteitemid_image).length > 0) {
				// Update.
				$('#'+paletteitemid_image).attr('src','noimage.jpg');
			} else {
				// Create.
				$('<img>').attr('id',paletteitemid_image).attr('src','noimage.jpg').attr('class','paletteitem-r-image')
					.appendTo('#'+paletteitemid_li);
			}
		}

		if (typeof paletteitem.text !== 'undefined') {
			var paletteitemid_text = paletteitem.id + '-text';
			if ($('#'+paletteitemid_text).length > 0) {
				// Update.
				$('#'+paletteitemid_text).empty().append(paletteitem.text);
			} else {
				// Create
				$('<p>').attr('id',paletteitemid_text).attr('class','paletteitem-r-text').append(paletteitem.text)
					.appendTo('#'+paletteitemid_li);
			}
		}
	};

	/*

	*/
	var clonePhase = function(newphase, phase) {

		if (typeof phase !== 'undefined') {
			newphase.name = phase.name;
			newphase.imageurl = phase.imageurl;
		} else {
			newphase.name = 'new phase';
			newphase.imageurl = 'noimage.jpg';
		}

		newphase.navileft = {};

		if (typeof phase !== 'undefined' && typeof phase.navileft !== 'undefined') {
			newphase.navileft.enabled = phase.navileft.enabled;
			newphase.navileft.position = phase.navileft.position;
			newphase.navileft.text = phase.navileft.text;
		} else {
			newphase.navileft.enabled = false;
			newphase.navileft.position = 'bottom left';
			newphase.navileft.text = 'Previous';
		}

		newphase.naviright = {};

		if (typeof phase !== 'undefined' && typeof phase.naviright !== 'undefined') {
			newphase.naviright.enabled = phase.naviright.enabled;
			newphase.naviright.position = phase.naviright.position;
			newphase.naviright.text = phase.naviright.text;
		} else {
			newphase.naviright.enabled = false;
			newphase.naviright.position = 'bottom right';
			newphase.naviright.text = 'Next';
		}

		newphase.script = {};

		if (typeof phase !== 'undefined' && typeof phase.script !== 'undefined') {
			newphase.script.enabled = phase.script.enabled;
			newphase.script.text = phase.script.text;
		} else {
			newphase.script.enabled = false;
			newphase.script.text = '/* Add your script here. */';
		}

		newphase.palette = {};

		if (typeof phase !== 'undefined' && typeof phase.palette !== 'undefined') {
			newphase.palette.orientation = phase.palette.orientation;
			newphase.palette.position = phase.palette.position;
		} else {
			newphase.palette.orientation = 'vertical';
			newphase.palette.position = 'top left';
		}
	};

	var clonePaletteitem = function(newpi, pi) {
		if (typeof pi !== 'undefined') {
			newpi.name = pi.name;
			newpi.text = pi.text;
			newpi.modify = pi.modify;
			newpi.imageurl = pi.imageurl;
		} else {
			newpi.name = 'new paletteitem';
			newpi.text = 'Add text';
			newpi.modify = true;
			newpi.imageurl = 'noimage.jpg';
		}
	};

	var showNaviPropertiesInput = function(index, phase, parent_id, right) {
		var navi = phase.navileft;
		var phaseid_input_navi_text = phase.id + '-left-navi-text';
		var phaseid_input_navi_pos = phase.id + '-left-navi-pos';
		if (right) {
			navi = phase.naviright;
			phaseid_input_navi_text = phase.id + '-right-navi-text';
			phaseid_input_navi_pos = phase.id + '-right-navi-pos';
		}
		$('<label>').attr('class','navi-label').attr('for',phaseid_input_navi_text).append('Text: ').appendTo('#'+parent_id);
		$('<input>').attr('class','navi-input').attr('id',phaseid_input_navi_text).val(navi.text).on('change',function(e) {
			var text = $(this).val();
			navi.text = text;
			$('body').trigger('scenariotool.admin.phase.change',{index:index, phase:phase});
		}).appendTo('#'+parent_id);

		$('<label>').attr('class','navi-label').attr('for',phaseid_input_navi_pos).append('Position: ').appendTo('#'+parent_id);
		$('<input>').attr('class','navi-input').attr('id',phaseid_input_navi_pos).val(navi.position).on('change',function(e) {
			var text = $(this).val();
			navi.position = text;
			$('body').trigger('scenariotool.admin.phase.change',{index:index, phase:phase});
		}).appendTo('#'+parent_id);
	};

	var hideNaviPropertiesInput = function(phase, right) {
		var phaseid_input_navi_text = phase.id + '-left-navi-text';
		var phaseid_input_navi_pos = phase.id + '-left-navi-pos';
		if (right) {
			phaseid_input_navi_text = phase.id + '-right-navi-text';
			phaseid_input_navi_pos = phase.id + '-right-navi-pos';
		}
		if ($('#'+phaseid_input_navi_text).length > 0) {
			$('#'+phaseid_input_navi_text).remove();
			$('label[for='+phaseid_input_navi_text+']').remove();
		}
		if ($('#'+phaseid_input_navi_pos).length > 0) {
			$('#'+phaseid_input_navi_pos).remove();
			$('label[for='+phaseid_input_navi_pos+']').remove();
		}
	};

	var showScriptTextArea = function(index, phase, parent_id) {
		var phaseid_text = phase.id + '-script-text';
		$('<textarea>').attr('class','script-textarea').attr('id',phaseid_text).attr('cols','66').attr('rows','5').val(phase.script.text).on('change',function(e) {
			var text = $(this).val();
			//if (window.console) console.log(['SCRIPT TEXT=',text]);
			phase.script.text = text;
			$('body').trigger('scenariotool.admin.phase.change',{index:index, phase:phase});
		}).appendTo('#'+parent_id);
	}

	var hideScriptTextArea = function(phase) {
		var phaseid_text = phase.id + '-script-text';
		$('#'+phaseid_text).remove();
		$('label[for='+phaseid_text+']').remove();
	}

	var showPaletteProperties = function(phase, index) {

		var phaseid_palette_wrapper = phase.id + '-palette-wrapper';
		var phaseid_palette_wrapper_header = phase.id + '-palette-wrapper-header';

		var phaseid_vertical_radio = phase.id + '-vertical-radio';
		var phaseid_horizontal_radio = phase.id + '-horizontal-radio';
		var phaseid_palette_position = phase.id + '-palette-position';

		var name = phase.id + '-orientation';
		var value_vertical = "vertical";
		var value_horizontal = "horizontal";
		if ($('#'+phaseid_palette_wrapper_header).length > 0) {
			// No need to add anything!
		} else {
			// add header and UI to modify properties.
			$('<h4>').attr('class','palette-wrapper-header').attr('id',phaseid_palette_wrapper_header).append('Palette orientation and position:').appendTo('#'+phaseid_palette_wrapper);

			$('<input>', { type: 'radio', id: phaseid_vertical_radio, name: name, value: value_vertical })
				.on('change',function(e) {
					var sel = $('input[name='+name+']:checked').val();
					if (window.console) console.log(['PALETTE ORIENTATION sel=',sel]);
					phase.palette.orientation = sel;
					$('body').trigger('scenariotool.admin.phase.change',{index:index, phase:phase});
				})
				.appendTo('#'+phaseid_palette_wrapper);
			$('<label>', { 'for': phaseid_vertical_radio, text: value_vertical }).appendTo('#'+phaseid_palette_wrapper);

			$('<input>', { type: 'radio', id: phaseid_horizontal_radio, name: name, value: value_horizontal })
				.on('change',function(e) {
					var sel = $('input[name='+name+']:checked').val();
					if (window.console) console.log(['PALETTE ORIENTATION sel=',sel]);
					phase.palette.orientation = sel;
					$('body').trigger('scenariotool.admin.phase.change',{index:index, phase:phase});
				})
				.appendTo('#'+phaseid_palette_wrapper);
			$('<label>', { 'for': phaseid_horizontal_radio, text: value_horizontal }).appendTo('#'+phaseid_palette_wrapper);

			if (phase.palette.orientation == value_horizontal) {
				$('#'+phaseid_horizontal_radio).prop('checked',true);
			} else {
				$('#'+phaseid_vertical_radio).prop('checked',true);
			}

			$('<label>').attr('class','palette-position-label').attr('for',phaseid_palette_position).append('Position: ').appendTo('#'+phaseid_palette_wrapper);
			$('<input>').attr('class','palette-position-input').attr('id',phaseid_palette_position).val(phase.palette.position).on('change',function(e) {
				var text = $(this).val();
				phase.palette.position = text;
				$('body').trigger('scenariotool.admin.phase.change',{index:index, phase:phase});
			}).appendTo('#'+phaseid_palette_wrapper);
		}
	};

	var hidePaletteProperties = function(phase) {
		var phaseid_palette_wrapper = phase.id + '-palette-wrapper';
		$('#'+phaseid_palette_wrapper).empty();
	};

	var render_phase = function(parent_id, index, phase) {
		// Each phase generates four HTML-elements: H2 and a root DIV with two sub DIVs.
		var phaseid_name = phase.id + '-name';
		var phaseid_root = phase.id + '-root';

		var phaseid_left_properties = phase.id + '-left-properties';
		var phaseid_right_properties = phase.id + '-right-properties';
		var phaseid_bg_image = phase.id + '-bg-image';

		var phaseid_accordion = phase.id + '-accordion';
		var phaseid_input_name = phase.id + '-input-name';
		var phaseid_left = phase.id + '-left';
		var phaseid_right = phase.id + '-right';

		var phaseid_left_navi_wrapper = phase.id + '-left-navi-wrapper';
		var phaseid_right_navi_wrapper = phase.id + '-right-navi-wrapper';
		var phaseid_left_navi_checkbox = phase.id + '-left-navi-checkbox';
		var phaseid_right_navi_checkbox = phase.id + '-right-navi-checkbox';

		var phaseid_script_wrapper = phase.id + '-script-wrapper';
		var phaseid_script_checkbox = phase.id + '-script-checkbox';
		var phaseid_palette_wrapper = phase.id + '-palette-wrapper';

		// Header
		if ($('#'+phaseid_name).length > 0) {
			//if (window.console) console.log('phase header exists!');
			// NOTE: We don't want to loose extra spans generated by Accordion Widget.
			//<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s"></span>
			//<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>
			if ($('#'+phaseid_name+' > span').hasClass('ui-icon-triangle-1-s')) {
				$('#'+phaseid_name).empty()
					.append($('<span>').attr('class','ui-accordion-header-icon ui-icon ui-icon-triangle-1-s'))
					.append(phase.name);
			} else {
				$('#'+phaseid_name).empty()
					.append($('<span>').attr('class','ui-accordion-header-icon ui-icon ui-icon-triangle-1-e'))
					.append(phase.name);
			}
		} else {
			//if (window.console) console.log('phase header does not exist.');
			$('<h2>').attr('id',phaseid_name).append(phase.name).appendTo('#'+parent_id);
		}

		// Content
		if ($('#'+phaseid_root).length > 0) {

			//if (window.console) console.log('phase content exists!');
			$('#'+phaseid_input_name).val(phase.name);
			// Background image.
			$('#'+phaseid_bg_image).attr('src',phase.imageurl);




		} else {

			//if (window.console) console.log('phase content does not exist.');
			$('<div>').attr('id',phaseid_root).appendTo('#'+parent_id);

			$('<div>').attr('class','row')
				.append($('<div>').attr('id',phaseid_left_properties).attr('class','small-6 columns'))
				.append($('<div>').attr('id',phaseid_right_properties).attr('class','small-6 columns'))
				.appendTo('#'+phaseid_root);


			$('<label>').attr('for',phaseid_input_name).append('Name: ').appendTo('#'+phaseid_left_properties);
			$('<input>').attr('id',phaseid_input_name).val(phase.name).on('change',function(e) {
				var text = $(this).val();
				phase.name = text;
				$('body').trigger('scenariotool.admin.phase.change',{index:index, phase:phase});
			}).appendTo('#'+phaseid_left_properties);

			$('<button>').attr('class','clone-phase-button').append('clone phase')
				.on('click', function() {
					//if (window.console) console.log(['clone phase index=',index]);
					//project.phases.splice(index, 1);
					// Note, all other properties can be cloned, but id's must be unique...
					// NOTE: Implementation must be done asynchronously, add phase normally and then
					// chain paletteitem cloning to ajax response events...
					// 1st, add phase:
					var len = project.phases.length;
					// NOTE: MUST CLONE ALL phase properties in here:
					var newphase = {};

					clonePhase(newphase, phase);

					project.phases.push(newphase);
					AjaxSavePhase(len, newphase, phase);
				})
			.appendTo('#'+phaseid_left_properties);

			$('<button>').attr('class','remove-phase-button').append('remove phase')
				.on('click', function() {
					//if (window.console) console.log(['remove phase index=',index]);
					project.phases.splice(index, 1);
					$('body').trigger('scenariotool.admin.phase.remove',{phase:phase});
				})
			.appendTo('#'+phaseid_left_properties);

			$('<br>').appendTo('#'+phaseid_left_properties);
			$('<br>').appendTo('#'+phaseid_left_properties);

			// **************** Phase background image upload *****************
			var paletteitem = undefined;
			render_fileupload_form(phaseid_left_properties, index, paletteitem, phase);


			// **************** Phase Left navigation check box *****************
			if (typeof phase.navileft === 'undefined') {
				// Fill in the default properties and values.
				phase.navileft = {
						'enabled': false,
						'position': 'bottom left',
						'text': 'Previous'
					};
			}
			var name = 'Navigation Buttons:';
			$('<h4>').attr('class','navigation-button-title').append(name).appendTo('#'+phaseid_left_properties);
			$('<div>',{id:phaseid_left_navi_wrapper}).appendTo('#'+phaseid_left_properties);

			name = 'Left';

			$('<input>', { type: 'checkbox', id: phaseid_left_navi_checkbox, value: name })
				.prop('checked',phase.navileft.enabled)
				.on('change',function(e) {
					var state = $(this).prop('checked');
					phase.navileft.enabled = state;
					if (state) {
						showNaviPropertiesInput(index, phase, phaseid_left_navi_wrapper, false);
					} else {
						hideNaviPropertiesInput(phase, false);
					}
					$('body').trigger('scenariotool.admin.phase.change',{"index":index, "phase":phase});
				})
				.appendTo('#'+phaseid_left_navi_wrapper);
			$('<label>', { 'for': phaseid_left_navi_checkbox, text: name }).appendTo('#'+phaseid_left_navi_wrapper);

			if (phase.navileft.enabled) {
				showNaviPropertiesInput(index, phase, phaseid_left_navi_wrapper, false);
			} else {
				hideNaviPropertiesInput(phase, false);
			}

			// **************** Phase Right navigation check box *****************
			if (typeof phase.naviright === 'undefined') {
				// Fill in the default properties and values.
				phase.naviright = {
						'enabled': false,
						'position': 'bottom right',
						'text': 'Next'
					};
			}

			name = 'Right';

			$('<div>',{id:phaseid_right_navi_wrapper}).appendTo('#'+phaseid_left_properties);
			$('<input>', { type: 'checkbox', id: phaseid_right_navi_checkbox, value: name })
				.prop('checked',phase.naviright.enabled)
				.on('change',function(e) {
					var state = $(this).prop('checked');
					phase.naviright.enabled = state;
					if (state) {
						showNaviPropertiesInput(index, phase, phaseid_right_navi_wrapper, true);
					} else {
						hideNaviPropertiesInput(phase, true);
					}
					$('body').trigger('scenariotool.admin.phase.change',{"index":index, "phase":phase});
				})
				.appendTo('#'+phaseid_right_navi_wrapper);
			$('<label>', { 'for': phaseid_right_navi_checkbox, text: name }).appendTo('#'+phaseid_right_navi_wrapper);

			if (phase.naviright.enabled) {
				showNaviPropertiesInput(index, phase, phaseid_right_navi_wrapper, true);
			} else {
				hideNaviPropertiesInput(phase, true);
			}

			$('<br>').appendTo('#'+phaseid_left_properties);

			// **************** Phase Script checkbox *****************
			$('<div>',{id:phaseid_script_wrapper}).appendTo('#'+phaseid_left_properties);
			if (typeof phase.script === 'undefined') {
				// Fill in the default properties and values.
				phase.script = {
						'enabled': false,
						'text': '/* Add your script here. */'
					};
			}
			var name = 'Add script';
			$('<input>', { type: 'checkbox', id: phaseid_script_checkbox, value: name })
				.prop('checked',phase.script.enabled)
				.on('change',function(e) {
					var state = $(this).prop('checked');
					phase.script.enabled = state;
					if (state) {
						showScriptTextArea(index, phase, phaseid_script_wrapper);
					} else {
						hideScriptTextArea(phase);
					}
					$('body').trigger('scenariotool.admin.phase.change',{"index":index, "phase":phase});
				})
				.appendTo('#'+phaseid_script_wrapper);
			$('<label>', { 'for': phaseid_script_checkbox, text: name }).appendTo('#'+phaseid_script_wrapper);

			if (phase.script.enabled) {
				showScriptTextArea(index, phase, phaseid_script_wrapper);
			} else {
				hideScriptTextArea(phase);
			}

			//$('<br>').appendTo('#'+phaseid_left_properties);

			// **************** Palette wrapper with palette orientation and position **************
			$('<div>',{id:phaseid_palette_wrapper}).appendTo('#'+phaseid_left_properties);
			if (typeof phase.paletteitems !== 'undefined') {
				if (phase.paletteitems.length > 0) {
					showPaletteProperties(phase, index);
				} else {
					hidePaletteProperties(phase);
				}
			} else {
				hidePaletteProperties(phase);
			}

			// **************** Add paletteitem button ****************
			$('<button>').attr('class','add-paletteitem-button').append('Add paletteitem')
				.on('click', function() {
					var len = 0;
					var newpaletteitem = {};

					clonePaletteitem(newpaletteitem);

					if (typeof phase.paletteitems === 'undefined') {
						phase.paletteitems = [];
					} else {
						len = phase.paletteitems.length;
					}
					phase.paletteitems.push(newpaletteitem);
					AjaxSavePaletteitem(len, newpaletteitem, phase);
				})
			.appendTo('#'+phaseid_left_properties);

			$('<br>').appendTo('#'+phaseid_left_properties);
			$('<br>').appendTo('#'+phaseid_left_properties);


			var src = 'noimage.jpg';
			if (typeof phase.imageurl !== 'undefined') {
				src = phase.imageurl;
			}
			$('<img>').attr('id',phaseid_bg_image).attr('src',src).appendTo('#'+phaseid_right_properties);

			$('<div>').attr('class','row')
				.append($('<div>').attr('id',phaseid_left).attr('class','small-6 columns'))
				.append($('<div>').attr('id',phaseid_right).attr('class','small-6 columns'))
				.appendTo('#'+phaseid_root);
			$('<div>').attr('id',phaseid_accordion).appendTo('#'+phaseid_left);




		}
	};



	var refreshAccordion = function(id, arr) {

		//if (window.console) console.log(['refreshAccordion id=',id,' arr=',arr]);
		if ($('#'+id).hasClass('ui-accordion')) {
			$('#'+id).accordion("refresh");
		} else {
			// If Accordion widget is NOT initialized yet, do it now.
			// And set last item active.
			var lastindex = 0;
			var len = arr.length;
			if (len > 0) {
				lastindex = len - 1;
			}
			var options = {
				collapsible : true,
				active : lastindex,
				heightStyle : "content" // Each panel will be only as tall as its content.
			};
			$('#'+id).accordion(options);
		}
	};


	var rebuildPhaseDom = function(phase) {
		//if (window.console) console.log(['rebuildPhaseDom phase=',phase]);
		var id = phase.id + '-accordion';
		if ($('#'+id).hasClass('ui-accordion')) {
			$('#'+id).accordion("destroy");
		}
		$('#'+id).empty();
		//if (window.console) console.log(['REBUILD Phase -> empty #',id]);

		var rid = phase.id + '-right'; // Clean the "WYSIWYG"-view for paletteitems.
		$('#'+rid).empty();
		var ulroot = phase.id + '-ul-root';
		$('<ul>').attr('id',ulroot).attr('class','paletteitem-ul-root').appendTo('#'+rid);

		// Generate HTML
		if (typeof phase.paletteitems !== 'undefined') {
			$.each(phase.paletteitems, function(ii,vv) {
				render_paletteitem(id, ii, vv, phase);
				render_paletteitem_right(ulroot, ii, vv, phase);
			});
			// Also refresh (rebuild) Accordion Widget
			refreshAccordion(id, phase.paletteitems);
		}
	};

	/*
		Clean from root div <div id="projectid-accordion">
		and then rebuild all from ground up.
		Generate HTML mark-up from model tree.
	*/
	var rebuildProjectDom = function() {

		//if (window.console) console.log(['rebuildProjectDom project=',project]);

		var id = project.id + '-accordion';
		if ($('#'+id).hasClass('ui-accordion')) {
			$('#'+id).accordion("destroy");
		}
		$('#'+id).empty();
		//if (window.console) console.log(['REBUILD Project -> empty #',id]);

		// Generate HTML
		$.each(project.phases, function(i,v) {
			render_phase(id, i, v);

			var pid = v.id + '-accordion';

			var rid = v.id + '-right'; // Clean the "WYSIWYG"-view for paletteitems.
			var ulroot = v.id + '-ul-root';
			$('<ul>').attr('id',ulroot).attr('class','paletteitem-ul-root').appendTo('#'+rid);

			if (typeof v.paletteitems !== 'undefined') {
				$.each(v.paletteitems, function(ii,vv) {
					render_paletteitem(pid, ii, vv, v);
					render_paletteitem_right(ulroot, ii, vv, v);
				});
			}
		});
		// Also refresh (rebuild) all Accordion Widgets
		refreshAccordion(id, project.phases);
		$.each(project.phases, function(i,v) {
			var pid = v.id + '-accordion';
			if (typeof v.paletteitems !== 'undefined') {
				refreshAccordion(pid, v.paletteitems);
			}
		});
	};



	$('body').on('scenariotool.admin.phase.deleted', function(e,options) {
		var status = options.json.status;
		if (status === 'ok') {
			//if (window.console) console.log('phase deleted OK.');
			rebuildProjectDom();
		}
	});
	/*
		REST call to DELETE phase.
	*/
	var AjaxDeletePhase = function(phase) {
		if (SIMULATE) {
			if (window.console) console.log('AjaxDeletePhase SIMULATE');
			var json = {status:'ok'};
			$('body').trigger('scenariotool.admin.phase.deleted',{json:json});
		} else {
			var _url = apipath + 'projects/' + project.id + '/phases/' + phase.id;
			if (window.console) console.dir(['AjaxDeletePhase URL=',_url]);
			$.ajax({
				url: _url,
				type: 'DELETE',
				dataType: 'json'
			}).done(function(json) {
				// Response is {'status':'ok'} or {'status':'failure'}
				if (window.console) console.log(['AjaxDeletePhase done json=',json]);
				if (json.status === 'ok') {
					$('body').trigger('scenariotool.admin.phase.deleted', {'json':json});
				} else {
					var message = 'AjaxDeletePhase for project id = ' + project.id + ' failed!';
					var tStatus = 'json.status = ' + json.status;
					var eThrown = '';
					$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				var message = 'AjaxDeletePhase for project id = ' + project.id + ' failed!';
				var tStatus = 'textStatus = ' + textStatus;
				var eThrown = 'errorThrown = ' + errorThrown;
				$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
			});
		}
	};

	$('body').on('scenariotool.admin.phase.remove', function(e,options) {
		var p = options.phase;
		// Do the REST call to DELETE phase from database!
		AjaxDeletePhase(p);
	});



	/*
		Event: 'scenariotool.admin.paletteitem.deleted'
		Arguments:
			options.json.status
			options.phase
	*/
	$('body').on('scenariotool.admin.paletteitem.deleted', function(e,options) {
		var status = options.json.status;
		var phase = options.phase;
		if (status === 'ok') {
			if (window.console) console.log('paletteitem deleted OK.');
			rebuildPhaseDom(phase);
			if (phase.paletteitems.length === 0) {
				hidePaletteProperties(phase);
			}
		}
	});
	/*
		REST call to DELETE palette item.
	*/
	var AjaxDeletePaletteitem = function(paletteitem, phase) {
		if (SIMULATE) {
			if (window.console) console.log('AjaxDeletePaletteitem SIMULATE');
			var json = {status:'ok'};
			$('body').trigger('scenariotool.admin.paletteitem.deleted',{'json':json,'phase':phase});
		} else {
			var _url = apipath + 'projects/' + project.id + '/phases/' + phase.id + '/paletteitems/' + paletteitem.id;
			if (window.console) console.dir(['AjaxDeletePaletteitem URL=',_url]);
			$.ajax({
				url: _url,
				type: 'DELETE',
				dataType: 'json'
			}).done(function(json) {
				// Response is {'status':'ok'} or {'status':'failure'}
				if (window.console) console.log(['AjaxDeletePaletteitem done json=',json]);
				if (json.status === 'ok') {
					$('body').trigger('scenariotool.admin.paletteitem.deleted', {'json':json, 'phase':phase});
				} else {
					var message = 'AjaxDeletePaletteitem for project id = ' + project.id + ' failed!';
					var tStatus = 'json.status = ' + json.status;
					var eThrown = '';
					$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				var message = 'AjaxDeletePaletteitem for project id = ' + project.id + ' failed!';
				var tStatus = 'textStatus = ' + textStatus;
				var eThrown = 'errorThrown = ' + errorThrown;
				$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
			});
		}
	};

	$('body').on('scenariotool.admin.paletteitem.remove', function(e,options) {
		var p = options.paletteitem;
		var phase = options.phase;
		// Do the REST call to DELETE paletteitem from database!
		AjaxDeletePaletteitem(p, phase);
	});


	/* When some property of phase in model has changed, we do following 3 steps.
		1) $('body').trigger('scenariotool.admin.phase.change',{index:index,phase:p});
		2) AjaxSavePhase
		3) $('body').trigger('scenariotool.admin.phase.saved',{json:json});
	*/
	$('body').on('scenariotool.admin.phase.saved', function(e,options) {
		var index = options.index;
		var phase = options.json.phase;

		var id = project.id + '-accordion';
		render_phase(id, index, phase);

		// NOTE: MUST REFRESH the Accordion Widget for phases
		refreshAccordion(id, project.phases);

		var clone = options.clone;
		if (typeof clone !== 'undefined') {
			//
			//
			//
			//if (window.console) console.log('DO THE CLONING!!!');
			//
			// 2nd, initialize the cloning process for all paletteitems:
			//
			if (typeof clone.paletteitems !== 'undefined' && clone.paletteitems.length > 0) {

				var clone_paletteitems = [];
				$.each(clone.paletteitems, function(i,v) {
					clone_paletteitems.push(v);
				});
				var c = clone_paletteitems.shift(); // Take out the first one.

				var newpaletteitem = {};

				clonePaletteitem(newpaletteitem, c);
				//if (window.console) console.log(['Cloned paletteitem =',newpaletteitem]);

				phase.paletteitems = [];
				phase.paletteitems.push(newpaletteitem);
				AjaxSavePaletteitem(0, newpaletteitem, phase, clone_paletteitems);
			}
		}
	});
	/*
		REST call to SAVE/UPDATE phase.
	*/
	var AjaxSavePhase = function(index, phase, clone) {
		if (SIMULATE) {
			if (window.console) console.log('AjaxSavePhase SIMULATE');
			if (typeof phase.id === 'undefined') {
				phase.id = globalObjectCount + 1;
				if (window.console) console.log(['AjaxSavePhase NEW id=',phase.id]);
				globalObjectCount++;
			} else {
				// This is an update.
			}
			var json = {phase:phase};
			$('body').trigger('scenariotool.admin.phase.saved',{index:index,json:json,clone:clone});
		} else {
			var _url = apipath + 'projects/' + project.id + '/phases';
			if (window.console) console.dir(['AjaxSavePhase URL=',_url]);
			$.ajax({
				url: _url,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(phase)
			}).done(function(json) {
				if (window.console) console.log(['AjaxSavePhase done json=',json]);
				if (typeof phase.id === 'undefined') {
					phase.id = json.phase.id;
				}
				$('body').trigger('scenariotool.admin.phase.saved',{'index':index,'json':json, clone:clone});
			}).fail(function(jqXHR, textStatus, errorThrown) {
				var message = 'AjaxSavePhase for project id = ' + project.id + ' failed!';
				var tStatus = 'textStatus = ' + textStatus;
				var eThrown = 'errorThrown = ' + errorThrown;
				$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
			});
		}
	};

	$('body').on('scenariotool.admin.phase.change', function(e,options) {
		if (window.console) console.log('phase change REQUESTED!');
		var i = options.index;
		var p = options.phase;
		// Do the REST call to UPDATE database!
		AjaxSavePhase(i, p);
		// If saving is OK -> the response will trigger phase rendering.
	});

	/*

	*/
	$('body').on('scenariotool.admin.paletteitem.saved', function(e,options) {
		var index = options.index;
		var paletteitem = options.json.paletteitem;
		var phase = options.phase;
		var clone = options.clone;

		var id = phase.id + '-accordion';
		var ulroot = phase.id + '-ul-root';
		var rid = phase.id + '-right';
		if ($('#'+ulroot).length == 0) {
			$('<ul>').attr('id',ulroot).attr('class','paletteitem-ul-root').appendTo('#'+rid);
		}
		render_paletteitem(id, index, paletteitem, phase);
		render_paletteitem_right(ulroot, index, paletteitem, phase);

		// Make sure that palette properties are displayed when this was the first paletteitem saved.
		showPaletteProperties(phase, index);

		// NOTE: MUST REFRESH the Accordion Widget.
		refreshAccordion(id, phase.paletteitems);

		if (typeof clone !== 'undefined') {
			if (clone.length > 0) {

				var c = clone.shift(); // Take out the next one.
				// NOTE: property id must be undefined, this tells system that this is
				// a new palette item we are going to save (not an update to old one).
				var newpaletteitem = {};

				clonePaletteitem(newpaletteitem, c);
				//if (window.console) console.log(['Cloned paletteitem =',newpaletteitem]);

				var len = phase.paletteitems.length;
				phase.paletteitems.push(newpaletteitem);
				AjaxSavePaletteitem(len, newpaletteitem, phase, clone);

			} else {
				//if (window.console) console.log(['AFTER CLONING project=',project]);

				// Just print out all id's for testing purposes...
				/*if (typeof project.phases !== 'undefined') {
					$.each(project.phases, function(i,v) {
						if (window.console) console.log(['PHASE ID=',v.id]);
						if (typeof v.paletteitems !== 'undefined') {
							$.each(v.paletteitems, function(ii,vv) {
								if (window.console) console.log(['PALETTEITEM ID=',vv.id]);
							});
						}
					});
				}*/
			}
		}
	});

	var AjaxSavePaletteitem = function(index, paletteitem, phase, clone) {
		if (SIMULATE) {
			if (window.console) console.log('AjaxSavePaletteitem SIMULATE');
			if (typeof paletteitem.id === 'undefined') {
				paletteitem.id = globalObjectCount + 1;
				if (window.console) console.log(['AjaxSavePaletteitem NEW id=',paletteitem.id]);
				globalObjectCount++;
			} else {
				// This is an update.
			}
			var json = {paletteitem:paletteitem};
			$('body').trigger('scenariotool.admin.paletteitem.saved',{'index':index,'json':json,'phase':phase,'clone':clone});
		} else {
			var _url = apipath + 'projects/' + project.id + '/phases/' + phase.id + '/paletteitems';
			if (window.console) console.dir(['AjaxSavePaletteitem URL=',_url]);
			$.ajax({
				url: _url,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(paletteitem)
			}).done(function(json) {
				if (window.console) console.log(['AjaxSavePaletteitem done json=',json]);
				if (typeof paletteitem.id === 'undefined') {
					paletteitem.id = json.paletteitem.id;
				}
				$('body').trigger('scenariotool.admin.paletteitem.saved',{'index':index,'json':json,'phase':phase,'clone':clone});
			}).fail(function(jqXHR, textStatus, errorThrown) {
				var message = 'AjaxSavePaletteitem for project id = ' + project.id + ' failed!';
				var tStatus = 'textStatus = ' + textStatus;
				var eThrown = 'errorThrown = ' + errorThrown;
				$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
			});
		}
	};

	$('body').on('scenariotool.admin.paletteitem.change', function(e,options) {
		var i = options.index;
		var p = options.paletteitem;
		var phase = options.phase;
		// Do the REST call to UPDATE database!
		AjaxSavePaletteitem(i, p, phase);
		// If saving is OK -> the response will trigger paletteitem rendering.
	});


	/*
		Project properties: Width:    Height:
	*/

	$('body').on('scenariotool.admin.project.saved', function(e,options) {
		var p = options.json.project;
		//if (window.console) console.log(['Project Saved DONE p=', p]);
	});

	var AjaxSaveProject = function(project) {
		if (SIMULATE) {
			if (window.console) console.log('AjaxSaveProject SIMULATE');
			var json = {project:project};
			$('body').trigger('scenariotool.admin.project.saved',{json:json});
		} else {
			var _url = apipath + 'projects';
			if (window.console) console.dir(['AjaxSaveProject URL=',_url]);
			$.ajax({
				url: _url,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(project)
			}).done(function(json) {
				if (window.console) console.log(['AjaxSaveProject done json=',json]);
				$('body').trigger('scenariotool.admin.project.saved',{json:json});
			}).fail(function(jqXHR, textStatus, errorThrown) {
				var message = 'AjaxSaveProject for project id = ' + project.id + ' failed!';
				var tStatus = 'textStatus = ' + textStatus;
				var eThrown = 'errorThrown = ' + errorThrown;
				$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
			});
			// Just print out all id's for testing purposes...
			/*if (typeof project.phases !== 'undefined') {
				$.each(project.phases, function(i,v) {
					if (window.console) console.log(['PHASE ID=',v.id]);
					if (typeof v.paletteitems !== 'undefined') {
						$.each(v.paletteitems, function(ii,vv) {
							if (window.console) console.log(['PALETTEITEM ID=',vv.id]);
						});
					}
				});
			}*/
		}
	};

	$('body').on('scenariotool.admin.project.change', function(e,options) {
		var p = options.project;
		//if (window.console) console.log(['scenariotool.admin.project.change project=',p]);
		//if (window.console) console.log('CALL AjaxSaveProject');
		AjaxSaveProject(p);
	});



	/*
		Existing project is fetched from server. It can be empty, but must have one property (id).
		All other properties can be filled in with default values if needed.
	*/
	$('body').on('scenariotool.admin.update.project', function(e,options) {
		project = options.json.project;
		if (window.console) console.log(['scenariotool.admin.update.project project=',project]);
		/*if (typeof project.id === 'undefined') {
			project.id = 1234567;
		}*/
		if (typeof project.name === 'undefined') {
			project.name = 'foobar';
		}
		if (typeof project.width === 'undefined') {
			project.width = 1024;
		}
		if (typeof project.height === 'undefined') {
			project.height = 512;
		}
		if (typeof project.phases === 'undefined') {
			project.phases = [];
		}
		/*
			Count items in this project so far. This is needed when we are SIMULATING to generate unique id's correctly.
			Also make sure that if phases and paletteitems exist, they have correct properties filled in if missing.
			For example: phase must have "navileft", "naviright", "script" and "palette" objects.
		*/
		var count = 1;
		$.each(project.phases, function(i,v) {

			count++;

			var phaseindex = i+1;
			if (typeof v.name === 'undefined') {
				v.name = 'Phase '+phaseindex;
			}
			if (typeof v.imageurl === 'undefined') {
				v.imageurl = 'noimage.jpg';
			}
			if (typeof v.navileft === 'undefined') {
				v.navileft = {
					'enabled': false,
					'position': 'bottom left',
					'text': 'Previous'
				};
			}
			if (typeof v.naviright === 'undefined') {
				v.naviright = {
					'enabled': false,
					'position': 'bottom right',
					'text': 'Next'
				};
			}
			if (typeof v.script === 'undefined') {
				v.script = {
					'enabled': false,
					'text': '/* Add your script here. */'
				};
			}
			if (typeof v.palette === 'undefined') {
				v.palette = {
					'orientation': 'vertical',
					'position': 'top left'
				};
			}

			if (typeof v.paletteitems === 'undefined') {
				v.paletteitems = [];
			} else {
				$.each(v.paletteitems, function(ii,vv) {
					var paletteitemindex = ii+1;
					if (typeof vv.name === 'undefined') {
						vv.name = 'Paletteitem '+paletteitemindex;
					}
					if (typeof vv.text === 'undefined') {
						vv.text = 'Add text';
					}
					if (typeof vv.modify === 'undefined') {
						vv.modify = true;
					}
					if (typeof vv.imageurl === 'undefined') {
						vv.imageurl = 'noimage.jpg';
					}
					count++;
				});
			}
		});
		globalObjectCount = count;
		if (window.console) console.log(['globalObjectCount=',globalObjectCount]);

		var projectid = project.id;
		var projectid_properties = projectid + '-properties';
		var projectid_accordion = projectid + '-accordion';
		var projectid_input_width = projectid + '-input-width';
		var projectid_input_height = projectid + '-input-height';

		/*	This is the HTML-root, where all phases and paletteitems are appended.
			The Zurb Foundation is used for the GRID.
			<div class="row">
				<div id="root" class="small-12 columns">

				</div>
			</div>
		*/
		// Append header.
		$('<h1>').attr('class','text-header-color').append('Project name '+project.name).appendTo('#root');
		/*
			<div class="row">
				<div id="root" class="small-12 columns">
					<h1 class="text-header-color">Project name foobar</h1>
				</div>
			</div>
		*/
		// Append first div to root ...
		$('<div>').attr('id',projectid).appendTo('#root');
		// ... and under that two additional root divs
		$('<div>').attr('id',projectid_properties).appendTo('#'+projectid);
		// ...and div where main Accordion will be generated.
		$('<div>').attr('id',projectid_accordion).appendTo('#'+projectid);
		/* This is how it looks when the accordion is created:
		<div id="1">
			<div id="1-properties">
			<div id="1-accordion" class="ui-accordion ui-widget ui-helper-reset" role="tablist">
		</div>
		*/

		/*
			Append General properties:
		*/
		$('<h3>').attr('class','text-header-color').append('General properties:').appendTo('#'+projectid_properties);
		/*
			Project Width:
		*/
		$('<label>').attr('class','text-header-color').attr('for',projectid_input_width).append('Width: ').appendTo('#'+projectid_properties);
		$('<input>').attr('id',projectid_input_width).attr('class','projectid-text-input').val(project.width).on('change',function(e) {
			var text = $(this).val();
			project.width = parseInt(text);
			$('body').trigger('scenariotool.admin.project.change',{project:project});
		}).appendTo('#'+projectid_properties);
		$('<span>').attr('class','project-text-input-span').append('px').appendTo('#'+projectid_properties);
		/*
			<h3 class="text-header-color">General properties:</h3>
			<label class="text-header-color" for="1-input-width">Width: </label>
			<input id="1-input-width">
		*/
		/*
			Project Height:
		*/
		$('<label>').attr('class','text-header-color').attr('for',projectid_input_height).append('Height: ').appendTo('#'+projectid_properties);
		$('<input>').attr('id',projectid_input_height).attr('class','projectid-text-input').val(project.height).on('change',function(e) {
			var text = $(this).val();
			project.height = parseInt(text);
			$('body').trigger('scenariotool.admin.project.change',{project:project});
		}).appendTo('#'+projectid_properties);
		$('<span>').attr('class','project-text-input-span').append('px').appendTo('#'+projectid_properties);

		/*
			<label class="text-header-color" for="1-input-height">Height: </label>
			<input id="1-input-height">
			<button class="add-phase-button">Add phase</button>
		*/
		/*
			"Add phase"-button:
		*/
		$('<button>').attr('class','add-phase-button').append('Add phase')
			.on('click', function() {
				var len = project.phases.length;
				var newphase = {};

				clonePhase(newphase);

				project.phases.push(newphase);
				AjaxSavePhase(len, newphase);
			})
			.appendTo('#'+projectid_properties);

		$('<br>').appendTo('#'+projectid_properties);
		$('<br>').appendTo('#'+projectid_properties);

		// And finally build the Dom from project JSON object:
		rebuildProjectDom();
	});

	/*
		Common error handler for all Ajax REST calls.
	*/
	$('body').on('scenariotool.admin.rest.fail', function(e,options) {
		var message = options.message;
		var status = options.status;
		var error = options.error;

		if (window.console) console.log(message);
		if (window.console) console.log(status);
		if (window.console) console.log(error);

		$('#root').empty();
		// Append header and ERROR message.
		$('<h1>').attr('class','text-header-color').append('OOPS! Something went wrong!').appendTo('#root');
		$('<h1>').attr('class','text-error-color').append(message).appendTo('#root');
		$('<h2>').attr('class','text-error-color').append(status).appendTo('#root');
		$('<h2>').attr('class','text-error-color').append(error).appendTo('#root');
	});

	/*
		Get project (with id) from server database.
		Response is handled in event handler:
			$('body').on('scenariotool.admin.update.project', function(e,options)
		Response is an object in JSON format {project: {...}}.
		If response is empty project, fill in the default properties.
	*/
	var AjaxGetProject = function(id) {
		var _url = apipath + 'projects/' + id;
		if (SIMULATE) {
			_url = id + '.json';
		}
		if (window.console) console.dir(['AjaxGetProject URL=',_url]);
		$.ajax({
			url: _url,
			cache: false,
			dataType: 'json'})
		.done(function(json) {
			if (window.console) console.log(['AjaxGetProject done json=',json]);
			$('body').trigger('scenariotool.admin.update.project',{json:json});
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			var message = 'AjaxGetProject for project id = ' + id + ' failed!';
			var tStatus = 'textStatus = ' + textStatus;
			var eThrown = 'errorThrown = ' + errorThrown;
			$('body').trigger('scenariotool.admin.rest.fail',{message:message, status:tStatus, error:eThrown});
		});
	};
	/*
		Start the show!
	*/
	var _project_id = 1;
	var QS = QueryString; // scenariotool.html?projectid=1
	if (typeof QS.projectid === 'undefined') {

	} else {
		_project_id = QS.projectid;
	}
	if (window.console) console.log(['START with projectid =',_project_id]);

	// Get project model from server.
	AjaxGetProject(_project_id);

})(jQuery);
