import { useEffect, useState } from "react";
import axios from "axios";
import bookPlaceholder from "../images/book-placeholder.jpg";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [inputBook, setInputBook] = useState({
    title: "",
    desc: "",
    cover: "",
    price: 0,
  });
  const [updateBookId, setUpdateBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      resetForm();
      const res = await axios.get("http://localhost:8800/books");
      if (res.data.message === "success") {
        setBooks(res.data.data);
      } else throw new Error(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  function resetForm() {
    setUpdateBookId(null);
    setInputBook({
      title: "",
      desc: "",
      cover: "",
      price: "",
    });
  }
  async function submitBook() {
    try {
      if (!inputBook.title || !inputBook.price) return;
      const res = await axios.post("http://localhost:8800/books", inputBook);
      if (res.data.message === "success") {
        fetchBooks();
      } else throw new Error(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteBook(id) {
    try {
      const res = await axios.delete("http://localhost:8800/books/" + id);
      if (res.data.message === "success") {
        fetchBooks();
      } else throw new Error(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateBook() {
    try {
      const res = await axios.put(
        "http://localhost:8800/books/" + updateBookId,
        inputBook
      );
      if (res.data.message === "success") {
        fetchBooks();
      } else throw new Error(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubmitClick() {
    if (updateBookId) {
      updateBook();
    } else {
      submitBook();
    }
  }

  function handleUpdateClick(id) {
    setUpdateBookId(id);

    const clickedBook = books.filter((book) => book.id === id)[0];
    setInputBook({
      title: clickedBook.title,
      desc: clickedBook.desc,
      cover: clickedBook.cover,
      price: clickedBook.price,
    });
  }
  function handleCancel() {
    resetForm();
  }
  const renderBook = (book) => {
    const { title, desc, cover, price } = book;
    return (
      <div className="flex flex-col items-center">
        <div>
          <img src={cover || bookPlaceholder} height="200" width="150" />
        </div>
        <div>{title}</div>
        <div className="text-gray-500 text-sm">{desc}</div>
        <div className="text-gray-500 text-sm">Price: {price ?? "NA"}</div>

        <div className="flex flex-col gap-2 w-full">
          <button
            className="px-4 py-2 border border-red-600  rounded-md active:bg-red-200"
            onClick={() => {
              deleteBook(book.id);
            }}
          >
            Delete
          </button>
          <button
            className=" bg-orange-500 text-white px-4 py-2 rounded-md active:opacity-80"
            onClick={() => {
              handleUpdateClick(book.id);
            }}
          >
            Update
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col  pt-24  px-24">
      <div className="flex flex-col w-96 gap-2">
        <input
          type="text"
          className="border border-slate-700 rounded-sm"
          placeholder="Book Name"
          value={inputBook.title}
          onChange={(e) => {
            setInputBook((val) => ({ ...val, title: e.target.value }));
          }}
        />
        <input
          type="text"
          className="border border-slate-700 rounded-sm"
          placeholder="Description"
          value={inputBook.desc}
          onChange={(e) => {
            setInputBook((val) => ({ ...val, desc: e.target.value }));
          }}
        />
        <input
          type="number"
          className="border border-slate-700 rounded-sm"
          placeholder="Price"
          value={inputBook.price}
          onChange={(e) => {
            setInputBook((val) => ({ ...val, price: Number(e.target.value) }));
          }}
        />{" "}
        <div className="flex gap-8">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4 w-[200px] active:bg-gray-300"
            onClick={handleSubmitClick}
          >
            {updateBookId ? "Update" : "Add"}
          </button>
          {updateBookId && (
            <button
              className="bg-gray-200 px-4 py-2 rounded-md mt-4 w-[200px] active:opacity-80"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-16 mt-12">{books?.map(renderBook)}</div>
    </div>
  );
};

export default Books;
