const socket=io();

const divChat = document.querySelector('#chat');
const porcentaje = document.querySelector('#porcentaje');
const boton = document.querySelector('#enviar');
const respuesta = document.querySelector('#warning');
const btnGuardar= document.querySelector('#guardar');
const body = document.querySelector('#table-body');

boton.addEventListener("click",(event)=>{
    respuesta.innerHTML=" ";
    const email = document.querySelector('#email').value;
    const nombre = document.querySelector('#nombre').value;
    const apellido = document.querySelector('#apellido').value;
    const edad = document.querySelector('#edad').value;
    const alias = document.querySelector('#alias').value;
    const avatar = document.querySelector('#avatar').value;
    if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
        const mensaje = document.querySelector('#texto').value;
        const message = {
            autor: {
                email: email,
                nombre: nombre,
                apellido: apellido,
                edad: edad,
                alias: alias,
                avatar: avatar,
            },
            texto: mensaje,
            timestamp: new Date().toLocaleString(),
        };
        socket.emit('newMessage',message)
    } else {
        respuesta.innerHTML="Debe ingresar un mail";
    } 
})

btnGuardar.addEventListener("click",(event)=>{
    const title = document.querySelector('#title').value;
    const price = document.querySelector('#price').value;
    const image = document.querySelector('#image').value;
    if (title !== '' && price !== '' && image !== '') {
        const producto ={
            "title": title,
            "price": price,
            "image": image
        }
        socket.emit('product',producto)
    }

})

socket.on('messages',(messages)=>{
    if (messages == null){
        divChat.innerHTML= " ";
    } else {
        divChat.innerHTML=messages.map(message=>{
            return(
                `<div>
                <span style="color:blue; font-weight: bold;">${message.autor.email}</span>
                <span style="color:brown">${message.timestamp}</span>
                <span style="color:green; font-style: italic;">${message.texto}</span>
                <img class="table-img" style="width:30px" src="${message.autor.avatar}" alt="Imagen no encontrada">
                </div>
                `
            )
        }).join(" ")
    }
})

socket.on('newMessages',(messages)=>{
    divChat.innerHTML = messages.map(message=>{
        return(
            `<div>
            <span style="color:blue; font-weight: bold;">${message.autor.email}</span>
            <span style="color:brown">${message.timestamp}</span>
            <span style="color:green; font-style: italic;">${message.texto}</span>
            <img class="table-img" style="width:30px" src="${message.autor.avatar}" alt="Imagen no encontrada">
            </div>
            `
        )
    }).join(" ")
})

socket.on('newProduct',(products)=>{
    body.innerHTML = " ";
    if (products == null){
        body.innerHTML = " ";
    } else {
        body.innerHTML = products.map(products =>{
            return(
                `<tr>
                    <td class="table-info">${products.id}</td>
                    <td class="table-info">${products.title}</td>
                    <td class="table-info">${products.price}</td>
                    <td class="table-info"><img src=${products.image} alt="No image" width="20px"/></td>
                </tr>
                `
            )
        }).join(" ")
    }
})