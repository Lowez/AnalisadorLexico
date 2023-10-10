let palavras = [];
let foundWords = [];
let palavrasQtd = 0;
let eventosNumbers = [];
fillEventosNumbers();
let currentEventoIndex = 1;

const colors= ['primary', 'info','warning', 'danger', 'success', 'secondary']
const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

$(document).ready(function() {
    $('#addWord').click(function() {
        let palavraNova = $('#addWordInput').val()
        if (palavraNova == '') {
            return;
        }

        let palavra = [];

        // for (let i = 0; i < palavraNova.length; i++) {
        //     palavras.push({
        //         letra: palavraNova[i],
        //         evento: 'q' + eventosNumbers[currentEventoIndex]
        //     });
        //     currentEventoIndex++;
        // }

        palavras.push(palavraNova)

        // palavras.push(palavra);
        palavrasQtd++;
        
        listSavedWord(palavraNova);

        if (palavrasQtd == 1) {
            createTable();
        }
        
        $('#addWordInput').val('');
    });

    $('#searchWord').click(function(word = "") {
        console.log("Palavra buscada")
        $('#searchWordInput').val('');
    });

    $("#searchWordInput").bind("keyup", function() {
        let palavraDigitada = $(this).val();

        if (palavraDigitada == "") {
            $("#searchWordInput").css("box-shadow", "none !important")
        }

        palavras.forEach(palavra => {
            if (palavra.includes(palavraDigitada)) {
                let exists = foundWords.filter(el => el == palavra)
                console.log(exists)
                $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px green")
                if (exists.length == 0) {
                    foundWords.push(palavra)
                }
            } else {
                let exists = foundWords.filter(el => el == palavra)
                if (exists.length > 0) {
                    let exceptions = foundWords.filter(el => el !== palavra)
                    foundWords = exceptions
                }
                $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px red")
            }
        })
        
        listFoundedWord()
     });
});

function listFoundedWord() {
    let color = colors[4]
    foundWords.forEach(palavra => {
        $("#foundWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavra}</span>`);
    })
}

function listSavedWord(palavraNova) {
    let colorIndex = Math.floor(Math.random() * colors.length);
    let color = colors[colorIndex]
    $("#savedWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavraNova}</span>`);
}

function fillEventosNumbers() {
    for (let i = 0; i < 100; i++) {
        eventosNumbers.push(i);
    }
}

function createTable() {
    const data = [
        { letra: 'a', evento: 'q1' },
        { letra: 'b', evento: 'q2' },
        { letra: 'c', evento: 'q3' }
    ];

    // Seleciona o contêiner onde a tabela será inserida
    const tableContainer = $('#automato');

    // Cria a tabela com classes Bootstrap
    const table = $('<table>').addClass('table table-striped-columns');

    // Cria o cabeçalho da tabela
    const headerRow = $('<tr>');
    headerRow.append($('<th>').text('#'));
    alfabeto.forEach(letra => {
        headerRow.append($('<th>').text(letra)); // Adiciona um cabeçalho para cada letra do alfabeto
    });
    table.append($('<thead>').append(headerRow));

    // Preenche a tabela com os dados
    const tbody = $('<tbody>');
    palavras.forEach((item, index) => {
        const row = $('<tr>');
        row.append($('<th>').text(index + 1)); // Adiciona o índice
        alfabeto.forEach(letra => {
            const valor = letra === item.letra ? item.evento : ''; // Obtém o valor do evento se a letra corresponder
            row.append($('<td>').text(valor));
        });
        tbody.append(row);
    });
    table.append(tbody);

    // Adiciona a tabela ao contêiner
    tableContainer.append(table);
}