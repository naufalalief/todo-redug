import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodo, addTodo, deleteTodo, updateTodo } from "../redux/reducers/todo-reducer";
import { AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
import Swal from "sweetalert2";

function TodoList() {
  const dispatch = useDispatch();
  const { isLoading, todos } = useSelector((state) => state.todo);
  const [input, setInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [inputLess, setInputLess] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const totalPages = Math.ceil(todos.length / 10);
  useEffect(() => {
    dispatch(getTodo(page, 10));
  }, [dispatch, page]);

  const handleInput = (i) => {
    setInput(i.target.value);
    setShowError(false);
    if (input.length < 5) {
      setInputLess(true);
      setIsCorrect(false);
    } else {
      setInputLess(false);
      setIsCorrect(true);
    }
    console.log(inputLess);
  };

  const handleEditInput = (i) => {
    setEditInput(i.target.value);
  };

  const handleSubmit = (s) => {
    s.preventDefault();
    if (input === "") {
      setShowError(true);
      Swal.fire({
        title: "Error!",
        text: "Kolom tidak boleh kosong!",
        icon: "error",
        confirmButtonText: "Oke",
      });
    } else if (inputLess) {
      setInputLess(true);
      Swal.fire({
        title: "Error!",
        text: "Tidak boleh kurang dari 5 huruf!",
        icon: "error",
        confirmButtonText: "Oke",
      });
    } else {
      let newTodo = {
        name: input,
        status: false,
      };
      Swal.fire({
        title: "Success!",
        text: "Todo berhasil ditambahkan!",
        icon: "success",
        confirmButtonText: "Mantap",
      });
      dispatch(addTodo(newTodo, page));
      setInput("");
      setIsCorrect(false);
      dispatch(getTodo(page));
    }
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditInput(name);
  };

  const handleUpdate = async (id) => {
    await dispatch(updateTodo(id, editInput, page));
    setEditId(null);
    setEditInput("");
    dispatch(getTodo(page));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      console.log("prev", page);
    }
  };

  const handleNextPage = () => {
    if (todos.length === 10) {
      setPage((prev) => prev + 1);
    } else if (todos.length < 10 && page > 1) {
      setPage((prev) => prev - 1);
    } else {
      setPage((prev) => prev + 1);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan tindakan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus saja!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteTodo(id, page));
        if (todos.length === 1 && page === totalPages) {
          setPage((prev) => prev - 1);
          dispatch(getTodo(page - 1, 10));
        }
        dispatch(getTodo(page));
        Swal.fire("Terhapus!", "Todo berhasil dihapus.", "success");
      }
    });
  };

  return (
    <>
      <div className="">
        <div className="flex justify-center my-6 px-4 py-2">
          <h1 className="font-bold text-4xl">Mo ngapain luwh?</h1>
        </div>
        <div className="px-4 py-2" onSubmit={handleSubmit}>
          <form action="" className="flex flex-col gap-2">
            <div>
              <label htmlFor="error" className="block mb-2 text-sm font-medium">
                Tambah Kegiatan
              </label>
              <input
                type="text"
                id="error"
                className={`${
                  showError
                    ? "bg-red-50 border border-red-500 text-sm rounded-lg focus:ring-red-500  focus:border-red-500 block w-full p-2.5"
                    : inputLess
                    ? "bg-red-50 border border-red-500 text-sm rounded-lg focus:ring-red-500  focus:border-red-500 block w-full p-2.5"
                    : isCorrect
                    ? "bg-green-50 border border-green-500 text-sm rounded-lg focus:ring-green-500  focus:border-green-500 block w-full p-2.5"
                    : "border border-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                }`}
                placeholder=""
                onChange={handleInput}
                value={input}
              />
              {showError ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Kolom tidak boleh kosong!</span>
                </p>
              ) : inputLess ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">
                    Tidak boleh kurang dari 5!
                  </span>
                </p>
              ) : null}
            </div>
            <button className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full">
              Tambah
            </button>
          </form>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="flex justify-center">Loading...</div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex justify-between items-center px-4 py-2"
                >
                  {editId === todo.id ? (
                    <div>
                      <input
                        type="text"
                        value={editInput}
                        onChange={handleEditInput}
                      />
                      <button onClick={() => handleUpdate(todo.id)}>Save</button>
                    </div>
                  ) : (
                    <div>
                      <span
                        className={`${
                          todo.status
                            ? "line-through text-gray-500"
                            : "text-gray-700"
                        }`}
                      >
                        {todo.name}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2"
                      onClick={() => handleDelete(todo.id)}
                    >
                      <AiTwotoneDelete size={30} />
                    </button>
                    <button className="px-4 py-2" onClick={() => handleEdit(todo.id, todo.name)}>
                      <AiFillEdit size={30} />
                    </button>
                  </div>
                </div>
              ))
            )}
            <button
              className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Sebelumnya
            </button>
            <button
              className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={handleNextPage}
              disabled={todos.length < 10 && page > 1}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoList;