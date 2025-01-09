const campoHtml = document.querySelector("html");
const campoBody = document.querySelector("body");
const campoTotalConjuntos = document.querySelector("#divTotalConjuntos");
const campoExibicaoHistorico = document.querySelector("#divExibicaoHistorico");
var webToken = ""
const linkPaginaPrincipal = document.querySelector("#linkPaginaPrincipal");

window.onload = async evento => {
    webToken = window.location.pathname.slice(17);

    linkPaginaPrincipal.setAttribute("href", `/paginaPrincipal/${webToken}`);

    await fetch(`/obterHistoricos/${webToken}`, {method: "GET"}).then(resposta => resposta.json()).then(dados => {
        campoTotalConjuntos.innerHTML = `<p id="paragrafoTotalConjuntos">Total de Conjuntos: ${dados.length}</p>`;

        if(dados.length > 0){
            campoHtml.style.justifyContent = "normal";
            campoBody.style.paddingTop = "20px";

            var comandoHTML = "";

            dados.forEach(dado => {
                comandoHTML += `
                <div id="divHistorico${dado.idHistoricoCalculoFrete}" class="historico">
                    <div id="divParagrafoLocalOrigem${dado.idHistoricoCalculoFrete}" class="divHistoricoNormal divHistoricoAjustavel">
                        <div class="divTexto divHistoricoAjustavelEspecifico">
                            <p>Origem:</p>
                        </div>
                        <div class="divValor">
                            <p>${dado.localOrigem}</p>
                        </div>
                    </div>
                    <div id="divParagrafoLocalDestino${dado.idHistoricoCalculoFrete}" class="divHistoricoNormal divHistoricoAjustavel">
                        <div class="divTexto divHistoricoAjustavelEspecifico">
                            <p>Destino:</p>
                        </div>
                        <div class="divValor">
                            <p>${dado.localDestino}</p>
                        </div>
                    </div>
                    <div id="divDadosNumericos${dado.idHistoricoCalculoFrete}" class="divDadosNumericos divHistoricoAjustavel">
                        <div id="divParagrafoDistanciaLocalidades${dado.idHistoricoCalculoFrete}" class="divHistorico divHistoricoAjustavel">
                            <div class="divTexto">
                                <p>Distância:</p>
                            </div>
                            <div class="divValor">
                                <p>${dado.distanciaLocalidades} km</p>
                            </div>
                        </div>
                        <div id="divParagrafoConsumoAutomovel${dado.idHistoricoCalculoFrete}" class="divHistorico divHistoricoAjustavel">
                            <div class="divTexto">
                                <p>Consumo do automóvel:</p>
                            </div>
                            <div class="divValor">
                                <p>${dado.consumoAutomovel} km/litro</p>
                            </div>
                        </div>
                        <div id="divParagrafoPrecoCombustivel${dado.idHistoricoCalculoFrete}" class="divHistorico divHistoricoAjustavel">
                            <div class="divTexto">
                                <p>Preço do combustível:</p>
                            </div>
                            <div class="divValor">
                                <p>R$ ${dado.precoCombustivel}</p>
                            </div>
                        </div>
                        <div id="divParagrafoValorLucro${dado.idHistoricoCalculoFrete}" class="divHistorico divHistoricoAjustavel">
                            <div class="divTexto">
                                <p>Lucro:</p>
                            </div>
                            <div class="divValor">
                                <p>R$ ${dado.valorLucro}</p>
                            </div>
                        </div>
                        <div id="divParagrafoFrete${dado.idHistoricoCalculoFrete}" class="divHistorico">
                            <div class="divTexto">
                                <p>Frete:</p>
                            </div>
                            <div class="divValor">
                                <p>R$ ${dado.valorViagem}</p>
                            </div>
                        </div>
                    </div>
                    <div id="divParagrafoDescricaoLucro${dado.idHistoricoCalculoFrete}" class="divDescricaoLucro">
                        <div id="divParagrafoDescricaoLucro" class="divHistoricoAjustavel divHistoricoAjustavelEspecifico">
                            <p id="paragrafoDescricaoLucro">Descrição do lucro:</p>
                        </div>
                        <div>
                            <p><abbr title="${dado.descricaoLucro}">[...]</abbr></p>
                        </div>
                    </div>
                </div>`;
            });

            campoExibicaoHistorico.innerHTML = comandoHTML;
        }
    });
};