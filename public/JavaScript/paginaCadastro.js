const campoMensagemPreenchimento = document.querySelector("#divMensagemPreenchimento");
const inputsEntrada = document.querySelectorAll("input");
const campoEntradaNome = document.querySelector("#inputEntradaNome");
const campoEntradaCpf = document.querySelector("#inputEntradaCpf");
const campoEntradaEmail = document.querySelector("#inputEntradaEmail");
const campoEntradaNomeUsuario = document.querySelector("#inputEntradaNomeUsuario");
const campoEntradaSenha = document.querySelector("#inputEntradaSenha");
const botaoCadastrar = document.querySelector("#buttonCadastrar");
const campoResultadoCadastro = document.querySelector("#divResultadoCadastro");

function validarCpf(cpf) {
	cpf = cpf.replace(/\D+/g, '');

	if (cpf.length !== 11) return false;

	let soma = 0;
	let resto;

	if (/^(\d)\1{10}$/.test(cpf)) return false;

	for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
	
    resto = (soma * 10) % 11;

	if ((resto === 10) || (resto === 11)) resto = 0;
	if (resto !== parseInt(cpf.substring(9, 10))) return false;

	soma = 0;

	for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);

	resto = (soma * 10) % 11;

	if ((resto === 10) || (resto === 11)) resto = 0;
	if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validarEmail(campoEmail){
    usuario = campoEmail.value.substring(0, campoEmail.value.indexOf("@"));
    dominio = campoEmail.value.substring(campoEmail.value.indexOf("@")+ 1, campoEmail.value.length);
    
    if((usuario.length >=1) && (dominio.length >=3) && (usuario.search("@")==-1) && (dominio.search("@")==-1) && (usuario.search(" ")==-1) && (dominio.search(" ")==-1) && (dominio.search(".")!=-1) && (dominio.indexOf(".") >=1) && (dominio.lastIndexOf(".") < dominio.length - 1)){ 
        return true;
    }
    else{
        return false;
    }
}

inputsEntrada.forEach(entrada => {
    entrada.addEventListener("focus", evento => {
        campoResultadoCadastro.innerHTML = "";
    })
    
    entrada.addEventListener("keyup", evento => {
        campoEntradaEmail.value = campoEntradaEmail.value.toLowerCase();
        campoEntradaNomeUsuario.value = campoEntradaNomeUsuario.value.toLowerCase();

        if(campoEntradaNome.value !== "" && campoEntradaCpf.value !== "" && campoEntradaEmail.value !== "" && campoEntradaNomeUsuario.value !== "" && campoEntradaSenha.value !== ""){
            campoMensagemPreenchimento.innerHTML = "";
            
            botaoCadastrar.removeAttribute("disabled");
            botaoCadastrar.classList.remove("botaoDesabilitado");
            botaoCadastrar.classList.add("botaoHabilitado");
        }else{
            campoMensagemPreenchimento.innerHTML = `<p id="paragrafoMensagemPreenchimento">Preencha todos os campos!</p>`;

            botaoCadastrar.setAttribute("disabled", "");
            botaoCadastrar.classList.remove("botaoHabilitado");
            botaoCadastrar.classList.add("botaoDesabilitado");
        }
    });
});

botaoCadastrar.addEventListener("click", async evento => {
    botaoCadastrar.setAttribute("disabled", "");
    botaoCadastrar.classList.remove("botaoHabilitado");
    botaoCadastrar.classList.add("botaoDesabilitado");

    campoResultadoCadastro.innerHTML = "";

    if(!validarCpf(campoEntradaCpf.value)){
        campoResultadoCadastro.insertAdjacentHTML("beforeend", `<p id="paragrafoErroCadastro">CPF inválido!</p>`);

        inputsEntrada.forEach(entrada => {
            entrada.addEventListener("input", evento => {
                botaoCadastrar.removeAttribute("disabled");
                botaoCadastrar.classList.remove("botaoDesabilitado");
                botaoCadastrar.classList.add("botaoHabilitado");
            });
        }, {once: true});
    }

    if(!validarEmail(campoEntradaEmail)){
        campoResultadoCadastro.insertAdjacentHTML("beforeend", `<p id="paragrafoErroCadastro">Email inválido!</p>`);

        inputsEntrada.forEach(entrada => {
            entrada.addEventListener("input", evento => {
                botaoCadastrar.removeAttribute("disabled");
                botaoCadastrar.classList.remove("botaoDesabilitado");
                botaoCadastrar.classList.add("botaoHabilitado");
            });
        }, {once: true});
    }

    if(validarCpf(campoEntradaCpf.value) && validarEmail(campoEntradaEmail)){
        await fetch("/cadastrarConta", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(
            {nome: campoEntradaNome.value, cpf: campoEntradaCpf.value, email: campoEntradaEmail.value, nomeUsuario: campoEntradaNomeUsuario.value, senha: campoEntradaSenha.value}
        )}).then(resposta => resposta.json()).then(dados => {
            if(dados.resultadoCadastro === "sucesso"){
                campoResultadoCadastro.innerHTML = `<p id="paragrafoSucessoCadastro">Sucesso!</p>`;

                setTimeout(() => {
                    window.location.reload();
                }, "1500");
            }else{
                campoResultadoCadastro.innerHTML = "";
    
                if(dados.objetoRetornoVerificacoes.cpf === "erro"){
                    campoResultadoCadastro.insertAdjacentHTML("beforeend", `<p id="paragrafoErroCadastro">CPF existente!</p>`);
                }
    
                if(dados.objetoRetornoVerificacoes.email === "erro"){
                    campoResultadoCadastro.insertAdjacentHTML("beforeend", `<p id="paragrafoErroCadastro">Email existente!</p>`);
                }
    
                if(dados.objetoRetornoVerificacoes.nomeUsuario === "erro"){
                    campoResultadoCadastro.insertAdjacentHTML("beforeend", `<p id="paragrafoErroCadastro">Nome de usuário existente!</p>`);
                }

                inputsEntrada.forEach(entrada => {
                    entrada.addEventListener("input", evento => {
                        botaoCadastrar.removeAttribute("disabled");
                        botaoCadastrar.classList.remove("botaoDesabilitado");
                        botaoCadastrar.classList.add("botaoHabilitado");
                    });
                }, {once: true});
            }
        });
    }
});