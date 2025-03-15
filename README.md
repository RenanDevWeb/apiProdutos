## as bibliotecas que usamos no projeto 

- mysql2 = "usada para criar a conexão junto ao banco de dados mysql"
- body-parser = "usada para que possamos enviar junto objetos para o banco"
- cors = "permite conexões em formato localhost"
- express = usado para criar o servidor que vai conter a api"
- nodemon = usado para dar recaregamento automatico na pagina 


index.js

nesse arquivos temos o servidor que ira rodar a api em si onde 

.get("/")  => lista a pagina inicial 
.get("/produtos") => lista todos os produtos que estão no banco 
.post("/produtos") => inseri itens no banco  de dados 
