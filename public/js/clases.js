class Item {
  constructor(_id, nombre, precio, descripcion, foto, stock) {
    this._id = _id
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.foto = foto;
    this.stock = stock;
  }
  resStock() {
    this.stock -= 1;
    dibujarLista(productos, contenedorProductos);
  }

  addStock() {
    this.stock += 1;
    dibujarLista(productos, contenedorProductos);
  }
}

class Carrito {
  carrito = new Map();
  precioSiva = 0;
  items = 0;
  iva = 21;
  costoEnvio = 15;

  addProducto(producto) {
    if (producto.stock > 0) {
      if (this.carrito.has(producto)) {
        this.carrito.set(producto, this.carrito.get(producto) + 1);
        dibujarCarrito(this.carrito);
        this.setToLocalStorage(this.carrito);
      } else {
        this.carrito.set(producto, 1);
        dibujarCarrito(this.carrito);
        this.setToLocalStorage(this.carrito);
      }
      producto.resStock();
    } else {
      alert("no hay suficiente stock");
    }
    this.precioCompra();
    this.precioTotal();
    this.contador();
  }

  remProducto(producto) {
    if (this.carrito.get(producto) > 1) {
      this.carrito.set(producto, this.carrito.get(producto) - 1);
      dibujarCarrito(this.carrito);
      this.setToLocalStorage(this.carrito);
    } else {
      this.carrito.delete(producto);
      dibujarCarrito(this.carrito);
      this.setToLocalStorage(this.carrito);
    }
    producto.addStock();
    this.precioCompra();
    this.precioTotal();
    this.contador();
  }

  precioCompra() {
    const precioSivaTag = $(".precio-siva");
    precioSivaTag.innerText = ``;
    let sumPrecio = 0;
    for (let key of this.carrito.entries()) {
      if (key != undefined) {
        let unidad = key[0].precio;
        let cantidad = key[1];
        sumPrecio = sumPrecio + unidad * cantidad;
      }
      this.precioSiva = sumPrecio;
    }
    precioSivaTag.html(`$${this.precioSiva}`);
  }

  precioTotal() {
    let ivaFinal = this.precioSiva * (this.iva / 100);
    let final = this.precioSiva + this.costoEnvio + ivaFinal;
    $("#precio-envio").html(`$${this.costoEnvio}`);
    $("#precio-iva").html(`${this.iva}%`);
    $("#precio-final").html(`$${final.toFixed(2)}`);
  }

  setToLocalStorage(carrito) {
    let items = new Object();
    for (let key of carrito.entries()) {
      let prod = key[0].producto;
      let cant = key[1];
      items[prod] = cant;
    }
    localStorage.setItem("miCarrito", JSON.stringify(items));
    // let items = "";
    // items = JSON.stringify(Array.from(carrito.entries()));
    // localStorage.setItem("miCarrito", items);
  }

  contador() {
    let contador = document.getElementById("cartCounter");
    let sumItems = 0;
    for (let value of this.carrito.values()) {
      sumItems = sumItems + value;
      this.items = sumItems;
    }
    contador.innerHTML = this.items;
  }
}
