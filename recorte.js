const demosSection = document.getElementById('demos');

var model = undefined;

function mostrar() {
    var archivo = document.getElementById("file").files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(archivo);
        reader.onloadend = function () {
            document.getElementById("xxx").src = reader.result;
            console.log(document.getElementById("xxx").src);
        }
    }
}

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;
    // Show demo section now model is ready to use.
    demosSection.classList.remove('invisible');
});
// Esperamos a que todo el HTML esté cargado antes de ejecutar Javascrip
document.addEventListener('DOMContentLoaded', () => {

    // Input File
    const inputImage = document.querySelector('#file');
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
    const imageContainers = document.getElementsByClassName('classifyOnClick');

    // Now let's go through all of these and add a click event listener.
    for (let i = 0; i < imageContainers.length; i++) {
        // Add event listener to the child element whichis the img element.
        imageContainers[i].children[0].addEventListener('click', handleClick);
    }
    
    // When an image is clicked, let's classify it and display results!
    function handleClick(event) {
        if (!model) {
            console.log('Wait for model to load before clicking!');
            return;
        }
    
        // We can call model.classify as many times as we like with
        // different image data each time. This returns a promise
        // which we wait to complete and then call a function to
        // print out the results of the prediction.
        model.detect(event.target).then(function (predictions) {
            // Lets write the predictions to a new paragraph element and
            // add it to the DOM.
            console.log(predictions);
            for (let n = 0; n < predictions.length; n++) {
                // Description text
                const p = document.createElement('p');
                p.innerText = predictions[n].class + ' - with '
                    + Math.round(parseFloat(predictions[n].score) * 100)
                    + '% confidence.';
                // Positioned at the top left of the bounding box.
                // Height is whatever the text takes up.
                // Width subtracts text padding in CSS so fits perfectly.
                p.style = 'left: ' + predictions[n].bbox[0] + 'px;' +
                    'top: ' + predictions[n].bbox[1] + 'px; ' +
                    'width: ' + (predictions[n].bbox[2] - 10) + 'px;';
    
                const highlighter = document.createElement('div');
                highlighter.setAttribute('class', 'highlighter');
                highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px;' +
                    'top: ' + predictions[n].bbox[1] + 'px;' +
                    'width: ' + predictions[n].bbox[2] + 'px;' +
                    'height: ' + predictions[n].bbox[3] + 'px;';
    
                event.target.parentNode.appendChild(highlighter);
                event.target.parentNode.appendChild(p);
                recortarImagen(predictions);
            }
        });
    }
    function recortarImagen(data) {
        let CoordsInJson = JSON.stringify(data);
        // Variables
        console.log("ENTRO:" +JSON.stringify(data[0]["bbox"]));
        const inicioX = data[0]["bbox"][0];
        const inicioY = data[0]["bbox"][1];
        const nuevoAncho = data[0]["bbox"][2];
        const nuevaAltura = data[0]["bbox"][3];
        const zoom = 1;
        let imagenEn64 = '';
        // La imprimo
        miCanvas.width = nuevoAncho;
        miCanvas.height = nuevaAltura;
        // La declaro
        let miNuevaImagenTemp = new Image();
        // Cuando la imagen se carge se procederá al recorte
        miNuevaImagenTemp.onload = function () {
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



/********************************************************************
// Demo 1: Grab a bunch of images from the page and classify them
// upon click.
********************************************************************/

// In this demo, we have put all our clickable images in divs with the 
// CSS class 'classifyOnClick'. Lets get all the elements that have
// this class.

