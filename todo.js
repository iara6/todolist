const todoList = JSON.parse(localStorage.getItem('data')) || [
  { 
    name: 'make dinner',
    isChecked: true
  }, {
    name: 'water plants',
    isChecked: false
  }, {
    name: 'meditate',
    isChecked: false
  },
];

let trashBinList = JSON.parse(localStorage.getItem('trash')) || [];

renderTodoList();
/* renderTrashBinList();  */

function renderTodoList() {

  let todoHTML = '';

  todoList.forEach((object) => {
    const { name, isChecked } = object;
    const HTML = `
      <li class="todo-name ${isChecked ? 'checked' : ''}">${name}
        <div class="todo-btn-container">
          <span class="edit-button"><i class="fa-regular fa-pen-to-square"></i></span>
          <span class="delete-button"><i class="fa-regular fa-circle-xmark"></i></span>
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
        /* console.log('test click'); */
        trashBinList.push(todoList[index]);
        todoList.splice(index, 1);
/*         console.log(trashBinList);
        console.log(index); */
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

function updateTodo(index) {
  let input = document.getElementById("input");
  input.value = todoList[index].name;  
  addBtn.textContent = 'Edit';
  cancelBtn.style.display = "block";
  btnMode = 'editMode';
  editIndex = index;
};

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
  
    todoList.push({ name: todoName, isChecked: false });
    input.value = '';
  };
  renderTodoList(); 
};

renderTodoList(); 

// add 'checked' when clicking on a list todo item

const list = document.querySelector('.todo-list');

list.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    e.target.classList.toggle('checked');
  };
 
  let match;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].name === e.target.innerText) {
      match = todoList[i];
      break;
    }
  }

  if(match !== undefined) {
    if (e.target.classList.contains('checked')) {
      match.isChecked = true;
    } else {
      match.isChecked = false;
    }
  }; 

  renderTodoList();
});

// TRIGGER A BUTTON CLICK ON ENTER

document.getElementById("input")
  .addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addOrEdit();
    }
  });


/*******************
  DARK MODE BUTTON 
********************/
const switchBtn = document.querySelector('.switch-btn');

switchBtn.addEventListener('click', () => {
  const darkModeOn = switchBtn.classList.toggle('slide');
  document.documentElement.classList.toggle('dark-mode', darkModeOn);
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

bin.addEventListener('click', () => {
  binContainer.style.display = "block"; 
});
closeBinBtn.addEventListener('click', () => {
  binContainer.style.display = "none"; 
});

/* const restoreButtons = document.querySelectorAll('.restore-button'); *//* const deleteTrashButtons = document.querySelectorAll('.delete-trash-button');
 */

function renderTrashBinList() {
  /* console.log('hello there'); */
  let trashBinHTML = '';

  /* if (trashBinList.length === 0) {
    document.querySelector('.bin-list')
    .innerHTML = ``
  }; */  /* CONTINUEEE */

  trashBinList.forEach((object) => {
    const { name } = object;
    const HTML = `
      <li class="bin-list-name">${name}
        <div class="bin-btn-container">
          <span class="restore-button"><i class="fa-solid fa-trash-arrow-up"></i></span>
          <span class="delete-trash-button"><i class="fa-regular fa-circle-xmark"></i></span>
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

  localStorage.setItem('trash', JSON.stringify(trashBinList));
};

renderTrashBinList(); /* trashBinList */

const clearAllBtn = document.querySelector('.bin-clear-all-btn');
clearAllBtn.addEventListener('click', () => {
  let text = 'Are you sure, gurl?';
  /* confirm(text); */
  if(confirm(text) === true) {
    console.log('sup bro');
    trashBinList = [];
    renderTrashBinList();
  } else {
    return;
  };
  /* trashBinList = []; */
});

document.querySelector('.test-btn')
  .addEventListener('click', renderTrashBinList);

