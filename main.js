//update array with each search, loop through API data (book objects), render each book obj to page
var books = [
  // {
  //   title: 'Harry Potter',
  //   author: 'J.K. Rowling',
  //   imageURL: 'https://books.google.com/books/content?id=WV8pZj_oNBwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  //   isbn: '9781921479311',
  //   pageCount: 268
  // },
];

var bookShelf = ['a-sample-book'];
var collections = [
  $('<option>', {
    value: 'All Titles',
    text: 'All Title'
  }).val(),
  $('<option>', {
    value: 'Action Novels',
    text: 'Action Novels'
  }).val(),
  $('<option>', {
    value: 'Biographies',
    text: 'Biographies'
  }).val(),
  $('<option>', {
    value: 'History',
    text: 'History'
  }).val(),
];

// dynamically load in collections selections
var loadCollections = function() {
  for (let i = 0; i < collections.length; i++) {
    const element = collections[i];
    
    $('#shelf-selection').append(
      $('<option>', {
        value: element,
        text: element
      })
      );
    };
  }
  window.onload = (event) => {
    loadCollections();
  };

// Add new shelf collections, push new collection input to collections arr and update drop-down dynamically based on that...
$('#add-new-shelf').on("click", function() {
  var $newShelf = $('#new-shelf').val();
  collections.push($newShelf)

  $('#shelf-selection').append(
    $('<option>', {
      value: $newShelf,
      text: $newShelf
  })
  );;
});


// Add event listener to fire on user search (button click)
$('.search').on('click', function () {
  $('html').addClass('wait')
  var searchTerm = $('#search-query').val();
  fetch(searchTerm);
});

// Loop through objects returned by API and set props/vals of new object.. push new objects to 'books' array, and call renderBooks().
var addBooks = function (data) {

  console.log('API Data:', data);

  books = [];

  for (let i = 0; i < data.items.length; i++) {
    var bookData = data.items[i];

    var bookObj = {
      title: bookData.volumeInfo.title || null,
      author: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] : null,
      imageURL: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : null,
      isbn: bookData.volumeInfo.industryIdentifiers ? bookData.volumeInfo.industryIdentifiers[0].identifier : null,
      pageCount: bookData.volumeInfo.pageCount || null,
      shelfCollection: null
    };

    books.push(bookObj);
    
  };
  
  renderBooks();

  // Clicking add to shelf button should push book object to an array on the bookshelf
  $('.add-to-shelf').on('click', $('.book'), function() {
    alert('this event should also push the selected book object to the bookShelf array, and prompt the user which shelfCollection prop to add to the object')
    debugger;
    bookShelf.push($('this'))
    $('.book-shelf').append(this.parentElement)
    this.innerHTML = 'Remove from Shelf';
    this.classList.add('remove-from-shelf')
    this.classList.remove('add-to-shelf')
    console.log('twice?')
  });
  
  // Remove from shelf button not working :(
  $('.remove-from-shelf').on('click', $('.book'), function() {
    console.log('-- accessed correct scope --')
    this.parentElement.remove();
  });
};

// Use jQuery .ajax() method to fetch data from API and return cases based on success or failure
var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://www.googleapis.com/books/v1/volumes?q=" + query,
    dataType: "json",
    // startIndex: 1,
    success: function(data) {
      addBooks(data);
      $('html').removeClass('wait')
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// Use Handlebars to create dynamic HTML and append to .books
var renderBooks = function () {
  // empty div when func invoked, render new data each time
  $('.books').empty();
  
  // Create HTML variables for handlebars template 
  for (var i = 0; i < books.length; i++) {
    // source is the HTML <script tag> containing the Handlebars template
    var source = $('#book-template').html();
    // template is the output of calling .compile() on the HTML template source
    var template = Handlebars.compile(source);
    // newHTML is the output of calling the template() func ^ on each array object
    var newHTML = template(books[i]);

    $('.books').append(newHTML);
  }
};