// Esperamos a que todo el HTML esté cargado antes de ejecutar Javascrip
document.addEventListener('DOMContentLoaded', () => {

    // Input File
    const inputImage = document.querySelector('#image');
    // Nodo donde estará el editor
    const editor = document.querySelector('#editor');
    // El canvas donde se mostrará la previa
    const miCanvas = document.querySelector('#preview');
    // Contexto del canvas
    const contexto = miCanvas.getContext('2d');
    // Ruta de la imagen seleccionada
    let urlImage = undefined;
    // Evento disparado cuando se adjunte una imagen
    inputImage.addEventListener('change', abrirEditor, false);

    /**
    * Método que abre el editor con la imagen seleccionada
    */
    function abrirEditor(e) {
        // Obtiene la imagen
        urlImage = URL.createObjectURL(e.target.files[0]);

        // Borra editor en caso que existiera una imagen previa
        editor.innerHTML = '';
        let cropprImg = document.createElement('img');
        cropprImg.setAttribute('id', 'croppr');
        editor.appendChild(cropprImg);

        // Limpia la previa en caso que existiera algún elemento previo
        contexto.clearRect(0, 0, miCanvas.width, miCanvas.height);

        // Envia la imagen al editor para su recorte
        document.querySelector('#croppr').setAttribute('src', urlImage);

        // Crea el editor
        new Croppr('#croppr', {
            aspectRatio: 1,
            startSize: [70, 70],
            onCropEnd: recortarImagen
        })
    }

    /**
    * Método que recorta la imagen con las coordenadas proporcionadas con croppr.js
    */
    function recortarImagen(data) {
        // Variables 785,665,2567,1470
        const inicioX = 785;
        const inicioY = 665;
        const nuevoAncho = 1760;
        const nuevaAltura = 805;
        const zoom = 1;
        let imagenEn64 = '';
        // La imprimo
        miCanvas.width = nuevoAncho;
        miCanvas.height = nuevaAltura;
        // La declaro
        let miNuevaImagenTemp = new Image();
        // Cuando la imagen se carge se procederá al recorte
        miNuevaImagenTemp.onload = function() {
            //contexto.filter = "contrast(200) grayscale(2)"
            // Se recorta
            contexto.drawImage(miNuevaImagenTemp, inicioX, inicioY, nuevoAncho * zoom, nuevaAltura * zoom, 0, 0, nuevoAncho, nuevaAltura);
            // Se transforma a base64
            imagenEn64 = miCanvas.toDataURL("image/jpeg");
            // Mostramos el código generado
            document.querySelector('#base64').textContent = imagenEn64;
            document.querySelector('#base64HTML').textContent = '<img src="' + imagenEn64.slice(0, 40) + '...">';

        }
        // Proporciona la imagen cruda, sin editarla por ahora
        miNuevaImagenTemp.src = urlImage;
    }
});
