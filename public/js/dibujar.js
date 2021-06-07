function crearTarjeta(element) {
  let contenedor = document.createElement("tr");
  let tarjProd = crearComponente("div", "p-2");
  let img = crearComponente("img", "img-fluid rounded shadow-sm");
  img.src = element.imagen;
  img.alt = element.producto;
  img.width = 300;
  let tarjDescr = crearComponente("div", "ml-3 d-inline-block align-middle");

  let botones = crearComponente("h5", "mb-0 text-dark d-inline-block");
  botones.innerHTML = element.producto;

  let descripcion = crearComponente("p", "descripcion");
  descripcion.innerHTML = element.descripcion;

  let td01 = crearComponente("td", "align-middle");
  td01.innerHTML = `<strong>$${element.precio}</strong>`;

  let td02 = crearComponente("td", "align-middle");
  td02.innerHTML = `<strong>${element.stock}</strong>`;

  let td03 = crearComponente("td", "align-middle");
  let botonAdd = crearComponente("a");
  botonAdd.innerHTML = `<i class="large material-icons">add_circle_outline</i>`;
  botonAdd.addEventListener("click", () => {
    miCarrito.addProducto(element);
  });

  tarjProd.appendChild(img);
  tarjProd.appendChild(tarjDescr);
  tarjDescr.appendChild(botones);
  tarjDescr.appendChild(descripcion);
  td03.appendChild(botonAdd);

  contenedor.appendChild(tarjProd);
  contenedor.appendChild(td01);
  contenedor.appendChild(td02);
  contenedor.appendChild(td03);

  return contenedor;
}

function crearComponente(tag, classes) {
  let componente = document.createElement(tag);
  componente.classList = classes;
  return componente;
}

function crearTarjetaCarrito(element, cant) {
  let contenedor = $("<div>", {
    class: "row",
  })
    .append(
      $("<div>", {
        class: "col-5",
      }).append(
        $("<img>", {
          class: "rounded",
          src: element.imagen,
          alt: element.producto,
          width: "100%",
        })
      )
    )
    .append(
      $("<div>", {
        class: "col-4 my-auto",
      })
        .append(
          $("<h5>", {
            class: "mb-0 text-dark carr-prod",
            text: `${element.producto}`,
          })
        )
        .append(
          $("<h5>", {
            class: "mb-0 text-dark carr-prod",
            text: `cant.: ${cant}`,
          })
        )
        .append(
          $("<h5>", {
            class: "mb-0 text-dark carr-precio",
            text: "c/u $" + element.precio,
          })
        )
    )
    .append(
      $("<div>", {
        class: "col-3 my-auto",
      })
        .append(
          $("<a>", {
            class: "material-icons",
            text: "add_circle_outline",
            click() {
              miCarrito.addProducto(element);
            },
          })
        )
        .append(
          $("<a>", {
            class: "material-icons",
            text: "remove_circle_outline",
            click() {
              miCarrito.remProducto(element);
            },
          })
        )
    )
    .append(
      $("<div>", {
        class: "row border mx-auto",
        width: "100%",
        height: 15,
      })
    );
  return contenedor;
}

function dibujarCarrito(carrito) {
  $(".popup-content").empty();
  for (let element of carrito.entries()) {
    $(".popup-content").append(crearTarjetaCarrito(element[0], element[1]));
  }
  miCarrito.precioCompra();
}

function dibujarLista(prods, lugar) {
  lugar.innerHTML = "";
  prods.forEach((element) => {
    lugar.appendChild(crearTarjeta(element));
  });
}
