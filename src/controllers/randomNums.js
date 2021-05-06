function random() {
    return Math.floor(Math.random() * 1001);
}

function calculo(cant) {
    let numeros = [];
    let repetidos = {};
    let i = 0;
    while (i < parseInt(cant)) {
        numeros.push(random());
        i++;
    }

    numeros.forEach(function (numero) {
        repetidos[numero] = (repetidos[numero] || 0) + 1;
    });

    return repetidos;
}

process.on('message', (cant) => {
    process.send(calculo(cant));
    console.log('Terminado');
    process.exit();
});
