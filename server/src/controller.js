import { constants } from "./constants.js";

export default class Controller{
    #users = new Map();  //todos os usuarios que estão logados no sistema
    #rooms = new Map();  //todas as salas que estão funcionando no sistema
    constructor({socketServer}){
        this.socketServer = socketServer
    }

    onNewConnection(socket){
        const {id} = socket;
        console.log('connection stablished with', id);
        const userData = {id, socket};
        this.#updateGlobalUserData(id, userData);

        socket.on('data', this.#onSocketData(id));
        socket.on('close', this.#onSocketClose(id));
        socket.on('error', this.#onSocketClose(id));
    }

    #onSocketData(id){
        return data =>{
            try{

                const {event, message} = JSON.parse(data);
                this[event](id, message) ;

            } catch (err){
                console.error(`Wrong event formart!!`,err, data.toString())
            }
          
        }
    }

    #onSocketClose(id){
        return data =>{
            console.log('onSocketClose', id)
        }
    }


    //data = dados do usuario que pretende acessar a sala
    async joinRoom(socketId, data){
        const userData = data;
        console.log(`${userData.userName} joined! ${socketId} `);
        const { roomId } = userData;
        const user = this.#updateGlobalUserData(socketId, userData);
        const users = this.#joinUserOnRoom(roomId,user);


        const currentUsers = Array.from(users.values())
            .map(({id, userName})=> ({userName, id}))


        //atualiza a lista de usuarios conectados na sala
        this.socketServer.
            sendMessage(user.socket, constants.event.UPDATE_USERS, currentUsers)
        

            //avisa a rede que um novo usuario conectou

            this.broadCast({
                socketId,
                roomId,
                message: {id: socketId, userName: userData.userName },
                event: constants.event.NEW_USER_CONNECTED,
            })
        

    }

    //função para inicializar o usuario na sala
    #joinUserOnRoom(roomId, user){
        const usersOnRoom = this.#rooms.get(roomId) ?? new Map();  //verifica se ja existe algum usuario logado naquela sala, caso exista retorna a lista de usuarios, caso não exista retorna uma instancia map
        usersOnRoom.set(user.id, user); //configura o usuario que está tentando logar na lista de usuarios da sala informada
        this.#rooms.set(roomId, usersOnRoom);  //adiciona o usuario a lista de usuarios da sala
 
        return usersOnRoom; //retorna uma lista com todos os usuarios na sala
    }

    broadCast({socketId, roomId, event, message, includeCurrentSocket = false}){

        const usersOnRoom = this.#rooms.get(roomId);

        for(const [key, user] of usersOnRoom) {

            if(!includeCurrentSocket && key === socketId) continue;

            this.socketServer.sendMessage(user.socket, event, message);
        }
        
    }

   

    #updateGlobalUserData(socketId, userData){
        const users = this.#users;
        const user = users.get(socketId) ?? {}

        const updateUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updateUserData);

        return users.get(socketId)
    }
}