let palavras = [];

$(document).ready(function() {
    $('#addWord').click(function() {
        let palavraNova = $('#addWordInput').val()
        palavras.push(palavraNova);
        console.log(palavras)
        $('#addWordInput').val('');
        listWords(palavraNova);
    });

    $('#searchWord').click(function() {
        console.log("Palavra buscada")
        $('#searchWordInput').val('');
    });
});

function listWords(palavraNova) {
    $("#savedWords").append(`<span class="badge rounded-pill text-bg-primary">${palavraNova}</span>`);
}