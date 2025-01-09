const mysql2 = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const criarConexaoAntesDefinicaoBancoDados = () => {
    const conexaoAntesDefinicaoBancoDados = mysql2.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password
    });

    return conexaoAntesDefinicaoBancoDados;
};

const criarConexaoDepoisDefinicaoBancoDados = () =>{
    const conexaoDepoisDefinicaoBancoDados = mysql2.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });

    return conexaoDepoisDefinicaoBancoDados;
};

module.exports = {
    criarConexaoAntesDefinicaoBancoDados,
    criarConexaoDepoisDefinicaoBancoDados
};