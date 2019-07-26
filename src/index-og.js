/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');
const $ = require('jquery');

const bootstrap = require('bootstrap');
// require('bootstrap/dist/css/bootstrap.css');
import 'bootstrap/dist/css/bootstrap.min.css';

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);
  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.')
  console.log(error);
});
console.log("what!!")




let makeApiCall = () => {
  getMovies().then((movies) => {
    console.log('Here are all the movies:');

  //   movies.forEach(({title, rating, id}) => {
  //     console.log(`id#${id} - ${title} - rating: ${rating}`);
  // });
    makeMovieTable(movies);

  }).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.')
    console.log(error);
  });

}

makeApiCall();

const makeMovieTable = (movies) => {
  var html = ""

  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);
    html += '<tr>';
    html += `<th scope="row">${id}</th>`;
    html += `<td>${title}</td>`;
    html += `<td>${rating}</td>`;
    html += `<td>
      <button type="button" class="btn btn-info btn-sm edit-movie-table-btn" id="edit-${id}">Edit</button>
      <button type="button" class="btn btn-danger btn-sm delete-movie-table-btn" id="delete-${id}">Delete</button>
      </td>`;
    html += '</tr>';
  });

  $("#movie-body").html(html)

  $("#spinner").hide();
  $(".hidden-content").show();


  $(".edit-movie-table-btn").on("click", function (e) {
    console.log("edit table btn clicked")
    e.preventDefault();
    let editId = this.id;
    editId = editId.split("-")[1]
    $("#edit-modal-form").show();
    $("#edit-movie-tag").hide();

    let editMovieInfo = movies.filter(movie => movie.id == editId)

    let oldMovieTitle = editMovieInfo[0].title
    let oldMovieRating = editMovieInfo[0].rating
    $("#edit-movie-title-input").val(oldMovieTitle)
    $("input[name=editMovieRadios][value=" + oldMovieRating + "]").prop('checked', true);


    $("#editMovieModal").modal("show");

    $("#edit-movie-btn").off().on("click", function (e) {
      e.preventDefault()
      $("#edit-modal-form").hide();
      $("#edit-movie-tag").show();

      let newMovieTitleInput = $("#edit-movie-title-input").val();
      let newMovieRatingInput = $("input[name='editMovieRadios']:checked").val();

      let editMovieData = {
        title: newMovieTitleInput,
        rating: newMovieRatingInput
      }

      const editMovieOptions = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editMovieData)
      }

      const movieUrl = `api/movies/${editId}`

      fetch(movieUrl, editMovieOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            getMovies().then((movies) => {
              makeMovieTable(movies);
              $('#editMovieModal').modal('hide')
            }).catch((error) => {
              alert('Oh no! Something went wrong.\nCheck the console for details.')
              console.log(error);
            });
          })
          .catch(/* handle errors */);
    });
  });


  $(".delete-movie-table-btn").on("click", function (e) {
    console.log("delete table btn clicked")
    $(this).closest("tr").addClass("marked");
    $("#spinner").show()
    e.preventDefault();
    let deleteId = this.id;
    deleteId = deleteId.split("-")[1]

    let editMovieInfo = movies.filter(movie => movie.id == deleteId)
    let oldMovieTitle = editMovieInfo[0].title
    let oldMovieRating = editMovieInfo[0].rating

    let editMovieData = {
      title: oldMovieTitle,
      rating: oldMovieRating
    }

    const deleteMovieOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(editMovieData)
    }

    const movieUrl = `api/movies/${deleteId}`

    fetch(movieUrl, deleteMovieOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          getMovies().then((movies) => {
            makeMovieTable(movies);
          }).catch((error) => {
            alert('Oh no! Something went wrong.\nCheck the console for details.')
            console.log(error);
          });
        })
        .catch(/* handle errors */);
    })
};


$("#add-movie-btn").on("click", function (e) {
  e.preventDefault();
  console.log("add movie button clicked!")
  $("#modal-form").hide();
  $("#adding-movie-tag").show();


  let movieTitleInput = $("#movie-title-input").val();
  let movieRatingInput = $("input[name='movieRadios']:checked").val();

  let movieData = {
    title: movieTitleInput,
    rating: movieRatingInput
  }

  const addNewMovieOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(movieData)
  }

  const movieUrl = 'api/movies'
  fetch(movieUrl, addNewMovieOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        getMovies().then((movies) => {
          makeMovieTable(movies);
          $('#addMovieModal').modal('hide')
        }).catch((error) => {
          alert('Oh no! Something went wrong.\nCheck the console for details.')
          console.log(error);
        }).catch(/* handle errors */);
      });
});
