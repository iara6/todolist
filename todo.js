const todoList = JSON.parse(localStorage.getItem('data')) || [
  { id: 1731559522940,
    name: 'make dinner',
    isChecked: true
  }, {
    id: 1731559522930,
    name: 'water plants',
    isChecked: false
  }, {
    id: 1731559522920,
    name: 'meditate',
    isChecked: false
  },
];

let trashBinList = JSON.parse(localStorage.getItem('trash')) || [];

let darkModeOn = JSON.parse(localStorage.getItem('mode')) || false;

renderTodoList();

/************************
    DISPLAY TO-DO LIST
*************************/
function renderTodoList() {
  let todoHTML = '';

  todoList.forEach((object) => {
    const { id, name, isChecked } = object;
    const HTML = `
      <li class="todo-name ${isChecked ? 'checked' : ''}" data-id="${id}">${name}
        <div class="todo-btn-container">
          <span class="edit-button" title="Edit"><i class="fa-regular fa-pen-to-square"></i></span>
          <span class="delete-button" title="Delete"><i class="fa-regular fa-circle-xmark"></i></span>
        </div>
      </li>
    `; 
    todoHTML += HTML;
  });

  document.querySelector('.todo-list')
    .innerHTML = todoHTML;

  document.querySelectorAll('.edit-button')
    .forEach((button, index) => {
      button.addEventListener('click', () => {
        updateTodo(index);
    });
  });

  document.querySelectorAll('.delete-button')
    .forEach((button, index) => {
      button.addEventListener('click', () => {
        trashBinList.push(todoList[index]);
        todoList.splice(index, 1);
        renderTrashBinList();
        renderTodoList();
      });
    });

  localStorage.setItem('data', JSON.stringify(todoList)); 
};

const addBtn = document.querySelector('.add-button');
const cancelBtn = document.querySelector('.cancel-button');
let btnMode = 'addMode';
let editIndex = null;

addBtn.addEventListener('click', addOrEdit);

/********************
    RESET BUTTONS
*********************/
function resetBtns() {
  input.value = '';
  addBtn.textContent = 'Add';
  btnMode = 'addMode';
  editIndex = null;
  cancelBtn.style.display = "none";
};

cancelBtn.addEventListener('click', () => {
  resetBtns();
  renderTodoList();
});

/**********************
   UPDATE TO-DO ITEM
***********************/
function updateTodo(index) {
  let input = document.getElementById("input");
  input.value = todoList[index].name;  
  addBtn.textContent = 'Edit';
  cancelBtn.style.display = "block";
  btnMode = 'editMode';
  editIndex = index;
};

/******************
   ADD/EDIT MODE
*******************/
function addOrEdit() {
  let input = document.getElementById("input");
  const todoName = input.value;

  if (btnMode === 'editMode') {

    if (todoName === '') {
      alert('Enter your text first, bruh');
      return;
    }
    todoList[editIndex].name = todoName;
    resetBtns();
    renderTodoList();

  } else {
  
    if (todoName === '') {
      alert('Enter your text first, bruh');
      return;
    }
    todoList.push({
      id: Date.now(),
      name: todoName, 
      isChecked: false 
    });

    input.value = '';
  };
  renderTodoList(); 
};

renderTodoList(); 

/**************************************************
  Add 'checked' when clicking on a list todo item
***************************************************/
const list = document.querySelector('.todo-list');

list.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    e.target.classList.toggle('checked');
  };
 
  const todoId = e.target.dataset.id;
  // const todoId = e.target.getAttribute('data-id');
  const match = todoList.find(todo => todo.id === Number(todoId));
  
  if(match !== undefined) {
    if (e.target.classList.contains('checked')) {
      match.isChecked = true;
    } else {
      match.isChecked = false;
    }
  }; 

  renderTodoList();
});

/*******************
  DARK MODE BUTTON 
********************/
const switchBtn = document.querySelector('.switch-btn');

if (darkModeOn) {
  document.documentElement.classList.add('dark-mode');
  switchBtn.classList.add('slide');
}

switchBtn.addEventListener('click', () => {
  darkModeOn = !darkModeOn;
  document.documentElement.classList.toggle('dark-mode', darkModeOn);
  switchBtn.classList.toggle('slide', darkModeOn);

  localStorage.setItem('mode', JSON.stringify(darkModeOn));

});

// toggle('class', condition)
// document.body returns the <body> element
// document.documentElement returns the <html> element

/****************
    TRASH BIN  
****************/
const bin = document.querySelector('.trash-bin-btn');
const binContainer = document.querySelector('.bin-container');
const closeBinBtn = document.querySelector('.close-bin-btn');
const clearAllBtn = document.querySelector('.bin-clear-all-btn');

bin.addEventListener('click', () => {
  binContainer.style.display = "block"; 
});
closeBinBtn.addEventListener('click', () => {
  binContainer.style.display = "none"; 
});

function renderTrashBinList() {
  let trashBinHTML = '';

  trashBinList.forEach((object) => {
    const { name } = object;
    const HTML = `
      <li class="bin-list-name">${name}
        <div class="bin-btn-container">
          <span class="restore-button" title="Restore"><i class="fa-solid fa-trash-arrow-up"></i></span>
          <span class="delete-trash-button" title="Delete"><i class="fa-regular fa-circle-xmark"></i></span>
        </div>
      </li>
    `; 

    trashBinHTML += HTML;
  });

  document.querySelector('.bin-list')
    .innerHTML = trashBinHTML;

  document.querySelectorAll('.restore-button')
    .forEach((button, index) => {
      button.addEventListener('click', () => {
        trashBinList[index].isChecked = false;
        todoList.push(trashBinList[index]);
        trashBinList.splice(index, 1);
        renderTrashBinList();
        renderTodoList();
      });
    });

  document.querySelectorAll('.delete-trash-button')
    .forEach((button, index) => {
      button.addEventListener('click', () => {
        trashBinList.splice(index, 1);
        renderTrashBinList();
    });
  });

  if (trashBinList.length === 0) {
    clearAllBtn.style.display = "none";
    document.querySelector('.bin-list')
    .innerHTML = `<div class="empty-message">It's empty</div>`;
  } else {
    clearAllBtn.style.display = "block";
  };

  localStorage.setItem('trash', JSON.stringify(trashBinList));
};

renderTrashBinList(); /* trashBinList */


clearAllBtn.addEventListener('click', () => {
  let text = 'Are you sure, gurl?';
  /* confirm(text); */
  if (trashBinList.length === 0) {
    alert("It's already empty");
    return;
  };

  if(confirm(text) === true) {
    trashBinList = [];
    renderTrashBinList();
  } else {
    return;
  };
  /* trashBinList = []; */
});

/* document.querySelector('.test-btn')
  .addEventListener('click', renderTrashBinList); */

/* console.log(Date.now()); */

/**********************************
  TRIGGER A BUTTON CLICK ON ENTER
***********************************/
document.getElementById("input")
  .addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addOrEdit();
    }
  });