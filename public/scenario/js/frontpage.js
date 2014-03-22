$(document).ready(function(){
	var projectnames = [];

	$.getJSON('http://localhost:3000/api/projects?callback=?')
	.success(function(data) {
		$.each(data, function (key, val) {
			//fix: for some reason .done() doesn't work
			projectnames.push(val.projectid);
		})
	});

	$('#createproject').submit(function (event) {
		event.preventDefault();

		var api_base = 'http://localhost:3000/api/';

		var projectname = $('#projectname').val();

		if ($.inArray(projectname, projectnames) < 0) {
			var data = {
				path: '/projects/' + projectname,
				password: $('#projectpassword').val()
			};
			$.post(projectname + '/logincookie', data, function(response) {
				var project = {
					projectid : projectname,
					password : response.digest
				};
				$.post(api_base + 'projects', project)
				.always(function(response) { // fix: for some reason .done() doesn't work even if the project is created, cross domain post problems perhaps
					window.location.href = 'http://localhost:3000/projects/' + projectname;
				})
			});
		} else {
			alert('Kollaasi nimellä ' + projectname + ' on jo olemassa.');
		}
	});
});
