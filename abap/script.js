// Component Information Database for SAP NetWeaver AS ABAP
const componentInfo = {
  // --- Client Layer ---
  sapgui: {
    title: "SAP GUI",
    description: "Desktop client application for accessing SAP systems using DIAG (SAP's proprietary) protocol.",
    icon: "🖥️",
    details: [
      "Traditional thick client used for ABAP stack access",
      "Communicates via DIAG protocol (compressed)",
      "Requires installation on user's workstation",
      "Supports rich UI features, OLE automation, and offline capabilities"
    ]
  },
  browser: {
    title: "Web Browser",
    description: "Modern web-based access to SAP applications via HTTP/HTTPS.",
    icon: "🌐",
    details: [
      "Access point for Fiori Launchpad, WebDynpro, and SAP GUI for HTML",
      "Zero-footprint client (no installation required)",
      "Uses HTTPS protocol with TLS encryption",
      "Responsive design for mobile/desktop access"
    ]
  },

  // --- External Layer ---
  webdispatcher: {
    title: "SAP Web Dispatcher",
    description: "Software web switch and reverse proxy that acts as the entry point for HTTP(S) requests.",
    icon: "🚦",
    ports: ["HTTP: 80", "HTTPS: 443", "Admin: 8100"],
    function: "Load balancing, SSL termination, and request routing to backend ABAP systems.",
    details: [
      "Performs software load balancing using logon groups",
      "Terminates SSL/TLS connections (End-to-End SSL possible)",
      "Filters malicious requests (URL filtering)",
      "Serves static content"
    ]
  },

  // --- Infrastructure ---
  vm: {
    title: "Virtual Machine / Host",
    description: "Server infrastructure hosting SAP instances.",
    icon: "💻",
    details: [
      "Provides CPU, Memory, and I/O resources",
      "Can be a physical server, VM (VMware/KVM), or Cloud Instance (EC2/Azure VM)",
      "Runs the Operating System (Linux/Windows/Unix)"
    ],
    specs: {
      "OS": "Linux (RHEL/SLES)",
      "Kernel": "Optimized for SAP workloads"
    }
  },
  os_layer: {
    title: "Operating System Layer",
    description: "Underlying OS providing kernel, filesystem, and networking services.",
    icon: "🐧",
    function: "Resource management, user isolation (sidadm), and process scheduling."
  },

  // --- ASCS Instance ---
  ascs_instance: {
    title: "ASCS Instance (ABAP Central Services)",
    description: "Central instance containing the Message Server and Enqueue Server.",
    icon: "⚙️",
    function: "Central lock management and cluster communication hub.",
    details: [
      "Instance Number: Usually 00 or 01",
      "Must be a singleton in the system (High Availability setup replicates this)",
      "Lightweight, low memory footprint"
    ]
  },
  msg_server: {
    title: "Message Server (ms)",
    description: "Central communication channel between all application servers.",
    icon: "📨",
    ports: ["36xx (Internal)", "81xx (HTTP)"],
    function: "Handles logon load balancing and internal cluster communication.",
    details: [
      "Maintains the list of active application servers",
      "Directs logon requests to the least loaded server",
      "Facilitates communication between Dispatchers"
    ]
  },
  enqueue_server: {
    title: "Enqueue Server (en)",
    description: "Manages the logical lock table for the entire system.",
    icon: "🔒",
    ports: ["32xx"],
    function: "Ensures data consistency by managing exclusive database locks.",
    details: [
      "Holds the 'Lock Table' in main memory",
      "Single Point of Failure (protected by Enqueue Replication Server in HA)",
      " Prevents multiple users from editing the same record simultaneously"
    ]
  },

  // --- Application Server Instance ---
  pas_instance: {
    title: "Primary Application Server (PAS)",
    description: "The first installation of an application server, containing the core processing logic.",
    icon: "⚙️",
    function: "Executes ABAP programs and handles user requests.",
    details: [
      "Contains Dispatcher, ICM, Gateway, and Work Processes",
      "Full ABAP runtime environment"
    ]
  },
  aas_instance: {
    title: "Additional Application Server (AAS)",
    description: "Scalable application server instance added for increased capacity.",
    icon: "⚙️",
    function: "Provides additional processing power for the system.",
    details: [
      "Identical software stack to PAS",
      "Can be added/removed dynamically",
      "Connects to ASCS/Database"
    ]
  },
  sapstartsrv: {
    title: "sapstartsrv",
    description: "Host Agent / Instance Agent service.",
    icon: "🛡️",
    ports: ["5xx13 (HTTPS)", "5xx14 (HTTP)"],
    function: "Controls instance lifecycle (Start that / Stop / Status).",
    details: [
      "Runs as a daemon/service",
      "Provides SOAP API for management tools (SUM, LVM)",
      "Reads the start profile"
    ]
  },
  icm: {
    title: "Internet Communication Manager (ICM)",
    description: "Process that handles HTTP/HTTPS protocols for the application server.",
    icon: "🌐",
    function: "Terminates web requests and forwards them to the ABAP Dispatcher.",
    details: [
      "Handles HTTP, HTTPS, SMTP, WebSockets",
      "Manages server cache",
      "Can act as a client to call external web services"
    ]
  },
  gateway: {
    title: "Gateway (gw)",
    description: "RFC interface for communication with other SAP systems and external programs.",
    icon: "🚪",
    ports: ["33xx"],
    function: "Routes RFC (Remote Function Call) requests.",
    details: [
      "Supports CPIC and RFC protocols",
      "Security: Regulated by 'secinfo' and 'reginfo' files",
      "Connects to external launcher programs"
    ]
  },
  dispatcher: {
    title: "ABAP Dispatcher",
    description: "Distributes requests to the work processes.",
    icon: "👮",
    function: "Manages the request queue and assigns tasks to free work processes.",
    details: [
      "Buffers requests in the 'Dialog Queue'",
      "Manages shared memory organization",
      "Heartbeat of the instance"
    ]
  },
  shared_memory: {
    title: "ABAP Shared Memory",
    description: "Common memory area accessible by all work processes of an instance.",
    icon: "🧠",
    details: [
      "PXA (Program Execution Area): Caches compiled ABAP programs",
      "Buffering: Table buffers to reduce DB load",
      "Roll Area: Stores user context data"
    ]
  },
  
  // --- Work Processes ---
  wp_dia: {
    title: "Dialog Work Process (DIA)",
    description: "Handles interactive user requests from SAP GUI or Web.",
    icon: "⚡",
    function: "Executes ABAP logic for online users.",
    details: [
      "Short-running transactions (limited by rdisp/max_wprun_time)",
      "Swaps user contexts in and out"
    ]
  },
  wp_btc: {
    title: "Batch Work Process (BTC)",
    description: "Handles background jobs.",
    icon: "📅",
    function: "Executes scheduled reports and long-running tasks.",
    details: [
      "No runtime timeout limit",
      "Critical for overnight processing and data loads"
    ]
  },
  wp_upd: {
    title: "Update Work Process (UPD/V1)",
    description: "Processes time-critical database updates.",
    icon: "💾",
    function: "Commits changes to the database asynchronously.",
    details: [
      "Triggered by 'COMMIT WORK'",
      "Ensures ACID properties via SAP Update System"
    ]
  },
  wp_spo: {
    title: "Spool Work Process (SPO)",
    description: "Manages output and printing.",
    icon: "🖨️",
    function: "Formats data for printers and manages the spool queue.",
    details: [
      "Supports PDF conversion",
      "Interfaces with OS print subsystem"
    ]
  },

  // --- Database ---
  database: {
    title: "Database (DBMS)",
    description: "Central data repository (e.g., SAP HANA).",
    icon: "🗄️",
    function: "Stores application data, configuration, and repository objects.",
    details: [
      "Includes ABAP Schema (SAPABAP1)",
      "Supports columnar storage (HANA)",
      "Primary Persistence Layer"
    ]
  }
};

/**
 * Display component information in the modal
 */
function showInfo(componentId) {
  const modal = document.getElementById("componentModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  
  // Handle direct mappings if IDs slightly differ or if clicking wrapper elements
  let id = componentId;
  const component = componentInfo[id];

  if (!component) {
    console.warn("Component info not found for:", id);
    return;
  }

  // Build content
  let headerHtml = component.icon ? `${component.icon} ${component.title}` : component.title;
  modalTitle.innerHTML = headerHtml;

  let contentHtml = `
    <div class="space-y-4">
      <div class="info-section">
        <p class="text-slate-600">${component.description}</p>
      </div>
  `;

  if (component.function) {
    contentHtml += `
      <div class="info-section p-3 bg-blue-50 rounded-lg border border-blue-100">
        <h3 class="font-bold text-xs text-blue-800 uppercase mb-1">Core Function</h3>
        <p class="text-xs text-blue-700">${component.function}</p>
      </div>
    `;
  }

  if (component.details && component.details.length > 0) {
    contentHtml += `
      <div class="info-section">
        <h3 class="font-bold text-xs text-slate-700 uppercase mb-2">Key Details</h3>
        <ul class="space-y-2">
          ${component.details.map(detail => `
            <li class="text-xs text-slate-600 flex gap-2">
              <span class="text-blue-500 font-bold">•</span>
              <span>${detail}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  if (component.ports) {
    contentHtml += `
      <div class="info-section">
        <h3 class="font-bold text-xs text-slate-700 uppercase mb-2">Ports & Protocols</h3>
        <div class="flex flex-wrap gap-2">
          ${component.ports.map(port => `
             <span class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-mono rounded border border-slate-200">${port}</span>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  contentHtml += `</div>`;
  modalBody.innerHTML = contentHtml;
  
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("componentModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// --- Scaling Logic for ABAP App Servers ---
let abapAppServerCount = 0;

function getAbapAppServerLevelContent() {
  const wrappers = document.querySelectorAll(".vm-level-wrapper");
  for (const wrapper of wrappers) {
    const title = wrapper.querySelector(".vm-level-title");
    if (title && title.textContent.includes("Application Servers")) {
       return wrapper.querySelector(".vm-level-content");
    }
  }
  return document.getElementById("abapAppServersList"); // fallback ID
}

function addAbapAppServer() {
  const list = getAbapAppServerLevelContent();
  if (!list) return;

  // Use the first VM in the list as a template
  const templateVm = list.querySelector(".vm-container");
  if (!templateVm) return;

  const newVm = templateVm.cloneNode(true);
  abapAppServerCount++;
  
  // Update details
  const vmTitle = newVm.querySelector(".vm-title");
  if (vmTitle) vmTitle.textContent = `VM/Host: sap-abap-aas-${String(abapAppServerCount).padStart(2, '0')}`;
  
  const instanceTitle = newVm.querySelector(".instance-title");
  if (instanceTitle) instanceTitle.textContent = "SAP ABAP AAS";
  
  const instanceId = newVm.querySelector(".instance-id");
  if (instanceId) instanceId.textContent = `Instance# ${10 + abapAppServerCount}`; // Start from 11

  // Re-attach events
  reattachEvents(newVm);
  
  list.appendChild(newVm);
}

function removeAbapAppServer() {
  const list = getAbapAppServerLevelContent();
  if (!list) return;

  const vms = list.querySelectorAll(".vm-container");
  if (vms.length > 1) { // Keep at least PAS
     list.removeChild(vms[vms.length - 1]);
     abapAppServerCount--;
  }
}

function reattachEvents(rootElement) {
   const clickables = rootElement.querySelectorAll('[onclick]');
   clickables.forEach(el => {
      // The onclick attribute is string-based, so it persists in clone
      // But if we used addEventListener, we'd need to re-add.
      // Since we use onclick="showInfo('id')" in HTML, it should work automatically.
      // However, prevent bubbling if needed.
   });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Modal Close Logic
    const closeBtn = document.getElementById("modalClose");
    const modal = document.getElementById("componentModal");
    
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
        });
    }

    // Initial count
    const list = getAbapAppServerLevelContent();
    if (list) {
        abapAppServerCount = list.querySelectorAll(".vm-container").length - 1; // Subtract PAS
    }
});
