# proy-integrador-backend-CH

Este es el proyecto final del curso de backend de Coderhouse. Vamos a crear una tienda online.

Desafio 15. Deberás entregar el estado de avance de tu aplicación eCommerce Backend, que implemente un servidor de aplicación basado en la plataforma Node.js y el middleware express. El servidor
implementará dos conjuntos de rutas agrupadas en routers, uno con la url base '/productos' y el otro con '/carrito'. El puerto de escucha será el 8080 para desarrollo y process.env.PORT para
producción en glitch.com

    >>Aspectos a incluir en el entregable:
            1.  El router base '/productos' implementará cuatro rutas:
                '/listar/:id?' : Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
                '/agregar' : Para incorporar productos al listado (disponible para administradores)
                '/actualizar/:id' : Actualiza un producto por su id (disponible para administradores)
                '/borrar/:id' : Borra un producto por su id (disponible para administradores)
            2.  El router base '/carrito' implementará tres rutas:
                a.    '/listar/:id?' : Me permite listar todos los productos guardados en el carrito ó un producto por su id de carrito (disponible para usuarios y administradores)
                b.    '/agregar/:id_producto' : Para incorporar productos al carrito por su id de producto (disponible para usuarios y administradores)
                c.    '/borrar/:id' : Eliminar un producto del carrito por su id de carrito (disponible para usuarios y administradores)
            3.    Crear una variable booleana administrador, cuyo valor configuraremos más adelante con el sistema  de login. Según  su valor (true ó false) me permitirá alcanzar o no las rutas indicadas. En el caso de recibir un request a una ruta no permitida por el perfil, devolver un objeto de error. Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada}
            4.  Un producto dispondrá de los siguientes campos:  id, timestamp, nombre, descripcion, código, foto (url), precio, stock.
            5.  El carrito de compras tendrá la siguiente estructura:
                id, timestamp(carrito), producto: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
            6.  El timestamp puede implementarse con Date.now()
    7.  Comenzar a trabajar con el listado de productos y el carrito de compras en memoria del servidor, luego  persistirlos en el filesystem.

    >> A tener en cuenta: 1. Para realizar la prueba de funcionalidad hay dos opciones:
    a. Probar con postman cada uno de los endpoints (productos y carrito) y su operación en conjunto.
    b. Realizar una aplicación frontend sencilla, utilizando HTML/CSS/JS ó algún framework de preferencia, que represente el listado de productos en forma de cards. En cada card figuran los datos del producto, que, en el caso de ser administradores, podremos editar su información. Para este último caso incorporar los botones actualizar y eliminar. También tendremos un formulario de ingreso de productos nuevos con los campos correspondientes y un botón enviar. Asimismo, construir la vista del carrito donde se podrán ver los productos agregados e incorporar productos a comprar por su id de producto. 2. Esta aplicación de frontend debe enviar los requests get, post, put y delete al servidor utilizando fetch y debe estar ofrecida en su espacio público. En el caso de requerir una ruta no implementada en el servidor, este debe contestar un objeto de error: ej { error : -2, descripcion: ruta 'x' método 'y' no implementada} 3. En todos los casos, el diálogo entre el frontend y el backend debe ser en formato JSON. El servidor no debe generar ninguna vista. 4. La estructura de programación será ECMAScript, separada tres en módulos básicos (router, lógica de negocio/api y persistencia ). Más adelante implementaremos el desarrollo en capas. Utilizar preferentemente clases, constructores de variables let y const y arrow function. 5. Realizar la prueba de funcionalidad completa en el ámbito local (puerto 8080) y en glitch.com

Desafio 16.

    >> Consigna: Sobre el desafío entregable de la última clase, cambiar la persistencia de los
    mensajes en el filesystem por persistencia en base de datos SQLite3.
    Agregar una capa de persistencia en la Api Rest de productos utilizando el servicio de base de
    datos MariaDB. Cumplir con todas las operaciones del CRUD: Select, Insert, Update, Delete

    >> Notas:
    - Definir una carpeta DB para almacenar la base datos SQLite3 llamada mensajes y crear por
    programa la tabla de mensajes dentro de esta base si no existe.
    - Crear la base de datos productos en MariaDB con MySQL Workbench y definir por programa la
    tabla de productos dentro de esta base si no existe.
    - Utilizar la dependencia Knex para interactuar con la base de datos

Desafio 17.

Consigna: Sobre el desafío entregable de la última clase, cambiar la persistencia de los mensajes en el filesystem por persistencia en base de datos SQLite3. Agregar una capa de persistencia en la Api
Rest de productos utilizando el servicio de base de datos MariaDB. Cumplir con todas las operaciones del CRUD: Select, Insert, Update, Delete

    >> Notas:
    - Definir una carpeta DB para almacenar la base datos SQLite3 llamada mensajes y crear por
    programa la tabla de mensajes dentro de esta base si no existe.
    - Crear la base de datos productos en MariaDB con MySQL Workbench y definir por programa la
    tabla de productos dentro de esta base si no existe.
    - Utilizar la dependencia Knex para interactuar con la base de datos

Desafio 20.

Consigna: Sobre el desafío entregable de la clase número 17, almacenar los mensajes en una base de datos MongoDB llamada ‘ecommerce’ dentro de una colección ‘mensajes’. Cambiar la capa de persistencia
de la Api Rest de productos por un servicio de base de datos MongoDB. La base de datos a utilizar será ‘ecommerce’, colección ‘productos’.

    >> Notas:
    - Utilizar la dependencia Mongoose para interactuar con la base de datos

Desafio 21.

Consigna: Deberás entregar el estado de avance de tu aplicación eCommerce Backend, agregando 7 tipos de persistencia de datos:

    1) File System (fs)
    2) MySQL/MariaDB local
    3) MySQL/MariaDB DBaaS
    4) SQLite3
    5) MongoDB Local
    6) MongoDB DBaaS
    7) Firebase

    >>Aspectos a incluir en el entregable:
       - Implementarás en cada tipo el CRUD correspondiente a los procesos anteriormente desarrollados, con persistencia en memoria.
       - La funcionalidad de persistencia para todos estos casos debe ser realizada utilizando clases con interfaz única (los nombres de los métodos comunes deben ser iguales). Cada clase representará un tipo de persistencia.
       - Incluir dentro de estos tipos la ya realizada en memoria (Tipo 0).
       - Para seleccionar el modo de persistencia operativa, crear una clase o función que actúe como 'Fábrica ó Factory': recibirá el 'número' de persistencia (1 al 7 y 0 para memoria) y devolverá el objeto correspondiente para el uso por parte del controlador o lógica de negocio en cada caso de uso (carrito o lista de productos).
       - Estas clases, llamadas DAO (Data Access Object), implementarán los métodos de conexión hacia cada base, así como los 4 métodos CRUD: Create (insert), Read (leer con o sin filtro), Update: (actualizar), Delete (borrar) y los métodos auxiliares que se consideren incorporar.
       Estas clases, llamadas DAO (Data Access Object), implementarán los métodos de conexión hacia cada base, así como los 4 métodos CRUD: Create (insert), Read (leer con o sin filtro), Update (actualizar), Delete (borrar) y los métodos auxiliares que se consideren incorporar.
       - La selección de la capa de persistencia activa se hará a través de una variable global, a la cual se le asignará una constante. El nombre de dicha constante corresponderá al tipo de persistencia y se inicializará con el número correspondiente.
       - En la vista de productos incorporar filtros mediante los cuales el cliente pueda determinar qué    información desea ver. Estos filtros responderán a los siguientes campos:
            - nombre : el nombre del producto debe coincidir exactamente
            - precio : por rango de precio

        - La información será filtrada del lado backend en la operación de lectura hacia la base.
