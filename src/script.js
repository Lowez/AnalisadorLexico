// Inicialização das variáveis e constantes que serão utilizadas
let palavras = [];
let foundWords = [];
let palavrasQtd = 0;
let eventosNumbers = [];
fillEventosNumbers();
let currentEventoIndex = 0;

const colors= ['primary', 'info','warning', 'danger', 'success', 'secondary']
const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let automato = [];

$(document).ready(function() {
    // Adicionando palavras ao banco de palavras assim que o botão de adicionar uma palavra é pressionado
    $('#addWord').click(function(event) {
        event.preventDefault();

        let palavraNova = $('#addWordInput').val()
        if (palavraNova == '') {
            return;
        }

        // Adiciona a palavra no array de palavras
        palavras.push(palavraNova)

        palavrasQtd++;
        
        listSavedWord(palavraNova);
        
        $('#addWordInput').val('');

        addWordToAutomato(palavraNova);

        // Cria a tabela caso seja a primeira palavra a ser adicionada
        if (palavrasQtd == 1) {
            createTable();
        } else {
            updateTable();
        }
    });

    // Busca a palavra digitada ao banco de palavras assim que o botão de adicionar uma palavra é pressionado
    $('#searchWord').click(function(word = "") {
        console.log("Palavra buscada")
        $('#searchWordInput').val('');
    });

    // Validação em tempo real das palavras digitadas no campo de busca
    $("#searchWordInput").on("input", function() {
        let palavraDigitada = $(this).val();
        if (palavraDigitada === "") {
            $("#foundWords").empty();
            $("#searchWordInput").css("box-shadow", "none");
            return;
        }

        // Filtra as palavras que iniciam com a palavra digitada
        let filteredWords = palavras.filter(palavra => palavra.startsWith(palavraDigitada));

        // Mostra o campo em vermelho caso não encontre nenhuma palavra valida, se não deixa verde e mostra as encontradas
        if (filteredWords.length == 0) {
            $("#foundWords").empty();
            $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px red")
            return;
        } else {
            $("#foundWords").empty();
            $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px green")
            $("#foundWords").append(`<h5 class="text-light">Palavras Possíveis</h5>`);

            let color = colors[4];
            filteredWords.forEach(palavra => {
                $("#foundWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavra}</span>`);
            });
        }
     });
});

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

function addWordToAutomato(palavra) {
    for (let i = 0; i < palavra.length; i++) {
        let index = automato.findIndex(automato => automato.letra == palavra[i]);

        if (index == -1) {
            automato.push({
                letra: palavra[i],
                eventos: [`q${currentEventoIndex} to q${currentEventoIndex + 1}`],
                qtd: 1
            });
        } else {
            automato[index].eventos.push(`q${currentEventoIndex} to q${currentEventoIndex + 1}`)
            automato[index].qtd++;
        }
        currentEventoIndex++;
    }

    console.log(automato)
}

function createTable() {
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
    automato.forEach((item, index) => {
        console.log(item)
        if (item.qtd > 0) {
            const row = $('<tr>');
            const qs = item.eventos[0].split(" to ")
            row.append($('<th>').text(qs[0])); // Adiciona o índice
            alfabeto.forEach(letra => {
                const valor = letra === item.letra ? qs[1] : ''; // Obtém o valor do evento se a letra corresponder
                row.append($('<td>').text(valor));
            });
            tbody.append(row);
        }
    });
    table.append(tbody);

    // Adiciona a tabela ao contêiner
    tableContainer.append(table);
}

function updateTable() {

}