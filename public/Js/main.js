// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, onValue, onChildAdded, onChildChanged, onChildRemoved, query, orderByChild, limitToFirst, limitToLast, startAt, set, push,   } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
//firebase auth se importa para pdoer hacer autenticacion con google
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVTAj6KV8fAChytAKHmZMXHBIkz_Rdp_I",
  authDomain: "truchat-78eb7.firebaseapp.com",
  databaseURL: "https://truchat-78eb7-default-rtdb.firebaseio.com",
  projectId: "truchat-78eb7",
  storageBucket: "truchat-78eb7.appspot.com",
  messagingSenderId: "884127202196",
  appId: "1:884127202196:web:5ccb24ddd58b4ab9cfed81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase()
//REFERENCIAS
const refTextos = ref(db, "textos/")
const refMensajes = ref(db, "Mensajes/")
//QUERYS
const queryMSGbyChild = query(refMensajes, orderByChild("fecha/"))       /*Ordena los mensajes segun su fecha*/
const querylimitToFirst = query(refMensajes, limitToLast(2))
let titulo = document.getElementById("tituloNeon")
let titulo2 = document.getElementById("tituloNeon2")
let span = document.getElementsByTagName("span")
let descripcion = document.getElementById("descripcion")
let chat = document.getElementById("chat")
let nombre = document.getElementById("nombre")
let mensaje = document.getElementById("mensaje")
let nombreUsuario = document.getElementById("nombreUsuario")
let chatAction = document.getElementById("chatAction")
let logGoo = document.getElementById("logGoo")
let cajaChat = document.getElementById("cajaChat")
let lista = document.getElementsByClassName('list-group-item')
let pp = document.getElementById("pp").addEventListener("click", ()=>{
  traemeData();
})

//titulo con efecto maquina de escribir
let typed = new Typed('.neon-title', {

strings: ['TRUCHAT', 'TRUCHAT', 'TRUCHAT', 'TRUCHAT', ],



stringElements: '#tituloNeon',
  typeSpeed: 100, //velocidad en milisegundos para poner una letra
  loop: true, // repite el array
  loopCount: false, // cantidad de veces a repetir el array, false = infinito
  startDelay: 0, // tiempo de retraso en iniciar la animacion
  backSpeed: 200, // velocidad en ms para borrar una letra
  smartBlackspace: true, //elimina solo las palabras que sean nuevas en el campo de texto
  shuffle: true, // Altera el orden en el que escribe las palabras
  backDelay: 0, // tiempo de espera despues de que termina de escibir una palabra
  showCursor: true, // muestra el cursor palpitando
  cursorChar: '',  // caracter para el cursor
  contentType: 'html' // 
});




//typed apagado

function typedOff() {
  
  let typed = new Typed('.neon-title', {

   strings: ['TRUCHAT', 'TRUCHAT', 'TRUCHAT', 'TRUCHAT', ],
    
    
    
    stringElements: '#tituloNeon',
      typeSpeed: 100, //velocidad en milisegundos para poner una letra
      loop: true, // repite el array
      loopCount: false, // cantidad de veces a repetir el array, false = infinito
      startDelay: 0, // tiempo de retraso en iniciar la animacion
      backSpeed: 200, // velocidad en ms para borrar una letra
      smartBlackspace: true, //elimina solo las palabras que sean nuevas en el campo de texto
      shuffle: true, // Altera el orden en el que escribe las palabras
      backDelay: 0, // tiempo de espera despues de que termina de escibir una palabra
      showCursor: true, // muestra el cursor palpitando
      cursorChar: '',  // caracter para el cursor
      contentType: 'html', // 
    });
}










//let traemeData = ()=>{

  //Se ejecuta siempre y trae toda la informacion
onValue(refTextos, (snap) => {
let data = snap.val();
console.log("onValue:", data);
// titulo.innerHTML = data.titulo;
descripcion.innerHTML = data.descripcion;
});  


 //Para agregar el mensaje al chat:
 const agregarMSG = (msg) => {
    let li_ = document.createElement("li")
    li_.classList.add("list-group-item")
    let txt = document.createTextNode( msg.author + ": " + msg.mensaje)
    // Adentro del LI agregamos txt 
    li_.appendChild(txt)
    li_.setAttribute("id", msg.fecha)
    chat.appendChild(li_)
    
    //permite que el scroll se mantenga hacia abajo cuando se envia un nuevo mensaje
    document.getElementById(msg.fecha).scrollIntoView ({ block: "end", behavior: "smooth" })

  }  



  onChildAdded(queryMSGbyChild, (snap) => {
    let data = snap.val();
    let key = snap.key;
    agregarMSG(data)
    //console.log( key, "queryMSGbyChild: ", data)

  
  });
  // Funcion que permite enviar el mensaje cuado se apreta enter
  let clicks = document.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("pp").click();
    }
  })


  const traemeData = () => {
    
    let fecha = Date.now();                         /*Date.now nos da la fecha del mensaje*/
    let msg = {
      author: nombreUsuario.value,
      mensaje: mensaje.value,
      fecha: fecha, 
    }

    

    


    if (mensaje.value != ""){
        //el push es otra manera de guardar datos
      push(refMensajes, msg)
      mensaje.value = "";
       console.log(msg)
   
  } 
  else {
    alert("Escribí algo, no hagas trampa")
  }


    /*El set guarda la nueva informacion dentro de la base de datos ej:
    set(refMensajes, { msg })*/
 }

 const auth = getAuth()



//cuando  el usuario hace click en registrarse se valida el registro y se muestra la descripcion
 let loginG = document.getElementById("loginG").addEventListener('click', () => {
      LoguearUsuario()
      mostrarDescripcion()
      tituloOff()
      tituloOn()
   
    })

    // Si el usuario no s registró la descripcion no se muestra
    function mostrarDescripcion(){
      descripcion.style.display = "block"
    }


    function tituloOff(){
      titulo.style.display = "none"
    }

    function tituloOn(){
      titulo2.style.display = "block"
    }

 const LoguearUsuario = ()=>{
      auth.languageCode = "es"
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider).then((result)=>{
        let logUser = {
          uid: result.user.uid,
          username: result.user.displayName,
          profile_picture: result.user.photoURL,
          email: result.user.email
        }


        nombreUsuario.value = result.user.displayName
         chatAction.style.display = "block"
        logGoo.style.display = "none"
        descripcion.style.display = "block"
       
      
        console.log("logueado: ", logUser)
      })

      if({LoguearUsuario} === true){
      mostrarDescripcion()
    }

//condicional que hace que si no está logueado el chat no se muestre
        if ( loginG === false ) {
        document.getElementById('descripcion').style.display = "none"
    }
     else{
      null
     }


     const desloguear = () => {
        signOut(auth).then(()=>{
          nombreUsuario.value = ""
           chatAction.style.display = "none"
          logGoo.style.display = "flex"
        })
      }
      //Si el usuario ya está logueado lo deja cargado
        onAuthStateChanged(auth, (user)=>{
          if(user){
            nombreUsuario.value = user.displayName
           chatAction.style.display = "block"
          logGoo.style.display = "none"
          descripcion.style.display = "block"
          
          } else{
            null;
          }
        })
  
        let cerrarSesion = document.getElementById("cerrarSesion").addEventListener('click', ()=>{
          desloguear()
          pantallaSalida()
        })  
  
        function pantallaSalida(){
          descripcion.style.display = "none"
  
        }}