"use strict";

// Elements selection
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#name-input');

const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector('#edit-name');//o campo de input

const todoList = document.querySelector('#todo-list');

const cancelEditBtn = document.querySelector("#edit-cancel");

  // toolbar
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
  
let oldInputValue;

// Functions
const saveTodo = (text, done = 0, save = 1) => {

    const todo = document.createElement("div");

    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");

    todoTitle.innerText = text;

    todo.appendChild(todoTitle);

    const finishBtn = document.createElement("button");
    const editBtn = document.createElement("button");
    const removeBtn = document.createElement("button");

    finishBtn.classList.add("finish-todo", "list");
    editBtn.classList.add("edit-todo", "list");
    removeBtn.classList.add("remove-todo", "list");

    finishBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
    editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    removeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

    todo.appendChild(finishBtn);
    todo.appendChild(editBtn);
    todo.appendChild(removeBtn);

    // utilizando dados da localStorage
    if(done){
        todo.classList.add("done");
    }

    if(save){
        saveTodoLocalStorage({text: text, done: 0});
    }

    todoList.appendChild(todo);

    todoInput.value = "";
    
};

const edit = () => {

    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");

};

const saveEdit = (TextValue) => {

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = TextValue;

            updateTodoLocalStorage(oldInputValue, TextValue);
            return;
        }

    });

};

const getSearchTodos = (search) =>{

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{

        let todoTitle = todo.querySelector("h3").innerText.toLocaleLowerCase();
        
        todo.style.display = "flex";

        if(!todoTitle.includes(search))
        {
            todo.style.display = "none";
        }

    });

};

const filterTodos = (value) =>{

    const todos = document.querySelectorAll(".todo");

    switch(value){
        
        case "all":
            todos.forEach((todo) => todo.style.display = "flex");
            break;

        case "done":
            todos.forEach((todo) => {

                if(todo.classList.contains("done")){
                    todo.style.display = "flex";
                }
                else{
                    todo.style.display = "none";
                }

            });
            break;

        case "todo":
            todos.forEach((todo) => todo.classList.contains("done") 
            ? todo.style.display = "none" 
            : todo.style.display = "flex");
            //Em uma linha: todo.classList.contains("done") ? todo.style.display = "none" : todo.style.display = "flex"
            break;

        default:
            console.log("caso default");
            break;
    }

};


// Events

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(todoInput.value){
        saveTodo(todoInput.value);
    }
});

  //como tem elementos (botoes) sendo adicionados dinamicamente
  // é mais inteligente adicionar o evento no documento todo

document.addEventListener("click", (e) => {
    const targetElement = e.target;
    const parentElement = targetElement.closest("div"); //quebrado esse closest
    //const parentElement = targetElement.closest(".todo"); funcionaria também
    
    let todoTitle;

    if(parentElement && parentElement.querySelector("h3")){
        todoTitle = parentElement.querySelector("h3").innerText;
    }

    //console.log(todoTitle);

    if(targetElement.classList.contains("finish-todo")){
        parentElement.classList.toggle("done"); //se tem a classe tira, se nao tem ele coloca
        updateTodoStatusLocalStorage(todoTitle);
    }

    if(targetElement.classList.contains("edit-todo")){
        edit();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;

    }

    if(targetElement.classList.contains("remove-todo")){
        //const title = arentElement.querySelector("h3").innerText;
        removeTodoLocalStorage(todoTitle);
        parentElement.remove();
    }
});

cancelEditBtn.addEventListener("submit", (e)=>{
    
    e.preventDefault();

    edit();

});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newEditValue = editInput.value

    if(newEditValue){
        saveEdit(newEditValue);
    }

    // updateTodoLocalStorage(oldInputValue, newEditValue);
    edit();

});

searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;

    const searchLower = search.toLocaleLowerCase();

    getSearchTodos(searchLower);

});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) =>{

    const filterValue = e.target.value;

    filterTodos(filterValue);

});

// Local Storage

const getTodoLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () => {

    const todos = getTodoLocalStorage();

    todos.forEach( (todo) => {
        saveTodo(todo.text, todo.done, 0);
    } );

};


const saveTodoLocalStorage = (todo) => {
    const todos = getTodoLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));
    

};

const removeTodoLocalStorage = (todoText) => {

    const todos = getTodoLocalStorage();

    const filteredTodos = todos.filter( (todo) => {
        return todo.text !== todoText
    } ); //quando se usa arrow function sem {}, o return fica implicito

    localStorage.setItem("todos", JSON.stringify(filteredTodos) );

};

const updateTodoStatusLocalStorage = (todoText) => {

    const todos = getTodoLocalStorage();

    todos.map( (todo) => todo.text === todoText ? (todo.done = !todo.done) : null );

    localStorage.setItem("todos", JSON.stringify(todos) );

};

const updateTodoLocalStorage = (todoText, newTodoText) => {

    const todos = getTodoLocalStorage();

    todos.map( (todo) => todo.text === todoText ? (todo.text = newTodoText) : null );

    localStorage.setItem("todos", JSON.stringify(todos) );

};

loadTodos();