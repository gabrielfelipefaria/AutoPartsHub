const API_BASE = "https://parallelum.com.br/fipe/api/v1/carros";

const selectMarca = document.getElementById("marca");
const selectModelo = document.getElementById("modelo");
const selectAno = document.getElementById("ano");
const btnConsultar = document.getElementById("btnConsultar");
const btnLimpar = document.getElementById("btnLimpar");
const resultado = document.getElementById("resultado");
const loading = document.getElementById("loading");

async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar dados da API.");
    }

    return await resposta.json();
}

async function carregarMarcas() {
    try {
        const marcas = await buscarDados(`${API_BASE}/marcas`);

        selectMarca.innerHTML = `<option value="">Selecione uma marca</option>`;

        marcas.forEach(marca => {
            selectMarca.innerHTML += `
                <option value="${marca.codigo}">
                    ${marca.nome}
                </option>
            `;
        });

    } catch (erro) {
        selectMarca.innerHTML = `<option value="">Erro ao carregar marcas</option>`;
        console.error(erro);
    }
}

async function carregarModelos() {
    const marca = selectMarca.value;

    selectModelo.innerHTML = `<option value="">Carregando modelos...</option>`;
    selectModelo.disabled = true;

    selectAno.innerHTML = `<option value="">Selecione um modelo</option>`;
    selectAno.disabled = true;
    btnConsultar.disabled = true;

    if (!marca) return;

    try {
        const dados = await buscarDados(`${API_BASE}/marcas/${marca}/modelos`);

        selectModelo.innerHTML = `<option value="">Selecione um modelo</option>`;

        dados.modelos.forEach(modelo => {
            selectModelo.innerHTML += `
                <option value="${modelo.codigo}">
                    ${modelo.nome}
                </option>
            `;
        });

        selectModelo.disabled = false;

    } catch (erro) {
        selectModelo.innerHTML = `<option value="">Erro ao carregar modelos</option>`;
        console.error(erro);
    }
}

async function carregarAnos() {
    const marca = selectMarca.value;
    const modelo = selectModelo.value;

    selectAno.innerHTML = `<option value="">Carregando anos...</option>`;
    selectAno.disabled = true;
    btnConsultar.disabled = true;

    if (!marca || !modelo) return;

    try {
        const anos = await buscarDados(`${API_BASE}/marcas/${marca}/modelos/${modelo}/anos`);

        selectAno.innerHTML = `<option value="">Selecione ano/versão</option>`;

        anos.forEach(ano => {
            selectAno.innerHTML += `
                <option value="${ano.codigo}">
                    ${ano.nome}
                </option>
            `;
        });

        selectAno.disabled = false;

    } catch (erro) {
        selectAno.innerHTML = `<option value="">Erro ao carregar anos</option>`;
        console.error(erro);
    }
}

async function consultarVeiculo() {
    const marca = selectMarca.value;
    const modelo = selectModelo.value;
    const ano = selectAno.value;

    if (!marca || !modelo || !ano) {
        mostrarToast("Selecione marca, modelo e ano.");
        return;
    }

    try {
        loading.classList.remove("d-none");
        resultado.innerHTML = "";

        const veiculo = await buscarDados(
            `${API_BASE}/marcas/${marca}/modelos/${modelo}/anos/${ano}`
        );

        loading.classList.add("d-none");

        resultado.innerHTML = `
            <div class="col-lg-6">
                <div class="vehicle-card">
                    <div class="vehicle-body">
                        <span class="badge bg-primary mb-3">Resultado FIPE</span>

                        <h3 class="vehicle-title">
                            ${veiculo.Marca} ${veiculo.Modelo}
                        </h3>

                        <p class="text-muted">
                            Consulta realizada com dados dinâmicos da API FIPE.
                        </p>

                        <div class="row g-3 mt-3">
                            <div class="col-md-6">
                                <div class="info-mini">
                                    <strong>Valor</strong>
                                    <span>${veiculo.Valor}</span>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="info-mini">
                                    <strong>Ano Modelo</strong>
                                    <span>${veiculo.AnoModelo}</span>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="info-mini">
                                    <strong>Combustível</strong>
                                    <span>${veiculo.Combustivel}</span>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="info-mini">
                                    <strong>Código FIPE</strong>
                                    <span>${veiculo.CodigoFipe}</span>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="info-mini">
                                    <strong>Mês Referência</strong>
                                    <span>${veiculo.MesReferencia}</span>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="info-mini">
                                    <strong>Tipo</strong>
                                    <span>${veiculo.TipoVeiculo}</span>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary mt-4" onclick='adicionarFavorito(${JSON.stringify(veiculo)})'>
                            <i class="bi bi-heart"></i>
                            Adicionar aos Favoritos
                        </button>
                    </div>
                </div>
            </div>
        `;

        registrarConsulta(veiculo);

    } catch (erro) {
        loading.classList.add("d-none");

        resultado.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Não foi possível consultar este veículo. Tente novamente.
                </div>
            </div>
        `;

        console.error(erro);
    }
}

function registrarConsulta(veiculo) {
    const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

    consultas.push({
        marca: veiculo.Marca,
        modelo: veiculo.Modelo,
        valor: veiculo.Valor,
        data: new Date().toLocaleString("pt-BR")
    });

    localStorage.setItem("consultas", JSON.stringify(consultas));
}

function limparFiltros() {
    selectMarca.value = "";
    selectModelo.innerHTML = `<option value="">Selecione uma marca</option>`;
    selectModelo.disabled = true;

    selectAno.innerHTML = `<option value="">Selecione um modelo</option>`;
    selectAno.disabled = true;

    btnConsultar.disabled = true;

    resultado.innerHTML = `
        <div class="col-12">
            <div class="card-custom text-center">
                <i class="bi bi-car-front fs-1 text-primary"></i>
                <h4 class="mt-3">Nenhum veículo consultado</h4>
                <p class="text-muted mb-0">
                    Escolha uma marca, modelo e ano para visualizar as informações.
                </p>
            </div>
        </div>
    `;
}

selectMarca.addEventListener("change", carregarModelos);
selectModelo.addEventListener("change", carregarAnos);
selectAno.addEventListener("change", () => {
    btnConsultar.disabled = !selectAno.value;
});

btnConsultar.addEventListener("click", consultarVeiculo);
btnLimpar.addEventListener("click", limparFiltros);

carregarMarcas();