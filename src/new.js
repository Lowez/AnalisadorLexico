/*

******** Analisador Léxico *******
------ by Luiz Disarz, 2023 ------

*/

let palavras = [];
let state = 0;
let automatoWireframe = [];
let automato = [
    []
];

const colors = ['primary', 'info','warning', 'danger', 'success', 'secondary']
const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const a = 'a'.charCodeAt(0);
const z = 'z'.charCodeAt(0);

/*
    Ativa Listeners para os inputs e botões da página
*/
$(document).ready(function() {
    $('#addWord').click(function(event) {
        event.preventDefault();

        // Recebe a palavra digitada
        let palavraElement = $('#addWordInput');
        let palavraNova = $('#addWordInput').val();

        // Caso palavra não exista no automato, adicionada ela na lista e no automato
        if (palavras.indexOf(palavraNova) < 0) {
            addWordToAutomato(palavraNova);
        }

        palavraElement.val('');
    });

    // Validação em tempo real das palavras digitadas no campo de busca
    $("#searchWordInput").on("keydown keyup input", function(event) {
        let palavraDigitada = $(this).val();
        if (palavraDigitada === "") {
            $("#foundWords").empty();
            $("#searchWordInput").css("box-shadow", "none");

            //Limpa CSS linhas
            $("#automato tr").removeClass('table-success');
            $("#automato tr").removeClass('table-danger');
            $("#automato tr").removeClass('actual-state');

            return;
        }
        
        // Filtra as palavras que iniciam com a palavra digitada
        let filteredWords = palavras.filter(palavra => palavra.startsWith(palavraDigitada));

        automatoValidation(palavraDigitada, event.which);

        // Mostra o campo em vermelho caso não encontre nenhuma palavra valida, se não deixa verde e mostra as encontradas
        let color = colors[4];
        filteredWords.forEach(palavraDigitada => {
            $("#foundWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavraDigitada}</span>`);
        });
     });

     $('#searchWord').click(function(event) {
        event.preventDefault();

        let palavraDigitada = $("#searchWordInput").val();
        let spaceSimulation = 32;

        // Filtra as palavras que iniciam com a palavra digitada
        let filteredWords = palavras.filter(palavra => palavra.startsWith(palavra));

        automatoValidation(palavraDigitada, spaceSimulation);

        if (palavraDigitada === "") {
            // Mostra o campo em vermelho caso não encontre nenhuma palavra valida, se não deixa verde e mostra as encontradas
            let color = colors[4];
            filteredWords.forEach(palavraDigitada => {
                $("#foundWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavraDigitada}</span>`);
            });
        }
     })
});

/*
    Função que destrincha a palavra inserida para o automato
*/
function addWordToAutomato(palavraNova) {
    palavraNova = palavraNova.trim();
    if (palavraNova.length > 0) {
        // Não permite nenhum caractere que não seja letras
        if (/^[A-Za-z\s]*$/.test(palavraNova)) {
            if (palavras.indexOf(palavraNova) < 0) {
                listSavedWord(palavraNova);

                // Adiciona a palavra nova em um array junto com as outras
                palavras.push(palavraNova);

                
                generateStates();
            }
            automatoWireframe = createAutomatoWireframe();
            setTable();
        }
    }
}

/*
    Cria uma pequena listinha das palavras adicionadas ao automato
*/
function listSavedWord(palavraNova) {
    let colorIndex = Math.floor(Math.random() * colors.length);
    let color = colors[colorIndex]
    $("#savedWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavraNova}</span>`);
}

/*
    Gera os estados do automato baseando-se nas palavras já adicionadas
*/
function generateStates(){
    for(let i = 0; i < palavras.length; i++){
        let actualState = 0;
        let palavra = palavras[i];

        for(let j = 0; j < palavra.length; j++){
            let letra = palavra[j];

            // Valida se é Estado Inicial
            if (j == 0) {
                automato[actualState]['start'] = true;
            } else {
                automato[actualState]['start'] = false;
            }
            
            if(typeof automato[actualState][letra] === 'undefined'){
                let nextState = state + 1;

                automato[actualState][letra] = nextState;
                automato[nextState] = [];
                
                state = actualState = nextState;

            } else {
                actualState = automato[actualState][letra];
            }

            // Valida se é Estado Final
            if(j == palavra.length - 1){
                automato[actualState]['end'] = true;
            } else {
                automato[actualState]['end'] = false;
            }
        }
    }
}

/*
    Gera o esqueleto que formará o automato, os estados e cada letra associada
*/
function createAutomatoWireframe(){
    let wireframe = [];

    for(let i = 0; i < automato.length; i++){
        let aux = [];
        aux['state'] = i;

        for(let j = a; j <= z; j++){
            let letra = String.fromCharCode(j);

            if(typeof automato[i][letra] === 'undefined'){
                aux[letra] = '-';
            } else {
                aux[letra] = automato[i][letra];
            }
        }

        if(automato[i]['end']){
            aux['end'] = true;
        } else {
            aux['end'] = false;
        }
        wireframe.push(aux);
    }
    return wireframe;
}

/*
    Constrói o automato a partir da lista de palavras e do wireframe
*/
function setTable(){
    $('#automato').empty();
    // Seleciona o contêiner onde a tabela será inserida
    const tableContainer = $('#automato');
    const table = $('<table>').addClass('table table-striped-columns');

    // Cria o cabeçalho da tabela
    const headerRow = $('<tr>');
    headerRow.append($('<th>').text('#'));

    table.append($('<thead>').append(headerRow));

    //Colocar letras de A-Z na tabela
    alfabeto.forEach(letra => {
        // Adiciona um cabeçalho para cada letra do alfabeto
        headerRow.append($('<th>').text(letra));
    });
    table.append($('<thead>').append(headerRow));

    // Preenche a tabela com os dados
    const tbody = $('<tbody>');
    for(let j = 0; j < automatoWireframe.length; j++){
        const row = $('<tr>');
        const td = $('<td>');
        console.log(automatoWireframe)
        if(automato[j]['start']){
            td.html('-> ' + 'q' + automatoWireframe[j]['state']);
            td.addClass('end');
            row.addClass('end');
        } else
        if (automato[j]['end']) {
            td.html('* ' + 'q' + automatoWireframe[j]['state']);
            td.addClass('end');
            row.addClass('end');
        } else
        if (automato[j]['start'] && automato[j]['end']) {
            td.html('-> ' + '* ' + 'q' + automatoWireframe[j]['state']);
            td.addClass('end');
            row.addClass('end');
        } else
        {
            td.html('q' + automatoWireframe[j]['state']);
        }

        row.append(td);
        row.addClass(`state_${j}`);

        //Letras/Tokens
        for (var k = a; k <= z; k++) {
            let innerCell = $('<td>');
            let letra = String.fromCharCode(k);

            innerCell.html(automatoWireframe[j][letra]);

            row.append(innerCell);
        }
        table.append(tbody);

        table.append(row);
    }

    // Adiciona a tabela ao contêiner
    tableContainer.append(table);
}

function automatoValidation(palavra, last){
    //Se for válido, Espaço, Backspace ou Del
    if(palavra || last == 32 || last == 8 || last == 46){
        if(palavras.length > 0){
            //Limpa CSS linhas
            $("#automato tr").removeClass('table-success');
            $("#automato tr").removeClass('table-danger');
            $("#automato tr").removeClass('actual-state');

            let actualState = 0;
            let error = false;
            
            for(let i = 0; i < palavra.length; i++){
                let letra = palavra[i];
                
                if(!error){
                    //Se está dentro do alfabeto
                    if(letra.charCodeAt(0) >= a && letra.charCodeAt(0) <= z){
                        if(automatoWireframe[actualState][letra] != '-'){
                            $("#automato tr").removeClass('actual-state');
                            $(`.state_${actualState}`).addClass('table-success');
                            $(`.state_${actualState}`).addClass('actual-state');
                            actualState = automatoWireframe[actualState][letra];

                            $("#foundWords").empty();
                            $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px green")
                            $("#foundWords").append(`<h5 class="text-light">Palavras Possíveis</h5>`);
                        } else {
                            error = true;
                            $(`.state_${actualState}`).addClass('table-danger');

                            $("#foundWords").empty();
                            $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px red")
                        }
                    }

                    //Se for o ultimo, pressionando Espaço
                    if(last == 32){
                        if(i == palavra.length-1){
                            if(automatoWireframe[actualState]['end']){
                                $("#automato tr").removeClass('actual-state');
                                $(`.state_${actualState}`).addClass('table-success');
                                $(`.state_${actualState}`).addClass('actual-state');

                                $("#foundWords").empty();
                                $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px green")
                            } else {
                                error = true;
                                $(`.state_${actualState}`).addClass('table-danger');

                                $("#foundWords").empty();
                                $("#searchWordInput").css("box-shadow", "5px 5px 20px 10px red")
                            }
                        }
                    }
                }
            }
        } else {
            //Limpa CSS linhas
            $("#automato tr").removeClass('table-success');
            $("#automato tr").removeClass('table-danger');
            $("#automato tr").removeClass('actual-state');
        }
    }
}
