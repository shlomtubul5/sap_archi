let currentZoom = 1;
let canvas, zoomLevel, shell;
let javaAppServerCount = 0;

function initializeZoom() {
  canvas = document.getElementById("canvas");
  zoomLevel = document.getElementById("zoomLevel");
  shell = document.getElementById("diagramShell");

  // Initialize VM width slider
  const vmWidthSlider = document.getElementById("vmWidthSlider");
  const vmWidthValue = document.getElementById("vmWidthValue");
  if (vmWidthSlider && vmWidthValue) {
    // Set initial slider value from CSS variable or default
    const rootStyles = getComputedStyle(document.documentElement);
    const baseWidthVar = rootStyles.getPropertyValue("--vm-base-width").trim();
    const initialWidth = baseWidthVar
      ? parseInt(baseWidthVar, 10)
      : parseInt(vmWidthSlider.value, 10) || 230;

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

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeZoom);
} else {
  initializeZoom();
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

  const templateVm = javaLevelContent.querySelector(".vm-container");
  if (!templateVm) return;

  // Clone the first Java app server VM
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
    instanceTitle.textContent = `SAP Instance: JC0${index}`;
  }
  const instanceId = newVm.querySelector(".instance-id");
  if (instanceId) {
    instanceId.textContent = `SID: J2E, Instance#: 0${index}`;
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
        "Central Services instance providing Message Server and Enqueue Server for cluster coordination.";
    } else if (info.title.includes("Java") || info.title.includes("JC")) {
      info.function =
        "Java application server instance running SAP NetWeaver AS Java with ICM, Dispatcher, and JVM nodes.";
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
