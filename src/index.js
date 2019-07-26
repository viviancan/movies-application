
const {getMovies} = require('./api.js');
const $ = require('jquery');
const bootstrap = require('bootstrap');
import 'bootstrap/dist/css/bootstrap.min.css';


//Gets movies

//display loading message
//make ajax request
//append the movie data
//remove loading message

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);
  });

  $("#initial-loading-msg").hide()

}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.')
  console.log(error);
});
