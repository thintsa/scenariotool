$(document).ready(function(){
	var collages = [];
	$.getJSON('http://acdccloud.vtt.fi/collageapi/api/collages', function(data) {
		$.each(data, function (key, val) {
			collages.push(val.id);
		});
	});

	$('#createcollage').submit(function (event) {
		event.preventDefault();

		var api_base = 'http://acdccloud.vtt.fi/collageapi/api/';

		var collagename = $('#collagename').val();

		if ($.inArray(collagename, collages) < 0) {
			var data = {
				path: '/collage/' + collagename,
				password: $('#collagepassword').val()
			};
			$.post(collagename + '/logincookie', data, function(response) {
				var collage = {
					id : collagename,
					title : '',
					description : '',
					password : response.digest
				};
				$.post(api_base + 'collages/', collage, function() {
					window.location.href = 'http://acdccloud.vtt.fi/collage/' + collagename;
				});
			});
		} else {
			alert('Kollaasi nimellä ' + collagename + ' on jo olemassa.');
		}
	});
});
