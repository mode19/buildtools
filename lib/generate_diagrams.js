const fs = require('fs');
var path = require('path');

String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var globalArrayOfFileNames = [];

var findRef = function( currentNodeName, obj ) {
    for(var propertyName in obj) {
        if( propertyName == "$ref" ) {
            console.log( "\"" + currentNodeName + "\"->\"" + obj[propertyName] + "\"");
        } else if( typeof obj[propertyName] === 'array' ) {
            findRef( currentNodeName, obj[propertyName] );
        } else if( typeof obj[propertyName] === 'object' ) {
            findRef( currentNodeName, obj[propertyName] );
        }
    }
};

var findProps = function( obj ) {
    for(var propertyName in obj) {
        if( propertyName == "properties" ) {
//            console.log( JSON.stringify( obj[propertyName], null, 4));
            for( var prop in obj[propertyName]) {
                var propertyObj = obj[propertyName][prop];
                console.log( addRow( prop + ":" + propertyObj.type ) );
            }
        } else if( typeof obj[propertyName] === 'array' ) {
            findProps( obj[propertyName] );
        } else if( typeof obj[propertyName] === 'object' ) {
            findProps( obj[propertyName] );
        }
    }
};

var addRow = function( str ) {
    return "<tr><td>" + str + "</td></tr>";
};

iterateJsToOutputGraph = function( testFolderDir ) {
    walk(testFolderDir, (err, files) => {
        files.forEach(file => {
            if( file.endsWith( ".ts")) {
                globalArrayOfFileNames.push( file );
            }
        });
    });
    walk(testFolderDir, (err, files) => {
        console.log( "digraph {" );
        files.forEach(fileFromWalk => {
            if( fileFromWalk.endsWith( ".ts")) {
                var fileContent = fs.readFileSync(fileFromWalk, 'utf8');

                var fileFromWalkShortName = path.parse(fileFromWalk).name;
                var fileFromWalkShortId = fileFromWalkShortName.replace( ".", "_" );

                for(var i = 0; i < globalArrayOfFileNames.length; i++ ) {
                    var fileName = path.parse(globalArrayOfFileNames[i].toLowerCase()).name;
                    fileName = fileName.replace( ".", "_" );
                    if( fileContent.toLowerCase().indexOf( fileName ) !== -1 ) {
                        console.log( fileFromWalkShortId + "->" + fileName );
                    }
                }
            }
        });
        console.log( "}" );
    });
};

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

iterateFolder = function( testFolderDir ) {
    fs.readdir(testFolderDir, (err, files) => {
        console.log( "digraph {" );
        files.forEach(file => {
            if( file.endsWith( ".json")) {
                //console.log( "processing file with .json:" + file );
                var obj = JSON.parse(fs.readFileSync(testFolder + file, 'utf8'));

                if( obj.id ) {
                    console.log("\"" + obj.id + "\" [ " );
                    console.log(" label = < <table>" );
                    console.log("<tr><td>" + obj.id + "</td></tr>" );
                    console.log("<tr><td>" +  obj.description + "</td></tr>");
                    findProps( obj );
                    console.log("</table> >");
                    console.log(" shape = record");
                    console.log("];");

                    findRef( obj.id, obj );
                }


            }
        });
        console.log( "}" );
    });
};

