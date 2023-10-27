import axios from "axios";

const initialValue = {
  todos: [],
  isLoading: false,
  error: "",
};

function todoReducer(state = initialValue, action) {
  switch (action.type) {
    case "FETCHING":
      return {
        ...state,
        isLoading: true,
      };
    case "LOADED_SUCCESSFULLY":
      return {
        ...state,
        isLoading: false,
        todos: action.payload,
      };
    default:
      return state;
  }
}

function startFetching() {
  return {
    type: "FETCHING",
  };
}

function todoLoaded(data) {
  return {
    type: "LOADED_SUCCESSFULLY",
    payload: data,
  };
}
export const addTodo = (newTodo, page) => async (dispatch) => {
  dispatch(startFetching());
  await axios.post(
    "https://6538d282a543859d1bb1fc0c.mockapi.io/api/v1/todo",
    newTodo
  );
  dispatch(getTodo(page));
};

export function getTodo(page) {
  return async function (dispatch) {
    dispatch(startFetching());
    try {
      const { data } = await axios(
        "https://6538d282a543859d1bb1fc0c.mockapi.io/api/v1/todo?limit=10&page=" +
          page
      );

      console.log(page, data);
      if (data.length === 0 && page > 1) {
        dispatch(getTodo(page - 1));
      }
      dispatch(todoLoaded(data));
    } catch (error) {
      console.log(error);
    }
  };
}

export const deleteTodo = (id, page) => async (dispatch, getState) => {
  dispatch(startFetching());
  await axios.delete(
    `https://6538d282a543859d1bb1fc0c.mockapi.io/api/v1/todo/${id}`
  );
  const { todos } = getState().todo;
  const totalPages = Math.ceil(todos.length / 10);
  if (todos.length === 1 && page === totalPages) {
    dispatch(getTodo(page - 1));
  } else {
    dispatch(getTodo(page - 1));
  }
  console.log(page);
};
export const updateTodo = (id, updatedTodo, page) => async (dispatch) => {
  dispatch(startFetching());
  await axios.put(
    `https://6538d282a543859d1bb1fc0c.mockapi.io/api/v1/todo/${id}`,
    { name: updatedTodo }
  );
  dispatch(getTodo(page));
};
export default todoReducer;
