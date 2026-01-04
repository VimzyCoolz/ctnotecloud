let currentUser = null;
let currentNoteId = null;

// Elements
const authDiv = document.getElementById('auth');
const dashboardDiv = document.getElementById('dashboard');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const profilePicInput = document.getElementById('profilePic');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const authMsg = document.getElementById('authMsg');

const logoutBtn = document.getElementById('logoutBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const saveBtn = document.getElementById('saveBtn');
const notesList = document.getElementById('notesList');

// Signup
signupBtn.onclick = async () => {
  const formData = new FormData();
  formData.append('email', emailInput.value);
  formData.append('username', usernameInput.value);
  formData.append('password', passwordInput.value);
  if(profilePicInput.files[0]) formData.append('profilePic', profilePicInput.files[0]);

  const res = await fetch('/api/auth/signup', { method:'POST', body: formData });
  const data = await res.json();
  authMsg.textContent = data.msg;
  if(res.ok){ loginUser(data.user); }
};

// Login
loginBtn.onclick = async () => {
  const res = await fetch('/api/auth/login', {
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
  });
  const data = await res.json();
  authMsg.textContent = data.msg;
  if(res.ok){ loginUser(data.user); }
};

// Login helper
function loginUser(user){
  currentUser = user;
  authDiv.style.display = 'none';
  dashboardDiv.style.display = 'block';
  loadNotes();
}

// Logout
logoutBtn.onclick = () => {
  currentUser = null;
  currentNoteId = null;
  authDiv.style.display = 'block';
  dashboardDiv.style.display = 'none';
};

// Load notes
async function loadNotes(){
  const res = await fetch(`/api/notes/${currentUser.id}`);
  const data = await res.json();
  notesList.innerHTML = '';
  data.forEach(note => {
    const div = document.createElement('div');
    div.className = 'noteItem';
    div.textContent = note.title;
    div.onclick = () => loadNote(note);
    notesList.appendChild(div);
  });
}

// Load note into editor
function loadNote(note){
  currentNoteId = note._id;
  noteTitle.value = note.title;
  noteContent.value = note.content;
}

// Save note
saveBtn.onclick = async () => {
  if(!currentNoteId){
    const res = await fetch('/api/notes/create',{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        userId: currentUser.id,
        title: noteTitle.value,
        content: noteContent.value
      })
    });
    const note = await res.json();
    currentNoteId = note._id;
  } else {
    await fetch(`/api/notes/${currentNoteId}`,{
      method:'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        title: noteTitle.value,
        content: noteContent.value
      })
    });
  }
  loadNotes();
  alert('Saved ✅');
}

// Auto-save every 10 seconds
setInterval(() => { if(currentNoteId) saveBtn.onclick(); }, 10000);