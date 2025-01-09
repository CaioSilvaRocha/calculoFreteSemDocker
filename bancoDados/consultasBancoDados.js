const conexoesBancoDados = require("./conexoesBancoDados");
const dotenv = require("dotenv");

dotenv.config();

const criarBancoDados = () => {
    //const conexaoAntesDefinicaoBancoDados = conexoesBancoDados.criarConexaoAntesDefinicaoBancoDados();
    const conexaoDepoisDefinicaoBancoDados = conexoesBancoDados.criarConexaoDepoisDefinicaoBancoDados();
    
    conexaoDepoisDefinicaoBancoDados.connect(erroConexao => {
        if(erroConexao) throw erroConexao;

        conexaoDepoisDefinicaoBancoDados.query(`DROP DATABASE IF EXISTS baw3wphaqmikgz4l2xpc;`, (erroRemocao, retornoRemocao) => {
            if(erroRemocao) throw erroRemocao;
        });

        conexaoDepoisDefinicaoBancoDados.query(`CREATE DATABASE baw3wphaqmikgz4l2xpc;`, (erroConsulta, retornoConsulta) => {
            if(erroConsulta) throw erroConsulta;

            criarTabelaContasUsuarios();
            criarTabelaHistoricosCalculosFretes();
        });
    }); 
};

const criarTabelaContasUsuarios = () => {
    const conexaoDepoisDefinicaoBancoDados = conexoesBancoDados.criarConexaoDepoisDefinicaoBancoDados();

    conexaoDepoisDefinicaoBancoDados.connect(erroConexao => {
        if(erroConexao) throw erroConexao;
        
        const comandoCriacaoTabelaContasUsuarios = `
            CREATE TABLE IF NOT EXISTS contas_usuarios (
                idContaUsuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                nome VARCHAR(100) NOT NULL,
                cpf VARCHAR(14) NOT NULL, 
                email VARCHAR(100) NOT NULL,
                nomeUsuario VARCHAR(30) NOT NULL,
                senha VARCHAR(1000) NOT NULL
            );
        `;

        conexaoDepoisDefinicaoBancoDados.query(comandoCriacaoTabelaContasUsuarios, (erroConsulta, retornoConsulta) => {
            if(erroConsulta) throw erroConsulta;
        });
    });
};

const criarTabelaHistoricosCalculosFretes = () => {
    const conexaoDepoisDefinicaoBancoDados = conexoesBancoDados.criarConexaoDepoisDefinicaoBancoDados();

    conexaoDepoisDefinicaoBancoDados.connect(erroConexao => {
        if(erroConexao) throw erroConexao;
        
        const comandoCriacaoTabelaHistoricoCalculosViagens = `
            CREATE TABLE IF NOT EXISTS historicos_calculos_fretes (
                idHistoricoCalculoFrete INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                idContaUsuario INT NOT NULL,
                localOrigem VARCHAR(300) NOT NULL,
                localDestino VARCHAR(300) NOT NULL,
                distanciaLocalidades VARCHAR(100) NOT NULL, 
                consumoAutomovel FLOAT NOT NULL,
                precoCombustivel FLOAT NOT NULL,
                valorLucro FLOAT NOT NULL,
                descricaoLucro VARCHAR(1000),
                valorViagem FLOAT NOT NULL
            );
        `;

        conexaoDepoisDefinicaoBancoDados.query(comandoCriacaoTabelaHistoricoCalculosViagens, (erroConsulta, retornoConsulta) => {
            if(erroConsulta) throw erroConsulta;
        });
    });
};

module.exports = {
    criarBancoDados,
    criarTabelaContasUsuarios,
    criarTabelaHistoricosCalculosFretes
};
