# proy-integrador-backend-CH

Este es el proyecto final del curso de backend de Coderhouse. Vamos a crear una tienda online.

Entrega coderhouse desafio final pre entrega 02

Seguir esta estructura:

En la carpeta Raiz del proyecto (SRC) vas a tener 2 archivos principales Uno va a ser el IndexJS y el otro va a ser ConnectionJS En el IndexJS vas a tener lo que hablamos siempre Despues vas a tener
tu archivo ConnectionJS que va a tener la estructura de la conexion a la base de datos

Esos 2 archivos van a ser los que van a arrancar la App. Despues vas a tener las siguientes carpetas:

        Routes
        Controllers
        Models
        Auth
        Frontend / Views

Si queres podes agregar una carpeta mas que se llame "Database" y sacar el archivo ConnectionJS (es a gusto tuyo eso)

        En Routes vas a tener las rutas definidas asi, mira:
        router.get('/', ControllerGET)
        router.post('/', ControllerPOST)
        router.put('/', ControllerPUT)
        router.delete('/', ControllerDELETE)

        Obvio seria un controlador para manejar las rutas de autentificacion, otro para manejar las rutas de los productos, etc

        O sea que adentro de la carpeta Routes vas a tener otras carpetas que sean, por ejemplo, Users , Products , etc

En Controllers vas a tener esas funciones que definimos en Routes, que serian los manejadores

En la carpeta Models vas a tener los modelos de Mongoose

export const reg_save = () => {...} export const si_view = () => {...} export const si_save = () => {...} 12:39 Y en las rutas lo importas asi: 12:39 import { reg_save, si_view, si_save } = require()

----------------------------LOCALSTORAGE

        Para manejar el localStorage puedo usar lo siguiente:
        localstorage.names = JSON.stringify(names); //para guardar
        const storedNames = JSON.parse(localStorage.names); //para leer
