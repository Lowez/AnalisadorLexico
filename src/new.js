var palavras = [];
var states = [[]];
var step = 0; //Lugar na tabela
var alphabet = [];

const colors= ['primary', 'info','warning', 'danger', 'success', 'secondary']
const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const firstLetter = 'a';
const lastLetter = 'z';

$(document).ready(function() {
    $('#addWord').click(function(event) {
        event.preventDefault();

        let palavraElement = $('#addWordInput');
        let palavraNova = $('#addWordInput').val();
        listSavedWord(palavraNova);

        if (palavras.indexOf(palavraNova) < 0) {
            if (addWordToAutomato(palavraNova)) {
            }
        }

        palavraElement.val('');
    });

    // Validação em tempo real das palavras digitadas no campo de busca
    $("#searchWordInput").on("input", function(e) {
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

        validate($(this), palavraDigitada, e.keyCode);
     });
});

function listSavedWord(palavraNova) {
    let colorIndex = Math.floor(Math.random() * colors.length);
    let color = colors[colorIndex]
    $("#savedWords").append(`<span class="badge rounded-pill text-bg-${color}">${palavraNova}</span>`);
}

function addWordToAutomato(palavraNova) {
    palavraNova = palavraNova.trim();
    if (palavraNova.length > 0) {
        if (onlyLettersAndSpaces(palavraNova)) {
            if (palavras.indexOf(palavraNova) < 0) {
                palavras.push(palavraNova);
                setStates();
            }
            alphabet = setAlphabet();
            createTable(alphabet);

            
        }
    }
}

function createTable(alphabet){
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
    for(let j = 0; j < alphabet.length; j++){
        const row = $('<tr>');
        const td = $('<td>');

        if(alphabet[j]['end']){
            td.html('q' + alphabet[j]['state'] + '*');
            td.addClass('end');
            row.addClass('end');
        } else {
            td.html('q' + alphabet[j]['state']);
        }

        row.append(td);
        row.addClass(`step_${j}`);

        //Letras/Tokens
        for (var k = firstLetter.charCodeAt(0); k <= lastLetter.charCodeAt(0); k++) {
            let innerCell = $('<td>');
            let letra = String.fromCharCode(k);

            innerCell.html(alphabet[j][letra]);

            if(alphabet[j][letra] != '-'){
                innerCell.addClass('step');
            } else {
                innerCell.addClass('empty');
            }

            row.append(innerCell);
        }
        table.append(tbody);

        table.append(row);
    }

    // Adiciona a tabela ao contêiner
    tableContainer.append(table);
}

function validate(input, validate, last){
    //Se for válido, Espaço, Backspace ou Del
    if(validate || last == 32 || last == 8 || last == 46){
        if(palavras.length > 0){
            //Limpa CSS linhas
            $("#automato tr").removeClass('green');
            $("#automato tr").removeClass('red');
            $("#automato tr").removeClass('current_step');

            let currentStep = 0;
            let error = false;
            
            for(let i = 0; i < validate.length; i++){
                let letra = validate[i];
                
                if(!error){
                    //Se está dentro do alfabeto
                    if(letra.charCodeAt(0) >= firstLetter.charCodeAt(0) && letra.charCodeAt(0) <= lastLetter.charCodeAt(0)){
                        if(alphabet[currentStep][letra] != '-'){
                            $("#automato tr").removeClass('current_step');
                            $(`.step_${currentStep}`).addClass('green');
                            $(`.step_${currentStep}`).addClass('current_step');
                            currentStep = alphabet[currentStep][letra];
                        } else {
                            error = true;
                            $(`.step_${currentStep}`).addClass('red');
                        }
                    }

                    //Se for o ultimo, pressionando Espaço
                    if(last == 32){
                        if(i == validate.length-1){
                            if(alphabet[currentStep]['end']){
                                $("#automato tr").removeClass('current_step');
                                $(`.step_${currentStep}`).addClass('green');
                                $(`.step_${currentStep}`).addClass('current_step');
                            } else {
                                error = true;
                                $(`.step_${currentStep}`).addClass('red');
                            }
                            input.val('');
                        }
                    }
                }
            }
        }
    }
}

function setStates(){
    //Cicla palavras
    for(let i = 0; i < palavras.length; i++){
        let currentStep = 0;
        let palavra = palavras[i];

        //Cicla letras do Token
        for(let j = 0; j < palavra.length; j++){
            let letra = palavra[j];
            
            if(typeof states[currentStep][letra] === 'undefined'){
                let nextStep = step + 1;

                states[currentStep][letra] = nextStep;
                states[nextStep] = [];
                
                step = currentStep = nextStep;

            } else {
                currentStep = states[currentStep][letra];
            }

            //Final do Token
            if(j == palavra.length - 1){
                states[currentStep]['end'] = true;
            } else {
                states[currentStep]['end'] = false;
            }
        }
    }
}

function setAlphabet(){
    let stateHelper = [];

    //Cicla Estados
    for(let i = 0; i < states.length; i++){
        let aux = [];
        aux['state'] = i;

        //Cicla de A até Z, numerando Estados
        for(let j = firstLetter.charCodeAt(0); j <= lastLetter.charCodeAt(0); j++){
            let letra = String.fromCharCode(j);

            if(typeof states[i][letra] === 'undefined'){
                aux[letra] = '-';
            } else {
                aux[letra] = states[i][letra];
            }
        }

        if(states[i]['end']){
            aux['end'] = true;
        } else {
            aux['end'] = false;
        }
        stateHelper.push(aux);
    }
    return stateHelper;
}

function onlyLettersAndSpaces(str) {
    return /^[A-Za-z\s]*$/.test(str);
}
