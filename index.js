const fs = require("fs")

let file_types = [".js"];

function start_file()
{
    const result = fs.readFileSync("index.js", "utf-8");
    if(result)
        {
            let out=[];
            out = result.split("\n");
            console.log(out.length);
        }
        else 
        {
            console.log("no result");
        }
}

start_file();