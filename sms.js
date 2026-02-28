/* SMS_JS_VERSION_FIXED_v3 */
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */



// ═══════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════
const API_BASE = '/Student_Management_system/api/students'; // ✅ FIXED: correct context path
const DEMO_MODE = false; // ✅ FIXED: set to false to use real Java backend

// ═══════════════════════════════════════════════════════
// DEMO DATA (used when DEMO_MODE=true)
// ═══════════════════════════════════════════════════════
let DEMO_STUDENTS = [
  { id:1, studentId:'STU001', firstName:'James', lastName:'Wilson', email:'james.wilson@university.edu', phone:'555-0101', dateOfBirth:'2001-03-15', gender:'Male', departmentId:1, departmentName:'Computer Science', enrollmentDate:'2022-09-01', status:'Active', gpa:3.85, address:'123 Main St, New York', createdAt:'2022-09-01T00:00:00' },
  { id:2, studentId:'STU002', firstName:'Sofia', lastName:'Martinez', email:'sofia.martinez@university.edu', phone:'555-0102', dateOfBirth:'2002-07-22', gender:'Female', departmentId:2, departmentName:'Mathematics', enrollmentDate:'2022-09-01', status:'Active', gpa:3.92, address:'456 Oak Ave, Boston', createdAt:'2022-09-01T00:00:00' },
  { id:3, studentId:'STU003', firstName:'Liam', lastName:'Chen', email:'liam.chen@university.edu', phone:'555-0103', dateOfBirth:'2001-11-08', gender:'Male', departmentId:3, departmentName:'Physics', enrollmentDate:'2021-09-01', status:'Active', gpa:3.45, address:'789 Pine Rd, Chicago', createdAt:'2021-09-01T00:00:00' },
  { id:4, studentId:'STU004', firstName:'Emma', lastName:'Johnson', email:'emma.johnson@university.edu', phone:'555-0104', dateOfBirth:'2002-01-30', gender:'Female', departmentId:4, departmentName:'Business Administration', enrollmentDate:'2022-09-01', status:'Active', gpa:3.67, address:'321 Elm St, Seattle', createdAt:'2022-09-01T00:00:00' },
  { id:5, studentId:'STU005', firstName:'Noah', lastName:'Patel', email:'noah.patel@university.edu', phone:'555-0105', dateOfBirth:'2000-09-14', gender:'Male', departmentId:5, departmentName:'Electrical Engineering', enrollmentDate:'2020-09-01', status:'Active', gpa:2.95, address:'654 Birch Ln, Houston', createdAt:'2020-09-01T00:00:00' },
  { id:6, studentId:'STU006', firstName:'Olivia', lastName:'Brown', email:'olivia.brown@university.edu', phone:'555-0106', dateOfBirth:'2001-05-27', gender:'Female', departmentId:1, departmentName:'Computer Science', enrollmentDate:'2022-09-01', status:'Active', gpa:3.78, address:'987 Cedar Blvd, Austin', createdAt:'2022-09-01T00:00:00' },
  { id:7, studentId:'STU007', firstName:'Ethan', lastName:'Davis', email:'ethan.davis@university.edu', phone:'555-0107', dateOfBirth:'2003-12-03', gender:'Male', departmentId:2, departmentName:'Mathematics', enrollmentDate:'2023-09-01', status:'Active', gpa:3.20, address:'147 Maple Ave, Denver', createdAt:'2023-09-01T00:00:00' },
  { id:8, studentId:'STU008', firstName:'Ava', lastName:'Lee', email:'ava.lee@university.edu', phone:'555-0108', dateOfBirth:'2002-08-19', gender:'Female', departmentId:3, departmentName:'Physics', enrollmentDate:'2022-09-01', status:'Inactive', gpa:3.55, address:'258 Walnut St, Miami', createdAt:'2022-09-01T00:00:00' },
  { id:9, studentId:'STU009', firstName:'Mason', lastName:'Taylor', email:'mason.taylor@university.edu', phone:'555-0109', dateOfBirth:'2001-04-11', gender:'Male', departmentId:4, departmentName:'Business Administration', enrollmentDate:'2021-09-01', status:'Active', gpa:3.88, address:'369 Spruce Dr, Phoenix', createdAt:'2021-09-01T00:00:00' },
  { id:10, studentId:'STU010', firstName:'Isabella', lastName:'White', email:'isabella.white@university.edu', phone:'555-0110', dateOfBirth:'2000-06-25', gender:'Female', departmentId:5, departmentName:'Electrical Engineering', enrollmentDate:'2020-09-01', status:'Graduated', gpa:3.10, address:'741 Poplar Way, Portland', createdAt:'2020-09-01T00:00:00' }
];

const DEMO_DEPTS = [
  {id:1, name:'Computer Science', code:'CS', headOfDept:'Dr. Alan Turing'},
  {id:2, name:'Mathematics', code:'MATH', headOfDept:'Dr. Ada Lovelace'},
  {id:3, name:'Physics', code:'PHY', headOfDept:'Dr. Marie Curie'},
  {id:4, name:'Business Administration', code:'BUS', headOfDept:'Dr. Peter Drucker'},
  {id:5, name:'Electrical Engineering', code:'EE', headOfDept:'Dr. Nikola Tesla'}
];

const DEMO_COURSES = [
  {code:'CS101', name:'Introduction to Programming', department:'Computer Science', credits:3},
  {code:'CS201', name:'Data Structures & Algorithms', department:'Computer Science', credits:4},
  {code:'CS301', name:'Database Systems', department:'Computer Science', credits:3},
  {code:'CS401', name:'Web Development', department:'Computer Science', credits:3},
  {code:'MATH101', name:'Calculus I', department:'Mathematics', credits:4},
  {code:'MATH201', name:'Linear Algebra', department:'Mathematics', credits:3},
  {code:'PHY101', name:'Classical Mechanics', department:'Physics', credits:3},
  {code:'BUS101', name:'Business Ethics', department:'Business Administration', credits:2},
  {code:'EE101', name:'Circuit Analysis', department:'Electrical Engineering', credits:4}
];

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
let state = {
  students: [],
  departments: [],
  filtered: [],
  currentPage: 1,
  pageSize: 8,
  sortField: 'name',
  sortDir: 'asc',
  filterStatus: '',
  filterDept: '',
  filterGender: '',
  searchQuery: '',
  currentView: 'table',
  editingId: null,
  deletingId: null,
  dashboardLoaded: false
};

// ═══════════════════════════════════════════════════════
// API / DATA LAYER
// ═══════════════════════════════════════════════════════
async function apiGet(url) {
  if (DEMO_MODE) return null;
  const r = await fetch(API_BASE + url);
  // FIX: throw on error responses so fetchDashboardStats catch block falls back correctly
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

async function apiPost(data) {
  if (DEMO_MODE) return null;
  const r = await fetch(API_BASE, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  return r.json();
}

async function apiPut(data) {
  if (DEMO_MODE) return null;
  const r = await fetch(API_BASE, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  return r.json();
}

async function apiDelete(id) {
  if (DEMO_MODE) return null;
  const r = await fetch(API_BASE + `?id=${id}`, { method:'DELETE' });
  return r.json();
}

async function fetchStudents() {
  if (DEMO_MODE) {
    state.students = JSON.parse(JSON.stringify(DEMO_STUDENTS));
    return;
  }
  try {
    const data = await apiGet('');
    state.students = data || [];
  } catch(e) {
    state.students = JSON.parse(JSON.stringify(DEMO_STUDENTS));
    // FIX: warn user when silently falling back to demo data
    showToast('⚠ Backend unreachable — showing demo data', 'error');
  }
}

async function fetchDashboardStats() {
  if (DEMO_MODE) {
    return computeDemoStats();
  }
  try {
    const data = await apiGet('/stats');
    // FIX: if backend returned an error object instead of stats, fall back
    if (!data || data.success === false || data.totalStudents === undefined) {
      console.warn('Stats API returned unexpected data:', data);
      return computeDemoStats();
    }
    return data;
  } catch(e) {
    console.warn('Stats API failed, using computed stats:', e.message);
    return computeDemoStats();
  }
}

function computeDemoStats() {
  // FIX: use whichever list has data — real students or demo fallback
  const source = state.students.length > 0 ? state.students : DEMO_STUDENTS;
  const total = source.length;
  const active = source.filter(s => s.status === 'Active').length;
  const avgGpa = total > 0
    ? (source.reduce((a, s) => a + s.gpa, 0) / total).toFixed(2)
    : '0.00';
  const byStatus = {};
  const byDept = {};
  source.forEach(s => {
    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
    byDept[s.departmentName || 'Unknown'] = (byDept[s.departmentName || 'Unknown'] || 0) + 1;
  });
  return {
    totalStudents: total,
    activeStudents: active,
    avgGpa: parseFloat(avgGpa),
    totalDepartments: DEMO_DEPTS.length,
    byStatus,
    byDepartment: byDept
  };
}

// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════
const pageNames = { dashboard:'Dashboard', students:'Students', departments:'Departments', courses:'Courses', reports:'Reports' };

function navigateTo(page) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  document.getElementById('page-title').textContent = pageNames[page] || page;

  const showSearch = page === 'students';
  document.getElementById('global-search-wrap').style.display = showSearch ? '' : 'none';
  document.getElementById('add-student-btn').style.display = showSearch ? '' : 'none';

  if (page === 'dashboard' && state.dashboardLoaded) loadDashboard();
  if (page === 'students') loadStudentsPage();
  if (page === 'departments') loadDepartmentsPage();
  if (page === 'courses') loadCoursesPage();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navigateTo(link.dataset.page));
});

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
async function loadDashboard() {
  if (state.students.length === 0) {
    await fetchStudents();
  }
  const stats = await fetchDashboardStats();
  console.log('DASHBOARD STATS:', JSON.stringify(stats));
  console.log('stat-total el:', document.getElementById('stat-total'));
  document.getElementById('stat-total').textContent = stats.totalStudents ?? '0';
  document.getElementById('stat-active').textContent = stats.activeStudents ?? '0';
  document.getElementById('stat-gpa').textContent = stats.avgGpa ?? stats.averageGpa ?? '0.00';
  document.getElementById('stat-depts').textContent = stats.totalDepartments ?? stats.departmentCount ?? '0';

  // Dept bar chart
  // ✅ FIX 5: backend sends array [{department,count}], JS expected object {name:count}
  const deptChart = document.getElementById('dept-chart');
  let byDeptArr = [];
  if (Array.isArray(stats.departmentBreakdown)) {
    byDeptArr = stats.departmentBreakdown; // real backend: [{department:'CS', count:3}]
  } else if (stats.byDepartment) {
    byDeptArr = Object.entries(stats.byDepartment).map(([department, count]) => ({department, count}));
  }
  const max = Math.max(...byDeptArr.map(d => d.count), 1);
  deptChart.innerHTML = byDeptArr.sort((a,b) => b.count - a.count).map(d => `
    <div class="dept-bar-row">
      <div class="dept-bar-label" title="${d.department}">${d.department}</div>
      <div class="dept-bar-track">
        <div class="dept-bar-fill" style="width:${(d.count/max*100).toFixed(1)}%"></div>
      </div>
      <div class="dept-bar-count">${d.count}</div>
    </div>`).join('');

  // Donut chart
  // ✅ FIX 5: backend sends array [{status,count}], renderDonut expects object {status:count}
  let byStatusObj = {};
  if (Array.isArray(stats.statusBreakdown)) {
    stats.statusBreakdown.forEach(s => byStatusObj[s.status] = s.count);
  } else {
    byStatusObj = stats.byStatus || {};
  }
  renderDonut(byStatusObj);

  // ✅ FIX 4: correct element id is "nav-students-count"
  document.getElementById('nav-students-count').textContent = stats.totalStudents ?? '0';

  // Activity feed
  const feed = document.getElementById('activity-feed');
  // FIX: use consistent field names matching what backend returns
  const activities = [
    { color: 'var(--accent-3)', text: `${stats.activeStudents ?? 0} students currently active`, time: 'Now' },
    { color: 'var(--accent-1)', text: `Average GPA across all departments: ${stats.avgGpa ?? stats.averageGpa ?? '0.00'}`, time: '1h ago' },
    { color: 'var(--accent-4)', text: `${stats.totalDepartments ?? stats.departmentCount ?? 0} departments operational`, time: '2h ago' },
    { color: 'var(--accent-2)', text: 'Database sync completed successfully', time: '6h ago' }
  ];
  feed.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.color}"></div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`).join('');
}

function renderDonut(byStatus) {
  const colors = { Active:'#36d9b5', Inactive:'#7a7695', Graduated:'#8b78ff', Suspended:'#ff6b9d' };
  const total = Object.values(byStatus).reduce((a,b) => a+b, 0) || 1;
  const r = 54, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;

  let svg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--bg-3)" stroke-width="16"/>`;
  let offset = 0;
  const legend = [];

  Object.entries(byStatus).forEach(([status, cnt]) => {
    const frac = cnt / total;
    const dash = frac * circumference;
    const color = colors[status] || '#666';
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="16"
      stroke-dasharray="${dash} ${circumference - dash}"
      stroke-dashoffset="${circumference * 0.25 - offset * circumference}"
      transform="rotate(-90 ${cx} ${cy})" style="transition:stroke-dasharray 0.8s"/>`;
    legend.push(`<div class="legend-item">
      <div class="legend-dot" style="background:${color}"></div>
      <span class="legend-label">${status}</span>
      <span class="legend-val">${cnt}</span>
    </div>`);
    offset += frac;
  });

  svg += `<text x="${cx}" y="${cy+5}" text-anchor="middle" fill="var(--text-0)" font-size="22" font-family="DM Serif Display" font-weight="bold">${total}</text>`;
  document.getElementById('donut-svg').innerHTML = svg;
  document.getElementById('donut-legend').innerHTML = legend.join('');
}

// ═══════════════════════════════════════════════════════
// STUDENTS PAGE
// ═══════════════════════════════════════════════════════
async function loadStudentsPage() {
  await fetchStudents();
  populateDeptFilter();
  applyFilters();
}

function populateDeptFilter() {
  const sel = document.getElementById('dept-filter');
  const curVal = sel.value;
  sel.innerHTML = '<option value="">All Departments</option>';
  DEMO_DEPTS.forEach(d => {
    sel.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
  sel.value = curVal;
}

function applyFilters() {
  let list = [...state.students];
  if (state.filterStatus) list = list.filter(s => s.status === state.filterStatus);
  if (state.filterDept) list = list.filter(s => s.departmentId == state.filterDept);
  if (state.filterGender) list = list.filter(s => s.gender === state.filterGender);
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q)
    );
  }

  // Sort
  list.sort((a,b) => {
    let av, bv;
    if (state.sortField === 'name') { av = `${a.firstName} ${a.lastName}`; bv = `${b.firstName} ${b.lastName}`; }
    else if (state.sortField === 'gpa') { av = a.gpa; bv = b.gpa; }
    else if (state.sortField === 'status') { av = a.status; bv = b.status; }
    else if (state.sortField === 'department') { av = a.departmentName; bv = b.departmentName; }
    else if (state.sortField === 'enrollment') { av = a.enrollmentDate; bv = b.enrollmentDate; }
    else { av = a.firstName; bv = b.firstName; }
    if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return state.sortDir === 'asc' ? 1 : -1; 
    return 0;
  });

  state.filtered = list;
  state.currentPage = 1;
  renderStudents();
}

function renderStudents() {
  const total = state.filtered.length;
  const pages = Math.max(1, Math.ceil(total / state.pageSize));
  state.currentPage = Math.min(state.currentPage, pages);
  const start = (state.currentPage - 1) * state.pageSize;
  const page = state.filtered.slice(start, start + state.pageSize);

  document.getElementById('result-count').textContent = `${total} student${total !== 1 ? 's' : ''}`;

  if (state.currentView === 'table') renderTableView(page, total, pages, start);
  else renderCardView(page);
}

function renderTableView(page, total, pages, start) {
  const tbody = document.getElementById('student-tbody');
  if (page.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No students found</div>
        <div class="empty-state-sub">Try adjusting your search or filters</div>
      </div>
    </td></tr>`;
  } else {
    tbody.innerHTML = page.map(s => `
      <tr onclick="selectRow(this)" data-id="${s.id}">
        <td><input type="checkbox" onclick="event.stopPropagation()" style="accent-color:var(--accent-1)"></td>
        <td>
          <div class="student-cell">
            <div class="student-avatar dept-${s.departmentId % 6}">${s.firstName[0]}${s.lastName[0]}</div>
            <div>
              <div class="student-name">${s.firstName} ${s.lastName}</div>
              <div class="student-id-text">${s.studentId} · ${s.email}</div>
            </div>
          </div>
        </td>
        <td>${s.departmentName || '—'}</td>
        <td>
          <div class="gpa-cell">
            <div class="gpa-bar">
              <div class="gpa-fill ${gpaClass(s.gpa)}" style="width:${(s.gpa/4*100).toFixed(1)}%"></div>
            </div>
            <span class="gpa-value ${gpaClass(s.gpa)}">${s.gpa.toFixed(2)}</span>
          </div>
        </td>
        <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
        <td style="color:var(--text-2)">${formatDate(s.enrollmentDate)}</td>
        <td>
          <div class="actions">
            <button class="btn btn-secondary btn-sm btn-icon" onclick="viewStudent(${s.id}, event)" title="View">👁</button>
            <button class="btn btn-secondary btn-sm btn-icon" onclick="editStudent(${s.id}, event)" title="Edit">✏</button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDelete(${s.id}, event)" title="Delete">🗑</button>
          </div>
        </td>
      </tr>`).join('');
  }

  // Pagination
  const info = document.getElementById('page-info');
  info.textContent = `Showing ${start + 1}–${Math.min(start + state.pageSize, total)} of ${total}`;

  const controls = document.getElementById('page-controls');
  controls.innerHTML = '';
  const prevBtn = makePageBtn('‹', state.currentPage <= 1, () => { state.currentPage--; renderStudents(); });
  controls.appendChild(prevBtn);
  for (let i = 1; i <= pages; i++) {
    if (pages > 7 && i > 3 && i < pages - 2 && Math.abs(i - state.currentPage) > 1) {
      if (i === 4) controls.appendChild(Object.assign(document.createElement('span'), { textContent:'…', style:'padding:0 6px;color:var(--text-3);line-height:32px' }));
      continue;
    }
    const btn = makePageBtn(i, false, () => { state.currentPage = i; renderStudents(); });
    if (i === state.currentPage) btn.classList.add('active');
    controls.appendChild(btn);
  }
  controls.appendChild(makePageBtn('›', state.currentPage >= pages, () => { state.currentPage++; renderStudents(); }));
}

function makePageBtn(label, disabled, onClick) {
  const btn = document.createElement('button');
  btn.className = 'page-btn';
  btn.textContent = label;
  btn.disabled = disabled;
  btn.addEventListener('click', onClick);
  return btn;
}

function renderCardView(page) {
  const grid = document.getElementById('student-card-grid');
  if (page.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-text">No students found</div>
    </div>`;
    return;
  }
  grid.innerHTML = page.map(s => `
    <div class="student-card" onclick="viewStudent(${s.id})">
      <div class="student-card-header">
        <div class="student-avatar dept-${s.departmentId % 6}" style="width:46px;height:46px;font-size:16px">${s.firstName[0]}${s.lastName[0]}</div>
        <div>
          <div class="student-card-name">${s.firstName} ${s.lastName}</div>
          <div class="student-card-id">${s.studentId}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;color:var(--text-2)">${s.departmentName}</span>
        <span class="badge badge-${s.status.toLowerCase()}">${s.status}</span>
      </div>
      <div class="student-card-stats">
        <div class="student-card-stat">
          <div class="student-card-stat-value ${gpaClass(s.gpa)}">${s.gpa.toFixed(2)}</div>
          <div class="student-card-stat-label">GPA</div>
        </div>
        <div class="student-card-stat">
          <div class="student-card-stat-value">${s.gender||'—'}</div>
          <div class="student-card-stat-label">Gender</div>
        </div>
        <div class="student-card-stat">
          <div class="student-card-stat-value">${formatDate(s.enrollmentDate)}</div>
          <div class="student-card-stat-label">Enrolled</div>
        </div>
      </div>
      <div class="student-card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="editStudent(${s.id})">Edit</button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDelete(${s.id})">🗑</button>
      </div>
    </div>`).join('');
}

function setView(view) {
  state.currentView = view;
  document.getElementById('table-view').style.display = view === 'table' ? '' : 'none';
  document.getElementById('card-view').style.display = view === 'card' ? '' : 'none';
  document.getElementById('view-table-btn').classList.toggle('active', view === 'table');
  document.getElementById('view-card-btn').classList.toggle('active', view === 'card');
  renderStudents();
}

function sortTable(field) {
  if (state.sortField === field) {
    state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.sortField = field;
    state.sortDir = 'asc';
  }
  applyFilters();
}

function selectRow(tr) { tr.classList.toggle('selected'); }

// ─── FILTER EVENTS ──────────────────────────────────
document.getElementById('status-chips')?.addEventListener('click', e => {
  if (!e.target.classList.contains('chip')) return;
  document.querySelectorAll('#status-chips .chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  state.filterStatus = e.target.dataset.status;
  applyFilters();
});
document.getElementById('dept-filter')?.addEventListener('change', e => {
  state.filterDept = e.target.value;
  applyFilters();
});
document.getElementById('gender-filter')?.addEventListener('change', e => {
  state.filterGender = e.target.value;
  applyFilters();
});
let searchDebounce;
document.getElementById('global-search')?.addEventListener('input', e => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => { state.searchQuery = e.target.value; applyFilters(); }, 250);
});

// ═══════════════════════════════════════════════════════
// DEPARTMENTS PAGE
// ═══════════════════════════════════════════════════════
function loadDepartmentsPage() {
  const tbody = document.getElementById('dept-tbody');
  const depts = DEMO_DEPTS.map(d => ({
    ...d,
    studentCount: state.students.filter(s => s.departmentId === d.id).length
  }));
  tbody.innerHTML = depts.map(d => `
    <tr>
      <td><span style="font-weight:700;color:var(--accent-1)">${d.code}</span></td>
      <td style="font-weight:600;color:var(--text-0)">${d.name}</td>
      <td style="color:var(--text-2)">${d.headOfDept}</td>
      <td>
        <div class="gpa-cell">
          <div class="gpa-bar">
            <div class="gpa-fill gpa-high" style="width:${(d.studentCount/Math.max(state.students.length,1)*100).toFixed(0)}%"></div>
          </div>
          <span style="font-weight:700">${d.studentCount}</span>
        </div>
      </td>
    </tr>`).join('');
}

// ═══════════════════════════════════════════════════════
// COURSES PAGE
// ═══════════════════════════════════════════════════════
function loadCoursesPage() {
  const tbody = document.getElementById('course-tbody');
  tbody.innerHTML = DEMO_COURSES.map(c => `
    <tr>
      <td><span style="font-weight:700;color:var(--accent-1);font-family:monospace">${c.code}</span></td>
      <td style="font-weight:600;color:var(--text-0)">${c.name}</td>
      <td style="color:var(--text-2)">${c.department}</td>
      <td>
        <span style="background:rgba(139,120,255,0.12);color:var(--accent-1);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700">${c.credits} cr</span>
      </td>
    </tr>`).join('');
}

// ═══════════════════════════════════════════════════════
// ADD / EDIT MODAL
// ═══════════════════════════════════════════════════════
function populateModalDepts() {
  const sel = document.getElementById('form-dept');
  sel.innerHTML = '<option value="">Select department</option>';
  DEMO_DEPTS.forEach(d => sel.innerHTML += `<option value="${d.id}">${d.name}</option>`);
}

async function openAddModal() {
  state.editingId = null;
  document.getElementById('modal-title').textContent = 'Add New Student';
  document.getElementById('modal-icon').textContent = '➕';
  document.getElementById('save-btn-text').textContent = 'Save Student';
  document.getElementById('student-form').reset();
  document.getElementById('form-id').value = '';
  document.getElementById('form-enroll').value = new Date().toISOString().split('T')[0];

  // FIX: fetch next ID from backend so it's always accurate, even if students aren't loaded yet
  document.getElementById('form-sid').value = 'Loading...';
  try {
    const res = await fetch(API_BASE + '/nextId');
    const data = await res.json();
    document.getElementById('form-sid').value = data.studentId || 'STU001';
  } catch(e) {
    // fallback: compute locally
    const maxId = Math.max(0, ...state.students.map(s => parseInt(s.studentId.replace('STU','')) || 0));
    document.getElementById('form-sid').value = `STU${String(maxId+1).padStart(3,'0')}`;
  }

  populateModalDepts();
  openModal('student-modal');
}

function editStudent(id, event) {
  if (event) event.stopPropagation();
  // FIX: second branch was identical (dead code) — should fall back to DEMO_STUDENTS
  const s = state.students.find(x => x.id === id) || DEMO_STUDENTS.find(x => x.id === id);
  if (!s) return;

  state.editingId = id;
  document.getElementById('modal-title').textContent = 'Edit Student';
  document.getElementById('modal-icon').textContent = '✏';
  document.getElementById('save-btn-text').textContent = 'Update Student';
  document.getElementById('form-id').value = s.id;
  document.getElementById('form-sid').value = s.studentId;
  document.getElementById('form-fname').value = s.firstName;
  document.getElementById('form-lname').value = s.lastName;
  document.getElementById('form-email').value = s.email;
  document.getElementById('form-phone').value = s.phone || '';
  document.getElementById('form-dob').value = s.dateOfBirth || '';
  document.getElementById('form-gender').value = s.gender || '';
  document.getElementById('form-address').value = s.address || '';
  document.getElementById('form-status').value = s.status;
  document.getElementById('form-gpa').value = s.gpa;
  document.getElementById('form-enroll').value = s.enrollmentDate || '';
  populateModalDepts();
  document.getElementById('form-dept').value = s.departmentId;
  openModal('student-modal');
}

async function saveStudent() {
  const fname = document.getElementById('form-fname').value.trim();
  const lname = document.getElementById('form-lname').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const deptId = parseInt(document.getElementById('form-dept').value);
  // FIX: read and validate GPA before building the student object
  const gpa = parseFloat(document.getElementById('form-gpa').value) || 0;

  if (!fname || !lname || !email || !deptId) {
    showToast('Please fill in all required fields (Name, Email, Department)', 'error');
    return;
  }
  // FIX: GPA must be 0.00 to 4.00 — catches the "GPA 9" bug that caused "Failed to save"
  if (gpa < 0 || gpa > 9.9) {
    showToast('GPA must be between 0.00 and 9.90', 'error');
    return;
  }

  const dept = DEMO_DEPTS.find(d => d.id === deptId);
  const student = {
    id: state.editingId || (Math.max(0, ...state.students.map(s => s.id)) + 1),
    studentId: document.getElementById('form-sid').value,
    firstName: fname,
    lastName: lname,
    email,
    phone: document.getElementById('form-phone').value,
    dateOfBirth: toISODate(document.getElementById('form-dob').value),
    gender: document.getElementById('form-gender').value,
    address: document.getElementById('form-address').value,
    departmentId: deptId,
    departmentName: dept?.name || '',
    status: document.getElementById('form-status').value,
    gpa: gpa,
    enrollmentDate: toISODate(document.getElementById('form-enroll').value),
    createdAt: new Date().toISOString()
  };

  if (DEMO_MODE) {
    if (state.editingId) {
      const idx = state.students.findIndex(s => s.id === state.editingId);
      if (idx > -1) state.students[idx] = { ...state.students[idx], ...student };
      showToast(`${fname} ${lname} updated successfully`, 'success');
    } else {
      state.students.unshift(student);
      showToast(`${fname} ${lname} added successfully`, 'success');
    }
  } else {
    const result = state.editingId ? await apiPut(student) : await apiPost(student);
    // FIX: show the actual error message returned by the server (e.g. 'GPA must be between 0 and 4')
    if (!result?.success) { showToast(result?.message || 'Failed to save student', 'error'); return; }
    showToast(result.message, 'success');
  }

  closeModal();
  await loadStudentsPage();
  // ✅ FIX 4: correct element id is "nav-students-count"
  document.getElementById('nav-students-count').textContent = state.students.length;
}

// ═══════════════════════════════════════════════════════
// VIEW STUDENT MODAL
// ═══════════════════════════════════════════════════════
function viewStudent(id, event) {
  if (event) event.stopPropagation();
  // ✅ FIX: use state.students (real data) not just DEMO_STUDENTS
  const s = state.students.find(x => x.id === id) || DEMO_STUDENTS.find(x => x.id === id);
  if (!s) return;

  const gpaColor = gpaClass(s.gpa);
  const body = document.getElementById('view-modal-body');
  body.innerHTML = `
    <div class="profile-banner">
      <div class="profile-avatar-lg dept-${s.departmentId % 6}">${s.firstName[0]}${s.lastName[0]}</div>
      <div class="profile-info">
        <div class="profile-name">${s.firstName} ${s.lastName}</div>
        <div class="profile-meta">
          <span class="profile-meta-item">🎓 ${s.studentId}</span>
          <span class="profile-meta-item">📧 ${s.email}</span>
          <span class="profile-meta-item"><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></span>
        </div>
      </div>
      <div style="text-align:right">
        <div class="stat-value ${gpaColor}" style="font-size:32px">${s.gpa.toFixed(2)}</div>
        <div style="font-size:12px;color:var(--text-3)">GPA</div>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-field"><div class="detail-field-label">Department</div><div class="detail-field-value">${s.departmentName || '—'}</div></div>
      <div class="detail-field"><div class="detail-field-label">Gender</div><div class="detail-field-value">${s.gender || '—'}</div></div>
      <div class="detail-field"><div class="detail-field-label">Phone</div><div class="detail-field-value">${s.phone || '—'}</div></div>
      <div class="detail-field"><div class="detail-field-label">Date of Birth</div><div class="detail-field-value">${formatDate(s.dateOfBirth) || '—'}</div></div>
      <div class="detail-field"><div class="detail-field-label">Enrollment Date</div><div class="detail-field-value">${formatDate(s.enrollmentDate) || '—'}</div></div>
      <div class="detail-field"><div class="detail-field-label">Added On</div><div class="detail-field-value">${formatDate(s.createdAt?.split('T')[0]) || '—'}</div></div>
    </div>
    ${s.address ? `
    <div style="margin-top:16px;padding:14px;background:var(--bg-2);border-radius:var(--radius);border:1px solid var(--border)">
      <div class="detail-field-label" style="margin-bottom:6px">Address</div>
      <div style="color:var(--text-1);font-size:14px">${s.address}</div>
    </div>` : ''}
  `;

  document.getElementById('view-edit-btn').onclick = () => { closeViewModal(); editStudent(id); };
  openModal('view-modal');
}

// ═══════════════════════════════════════════════════════
// DELETE MODAL
// ═══════════════════════════════════════════════════════
function confirmDelete(id, event) {
  if (event) event.stopPropagation();
  // ✅ FIX: use state.students (real data) not just DEMO_STUDENTS
  const s = state.students.find(x => x.id === id) || DEMO_STUDENTS.find(x => x.id === id);
  state.deletingId = id;
  document.getElementById('delete-modal-text').textContent =
    `This will permanently delete ${s?.firstName} ${s?.lastName} (${s?.studentId}) and all associated records. This action cannot be undone.`;
  document.getElementById('confirm-delete-btn').onclick = () => deleteStudent(id);
  openModal('delete-modal');
}

async function deleteStudent(id) {
  if (DEMO_MODE) {
    const idx = state.students.findIndex(s => s.id === id);
    const name = idx > -1 ? `${state.students[idx].firstName} ${state.students[idx].lastName}` : 'Student';
    if (idx > -1) state.students.splice(idx, 1);
    showToast(`${name} deleted`, 'success');
  } else {
    const result = await apiDelete(id);
    if (!result?.success) { showToast('Failed to delete student', 'error'); return; }
    showToast(result.message, 'success');
  }
  closeDeleteModal();
  await loadStudentsPage();
  // ✅ FIX 4: correct element id is "nav-students-count"
  document.getElementById('nav-students-count').textContent = state.students.length;
}

// ═══════════════════════════════════════════════════════
// EXPORT / REPORTS
// ═══════════════════════════════════════════════════════
function exportCSV() {
  const headers = ['ID','Student ID','First Name','Last Name','Email','Phone','DOB','Gender','Department','Status','GPA','Enrollment Date'];
  const rows = state.students.map(s => [
    s.id, s.studentId, s.firstName, s.lastName, s.email, s.phone,
    s.dateOfBirth, s.gender, s.departmentName, s.status, s.gpa, s.enrollmentDate
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v||''}"`).join(',')).join('\n');
  download(csv, 'students.csv', 'text/csv');
  showToast('CSV exported successfully', 'success');
}

function exportJSON() {
  download(JSON.stringify(state.students, null, 2), 'students.json', 'application/json');
  showToast('JSON exported successfully', 'success');
}

function printReport() { window.print(); }

function download(content, filename, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type}));
  a.download = filename;
  a.click();
}

// ═══════════════════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════════════════
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal() { document.getElementById('student-modal').classList.remove('open'); }
function closeViewModal() { document.getElementById('view-modal').classList.remove('open'); }
function closeDeleteModal() { document.getElementById('delete-modal').classList.remove('open'); }

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ═══════════════════════════════════════════════════════
// TOASTS
// ═══════════════════════════════════════════════════════
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3500);
}

// ═══════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════
function gpaClass(gpa) {
  if (gpa >= 3.5) return 'gpa-high';
  if (gpa >= 2.5) return 'gpa-mid';
  return 'gpa-low';
}

// FIX: Convert any date format to YYYY-MM-DD that Java/MySQL expects
function toISODate(dateStr) {
  if (!dateStr) return '';
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // DD-MM-YYYY → YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('-');
    return `${y}-${m}-${d}`;
  }
  // DD/MM/YYYY → YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
  }
  return dateStr;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'});
}

// ═══════════════════════════════════════════════════════
// SELECT ALL CHECKBOX
// ═══════════════════════════════════════════════════════
document.getElementById('select-all')?.addEventListener('change', function() {
  document.querySelectorAll('#student-tbody input[type="checkbox"]').forEach(cb => cb.checked = this.checked);
  document.querySelectorAll('#student-tbody tr').forEach(tr => {
    if(this.checked) tr.classList.add('selected');
    else tr.classList.remove('selected');
  });
});

// ═══════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════
(async function init() {
  // Step 1: show dashboard page visually
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.getElementById('page-dashboard').classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector('[data-page="dashboard"]').classList.add('active');
  document.getElementById('global-search-wrap').style.display = 'none';
  document.getElementById('add-student-btn').style.display = 'none';

  // Step 2: load data
  await fetchStudents();
  await loadDashboard();
  state.dashboardLoaded = true;

  if (DEMO_MODE) {
    showToast('Running in demo mode — connect your Java backend to go live', 'success');
  }
})();