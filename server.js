const express = require('express');
const {Server: ioServer} = require('socket.io');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const io = new ioServer(httpServer);

const {options} = require('./configDB.js')
const contenedorProd = require('./contenedorProd.js');
//const contenedorChat = require('./contenedorChat.js');
const content = new contenedorProd(options.mariaDB,'productos');
//const chat = new contenedorChat(options.sqlite,'usuarios')


const contMsj = require('./newChatCont.js');
const esqMsj = require('./dao/msjShema.js');
const chat = new contMsj('mensajes', esqMsj);
const ProdMock = require('./mocks/prodMock.js');

app.use(express.static(__dirname +"/public"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('views','./views');
app.set('view engine', 'ejs');

const { normalize, schema } = require('normalizr');
const { inspect } = require("util");

function normal(obj){
    const autorSchema = new schema.Entity('autor',{},{idAttribute:'email'});
    const textoSchema = new schema.Entity('texto',{autor:autorSchema},{idAttribute:'_id'});
    const conjuntoSchema = new schema.Entity('textos',{textos: [textoSchema]});
    const datosBrutos = { id: "textos", textos: [obj] };
    const final = normalize(conjuntoSchema,datosBrutos)
    return final
}


app.get('/',async(req,res)=>{
    let products = await content.getAll();
    if (products != null){
        res.render('index.ejs',{products})
    } else {
        products = [];
        res.render('index.ejs',{products})
    }
})

app.post('/productos',async(req,res)=>{
    res.redirect('/')
})

app.get('/api/productos-test',async(req,res)=>{
    const pMocker = new ProdMock(5);
    const productos = pMocker.randomProducts();
    res.render('test.ejs',{productos}) 
})

io.on('connection',async(socket)=>{
    console.log('Cliente conectado',socket.id);
    
    const mensajes = await chat.getAll();
    let data = normal(mensajes)
    console.log("Datos Iniciales", JSON.stringify(mensajes).length);
    console.log("Datos normalizados", JSON.stringify(data).length);
    //console.log("DATA NORMALIZADA", inspect(data, false, 12, true));
    socket.emit('messages', mensajes)

    socket.on('newMessage', async(message)=>{
        await chat.save(message);
        const mensajes = await chat.getAll();
        io.sockets.emit('newMessages', mensajes)
    })
    socket.on('product', async(data)=>{
        await content.save(data);
        const products = await content.getAll();
        io.sockets.emit('newProduct', products)
    })
})

const PORT=8080;
httpServer.listen(PORT,()=>{
    console.log(`Servidor escuchando puerto ${PORT}`);
});

