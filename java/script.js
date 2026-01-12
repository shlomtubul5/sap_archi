let currentZoom = 1.3;
let canvas, zoomLevel, shell;
let javaAppServerCount = 0;

function initializeZoom() {
  canvas = document.getElementById("canvas");
  zoomLevel = document.getElementById("zoomLevel");
  shell = document.getElementById("diagramShell");

  // Apply initial zoom
  updateZoom();

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

  if (shell) {
    shell.addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    });
  }

  // Initialize component click handlers
  initializeComponentClicks();
}

// Handle window resize for flow view
let resizeTimeout;
window.addEventListener("resize", () => {
  if (currentView === "flow") {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (flowState.flowData) {
        updateStepVisualization();
      }
    }, 250);
  }
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeZoom();
    // Initialize flow view markers when flow view is first accessed
    setTimeout(initializeArrowMarkers, 100);
  });
} else {
  initializeZoom();
  setTimeout(initializeArrowMarkers, 100);
}

function updateZoom() {
  if (!canvas || !zoomLevel) return;
  canvas.style.transform = `scale(${currentZoom})`;
  canvas.style.transformOrigin = "top center";
  zoomLevel.textContent = Math.round(currentZoom * 100) + "%";
}

function zoomIn() {
  if (currentZoom < 2) {
    currentZoom += 0.1;
    updateZoom();
  }
}

function zoomOut() {
  if (currentZoom > 0.5) {
    currentZoom -= 0.1;
    updateZoom();
  }
}

function resetZoom() {
  currentZoom = 1;
  updateZoom();
  if (shell) shell.scrollTop = 0;
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

// Flow data definitions
const flowDefinitions = {
  http: {
    steps: [
      {
        title: "Client sends HTTP request",
        bullets: [
          "Browser initiates HTTP/HTTPS request to SAP system",
          "Request targets the load balancer's virtual IP address",
          "Request contains application path and session information",
        ],
        highlight: ["client"],
        arrows: [],
      },
      {
        title: "Load Balancer receives request",
        bullets: [
          "Load balancer performs health check on available ICM instances",
          "Selects healthy ICM based on load balancing algorithm (round-robin, least connections)",
          "Forwards request to selected ICM instance (PAS or AAS)",
        ],
        highlight: ["loadbalancer"],
        arrows: [{ from: "client", to: "loadbalancer", type: "http" }],
      },
      {
        title: "ICM receives and processes request",
        bullets: [
          "ICM (Internet Communication Manager) receives HTTP request on port 80XX/443XX",
          "ICM performs TLS termination if HTTPS",
          "ICM uses round-robin to select an available Java server process",
          "ICM forwards request to local Java Dispatcher",
        ],
        highlight: ["icm-pas"],
        arrows: [{ from: "loadbalancer", to: "icm-pas", type: "http" }],
      },
      {
        title: "Java Dispatcher routes to JVM",
        bullets: [
          "Java Dispatcher receives request from ICM",
          "Dispatcher checks available JVM server processes in this instance",
          "Selects JVM based on load and session affinity",
          "Forwards request to selected JVM server process",
        ],
        highlight: ["dispatcher-pas"],
        arrows: [{ from: "icm-pas", to: "dispatcher-pas", type: "http" }],
      },
      {
        title: "JVM executes application logic",
        bullets: [
          "JVM server process receives request via P4 protocol",
          "Servlet container processes HTTP request",
          "Application logic executes (EJB, Web Services, etc.)",
          "If database access required, JVM prepares SQL query",
        ],
        highlight: ["jvm-pas-0"],
        arrows: [{ from: "dispatcher-pas", to: "jvm-pas-0", type: "http" }],
      },
      {
        title: "Database query (if required)",
        bullets: [
          "JVM establishes JDBC connection to database",
          "SQL query executed on HANA database",
          "Database returns result set",
          "JVM processes database results",
        ],
        highlight: ["database"],
        arrows: [{ from: "jvm-pas-0", to: "database", type: "db" }],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: [
          "jvm-pas-0",
          "dispatcher-pas",
          "icm-pas",
          "loadbalancer",
          "client",
        ],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          {
            from: "jvm-pas-0",
            to: "dispatcher-pas",
            type: "http",
            reverse: true,
          },
          {
            from: "dispatcher-pas",
            to: "icm-pas",
            type: "http",
            reverse: true,
          },
          { from: "icm-pas", to: "loadbalancer", type: "http", reverse: true },
          { from: "loadbalancer", to: "client", type: "http", reverse: true },
        ],
      },
    ],
  },
  cluster: {
    steps: [
      {
        title: "Java instances register with Message Server",
        bullets: [
          "PAS and AAS instances start Java Dispatcher processes",
          "Each Dispatcher connects to Message Server (port 36XX)",
          "Dispatcher registers its instance ID, hostname, and available JVM nodes",
          "Message Server maintains cluster membership list",
        ],
        highlight: ["dispatcher-pas", "dispatcher-aas", "messageserver"],
        arrows: [
          { from: "dispatcher-pas", to: "messageserver", type: "cluster" },
          { from: "dispatcher-aas", to: "messageserver", type: "cluster" },
        ],
      },
      {
        title: "Message Server maintains cluster state",
        bullets: [
          "Message Server tracks all registered Java instances",
          "Maintains load information for each JVM node",
          "Provides cluster topology to all instances",
          "Enables service discovery and load balancing decisions",
        ],
        highlight: ["messageserver"],
        arrows: [],
      },
      {
        title: "JVM nodes communicate with Message Server",
        bullets: [
          "JVM server processes periodically update Message Server with load metrics",
          "Message Server distributes cluster state changes to all instances",
          "Enables cross-instance session affinity and load balancing",
        ],
        highlight: ["jvm-pas-0", "jvm-pas-1", "jvm-aas-0", "messageserver"],
        arrows: [
          { from: "jvm-pas-0", to: "messageserver", type: "cluster" },
          { from: "jvm-pas-1", to: "messageserver", type: "cluster" },
          { from: "jvm-aas-0", to: "messageserver", type: "cluster" },
        ],
      },
      {
        title: "Enqueue Server handles distributed locks",
        bullets: [
          "JVM nodes request locks from Enqueue Server (port 32XX)",
          "Enqueue Server maintains central lock table in shared memory",
          "Ensures data consistency across all cluster nodes",
          "Prevents concurrent modification conflicts",
        ],
        highlight: ["jvm-pas-0", "jvm-aas-0", "enqueueserver"],
        arrows: [
          { from: "jvm-pas-0", to: "enqueueserver", type: "cluster" },
          { from: "jvm-aas-0", to: "enqueueserver", type: "cluster" },
        ],
      },
      {
        title: "Cluster coordination summary",
        bullets: [
          "Central Services (Message Server + Enqueue Server) do not process user requests",
          "Central Services run only control-plane operations",
          "No ICM or JVMs run in Central Services instance",
          "All user traffic flows through PAS/AAS instances only",
        ],
        highlight: ["messageserver", "enqueueserver"],
        arrows: [],
      },
    ],
  },
  startup: {
    steps: [
      {
        title: "OS and sapstartsrv initialization",
        bullets: [
          "Operating system boots on each VM",
          "sapstartsrv daemon starts on each SAP instance host",
          "sapstartsrv reads instance profile configuration",
          "Prepares to start SAP processes",
        ],
        highlight: [],
        arrows: [],
      },
      {
        title: "Central Services startup",
        bullets: [
          "sapstartsrv starts Message Server process (msg_server)",
          "Message Server initializes and listens on port 36XX",
          "sapstartsrv starts Enqueue Server process (enserver)",
          "Enqueue Server initializes lock table and listens on port 32XX",
          "Central Services instance is now ready",
        ],
        highlight: ["messageserver", "enqueueserver"],
        arrows: [],
      },
      {
        title: "PAS instance startup",
        bullets: [
          "sapstartsrv starts ICM process on PAS",
          "ICM initializes and listens on ports 80XX/443XX",
          "sapstartsrv starts Java Dispatcher on PAS",
          "Dispatcher connects to Message Server and registers",
          "sapstartsrv starts JVM server processes (server0, server1, etc.)",
          "JVM nodes register with Dispatcher and Message Server",
        ],
        highlight: ["icm-pas", "dispatcher-pas", "jvm-pas-0", "jvm-pas-1"],
        arrows: [
          { from: "dispatcher-pas", to: "messageserver", type: "cluster" },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "cluster" },
          { from: "jvm-pas-1", to: "dispatcher-pas", type: "cluster" },
        ],
      },
      {
        title: "AAS instances join cluster",
        bullets: [
          "AAS instances start after PAS is running",
          "Each AAS starts its ICM, Dispatcher, and JVM processes",
          "AAS Dispatcher connects to existing Message Server",
          "AAS JVM nodes register with cluster",
          "Cluster now includes PAS + all AAS instances",
        ],
        highlight: ["icm-aas", "dispatcher-aas", "jvm-aas-0"],
        arrows: [
          { from: "dispatcher-aas", to: "messageserver", type: "cluster" },
          { from: "jvm-aas-0", to: "dispatcher-aas", type: "cluster" },
        ],
      },
      {
        title: "System ready",
        bullets: [
          "All instances registered with Message Server",
          "Load balancer can now route traffic to healthy instances",
          "System is ready to process user requests",
          "Database connections established from JVM nodes",
        ],
        highlight: ["messageserver", "dispatcher-pas", "dispatcher-aas"],
        arrows: [],
      },
    ],
  },
};

// Restart flow
function restartFlow() {
  stopFlow();
  flowState.currentStep = 0;
  flowState.flowData = flowDefinitions[currentFlow];
  if (flowState.flowData) {
    flowState.totalSteps = flowState.flowData.steps.length;
  }
  clearCanvas();
  updateExplanation();
  // Wait a bit for layout to stabilize before drawing arrows
  setTimeout(() => {
    updateStepVisualization();
  }, 100);
}

// Clear canvas
function clearCanvas() {
  const canvas = document.getElementById("flowCanvas");
  const arrows = canvas.querySelectorAll(".flow-arrow");
  arrows.forEach((arrow) => arrow.remove());
  const components = canvas.querySelectorAll(".flow-component");
  components.forEach((comp) => comp.classList.remove("active"));
}

// Update explanation panel
function updateExplanation() {
  if (!flowState.flowData) return;
  const step = flowState.flowData.steps[flowState.currentStep];
  if (!step) return;

  document.getElementById("stepTitle").textContent = step.title;
  const bulletsEl = document.getElementById("stepBullets");
  bulletsEl.innerHTML = "";
  step.bullets.forEach((bullet) => {
    const li = document.createElement("li");
    li.textContent = bullet;
    bulletsEl.appendChild(li);
  });
}

// Update step visualization
function updateStepVisualization() {
  if (!flowState.flowData) return;
  const step = flowState.flowData.steps[flowState.currentStep];
  if (!step) return;

  clearCanvas();

  // Highlight components immediately
  step.highlight.forEach((compId) => {
    const comp = document.getElementById(compId);
    if (comp) comp.classList.add("active");
  });

  // Small delay to ensure layout is stable before drawing arrows
  setTimeout(() => {
    // Draw arrows
    const canvas = document.getElementById("flowCanvas");
    if (canvas && step.arrows) {
      step.arrows.forEach((arrowDef) => {
        const arrow = createArrow(arrowDef);
        if (arrow) canvas.appendChild(arrow);
      });
    }
  }, 100);
}

// Initialize arrow markers
function initializeArrowMarkers() {
  const canvas = document.getElementById("flowCanvas");
  if (!canvas) return;

  let defsContainer = canvas.querySelector("svg.arrow-markers");
  if (!defsContainer) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("arrow-markers");
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.overflow = "hidden";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    ["http", "cluster", "db"].forEach((type) => {
      const marker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygon.setAttribute("points", "0 0, 10 3, 0 6");
      polygon.setAttribute("fill", getArrowColor(type));
      marker.appendChild(polygon);
      defs.appendChild(marker);
    });

    svg.appendChild(defs);
    canvas.appendChild(svg);
  }
}

// Get element position relative to canvas
function getElementPosition(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return null;

  const canvas = document.getElementById("flowCanvas");
  if (!canvas) return null;

  const elRect = el.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  return {
    x: elRect.left - canvasRect.left + elRect.width / 2,
    y: elRect.top - canvasRect.top + elRect.height / 2,
  };
}

// Create SVG arrow
function createArrow(arrowDef) {
  const fromPos = getElementPosition(arrowDef.from);
  const toPos = getElementPosition(arrowDef.to);
  if (!fromPos || !toPos) return null;

  const canvas = document.getElementById("flowCanvas");
  const canvasRect = canvas.getBoundingClientRect();
  const canvasWidth = canvasRect.width || canvas.offsetWidth;
  const canvasHeight = canvasRect.height || canvas.offsetHeight;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-arrow", arrowDef.type);
  if (flowState.isPlaying) svg.classList.add("animate");

  svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
  svg.setAttribute("width", canvasWidth);
  svg.setAttribute("height", canvasHeight);
  svg.style.position = "absolute";
  svg.style.left = "0";
  svg.style.top = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromPos.x);
  line.setAttribute("y1", fromPos.y);
  line.setAttribute("x2", toPos.x);
  line.setAttribute("y2", toPos.y);
  line.setAttribute("stroke", getArrowColor(arrowDef.type));
  line.setAttribute("stroke-width", "3");
  line.setAttribute("marker-end", `url(#arrowhead-${arrowDef.type})`);
  if (arrowDef.reverse) {
    line.setAttribute("stroke-dasharray", "5,5");
  }
  svg.appendChild(line);

  return svg;
}

function getArrowColor(type) {
  const colors = {
    http: "#22c55e",
    cluster: "#fbbf24",
    db: "#fb923c",
  };
  return colors[type] || "#60a5fa";
}

// Play/Pause
function togglePlayPause() {
  if (flowState.isPlaying) {
    stopFlow();
  } else {
    startFlow();
  }
}

function startFlow() {
  if (!flowState.flowData) return;
  flowState.isPlaying = true;
  document.getElementById("playPauseBtn").textContent = "⏸ Pause";

  flowState.animationInterval = setInterval(() => {
    if (flowState.currentStep < flowState.totalSteps - 1) {
      flowState.currentStep++;
      updateExplanation();
      updateStepVisualization();
    } else {
      stopFlow();
    }
  }, 3000);
}

function stopFlow() {
  flowState.isPlaying = false;
  if (flowState.animationInterval) {
    clearInterval(flowState.animationInterval);
    flowState.animationInterval = null;
  }
  document.getElementById("playPauseBtn").textContent = "▶ Play";
  const canvas = document.getElementById("flowCanvas");
  const arrows = canvas.querySelectorAll(".flow-arrow");
  arrows.forEach((arrow) => arrow.classList.remove("animate"));
}

// Step controls
function stepForward() {
  stopFlow();
  if (flowState.currentStep < flowState.totalSteps - 1) {
    flowState.currentStep++;
    updateExplanation();
    updateStepVisualization();
  }
}

function stepBackward() {
  stopFlow();
  if (flowState.currentStep > 0) {
    flowState.currentStep--;
    updateExplanation();
    updateStepVisualization();
  }
}
