// Component Information Database
const componentInfo = {
  sapgui: {
    title: "SAP GUI",
    description:
      "Desktop client application for accessing SAP systems using DIAG (SAP's proprietary) protocol.",
    details: [
      "Traditional thick client used for ABAP stack access",
      "Communicates via DIAG protocol",
      "Requires installation on user's workstation",
      "Supports rich UI features and offline capabilities",
    ],
  },
  browser: {
    title: "Web Browser",
    description:
      "Modern web-based access to both ABAP and Java stack applications.",
    details: [
      "Uses HTTP/HTTPS protocol",
      "Accesses both SAP GUI for HTML and Fiori applications",
      "Platform-independent access",
      "No client installation required",
    ],
  },
  vm: {
    title: "Virtual Machine / Host",
    description:
      "Single host environment containing both ABAP and Java stacks.",
    details: [
      "Lab/development scenario with both stacks on one host",
      "Shared system resources",
      "Both instances communicate via localhost/network",
      "Isolated from production but demonstrates dual-stack architecture",
    ],
  },
  abap_ms: {
    title: "Message Server (ABAP)",
    description:
      "Central communication hub for ABAP instances in the dual-stack system.",
    details: [
      "Routes messages between application servers",
      "Maintains instance communication state",
      "Part of ASCS (Instance 00)",
      "Critical for load balancing and failover",
    ],
  },
  abap_es: {
    title: "Enqueue Server (ABAP)",
    description:
      "Manages database locks and ensures data consistency across the ABAP stack.",
    details: [
      "Single point of lock management",
      "Prevents concurrent modifications",
      "Part of ASCS",
      "Essential for data integrity",
    ],
  },
  sapstartsrv: {
    title: "sapstartsrv",
    description:
      "Infrastructure component responsible for starting and stopping SAP services.",
    details: [
      "Process management and monitoring",
      "Used by SAP Start Service (sapstart)",
      "Manages instance lifecycle",
      "Available on all instances",
    ],
  },
  igs: {
    title: "IGS (Internet Graphics Server)",
    description:
      "Optional component for rendering graphics in SAP GUI for HTML.",
    details: [
      "Converts ABAP OLE objects to web formats",
      "Optional for modern Fiori deployments",
      "Reduces with move to web-native applications",
      "Part of ABAP PAS infrastructure",
    ],
  },
  jstart: {
    title: "jstart/jlaunch",
    description:
      "Java process management component that starts and manages Java services.",
    details: [
      "Launches the J2EE engine",
      "Manages JVM lifecycle",
      "Logs and monitors Java processes",
      "Part of Java infrastructure",
    ],
  },
  icm: {
    title: "ICM (Internet Communication Manager)",
    description:
      "Handles HTTP/HTTPS communication and acts as application gateway for both stacks.",
    details: [
      "Present in both ABAP and Java stacks",
      "Manages incoming HTTP requests",
      "Load balancing across server nodes",
      "SSL/TLS termination capability",
      "Shared in dual-stack but isolated per stack",
    ],
  },
  dispatcher_abap: {
    title: "ABAP Dispatcher",
    description: "Routes requests to available ABAP work processes.",
    details: [
      "Manages request queue for ABAP processing",
      "Assigns requests to work processes",
      "Monitors work process availability",
      "Handles context switching",
    ],
  },
  dispatcher_java: {
    title: "Java Dispatcher",
    description: "Routes requests to available Java server nodes.",
    details: [
      "Connection manager for client connections",
      "Load balancer for server nodes",
      "Session management",
      "Failover handling",
    ],
  },
  abap_mem: {
    title: "ABAP Shared Memory",
    description:
      "Shared memory segments used by ABAP work processes for efficient data access.",
    details: [
      "PXA (Program eXecution Area) - compiled program cache",
      "Roll Area - individual user context",
      "Table Buffer - frequently accessed table data cache",
      "Located in instance memory on ABAP PAS",
    ],
  },
  wp_dia: {
    title: "Dialog Work Process (DIA)",
    description:
      "Handles interactive user requests from SAP GUI and web browsers.",
    details: [
      "Executes ABAP programs synchronously",
      "Direct user interaction processing",
      "Blocks until request completes",
      "Primary process type for user operations",
    ],
  },
  wp_btc: {
    title: "Batch Work Process (BTC)",
    description: "Executes batch jobs and background processing tasks.",
    details: [
      "Runs scheduled/periodic tasks",
      "Asynchronous processing",
      "Can run at off-peak hours",
      "Used for mass data operations",
    ],
  },
  wp_upd: {
    title: "Update Work Process V1 (UPD)",
    description: "Asynchronously processes database updates (V1 variant).",
    details: [
      "V1 = synchronous update",
      "Executes database commits asynchronously",
      "Separates long transactions",
      "Improves system responsiveness",
    ],
  },
  wp_up2: {
    title: "Update Work Process V2 (UP2)",
    description: "Asynchronously processes database updates (V2 variant).",
    details: [
      "V2 = asynchronous update",
      "Second-level update processing",
      "Handles deferred updates",
      "Further decouples transaction processing",
    ],
  },
  wp_spo: {
    title: "Spool Work Process (SPO)",
    description: "Manages print jobs and spool requests for output formatting.",
    details: [
      "Processes print requests",
      "Manages printer output queues",
      "Formats reports for printing",
      "Handles device type conversions",
    ],
  },
  gateway: {
    title: "Gateway (RFC)",
    description:
      "Enables RFC (Remote Function Call) communication with external systems.",
    details: [
      "RFC server capabilities",
      "Bidirectional communication",
      "Connects to other SAP systems",
      "External system integration point",
    ],
  },
  java_ms: {
    title: "Message Server (Java)",
    description: "Central communication hub for Java instances.",
    details: [
      "Similar to ABAP Message Server",
      "Routes JMS and internal messaging",
      "Cluster communication",
      "Part of SCS (Instance 02)",
    ],
  },
  java_enq: {
    title: "Enqueue Server (Java)",
    description: "Manages locks in the Java stack.",
    details: [
      "Distributed lock management",
      "Ensures data consistency in Java applications",
      "Part of SCS",
      "Supports Java object serialization",
    ],
  },
  server_node: {
    title: "Java Server Node (JVM)",
    description: "JVM instance running J2EE containers and application logic.",
    details: [
      "Executes Java applications",
      "Contains Web and EJB containers",
      "Manages session state",
      "Multiple nodes for scalability",
    ],
  },
  java_web: {
    title: "Web Container",
    description: "Servlet and JSP execution environment within the JVM.",
    details: [
      "Implements Servlet specification",
      "Executes JSP pages",
      "Manages HTTP sessions",
      "Request/response processing",
    ],
  },
  java_ejb: {
    title: "EJB Container",
    description: "Enterprise JavaBean execution and lifecycle management.",
    details: [
      "Stateless/Stateful bean support",
      "Message-driven beans",
      "Transaction management",
      "Business logic execution",
    ],
  },
  java_persist: {
    title: "Persistence Layer",
    description: "Data access and ORM functionality for Java applications.",
    details: [
      "Database connection pooling",
      "ORM frameworks (JPA/Hibernate)",
      "Transaction coordination",
      "Caching mechanisms",
    ],
  },
  db: {
    title: "DBMS (Database)",
    description:
      "Central relational database supporting both ABAP and Java stacks.",
    details: [
      "Single shared database instance",
      "Contains both ABAP and Java schemas",
      "Supports full ACID transactions",
      "Common database engines: HANA, Oracle, SQL Server, PostgreSQL",
    ],
  },
  db_schema_abap: {
    title: "ABAP Schema",
    description: "Database schema containing all ABAP-related tables and data.",
    details: [
      "Contains SAP data dictionary tables",
      "Application data storage",
      "ABAP object definitions",
      "Maintains separation from Java schema",
    ],
  },
  db_schema_java: {
    title: "Java Schema",
    description: "Database schema for Java stack applications and metadata.",
    details: [
      "J2EE configuration data",
      "Application-specific tables",
      "Separate from ABAP to prevent interference",
      "Managed by Java application servers",
    ],
  },
};

/**
 * Display component information in the info panel
 * @param {string} componentId - The ID of the component to display
 */
function showInfo(componentId) {
  const component = componentInfo[componentId];

  if (!component) {
    document.getElementById("info-content").innerHTML = `
            <div class="text-center text-slate-400 py-8">
                <p class="text-sm">Component information not found.</p>
            </div>
        `;
    return;
  }

  let detailsHtml = "";
  if (component.details && component.details.length > 0) {
    detailsHtml = `
            <div class="mt-4">
                <h3 class="font-semibold text-xs uppercase text-slate-700 mb-2">Key Points:</h3>
                <ul class="space-y-2">
                    ${component.details
                      .map(
                        (detail) => `
                        <li class="text-xs text-slate-600 flex gap-2">
                            <span class="text-blue-500 font-bold">•</span>
                            <span>${detail}</span>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
        `;
  }

  document.getElementById("info-content").innerHTML = `
        <div class="space-y-3">
            <div>
                <h2 class="font-bold text-sm text-slate-900">${component.title}</h2>
                <p class="text-xs text-slate-600 mt-2">${component.description}</p>
            </div>
            ${detailsHtml}
        </div>
    `;
}

// Logic for scaling Java app servers only
let javaAppServerCount = 0;

function initializeScaleLogic() {
  // Initialize VM width slider
  const vmWidthSlider = document.getElementById("vmWidthSlider");
  const vmWidthValue = document.getElementById("vmWidthValue");
  if (vmWidthSlider && vmWidthValue) {
    // Set initial slider value from CSS variable or default
    const rootStyles = getComputedStyle(document.documentElement);
    const baseWidthVar = rootStyles.getPropertyValue("--vm-base-width").trim();
    const initialWidth = baseWidthVar
      ? parseInt(baseWidthVar, 10)
      : parseInt(vmWidthSlider.value, 10) || 360;

    vmWidthSlider.value = initialWidth;
    vmWidthValue.textContent = `${initialWidth}px`;

    vmWidthSlider.addEventListener("input", () => {
      const value = parseInt(vmWidthSlider.value, 10);
      document.documentElement.style.setProperty(
        "--vm-base-width",
        `${value}px`
      );
      vmWidthValue.textContent = `${value}px`;
    });
  }

  // Initialize Java app server count from DOM
  const javaLevelContent = getJavaAppServerLevelContent();
  if (javaLevelContent) {
    javaAppServerCount =
      javaLevelContent.querySelectorAll(".vm-container").length;
  }

  // Initialize component click handlers
  initializeComponentClicks();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeScaleLogic);
} else {
  initializeScaleLogic();
}


// Helpers for scaling Java app servers
function getJavaAppServerLevelContent() {
  const levelTitles = document.querySelectorAll(".vm-level-title");
  for (const title of levelTitles) {
    if (title.textContent.includes("Java Application Servers")) {
      const level = title.parentElement;
      return level.querySelector(".vm-level-content");
    }
  }
  return null;
}

function addJavaAppServer() {
  const javaLevelContent = getJavaAppServerLevelContent();
  if (!javaLevelContent) return;

  // Use the PAS VM as the template; all dynamically added VMs represent AAS
  const templateVm = javaLevelContent.querySelector(".vm-container");
  if (!templateVm) return;

  // Clone the PAS VM as a basis for an AAS VM
  const newVm = templateVm.cloneNode(true);

  javaAppServerCount += 1;
  const index = javaAppServerCount; // 1-based index

  // Update host name
  const vmTitle = newVm.querySelector(".vm-title");
  if (vmTitle) {
    vmTitle.textContent = `VM/Host: sap-java-app-0${index}`;
  }

  // Update instance title and ID
  const instanceTitle = newVm.querySelector(".instance-title");
  if (instanceTitle) {
    instanceTitle.textContent = "SAP Java Additional Application Server (AAS)";
  }
  const instanceId = newVm.querySelector(".instance-id");
  if (instanceId) {
    instanceId.textContent = `SID: J2E, Instance#: 0${index}`;
  }

  // Ensure role badge is set to AAS for dynamically added servers
  const roleBadge = newVm.querySelector(".badge-role");
  if (roleBadge) {
    roleBadge.textContent = "AAS";
  }

  // Re-attach click handlers to elements inside the cloned VM
  const clickableElements = newVm.querySelectorAll(
    ".box, .vm-container, .os-layer, .sap-instance, .process-box"
  );
  clickableElements.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      showComponentInfo(element);
    });
  });

  javaLevelContent.appendChild(newVm);
}

function removeJavaAppServer() {
  const javaLevelContent = getJavaAppServerLevelContent();
  if (!javaLevelContent) return;

  const vms = javaLevelContent.querySelectorAll(".vm-container");
  // Keep at least one Java app server
  if (vms.length <= 1) return;

  const lastVm = vms[vms.length - 1];
  javaLevelContent.removeChild(lastVm);
  javaAppServerCount = Math.max(1, javaAppServerCount - 1);
}

// Component Modal Functions
let modal, modalTitle, modalBody, modalClose;

function initializeComponentClicks() {
  modal = document.getElementById("componentModal");
  modalTitle = document.getElementById("modalTitle");
  modalBody = document.getElementById("modalBody");
  modalClose = document.getElementById("modalClose");

  // Close modal handlers
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }

  // Make all clickable elements interactive
  const clickableElements = document.querySelectorAll(
    ".box, .vm-container, .os-layer, .sap-instance, .process-box"
  );
  clickableElements.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      showComponentInfo(element);
    });
  });
}

function showComponentInfo(element) {
  if (!modal || !modalTitle || !modalBody) return;

  const info = extractComponentInfo(element);

  // Build modal content
  modalTitle.innerHTML = info.icon ? `${info.icon} ${info.title}` : info.title;

  let bodyHTML = "";

  if (info.description) {
    bodyHTML += `<div class="info-section"><p>${info.description}</p></div>`;
  }

  if (info.details && info.details.length > 0) {
    bodyHTML += '<div class="info-section"><h3>Details</h3><ul>';
    info.details.forEach((detail) => {
      bodyHTML += `<li>${detail}</li>`;
    });
    bodyHTML += "</ul></div>";
  }

  if (info.specs && Object.keys(info.specs).length > 0) {
    bodyHTML += '<div class="info-section"><h3>Specifications</h3><ul>';
    Object.entries(info.specs).forEach(([key, value]) => {
      bodyHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    });
    bodyHTML += "</ul></div>";
  }

  if (info.ports && info.ports.length > 0) {
    bodyHTML += '<div class="info-section"><h3>Ports & Protocols</h3><ul>';
    info.ports.forEach((port) => {
      bodyHTML += `<li>${port}</li>`;
    });
    bodyHTML += "</ul></div>";
  }

  if (info.function) {
    bodyHTML += `<div class="info-section"><h3>Function</h3><p>${info.function}</p></div>`;
  }

  modalBody.innerHTML = bodyHTML;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function extractComponentInfo(element) {
  const info = {
    title: "",
    description: "",
    icon: "",
    details: [],
    specs: {},
    ports: [],
    function: "",
  };

  // Extract icon
  const iconEl = element.querySelector(
    ".layer-icon, .vm-header span, .os-header span, .instance-header span"
  );
  if (iconEl) {
    info.icon = iconEl.textContent.trim();
  }

  // Extract title based on element type
  if (element.classList.contains("box")) {
    const titleEl = element.querySelector(".box-title");
    if (titleEl) info.title = titleEl.textContent.trim();

    const descEl = element.querySelector(".box-desc");
    if (descEl) info.description = descEl.textContent.trim();

    // Add network-specific info
    if (info.title.includes("DNS") || info.title.includes("Load Balancer")) {
      info.function =
        "Distributes incoming traffic across multiple servers for high availability and load distribution.";
      info.ports.push("Virtual IP (VIP)");
      info.ports.push("Health check endpoints");
    } else if (info.title.includes("Proxy") || info.title.includes("WAF")) {
      info.function =
        "Terminates TLS/SSL connections and routes traffic based on Layer 7 (application layer) rules.";
      info.ports.push("Port 80 (HTTP)");
      info.ports.push("Port 443 (HTTPS)");
    } else if (info.title.includes("Firewall")) {
      info.function =
        "Enforces network security policies and filters traffic based on IP addresses, ports, and protocols.";
    }
  } else if (element.classList.contains("vm-container")) {
    const titleEl = element.querySelector(".vm-title");
    if (titleEl) info.title = titleEl.textContent.trim();

    const specsEl = element.querySelector(".vm-specs");
    if (specsEl) {
      const specs = specsEl.textContent.trim();
      const parts = specs.split("|");
      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.includes("vCPU")) info.specs["vCPU"] = trimmed;
        else if (trimmed.includes("RAM")) info.specs["RAM"] = trimmed;
        else if (trimmed.includes("RHEL") || trimmed.includes("SLES"))
          info.specs["OS"] = trimmed;
      });
    }

    info.description =
      "Virtual machine or host running SAP components. Each VM can host multiple SAP instances and processes.";
  } else if (element.classList.contains("os-layer")) {
    const titleEl = element.querySelector(".os-title");
    if (titleEl) info.title = titleEl.textContent.trim();

    const descEl = element.querySelector("p");
    if (descEl) info.description = descEl.textContent.trim();

    info.function =
      "Provides the operating system layer with kernel, filesystem, networking, and user management capabilities required by SAP.";
  } else if (element.classList.contains("sap-instance")) {
    const titleEl = element.querySelector(".instance-title");
    if (titleEl) info.title = titleEl.textContent.trim();

    const idEl = element.querySelector(".instance-id");
    if (idEl) {
      const idText = idEl.textContent.trim();
      const parts = idText.split(",");
      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.includes("SID:"))
          info.specs["SID"] = trimmed.split(":")[1].trim();
        else if (trimmed.includes("Instance#"))
          info.specs["Instance Number"] = trimmed.split(":")[1].trim();
        else if (trimmed.includes("Tenant:"))
          info.specs["Tenant"] = trimmed.split(":")[1].trim();
      });
    }

    const badgeEl = element.querySelector(".badge-sap");
    if (badgeEl) info.description = badgeEl.textContent.trim() + " instance";

    if (info.title.includes("ASCS")) {
      info.function =
        "Central Services (ASCS) instance providing Message Server and Enqueue Server as the control plane for the Java cluster.";
    } else if (info.title.includes("JC")) {
      // Distinguish PAS vs AAS by role badge text if available
      const roleBadge = element.querySelector(".badge-role");
      const role = roleBadge ? roleBadge.textContent.trim() : "";
      if (role === "PAS") {
        info.function =
          "Primary Application Server (PAS) Java instance providing the initial Java Dispatcher and Java server nodes in the cluster.";
      } else {
        info.function =
          "Additional Application Server (AAS) Java instance providing extra Java Dispatchers and Java server nodes for scale-out.";
      }
    } else if (info.title.includes("HANA")) {
      info.function =
        "SAP HANA in-memory database providing data persistence and high-performance analytics.";
    }
  } else if (element.classList.contains("process-box")) {
    const titleEl = element.querySelector(".process-title");
    if (titleEl) {
      const titleText = titleEl.textContent.trim();
      // Remove badge text from title
      info.title = titleText.replace(/Process|JVM Process/g, "").trim();
    }

    const descEl = element.querySelector(".process-desc");
    if (descEl) info.description = descEl.textContent.trim();

    const detailsEl = element.querySelector(".process-details");
    if (detailsEl) {
      const items = detailsEl.querySelectorAll("li");
      items.forEach((item) => {
        const text = item.textContent.trim();
        if (text.includes("Port:")) {
          const portMatch = text.match(/Port:\s*(.+)/);
          if (portMatch) info.ports.push(portMatch[1]);
        } else if (text.includes("Function:")) {
          const funcMatch = text.match(/Function:\s*(.+)/);
          if (funcMatch) info.function = funcMatch[1];
        } else if (text.includes("Protocol:")) {
          const protoMatch = text.match(/Protocol:\s*(.+)/);
          if (protoMatch) info.ports.push(`Protocol: ${protoMatch[1]}`);
        } else {
          info.details.push(text);
        }
      });
    }

    // Add process-specific info
    if (info.title.includes("Message Server")) {
      info.function =
        "Central communication hub that maintains the server list and provides load balancing information to all Java application server instances.";
    } else if (info.title.includes("Enqueue Server")) {
      info.function =
        "Manages distributed locks and ensures data consistency across the entire SAP cluster.";
    } else if (info.title.includes("ICM")) {
      info.function =
        "Internet Communication Manager handles HTTP/HTTPS requests, performs TLS termination, and forwards requests to the Dispatcher.";
    } else if (info.title.includes("Dispatcher")) {
      info.function =
        "Routes incoming requests to available JVM nodes, manages load balancing, session affinity, and node health monitoring.";
    } else if (
      info.title.includes("JVM") ||
      info.title.includes("Java Server")
    ) {
      info.function =
        "Java Virtual Machine process running the SAP Java EE application server with servlet container, EJB container, and deployed applications.";

      // Extract JVM internals if present
      const jvmInternals = element.querySelector(".jvm-internals");
      if (jvmInternals) {
        const sections = jvmInternals.querySelectorAll(".jvm-section");
        sections.forEach((section) => {
          const sectionTitle = section
            .querySelector(".jvm-section-title")
            ?.textContent.trim();
          const items = section.querySelectorAll(".jvm-items li");
          if (sectionTitle && items.length > 0) {
            info.details.push(`<strong>${sectionTitle}</strong>`);
            items.forEach((item) => {
              info.details.push(`  • ${item.textContent.trim()}`);
            });
          }
        });
      }
    } else if (info.title.includes("sapstartsrv")) {
      info.function =
        "Instance control daemon that manages the lifecycle of SAP processes (start, stop, status monitoring).";
    } else if (info.title.includes("hdb")) {
      info.function =
        "HANA database process handling SQL queries, data storage, and database operations.";
    }
  }

  return info;
}

function closeModal() {
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// ==================== Flow View Implementation ====================

let currentView = "topology";
let currentFlow = "http";
let flowState = {
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,
  flowData: null,
  animationInterval: null,
};

// View switching
function switchView(view) {
  currentView = view;
  const topologyView = document.getElementById("topologyView");
  const flowView = document.getElementById("flowView");
  const topologyBtn = document.getElementById("topologyViewBtn");
  const flowBtn = document.getElementById("flowViewBtn");
  const topologyControls = document.getElementById("topologyControls");
  const topologyControls2 = document.getElementById("topologyControls2");
  const flowControls = document.getElementById("flowControls");

  if (view === "topology") {
    topologyView.style.display = "block";
    flowView.style.display = "none";
    topologyBtn.classList.add("active");
    flowBtn.classList.remove("active");
    topologyControls.style.display = "flex";
    topologyControls2.style.display = "flex";
    flowControls.style.display = "none";
    stopFlow();
  } else {
    topologyView.style.display = "none";
    flowView.style.display = "block";
    flowBtn.classList.add("active");
    topologyBtn.classList.remove("active");
    topologyControls.style.display = "none";
    topologyControls2.style.display = "none";
    flowControls.style.display = "flex";
    initializeFlowView();
  }
}

// Initialize flow view
function initializeFlowView() {
  initializeArrowMarkers();
  const selector = document.getElementById("flowSelector");
  if (selector) {
    currentFlow = selector.value;
    selector.addEventListener("change", (e) => {
      currentFlow = e.target.value;
      restartFlow();
    });
  }
  restartFlow();
}

// End of script

