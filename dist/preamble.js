var packageJson = require(__dirname + "/../package.json");
var version = packageJson.version;

console.log(
    "/** \n" +
    " * Iris %s\n" +
    " *\n" +
    " * @license Copyright (c) 2012-2013 The Silvan Group\n" +
    " * For more information, see: http://github.com/silvn/iris\n" +
    " */\n", version);