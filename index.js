const fs = require('fs');

const { modelSnippets, indexSnippets, endpointsSnipptes } = require('./code-snipets');
const config = require("./config.json");

// MARK - accessory methods

const getFileNameArguments = () => {
	return process.argv.slice(2);
}

const mkdirSyncRecursive = (directory) => {
	var path = directory.replace(/\/$/, '').split('/');
	for (var i = 1; i <= path.length; i++) {
		var segment = path.slice(0, i).join('/');
		segment.length > 0 && !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
	}
};

const writeJsFile = (directory, fileName, content) => {
	try {
		mkdirSyncRecursive(directory)

		fs.writeFile(
			directory + `${fileName}`,
			content,
			function (err) {
				if (err) console.log("Error: ", err);
				else console.log(`${fileName} File constructed successfully!`);
			}
		);

	} catch (err) {
		console.error(err)
	}
}

const getOutputFileDir = (input) => {
	const path = config.absolute_project_path && input.directory ?
		`${config.absolute_project_path}${input.directory}${input.model.toLowerCase()}/` :
		`${__dirname}/apis/${input.model.toLowerCase()}/`
	console.log(`Directory: ${path}`);
	return path;
}

// MARK - object definitions

const fileNames = {
	ENDPOINTS: 'endpoints.js',
	INDEX: 'index.js',
	MODEL: '@{model}.js'
}

// MARK - model file

const getModelImports = () => {
	return modelSnippets.imports;
}

const getAPiEnpointsFilename = (filename) => {
	return filename.split('.')[0]
}

const capitalize = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const makeMethods = (input) => {
	let methods = "";
	for (let index = 0; index < input.methods.length; index++) {
		let method = modelSnippets.methods[`${input.methods[index]}`]

		switch (input.methods[index]) {
			case 'gets':
				// Set pleuralModel names
				method = method.replace('@{pleuralModel}', `${input.pleuralModel}`);

				// Set toCapPleuralModel names
				method = method.replace('@{toCapPleuralModel}', `${input.pleuralModel.toUpperCase()}`)
				break;

			default:
				// Set model names
				method = method.replace('@{model}', `${input.model}`);

				// Set toCapModel names
				method = method.replace('@{toCapModel}', `${input.model.toUpperCase()}`)
				break;
		}

		methods += (index < input.methods.length - 1) ? `${method},\n\n` : `${method}`;
	}
	return methods
}

const getApiFunctions = (inputFile) => {
	let code = modelSnippets.exports;

	// Name export
	code = code.replace('@{model}', inputFile.model);

	// Set methods
	code = code.replace('@{methdos}', makeMethods(inputFile));

	return code;
}

// MARK - endpoints file

const getEndpointsFunctions = (input) => {
	let methods = "";
	for (let index = 0; index < input.methods.length; index++) {
		let methodName = input.methods[index];
		let method = modelSnippets.methods[methodName]

		switch (methodName) {
			case 'gets':
				method = `GET_${input.pleuralModel.toUpperCase()}: apiEndpoints.${input.apiendpointsObject}.get${capitalize(input.pleuralModel)}`;
				break;

			case 'post':
				method = `	POST_${input.model.toUpperCase()}: apiEndpoints.${input.apiendpointsObject}.post${capitalize(input.pleuralModel)}`;
				break;

			default:
				let methodPrefix = `${methodName.toUpperCase()}_`
				method = `	${methodPrefix}${input.model.toUpperCase()}: id => apiEndpoints.${input.apiendpointsObject}.${methodName}${capitalize(input.pleuralModel)}(id)`;
				break;
		}

		methods += (index < input.methods.length - 1) ? `${method},\n\n` : `${method}`;
	}
	return methods
}

// MARK - command executions (generate files)

const generateEndpointsFile = (inputData) => {
	let code = `${endpointsSnipptes}`

	// Set import file
	code = code.replace('@{file}', getAPiEnpointsFilename(inputData.apiendpointsFile));

	// Set methods
	code = code.replace('@{methdos}', getEndpointsFunctions(inputData));

	const fileName = fileNames.ENDPOINTS;
	const outputDir = getOutputFileDir(inputData);
	writeJsFile(outputDir, fileName, code);
}

const generateModelFile = (inputData) => {
	const codes = `${getModelImports()}\n${getApiFunctions(inputData)}`;
	const fileName = fileNames.MODEL.replace('@{model}', inputData.model);
	const outputDir = getOutputFileDir(inputData);
	writeJsFile(outputDir, fileName, codes);
}

const generateIndexFile = (inputData) => {
	const codes = indexSnippets.replace('@{model}', inputData.model);
	const fileName = fileNames.INDEX;
	const outputDir = getOutputFileDir(inputData);
	writeJsFile(outputDir, fileName, codes);
}

const execute = () => {
	let files = getFileNameArguments();
	console.log("File names: ", files);

	if (files != null && files.length > 0) {
		files.forEach(file => {
			let inputFile = require(`./${file}`);

			console.log("constructing for Model:");
			console.log(inputFile);

			// Generate endpoints file
			generateEndpointsFile(inputFile);

			// Generate model file
			generateModelFile(inputFile);

			// Genereate index file
			generateIndexFile(inputFile);
		});
	}
	else throw new Error("No source files specified. please provide one or more .txt source files seperated by empty space.");
}

execute();
