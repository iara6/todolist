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

/*------------------
    audio files
-------------------*/
const audioError = new Audio("./sounds/click-error-1110.wav");
const audioClick = new Audio("./sounds/typewriter-soft-click-1125.wav");
const audioPressClick = new Audio("./sounds/click_button_short_sharp.mp3");
const audioPop = new Audio("./sounds/long-pop-2358.wav");
const audioCrumpledPaper = new Audio("./sounds/quick-paper-crumple-sound-2996.wav");
const audioPositive1 = new Audio("./sounds/uplifting-flute-notification-2317.wav");
const audioPositive2 = new Audio("./sounds/cartoon-positive-sound-2255.wav");
const audioPositive3 = new Audio("./sounds/kids-cartoon-close-bells-2256.wav");
const audioPositive4 = new Audio("./sounds/toy-drums-and-bell-ding-560.wav");
const audioKey = new Audio("./sounds/single-key-press-in-a-laptop-2541.wav");

/************************
    DISPLAY TO-DO LIST
*************************/
audioError.volume = 0.5; 
const maxTrashBinSlots = 100; 

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
        if (trashBinList.length >= maxTrashBinSlots) {
          audioError.play();
          alert('Your trash bin is full');
          return;
        };
        
        trashBinList.push(todoList[index]);
        todoList.splice(index, 1);
        renderTrashBinList();
        renderTodoList();
        moveProgressBar();
        renderMemoryUsageBar();
      });
    });

  localStorage.setItem('data', JSON.stringify(todoList)); 
};

const addBtn = document.querySelector('.add-button');
const cancelBtn = document.querySelector('.cancel-button');
let btnMode = 'addMode';
let editIndex = null;

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
  audioClick.play();
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
function checkInput(value) {
  if (value.trim() === '') {
    alert('Enter your text first, bruh');
    return false;
  }
  return true;
}

function addOrEdit() {
  let input = document.getElementById("input");
  const todoName = input.value;

  if (btnMode === 'editMode') {

    if (!checkInput(todoName)) return;

    todoList[editIndex].name = todoName;
    resetBtns();
    renderTodoList();

  } else {
  
    if (!checkInput(todoName)) return;
    
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
  audioClick.play();

  if (todoList.length === 0) {
    alert('There are no items to delete.');
    return;
  };

  let message = 'Are you sure?';
  if(!confirm(message)) return;
  
  const availableSlots = maxTrashBinSlots - trashBinList.length;

  if (availableSlots <= 0) {
    audioError.play();
    alert('Your trash bin is full');
    return;
  }
    
  if (todoList.length > availableSlots) {
    const itemsToAdd = todoList.slice(0, availableSlots);
    trashBinList.push(...itemsToAdd);
    todoList = todoList.slice(availableSlots);

    audioError.play();
    alert('Your trash bin is full. Not all items could be moved.');

  } else {
    trashBinList.push(...todoList);
    todoList = [];
  };
  
    renderTrashBinList();
    renderMemoryUsageBar();
    renderTodoList();
    moveProgressBar();
});

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

audioPressClick.volume = 0.08;

list.addEventListener('click', (e) => {
  if (e.target.tagName !== 'LI') return;

  e.target.classList.toggle('checked');
  audioPressClick.play();
 
  const todoId = Number(e.target.dataset.id);
  // const todoId = e.target.getAttribute('data-id');
  const match = todoList.find(todo => todo.id === todoId);
  
  if(match) {
    match.isChecked = e.target.classList.contains('checked');
   /*  if (e.target.classList.contains('checked')) {
      match.isChecked = true;
    } else {
      match.isChecked = false;
    } */
  }; 

  renderTodoList();
  moveProgressBar();
});

/**********************
  SOUND ON/OFF BUTTON 
***********************/
const soundBtn = document.querySelector('.sound-btn');
const soundOnIcon = document.querySelector('.fa-volume-high');
const soundOffIcon = document.querySelector('.fa-volume-off');
const audioFiles = [audioError, audioClick, audioPressClick, audioPop, audioCrumpledPaper, audioPositive1, audioPositive2, audioPositive3, audioPositive4, audioKey];

let isSoundOn = true;

soundBtn.addEventListener('click', () => {
  isSoundOn = !isSoundOn;

  soundOnIcon.classList.toggle('hidden', !isSoundOn);
  soundOffIcon.classList.toggle('hidden', isSoundOn);

  audioFiles.forEach(audio => {
    audio.muted = !isSoundOn;
  });

  if (isSoundOn) {
    audioClick.play();
  }
});

/************************
  LIGHT/DARK MODE BUTTON 
*************************/
const switchBtn = document.querySelector('.switch-btn');
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
const binList = document.querySelector('.bin-list');
const memoryBarContainer = document.querySelector('.memory-usage-bar-container');

function elementVisibility(element, show) {
  element.style.display = show ? "block" : "none";
}

bin.addEventListener('click', () => {
  audioClick.play();
  elementVisibility(binContainer, true);
});

closeBinBtn.addEventListener('click', () => {
  elementVisibility(binContainer, false);
});

function renderTrashBinList() {
  let trashBinHTML = '';

  if (trashBinList.length === 0) {
    binList.innerHTML = `<div class="empty-message">It's empty</div>`;
    elementVisibility(clearAllBtn, false);
    elementVisibility(memoryBarContainer, false);
  } else {
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
  
    binList.innerHTML = trashBinHTML;

    elementVisibility(clearAllBtn, true);
    elementVisibility(memoryBarContainer, true);
  }
  
  addTrashBinListeners();
  localStorage.setItem('trash', JSON.stringify(trashBinList));
};

function addTrashBinListeners() {
  binList.querySelectorAll('.restore-button')
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

  binList.querySelectorAll('.delete-trash-button')
    .forEach((button, index) => {
      button.addEventListener('click', () => {
        trashBinList.splice(index, 1);
        renderTrashBinList();
        renderMemoryUsageBar();
    });
  });
}

clearAllBtn.addEventListener('click', () => {
  let text = 'Are you sure?';
  audioClick.play();
  
  if(!confirm(text)) return;
  
  trashBinList = [];
  renderTrashBinList();
  renderMemoryUsageBar();
  audioCrumpledPaper.play();
});

renderTrashBinList(); 
audioCrumpledPaper.volume = 0.3; 

/*------------------------------
  DRAGGABLE TRASH BIN CONTAINER 
--------------------------------*/
let isDraggable = false;
let offsetX, offsetY;

// checks if the mouse is over the scrollbar
function isMouseOverScrollbar(e) {
  const { clientWidth, clientHeight, scrollHeight } = binContainer;
  console.log(clientWidth); // 422
  console.log(clientHeight); // 500
  console.log(scrollHeight); // 2061
  const isOverScrollbar = scrollHeight > clientHeight && e.offsetX >= clientWidth;
  console.log(isOverScrollbar); //false
  // when hovering over scrollbar - true
  return isOverScrollbar;
};

/* console.log('isMouseOverScrollbar');
isMouseOverScrollbar();  */

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
});

binContainer.addEventListener('mousemove', (e) => {
  binContainer.style.cursor = isMouseOverScrollbar(e) ? 'default' : 'move';
});

/***************************
   TRASH MEMORY USAGE BAR
****************************/
function renderMemoryUsageBar() {
  const memoryBar = document.querySelector('.memory-usage-bar');
  const memoryBarStep = Number((100 / maxTrashBinSlots).toFixed(2));
  let memoryBarWidth = null;

  memoryBarWidth = memoryBarStep * trashBinList.length;
  memoryBar.style.width = memoryBarWidth < 100 ? `${Math.ceil(memoryBarWidth)}%` : `${Math.floor(memoryBarWidth)}%`;
  console.log('renderMemoryUsageBar');
}
renderMemoryUsageBar();

/*****************
   PROGRESS BAR
******************/

let audioPlayed = false;

const audioPositiveOptions = [audioPositive1, audioPositive2, audioPositive3, audioPositive4];

audioPositiveOptions.forEach((audio) => {
  audio.volume = 0.6;
});

function moveProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  const progressBarStep = Number((100 / todoList.length).toFixed(2));
  const progressBarContainer = document.querySelector('.progress-bar-container');

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
    progressBarContainer.style.boxShadow = "0 0 5px 1px var(--clr-9)";
  };

  if (progressBar.style.width !== "100%") {
    audioPlayed = false;
    progressBarContainer.style.boxShadow = "none";
  }
 
};
moveProgressBar();

/**********************************
  TRIGGER A BUTTON CLICK ON ENTER
***********************************/

document.getElementById("input")
  .addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      audioKey.play();
      addOrEdit();
    }
  });