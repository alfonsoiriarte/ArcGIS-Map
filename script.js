let pointsArray = [];
/* Configuro el mapa e importo dependencias */
function handleMap () {
    require(["esri/config",
    "esri/Map", 
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    ], function (esriConfig, Map, MapView, Graphic, GraphicsLayer) {
    /* Seteo Api Key */
    esriConfig.apiKey = "AAPK6c3e09a7857b4a01804a74239ff414aeIjVfG8LY5TvnzHY4FYcp-lIOSuLeWuT5SgtemI1fnAVqSnCPajQifw8WmwtgeQNp";
    /* Creo un mapa con "modo" de mapa" arcgis-topographic */
    const map = new Map({
    basemap: "arcgis-topographic"
    });

    const view = new MapView({
    map: map,
    center: [-58.368158, -34.627152],   /* Parametros:  Longitud, Latitud */
    zoom: 1,                            /* Nivel de zoom */
    container: "viewDiv"                /* Div contenedor de mapa */
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    pointsArray.map(data => {
        const point =  { 
            type: "point",
            longitude: data.longitud,
            latitude: data.latitud
        };
        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
                color: [255, 255, 255],
                width: 1
            }
        };
        /* Creo un grafico seteando las propiedades */
        const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol
        });
        graphicsLayer.add(pointGraphic);
    })

});
}
/* Inicializo el mapa */
handleMap();

/* Import dependecia para manejar archivo json (File System) */
/* var fs = require('./fs');
var http = require('http'); */

/* Evito el refresco de paginal cuando se envíe el form */
var form = document.getElementById("formMapId");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

/* Contador de marcadores */
let counter = 0;

/* Valido los input del form */
function validate() {
    /* Guardo inputs de formMap */
    let nameInput = document.formMap.nameInput;
    let direccionInput = document.formMap.direccionInput;
    let telefonoInput = document.formMap.telefonoInput;
    let categoryInput = document.formMap.categoryInput;
    let coordenadasInputInt = parseInt(document.formMap.coordenadasInput.value.split(',')[0])
    let coordenadasInput = document.formMap.coordenadasInput;
    let coordenadasArray = coordenadasInput.value.split(",",2)
    /* Valido inputs de form */
    if( nameInput.value == "" ) {
        nameInput.focus();
        document.getElementsByName('nameInput')[0].placeholder='Campo obligatorio';
    return false;
    }
    if( direccionInput.value == "" ) {
        direccionInput.focus();
        document.getElementsByName('direccionInput')[0].placeholder='Campo obligatorio';
    return false;
    }
    if( telefonoInput.value == "") {
        telefonoInput.focus();
        document.getElementsByName('telefonoInput')[0].placeholder='Campo obligatorio';
    return false;
    }
    if( categoryInput.value == "-1" ) {
        categoryInput.focus();
    return false;
    }
    if( coordenadasInput.value == "" || coordenadasArray[1]  < -180 || coordenadasArray[1] > 180 || coordenadasArray[0]  < -90 || coordenadasArray[0] > 90 ) {
        coordenadasInput.focus();
        coordenadasInput.innerHTML = "";
        document.getElementsByName('coordenadasInput')[0].placeholder='Campo obligatorio';
        return false;
    }

    console.log(coordenadasArray);
    /* Guardo data en array pointsArray */
    pointsArray.push({
        "pointId": counter,
        "nombre": nameInput.value,
        "direccion": direccionInput.value,
        "telefono": telefonoInput.value,
        "category": categoryInput.value,
        "latitud": coordenadasArray[0],
        "longitud": coordenadasArray[1]
    });
    handleMap();
    console.log(pointsArray);
    counter++;
    return true;
}