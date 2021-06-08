let productos;

const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const contenedorProductos = document.getElementById("contenedorProductos");

// let objFromJSON = JSON.parse(dbProdJSON);


console.log('A punto de hacer el pedido')

fetch('/tienda/lista')
.then(res => res.json())
.then(data => {
    let objFromJSON = JSON.parse(data);
    productos = objFromJSON.map((object) => {
      return new Item(
        object._id,
        object.nombre,
        object.precio,
        object.descripcion,
        object.foto,
        object.stock
        );
      })
      console.log('Prods: ')
      console.log(productos)
      dibujarLista(productos, contenedorProductos)
})


//-------------------------------------
// FORMULARIO DE BUSQUEDA
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let busqueda = searchInput.value;

  let productosBuscados = productos.filter((element) => {
    return element.producto.toLowerCase().includes(busqueda.toLowerCase());
  });

  contenedorProductos.innerHTML = "";

  dibujarLista(productosBuscados, contenedorProductos);
});

//----------------------------------------
//COMPRA PREVIA

let compraPrevia = localStorage.getItem("miCarrito");
if (compraPrevia === null) {
  miCarrito = new Carrito();
} else {
  miCarrito = new Carrito();
  let objFromStorage = JSON.parse(compraPrevia);
  for (let key in objFromStorage) {
    let cant = objFromStorage[key];

    for (let keyP of productos) {
      let i = 0;
      if (key == keyP.producto) {
        while (i < parseInt(cant)) {
          miCarrito.addProducto(keyP);
          i++;
        }
      }
    }
  }
}

//------------------------------------------
// MODAL CARRITO DE COMPRAS.

const butCart = document.querySelector("#cartIcon");
const popup = document.querySelector(".popup-wrapper");
const close = document.querySelector(".popup-close");
// const precioSivaTag = $(".precio-siva");

butCart.addEventListener("click", () => {
  $(".popup-content").empty();
  $(".popup-wrapper").show();
  dibujarCarrito(miCarrito.carrito);
});

$("#compra").on("click", carroIn);

function carroIn() {
  $(".popup-wrapper").fadeTo("slow", 1);
  $(".popup").animate({
    left: "12rem",
    opacity: "1",
  });
}

$("#finCompra").on("click", checkOut);

popup.addEventListener("click", (e) => {
  // console.log(e.target.classList);
  if (e.target.classList == "popup-wrapper") {
    $(".popup-wrapper").hide();
    $(".popup").animate({
      left: "0px",
      opacity: "0",
    });
  }
});

document.addEventListener("keyup", (e) => {
  // cerrar presionando ESC
  if (e.key == "Escape") {
    popup.style.display = "none";
    $(".popup").animate({
      left: "0px",
      opacity: "0",
    });
  }
});

//----------------------------------------------
//FORMULARIO DE PAGO - CHECK OUT

$("#seguir-comprando").on("click", seguirCompra);
$("#abonar").on("click", abonarCompra);

function checkOut() {
  $("html, body").animate(
    {
      scrollTop: $("#checkout").offset().top,
    },
    2000
  );
  $(".container-checkout").animate(
    {
      opacity: "1",
    },
    1000
  );
  miCarrito.precioTotal();
}

function seguirCompra() {
  $(".container-checkout").animate(
    {
      opacity: "0",
    },
    1000
  );
  $("html, body").animate(
    {
      scrollTop: $("#arriba").offset().top,
    },
    2000
  );
}

function abonarCompra() {
  localStorage.clear();
  alert("Su pedido se encuentra en camino");
  location.reload();
}
