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
