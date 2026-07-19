
const frm = document.querySelector("form")

const aFazer = document.querySelector("#todo")
const emAndamento = document.querySelector("#doing")
const concluido = document.querySelector("#done")

const btAdicionar = document.querySelector("#btAdicionar")
const btCancelar = document.querySelector("#btCancelar")

const inBuscar = document.querySelector("#inBuscar")

let tarefas = []

let indiceEdicao = -1
btCancelar.style.display = 'none'

const dados = localStorage.getItem("tarefas")

if (dados) {
    tarefas = JSON.parse(dados)
    renderizar()
}

frm.addEventListener("submit", (e) => {

    e.preventDefault()

    const tarefa = frm.inTarefa.value

    if (indiceEdicao === -1) {
        tarefas.push({
            tarefa,
            status: "todo"
        })
    }

    else {

        const status = tarefas[indiceEdicao].status

        tarefas[indiceEdicao] = {
            tarefa,
            status
        }

        indiceEdicao = -1
        btAdicionar.textContent = 'Adicionar'
        btCancelar.style.display = 'none'
    }

    atualizar()

    frm.reset()
    frm.inTarefa.focus()

})

function renderizar(lista = tarefas) {

    let htmlTodo = ""
    let htmlDoing = ""
    let htmlDone = ""

    if (lista.length === 0) {
        aFazer.innerHTML = "<p>Nenhuma tarefa encontrada.</p>"
        emAndamento.innerHTML = ""
        concluido.innerHTML = ""
        return
    }

    for (let i = 0; i < lista.length; i++) {
        if (lista[i].status === "todo") {
            htmlTodo += `
                <div class="card">

                    <p>${lista[i].tarefa}</p>

                    <button class="avancar" onclick="avancar(${i})">
                        ➜ Avançar
                    </button>

                    <button class="excluir" onclick="excluir(${i})">
                        🗑 Excluir
                    </button>

                    <button class="editar" onclick="editar(${i})">
                        ✏ Editar
                    </button>

                </div>
                `
        }
        else if (lista[i].status === "doing") {
            htmlDoing += ` <div class="card">
                        
                    <p>${lista[i].tarefa}</p>
                        
                    <button class="avancar" onclick="avancar(${i})">
                        ➜ Avançar
                    </button>

                    <button onClick="voltar(${i})">Voltar</button>
                        
                    <button class="excluir" onclick="excluir(${i})">
                        🗑 Excluir
                    </button>

                     <button class="editar" onclick="editar(${i})">
                        ✏ Editar
                    </button>
                        
                </div>
            `
        }
        else if (lista[i].status === "done") {
            htmlDone += `<div class="card">
                        
                    <p>${lista[i].tarefa}</p>

                    <button onClick="voltar(${i})">Voltar</button>
                        
                    <button class="excluir" onclick="excluir(${i})">
                        🗑 Excluir
                    </button>   
                    
                     <button class="editar" onclick="editar(${i})">
                        ✏ Editar
                    </button>

                </div>`
        }
    }

    aFazer.innerHTML = htmlTodo
    emAndamento.innerHTML = htmlDoing
    concluido.innerHTML = htmlDone

}

function avancar(i) {
    if (tarefas[i].status === "todo") {
        tarefas[i].status = "doing"
    } else if (tarefas[i].status === "doing") {
        tarefas[i].status = "done"
    }

    atualizar()
}

function voltar(i) {
    if (tarefas[i].status === "done") {
        tarefas[i].status = "doing"
    } else if (tarefas[i].status === "doing") {
        tarefas[i].status = "todo"
    }

    atualizar()
}

function excluir(i) {

    if (!confirm("Deseja excluir a tarefa?")) {
        return
    }

    tarefas = tarefas.filter((_, index) => index !== i)

    atualizar()
}

function editar(i) {
    indiceEdicao = i

    frm.inTarefa.value = tarefas[i].tarefa

    btAdicionar.textContent = 'Salvar edicao'
    btCancelar.style.display = 'inline-block'

    frm.inTarefa.focus()

}

btCancelar.addEventListener("click", cancelar)

function cancelar() {
    if (!confirm("Deseja Cancelar a edição?")) {
        return
    }

    frm.reset()

    indiceEdicao = -1

    btAdicionar.textContent = "Adicionar"
    btCancelar.style.display = "none"

    frm.inTarefa.focus()
}

inBuscar.addEventListener("input", buscarTarefa)

function buscarTarefa() {

    if (tarefas.length === 0) return


    const texto = inBuscar.value.toLowerCase()

    if (texto === "") {
        renderizar()
        return
    }

    const encontrados = tarefas.filter((tarefa) => tarefa.tarefa.toLowerCase().includes(texto))

    renderizar(encontrados)

}



function atualizar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
    renderizar()

    if (inBuscar.value !== "") {
        buscarTarefa()
    } else {
        renderizar()
    }
}