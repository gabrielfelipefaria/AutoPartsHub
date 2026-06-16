const listaMarcas =
    document.getElementById("listaMarcas");

const buscarMarca =
    document.getElementById("buscarMarca");

let todasMarcas = [];

async function carregarMarcas() {

    try {

        const resposta = await fetch(
            "https://parallelum.com.br/fipe/api/v1/carros/marcas"
        );

        const marcas = await resposta.json();

        todasMarcas = marcas;

        renderizarMarcas(marcas);

    }

    catch (erro) {

        listaMarcas.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Erro ao carregar marcas.
                </div>
            </div>
        `;

        console.error(erro);

    }

}

function renderizarMarcas(marcas) {

    listaMarcas.innerHTML = "";

    if (marcas.length === 0) {

        listaMarcas.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    Nenhuma marca encontrada.
                </div>
            </div>
        `;

        return;
    }

    marcas.forEach(marca => {

        listaMarcas.innerHTML += `

            <div class="col-md-6 col-lg-4">

                <div class="vehicle-card">

                    <div class="vehicle-body">

                        <div class="d-flex justify-content-between">

                            <h4>
                                ${marca.nome}
                            </h4>

                            <span class="badge bg-primary">
                                ${marca.codigo}
                            </span>

                        </div>

                        <p class="text-muted mt-2">

                            Marca disponível para consulta
                            de veículos.

                        </p>

                        <a href="veiculos.html"
                            class="btn btn-primary w-100">

                            <i class="bi bi-search"></i>

                            Consultar Veículos

                        </a>

                    </div>

                </div>

            </div>

        `;

    });

}

buscarMarca.addEventListener("input", () => {

    const termo =
        buscarMarca.value.toLowerCase();

    const filtradas =
        todasMarcas.filter(marca =>
            marca.nome.toLowerCase().includes(termo)
        );

    renderizarMarcas(filtradas);

});

carregarMarcas();