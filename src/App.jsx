

import { useState } from "react"
import { Plus, Edit3, Trash2, Check, X, Search, Star, Calendar, Filter, Tag, Folder } from "lucide-react"
import {store} from "./context"

export default function TodoTwo() {
  const [newTodo, setNewTodo] = useState("")
  const [newTags, setNewTags] = useState("")
  const [newCategory, setNewCategory] = useState("Personal")
  const [newPriority, setNewPriority] = useState("Medium")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  const categories = ["Work", "Personal", "Health", "Finance", "Learning", "Shopping"]
  const priorities = ["Low", "Medium", "High"]
  const { todos, addTodo, removeTodo, editTodo, toggleComplete, clearTodo } = store();

  

  const activeTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)
  const highPriorityTodos = todos.filter((todo) => todo.priority === "High" && !todo.completed)

  const getFilteredTodos = () => {
    let filtered = todos

    if (filter === "active") filtered = activeTodos
    if (filter === "completed") filtered = completedTodos
    if (filter === "High") filtered = highPriorityTodos

    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          todo.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  const getPriorityColor = (priority) => {
    if (priority === "High") return "bg-red-500"
    if (priority === "Medium") return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPriorityBorder = (priority) => {
    if (priority === "High") return "border-red-500/30"
    if (priority === "Medium") return "border-yellow-500/30"
    return "border-green-500/30"
  }

  const getCategoryColor = (category) => {
    const colors = {
      Work: "bg-blue-500/20 text-blue-200 border-blue-400/30",
      Personal: "bg-green-500/20 text-green-200 border-green-400/30",
      Health: "bg-red-500/20 text-red-200 border-red-400/30",
      Finance: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
      Learning: "bg-purple-500/20 text-purple-200 border-purple-400/30",
      Shopping: "bg-pink-500/20 text-pink-200 border-pink-400/30",
    }
    return colors[category] || "bg-gray-500/20 text-gray-200 border-gray-400/30"
  }

  const parseTagsInput = (input) => {
    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  const filteredTodos = getFilteredTodos()

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Task Manager</h1>
          <p className="text-slate-300 text-lg">Organize your life </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: todos.length, color: "from-blue-500 to-cyan-500", icon: Calendar },
            { label: "Active", value: activeTodos.length, color: "from-purple-500 to-pink-500", icon: Star },
            { label: "Completed", value: completedTodos.length, color: "from-green-100 to-emerald-200", icon: Check },
            {
              label: "High Priority",
              value: highPriorityTodos.length,
              color: "from-red-500 to-orange-500",
              icon: Filter,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-emerald-500 backdrop-blur-xl border border-white/30 rounded-2xl p-4 text-center shadow-lg"
            >
              <div
                className={
                  "w-10 h-10 rounded-xl bg-gradient-to-r " +
                  stat.color +
                  " flex items-center justify-center mx-auto mb-2"
                }
              >
                <stat.icon className="w-5 h-5 text-black" />
              </div>
              <div className="text-2xl font-bold text-black mb-1">{stat.value}</div>
              <div className="text-black text-sm font-bold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add Todo Form */}
        <div className="bg-cyan-900 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="space-y-4">
            {/* Task Input */}
            <div className="flex space-x-3">
              <div className="flex-1 relative ">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What is Your task?"
                  className="w-full px-4 py-3.5 bg-white/30 border border-white/30 hover:border-white/50  focus:border-orange-400 rounded-xl text-shadow-black placeholder-neutral-950 outline-none transition-all duration-200 backdrop-blur-sm"
                />
              </div>
              <button onClick={()=>{
                  
                addTodo({
                  id:Date.now(),
                  text:newTodo,
                  completed: false,
                  priority: newPriority,
                  category: newCategory,
                   tags: parseTagsInput(newTags),
                })
                setNewTodo("")
                setNewTags("")
                setNewCategory("Personal")
                setNewPriority("Medium")
              }}
              disabled={!newTodo.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>

            {/* Category and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Selector */}
              <div className="relative">
                <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400 z-30"strokeWidth={4} />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-white/30 border border-white/30 hover:border-white/50 focus:border-orange-400 rounded-xl text-shadow-black  outline-none transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-slate-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Priority Selector */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400 z-30"  strokeWidth={4}/>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-white/30 border border-white/30 hover:border-white/50 focus:border-orange-400 rounded-xl text-shadow-black outline-none transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority} className="bg-slate-800 text-white">
                      {priority} Priority
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tags Input */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500 z-30" strokeWidth={4} />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Add tags (comma separated): work, urgent, design"
                className="w-full pl-10 pr-4 py-3.5 bg-white/30 border border-white/30 hover:border-white/50 focus:border-orange-400 rounded-xl text-shadow-black placeholder-neutral-950 outline-none transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            {/* Search */}
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks, tags, or categories..."
                className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/30 hover:border-white/50 focus:border-blue-400 rounded-xl text-white placeholder-slate-300 outline-none transition-all duration-200 backdrop-blur-sm"
              />
            </div> */}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-cyan-900 backdrop-blur-xl border border-white/30 rounded-2xl p-2 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Tasks", count: todos.length },
              { key: "active", label: "Active", count: activeTodos.length },
              { key: "completed", label: "Completed", count: completedTodos.length },
              { key: "High", label: "High Priority", count: highPriorityTodos.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={
                  "px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 " +
                  (filter === tab.key
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-white/10")
                }
              >
                <span>{tab.label}</span>
                <span
                  className={
                    "px-2 py-0.5 rounded-full text-xs font-semibold " +
                    (filter === tab.key ? "bg-white/20 text-white" : "bg-white/10 text-slate-300")
                  }
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-cyan-900 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-lg">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No tasks found</h3>
              <p className="text-slate-300 text-lg">
                {filter === "all" && searchTerm && "No tasks match your search"}
                {filter === "all" && !searchTerm && "Add your first task to get started"}
                {filter === "active" && "All tasks completed! Take a break!"}
                {filter === "completed" && "No completed tasks yet"}
                {filter === "High" && "No high priority tasks"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  className={
                    "p-5 flex items-center space-x-4 hover:bg-white/5 transition-all duration-200 group " +
                    (todo.completed ? "opacity-60" : "") +
                    " border-l-4 " +
                    getPriorityBorder(todo.priority)
                  }
                >
                  {/* Priority Indicator */}
                  <div className={"w-3 h-3 rounded-full " + getPriorityColor(todo.priority)}></div>

                  {/* Checkbox */}
                  <button
                   onClick={()=>toggleComplete(todo.id)}
                    className={
                      "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-200 " +
                      (todo.completed
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg"
                        : "border-white/30 hover:border-blue-400 hover:bg-white/10")
                    }
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border-2 border-blue-400 rounded-lg text-white outline-none backdrop-blur-sm"
                          autoFocus
                        />
                        <button 
                        onClick={()=>{
                          editTodo(editingId,editText)
                          setEditingId(null)
                          setEditText('')
                        }}
                        className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg">
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p
                          className={
                            "text-lg font-medium mb-2 " +
                            (todo.completed ? "line-through text-slate-400" : "text-white")
                          }
                        >
                          {todo.text}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={"text-xs px-3 py-1 rounded-full border " + getCategoryColor(todo.category)}>
                            <Folder className="w-3 h-3 inline mr-1" />
                            {todo.category}
                          </span>
                          <span
                            className={"text-xs px-2 py-1 rounded-full text-white " + getPriorityColor(todo.priority)}
                          >
                            {todo.priority}
                          </span>
                        </div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {todo.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 rounded-full border border-blue-400/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {editingId !== todo.id && (
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          setEditingId(todo.id)
                          setEditText(todo.text)
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                      onClick={()=>{
                        removeTodo(todo.id)
                      }}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {todos.length > 0 && (
          <div className="mt-6 bg-cyan-900 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="text-slate-300 text-lg">
                <span className="font-semibold text-white">{activeTodos.length}</span> of{" "}
                <span className="font-semibold text-white">{todos.length}</span> tasks remaining
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                onClick={()=>{
                  todos.forEach(todo => {
                   if (!todo.completed) toggleComplete(todo.id)
                    
                  });
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm">
                  Mark All Complete
                </button>

                {completedTodos.length > 0 && (
                  <button
                  onClick={()=>{
                    completedTodos.forEach(todo=>removeTodo(todo.id))
                  }} 
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                    Clear Completed ({completedTodos.length})
                  </button>
                )}

               
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-slate-300 mb-3">
                <span className="font-medium">Overall Progress</span>
                <span className="font-semibold">{Math.round((completedTodos.length / todos.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: (completedTodos.length / todos.length) * 100 + "%" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gradient Background */}
      <div className="fixed inset-0 overf-hidden pointer-events-none -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-indigo-900/50 via-purple-900/30 to-transparent"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
