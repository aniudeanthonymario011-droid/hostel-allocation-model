/**
 * ============================================================================
 * BUK Roommate Allocation System - Complete Raw JavaScript Engine
 * Architecture:
 *   1. Compatibility Engine (100-Point Weighted Algorithm)
 *   2. Duplicate Detection Engine (RegNo & 100% Identical Data Check)
 *   3. Client & Session State (localStorage Persistent Database)
 *   4. Creator Backend Controller (Password: buk2026)
 * ============================================================================
 */

// Storage Keys
const STORAGE_KEYS = {
  STUDENTS: 'buk_students_database',
  SESSIONS: 'buk_active_sessions',
  ACTIVITIES: 'buk_system_activities',
  CREATOR_AUTH: 'buk_creator_authorized',
  CREATOR_DEVICE: 'buk_creator_device_authorized'
};

// Nigerian States to Geopolitical Region Mapping
const NIGERIAN_STATES_MAP = {
  'Kano': 'North-West', 'Kaduna': 'North-West', 'Katsina': 'North-West',
  'Jigawa': 'North-West', 'Sokoto': 'North-West', 'Kebbi': 'North-West', 'Zamfara': 'North-West',
  'Abuja (FCT)': 'North-Central', 'Benue': 'North-Central', 'Kogi': 'North-Central',
  'Kwara': 'North-Central', 'Nasarawa': 'North-Central', 'Niger': 'North-Central', 'Plateau': 'North-Central',
  'Adamawa': 'North-East', 'Bauchi': 'North-East', 'Borno': 'North-East',
  'Gombe': 'North-East', 'Taraba': 'North-East', 'Yobe': 'North-East',
  'Lagos': 'South-West', 'Ogun': 'South-West', 'Oyo': 'South-West',
  'Osun': 'South-West', 'Ondo': 'South-West', 'Ekiti': 'South-West',
  'Abia': 'South-East', 'Anambra': 'South-East', 'Ebonyi': 'South-East',
  'Enugu': 'South-East', 'Imo': 'South-East',
  'Akwa Ibom': 'South-South', 'Bayelsa': 'South-South', 'Cross River': 'South-South',
  'Delta': 'South-South', 'Edo': 'South-South', 'Rivers': 'South-South'
};

// Departments by Faculty
const FACULTY_DEPTS = {
  'Faculty of Computing (FCSIT)': ['Computer Science', 'Software Engineering', 'Information Technology', 'Cyber Security'],
  'Faculty of Engineering': ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Agricultural Engineering'],
  'Faculty of Clinical Sciences': ['Medicine & Surgery (MBBS)', 'Nursing Science', 'Medical Laboratory Science', 'Physiotherapy'],
  'Faculty of Science': ['Microbiology', 'Biochemistry', 'Physics with Electronics', 'Pure Chemistry'],
  'Faculty of Law': ['Public Law', 'Private & Commercial Law', 'Islamic Law'],
  'Faculty of Social Sciences': ['Economics', 'Mass Communication', 'Political Science', 'Sociology']
};

// Application State
let appState = {
  students: [],
  sessions: [],
  activities: [],
  activeStudent: null,
  pendingDuplicateStudent: null,
  isCreatorAuth: false,
  isCreatorDevice: false
};

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  populateStatesDropdown();
  updateDepartments();
  updateGeopoliticalRegion();
  refreshUI();
});

// Load persistent data from LocalStorage
function loadDatabase() {
  try {
    const rawStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    appState.students = rawStudents ? JSON.parse(rawStudents) : [];

    const rawSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    appState.sessions = rawSessions ? JSON.parse(rawSessions) : [];

    const rawActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    appState.activities = rawActivities ? JSON.parse(rawActivities) : [];

    // Stealth check: check if this device is authorized
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const devParam = urlParams.get('device') || urlParams.get('creator_device') || urlParams.get('creator_key');
      if (devParam === 'buk2026' || devParam === 'aniude2026') {
        localStorage.setItem(STORAGE_KEYS.CREATOR_DEVICE, 'true');
        sessionStorage.setItem(STORAGE_KEYS.CREATOR_AUTH, 'true');
      }
      const host = window.location.hostname || '';
      if (host.includes('ais-dev-') || host === 'localhost' || host === '127.0.0.1' || window.location.port === '3000') {
        localStorage.setItem(STORAGE_KEYS.CREATOR_DEVICE, 'true');
      }
    } catch (_) {}

    appState.isCreatorDevice = localStorage.getItem(STORAGE_KEYS.CREATOR_DEVICE) === 'true';
    appState.isCreatorAuth = sessionStorage.getItem(STORAGE_KEYS.CREATOR_AUTH) === 'true';
  } catch (e) {
    console.error('Storage initialization error:', e);
    appState.students = [];
    appState.sessions = [];
    appState.activities = [];
  }
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(appState.students));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(appState.sessions));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(appState.activities));
  } catch (e) {
    console.error('Error persisting database:', e);
  }
}

// ============================================================================
// 1. COMPATIBILITY ALGORITHM (Exact 100-Point Weighted Scoring Model)
// ============================================================================

function calculateStudentSimilarity(studentA, studentB) {
  const sharedTraits = [];
  const frictions = [];

  // 1. Sleeping Habit (Weight: 25)
  let sleepScore = 0;
  if (studentA.sleepingHabit === studentB.sleepingHabit) {
    sleepScore = 25;
    sharedTraits.push(`Matched sleep rhythm: ${studentA.sleepingHabit}`);
  } else if (
    (studentA.sleepingHabit === 'Early Sleeper (10 PM - 5 AM)' && studentB.sleepingHabit === 'Night Owl (1 AM - 8 AM)') ||
    (studentA.sleepingHabit === 'Night Owl (1 AM - 8 AM)' && studentB.sleepingHabit === 'Early Sleeper (10 PM - 5 AM)')
  ) {
    sleepScore = 5;
    frictions.push('Sleep clash: Early Sleeper vs Night Owl schedule');
  } else {
    sleepScore = 17;
  }

  // 2. Eating & Food Habits (Weight: 20)
  let eatingScore = 0;
  if (studentA.eatingHabit === studentB.eatingHabit) {
    eatingScore = 20;
    sharedTraits.push(`Meal routine: ${studentA.eatingHabit}`);
  } else if (
    (studentA.eatingHabit === 'Cooks daily in room' && studentB.eatingHabit === 'Shared cooking & grocery pooling') ||
    (studentA.eatingHabit === 'Shared cooking & grocery pooling' && studentB.eatingHabit === 'Cooks daily in room')
  ) {
    eatingScore = 16;
    sharedTraits.push('Compatible room cooking routines');
  } else {
    eatingScore = 12;
  }

  // 3. Reading & Study Habit (Weight: 20)
  let studyScore = 0;
  if (studentA.studyHabit === studentB.studyHabit) {
    studyScore = 20;
    sharedTraits.push(`Study environment: ${studentA.studyHabit}`);
  } else if (
    (studentA.studyHabit === 'Pin-drop silence in room' && studentB.studyHabit === 'Discussion & soft music friendly') ||
    (studentA.studyHabit === 'Discussion & soft music friendly' && studentB.studyHabit === 'Pin-drop silence in room')
  ) {
    studyScore = 5;
    frictions.push('Study clash: Pin-drop silence needed vs discussion/music friendly');
  } else {
    studyScore = 16;
  }

  // 4. Cleanliness Standard (Weight: 15)
  let cleanScore = 0;
  if (studentA.cleanlinessHabit === studentB.cleanlinessHabit) {
    cleanScore = 15;
    sharedTraits.push(`Cleanliness standard: ${studentA.cleanlinessHabit}`);
  } else if (
    (studentA.cleanlinessHabit === 'Strict daily sweeping & neat bed' && studentB.cleanlinessHabit === 'Relaxed & casual') ||
    (studentA.cleanlinessHabit === 'Relaxed & casual' && studentB.cleanlinessHabit === 'Strict daily sweeping & neat bed')
  ) {
    cleanScore = 4;
    frictions.push('Sanitation mismatch: Daily sweeping vs relaxed approach');
  } else {
    cleanScore = 11;
  }

  // 5. Night Light Preference (Weight: 10)
  let lightScore = 0;
  if (studentA.nightLightPreference === studentB.nightLightPreference) {
    lightScore = 10;
    sharedTraits.push(`Night lighting: ${studentA.nightLightPreference}`);
  } else if (
    (studentA.nightLightPreference === 'Total darkness only' && studentB.nightLightPreference === 'Can sleep with room lights on') ||
    (studentA.nightLightPreference === 'Can sleep with room lights on' && studentB.nightLightPreference === 'Total darkness only')
  ) {
    lightScore = 2;
    frictions.push('Night light conflict: Total darkness required vs lights on');
  } else {
    lightScore = 7;
  }

  // 6. Social & Visitors Policy (Weight: 10)
  let visitorScore = 0;
  if (studentA.visitorHabit === studentB.visitorHabit) {
    visitorScore = 10;
    sharedTraits.push(`Room privacy: ${studentA.visitorHabit}`);
  } else if (
    (studentA.visitorHabit === 'Private sanctuary (No visitors)' && studentB.visitorHabit === 'Social hub (Friends visit often)') ||
    (studentA.visitorHabit === 'Social hub (Friends visit often)' && studentB.visitorHabit === 'Private sanctuary (No visitors)')
  ) {
    visitorScore = 2;
    frictions.push('Privacy conflict: Private sanctuary vs frequent social visitors');
  } else {
    visitorScore = 7;
  }

  // Region & Academic Affinity Bonuses
  let locationBonus = 0;
  if (studentA.geopoliticalRegion === studentB.geopoliticalRegion) {
    locationBonus += 3;
    sharedTraits.push(`Both from ${studentA.geopoliticalRegion} region`);
  }
  if (studentA.stateOfOrigin === studentB.stateOfOrigin) {
    locationBonus += 2;
    sharedTraits.push(`Both from ${studentA.stateOfOrigin} State`);
  }
  if (studentA.faculty === studentB.faculty) {
    locationBonus += 2;
    sharedTraits.push(`Both in ${studentA.faculty}`);
  }

  const rawSum = sleepScore + eatingScore + studyScore + cleanScore + lightScore + visitorScore + locationBonus;
  const similarityScore = Math.min(100, Math.max(35, Math.round(rawSum)));

  return {
    matchedStudent: studentB,
    similarityScore,
    sharedTraits: sharedTraits.slice(0, 4),
    frictions: frictions.slice(0, 2)
  };
}

// Find all matches for a target student (Filter: same gender, distinct ID, ranked descending)
function findStudentMatches(targetStudent, pool) {
  return pool
    .filter(s => s.id !== targetStudent.id && s.gender === targetStudent.gender)
    .map(candidate => calculateStudentSimilarity(targetStudent, candidate))
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

// ============================================================================
// 2. DUPLICATE DETECTION ENGINE
// ============================================================================

function checkDuplicateStudent(profile) {
  const normId = profile.idNumber.trim().toUpperCase();
  const normName = profile.fullName.trim().toLowerCase();
  const normPhone = profile.phone.replace(/\D/g, '');
  const normEmail = profile.email.trim().toLowerCase();

  // Condition 1: Check by School Reg / ID Number
  const idMatch = appState.students.find(s => s.idNumber.trim().toUpperCase() === normId);
  if (idMatch) {
    return {
      isDuplicate: true,
      reason: 'REG_NUMBER',
      existingStudent: idMatch,
      message: `Student with Reg No '${normId}' has already registered in the system.`
    };
  }

  // Condition 2: 100% Identical Data Check (Mistaken double entry)
  const exactDataMatch = appState.students.find(s => {
    const sPhone = s.phone.replace(/\D/g, '');
    const isContactExact = (s.fullName.trim().toLowerCase() === normName) &&
      (sPhone === normPhone || s.email.trim().toLowerCase() === normEmail);

    const isHabitsExact =
      s.sleepingHabit === profile.sleepingHabit &&
      s.eatingHabit === profile.eatingHabit &&
      s.studyHabit === profile.studyHabit &&
      s.cleanlinessHabit === profile.cleanlinessHabit &&
      s.nightLightPreference === profile.nightLightPreference &&
      s.visitorHabit === profile.visitorHabit &&
      s.gender === profile.gender &&
      s.level === profile.level &&
      s.department === profile.department;

    return isContactExact && isHabitsExact;
  });

  if (exactDataMatch) {
    return {
      isDuplicate: true,
      reason: 'IDENTICAL_DATA',
      existingStudent: exactDataMatch,
      message: `Duplicate Detected: Student '${profile.fullName}' with 100% identical details has already registered.`
    };
  }

  return { isDuplicate: false };
}

// ============================================================================
// 3. STUDENT REGISTRATION & FORM HANDLERS
// ============================================================================

function handleStudentSubmit(e) {
  e.preventDefault();

  const profile = {
    id: 'buk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    idNumber: document.getElementById('idNumber').value.trim().toUpperCase(),
    fullName: document.getElementById('fullName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    gender: document.getElementById('gender').value,
    level: document.getElementById('level').value,
    faculty: document.getElementById('faculty').value,
    department: document.getElementById('department').value,
    residentialAddress: document.getElementById('residentialAddress').value.trim(),
    cityOrTown: document.getElementById('cityOrTown').value.trim(),
    stateOfOrigin: document.getElementById('stateOfOrigin').value,
    geopoliticalRegion: document.getElementById('geopoliticalRegion').value,
    stayLocationType: document.getElementById('stayLocationType').value,
    eatingHabit: document.getElementById('eatingHabit').value,
    dietaryNotes: document.getElementById('dietaryNotes').value.trim() || 'None',
    sleepingHabit: document.getElementById('sleepingHabit').value,
    nightLightPreference: document.getElementById('nightLightPreference').value,
    studyHabit: document.getElementById('studyHabit').value,
    cleanlinessHabit: document.getElementById('cleanlinessHabit').value,
    visitorHabit: document.getElementById('visitorHabit').value,
    createdAt: new Date().toISOString()
  };

  // Run Duplicate Detection
  const dupCheck = checkDuplicateStudent(profile);
  if (dupCheck.isDuplicate) {
    showDuplicateAlert(dupCheck.existingStudent, dupCheck.message);
    logActivity('DUPLICATE_ATTEMPT', `Prevented duplicate registration for ${profile.fullName} (${profile.idNumber})`);
    return;
  }

  // Save new student to database
  appState.students.push(profile);
  appState.activeStudent = profile;

  // Create active session
  createStudentSession(profile);

  // Log activity
  logActivity('STUDENT_REGISTERED', `Student ${profile.fullName} registered successfully`, profile.idNumber, profile.fullName);

  saveDatabase();
  refreshUI();

  // Render compatibility matches
  renderMatches(profile);

  showNotification(`Registration successful! ${appState.students.length} students registered.`);
  dismissDuplicateAlert();
}

function showDuplicateAlert(existingStudent, message) {
  appState.pendingDuplicateStudent = existingStudent;
  const alertEl = document.getElementById('duplicateAlert');
  document.getElementById('duplicateDesc').textContent = message;
  alertEl.classList.remove('hidden');
}

function dismissDuplicateAlert() {
  const alertEl = document.getElementById('duplicateAlert');
  alertEl.classList.add('hidden');
  appState.pendingDuplicateStudent = null;
}

function viewExistingDuplicateMatches() {
  if (!appState.pendingDuplicateStudent) return;
  appState.activeStudent = appState.pendingDuplicateStudent;
  createStudentSession(appState.pendingDuplicateStudent);
  renderMatches(appState.pendingDuplicateStudent);
  dismissDuplicateAlert();
  showNotification(`Viewing roommate matches for ${appState.activeStudent.fullName}`);
}

// ============================================================================
// 4. SESSION & ACTIVITY LOGGING
// ============================================================================

function createStudentSession(student) {
  // Remove existing active session for this ID if any
  appState.sessions = appState.sessions.filter(s => s.studentIdNumber !== student.idNumber);

  const session = {
    sessionId: 'sess_' + Date.now(),
    studentIdNumber: student.idNumber,
    studentName: student.fullName,
    department: student.department,
    faculty: student.faculty,
    level: student.level,
    gender: student.gender,
    phone: student.phone,
    email: student.email,
    loginTime: new Date().toISOString(),
    lastActiveTime: new Date().toISOString(),
    clientInfo: navigator.userAgent.slice(0, 45),
    isActive: true
  };

  appState.sessions.unshift(session);
  logActivity('STUDENT_LOGIN', `Student ${student.fullName} logged into portal`, student.idNumber, student.fullName);
  saveDatabase();
}

function logActivity(eventType, description, studentIdNumber = '', studentName = '') {
  const activity = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    eventType,
    description,
    studentIdNumber,
    studentName
  };
  appState.activities.unshift(activity);
  if (appState.activities.length > 200) appState.activities.pop();
  saveDatabase();
}

// ============================================================================
// 5. MATCH RENDERING
// ============================================================================

function renderMatches(targetStudent) {
  const matches = findStudentMatches(targetStudent, appState.students);
  const container = document.getElementById('matchesContainer');
  const emptyState = document.getElementById('matchesEmptyState');
  const activeBox = document.getElementById('activeStudentCard');
  const countBadge = document.getElementById('matchCountBadge');

  countBadge.textContent = `${matches.length} Candidates`;

  activeBox.classList.remove('hidden');
  document.getElementById('activeStudentName').textContent = targetStudent.fullName;
  document.getElementById('activeStudentMeta').textContent =
    `${targetStudent.idNumber} &bull; ${targetStudent.department} (${targetStudent.level}) &bull; ${targetStudent.gender}`;

  if (matches.length === 0) {
    emptyState.classList.remove('hidden');
    container.classList.add('hidden');
    emptyState.querySelector('h3').textContent = 'No Compatible Roommates Yet';
    emptyState.querySelector('p').textContent =
      `Currently no other ${targetStudent.gender} students have registered in the database. Share the link so coursemates can register!`;
    return;
  }

  emptyState.classList.add('hidden');
  container.classList.remove('hidden');

  container.innerHTML = matches.map((m, idx) => {
    const s = m.matchedStudent;
    return `
      <div class="match-card">
        <div class="match-header">
          <div>
            <div class="match-name">#${idx + 1} ${escapeHTML(s.fullName)}</div>
            <div class="match-dept">${escapeHTML(s.department)} (${s.level}) &bull; ${s.stateOfOrigin} State</div>
          </div>
          <div class="score-badge">${m.similarityScore}% Match</div>
        </div>

        <div class="traits-container">
          ${m.sharedTraits.map(t => `<div class="trait-item">&#10003; ${escapeHTML(t)}</div>`).join('')}
          ${m.frictions.map(f => `<div class="friction-item">&#9888; ${escapeHTML(f)}</div>`).join('')}
        </div>

        <div style="margin-top:0.6rem; font-size:0.7rem; color:var(--slate-500); display:flex; gap:1rem;">
          <span>&#128222; ${escapeHTML(s.phone)}</span>
          <span>&#9993; ${escapeHTML(s.email)}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// 6. DASHBOARD & CREATOR BACKEND LOGIC
// ============================================================================

function refreshUI() {
  const regCount = appState.students.length;

  // Header & Dashboard badges
  const regBadges = document.querySelectorAll('#regCountBadge, #dashboardRegCount');
  regBadges.forEach(b => { if (b) b.textContent = regCount; });

  // Stealth: show creator nav button ONLY on creator device
  const navCreatorBtn = document.getElementById('navCreatorBtn');
  if (navCreatorBtn) {
    navCreatorBtn.classList.toggle('hidden', !appState.isCreatorDevice);
  }

  renderDashboardStudents();
  renderCreatorBackend();
}

function renderDashboardStudents() {
  const grid = document.getElementById('dashboardStudentsGrid');
  if (!grid) return;

  const searchQuery = (document.getElementById('dashboardSearch')?.value || '').toLowerCase();
  const genderFilter = document.getElementById('filterGender')?.value || 'All';
  const levelFilter = document.getElementById('filterLevel')?.value || 'All';

  const filtered = appState.students.filter(s => {
    if (genderFilter !== 'All' && s.gender !== genderFilter) return false;
    if (levelFilter !== 'All' && s.level !== levelFilter) return false;
    if (searchQuery) {
      return (
        s.fullName.toLowerCase().includes(searchQuery) ||
        s.idNumber.toLowerCase().includes(searchQuery) ||
        s.department.toLowerCase().includes(searchQuery) ||
        s.faculty.toLowerCase().includes(searchQuery) ||
        s.stateOfOrigin.toLowerCase().includes(searchQuery)
      );
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="text-center text-muted" style="grid-column:1/-1; padding:2rem;">No students found matching current filters.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(s => `
    <div class="student-grid-card">
      <div class="flex-between">
        <h4>${escapeHTML(s.fullName)}</h4>
        <span class="badge">${s.gender}</span>
      </div>
      <div style="font-size:0.75rem; color:var(--slate-500); margin:0.35rem 0;">
        ${escapeHTML(s.idNumber)} &bull; ${s.level} &bull; ${escapeHTML(s.department)}
      </div>
      <div style="font-size:0.7rem; color:var(--slate-600); margin-bottom:0.6rem;">
        ${s.stateOfOrigin} State (${s.geopoliticalRegion})
      </div>
      <button type="button" class="btn btn-sm btn-outline btn-block" onclick="inspectStudentMatches('${s.id}')">
        Calculate Roommate Matches
      </button>
    </div>
  `).join('');
}

function inspectStudentMatches(studentId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;
  appState.activeStudent = student;
  switchTab('register');
  renderMatches(student);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCreatorBackend() {
  if (!appState.isCreatorAuth) return;

  const activeSessions = appState.sessions.filter(s => s.isActive);
  const males = appState.students.filter(s => s.gender === 'Male').length;
  const females = appState.students.filter(s => s.gender === 'Female').length;

  // Metrics
  const loggedInEl = document.getElementById('metricLoggedIn');
  if (loggedInEl) loggedInEl.textContent = activeSessions.length;

  const regEl = document.getElementById('metricRegistered');
  if (regEl) regEl.textContent = appState.students.length;

  const actEl = document.getElementById('metricActivities');
  if (actEl) actEl.textContent = appState.activities.length;

  const ratioEl = document.getElementById('metricGenderRatio');
  if (ratioEl) ratioEl.textContent = `${males} / ${females}`;

  // Subtab Badges
  const sessBadge = document.getElementById('sessionsCountBadge');
  if (sessBadge) sessBadge.textContent = activeSessions.length;

  const studBadge = document.getElementById('studentsCountBadge');
  if (studBadge) studBadge.textContent = appState.students.length;

  const actBadge = document.getElementById('activitiesCountBadge');
  if (actBadge) actBadge.textContent = appState.activities.length;

  // Sessions Table
  const sessTable = document.getElementById('sessionsTableBody');
  if (sessTable) {
    if (activeSessions.length === 0) {
      sessTable.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No student sessions currently active.</td></tr>';
    } else {
      sessTable.innerHTML = activeSessions.map(sess => `
        <tr>
          <td><strong>${escapeHTML(sess.studentName)}</strong></td>
          <td><code>${escapeHTML(sess.studentIdNumber)}</code></td>
          <td>${escapeHTML(sess.department)} (${sess.level})</td>
          <td>${new Date(sess.loginTime).toLocaleTimeString()}</td>
          <td style="max-width:140px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${escapeHTML(sess.clientInfo || 'Web Client')}</td>
          <td><span class="badge" style="background:#2563eb;">Active</span></td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="terminateSession('${sess.sessionId}')">Logout</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Students Table
  const studTable = document.getElementById('creatorStudentsTableBody');
  if (studTable) {
    if (appState.students.length === 0) {
      studTable.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No students registered yet.</td></tr>';
    } else {
      studTable.innerHTML = appState.students.map(s => `
        <tr>
          <td><code>${escapeHTML(s.idNumber)}</code></td>
          <td><strong>${escapeHTML(s.fullName)}</strong></td>
          <td>${s.gender}</td>
          <td>${s.level}</td>
          <td>${escapeHTML(s.department)}</td>
          <td>${s.stateOfOrigin}</td>
          <td>${s.sleepingHabit}</td>
          <td>${s.studyHabit}</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="inspectStudentMatches('${s.id}')">Matches</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Activities Timeline
  const actTimeline = document.getElementById('activitiesTimeline');
  if (actTimeline) {
    if (appState.activities.length === 0) {
      actTimeline.innerHTML = '<div class="text-center text-muted py-4">No activities logged yet.</div>';
    } else {
      actTimeline.innerHTML = appState.activities.slice(0, 50).map(act => `
        <div class="timeline-item">
          <div>
            <strong>[${act.eventType}]</strong> ${escapeHTML(act.description)}
            ${act.studentName ? `<span style="color:var(--slate-500);"> &bull; ${escapeHTML(act.studentName)}</span>` : ''}
          </div>
          <span style="color:var(--slate-400); font-size:0.65rem;">
            ${new Date(act.timestamp).toLocaleTimeString()}
          </span>
        </div>
      `).join('');
    }
  }
}

function terminateSession(sessionId) {
  const sess = appState.sessions.find(s => s.sessionId === sessionId);
  if (sess) {
    sess.isActive = false;
    logActivity('STUDENT_LOGOUT', `Creator terminated session for ${sess.studentName}`, sess.studentIdNumber, sess.studentName);
    saveDatabase();
    renderCreatorBackend();
    showNotification('Session terminated.');
  }
}

function clearActivityLogs() {
  if (confirm('Clear all recorded system activities?')) {
    appState.activities = [];
    saveDatabase();
    renderCreatorBackend();
    showNotification('Activity log cleared.');
  }
}

function resetDatabasePrompt() {
  const code = prompt("To reset the student allocation database, type 'RESET':");
  if (code === 'RESET') {
    appState.students = [];
    appState.sessions = [];
    appState.activeStudent = null;
    logActivity('DATABASE_RESET', 'Administrator reset student database to empty state.');
    saveDatabase();
    refreshUI();
    showNotification('Database reset. 0 students registered.');
  }
}

function exportStudentsToCSV() {
  if (appState.students.length === 0) {
    alert('No students to export.');
    return;
  }

  const headers = ['Reg Number', 'Full Name', 'Gender', 'Level', 'Faculty', 'Department', 'Phone', 'Email', 'State', 'Region', 'Sleep Habit', 'Study Habit', 'Eating Habit', 'Cleanliness'];
  const rows = appState.students.map(s => [
    `"${s.idNumber}"`,
    `"${s.fullName}"`,
    s.gender,
    s.level,
    `"${s.faculty}"`,
    `"${s.department}"`,
    `"${s.phone}"`,
    `"${s.email}"`,
    `"${s.stateOfOrigin}"`,
    `"${s.geopoliticalRegion}"`,
    `"${s.sleepingHabit}"`,
    `"${s.studyHabit}"`,
    `"${s.eatingHabit}"`,
    `"${s.cleanlinessHabit}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `buk_students_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// 7. CREATOR AUTHENTICATION
// ============================================================================

function openCreatorModal() {
  if (appState.isCreatorAuth) {
    switchTab('creator');
    return;
  }
  document.getElementById('creatorModal').classList.remove('hidden');
  document.getElementById('creatorKeyInput').value = '';
  document.getElementById('creatorKeyError').classList.add('hidden');
}

function closeCreatorModal() {
  document.getElementById('creatorModal').classList.add('hidden');
}

function handleCreatorUnlock(e) {
  e.preventDefault();
  const input = document.getElementById('creatorKeyInput').value.trim().toLowerCase();
  if (input === 'buk2026' || input === 'aniude2026' || input === 'admin2026') {
    appState.isCreatorAuth = true;
    appState.isCreatorDevice = true;
    localStorage.setItem(STORAGE_KEYS.CREATOR_DEVICE, 'true');
    sessionStorage.setItem(STORAGE_KEYS.CREATOR_AUTH, 'true');
    const navCreatorBtn = document.getElementById('navCreatorBtn');
    if (navCreatorBtn) navCreatorBtn.classList.remove('hidden');
    closeCreatorModal();
    switchTab('creator');
    renderCreatorBackend();
    showNotification('Creator session unlocked on this device.');
  } else {
    document.getElementById('creatorKeyError').classList.remove('hidden');
  }
}

function lockCreatorBackend() {
  appState.isCreatorAuth = false;
  sessionStorage.removeItem(STORAGE_KEYS.CREATOR_AUTH);
  switchTab('register');
  showNotification('Creator backend locked.');
}

// ============================================================================
// 8. UTILITIES & HELPERS
// ============================================================================

function switchTab(tabId) {
  // Prevent unauthorized devices from navigating to creator tab
  if (tabId === 'creator' && !appState.isCreatorDevice) {
    tabId = 'register';
  }
  const tabs = ['register', 'rooms', 'dashboard', 'creator'];
  tabs.forEach(t => {
    const pane = document.getElementById(t + 'Tab');
    const btn = document.getElementById('nav' + t.charAt(0).toUpperCase() + t.slice(1) + 'Btn');
    if (pane) pane.classList.toggle('hidden', t !== tabId);
    if (btn) btn.classList.toggle('active', t === tabId);
  });
  if (tabId === 'rooms') renderRoomsTab();
  if (tabId === 'dashboard') renderDashboardStudents();
  if (tabId === 'creator') renderCreatorBackend();
}

function switchCreatorSubtab(subpaneId) {
  ['sessions', 'students', 'activities'].forEach(sub => {
    const pane = document.getElementById('creator' + sub.charAt(0).toUpperCase() + sub.slice(1) + 'Pane');
    const btn = document.getElementById('subtab' + sub.charAt(0).toUpperCase() + sub.slice(1) + 'Btn');
    if (pane) pane.classList.toggle('hidden', sub !== subpaneId);
    if (btn) btn.classList.toggle('active', sub === subpaneId);
  });
}

function populateStatesDropdown() {
  const select = document.getElementById('stateOfOrigin');
  if (!select) return;
  const states = Object.keys(NIGERIAN_STATES_MAP).sort();
  select.innerHTML = states.map(s => `<option value="${s}" ${s === 'Kaduna' ? 'selected' : ''}>${s}</option>`).join('');
}

function updateGeopoliticalRegion() {
  const state = document.getElementById('stateOfOrigin')?.value;
  const regionInput = document.getElementById('geopoliticalRegion');
  if (regionInput && state) {
    regionInput.value = NIGERIAN_STATES_MAP[state] || 'North-West';
  }
}

function updateDepartments() {
  const faculty = document.getElementById('faculty')?.value;
  const deptSelect = document.getElementById('department');
  if (!deptSelect || !faculty) return;
  const depts = FACULTY_DEPTS[faculty] || ['General'];
  deptSelect.innerHTML = depts.map(d => `<option value="${d}">${d}</option>`).join('');
}

function loadSampleData(sampleType) {
  if (sampleType === 'A') {
    document.getElementById('idNumber').value = 'CST/22/COM/00918';
    document.getElementById('fullName').value = 'Mansur Aminu Danbatta';
    document.getElementById('phone').value = '0803 912 3410';
    document.getElementById('email').value = 'mansur.danbatta@buk.edu.ng';
    document.getElementById('gender').value = 'Male';
    document.getElementById('level').value = '400L';
    document.getElementById('faculty').value = 'Faculty of Computing (FCSIT)';
    updateDepartments();
    document.getElementById('department').value = 'Computer Science';
    document.getElementById('stateOfOrigin').value = 'Katsina';
    updateGeopoliticalRegion();
    document.getElementById('cityOrTown').value = 'Danbatta';
    document.getElementById('stayLocationType').value = 'Lives far from Kano (Requires Hostel)';
    document.getElementById('residentialAddress').value = 'Plot 4 Danbatta Way, GRA';
    document.getElementById('sleepingHabit').value = 'Early Sleeper (10 PM - 5 AM)';
    document.getElementById('nightLightPreference').value = 'Total darkness only';
    document.getElementById('eatingHabit').value = 'Cooks daily in room';
    document.getElementById('dietaryNotes').value = 'Prepares own meals';
    document.getElementById('studyHabit').value = 'Pin-drop silence in room';
    document.getElementById('cleanlinessHabit').value = 'Strict daily sweeping & neat bed';
    document.getElementById('visitorHabit').value = 'Private sanctuary (No visitors)';
  } else {
    document.getElementById('idNumber').value = 'ENG/22/CIV/00450';
    document.getElementById('fullName').value = 'Tunde Michael Adeyemi';
    document.getElementById('phone').value = '0814 883 9921';
    document.getElementById('email').value = 'tunde.adeyemi@buk.edu.ng';
    document.getElementById('gender').value = 'Male';
    document.getElementById('level').value = '400L';
    document.getElementById('faculty').value = 'Faculty of Engineering';
    updateDepartments();
    document.getElementById('department').value = 'Civil Engineering';
    document.getElementById('stateOfOrigin').value = 'Oyo';
    updateGeopoliticalRegion();
    document.getElementById('cityOrTown').value = 'Ibadan';
    document.getElementById('stayLocationType').value = 'Lives far from Kano (Requires Hostel)';
    document.getElementById('residentialAddress').value = 'No. 12 Ring Road';
    document.getElementById('sleepingHabit').value = 'Night Owl (1 AM - 8 AM)';
    document.getElementById('nightLightPreference').value = 'Dim lamp acceptable';
    document.getElementById('eatingHabit').value = 'Cafeteria & campus restaurants';
    document.getElementById('dietaryNotes').value = 'Campus cafeteria';
    document.getElementById('studyHabit').value = 'Discussion & soft music friendly';
    document.getElementById('cleanlinessHabit').value = 'Weekly scheduled cleaning';
    document.getElementById('visitorHabit').value = 'Social hub (Friends visit often)';
  }
}

// ============================================================================
// BUK HOSTEL ROOM MANAGEMENT (7 Hostels, 90 Rooms Each, Max 6 / Room)
// ============================================================================

const HOSTELS_CONFIG = [
  { id: 'idris-garba', name: 'Idris Garba Hostel', gender: 'Male', totalRooms: 90, maxPerRoom: 6 },
  { id: 'yaradua', name: "Yar'adua Hostel", gender: 'Male', totalRooms: 90, maxPerRoom: 6 },
  { id: 'saadu-zungur', name: "Sa'adu Zungur Hostel", gender: 'Male', totalRooms: 90, maxPerRoom: 6 },
  { id: 'dangote', name: 'Dangote Hostel', gender: 'Male', totalRooms: 90, maxPerRoom: 6 },
  { id: 'hasiya', name: 'Hasiya Hostel', gender: 'Female', totalRooms: 90, maxPerRoom: 6 },
  { id: 'ramat', name: 'Ramat Hostel', gender: 'Female', totalRooms: 90, maxPerRoom: 6 },
  { id: 'gambo-sawaba', name: 'Gambo Sawaba Hostel', gender: 'Female', totalRooms: 90, maxPerRoom: 6 }
];
const MAX_ROOM_CAPACITY = 6;
const ROOMS_PER_HOSTEL = 90;
let currentHostelId = 'idris-garba';

function selectHostel(hostelId) {
  currentHostelId = hostelId;
  renderRoomsTab();
}

function renderRoomsTab() {
  const bar = document.getElementById('hostelSelectionBar');
  const summary = document.getElementById('activeHostelSummary');
  const grid = document.getElementById('hostelRoomsGrid');
  if (!bar || !summary || !grid) return;

  const currentHostel = HOSTELS_CONFIG.find(h => h.id === currentHostelId) || HOSTELS_CONFIG[0];

  bar.innerHTML = HOSTELS_CONFIG.map(h => {
    const isSel = h.id === currentHostelId;
    const occCount = appState.students.filter(s => s.hostelId === h.id || s.hostelName === h.name).length;
    const isMale = h.gender === 'Male';
    return `
      <button type="button" class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-outline'}" onclick="selectHostel('${h.id}')" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem;">
        <span>${isMale ? '&#128104;' : '&#128105;'}</span>
        <strong>${escapeHTML(h.name)}</strong>
        <span class="badge" style="background:${isSel ? '#ffffff' : 'var(--slate-200)'}; color:${isSel ? 'var(--primary-800)' : 'var(--slate-700)'}; font-size:0.65rem;">
          ${occCount} / ${h.totalRooms * MAX_ROOM_CAPACITY}
        </span>
      </button>
    `;
  }).join('');

  const hostelStudents = appState.students.filter(s => s.hostelId === currentHostel.id || s.hostelName === currentHostel.name);
  const totalOccupants = hostelStudents.length;
  const totalCapacity = currentHostel.totalRooms * MAX_ROOM_CAPACITY;

  summary.innerHTML = `
    <div>
      <strong style="color:var(--primary-800); font-size:0.85rem;">${escapeHTML(currentHostel.name)} (${currentHostel.gender} Hostel)</strong>
      <div style="color:var(--slate-600); margin-top:0.2rem;">
        90 Rooms &bull; Exactly 6 Students Maximum Per Room (Strictly Enforced)
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-weight:700; color:var(--primary-700);">Occupancy: ${totalOccupants} / ${totalCapacity} Students</div>
      <div style="font-size:0.7rem; color:var(--slate-500);">${totalCapacity - totalOccupants} Bed Spaces Remaining</div>
    </div>
  `;

  let roomsHtml = '';
  for (let r = 1; r <= ROOMS_PER_HOSTEL; r++) {
    const occupants = hostelStudents.filter(s => Number(s.roomNumber) === r);
    const count = occupants.length;
    const isFull = count >= MAX_ROOM_CAPACITY;
    const isVacant = count === 0;

    let statusBadge = isFull
      ? '<span style="background:#fee2e2; color:#b91c1c; font-size:0.65rem; font-weight:700; padding:0.15rem 0.4rem; border-radius:4px;">&#128274; FULL (6/6)</span>'
      : isVacant
      ? '<span style="background:#f1f5f9; color:#64748b; font-size:0.65rem; font-weight:600; padding:0.15rem 0.4rem; border-radius:4px;">VACANT (0/6)</span>'
      : `<span style="background:#dbeafe; color:#1e40af; font-size:0.65rem; font-weight:700; padding:0.15rem 0.4rem; border-radius:4px;">${count}/6 BEDS</span>`;

    let bedIcons = '';
    for (let b = 1; b <= MAX_ROOM_CAPACITY; b++) {
      const occ = occupants.find(o => Number(o.bedSpace) === b) || occupants[b - 1];
      bedIcons += `
        <span style="display:inline-block; width:14px; height:14px; border-radius:3px; background:${occ ? 'var(--primary-700)' : '#e2e8f0'};" title="${occ ? `Bed #${b}: ${escapeHTML(occ.fullName)} (${occ.idNumber})` : `Bed #${b}: Empty`}"></span>
      `;
    }

    roomsHtml += `
      <div style="border:1px solid ${isFull ? '#fca5a5' : '#cbd5e1'}; border-radius:var(--radius-md); padding:0.65rem; background:${isFull ? '#fff5f5' : '#ffffff'}; font-size:0.7rem; display:flex; flex-direction:column; justify-content:space-between; gap:0.4rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:var(--slate-900);">Room ${r}</strong>
          ${statusBadge}
        </div>

        <div style="display:flex; gap:3px; margin:0.25rem 0;">
          ${bedIcons}
        </div>

        <div style="font-size:0.65rem; color:var(--slate-600); min-height:28px;">
          ${occupants.length === 0
            ? '<span style="color:var(--slate-400); font-style:italic;">No students assigned</span>'
            : occupants.map(o => `<div>&bull; ${escapeHTML(o.fullName.split(' ')[0])} (${escapeHTML(o.idNumber.split('/').pop() || '')})</div>`).join('')
          }
        </div>

        <div style="border-top:1px dashed #e2e8f0; padding-top:0.4rem; margin-top:0.2rem;">
          ${isFull
            ? '<button type="button" disabled style="width:100%; font-size:0.65rem; padding:0.25rem; background:#f1f5f9; color:#94a3b8; border:1px solid #cbd5e1; border-radius:4px; cursor:not-allowed;">&#128274; Room Full (Max 6)</button>'
            : `<button type="button" onclick="promptAllocateRoom('${currentHostel.id}', ${r})" style="width:100%; font-size:0.65rem; padding:0.25rem; background:var(--primary-700); color:#ffffff; border:none; border-radius:4px; cursor:pointer;">+ Assign Student</button>`
          }
        </div>
      </div>
    `;
  }
  grid.innerHTML = roomsHtml;
}

function promptAllocateRoom(hostelId, roomNumber) {
  const hostel = HOSTELS_CONFIG.find(h => h.id === hostelId);
  if (!hostel) return;

  const currentOccupants = appState.students.filter(
    s => (s.hostelId === hostel.id || s.hostelName === hostel.name) && Number(s.roomNumber) === Number(roomNumber)
  );
  if (currentOccupants.length >= MAX_ROOM_CAPACITY) {
    alert(`Room ${roomNumber} in ${hostel.name} is already FULL at the maximum capacity of 6 students.`);
    return;
  }

  const unassigned = appState.students.filter(
    s => s.gender === hostel.gender && (!s.hostelName || !s.roomNumber)
  );

  if (unassigned.length === 0) {
    alert(`No unassigned ${hostel.gender} students found in the database. Please register a ${hostel.gender} student first.`);
    return;
  }

  const promptText = `Select a ${hostel.gender} student to assign to Room ${roomNumber} (${currentOccupants.length}/6 occupied):\n\n` +
    unassigned.map((s, idx) => `${idx + 1}. ${s.fullName} (${s.idNumber})`).join('\n') +
    `\n\nEnter student number (1 to ${unassigned.length}):`;

  const choice = prompt(promptText);
  if (!choice) return;
  const chosenIndex = parseInt(choice, 10) - 1;
  if (isNaN(chosenIndex) || chosenIndex < 0 || chosenIndex >= unassigned.length) {
    alert('Invalid student selection.');
    return;
  }

  const student = unassigned[chosenIndex];
  allocateStudentToRoom(hostel.id, roomNumber, student.idNumber);
}

function allocateStudentToRoom(hostelId, roomNumber, studentIdNumber) {
  const hostel = HOSTELS_CONFIG.find(h => h.id === hostelId);
  const student = appState.students.find(s => s.idNumber === studentIdNumber);
  if (!hostel || !student) return;

  if (student.gender !== hostel.gender) {
    alert(`Gender mismatch: ${student.fullName} is ${student.gender}, but ${hostel.name} is a ${hostel.gender} hostel.`);
    return;
  }

  const currentOccupants = appState.students.filter(
    s => (s.hostelId === hostel.id || s.hostelName === hostel.name) && Number(s.roomNumber) === Number(roomNumber)
  );
  if (currentOccupants.length >= MAX_ROOM_CAPACITY) {
    alert(`Cannot allocate: Room ${roomNumber} in ${hostel.name} has already reached the maximum allowed limit of 6 students.`);
    return;
  }

  const usedBeds = new Set(currentOccupants.map(o => Number(o.bedSpace)));
  let assignedBed = 1;
  for (let b = 1; b <= MAX_ROOM_CAPACITY; b++) {
    if (!usedBeds.has(b)) {
      assignedBed = b;
      break;
    }
  }

  student.hostelId = hostel.id;
  student.hostelName = hostel.name;
  student.roomNumber = roomNumber;
  student.bedSpace = assignedBed;
  student.allocatedAt = new Date().toISOString();

  logActivity('ROOM_ALLOCATED', `Assigned ${student.fullName} to ${hostel.name} Room ${roomNumber} (Bed #${assignedBed})`, student.idNumber, student.fullName);
  saveDatabase();
  refreshUI();
  renderRoomsTab();
  showNotification(`Assigned ${student.fullName} to ${hostel.name} Room ${roomNumber} (Bed #${assignedBed})`);
}

function autoAllocateAllRooms() {
  const unassigned = appState.students.filter(s => !s.hostelName || !s.roomNumber);
  if (unassigned.length === 0) {
    alert('All registered students are already allocated to hostel rooms.');
    return;
  }

  let allocatedCount = 0;
  for (const student of unassigned) {
    const eligibleHostels = HOSTELS_CONFIG.filter(h => h.gender === student.gender);
    let assigned = false;

    for (const hostel of eligibleHostels) {
      if (assigned) break;
      for (let r = 1; r <= ROOMS_PER_HOSTEL; r++) {
        const occ = appState.students.filter(
          s => (s.hostelId === hostel.id || s.hostelName === hostel.name) && Number(s.roomNumber) === r
        );
        if (occ.length < MAX_ROOM_CAPACITY) {
          allocateStudentToRoom(hostel.id, r, student.idNumber);
          allocatedCount++;
          assigned = true;
          break;
        }
      }
    }
  }

  showNotification(`Auto-allocated ${allocatedCount} students to hostel rooms.`);
}

function showNotification(msg) {
  const banner = document.getElementById('notificationBanner');
  const text = document.getElementById('notificationMessage');
  if (banner && text) {
    text.textContent = msg;
    banner.classList.remove('hidden');
    setTimeout(() => { banner.classList.add('hidden'); }, 5000);
  }
}

function closeNotification() {
  document.getElementById('notificationBanner')?.classList.add('hidden');
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
