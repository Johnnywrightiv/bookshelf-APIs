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

// Add event listener to fire on user search (button click)
$('.search').on('click', function () {
  var searchTerm = $('#search-query').val();

  fetch(searchTerm);
});

// Loop through objects returned by API and set props/vals of new object.. push new objects to 'books' array, and call renderBooks().
var addBooks = function (data) {

  books = [];

  for (let i = 0; i < data.items.length; i++) {
    var bookData = data.items[i];

    var bookObj = {
      title: bookData.volumeInfo.title || null,
      author: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] : null,
      imageURL: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : null,
      isbn: bookData.volumeInfo.industryIdentifiers ? bookData.volumeInfo.industryIdentifiers[0] : null,
      pageCount: bookData.volumeInfo.pageCount || null,
    };

    books.push(bookObj);  
  };

  renderBooks();
};

// Use jQuery .ajax() method to fetch data from API and return cases based on success or failure
var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://www.googleapis.com/books/v1/volumes?q=" + query,
    dataType: "json",
    success: function(data) {
      addBooks(data);
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
