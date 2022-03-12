import Route from '@ioc:Adonis/Core/Route'
import PostsController from 'App/Controllers/Http/PostsController';

Route.get('/', async () => {
  return { hello: 'world' }
})

//modo automatico abaixo:
Route.resource('/posts','PostsController').apiOnly();
