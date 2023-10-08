let palavras = [];
let colors= ['primary', 'info','warning', 'danger', 'success', 'success', 'secondary']

$(document).ready(function() {
    $('#addWord').click(function() {
        let palavraNova = $('#addWordInput').val()
        if (palavraNova == '') {
            return;
        }

        palavras.push(palavraNova);
        
        listWords(palavraNova);
        
        $('#addWordInput').val('');
    });

    $('#searchWord').click(function() {
        console.log("Palavra buscada")
        $('#searchWordInput').val('');
    });
});

function listWords(palavraNova) {
    let colorIndex = Math.floor(Math.random() * colors.length);
    let color = colors[colorIndex]
    console.log(color)
    $("#savedWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavraNova}</span>`);
}