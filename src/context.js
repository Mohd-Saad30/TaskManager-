import {create } from "zustand"
import { persist } from "zustand/middleware";
export const store = create(persist((set)=>({
   todos:[],
  addTodo:(item)=>
  set((state)=>({
    todos:[...state.todos,item]

  })),
  removeTodo:(id)=>
  set((state)=>({
    todos:state.todos.filter((todo)=>todo.id!=id)
  })),
  clearTodo: () => set({ todos: [] }),
  editTodo: (id, newText) =>
  set(state => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    )
  })),
  toggleComplete:(id)=>
  set((state)=>({
    todos: state.todos.map((todo)=>todo.id===id?{...todo,completed:!todo.completed}:todo)
  }))


})))