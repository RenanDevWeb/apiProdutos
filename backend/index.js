import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {connection} from './database/database.js'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const App = express()
const PORT = 3000


const options = {
  definition: {
    openapi: '3.0.0', // Definindo a versão da especificação OpenAPI
    info: {
      title: 'Minha API',
      version: '1.0.0',
      description: 'Documentação da API de exemplo',
    },
  },
  apis: ['./index.js'], // Caminho para seus arquivos de rotas, onde você descreverá os endpoints
};


const swaggerSpec = swaggerJsdoc(options);

// Configurando o Swagger UI
App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// informa ao sistema que ira utilizar entradas do tipo json
App.use(express.json());
App.use(bodyParser.json())
App.use(bodyParser.urlencoded({extended: true}))
App.use(cors())




// Definindo a rota base da aplicação
/**
 * @swagger
 * /api//:
 *   get:
 *     description: retorna total de produtos cadastrados no sistema"
 *     responses:
 *       200:
 *         description: Produtos retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   total:
 *                     type: integer
 *                 example:
 *                   total: 2
 *               
 */
App.get("/",(req,resp)=>{
  const query = "SELECT COUNT(*) as total FROM produtos"
  connection.query(query,(err,data) => {
    if(err) return  resp.status(404).json(err)
         
    return resp.status(200).json(data)
  })

 
})

// Pega todos os produtos no banco
/**
 * @swagger
 * /api/produtos:
 *   get:
 *     description: Retorna todos os produtos no banco
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                 example:
 *                   id: 1
 *                   name: "Produto 1"
 *                   price: 19.99
 */ 
App.get('/produtos',(req,resp)=> {
    const query = "SELECT * FROM produtos"
   console.log(query);
    connection.query(query,(err, data) => {
        if(err) return  resp.status(404).json(err)
        return resp.status(200).json(data)

    })
})



// Rota para pegar o produto por ID
/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     description: Retorna um produto baseado no código fornecido
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Código do produto para buscar no banco de dados
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigoProduto:
 *                     type: integer
 *                     description: Código do produto
 *                     example: 2
 *                   nome:
 *                     type: string
 *                     description: Nome do produto
 *                     example: "Caneca queca"
 *                   descrisao:
 *                     type: string
 *                     description: Descrição do produto
 *                     example: "teste"
 *                   preco:
 *                     type: number
 *                     format: float
 *                     description: Preço do produto
 *                     example: 0
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
App.get('/produtos/:id',(req,resp)=> {
  const query = "SELECT * FROM produtos WHERE codigoProduto = (?)"
  const codigoProduto = req.params.id
   connection.query(query,[codigoProduto],(err,data)=> {
    if(err) return resp.status(404).send(err)
    
    return resp.status(200).json(data)
   })
})

// Rota para inserir um produto
/**
 * @swagger
 * /produtos:
 *   post:
 *     description: Insere um novo produto no banco de dados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigoProduto:
 *                 type: integer
 *                 description: Código único do produto
 *                 example: 3
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *                 example: "Caneca de café"
 *               descrisao:
 *                 type: string
 *                 description: Descrição do produto
 *                 example: "Caneca para café, com estampa divertida"
 *               preco:
 *                 type: number
 *                 format: float
 *                 description: Preço do produto
 *                 example: 25.99
 *     responses:
 *       201:
 *         description: Produto inserido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: Quantidade de linhas afetadas
 *                   example: 1
 *       400:
 *         description: Dados inválidos fornecidos
 *       500:
 *         description: Erro interno do servidor
 */
App.post("/produtos", (req, resp) => {
    const data  = req.body
    const query = "INSERT INTO produtos (codigoProduto,nome,descrisao,preco) values (?)"
    const values = [
        data.codigoProduto,
        data.nome,
        data.descrisao,
        data.preco
    ]
    
    connection.query(query,[values],(err,data) => {
        if(err) return resp.status(404).send(err)

        return resp.status(201).json(data)
    })
} )

// Rota para atualizar um produto
/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     description: Atualiza as informações de um produto existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Código do produto a ser atualizado
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigoProduto:
 *                 type: integer
 *                 description: Código único do produto
 *                 example: 3
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *                 example: "Caneca de café"
 *               descrisao:
 *                 type: string
 *                 description: Descrição do produto
 *                 example: "Caneca para café, com estampa divertida"
 *               preco:
 *                 type: number
 *                 format: float
 *                 description: Preço do produto
 *                 example: 25.99
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: Quantidade de linhas afetadas
 *                   example: 1
 *       400:
 *         description: Dados inválidos fornecidos
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
App.put('/produtos/:id', (req,resp)=>{
    const codigoProduto = req.params.id
    const data = req.body
     

    const query = "UPDATE produtos SET `codigoProduto` = ?,`nome` = ?,`descrisao` = ?,`preco` = ? WHERE codigoProduto =  ? "
    const values = [
        data.codigoProduto,
        data.nome,
        data.descrisao,
        data.preco
    ]

     connection.query(query,[...values,codigoProduto],(err,data)=> {
        if(err) return resp.status(404).json(err)
        return resp.status(200).json(data)
     })

})


// Rota para deletar um produto
/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     description: Deleta um produto do banco de dados
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Código do produto a ser deletado
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: Quantidade de linhas afetadas
 *                   example: 1
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
App.delete('/produtos/:id', (req, resp) => {
  const produtoCodigo = req.params.id;
  console.log(produtoCodigo);
  const query = "DELETE FROM produtos WHERE codigoProduto = ?";
  
  connection.query(query, [produtoCodigo], (err, data) => {
    if (err) return resp.status(404).send(err);
    
    return resp.status(200).json(data);
  });
});


App.delete('/produtos/:id', (req,resp)=>{
  const produtoCodigo = req.params.id
  console.log(produtoCodigo);
  const query = "DELETE FROM produtos WHERE codigoProduto = ?"
   
  connection.query(query,[produtoCodigo],(err,data)=>{
    if(err) return resp.status(404).send(err)
    return resp.status(200).json(data)
  })


})



//sobe o sitema na porta 3000
App.listen(PORT, () => {
    console.log(`A aplicação esta rodando na porta ${PORT}`);
    console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
})