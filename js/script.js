//Pega as tarefas salvas no LocalStore. Se não existir nenhuma tarefa ainda, cria um array vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Salva o array de Tarefas no LocalStore
function salvarLocal(){
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Função que adiciona uma nova tarefa ou edita uma existente
function adicionarTarefa(){
    let tituloTarefa = document.getElementById("tituloTarefa").value;
    let descricao = document.getElementById("descricao").value;
    let prioridade = document.getElementById("prioridade").value;
    let data = document.getElementById("data").value;
    let index = document.getElementById("index").value;

// Cria o objeto tarefa com as informações
let tarefa = {
    tituloTarefa: tituloTarefa,
    descricao: descricao,
    data: data,  
    prioridade: prioridade,
    status: "🔄" // Faz começar toda tarefa como pendente
};

// Se caso estiver vazio séra uma nova tarefa
if (index === ""){
    tarefas.push(tarefa);
} else { // Se não estiver vazio vai editar uma tarefa que já existe
    tarefas[index] = tarefa;
    document.getElementById("index").value = "";
}

salvarLocal(); // Salva no navegador

// Atualiza a tabela
listarTarefas();


document.getElementById("formToDo").reset();// Limpa o formulário

}

// função para mostrar as tarefas na tela
function listarTarefas(){
    let tabela = document.getElementById("tabelaTarefas");
    let cabecalho = document.getElementById("cabecalhoTabela")
    let mensagem = document.getElementById("mensagem");
    tabela.innerHTML= ""; // Limpa a tabela antes de preencher


    // Se não ouver tarefas o cabeçalho não aparece
    // Se não houver tarefas
    if(tarefas.length === 0){
        cabecalho.style.display = "none";
        mensagem.innerHTML = "Não há tarefas cadastradas.";
        return;
    }

    // Se tiver alguma tarefa ele aparecera
    mensagem.innerHTML = ""; // Limpa mensagem
    cabecalho.style.display = "table-header-group"; // Mostra o cabeçalho

    // Percorre as tarefas cadastradas
    tarefas.forEach((tarefa, index)=>{

        let dataFormata = new Date(tarefa.data).toLocaleDateString("pt-BR")
        
        // Adiciona uma linha na tabela
        tabela.innerHTML += `
        <tr>
            <td>${tarefa.tituloTarefa}</td>
            <td>${tarefa.descricao}</td>
            <td>${tarefa.prioridade}</td>
            <td>${dataFormata}</td>
            <td>${tarefa.status}</td>

            <td>
                <button onclick="editarTarefa(${index})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button onclick="excluirTarefa(${index})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                <button onclick="concluirTarefa(${index})" title="Concluir"><i class="fa-solid fa-check"></i></button>
            </td>
        </tr>
        `
    })
}


function editarTarefa(index){
    let tarefa = tarefas[index] // Pega a tarefa pelo índice

    document.getElementById("tituloTarefa").value = tarefa.tituloTarefa;
    document.getElementById("descricao").value = tarefa.descricao;
    document.getElementById("data").value = tarefa.data;
    document.getElementById("prioridade").value = tarefa.prioridade;

    document.getElementById("index").value = index; // Guarda o índice da tarefa para saber qual vai ser editada
}

function excluirTarefa(index){
    if(confirm("Deseja excluir esta Tarefa:")){
        tarefas.splice(index, 1); // Remove do array
        salvarLocal();
        listarTarefas(); // Atualiza tabela
    }
}


function concluirTarefa(index){
    tarefas[index].status = "✅"; // Altera o status da tarefa
    salvarLocal();
    listarTarefas();
}

function buscarTarefa(){
    let termo = document.getElementById("buscar").value.toLowerCase();
    let tabela = document.getElementById("tabelaTarefas");
    tabela.innerHTML = "";

    tarefas.forEach((tarefa, index)=>{
        let dataFormata = new Date(tarefa.data).toLocaleDateString("pt-BR")

        if (tarefa.tituloTarefa.toLowerCase().includes(termo)) // Verifica se o título da tarefa contém o texto pesquisado
            tabela.innerHTML += `
            <tr>
                <td>${tarefa.tituloTarefa}</td>
                <td>${tarefa.descricao}</td>
                <td>${tarefa.prioridade}</td>
                <td>${dataFormata}</td>
                <td>${tarefa.status}</td>
                <td>
                    <button onclick="editarTarefa(${index})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="excluirTarefa(${index})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                    <button onclick="concluirTarefa(${index})" title="Concluir"><i class="fa-solid fa-check"></i></button>
                </td>
            </tr>
        `
    })
}

// Captura o envio e impede que a página recarregue, chama a função de adicionar tarefa
document.getElementById("formToDo").addEventListener("submit", function(e){
    e.preventDefault();
    adicionarTarefa();
});

listarTarefas(); // Quando a página carrega, já mostra as tarefas salvas