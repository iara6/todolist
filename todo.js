let todoList = JSON.parse(localStorage.getItem('data')) || [
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
const audioError = new Audio("./sounds/click-error-1110.wav");

audioError.volume = 0.5; 

function renderTodoList() {
  console.log('renderTodoList');
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
        if (trashBinList.length >= 70) {
          audioError.play();
          alert('Your trash bin is full');
          return;
        };
        
        trashBinList.push(todoList[index]);
        todoList.splice(index, 1);
        renderTrashBinList();
        renderTodoList();
        renderMemoryUsageBar();
      });
    });

  localStorage.setItem('data', JSON.stringify(todoList)); 
};

const addBtn = document.querySelector('.add-button');
const cancelBtn = document.querySelector('.cancel-button');
let btnMode = 'addMode';
let editIndex = null;

const audioClick = new Audio("./sounds/typewriter-soft-click-1125.wav");

addBtn.addEventListener('click', () => {
  audioClick.play();
  addOrEdit();
});

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
  console.log('addOrEdit');

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
  moveProgressBar(); 
};

renderTodoList(); 

/*********************************
  DELETE ALL/UNCHECK ALL BUTTONS  
**********************************/
const deleteAllBtn = document.querySelector('.delete-all-btn');
const uncheckAllBtn = document.querySelector('.uncheck-all-btn');

deleteAllBtn.addEventListener('click', () => {
  let message = 'Are you sure?';
  audioClick.play();

  if(confirm(message) === true) {

    if (trashBinList.length >= 70) {
      audioError.play();
      alert('Your trash bin is full');
      return;
    } else {
      todoList.forEach((item) => {
        trashBinList.push(item);
      });
  
      renderTrashBinList();
      renderMemoryUsageBar();
      todoList = [];
      renderTodoList();
      moveProgressBar();
    };

  } else {
    return;
  };
});
console.log(trashBinList);

uncheckAllBtn.addEventListener('click', () => {
  todoList.forEach((item) => {
    item.isChecked = false;
  });

  audioClick.play();
  renderTodoList();
  moveProgressBar();
});


/**************************************************
  Add 'checked' when clicking on a list todo item
***************************************************/
const list = document.querySelector('.todo-list');

list.addEventListener('click', (e) => {
  console.log('list.addEventListener');

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
  moveProgressBar();
});

/************************
  LIGHT/DARK MODE BUTTON 
*************************/
const switchBtn = document.querySelector('.switch-btn');
/* const audio = new Audio("./sounds/mixkit-single-key-press-in-a-laptop-2541.wav"); */
const audioPop = new Audio("./sounds/long-pop-2358.wav");
audioPop.volume = 0.5; 

if (darkModeOn) {
  document.documentElement.classList.add('dark-mode');
  switchBtn.classList.add('slide');
}

switchBtn.addEventListener('click', () => {
  audioPop.play();
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
  /* audioClick.play(); */
  binContainer.style.display = "block"; 
});
closeBinBtn.addEventListener('click', () => {
  binContainer.style.display = "none"; 
});

function renderTrashBinList() {
  console.log('renderTrashBinList');

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
        moveProgressBar();
        renderMemoryUsageBar();
      });
    });

  document.querySelectorAll('.delete-trash-button')
    .forEach((button, index) => {
      button.addEventListener('click', () => {
        trashBinList.splice(index, 1);
        renderTrashBinList();
        renderMemoryUsageBar();
    });
  });

  const memoryBarContainer = document.querySelector('.memory-usage-bar-container');

  if (trashBinList.length === 0) {
    clearAllBtn.style.display = "none";
    memoryBarContainer.style.display = "none";
    document.querySelector('.bin-list')
    .innerHTML = `<div class="empty-message">It's empty</div>`;
  } else {
    clearAllBtn.style.display = "block";
    memoryBarContainer.style.display = "block";
  };

  localStorage.setItem('trash', JSON.stringify(trashBinList));
};

renderTrashBinList(); 

const audioCrumpledPaper = new Audio("./sounds/quick-paper-crumple-sound-2996.wav");
/* const audio = new Audio("./sounds/mixkit-page-back-chime-1108.wav"); */
audioCrumpledPaper.volume = 0.3; 

clearAllBtn.addEventListener('click', () => {
  let text = 'Are you sure?';

  audioClick.play();

  if(confirm(text) === true) {
    trashBinList = [];
    renderTrashBinList();
    renderMemoryUsageBar();
    audioCrumpledPaper.play();
  } else {
    return;
  };
});

/*------------------------------
  DRAGGABLE TRASH BIN CONTAINER 
--------------------------------*/

let isDraggable = false;
let offsetX, offsetY;

// checks if the mouse is over the scrollbar
function isMouseOverScrollbar(e) {
  const { clientWidth, scrollWidth } = binContainer;
  console.log(clientWidth);
  const isOverScrollbar = scrollWidth > clientWidth && e.offsetX > clientWidth;
  return isOverScrollbar;
};

console.log('isMouseOverScrollbar');
isMouseOverScrollbar(); 

binContainer.addEventListener('mousedown', (e) => {
  if (isMouseOverScrollbar(e)) return; 

  isDraggable = true;

  offsetX = e.clientX - binContainer.offsetLeft;
  offsetY = e.clientY - binContainer.offsetTop;

  binContainer.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (isDraggable) {
    binContainer.style.left = `${e.clientX - offsetX}px`;
    binContainer.style.top = `${e.clientY - offsetY}px`;
  };
});

document.addEventListener('mouseup', () => {
  isDraggable = false;
  binContainer.style.cursor = 'move';
 /*  if (isDraggable) {
    isDraggable = false;
    binContainer.style.cursor = 'move';
  } */
});

binContainer.addEventListener('mousemove', (e) => {
  binContainer.style.cursor = isMouseOverScrollbar(e) ? 'default' : 'move';
});

/***************************
   TRASH MEMORY USAGE BAR
****************************/
function renderMemoryUsageBar() {
  console.log('renderMemoryUsageBar');

  const memoryBar = document.querySelector('.memory-usage-bar');
  const memoryBarStep = Number((100 / 70).toFixed(2));
  let memoryBarWidth = null;

  memoryBarWidth = memoryBarStep * trashBinList.length;
  memoryBar.style.width = memoryBarWidth < 100 ? `${Math.ceil(memoryBarWidth)}%` : `${Math.floor(memoryBarWidth)}%`;
}
renderMemoryUsageBar();

/*****************
   PROGRESS BAR
******************/


/* audioPositive.volume = 0.6;  */
let audioPlayed = false;
const audioPositive1 = new Audio("./sounds/uplifting-flute-notification-2317.wav");
const audioPositive2 = new Audio("./sounds/cartoon-positive-sound-2255.wav");
const audioPositive3 = new Audio("./sounds/kids-cartoon-close-bells-2256.wav");
const audioPositive4 = new Audio("./sounds/toy-drums-and-bell-ding-560.wav");

const audioPositiveOptions = [audioPositive1, audioPositive2, audioPositive3, audioPositive4];

audioPositiveOptions.forEach((audio) => {
  audio.volume = 0.6;
});

function moveProgressBar() {
  console.log('moveProgressBar');

  const progressBar = document.querySelector('.progress-bar');
  const progressBarStep = Number((100 / todoList.length).toFixed(2));
  let progressBarWidth = 0;

  todoList.forEach((obj) => {
    const { isChecked } = obj;
    if (isChecked === true) {
      progressBarWidth += progressBarStep;
    };  
  });

  progressBar.style.width = progressBarWidth < 100 ? `${Math.ceil(progressBarWidth)}%` : `100%`;
  /* `${Math.floor(progressBarWidth)}% */

  const randomAudio = audioPositiveOptions[Math.floor(Math.random() * audioPositiveOptions.length)];

  if (progressBar.style.width === "100%" && !audioPlayed) {
    randomAudio.play();
    audioPlayed = true;
  };

  if (progressBar.style.width !== "100%") {
    audioPlayed = false;
  }
 
};
moveProgressBar();



/**********************************
  TRIGGER A BUTTON CLICK ON ENTER
***********************************/
const audioKey = new Audio("./sounds/single-key-press-in-a-laptop-2541.wav");

document.getElementById("input")
  .addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      audioKey.play();
      addOrEdit();
    }
  });