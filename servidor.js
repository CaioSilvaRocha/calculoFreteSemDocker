const app = require("./componentesServidor/app");
const dotenv = require("dotenv");
//const consultasBancoDados = require("./bancoDados/consultasBancoDados");

dotenv.config();

//consultasBancoDados.criarBancoDados();

app.listen(process.env.portaServidor, () => {
    console.log(`\nServidor ativo!`);
});
