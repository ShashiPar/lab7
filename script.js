document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
});

let books = [];
let filteredBooks = [];

async function loadBooks() {
  const url = "./books.json";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch books");
    books = await response.json();
    filteredBooks = books;
    displayBooks(filteredBooks);
    setupPagination();
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("errorMessage").innerText =
      "Error: " + error.message;
  }
}

function displayBooks(booksToDisplay) {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";

  booksToDisplay.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-item");

    const imageUrl = book.imageURL || "https://via.placeholder.com/150";

    bookElement.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${imageUrl}" alt="${
      book.title
    } Cover" style="width:150px;height:auto;">
        <p>Author: ${book.author}</p>
        <p>Genre: ${book.genre || "Unknown"}</p>
        <p>${book.plot || "No description available"}</p>
      `;
    bookList.appendChild(bookElement);
  });
}

function filterBooks(searchQuery) {
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

document.getElementById("searchBox").addEventListener("input", (e) => {
  const searchQuery = e.target.value;
  filteredBooks = filterBooks(searchQuery);
  displayBooks(filteredBooks);
  setupPagination();
});

function setupPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayBooks(getBooksForCurrentPage());
    });
    pagination.appendChild(pageButton);
  }
}

const booksPerPage = 8;
let currentPage = 1;

function getBooksForCurrentPage() {
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  return filteredBooks.slice(start, end);
}

function sortBooks(sortBy) {
  return filteredBooks.sort((a, b) => {
    if (a[sortBy] && b[sortBy]) {
      return a[sortBy].localeCompare(b[sortBy]);
    }
    return 0;
  });
}

document.getElementById("sortOptions").addEventListener("change", (e) => {
  const sortBy = e.target.value;
  filteredBooks = sortBooks(sortBy);
  displayBooks(getBooksForCurrentPage());
  setupPagination();
});
