const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const totalConsultas = document.getElementById("totalConsultas");
const totalFavoritos = document.getElementById("totalFavoritos");
const marcaMaisBuscada = document.getElementById("marcaMaisBuscada");
const ultimaConsulta = document.getElementById("ultimaConsulta");
const resumoDashboard = document.getElementById("resumoDashboard");

totalConsultas.textContent = consultas.length;
totalFavoritos.textContent = favoritos.length;

function contarMarcas() {
    const contagem = {};

    consultas.forEach(item => {
        contagem[item.marca] = (contagem[item.marca] || 0) + 1;
    });

    return contagem;
}

const marcasContadas = contarMarcas();

const marcas = Object.keys(marcasContadas);
const valores = Object.values(marcasContadas);

if (consultas.length > 0) {
    const marcaTop = marcas.reduce((a, b) =>
        marcasContadas[a] > marcasContadas[b] ? a : b
    );

    marcaMaisBuscada.textContent = marcaTop;
    ultimaConsulta.textContent = consultas[consultas.length - 1].marca;

    resumoDashboard.innerHTML = `
        <p><strong>Total de consultas:</strong> ${consultas.length}</p>
        <p><strong>Total de favoritos:</strong> ${favoritos.length}</p>
        <p><strong>Marca mais pesquisada:</strong> ${marcaTop}</p>
        <p><strong>Última consulta:</strong> ${consultas[consultas.length - 1].modelo}</p>
    `;
} else {
    marcaMaisBuscada.textContent = "-";
    ultimaConsulta.textContent = "-";
}

const ctx = document.getElementById("graficoMarcas");

new Chart(ctx, {
    type: "bar",
    data: {
        labels: marcas.length ? marcas : ["Sem dados"],
        datasets: [{
            label: "Consultas",
            data: valores.length ? valores : [0],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    }
});