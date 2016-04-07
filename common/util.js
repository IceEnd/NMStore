/**
 * Common
 */
var Q = require('q');
var fs = require('fs');
var formidable = require("formidable");

/**
 * 上传文件
 */
function uploadImg(req, res, next, date, str) {
    var img_url = [];
    var defer = Q.defer();
    var form = new formidable.IncomingForm();
    form.uploadDir = "./tmp/";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        if (fields.imgLength == 0) {
            defer.resolve({ "goods": fields, "img_url": img_url });
        }
        else {
            for (var i = 0; i < fields.imgLength; i++) {
                var file = files['image' + i];
                var fName = date.getTime() + '' + req.cookies.user_id + 'img' + i;
                switch (file.type) {
                    case "image/jpeg": fName += '.jpg';
                        break;
                    case "image/png": fName += '.png';
                        break;
                    default: fName += '.gif';
                        break;
                }
                fs.renameSync(file.path, str + '/' + fName);
                img_url.push('/upload/' + date.getFullYear() + '/' + date.getMonth() + '/' + fName);
                if (i == (fields.imgLength - 1)) {
                    defer.resolve({ "goods": fields, "img_url": img_url });
                }
            }
        }
    });
    return defer.promise;
}


/**
 * 创建目录
 */
function mkdirUpload(str) {
    var defer = Q.defer();
    fs.exists(str, function(exists) {
        if (!exists) {
            fs.mkdir(str, 0777, function(err) {
                if (err) {
                    console.log(err);
                    defer.resolve(false);
                }
                else {
                    defer.resolve(true);
                }
            })
        }
        else {
            defer.resolve(true);
        }
    });
    return defer.promise;
}

module.exports = {
    uploadImg: uploadImg,
    mkdirUpload: mkdirUpload,
}