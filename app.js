import {
  getContatos,
  criarContato,
  atualizarContato,
  deletarContato
} from "./contatos.js"

const form = document.getElementById("form-contato")
const lista = document.getElementById("lista-contatos")

let editandoId = null

// LISTAR
async function carregarContatos() {
  lista.innerHTML = "Carregando..."

  try {
    const contatos = await getContatos()

    lista.innerHTML = ""

    contatos.forEach(c => {
      const div = document.createElement("div")
      div.classList.add("card")

      div.innerHTML = `
        <img src="${c.foto || 'https://via.placeholder.com/80'}">
        <div class="card-info">
          <h3>${c.nome}</h3>
          <p>${c.celular}</p>
          <p>${c.email || ''}</p>
          <p>${c.cidade || ''}</p>
        </div>
        <div>
          <button onclick="editar(${c.id})">Editar</button>
          <button onclick="remover(${c.id})">Excluir</button>
        </div>
      `

      lista.appendChild(div)
    })

  } catch {
    lista.innerHTML = "Erro ao carregar contatos"
  }
}

// SALVAR
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const contato = {
    nome: nome.value,
    celular: celular.value,
    foto: foto.value,
    email: email.value,
    endereco: endereco.value,
    cidade: cidade.value
  }

  try {
    if (editandoId) {
      await atualizarContato(editandoId, contato)
      editandoId = null
    } else {
      await criarContato(contato)
    }

    form.reset()
    carregarContatos()

  } catch {
    alert("Erro ao salvar contato")
  }
})

// DELETAR
window.remover = async (id) => {
  if (!confirm("Deseja excluir?")) return

  try {
    await deletarContato(id)
    carregarContatos()
  } catch {
    alert("Erro ao deletar")
  }
}

// EDITAR
window.editar = async (id) => {
  const contatos = await getContatos()
  const c = contatos.find(c => c.id === id)

  nome.value = c.nome
  celular.value = c.celular
  foto.value = c.foto
  email.value = c.email
  endereco.value = c.endereco
  cidade.value = c.cidade

  editandoId = id
}

// VIA CEP
document.getElementById("cep").addEventListener("focusout", async (e) => {
  const cep = e.target.value

  if (!cep) return

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await res.json()

    endereco.value = data.logradouro || ""
    cidade.value = data.localidade || ""

  } catch {
    console.log("Erro ao buscar CEP")
  }
})

// INICIAR
carregarContatos()