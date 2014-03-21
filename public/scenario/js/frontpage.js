$(document).ready(function(){
	var scenarios = [];
	$.getJSON('http://localhost:3000/scenarioapi/api/scenarios', function(data) {
		$.each(data, function (key, val) {
			scenarios.push(val.id);
		});
	});

	$('#createscenario').submit(function (event) {
		event.preventDefault();

		var api_base = 'http://localhost:3000/scenarioapi/api/';

		var scenarioname = $('#scenarioname').val();

		if ($.inArray(scenarioname, scenarios) < 0) {
			var data = {
				path: '/scenario/' + scenarioname,
				password: $('#scenariopassword').val()
			};
			$.post(scenarioname + '/logincookie', data, function(response) {
				var scenario = {
					id : scenarioname,
					title : '',
					description : '',
					password : response.digest
				};
				$.post(api_base + 'scenarios/', scenario, function() {
					window.location.href = 'http://localhost:3000/scenario/' + scenarioname;
				});
			});
		} else {
			alert('Kollaasi nimellä ' + scenarioname + ' on jo olemassa.');
		}
	});
});
