function obterFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(favoritos) {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function adicionarFavorito(veiculo) {
    const favoritos = obterFavoritos();

    const jaExiste = favoritos.some(item =>
        item.CodigoFipe === veiculo.CodigoFipe &&
        item.Modelo === veiculo.Modelo
    );

    if (!jaExiste) {
        favoritos.push(veiculo);
        salvarFavoritos(favoritos);
        mostrarToast("Veículo adicionado aos favoritos.");
    } else {
        mostrarToast("Este veículo já está nos favoritos.");
    }

    console.log("Favoritos salvos:", obterFavoritos());
}

function mostrarToast(mensagem) {
    const toastTexto = document.getElementById("toastTexto");
    const toastElemento = document.getElementById("toastMsg");

    if (toastTexto && toastElemento && typeof bootstrap !== "undefined") {
        toastTexto.textContent = mensagem;
        const toast = new bootstrap.Toast(toastElemento);
        toast.show();
    } else {
        alert(mensagem);
    }
}