const fs = require("fs")

let file_types = [".js"];
let max_depth = 1;
let output_format = ".txt";
let root = "./"

function read_config_file()
{
    const result = fs.readFileSync("config.json", "utf-8");
    if(!result) 
    {
        console.log("File could not be read, will use default values.");
    }
    else 
    {
        const config_obj = JSON.parse(result);
        file_types = config_obj['file-types'];
        max_depth = config_obj['max-depth'];
        output_format = config_obj['output-format'];
        root = config_obj['root'];
        console.log("File type= " + file_types + " max depth= " + max_depth + " output format=" + output_format + " root=" + root);
    }
}

function start_file()
{
    read_config_file();
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