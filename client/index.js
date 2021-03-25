/*
   "node index.js  --username JV --room sala001 --hostUri localhost"

*/
import TerminalController from "./src/terminalController.js"; //extenção .js é obrigatoria
import Events from 'events'; //classe nativa do NodeJS para gestão de eventos 
import CliConfig from "./src/cliConfig.js";
import SocketClient from "./src/socket.js";


const [nodePath, filePath, ...commands] = process.argv;

const config = CliConfig.parseArguments(commands);

const componentEmiiter = new Events(); //Instancia da classe events (nativo)
const socketClient = new SocketClient(config)
await socketClient.initialize();
/*
const controller = new TerminalController(); //Instanciamento da classe TerminalController (desenvolvido) 
await controller.initializeTable(componentEmiiter); */