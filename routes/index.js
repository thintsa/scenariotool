// home page
exports.index = function(req, res){
  res.render('index', { title: 'Luo uusi kollaasi' });
};

//login page
exports.login = function(req, res){
	var crypto = require('crypto'),
		shasum = crypto.createHash('sha1');
	shasum.update(req.body.password);
	var digest = shasum.digest('hex');
	res.cookie('vttcollagepw', digest, {domain:'acdccloud.vtt.fi', path: '/'});
	res.send({'digest' : digest});
};

//logout page
exports.logout = function(req, res){
	res.clearCookie('vttcollagepw', {domain:'acdccloud.vtt.fi', path: '/'});
	res.send({'status' : 'logged out'});
};

// scenario page
exports.scenario = function(req, res){
	res.render('scenario', { id: req.params.id });
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
