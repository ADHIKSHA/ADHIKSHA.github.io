var fs= require("fs");

var JavaScriptObfuscator = require('javascript-obfuscator');

fs.readFile('./script.js',"UTF-8",function(err,data){
if(err){
	throw err;
}

var obfuscationResult = JavaScriptObfuscator.obfuscate(data);

fs.writeFile('./sc-obs.js',obfuscationResult.getObfuscatedCode() ,function(err){
	if(err){
		return console.log(err);
	}
	console.log("The file was saved!");
});
});