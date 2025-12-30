"use strict";

// Elements selection
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#name-input');

const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector('#edit-name');//o campo de input

const todoList = document.querySelector('#todo-list');

const cancelEditBtn = document.querySelector("#edit-cancel");

let oldInputValue;

// Functions
const saveTodo = (text) => {

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
            return;
        }

    });

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
    }

    if(targetElement.classList.contains("edit-todo")){
        edit();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;

    }

    if(targetElement.classList.contains("remove-todo")){
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

    edit();

});