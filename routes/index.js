// home page
exports.index = function(req, res){
  res.render('index');
};

// scenario page
exports.scenario = function(req, res){
	res.render('scenario', { projectid: req.params.projectid, scenarioid: req.params.scenarioid });
};

// admin page
exports.admin = function(req, res){
	res.render('admin', { projectid: req.params.projectid });
};

// überadmin page
exports.uberadmin = function(req, res){
	res.render('uberadmin');
};

// image upload
exports.imgupload = function(req, res){
	var fs = require('fs'),
		im = require('imagemagick');

	var realpath = '/home/thtimo/scenario/scenario/public/scenario/img/upload/';
	var webpath = '/scenario/img/upload/';

	var filename = req.files.collagepicture.path;
	filename = filename.substring(filename.lastIndexOf('/') + 1);
	var thumbfilename = filename + '_thumb_' + req.files.collagepicture.name;
	filename = filename + '_' + req.files.collagepicture.name;

	fs.renameSync(req.files.collagepicture.path, realpath + filename);

	// create thumbnail
	var im_options = {
		srcPath : realpath + filename,
		dstPath : realpath + thumbfilename,
		width : 300,
		height : 300
	};

	im.resize(im_options, function(err, stdout, stderr){
		if (err) {
			console.log(err);
			throw err;
		}
	});

	var output = {
		filename:  webpath + filename,
		thumbfilename: webpath + thumbfilename
	};

	// delay to ensure the thumbnail image is written to disk
	setTimeout(function () {
		res.send(JSON.stringify(output));
	}, 500);
};

// get image
exports.getimage = function(req, res){
	var exec = require('execSync');

	var outputfile = '/home/thtimo/scenario/scenario/public/scenario/img/generated/' + req.params.id + '.jpg';
	var url = 'http://acdccloud.vtt.fi/scenario/' + req.params.id;

	var code = exec.code('/usr/local/bin/wkhtmltoimage-amd64 -f jpg ' + url + ' ' + outputfile);

	var image = fs.readFileSync(outputfile);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(image, 'binary');
};
