const fs = require("fs")
const path = require("path")

let file_types = [".js"];
let max_depth = 1;
let output_format = [];
let root = "./";

let final_result = {
    file_name: 0,
    lines_of_code : 0
};

let final_results = [];
let output_file_name = "result"; 

function read_config_file()
{
    const result = fs.readFileSync(path.join("./","config.json"), "utf-8");
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

        output_file_name = output_file_name  + output_format;

        root = config_obj['root'];
        console.log("File type= " + file_types + " max depth= " + max_depth + " output format=" + output_format + " root=" + root);
    }
}

function read_single_file(file_path)
{
    /*if(file_path == ".gitignore" || file_path== ".vscode") 
        {
            return;
        }
    */
    if(fs.lstatSync(file_path).isDirectory()) 
    {
        //console.log("file path " + file_path + " is directory, will skip it.");
        return;
    }
    if(!file_types.includes(path.extname(file_path))) // extension is not required
        {
            //console.log("The file extension " + path.extname(file_path) + " is not required.");
            return;
        }
    const result = fs.readFileSync(file_path, "utf-8");
    //console.log("|----------------------------------------------|------------------------------|");
    if(result)
    {
        let out=[];
        out = result.split("\n");
        final_result = {};
        final_result.file_name = file_path;
        final_result.lines_of_code = out.length;
        final_results.push(final_result);
        //console.log("|" + file_path + "\t\t\t\b|\t\t" +out.length+"\t\t\b\b|");
    }
    else 
    {
        console.log("no result");
    } 
}

function start_script()
{
    read_config_file();
    const file_list = fs.readdirSync(root);
    if(!file_list) 
    {
        console.log("nothing found at " + root);
        return;
    }
    else
    {
        //console.log(file_list);
    }
    //console.log("|----------------------------------------------|------------------------------|");
    file_list.forEach(element => {
        read_single_file(root + element);
    });
    const output_file = fs.writeFileSync(path.join("./", output_file_name), JSON.stringify(final_results));
    if (output_file)
    {
        console.log("File could not be written, Please try again.");
    }
    else 
    {
        console.log("File written successfully.");
    }
    //console.log(final_results);
    //console.log("|----------------------------------------------|------------------------------|");
    //read_single_file();
    
}

start_script();