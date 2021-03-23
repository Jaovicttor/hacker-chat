import ComponentsBuilder from "./components.js";
import { constants } from "./constantes.js";




export default class TerminalController {
    #usersColors = new Map();
    constructor(){ }


    #pickColor(){
        return `#`+ ((1 << 24) * Math.random() | 0).toString(16)+`-fg`
    }

    #getUserColor(userName){
        if(this.#usersColors.has(userName)){
            return this.#usersColors.get(userName);
        }

        const color = this.#pickColor();
        this.#usersColors.set(userName, color);

        return color;
    }

    #onInputReceived(eventEmitter){
        return function () {
            const message = this.getValue();
            console.log(message )
            this.clearValue();
        }
    }

    #onMessageReceived({screen , chat}){
        return msg => {
            const { userName, message} = msg;
            const color = this.#getUserColor(userName)
            chat.addItem(`{${color}}{bold}${userName}{/} : ${message}`);
            screen.render();
        }
    }

    #onLogChanged({screen, activityLog}){
        return msg => {
            const [userName] = msg.split(/\s/);
            const color = this.#getUserColor(userName);
            activityLog.addItem(`{${color}} {bold} ${msg.toString()}{/}`)
            screen.render();
        }
    }

    #onStatusChanged({screen, status}){
        return users => {

            //pegando o primeiro item do status, que nesse caso é o titulo 
            const { content } = status.items.shift();

            status.clearItems(); //limpando todos os intem da lista status

            status.addItem(content); //adicionando o titulo de volta ao status

            users.forEach(userName=>{
                const color = this.#getUserColor(userName);
                status.addItem(`{${color}}{bold}${userName}{/}`);
            })

            screen.render();
        }
    }

    #registerEvents(eventEmitter,components){
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }
    
    //eventEmitter -> gerenciador dos eventos do JS
    async initializeTable(eventEmitter){
        const components = new ComponentsBuilder()
            .setScreem({title: 'HackerChat - Q1013_'})
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        /* registrando os eventos para que quando o eventEmitter receber os eventos de mensagem recebida ele chame a função 
        para colocar a mensagem no chat e em seguida renderizar a nova tela */
        this.#registerEvents(eventEmitter, components)



        components.input.focus() //fazer que o sistema ja inicialize com o foco no input
        components.screen.render()// rendereiza a tela


    
    }   
}

//ComponentsBuilder