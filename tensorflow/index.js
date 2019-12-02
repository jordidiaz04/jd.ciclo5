let net;

$(function(){
    $('#fileImagen').change(function(){
        var datos = this.files[0];
        if(datos !== undefined){
            $('#response').html('');
            $('#lblImagen').html(datos.name);
            $('#img').prop('src', 'images/' + datos.name);
        }
    });

    $('#btnReconocer').click(function(){
        app();
    });
});

async function app() {
    var lblMensajeCarga = document.getElementById('lblMensajeCarga');
    $('#lblMensajeCarga').html('Reconociendo imagen...');
    

    net = await mobilenet.load();
    $('#lblMensajeCarga').html('Imagen reconocida!');

    const imgEl = document.getElementById('img');
    const result = await net.classify(imgEl);
    
    $('#response').html('');
    $(result).each(function (index, element){
        $('#response').append(
            '<div class="row">' +
                '<div class="col-sm-6">' +
                    '<label>Nombre: <span>' + element.className + '</span></label>' +
                    '<br>' +
                    '<label>Probabilidad: <span>' + (element.probability*100).toFixed(2) + '%</span></label>' +
                '</div>' +
            '</div><br>'
        );
    });
}