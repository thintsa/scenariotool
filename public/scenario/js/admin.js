$(document).ready(function(){
	var api_base = 'http://localhost:3000/api/';

	var canvas = $('#projectadmin');
	var scenarioid = $('#projectadmin').attr('title');

	var scenario = Object();
	var scenarioitems = Array();

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

});
