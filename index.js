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
    pattern         = new RegExp(container + '(.*)'),
    commentTypeMap  = {};

    console.log(container);
console.log(pattern);

var _init = function(){
    var commentType;

    for(var i in config.commentTypes){
        commentType = config.commentTypes[i];

        commentTypeMap[commentType] = [];
    }


};

// [[TODO]] Implement this TODO
var _extract = function(filePath, contents){
    var lines = contents.split(patterns.newline),
        line,
        //description,
        matches,
        match,
        type,
        fileContent = {};

    //console.log(extracting);

    for(var lineNumber in lines){
        line = lines[lineNumber];

        if(pattern.test(line)){
            matches = line.match(pattern);
            match = matches[2].trim();
            type = matches[1];

            if(!fileContent[type]){
                fileContent[type] = [];
            }

            fileContent[type].push({ lineNumber: lineNumber+1, line: match });
        }
    }
    console.log(fileContent);
    for(type in fileContent){
        commentTypeMap[type].push({ file: filePath, list: fileContent[type]});
    }
};

_init();
walkfs('./src')
    .on('file', function(entry){
        var filePath    = entry.path,
            extension   = path.extname(filePath),
            fileContents;

        if(extension !== '.js'){
            return;
        }

        fileContents = fs.readFileSync(filePath, 'utf-8');
        _extract(filePath, fileContents);
    })
    .on('end', function(){
        var templateData = { data: [] };


        for(var type in commentTypeMap){
            templateData.data.push({ type: type, content: commentTypeMap[type] });
        }

        _prepareTemplate(templateData);
    });

//  [[NOTE]] Template Data Sample: { data: [ { type: 'NOTE', content: [ {file: 'file1.js', list: [ 'one', 'two'] }] }, { type: 'WARN', content: [ {file: 'file2.js', list: [ 'one', 'two'] }] }] }
var _prepareTemplate = function(templateData){
    fs.readFile('dist/templates/comments.js', 'utf-8', function(err, compiledTemplate){
        //console.log(compiledTemplate);
        dust.loadSource(compiledTemplate);
        dust.render('comments', templateData, function(err, out){
            fs.writeFile('dist/output/notes.html', out, function(err){
                if(err){
                    throw err;
                }

                console.log(out);
            });
        });
    });
};

module.exports = function(){

    walkfs('/test')
        .on('file', function(entry){
            console.log(entry.path);
        });
};