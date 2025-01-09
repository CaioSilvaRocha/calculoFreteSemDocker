const mysql2 = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const criarConexaoAntesDefinicaoBancoDados = () => {
    const conexaoAntesDefinicaoBancoDados = mysql2.createConnection({
        /*host: process.env.host,
        user: process.env.user,
        password: process.env.password*/

        host: "baw3wphaqmikgz4l2xpc-mysql.services.clever-cloud.com",
        user: "umfihs9ywx7ez2vn",
        password: "OklB4Navnp7GRfqzyKpU"
    });

    return conexaoAntesDefinicaoBancoDados;
};

const criarConexaoDepoisDefinicaoBancoDados = () =>{
    const conexaoDepoisDefinicaoBancoDados = mysql2.createConnection({
        /*host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database*/

        host: "baw3wphaqmikgz4l2xpc-mysql.services.clever-cloud.com",
        user: "umfihs9ywx7ez2vn",
        password: "OklB4Navnp7GRfqzyKpU",
        database: "baw3wphaqmikgz4l2xpc" 
    });

    return conexaoDepoisDefinicaoBancoDados;
};

module.exports = {
    criarConexaoAntesDefinicaoBancoDados,
    criarConexaoDepoisDefinicaoBancoDados
};
