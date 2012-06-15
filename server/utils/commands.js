    var h = require('./stat_print.js');
    var app = require('../main.js');
    var cons = require('./console.js');
    var fs = require('fs');
    exports.parseInput = function(inp){
                var t = inp.substring(0,inp.length-2);
                switch(t)
                {
                    case "exit":
                    case "e":
                        cons.alert("Exiting the server...");
                        setCont(false);
                    break;
                    case "sprint":
                    case "statprint":
                    case "stat":
                    case "stat print":
                        h.statPrint();
                    break;
                    case "test":
                        
                    break;
                    case "restart":
                    case "r":
                        cons.alert("Restarting the server...");
                        setCont(true);
                    break;
                    default:
                        cons.error("'"+t+"' is an unrecognized command.");
                    break;
                }
        };
    function setCont(restart){
        if(restart)
        fs.writeFile("./cont.ctr", "1", function(){process.exit(1);});
        else
        fs.writeFile("./cont.ctr", "0", function(){process.exit(1);});
    }
    exports.start = function(){
        fs.writeFile("./cont.ctr", "2", function(){});
    };