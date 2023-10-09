let palavras = [];
let palavrasQtd = 0;
let eventosNumbers = [];
fillEventosNumbers();
let currentEventoIndex = 1;

const colors= ['primary', 'info','warning', 'danger', 'success', 'success', 'secondary']
const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

$(document).ready(function() {
    $('#addWord').click(function() {
        let palavraNova = $('#addWordInput').val()
        if (palavraNova == '') {
            return;
        }

        let palavra = [];

        for (let i = 0; i < palavraNova.length; i++) {
            palavras.push({
                letra: palavraNova[i],
                evento: 'q' + eventosNumbers[currentEventoIndex]
            });
            currentEventoIndex++;
        }

        console.log(palavras)

        // palavras.push(palavra);
        palavrasQtd++;
        
        listWord(palavraNova);

        if (palavrasQtd == 1) {
            createTable();
        }
        
        $('#addWordInput').val('');
    });

    $('#searchWord').click(function(word = "") {
        console.log("Palavra buscada")
        $('#searchWordInput').val('');
    });

    $("#searchWordInput").bind("change paste keyup", function() {
        let letraDigitada = $(this).val();

        
     });
});

function listWord(palavraNova) {
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
        { nome: 'João', idade: 25, cidade: 'São Paulo' },
        { nome: 'Maria', idade: 30, cidade: 'Rio de Janeiro' },
        { nome: 'Carlos', idade: 22, cidade: 'Belo Horizonte' }
    ];

    // Seleciona o contêiner onde a tabela será inserida
    const tableContainer = $('.container');

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