const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = parseInt(document.getElementById("bookFormYear").value);
  const bookIsComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookList = document.getElementById("incompleteBookList");
  incompleteBookList.innerHTML = "";

  const completeBookList = document.getElementById("completeBookList");
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookItem(book);
    if (!book.isComplete) {
      incompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});

function makeBookItem(book) {
  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book-item");
  bookContainer.setAttribute("data-bookid", book.id);
  bookContainer.setAttribute("data-testid", "bookItem");

  bookContainer.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton">${
              book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
            }</button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        </div>
    `;

  bookContainer
    .querySelector('[data-testid="bookItemIsCompleteButton"]')
    .addEventListener("click", function () {
      toggleBookStatus(book.id);
    });

  bookContainer
    .querySelector('[data-testid="bookItemDeleteButton"]')
    .addEventListener("click", function () {
      removeBook(book.id);
    });

  return bookContainer;
}

function toggleBookStatus(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = !bookTarget.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  return typeof Storage !== "undefined";
}

document.addEventListener(SAVED_EVENT, function () {
  console.log("Data berhasil disimpan!");
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books.push(...JSON.parse(serializedData));
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
