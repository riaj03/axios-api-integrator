
# API integration file generator

## Run the generator
1. Clone the repository
2. Go to the project
3. Update `config.json`

```
{
	// Ends with '/'
	"absolute_project_path": "absolute_project_root_directory"
}

```
4. Create `<Model>.json` files in `/input_files`

```
{
	"model": "Your model name", // e.g: Client
	"pleuralModel": "Pleural name of model", // e.g: Clients
	"methods": [ 
		"gets",
		"get",
		"put",
		"post",
		"delete"
	], // add or remove from method list as your necesity
	"directory": "output_directory_relative_to_project_root_directory",	// Ends with '/'
	"apiendpointsFile": "project_relative_dir/apiEndpoints_file",
	"apiendpointsObject": "ADMINS" // And object that exists in apiendpointsFile
}
```

5. Run this command from your terminal
```
node index.js input_files/model01.json input_files/model02.json
```
6. Chill