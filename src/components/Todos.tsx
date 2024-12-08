import { SubmitHandler, useForm } from "react-hook-form";

import { useTodos, useTodosIds } from "../services/queries";
import Spinner from "./Spinner";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutations";
import { Todo } from "../types/todo";

import ButtonSpinner from "../assets/button-spinner.svg";

export default function Todos() {
  const todosIdQuery = useTodosIds();
  const todosQueries = useTodos(todosIdQuery.data);

  const createTodoMutation = useCreateTodo();
  const updateTodoMutaion = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { register, handleSubmit } = useForm<Todo>();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const handleMarkAsDoneSubmit = async (data: Todo | undefined) => {
    if (data) {
      await updateTodoMutaion.mutateAsync({ ...data, checked: true });
      console.log("navitating to another page");
    }
  };

  const handleDeleteTodo = (id: number) => {
    if (id) {
      deleteTodoMutation.mutate(id);
    }
  };

  if (todosIdQuery.isPending) {
    return (
      <span>
        <Spinner />
      </span>
    );
  }

  if (todosIdQuery.isError) {
    return <span>There is an error</span>;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleCreateTodoSubmit)}
        className="w-1/2 flex flex-col items-stretch mb-6"
      >
        <h4 className="font-bold mb-4 uppercase">Create New Todo</h4>
        <input
          placeholder="Title"
          {...register("title")}
          className="px-4 py-2 border rounded mt-2"
        />
        <input
          placeholder="Description"
          {...register("description")}
          className="px-4 py-2 border rounded mt-2"
        />
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 font-bold active:bg-green-700 flex gap-2 items-center"
            disabled={createTodoMutation.isPending}
          >
            {createTodoMutation.isPending && <ButtonSpinner />}
            Submit Query
          </button>
        </div>
      </form>
      <ul>
        {todosQueries.map(({ data }) => (
          <li key={data?.id || Math.random()}>
            <div className="flex justify-items-stretch gap-10">
              <span>
                <strong className="mr-4">Id:</strong>
                {data?.id}
              </span>
              <span>
                <strong className="mr-4">Title:</strong>
                {data?.title}
              </span>
              <span>
                <strong className="mr-4">Description:</strong>
                {data?.description}
              </span>
              <span>
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 font-bold active:bg-green-700 flex gap-2 items-center disabled:bg-gray-400"
                  onClick={() => handleMarkAsDoneSubmit(data)}
                  disabled={data?.checked}
                >
                  {data?.checked ? "Done" : "Mark as done"}
                </button>
              </span>
              <span>
                {data && data.id && (
                  <button
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 font-bold active:bg-green-700 flex gap-2 items-center"
                    onClick={() => handleDeleteTodo(data.id!)}
                  >
                    Delete
                  </button>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
