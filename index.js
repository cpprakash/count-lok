const fs = require("fs")
const path = require("path")

let file_types = ["*"];
let max_depth = 0;
let output_format = [".json"];
let root = "./";

let arguments_arr = [];

let final_result = {
    file_name: 0,
    lines_of_code : 0
};

let valid_arguments = [
    "--root",
    "--ext",
    "--output",
    "--depth"
];

let final_results = [];
let output_file_name = "result"; 

function read_config_file()
{
    console.log("read_config_file::method called");
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
    if(file_path == "./.gitignore" || file_path== ".vscode") 
    {
            return;
    }
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
    console.log("Reading file = " + file_path);
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
    //console.log("Root = " + root + " ext=" + file_types);
    
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
    if (final_results.length == 0)
    {
        console.log("No file was read because the specified file type was not found. Please check it again.");
        return;
    }
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
/**
 * the correct pattern for argument is
 * node ./index.js --ext=[".cpp"] --root="./" --output=".json" --depth=1
 * @param {*} args 
 * @returns 
 */
function extract_arg_value(args)
{    
    //console.log(args);
    let config_obj = null;
    let val = args.split("=");
    const result = fs.readFileSync(path.join("./","config.json"), "utf-8");
    if (!result) {
        console.log("File could not be read, will use default values.");
    }
    else {
        config_obj = JSON.parse(result);
    }
    //console.log(val[0]);
    //console.log(val[1]);
    if (!valid_arguments.includes(val[0]))
    {
        console.log("Invalid/Unknown argument found " + val[0]);
        return;
    }
    if (!val[1])
    {
        console.log("No value is found for the argument " + val[0]);
        return;
    }
    if (val[0] == "--root")
    {
        console.log("Root of the script should run at =" + val[1]);
        root =  val[1];
        return;
    }
    if (val[0] == "--ext")
    {
        console.log("File extensions to run the scripts =" + val[1]);
        file_types =  val[1];
        return;
    }
    if (val[0] == "--output")
    {
        console.log("The output format for the result is =" + val[1]);
        output_format =  val[1];

        output_file_name = output_file_name  + output_format;
        return;
    }
    if (val[0] == "--depth")
    {
        console.log("Max depth to search =" + val[1]);
        max_depth =  val[1];
        return;
    }
}

process.argv.forEach(function (val, index, array) {
    arguments_arr.push(val);
});

// If no arguments have been passed, then we need to read the config file to get the parameters for this script
// if config file is also not there, then we need to define the default values for these parameters
// if arguments have been passed
// it should follow this format
// nodejs ./index.js --root=<folder where the script should start current directory is default> --file-types=[<file types to run the scripts on>] --output=[<all supported output formats>] --depth=<a number between 0-3 where 0 is default>
if (arguments_arr.length > 6)
{
    console.log("Too many arguments. Please try again.");
    return;
}
if (arguments_arr.length == 2)
{
    console.log("No additional arguments have been passed, will read the config file.");
    read_config_file();
}
else if(arguments_arr.length == 3)
{
    //parse the arguments
    extract_arg_value(arguments_arr[2]);
    
}
else if (arguments_arr.length == 4)
{

}
else if (arguments_arr.length == 5)
{

}
else if (arguments_arr.length == 6)
{
    extract_arg_value(arguments_arr[2]);
    extract_arg_value(arguments_arr[3]);
    extract_arg_value(arguments_arr[4]);
    extract_arg_value(arguments_arr[5]);
    //console.log(arguments_arr);
}
start_script();

