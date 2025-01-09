const express = require("express");
const jsonWebToken = require("jsonwebtoken");
const hashSenha = require("bcrypt");
const conexoesBancoDados = require("../bancoDados/conexoesBancoDados");

const rodadasIncrementoSenha = 10

const middlewareAutenticacaoWebToken = (requisicao, resposta, prosseguir) => {
    const webToken = requisicao.params.webToken;

    if(!webToken){
        return resposta.status(403).json({resultadoAutenticacaoWebToken: "Ausência de web token!"});
    }

    jsonWebToken.verify(webToken, process.env.chaveSecretaJsonWebToken, (erro, usuario) => {
        if(erro){
            return resposta.status(403).json({resultadoAutenticacaoWebToken: "Web token inválido!"});
        }

        requisicao.user = usuario;
        prosseguir();
    });
};

const rotas = express.Router();

rotas.get("/", (requisicao, resposta) => {
    resposta.sendFile("paginaLogin.html", {root: "./public/HTML"});
});

rotas.get("/obterHistoricos/:webToken", middlewareAutenticacaoWebToken, async (requisicao, resposta) => {
    const idContaUsuario = requisicao.user.idContaUsuario;

    const conexaoDepoisDefinicaoBancoDados = conexoesBancoDados.criarConexaoDepoisDefinicaoBancoDados();

    conexaoDepoisDefinicaoBancoDados.connect(erroConexao => {
        if(erroConexao) throw erroConexao;
        
        const comandoObtencaoHistoricos = `SELECT * FROM historicos_calculos_fretes WHERE idContaUsuario=?;`;

        conexaoDepoisDefinicaoBancoDados.query(comandoObtencaoHistoricos, [idContaUsuario], (erroObtencao, retornoObtencao) => {
            if(erroObtencao) throw erroObtencao;

            resposta.json(retornoObtencao);
        });
    });
});

rotas.get("/paginaCadastro", (requisicao, resposta) => {
    resposta.sendFile("paginaCadastro.html", {root: "./public/HTML"});
});

rotas.get("/paginaHistorico/:webToken", middlewareAutenticacaoWebToken, (requisicao, resposta) => {
    resposta.sendFile("paginaHistorico.html", {root: "./public/HTML"});
});

rotas.get("/paginaPrincipal/:webToken", middlewareAutenticacaoWebToken, (requisicao, resposta) => {
    resposta.sendFile("paginaPrincipal.html", {root: "./public/HTML"});
});

rotas.post("/acessarConta", async (requisicao, resposta) => {
    const {nomeUsuario, senha} = requisicao.body;

    const conexaoDepoisDefinicaoBancoDados = conexoesBancoDados.criarConexaoDepoisDefinicaoBancoDados();

    conexaoDepoisDefinicaoBancoDados.connect(erroConexao => {
        if(erroConexao) throw erroConexao;

        const comandoVerificacaoExistenciaConta = `SELECT * FROM contas_usuarios WHERE nomeUsuario=?;`;

        conexaoDepoisDefinicaoBancoDados.query(comandoVerificacaoExistenciaConta, [nomeUsuario], async (erroVerificacao, retornoVerificacao) => {
            if(erroVerificacao) throw erroVerificacao;
            
            if(retornoVerificacao.length === 1){
                retornoComparacaoSenha = await hashSenha.compare(senha, retornoVerificacao[0].senha)

                if(retornoComparacaoSenha){
                    const webToken = jsonWebToken.sign({idContaUsuario: retornoVerificacao[0].idContaUsuario}, process.env.chaveSecretaJsonWebToken, {expiresIn: "1h"}); 

                    resposta.status(200).json({resultadoLogin: "sucesso", webToken});
                }else{
                    resposta.status(401).json({resultadoLogin: "erro"});
                }
            }else{
                resposta.status(401).json({resultadoLogin: "erro"});
            }
        });
    });
});

rotas.post("/cadastrarConta", async (requisicao, resposta) => {
    const {nome, cpf, email, nomeUsuario, senha} = requisicao.body;

    const conexaoDepoisDefinicaoBancoDados = conexoesBancoDados.criarConexaoDepoisDefinicaoBancoDados();

    conexaoDepoisDefinicaoBancoDados.connect(erroConexao => {
        if(erroConexao) throw erroConexao;
        
        const comandoVerificacaoExistenciaCpf = `SELECT * FROM contas_usuarios WHERE cpf=?;`;
        const comandoVerificacaoExistenciaEmail = `SELECT * FROM contas_usuarios WHERE email=?;`;
        const comandoVerificacaoExistenciaNomeUsuario = `SELECT * FROM contas_usuarios WHERE nomeUsuario=?;`;

        conexaoDepoisDefinicaoBancoDados.query(comandoVerificacaoExistenciaCpf, [cpf], async (erroVerificacaoCpf, retornoVerificacaoCpf) => {
            if(erroVerificacaoCpf) throw erroVerificacaoCpf;
            
            var objetoRetornoVerificacoes = {}

            if(retornoVerificacaoCpf.length === 0){
                objetoRetornoVerificacoes.cpf = "sucesso";
            }else{
                objetoRetornoVerificacoes.cpf = "erro";
            }

            conexaoDepoisDefinicaoBancoDados.query(comandoVerificacaoExistenciaEmail, [email], async (erroVerificacaoEmail, retornoVerificacaoEmail) => {
                if(erroVerificacaoEmail) throw erroVerificacaoEmail;

                if(retornoVerificacaoEmail.length === 0){
                    objetoRetornoVerificacoes.email = "sucesso";
                }else{
                    objetoRetornoVerificacoes.email = "erro";
                }

                conexaoDepoisDefinicaoBancoDados.query(comandoVerificacaoExistenciaNomeUsuario, [nomeUsuario], async (erroVerificacaoNomeUsuario, retornoVerificacaoNomeUsuario) => {
                    if(erroVerificacaoNomeUsuario) throw erroVerificacaoNomeUsuario;

                    if(retornoVerificacaoNomeUsuario.length === 0){
                        objetoRetornoVerificacoes.nomeUsuario = "sucesso";
                    }else{
                        objetoRetornoVerificacoes.nomeUsuario = "erro";
                    }

                    if((retornoVerificacaoCpf.length === 0) && (retornoVerificacaoEmail.length === 0) && (retornoVerificacaoNomeUsuario.length === 0)){
                        const retornoHash = await hashSenha.hash(senha, rodadasIncrementoSenha);

                        const comandoCadastroConta = `INSERT INTO contas_usuarios (nome, cpf, email, nomeUsuario, senha) VALUES (?, ?, ?, ?, ?);`;

                        conexaoDepoisDefinicaoBancoDados.query(comandoCadastroConta, [nome, cpf, email, nomeUsuario, retornoHash], (erroCadastro, retornoCadastro) => {
                            if(erroCadastro) throw erroCadastro;

                            resposta.status(200).json({resultadoCadastro: "sucesso", objetoRetornoVerificacoes});
                        });
                    }else{
                        resposta.status(400).json({resultadoCadastro: "erro", objetoRetornoVerificacoes});
                    }
                });
            });
        });
    });
});

rotas.post("/salvarCalculo/:webToken", middlewareAutenticacaoWebToken, async (requisicao, resposta) => {
    const idContaUsuario = requisicao.user.idContaUsuario;

    const {localOrigem, localDestino, distanciaLocalidades, consumoAutomovel, precoCombustivel, valorLucro, descricaoLucro, valorViagem} = requisicao.body;

    const conexaoDepoisDefinicaoBancoDados = conexoesBancoDados.criarConexaoDepoisDefinicaoBancoDados();

    conexaoDepoisDefinicaoBancoDados.connect(erroConexao => {
        if(erroConexao) throw erroConexao;
        
        const comandoVerificacaoExistenciaCalculo = `SELECT * FROM historicos_calculos_fretes WHERE idContaUsuario=? AND localOrigem=? AND localDestino=? AND distanciaLocalidades=? AND consumoAutomovel=? AND precoCombustivel=? AND valorLucro=? AND descricaoLucro=?;`;

        conexaoDepoisDefinicaoBancoDados.query(comandoVerificacaoExistenciaCalculo, [idContaUsuario, localOrigem, localDestino, distanciaLocalidades, consumoAutomovel, precoCombustivel, valorLucro, descricaoLucro], (erroVerificacao, retornoVerificacao) => {
            if(erroVerificacao) throw erroVerificacao;
            
            if(retornoVerificacao.length === 0){
                const comandoArmazenamentoCalculo = `INSERT INTO historicos_calculos_fretes (idContaUsuario, localOrigem, localDestino, distanciaLocalidades, consumoAutomovel, precoCombustivel, valorLucro, descricaoLucro, valorViagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

                conexaoDepoisDefinicaoBancoDados.query(comandoArmazenamentoCalculo, [idContaUsuario, localOrigem, localDestino, distanciaLocalidades, consumoAutomovel, precoCombustivel, valorLucro, descricaoLucro, valorViagem], (erroArmazenamento, retornoArmazenamento) => {
                    if(erroArmazenamento) throw erroArmazenamento;
                    
                    resposta.status(200).json({resultadoArmazenamento: "sucesso"});
                });
            }else{
                resposta.status(400).json({resultadoArmazenamento: "erro"});
            }
        });
    });
});

module.exports = rotas;