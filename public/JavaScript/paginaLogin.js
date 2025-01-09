const inputsEntrada = document.querySelectorAll("input");
const campoEntradaNomeUsuario = document.querySelector("#inputEntradaNomeUsuario");
const campoEntradaSenha = document.querySelector("#inputEntradaSenha");
const botaoAcessar = document.querySelector("#buttonAcessar");
const campoResultadoLogin = document.querySelector("#divResultadoLogin");

inputsEntrada.forEach(entrada => {
    entrada.addEventListener("focus", evento => {
        campoResultadoLogin.innerHTML = "";
    });

    entrada.addEventListener("keyup", evento => {
        entrada.value = entrada.value.toLowerCase();

        if(campoEntradaNomeUsuario.value !== "" && campoEntradaSenha.value !== ""){
            botaoAcessar.removeAttribute("disabled");
            botaoAcessar.classList.remove("botaoDesabilitado");
            botaoAcessar.classList.add("botaoHabilitado");
        }else{
            botaoAcessar.setAttribute("disabled", "");
            botaoAcessar.classList.remove("botaoHabilitado");
            botaoAcessar.classList.add("botaoDesabilitado");
        }
    });
});

botaoAcessar.addEventListener("click", async evento => {
    botaoAcessar.setAttribute("disabled", "");
    botaoAcessar.classList.remove("botaoHabilitado");
    botaoAcessar.classList.add("botaoDesabilitado");

    await fetch("/acessarConta", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(
        {nomeUsuario: campoEntradaNomeUsuario.value, senha: campoEntradaSenha.value}
    )}).then(resposta => resposta.json()).then(async dados => {
        if(dados.resultadoLogin === "sucesso"){

            campoResultadoLogin.innerHTML = `<p id="paragrafoSucessoLogin">Sucesso!</p>`;

            setTimeout(() => {
                window.location.href = `/paginaPrincipal/${dados.webToken}`;
            }, "1500");
        }else{
            campoResultadoLogin.innerHTML = `<p id="paragrafoErroLogin">Dados inválidos!</p>`;

            inputsEntrada.forEach(entrada => {
                entrada.addEventListener("input", evento => {
                    botaoAcessar.removeAttribute("disabled");
                    botaoAcessar.classList.remove("botaoDesabilitado");
                    botaoAcessar.classList.add("botaoHabilitado");
                }, {once: true});
            });
        }
    });
});