'use strict';

var fs      = require('fs'),
    walkfs  = require('walkfs'),
    path    = require('path'),
    config  = require('./src/config'),
    dust    = require('dustjs-linkedin');

var patterns = {
    newline : /\r?\n/,
    describe: /describe\([\'\"]([^,]+)/,
    it: /it\([\'\"]([^,]+)/,
};

var commentTypes    = config.commentTypes.join('|'),
    container       = config.container.singleLine.begin.replace('{TYPE}', '('+ commentTypes +')'),
    pattern         = new RegExp(container + '(.*)');

console.log(container);
console.log(pattern);

var _extract = function(contents){
    var lines = contents.split(patterns.newline),
        line,
        //description,
        matches,
        match,
        type;

    for(var lineNumber in lines){
        line = lines[lineNumber];

        if(pattern.test(line)){
            matches = line.match(pattern);
            match = matches[2];
            type = matches[1];

            console.log(type + " -> " + match);
        }
    }


};



walkfs('./test')
    .on('file', function(entry){
        var filePath    = entry.path,
            extension   = path.extname(filePath),
            fileContents;

        if(extension !== '.js'){
            return;
        }

        fileContents = fs.readFileSync(filePath, 'utf-8');
        _extract(fileContents);
    });

fs.readFile('dist/templates/comments.js', 'utf-8', function(err, compiledTemplate){
    //console.log(compiledTemplate);
    dust.loadSource(compiledTemplate);
    dust.render('comments', { data: [ { type: 'NOTE', content: [ {file: 'file1.js', list: [ 'one', 'two'] }] }, { type: 'WARN', content: [ {file: 'file2.js', list: [ 'one', 'two'] }] }] }, function(err, out){
        fs.writeFile('dist/output/notes.html', out, function(err){
            if(err){
                throw err;
            }

            console.log(out);
        });
    });
});

module.exports = function(){

    walkfs('/test')
        .on('file', function(entry){
            console.log(entry.path);
        });
};