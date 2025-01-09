/* ERRO: PERMITE REPETIÇÃO DE ARMAZENAMENTO PARA UM MESMO GRUPO DE ENTRADAS */
/* ERRO: OCORRÊNCIAS DE ARMAZENAMENTO DUPLO APÓS CLIQUE ÚNICO NO BOTÃO SALVAR*/

const inputsEntrada = document.querySelectorAll(".entradaLivre")
const inputsEntradaObrigatoria = document.querySelectorAll(".entradaObrigatoria");
const campoEntradaLocalOrigem = document.querySelector("#inputEntradaLocalOrigem");
var armazenamentoLocal = window.localStorage;
var valoresArmazenamentoLocal = Object.values(armazenamentoLocal);
const campoOpcoesLocalidadesOrigem = document.querySelector("#opcoesLocalidadesOrigem");
const campoOpcoesLocalidadesDestino = document.querySelector("#opcoesLocalidadesDestino");
const campoEntradaLocalDestino = document.querySelector("#inputEntradaLocalDestino");
const campoEntradaConsumoAutomovel = document.querySelector("#inputEntradaConsumoAutomovel");
const campoEntradaPrecoCombustivel = document.querySelector("#inputEntradaPrecoCombustivel");
const campoEntradaValorLucro = document.querySelector("#inputEntradaValorLucro");
const campoEntradaDescricaoLucro = document.querySelector("#textareaEntradaDescricaoLucro");
const campoFrete = document.querySelector("#divFrete");
const campoConfirmacaoLocalidades = document.querySelector("#divConfirmacaoLocalidades");
const campoResultadoArmazenamento = document.querySelector("#divResultadoArmazenamento");
const botaoCalcular = document.querySelector("#buttonCalcular");
const botaoSalvar = document.querySelector("#buttonSalvar");
var webToken = ""
const linkPaginaHistorico = document.querySelector("#linkPaginaHistorico");

window.onload = (evento) => {
    webToken = window.location.pathname.slice(17);

    linkPaginaHistorico.setAttribute("href", `/paginaHistorico/${webToken}`);

    campoOpcoesLocalidadesOrigem.innerHTML = "";
    campoOpcoesLocalidadesDestino.innerHTML = "";

    valoresArmazenamentoLocal.forEach(valor => {
        campoOpcoesLocalidadesOrigem.insertAdjacentHTML("beforeend", `<option value="${valor}"></option>`);
    
        campoOpcoesLocalidadesDestino.insertAdjacentHTML("beforeend", `<option value="${valor}"></option>`);
    });
};

inputsEntrada.forEach(entrada => {
    entrada.addEventListener("focus", evento => {
        campoResultadoArmazenamento.innerHTML = "";
    })
});

inputsEntradaObrigatoria.forEach(entrada => {
    entrada.addEventListener("keyup", evento => {
        if(campoEntradaLocalOrigem.value !== "" && campoEntradaLocalDestino.value !== "" && campoEntradaConsumoAutomovel.value !== "" && campoEntradaPrecoCombustivel.value !== "" && campoEntradaValorLucro.value !== ""){
            botaoCalcular.removeAttribute("disabled");
            botaoCalcular.classList.remove("botaoDesabilitado");
            botaoCalcular.classList.add("botaoHabilitado");
        }else{
            botaoCalcular.setAttribute("disabled", "");
            botaoCalcular.classList.remove("botaoHabilitado");
            botaoCalcular.classList.add("botaoDesabilitado");
            botaoSalvar.setAttribute("disabled", "");
            botaoSalvar.classList.remove("botaoHabilitado");
            botaoSalvar.classList.add("botaoDesabilitado");
        }
    });
});

botaoCalcular.addEventListener("click", async evento => {
    botaoCalcular.setAttribute("disabled", "");
    botaoCalcular.classList.remove("botaoHabilitado");
    botaoCalcular.classList.add("botaoDesabilitado");

    await fetch(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${campoEntradaLocalOrigem.value}&destinations=${campoEntradaLocalDestino.value}&key=VF3QETqMvc8zvtCOfQ6WXmV1fYvGWmoaqUwek9PRdRI8CfK2brhx9FgxvnnZBb5V`).then(resposta => resposta.json()).then(dados => {
        if(dados.status === "OK"){
            var enderecoOrigem = dados?.origin_addresses[0];
            var enderecoDestino =dados?.destination_addresses[0];
            var distanciaLocalidadesMetros = dados?.rows[0]?.elements[0]?.distance?.value;

            window.localStorage.setItem(enderecoOrigem, enderecoOrigem);
            window.localStorage.setItem(enderecoDestino, enderecoDestino);

            armazenamentoLocal = window.localStorage;
            valoresArmazenamentoLocal = Object.values(armazenamentoLocal);

            campoOpcoesLocalidadesOrigem.innerHTML = "";
            campoOpcoesLocalidadesDestino.innerHTML = "";

            valoresArmazenamentoLocal.forEach(valor => {
                campoOpcoesLocalidadesOrigem.insertAdjacentHTML("beforeend", `<option value="${valor}"></option>`);
            
                campoOpcoesLocalidadesDestino.insertAdjacentHTML("beforeend", `<option value="${valor}"></option>`);
            });
            
            campoConfirmacaoLocalidades.setAttribute("style", "display: block;");
            campoConfirmacaoLocalidades.innerHTML = `<div id="divConfirmacaoPergunta">
                                                        <p><b>OS DADOS DA ROTA ESTÃO CORRETOS?</b></p>
                                                     </div>
                                                     <div id="divConfirmacaoTextos">
                                                        <p id="paragrafoLocalidadeOrigem" class="margemInferiorAjustavel"><b>Localidade de Origem:</b> ${enderecoOrigem}</p>
                                                        <p id="paragrafoLocalidadeDestino" class="margemInferiorAjustavel"><b>Localidade de Destino:</b> ${enderecoDestino}</p>
                                                        <p id="paragrafoDistancia"><b>Distância:</b> ${parseFloat(distanciaLocalidadesMetros/1000).toString().replace(".", ",")} km</p>
                                                     </div>
                                                     <div id="divConfirmacaoBotoes">
                                                        <button id="buttonNegacao" class="botaoHabilitado" type="button">Não</button>
                                                        <button id="buttonConfirmacao" class="botaoHabilitado" type="button">Sim</button>
                                                     </div>`;

            const botaoNegacao = document.querySelector("#buttonNegacao");
            const botaoConfirmacao = document.querySelector("#buttonConfirmacao");

            botaoNegacao.addEventListener("click", evento => {
                campoConfirmacaoLocalidades.setAttribute("style", "display: none;");
                campoConfirmacaoLocalidades.innerHTML = "";
            }, {once: true});
            
            botaoConfirmacao.addEventListener("click", evento => {
                campoConfirmacaoLocalidades.setAttribute("style", "display: none;");
                campoConfirmacaoLocalidades.innerHTML = "";

                botaoSalvar.removeAttribute("disabled");
                botaoSalvar.classList.remove("botaoDesabilitado");
                botaoSalvar.classList.add("botaoHabilitado");
    
                var custoFrete = (((parseFloat(distanciaLocalidadesMetros/1000) / parseFloat(campoEntradaConsumoAutomovel.value)) * parseFloat(campoEntradaPrecoCombustivel.value)) + parseFloat(campoEntradaValorLucro.value)).toFixed(2);
                
                campoFrete.innerHTML = `<p id="paragrafoFrete" valor=${custoFrete}>R$ ${custoFrete}</p>`;
                
                botaoSalvar.addEventListener("click", async evento => {
                    const campoParagrafoFrete = document.querySelector("#paragrafoFrete");
                
                    await fetch(`/salvarCalculo/${webToken}`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(
                        {localOrigem: dados?.origin_addresses[0], localDestino: dados?.destination_addresses[0], distanciaLocalidades: parseFloat(distanciaLocalidadesMetros/1000).toString().replace(".", ","), consumoAutomovel: campoEntradaConsumoAutomovel.value, precoCombustivel: campoEntradaPrecoCombustivel.value, valorLucro: campoEntradaValorLucro.value, descricaoLucro: campoEntradaDescricaoLucro.value, valorViagem: parseFloat(campoParagrafoFrete.getAttribute("valor"))}
                    )}).then(resposta => resposta.json()).then(dados => {
                        if(dados.resultadoArmazenamento === "sucesso"){
                            campoResultadoArmazenamento.innerHTML = `<p id="paragrafoSucessoArmazenamento">Salvo!</p>`;
                        }else{
                            campoResultadoArmazenamento.innerHTML = `<p id="paragrafoErroArmazenamento">Dados existentes!</p>`;
                        }
    
                        botaoSalvar.setAttribute("disabled", "");
                        botaoSalvar.classList.remove("botaoHabilitado");
                        botaoSalvar.classList.add("botaoDesabilitado");
                    });
                }, {once: true});
            }, {once: true});
        }else{
            campoResultadoArmazenamento.innerHTML = `<p id="paragrafoErroArmazenamento">Erro: ${dados.status}!</p>`;
        }

        inputsEntradaObrigatoria.forEach(entrada => {
            entrada.addEventListener("input", evento => {
                botaoCalcular.removeAttribute("disabled");
                botaoCalcular.classList.remove("botaoDesabilitado");
                botaoCalcular.classList.add("botaoHabilitado");

                botaoSalvar.setAttribute("disabled", "");
                botaoSalvar.classList.remove("botaoHabilitado");
                botaoSalvar.classList.add("botaoDesabilitado");

                campoFrete.innerHTML = "";
            }, {once: true});
        });
    });
});