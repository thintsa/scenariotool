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
			var project = {
				projectid : projectname,
			};
			$.post(api_base + 'projects', project)
			.always(function(response) { // fix: for some reason .done() doesn't work even if the project is created, cross domain post problems perhaps
				window.location.href = 'http://localhost:3001/scenario/' + projectname + '/admin';
			})
		} else {
			alert('Kollaasi nimellä ' + projectname + ' on jo olemassa.');
		}
	});
});
