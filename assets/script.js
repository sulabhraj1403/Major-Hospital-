
const nav = document.querySelector('.navlinks');
const menu = document.querySelector('.menu');
if(menu) menu.addEventListener('click',()=>nav.classList.toggle('open'));

const saved = localStorage.getItem('majorHospitalLang') || 'en';
function setLang(lang){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el=>{
    const value = el.getAttribute('data-'+lang);
    if(value!==null) el.innerHTML=value;
  });
  document.querySelectorAll('.lang').forEach(b=>b.textContent = lang==='en' ? 'हिन्दी' : 'English');
  localStorage.setItem('majorHospitalLang',lang);
}
document.querySelectorAll('.lang').forEach(b=>b.addEventListener('click',()=>{
  setLang((localStorage.getItem('majorHospitalLang')||'en')==='en'?'hi':'en');
}));
setLang(saved);

const appt = document.getElementById('appointmentForm');
if(appt){
  appt.addEventListener('submit', e=>{
    e.preventDefault();
    const f = new FormData(appt);
    const msg = `Appointment Request%0AName: ${f.get('name')}%0APhone: ${f.get('phone')}%0AAge: ${f.get('age')}%0APlace: ${f.get('place')}%0ADepartment: ${f.get('department')||'Not specified'}`;
    window.open(`https://wa.me/916296500515?text=${msg}`,'_blank');
  });
}

// Members login and Important Reminders
function memberLogin(e){
  e.preventDefault();
  const user = document.getElementById('memberUser').value.trim();
  const pass = document.getElementById('memberPass').value;
  const msg = document.getElementById('loginMsg');
  if(user === 'dr' && pass === '1925'){
    sessionStorage.setItem('majorHospitalMember','1');
    window.location.href='member-dashboard.html';
  }else{
    msg.textContent='Incorrect username or password.';
    msg.style.color='#a32121';
  }
}
function requireMember(){
  if(sessionStorage.getItem('majorHospitalMember')!=='1'){
    window.location.href='members.html';
  }
}
function logoutMember(){
  sessionStorage.removeItem('majorHospitalMember');
  window.location.href='members.html';
}
function loadReminders(){
  const rows = JSON.parse(localStorage.getItem('majorHospitalReminders') || '[]');
  rows.sort((a,b)=>a.expiry.localeCompare(b.expiry));
  const body=document.getElementById('reminderBody');
  if(!body) return;
  body.innerHTML='';
  if(!rows.length){
    body.innerHTML='<tr><td colspan="4" class="empty-row">No reminders added yet.</td></tr>';
    return;
  }
  rows.forEach((r,i)=>{
    const tr=document.createElement('tr');
    tr.dataset.index=i;
    tr.innerHTML=`<td><input type="radio" name="selectedReminder" value="${i}" aria-label="Select row"></td>
      <td>${escapeHtml(r.name)}</td><td>${formatDate(r.expiry)}</td>`;
    tr.addEventListener('click',ev=>{
      if(ev.target.tagName!=='INPUT') tr.querySelector('input').checked=true;
      document.querySelectorAll('#reminderBody tr').forEach(x=>x.classList.remove('selected'));
      tr.classList.add('selected');
    });
    body.appendChild(tr);
  });
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function formatDate(s){
  if(!s) return '';
  const d=new Date(s+'T00:00:00');
  return d.toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function addReminder(e){
  e.preventDefault();
  const name=document.getElementById('rName').value.trim();
  const expiry=document.getElementById('rExpiry').value;
  if(!name||!expiry) return;
  const rows=JSON.parse(localStorage.getItem('majorHospitalReminders')||'[]');
  rows.push({name,expiry});
  localStorage.setItem('majorHospitalReminders',JSON.stringify(rows));
  e.target.reset();
  loadReminders();
}
function deleteSelectedReminder(){
  const selected=document.querySelector('input[name="selectedReminder"]:checked');
  if(!selected){alert('Please select a row to delete.');return;}
  const rows=JSON.parse(localStorage.getItem('majorHospitalReminders')||'[]');
  rows.sort((a,b)=>a.expiry.localeCompare(b.expiry));
  rows.splice(Number(selected.value),1);
  localStorage.setItem('majorHospitalReminders',JSON.stringify(rows));
  loadReminders();
}
