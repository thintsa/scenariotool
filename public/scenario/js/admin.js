$(document).ready(function(){
	var api_base = 'http://localhost:3000/api/';

	var canvas = $('#projectadmin');
	var scenarioid = $('#projectadmin').attr('title');

	var scenario = Object();
	var scenarioitems = Array();

	var loggedin = false;

	var date = new Date();
	// get project data
	$.get(api_base + 'projects/' + projectid + '?_=' + date.getTime(), function(data) {
		if (data.length > 0) {
			$.get(api_base + 'projects/' + projectid + '/phases?_=' + date.getTime(), function(data) {
                            // render everything
			});
		} else {
			$('#scenariocanvas').replaceWith('Kollaasia ei löydy');
		}
	});

	// check if logged in
	if ($.cookie('scenariopw') != undefined) {
		var data = {
			password : $.cookie('scenariopw')
		};
		checkapilogin(data);
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
});
