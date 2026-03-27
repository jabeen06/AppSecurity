const ALLOWED_DOMAIN = '@arborinternationalschool.com';
const ADMIN_EMAIL = 'alsuha5c@arborinternationalschool.com';
const STORAGE_KEY = 'oratoryGuildData';

const ROLES = [
  'G.O.D (Guilder of the Day)',
  'Chronomaster',
  'T.T.M (Thematic Topics Master)',
  'Grammarian',
  'Articulation Auditor',
  'Critical Listener',
  'Guild Speaker',
  'Speech Evaluator',
  'General Evaluator',
  'Ballot Steward'
];

const OR_STAGES = [
  { id: 1, name: 'OR-1: Icebreaker', objective: 'Introduce self with confidence.', structure: 'Opening, background, values, closing.', time: '3-5 min', criteria: 'Clarity, confidence, structure.' },
  { id: 2, name: 'OR-2: Informative', objective: 'Teach an idea clearly.', structure: 'Topic statement, key points, summary.', time: '4-6 min', criteria: 'Accuracy, explanation, audience engagement.' },
  { id: 3, name: 'OR-3: Persuasive', objective: 'Convince with logic and examples.', structure: 'Claim, evidence, call-to-action.', time: '4-6 min', criteria: 'Reasoning, evidence, delivery.' },
  { id: 4, name: 'OR-4: Storytelling', objective: 'Use story for message impact.', structure: 'Setup, conflict, resolution, takeaway.', time: '4-6 min', criteria: 'Narrative flow, expression, message.' },
  { id: 5, name: 'OR-5: Leadership speech', objective: 'Inspire and lead peers.', structure: 'Vision, values, action points.', time: '5-7 min', criteria: 'Leadership tone, practicality, motivation.' }
];

const TIMING = {
  prepared: { green: '3:00', yellow: '4:00', red: '5:00', grace: '5:30' },
  evaluation: { green: '2:00', yellow: '2:30', red: '3:00', grace: '3:30' },
  tableTopics: { green: '1:00', yellow: '1:30', red: '2:00', grace: '2:30' }
};

const MEETING_FLOW = [
  'Opening by G.O.D',
  'Role introduction',
  'Word & Idiom',
  'Prepared speeches',
  'Evaluations',
  'Table Topics',
  'Reports',
  'General evaluation',
  'Voting',
  'Closing oath'
];

const state = {
  db: loadDb(),
  currentUser: null,
  currentTab: 'Dashboard'
};

const authForm = document.getElementById('authForm');
const authError = document.getElementById('authError');
const authCard = document.getElementById('authCard');
const app = document.getElementById('app');
const tabsEl = document.getElementById('tabs');
const contentEl = document.getElementById('content');

init();

function init() {
  authForm.addEventListener('submit', onAuth);
}

function loadDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  return { users: [], meetings: [], notifications: [], votes: [], roleHistory: [], orRequests: [] };
}

function saveDb() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.db));
}

function onAuth(e) {
  e.preventDefault();
  const user = {
    name: document.getElementById('name').value.trim(),
    classNo: document.getElementById('studentClass').value,
    section: document.getElementById('section').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim().toLowerCase()
  };

  const validation = validateUser(user);
  if (validation) {
    authError.textContent = validation;
    return;
  }

  let existing = state.db.users.find(u => u.email === user.email);
  if (!existing) {
    existing = { ...user, id: crypto.randomUUID(), isAdmin: user.email === ADMIN_EMAIL, orCompleted: 0 };
    state.db.users.push(existing);
    saveDb();
  }

  state.currentUser = existing;
  authError.textContent = '';
  authCard.classList.add('hidden');
  app.classList.remove('hidden');
  renderTabs();
}

function validateUser(user) {
  if (!['6', '7', '8'].includes(user.classNo)) return 'Only classes 6, 7, and 8 are allowed.';
  if (!user.phone) return 'Phone number is mandatory.';
  if (!user.email.endsWith(ALLOWED_DOMAIN)) return `Only ${ALLOWED_DOMAIN} email addresses are allowed.`;
  return '';
}

function renderTabs() {
  const baseTabs = ['Dashboard', 'Club', 'Roles', 'Meeting', 'OR System', 'Timing', 'Voting'];
  const adminTabs = ['Admin'];
  const tabs = state.currentUser.isAdmin ? [...baseTabs, ...adminTabs] : baseTabs;

  tabsEl.innerHTML = '';
  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = `tab ${state.currentTab === tab ? 'active' : ''}`;
    btn.textContent = tab;
    btn.onclick = () => {
      state.currentTab = tab;
      renderTabs();
    };
    tabsEl.appendChild(btn);
  });
  renderContent();
}

function renderContent() {
  switch (state.currentTab) {
    case 'Dashboard': return renderDashboard();
    case 'Club': return renderClub();
    case 'Roles': return renderRoles();
    case 'Meeting': return renderMeeting();
    case 'OR System': return renderOR();
    case 'Timing': return renderTiming();
    case 'Voting': return renderVoting();
    case 'Admin': return renderAdmin();
    default: return renderDashboard();
  }
}

function renderDashboard() {
  const user = state.currentUser;
  const userRoles = state.db.roleHistory.filter(r => r.userId === user.id);
  contentEl.innerHTML = `
    <h2>Welcome, ${escapeHtml(user.name)} ${user.isAdmin ? '<span class="badge">ADMIN</span>' : ''}</h2>
    <p><strong>Class:</strong> ${user.classNo}-${escapeHtml(user.section)} | <strong>Email:</strong> ${escapeHtml(user.email)}</p>
    <h3>Your Progress Tracker</h3>
    <p>OR completed: <strong>${user.orCompleted}</strong>/5</p>
    <progress max="5" value="${user.orCompleted}"></progress>
    <h3>Your Role History</h3>
    ${userRoles.length ? `<ul>${userRoles.map(r => `<li>${escapeHtml(r.role)} (${escapeHtml(r.meetingDate)})</li>`).join('')}</ul>` : '<p>No roles yet.</p>'}
    <h3>Meeting Participation & Reports</h3>
    <p>Total meetings joined: ${userRoles.length}</p>
    <p>Latest admin SMS: ${state.db.notifications.length ? escapeHtml(state.db.notifications[state.db.notifications.length - 1].message) : 'None'}</p>
  `;
}

function renderClub() {
  const tpl = document.getElementById('clubInfoTpl');
  contentEl.innerHTML = '';
  contentEl.appendChild(tpl.content.cloneNode(true));
}

function renderRoles() {
  contentEl.innerHTML = `
    <h2>Role Structure</h2>
    <div class="split">
      <div>
        <h3>Detailed Role Pages</h3>
        <ul>${ROLES.map(r => `<li><strong>${escapeHtml(r)}</strong><br/>Purpose: ${rolePurpose(r)}</li>`).join('')}</ul>
      </div>
      <div>
        <h3>Role Selection</h3>
        <form id="assignRoleForm" class="grid">
          <label>Meeting
            <select id="meetingSelect" required>
              <option value="">Select a meeting</option>
              ${state.db.meetings.map(m => `<option value="${m.id}">${escapeHtml(m.dateTime)}</option>`).join('')}
            </select>
          </label>
          <label>Role
            <select id="roleSelect" required>
              <option value="">Select role</option>
              ${ROLES.map(r => {
                const lock = r.startsWith('G.O.D') && state.currentUser.orCompleted < 3;
                return `<option value="${r}" ${lock ? 'disabled' : ''}>${r}${lock ? ' (Unlock after OR-3)' : ''}</option>`;
              }).join('')}
            </select>
          </label>
          <button type="submit">Select Role</button>
        </form>
        <p id="roleMsg"></p>
      </div>
    </div>
  `;

  document.getElementById('assignRoleForm').onsubmit = e => {
    e.preventDefault();
    const meetingId = document.getElementById('meetingSelect').value;
    const role = document.getElementById('roleSelect').value;
    const msg = document.getElementById('roleMsg');
    const meeting = state.db.meetings.find(m => m.id === meetingId);
    if (!meeting) return msg.textContent = 'Please choose a meeting.';
    if (!role) return msg.textContent = 'Please choose a role.';
    if (role.startsWith('G.O.D') && state.currentUser.orCompleted < 3) return msg.textContent = 'G.O.D role unlocks only after OR-3.';

    meeting.assignments = meeting.assignments || {};
    const alreadyHasRole = Object.entries(meeting.assignments).find(([, uid]) => uid === state.currentUser.id);
    if (alreadyHasRole) return msg.textContent = 'Only one role per user per meeting is allowed.';
    if (meeting.assignments[role]) return msg.textContent = 'This role is already selected by another user.';

    meeting.assignments[role] = state.currentUser.id;
    state.db.roleHistory.push({ userId: state.currentUser.id, role, meetingDate: meeting.dateTime });
    saveDb();
    msg.textContent = 'Role assigned successfully.';
    renderContent();
  };
}

function renderMeeting() {
  const meetings = state.db.meetings;
  contentEl.innerHTML = `
    <h2>Meeting Structure</h2>
    <ol>${MEETING_FLOW.map(step => `<li>${step}</li>`).join('')}</ol>
    <h3>Upcoming Meetings</h3>
    ${meetings.length ? `<table class="table"><tr><th>Date & Time</th><th>Assignments</th></tr>${meetings.map(m => `<tr><td>${escapeHtml(m.dateTime)}</td><td>${renderAssignments(m)}</td></tr>`).join('')}</table>` : '<p>No meetings scheduled yet.</p>'}
    <h3>Word & Idiom of the Day</h3>
    <p><strong>Word:</strong> Eloquent</p>
    <p><strong>Idiom:</strong> Break the ice</p>
    <p>Members are appreciated for using both during speeches.</p>
  `;
}

function renderOR() {
  contentEl.innerHTML = `
    <h2>OR System</h2>
    <table class="table">
      <tr><th>Stage</th><th>Objective</th><th>Structure</th><th>Time</th><th>Evaluation Criteria</th></tr>
      ${OR_STAGES.map(s => `<tr><td>${s.name}</td><td>${s.objective}</td><td>${s.structure}</td><td>${s.time}</td><td>${s.criteria}</td></tr>`).join('')}
    </table>
    <h3>Submit OR Completion Request</h3>
    <form id="orReqForm" class="row">
      <select id="orStage">${OR_STAGES.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
      <button type="submit">Request Approval</button>
    </form>
    <p id="orMsg"></p>
  `;

  document.getElementById('orReqForm').onsubmit = e => {
    e.preventDefault();
    const stage = Number(document.getElementById('orStage').value);
    state.db.orRequests.push({ id: crypto.randomUUID(), userId: state.currentUser.id, stage, status: 'Pending' });
    saveDb();
    document.getElementById('orMsg').textContent = 'OR completion request submitted for admin approval.';
  };
}

function renderTiming() {
  contentEl.innerHTML = `
    <h2>Timing System</h2>
    <table class="table">
      <tr><th>Type</th><th>Green</th><th>Yellow</th><th>Red</th><th>Grace</th></tr>
      <tr><td>Prepared Speech</td><td>${TIMING.prepared.green}</td><td>${TIMING.prepared.yellow}</td><td>${TIMING.prepared.red}</td><td>${TIMING.prepared.grace}</td></tr>
      <tr><td>Evaluation</td><td>${TIMING.evaluation.green}</td><td>${TIMING.evaluation.yellow}</td><td>${TIMING.evaluation.red}</td><td>${TIMING.evaluation.grace}</td></tr>
      <tr><td>Table Topics</td><td>${TIMING.tableTopics.green}</td><td>${TIMING.tableTopics.yellow}</td><td>${TIMING.tableTopics.red}</td><td>${TIMING.tableTopics.grace}</td></tr>
    </table>
  `;
}

function renderVoting() {
  const meetings = state.db.meetings;
  contentEl.innerHTML = `
    <h2>Voting System</h2>
    <p>Awards: Best Speaker, Best Evaluator, Best Roleplayer, Best Thematic Topics Speaker</p>
    <p>Eligibility: speaker must be within allowed timing range.</p>
    <form id="voteForm" class="grid">
      <label>Meeting
        <select id="voteMeeting">${meetings.map(m => `<option value="${m.id}">${escapeHtml(m.dateTime)}</option>`).join('')}</select>
      </label>
      <label>Award
        <select id="award">
          <option>Best Speaker</option>
          <option>Best Evaluator</option>
          <option>Best Roleplayer</option>
          <option>Best Thematic Topics Speaker</option>
        </select>
      </label>
      <label>Nominee Email
        <input id="nominee" type="email" required />
      </label>
      <label>Spoke within time?
        <select id="timed"><option value="yes">Yes</option><option value="no">No</option></select>
      </label>
      <button type="submit">Submit Vote</button>
    </form>
    <p id="voteMsg"></p>
  `;

  document.getElementById('voteForm').onsubmit = e => {
    e.preventDefault();
    const timed = document.getElementById('timed').value;
    const msg = document.getElementById('voteMsg');
    if (timed !== 'yes') return msg.textContent = 'Vote rejected: nominee outside allowed time range.';
    const nominee = document.getElementById('nominee').value.trim().toLowerCase();
    const exists = state.db.users.some(u => u.email === nominee);
    if (!exists) return msg.textContent = 'Nominee must be a registered user.';
    state.db.votes.push({
      id: crypto.randomUUID(),
      by: state.currentUser.id,
      meetingId: document.getElementById('voteMeeting').value,
      award: document.getElementById('award').value,
      nominee
    });
    saveDb();
    msg.textContent = 'Vote recorded.';
  };
}

function renderAdmin() {
  if (!state.currentUser.isAdmin) {
    contentEl.innerHTML = '<p class="error">Access denied.</p>';
    return;
  }

  const pending = state.db.orRequests.filter(r => r.status === 'Pending');
  contentEl.innerHTML = `
    <h2>Admin Control Panel</h2>
    <div class="split">
      <div>
        <h3>Add Meeting Date & Time</h3>
        <form id="meetingForm" class="row">
          <input id="meetingDateTime" type="datetime-local" required />
          <button type="submit">Add Meeting</button>
        </form>
        <h3>Send SMS Notification</h3>
        <form id="smsForm" class="row">
          <input id="smsDate" type="date" required />
          <input id="smsTime" type="time" required />
          <button type="submit">Send SMS</button>
        </form>
        <p id="smsMsg"></p>
      </div>
      <div>
        <h3>Approve OR Completion</h3>
        ${pending.length ? `<ul>${pending.map(r => `<li>${userById(r.userId)?.name || 'User'} requested OR-${r.stage} <button data-approve="${r.id}">Approve</button></li>`).join('')}</ul>` : '<p>No pending requests.</p>'}
      </div>
    </div>

    <h3>All Users</h3>
    <table class="table"><tr><th>Name</th><th>Class</th><th>Email</th><th>Phone</th><th>Role</th><th>OR Completed</th></tr>
      ${state.db.users.map(u => `<tr><td>${escapeHtml(u.name)}</td><td>${u.classNo}-${escapeHtml(u.section)}</td><td>${escapeHtml(u.email)}</td><td>${escapeHtml(u.phone)}</td><td>${u.isAdmin ? 'Admin' : 'Student'}</td><td>${u.orCompleted}</td></tr>`).join('')}
    </table>

    <h3>Participation & Reports</h3>
    <p>Total roles assigned: ${state.db.roleHistory.length}</p>
    <p>Total votes cast: ${state.db.votes.length}</p>
  `;

  document.getElementById('meetingForm').onsubmit = e => {
    e.preventDefault();
    const dateTime = document.getElementById('meetingDateTime').value;
    state.db.meetings.push({ id: crypto.randomUUID(), dateTime, assignments: {} });
    saveDb();
    renderContent();
  };

  document.getElementById('smsForm').onsubmit = e => {
    e.preventDefault();
    const date = document.getElementById('smsDate').value;
    const time = document.getElementById('smsTime').value;
    const message = `The Oratory Guild meeting is on ${date} at ${time}`;
    state.db.notifications.push({ id: crypto.randomUUID(), message, sentBy: state.currentUser.id, createdAt: new Date().toISOString() });
    saveDb();
    document.getElementById('smsMsg').textContent = `SMS queued: "${message}"`;
  };

  contentEl.querySelectorAll('button[data-approve]').forEach(btn => {
    btn.onclick = () => approveOr(btn.dataset.approve);
  });
}

function approveOr(reqId) {
  const req = state.db.orRequests.find(r => r.id === reqId);
  if (!req || req.status !== 'Pending') return;
  req.status = 'Approved';
  const user = userById(req.userId);
  if (user) user.orCompleted = Math.max(user.orCompleted, req.stage);
  saveDb();
  renderContent();
}

function userById(id) {
  return state.db.users.find(u => u.id === id);
}

function renderAssignments(meeting) {
  const entries = Object.entries(meeting.assignments || {});
  if (!entries.length) return 'No roles assigned';
  return entries.map(([role, uid]) => `${escapeHtml(role)}: ${escapeHtml(userById(uid)?.name || 'Unknown')}`).join('<br/>');
}

function rolePurpose(role) {
  const map = {
    'G.O.D (Guilder of the Day)': 'Opens and anchors the full meeting.',
    'Chronomaster': 'Tracks time and signals colors.',
    'T.T.M (Thematic Topics Master)': 'Runs impromptu thematic speaking rounds.',
    'Grammarian': 'Tracks language quality and notable usage.',
    'Articulation Auditor': 'Observes clarity, diction, and pronunciation.',
    'Critical Listener': 'Checks depth of listening and interpretation.',
    'Guild Speaker': 'Delivers prepared speech.',
    'Speech Evaluator': 'Provides specific feedback for speaker growth.',
    'General Evaluator': 'Reviews overall meeting quality.',
    'Ballot Steward': 'Manages fair voting and award counts.'
  };
  return map[role] || 'Contributes to meeting excellence.';
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
