import { Response } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
  // listar todas as postagens
  async index({ }: HttpContextContract) {
    let allPosts = await Post.all();
    return allPosts
  }

  //guardar no banco de dados
  async store({ request }: HttpContextContract) {
    //dados fixo
    //  let myData = {
    //    title:'Minha primeira postagem',
    //    content:'Esse é o conteudo'
    //}

    // dados dinamico
    const myData = request.only(['title', 'content'])
    // gravar no banco
    const postagem = await Post.create(myData)
    return postagem;

  }

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

  // Excluir Post
  async destroy({params, response}: HttpContextContract){
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
}
