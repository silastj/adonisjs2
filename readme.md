## INSTALAÇÃO
```
npx create-adonis-ts-app bancoDadosAdonisJS
yes
api
bancoDadosAdonisJS
false

```

> Depois iremos instalar o pacote Lucid
```
npm i @adonisjs/lucid

```

> Configurar o pacote

```
node ace invoke @adonijs/lucid

Escolher o banco que está usando na aplicação ex: mysql
Depois ele pedi para mostrar no browser ou terminal as configurações
```
> Proximo passo:
- Após abrir o arquivo precisa copiar dois comandos e anexar no env.ts

```
DB_CONNECTION: Env.schema.string(),

```
- Abaixo:
```
MYSQL_HOST: Env.schema.string({ format: 'host' }),
MYSQL_PORT: Env.schema.number(),
MYSQL_USER: Env.schema.string(),
MYSQL_PASSWORD: Env.schema.string.optional(),
MYSQL_DB_NAME: Env.schema.string(),

```

> Configurando o arquivo .env
```
DB_CONNECTION=mysql

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=admin
MYSQL_DB_NAME=hello_db

```
## MIGRATIONS

- É conceito de abstração e versionamento do banco de dados
exemplo: 
Versão 01
id Nome Sexo

Versão 02 ....
id Nome Sexo Idade

Versão 03
id Nome Sexo Idade Profissão

Obs: O adonijs faz toda inclusão alteração e rollback de versão do banco de dados.

> Criando uma migration
```
node ace make:migration posts

```
Ele tem dois estados o UP e o DOWN

```
public async up () {
```

```
public async down () {
```
> Após incluir as table abaixo:
```
      table.string('title')
      table.text('content', 'longtext')
```

> Rodar o projeto ou criar a migration:
```
node ace migration:run

```

> Comando pra ver a versão do migration
```
node ace migration:status

```
> Documento passo a passo => file:///C:/Users/silas/AppData/Local/Temp/adonis-1645891739266.html


>Desfazer um operação migration
```
 node ace migration:rollback
```
- Após esse rollback é tudo perdido na migration
- Deixar o campo como unico
```
unique()
table.string('email').unique()
```
> Deixar com verdade ou false
```
table.boolean('is_admin').defaultTo(0)

```
> Deixar como primeiro
```
table.string('username').primary()

```

> Add coluna sem modificar os dados table
```
node ace make:migration add_column_author --table=posts

```
- No arquivo criado iremos add os itens abaixo:
```
No Up => table.string('newauthor').nullable(); // pode receber null
No down => table.dropColumn('newauthor')

```
> O correto é criar uma migration delete
```
node ace make:migration dell_column_author --table=posts
```
- No arquivo criado iremos add os itens abaixo invertido do acima:
```
No Up => table.dropColumn('newauthor')
No down => table.string('newauthor').nullable(); // pode receber null
```

- Caso for deletado os arquivos migrations, também é obrigado deletar do banco de dados na linha dentro do banco
no adonis_schema as migration
- OBS: No pode cancelar em produção nenhuma

## MODELS

```
Controller > Model > Database
Ele também ajuda no relacionamento logica no banco de dados
Usa a ferramenta LucidORM
ORM => Mapeamento Objetos Relacionais

OBS=> Ele facilita para mapear codigo javascript, objetos com e sem relacionamentos do banco de dados.
ex: select * from users   como ele funciona =>   User.all()
```

-  Criação de um novo model,lembrando com a letra maiscula
```
node ace make:model Post

```
> Iremos copiar todas as colunas que está no migration para o Model

## CRIANDO UM CRUD NO MODELO API
- tabela para armazenar conteudo
- forma de acessar mapear a tabela é models
- criar o controller, para criar o controlador e fluxos

```
node ace make:controller PostController
```

> Após criar o arquivo acima
```
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
  // listar todas as postagens
  async index({} : HttpContextContract){
    let allPosts = await Post.all();
    return allPosts
  }

  //guardar no banco de dados
  store({request}: HttpContextContract){
    return {store: 'alt works'}
  }

}
```
## Criar Post
> Criar os dados dinamicos
- Add no routes.ts
```
Route.post('/posts', 'PostsController.store');
```
-  Add no PostController.ts

```
  //guardar no banco de dados
  async store({request}: HttpContextContract){
  //dados fixo
    //  let myData = {
    //    title:'Minha primeira postagem',
    //    content:'Esse é o conteudo'
  //}

  // dados dinamico
  const myData = request.only(['title', 'content'])
  // gravar no banco
   const postagem = Post.create(myData)
   return postagem;

  }
```
- No postman, thunder ou insomnia
> POST
```
http://127.0.0.1:3333/posts/
enviar como json
{
    "title": "Meu segundo Post 4",
    "content": "Conteudo do segundo post 4"
}
```
> GET
```
http://127.0.0.1:3333/posts/

```
## PEGANDO APENAS UM ARQUIVO UNICO. 
> Add na routes.ts
```
Route.get('/posts/:id','PostsController.show');

```
> Add no PostController.ts
```
  // Pegando o registro unico
  async show({ params, response }: HttpContextContract) {
    //Pegando o id dentro de params
    const post_id = params.id;

    //Armazendo na const a consulta assincrona do
    //post
    const singlePost = await Post.find(post_id)

    //Fazendo um condição diferente de singlePost
    // retorne o status 404
    if (!singlePost) {
      //usar esse ou usar o .notFound()
      //response.status(404)
      response.notFound();
    }
    return singlePost;
  }
}
```


## EXCLUIR POST
> Add no routes.ts
```
Route.delete('/posts/:id','PostsController.destroy');

```
- Add no PostController.ts
```
 // Excluir Post
  async destroy({params, response}:HttpContextContract){
    //desestruturando o id de params
    const { id } = params;

    // buscando um id
    // depois se tiver o id, delete
    const deletePost = await Post.find(id);
    if(!deletePost){
      response.notFound()
    }

    await deletePost?.delete();
  }
```

## EDITAR POSTAGEM
> No postman o metodo é PUT
```
Route.put('/posts/:id', 'PostsController.update');

```
- No PostsController.ts
```
  // Editar postagem
  async update({ params,request, response }: HttpContextContract) {
    //Pegar o id
    const { id } = params;
    //Pegar a postagem
    const myPost = await Post.find(id);

    if(!myPost){
      response.notFound();
    }

    // Busar conteudo dinamico,passando title e content
    const myData = request.only(['title', 'content'])

    //Se tiver postagem,faz o merge
    myPost?.merge(myData)

    //Salva no banco e return
    await myPost?.save();

    return myPost;

  }

```
## CRIAR ROTAS SEM POLUIR ARQUIVOS

- Ele traz os methodos 
```
node ace list:routes

```
- Depois que inserimos o codigo abaixo, ele traz todas as rotas por causa da convenção que usamos nos methodos por exemplo( index, store, show , destroy, update)
```
Route.resource('/posts','PostController');
```
- Caso quer trazer apenas rotas API
````
Route.resource('/posts','PostController').apiOnly();
````
- O modo manual antigo:

```
// modo manual abaixo:
// Route.get('/posts', 'PostsController.index');
// Route.post('/posts', 'PostsController.store');
// Route.get('/posts/:id','PostsController.show');
// Route.delete('/posts/:id','PostsController.destroy');
// Route.put('/posts/:id', 'PostsController.update');

```
