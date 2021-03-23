import blessed from 'blessed'; //instancia do pacote blessed para construção de interfaces na linha de comando

export default class ComponentsBuilder{
    #screen
    #layout
    #input
    #chat
    #status
    #activityLog
    constructor(){ }


    #baseComponent(){
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollboar: {
                ch: ' ',
                inverser: true
            },
            //habilita colocar cores e tags no texto
            tags: true   
        }
    }


    setScreem({title}){

        this.#screen = blessed.screen({
            smartCSR: true, // serve para fazer uns redimencionamentos na tela automatico
            title
        })
        this.#screen.key(['escape','q','C-c'], () => process.exit(0) ) //definindo comando de encerramento do sistema
        return this;
    }


    setLayoutComponent(){
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%',
        })
        return this;
    }

    setInputComponent(onEnterPressed){
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 0,
            height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535'
            }
        })

        input.key('enter', onEnterPressed);
        this.#input = input;

        return this;

    }

    setChatComponent(){
        this.#chat = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            aling: 'left',
            width:'50%',
            height: '90%',
            items: ['{bold}Messenger{/}']
        })
        return this;
    }

    setStatusComponent(){
        this.#status = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            items: ['{bold}Users on Room{/}']
        })
        return this;
    }

    setActivityLogComponent(){
        this.#activityLog = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            style: {
                fg : 'yellow'
            },
            items: ['{bold}Logs of Room{/}']
        })
        return this;
    }

    


    //constroi um objeto a partir de funções ja criadas, nesse caso, o return gera a tela do sistema
    build(){ 
        const components = { 
            screen: this.#screen,
            input: this.#input,
            chat: this.#chat,
            activityLog: this.#activityLog,
            status: this.#status
        }
        return components;
    }

}