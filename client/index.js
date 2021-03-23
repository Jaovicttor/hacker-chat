import TerminalController from "./src/terminalController.js"; //extenção .js é obrigatoria
import Events from 'events'; //classe nativa do NodeJS para gestão de eventos 

const componentEmiiter = new Events(); //Instancia da classe events (nativo)

const controller = new TerminalController(); //Instanciamento da classe TerminalController (desenvolvido) 
await controller.initializeTable(componentEmiiter); 