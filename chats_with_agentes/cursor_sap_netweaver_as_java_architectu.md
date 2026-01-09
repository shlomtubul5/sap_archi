# SAP NetWeaver AS Java architecture flow view
_Exported on 1/9/2026 at 13:27:36 GMT+2 from Cursor (2.3.30)_

---

**User**

You are a senior SAP Basis architect and front-end visualization engineer.

Your task is to add a second, non-dynamic “Flow View” to an existing interactive HTML/CSS/JS diagram of SAP NetWeaver AS Java architecture.

This new view is not for scaling or editing.
It is a guided, animated architecture flow that visually explains how the system works at runtime, step by step, with short explanations.

Use ADM800 (Java Cluster Architecture) as the single source of truth.
Do not invent behavior or simplify incorrectly.

1. Purpose of the new view

Create an Architecture Flow View that:

Visually animates how requests and control flow through the system

Shows order, direction, and responsibility

Teaches how AS Java actually works, not just what exists

This view must complement the existing static/dynamic topology view.

2. Structure of the Flow View

The Flow View must contain two fixed areas:

A. Main animation canvas (center)

Shows a simplified but accurate architecture layout

Components are fixed in position

Flows are animated using:

Moving arrows / pulses

Highlighted components

Step-by-step transitions

B. Explanation panel (right side)

Updates per step

Contains:

Step title

2–4 short bullet points explaining what happens and why

No marketing language, only technical explanation

3. Flows to animate (mandatory)
Flow 1: User HTTP Request (Primary Flow)

Animate this exact sequence:

Client / Browser

External Load Balancer / SAP Web Dispatcher

ICM of PAS or AAS

Java Dispatcher

Java Server Process (JVM)

Database (if required)

Response flows back in reverse order

Key rules to visualize:

Load balancer distributes between ICMs

ICM distributes to local server processes

JVM executes application logic

JVM is stateless; persistent state goes to DB

Flow 2: Java Cluster Coordination

Animate background/control-plane communication:

Java instances (PAS + AAS) registering with:

Message Server

Message Server maintaining:

Instance list

Load information

Enqueue Server handling:

Cluster-wide locks

Synchronization

Important:

Central Services do not process user requests

No ICM or JVMs run in Central Services

Flow 3: System Startup (High-Level)

Animate startup in this order:

OS + sapstartsrv

Central Services (Message Server + Enqueue Server)

PAS startup

AAS instances joining the cluster

Highlight:

PAS is first application server

AAS join an existing cluster

Message Server enables discovery

4. Visual and animation rules

Use consistent colors:

Network flow (HTTP): one color

Control/cluster flow: different color

Database access: separate color

Animate direction clearly

Only one active flow at a time

Allow:

Play / Pause

Step forward / backward

Restart flow

5. Component accuracy rules (do not violate)

One Central Services instance only

One PAS

Zero or more AAS

Every PAS/AAS has:

One ICM

One Dispatcher

One or more JVM server processes

Central Services has:

Message Server

Enqueue Server

No ICM

No JVMs

6. Explanation text requirements

Each step explanation must answer:

What component is active

What decision or action it performs

Why it exists architecturally

Keep text concise but technically correct

Use SAP terminology (ICM, PAS, AAS, Message Server, Enqueue Server)

7. Do NOT

Do not reuse the scaling logic

Do not allow editing in this view

Do not oversimplify cluster behavior

Do not add ABAP components

Do not add “high-level” marketing explanations

---

**Cursor**


Reviewing the existing code to understand the structure before adding the Flow View.



Adding a Flow View with animated architecture flows. Creating the initial todo list, then implementing it.



Adding the Flow View. Starting with the view switcher and Flow View structure in HTML:


```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</h1>
      <p>
        Complete view showing the infrastructure stack: Physical/Cloud →
        VM/Container → OS → SAP Instance → Processes → JVM Runtime. Each layer
        clearly shows what runs on what.
      </p>
    </header>

    <main class="wrap">
      <section class="controls">
        <div class="view-switcher">
          <button class="view-btn active" id="topologyViewBtn" onclick="switchView('topology')">
            Topology View
          </button>
          <button class="view-btn" id="flowViewBtn" onclick="switchView('flow')">
            Flow View
          </button>
        </div>

        <div class="zoom-controls" id="topologyControls">
          <button class="zoom-btn" onclick="zoomOut()">−</button>
          <div class="zoom-level" id="zoomLevel">100%</div>
          <button class="zoom-btn" onclick="zoomIn()">+</button>
          <button class="zoom-btn" onclick="resetZoom()">Reset</button>
        </div>

        <div class="vm-width-controls">
          <label for="vmWidthSlider">VM Width</label>
          <input
            type="range"
            id="vmWidthSlider"
            min="180"
            max="360"
            step="10"
          />
          <span id="vmWidthValue"></span>
        </div>

        <div class="scaling-controls">
          <button class="zoom-btn" onclick="addJavaAppServer()">
            + Java App Server
          </button>
          <button class="zoom-btn" onclick="removeJavaAppServer()">
            − Java App Server
          </button>
        </div>

        <div class="legend">
          <div class="pill">
            <span class="dot" style="background: #64748b"></span>Physical/Cloud
            Infra
          </div>
          <div class="pill">
            <span class="dot" style="background: #8b5cf6"></span>VM/Host
          </div>
          <div class="pill">
            <span class="dot" style="background: #0ea5e9"></span>Operating
            System
          </div>
          <div class="pill">
            <span class="dot" style="background: #60a5fa"></span>SAP Instance
          </div>
          <div class="pill">
            <span class="dot" style="background: #34d399"></span>Process/JVM
          </div>
          <div class="pill">
            <span class="dot" style="background: #22c55e"></span>Network/Edge
          </div>
          <div class="pill">
            <span class="dot" style="background: #fbbf24"></span>Control Plane
          </div>
          <div class="pill">
            <span class="dot" style="background: #10b981"></span>Execution Plane
          </div>
        </div>
      </section>

      <section class="diagram-shell" id="diagramShell">
        <div class="canvas-wrapper">
          <div class="canvas" id="canvas">
            <!-- EXTERNAL / NETWORK LAYER -->
            <div class="external-layer">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(34, 197, 94, 0.2)"
                >
                  🌐
                </div>
                <h2 class="layer-title">External Network & Edge Layer</h2>
                <p class="layer-desc">
                  Load balancers, reverse proxies, firewalls (no VMs - typically
                  cloud services or dedicated appliances)
                </p>
              </div>
              <div class="grid grid-3">
                <div class="box">
                  <p class="box-title">DNS / Load Balancer</p>
                  <p class="box-desc">
                    Virtual IP, health checks, traffic distribution
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Reverse Proxy / WAF</p>
                  <p class="box-desc">
                    TLS termination, L7 routing, security filtering
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Firewall / Security Groups</p>
                  <p class="box-desc">Network policies, port filtering, VPN</p>
                </div>
              </div>
            </div>

            <div class="flow-arrow">↓</div>
            <div class="connection-note">
              Traffic flows to SAP infrastructure
            </div>

            <!-- PHYSICAL / CLOUD INFRASTRUCTURE -->
            <div class="infra-layer layer-physical">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(100, 116, 139, 0.2)"
                >
                  🏗️
                </div>
                <h2 class="layer-title">
                  Physical / Cloud Infrastructure Layer
                </h2>
                <p class="layer-desc">
                  Bare metal servers, hypervisors, or cloud provider
                  infrastructure (AWS/Azure/GCP/On-Prem)
                </p>
              </div>

              <!-- Level 1: Central Services -->
              <div class="vm-level">
                <div class="vm-level-title">Central Services</div>
                <div class="vm-level-content">
                  <!-- ASCS VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-ascs-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">4 vCPU | 16GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        Kernel, filesystem (/usr/sap/...), networking, user
                        management (sidadm, sapadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">⚙️</span>
                          <h5 class="instance-title">SAP Instance: ASCS00</h5>
                          <span class="badge badge-sap">Central Services</span>
                          <span class="badge-role">ASCS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 00</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div class="process-box msg">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Message Server (msg_server)
                            </p>
                            <p class="process-desc">
                              Cluster-wide control service that maintains the
                              server list and load-balancing information; no
                              user traffic or application logic.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 36XX (3600 for instance 00)</li>
                              <li>
                                <b>Protocol:</b> SAP Message Server protocol
                              </li>
                              <li>
                                <b>Connects to:</b> All Java application server
                                instances
                              </li>
                            </ul>
                          </div>

                          <div class="process-box enq">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Enqueue Server (enserver)
                            </p>
                            <p class="process-desc">
                              Central lock table for distributed locks; ensures
                              data consistency across the Java cluster.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 32XX (3200 for instance 00)</li>
                              <li>
                                <b>Lock Table:</b> Stored in shared memory
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 2: Java Application Servers -->
              <div class="vm-level">
                <div class="vm-level-title">Java Application Servers</div>
                <div class="vm-level-content">
                  <!-- Java App Server 1 VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-java-app-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">8 vCPU | 32GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        SAP JVM installed at
                        /usr/sap/J2E/SYS/exe/uc/linuxx86_64, instance
                        directories, j2eadm user
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">☕</span>
                          <h5 class="instance-title">
                            SAP Java Primary Application Server (PAS)
                          </h5>
                          <span class="badge badge-sap"
                            >SAP Java Engine (Java EE compatible runtime)</span
                          >
                          <span class="badge-role">PAS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 01</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div
                            class="process-box"
                            style="border-color: rgba(96, 165, 250, 0.5)"
                          >
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              sapstartsrv
                            </p>
                            <p class="process-desc">
                              Local control service that starts, stops, and
                              monitors ICM, Java Dispatcher, and JVM server
                              nodes.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Starts:</b> ICM, Java Dispatcher, JVM nodes
                                via jstart
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div class="plane-label">Execution Plane</div>
                        <div class="plane-group">
                          <div class="process-box icm">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              ICM (Internet Communication Manager)
                            </p>
                            <p class="process-desc">
                              Receives incoming HTTP(S) requests and distributes
                              them to Java server processes using a round-robin
                              algorithm; does not execute application logic.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Ports:</b> 80XX (8001) for HTTP, 443XX
                                (44301) for HTTPS
                              </li>
                              <li>
                                <b>Distributes to:</b> Java server processes of
                                the instance
                              </li>
                            </ul>
                          </div>

                          <div class="process-box dispatcher">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Java Dispatcher
                            </p>
                            <p class="process-desc">
                              Organizes the Java server processes of this
                              instance and participates in the Java cluster
                              together with Central Services and the database.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Port:</b> 5XX04 (P4 protocol for internal
                                Java instance communication)
                              </li>
                              <li>
                                <b>Connects to:</b> Message Server for cluster
                                information
                              </li>
                            </ul>
                          </div>

                          <div class="jvm-node-group">
                            <div class="jvm-node-group-header">
                              <p class="jvm-node-group-title">
                                Java Server Nodes (Cluster Members)
                              </p>
                              <p class="jvm-node-group-note">
                                Execute Java EE applications; multi-threaded and
                                part of the Java cluster.
                              </p>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 0 (server0)
                              </p>
                              <p class="process-desc">
                                JVM process running the SAP Java Engine and
                                application logic.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>Started by:</b> jstart (Java launcher)
                                </li>
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (configured in
                                  instance profile)
                                </li>
                                <li>
                                  <b>P4 Port:</b> 5XX04 (P4 protocol for Java
                                  Dispatcher communication)
                                </li>
                              </ul>

                              <div class="jvm-internals">
                                <p
                                  style="
                                    font-size: 11px;
                                    font-weight: 700;
                                    margin: 0 0 8px;
                                    color: var(--ink);
                                  "
                                >
                                  Inside JVM Process Memory:
                                </p>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Java EE / Jakarta EE Runtime
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Servlet Container - handles HTTP requests
                                      after dispatching
                                    </li>
                                    <li>
                                      EJB Container - business logic components
                                    </li>
                                    <li>
                                      Web Services Runtime - SOAP/REST endpoints
                                    </li>
                                    <li>
                                      JPA / Persistence - ORM for database
                                      access
                                    </li>
                                    <li>
                                      JMS Provider - asynchronous messaging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 SAP Java Engine Services
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Service Framework - lifecycle management
                                      of SAP services
                                    </li>
                                    <li>
                                      Deploy Service - handles SCA/SDA
                                      deployment
                                    </li>
                                    <li>
                                      Cluster Service - communicates with
                                      Message Server
                                    </li>
                                    <li>
                                      Locking Service - interacts with Enqueue
                                      Server
                                    </li>
                                    <li>
                                      Configuration Service - reads/writes
                                      config to DB
                                    </li>
                                    <li>
                                      Log & Trace Service - application logging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Deployed Applications
                                  </p>
                                  <ul class="jvm-items">
                                    <li>Web Dynpro Runtime - UI framework</li>
                                    <li>
                                      SAP NetWeaver Portal - portal server
                                      runtime
                                    </li>
                                    <li>
                                      Custom Java Applications - business apps
                                    </li>
                                    <li>
                                      SAP JCo - RFC connector for ABAP systems
                                    </li>
                                    <li>
                                      JDBC Drivers - database connectivity
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Thread Pools & Resources
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      HTTP Worker Threads - process servlet
                                      requests
                                    </li>
                                    <li>EJB Thread Pool - handle EJB calls</li>
                                    <li>
                                      Connection Pools - JDBC, JCo, JMS
                                      connections
                                    </li>
                                    <li>
                                      Session Manager - HTTP session cache
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 1 (server1)
                              </p>
                              <p class="process-desc">
                                Additional JVM process for horizontal scaling of
                                execution capacity.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (separate memory
                                  space)
                                </li>
                                <li><b>P4 Port:</b> 5XX05</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 3: Database -->
              <div class="vm-level">
                <div class="vm-level-title">Database</div>
                <div class="vm-level-content">
                  <!-- Database VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-hana-db-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs"
                        >16 vCPU | 128GB RAM | SLES 15</span
                      >
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">
                          Operating System: SUSE Linux Enterprise Server 15
                        </h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        HANA-optimized kernel, huge pages configured, HANA user
                        (j2eadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">🗄️</span>
                          <h5 class="instance-title">SAP HANA Database</h5>
                          <span class="badge badge-sap">Database Instance</span>
                          <span class="instance-id">SID: J2E, Tenant: J2E</span>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbindexserver
                          </p>
                          <p class="process-desc">
                            Main HANA database engine process serving SQL from
                            all JVM nodes.
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 3XX13 (30013 for instance 00)</li>
                            <li>
                              <b>Protocol:</b> SQL via JDBC from JVM nodes
                            </li>
                            <li>
                              <b>Stores:</b> Java schema - config tables,
                              deployment metadata, app data
                            </li>
                            <li>
                              <b>Tables:</b> BC_*, deployment units, cluster
                              state, etc.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: rgba(15, 23, 48, 0.9);
                          "
                        >
                          <p class="process-title">Database Usage Breakdown</p>
                          <ul class="process-details">
                            <li>
                              <b>Configuration & Cluster State:</b> instance
                              profiles, Java cluster membership, locks metadata.
                            </li>
                            <li>
                              <b>Deployment Metadata (SCA/SDA):</b> deployed
                              software components, versions, and deployment
                              descriptors.
                            </li>
                            <li>
                              <b>Application Data:</b> business application
                              tables accessed via JPA/JDBC from JVM nodes.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbdaemon
                          </p>
                          <p class="process-desc">
                            HANA lifecycle management daemon
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbcompileserver, hdbpreprocessor
                          </p>
                          <p class="process-desc">
                            SQL compilation and query processing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style="
                margin-top: 32px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                📊 Key Communication Flows:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>User Request Flow:</b> Browser → Load Balancer → ICM
                  (VM1/VM2) → Dispatcher → JVM Node → Database
                </li>
                <li>
                  <b>Cluster Communication:</b> All JVM Nodes ↔ Message Server
                  (ASCS VM) for server list and cluster info
                </li>
                <li>
                  <b>Locking:</b> All JVM Nodes ↔ Enqueue Server (ASCS VM) for
                  distributed locks
                </li>
                <li>
                  <b>Persistence:</b> All JVM Nodes → Database (JDBC
                  connections) for config, metadata, app data
                </li>
                <li>
                  <b>Session Replication:</b> JVM Nodes ↔ Database (if DB
                  session store) or JVM-to-JVM (if in-memory replication)
                </li>
                <li>
                  <b>Management:</b> Admin tools → sapstartsrv (each VM) →
                  Control processes via SOAP/HTTP
                </li>
              </ul>
            </div>

            <div
              style="
                margin-top: 20px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                🔧 Infrastructure Scaling Patterns:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>Scale-up:</b> Add more vCPU/RAM to existing VMs, increase
                  JVM heap sizes
                </li>
                <li>
                  <b>Scale-out (nodes):</b> Add more JVM nodes to existing VMs
                  (limited by VM resources)
                </li>
                <li>
                  <b>Scale-out (VMs):</b> Add more Java app server VMs
                  (sap-java-app-03, 04, etc.) - unlimited horizontal scaling
                </li>
                <li>
                  <b>High Availability:</b> Add standby ASCS VM, configure
                  database replication (HANA System Replication), use load
                  balancer health checks
                </li>
                <li>
                  <b>Disaster Recovery:</b> Replicate database to secondary
                  datacenter, keep standby VMs ready
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Component Info Modal -->
    <div id="componentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modalTitle"></h2>
          <button class="modal-close" id="modalClose">&times;</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
      </div>
    </div>

    <script src="script.js"></script>
  </body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</h1>
      <p>
        Complete view showing the infrastructure stack: Physical/Cloud →
        VM/Container → OS → SAP Instance → Processes → JVM Runtime. Each layer
        clearly shows what runs on what.
      </p>
    </header>

    <main class="wrap">
      <section class="controls">
        <div class="view-switcher">
          <button class="view-btn active" id="topologyViewBtn" onclick="switchView('topology')">
            Topology View
          </button>
          <button class="view-btn" id="flowViewBtn" onclick="switchView('flow')">
            Flow View
          </button>
        </div>

        <div class="zoom-controls" id="topologyControls">
          <button class="zoom-btn" onclick="zoomOut()">−</button>
          <div class="zoom-level" id="zoomLevel">100%</div>
          <button class="zoom-btn" onclick="zoomIn()">+</button>
          <button class="zoom-btn" onclick="resetZoom()">Reset</button>
        </div>

        <div class="vm-width-controls">
          <label for="vmWidthSlider">VM Width</label>
          <input
            type="range"
            id="vmWidthSlider"
            min="180"
            max="360"
            step="10"
          />
          <span id="vmWidthValue"></span>
        </div>

        <div class="scaling-controls" id="topologyControls2">
          <button class="zoom-btn" onclick="addJavaAppServer()">
            + Java App Server
          </button>
          <button class="zoom-btn" onclick="removeJavaAppServer()">
            − Java App Server
          </button>
        </div>

        <div class="flow-controls" id="flowControls" style="display: none;">
          <select id="flowSelector" class="flow-select">
            <option value="http">Flow 1: User HTTP Request</option>
            <option value="cluster">Flow 2: Java Cluster Coordination</option>
            <option value="startup">Flow 3: System Startup</option>
          </select>
          <button class="zoom-btn" id="playPauseBtn" onclick="togglePlayPause()">▶ Play</button>
          <button class="zoom-btn" onclick="stepBackward()">◀◀ Step Back</button>
          <button class="zoom-btn" onclick="stepForward()">Step Forward ▶▶</button>
          <button class="zoom-btn" onclick="restartFlow()">↻ Restart</button>
        </div>

        <div class="legend">
          <div class="pill">
            <span class="dot" style="background: #64748b"></span>Physical/Cloud
            Infra
          </div>
          <div class="pill">
            <span class="dot" style="background: #8b5cf6"></span>VM/Host
          </div>
          <div class="pill">
            <span class="dot" style="background: #0ea5e9"></span>Operating
            System
          </div>
          <div class="pill">
            <span class="dot" style="background: #60a5fa"></span>SAP Instance
          </div>
          <div class="pill">
            <span class="dot" style="background: #34d399"></span>Process/JVM
          </div>
          <div class="pill">
            <span class="dot" style="background: #22c55e"></span>Network/Edge
          </div>
          <div class="pill">
            <span class="dot" style="background: #fbbf24"></span>Control Plane
          </div>
          <div class="pill">
            <span class="dot" style="background: #10b981"></span>Execution Plane
          </div>
        </div>
      </section>

      <section class="diagram-shell" id="diagramShell">
        <div class="canvas-wrapper">
          <div class="canvas" id="canvas">
            <!-- EXTERNAL / NETWORK LAYER -->
            <div class="external-layer">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(34, 197, 94, 0.2)"
                >
                  🌐
                </div>
                <h2 class="layer-title">External Network & Edge Layer</h2>
                <p class="layer-desc">
                  Load balancers, reverse proxies, firewalls (no VMs - typically
                  cloud services or dedicated appliances)
                </p>
              </div>
              <div class="grid grid-3">
                <div class="box">
                  <p class="box-title">DNS / Load Balancer</p>
                  <p class="box-desc">
                    Virtual IP, health checks, traffic distribution
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Reverse Proxy / WAF</p>
                  <p class="box-desc">
                    TLS termination, L7 routing, security filtering
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Firewall / Security Groups</p>
                  <p class="box-desc">Network policies, port filtering, VPN</p>
                </div>
              </div>
            </div>

            <div class="flow-arrow">↓</div>
            <div class="connection-note">
              Traffic flows to SAP infrastructure
            </div>

            <!-- PHYSICAL / CLOUD INFRASTRUCTURE -->
            <div class="infra-layer layer-physical">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(100, 116, 139, 0.2)"
                >
                  🏗️
                </div>
                <h2 class="layer-title">
                  Physical / Cloud Infrastructure Layer
                </h2>
                <p class="layer-desc">
                  Bare metal servers, hypervisors, or cloud provider
                  infrastructure (AWS/Azure/GCP/On-Prem)
                </p>
              </div>

              <!-- Level 1: Central Services -->
              <div class="vm-level">
                <div class="vm-level-title">Central Services</div>
                <div class="vm-level-content">
                  <!-- ASCS VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-ascs-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">4 vCPU | 16GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        Kernel, filesystem (/usr/sap/...), networking, user
                        management (sidadm, sapadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">⚙️</span>
                          <h5 class="instance-title">SAP Instance: ASCS00</h5>
                          <span class="badge badge-sap">Central Services</span>
                          <span class="badge-role">ASCS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 00</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div class="process-box msg">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Message Server (msg_server)
                            </p>
                            <p class="process-desc">
                              Cluster-wide control service that maintains the
                              server list and load-balancing information; no
                              user traffic or application logic.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 36XX (3600 for instance 00)</li>
                              <li>
                                <b>Protocol:</b> SAP Message Server protocol
                              </li>
                              <li>
                                <b>Connects to:</b> All Java application server
                                instances
                              </li>
                            </ul>
                          </div>

                          <div class="process-box enq">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Enqueue Server (enserver)
                            </p>
                            <p class="process-desc">
                              Central lock table for distributed locks; ensures
                              data consistency across the Java cluster.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 32XX (3200 for instance 00)</li>
                              <li>
                                <b>Lock Table:</b> Stored in shared memory
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 2: Java Application Servers -->
              <div class="vm-level">
                <div class="vm-level-title">Java Application Servers</div>
                <div class="vm-level-content">
                  <!-- Java App Server 1 VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-java-app-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">8 vCPU | 32GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        SAP JVM installed at
                        /usr/sap/J2E/SYS/exe/uc/linuxx86_64, instance
                        directories, j2eadm user
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">☕</span>
                          <h5 class="instance-title">
                            SAP Java Primary Application Server (PAS)
                          </h5>
                          <span class="badge badge-sap"
                            >SAP Java Engine (Java EE compatible runtime)</span
                          >
                          <span class="badge-role">PAS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 01</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div
                            class="process-box"
                            style="border-color: rgba(96, 165, 250, 0.5)"
                          >
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              sapstartsrv
                            </p>
                            <p class="process-desc">
                              Local control service that starts, stops, and
                              monitors ICM, Java Dispatcher, and JVM server
                              nodes.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Starts:</b> ICM, Java Dispatcher, JVM nodes
                                via jstart
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div class="plane-label">Execution Plane</div>
                        <div class="plane-group">
                          <div class="process-box icm">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              ICM (Internet Communication Manager)
                            </p>
                            <p class="process-desc">
                              Receives incoming HTTP(S) requests and distributes
                              them to Java server processes using a round-robin
                              algorithm; does not execute application logic.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Ports:</b> 80XX (8001) for HTTP, 443XX
                                (44301) for HTTPS
                              </li>
                              <li>
                                <b>Distributes to:</b> Java server processes of
                                the instance
                              </li>
                            </ul>
                          </div>

                          <div class="process-box dispatcher">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Java Dispatcher
                            </p>
                            <p class="process-desc">
                              Organizes the Java server processes of this
                              instance and participates in the Java cluster
                              together with Central Services and the database.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Port:</b> 5XX04 (P4 protocol for internal
                                Java instance communication)
                              </li>
                              <li>
                                <b>Connects to:</b> Message Server for cluster
                                information
                              </li>
                            </ul>
                          </div>

                          <div class="jvm-node-group">
                            <div class="jvm-node-group-header">
                              <p class="jvm-node-group-title">
                                Java Server Nodes (Cluster Members)
                              </p>
                              <p class="jvm-node-group-note">
                                Execute Java EE applications; multi-threaded and
                                part of the Java cluster.
                              </p>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 0 (server0)
                              </p>
                              <p class="process-desc">
                                JVM process running the SAP Java Engine and
                                application logic.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>Started by:</b> jstart (Java launcher)
                                </li>
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (configured in
                                  instance profile)
                                </li>
                                <li>
                                  <b>P4 Port:</b> 5XX04 (P4 protocol for Java
                                  Dispatcher communication)
                                </li>
                              </ul>

                              <div class="jvm-internals">
                                <p
                                  style="
                                    font-size: 11px;
                                    font-weight: 700;
                                    margin: 0 0 8px;
                                    color: var(--ink);
                                  "
                                >
                                  Inside JVM Process Memory:
                                </p>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Java EE / Jakarta EE Runtime
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Servlet Container - handles HTTP requests
                                      after dispatching
                                    </li>
                                    <li>
                                      EJB Container - business logic components
                                    </li>
                                    <li>
                                      Web Services Runtime - SOAP/REST endpoints
                                    </li>
                                    <li>
                                      JPA / Persistence - ORM for database
                                      access
                                    </li>
                                    <li>
                                      JMS Provider - asynchronous messaging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 SAP Java Engine Services
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Service Framework - lifecycle management
                                      of SAP services
                                    </li>
                                    <li>
                                      Deploy Service - handles SCA/SDA
                                      deployment
                                    </li>
                                    <li>
                                      Cluster Service - communicates with
                                      Message Server
                                    </li>
                                    <li>
                                      Locking Service - interacts with Enqueue
                                      Server
                                    </li>
                                    <li>
                                      Configuration Service - reads/writes
                                      config to DB
                                    </li>
                                    <li>
                                      Log & Trace Service - application logging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Deployed Applications
                                  </p>
                                  <ul class="jvm-items">
                                    <li>Web Dynpro Runtime - UI framework</li>
                                    <li>
                                      SAP NetWeaver Portal - portal server
                                      runtime
                                    </li>
                                    <li>
                                      Custom Java Applications - business apps
                                    </li>
                                    <li>
                                      SAP JCo - RFC connector for ABAP systems
                                    </li>
                                    <li>
                                      JDBC Drivers - database connectivity
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Thread Pools & Resources
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      HTTP Worker Threads - process servlet
                                      requests
                                    </li>
                                    <li>EJB Thread Pool - handle EJB calls</li>
                                    <li>
                                      Connection Pools - JDBC, JCo, JMS
                                      connections
                                    </li>
                                    <li>
                                      Session Manager - HTTP session cache
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 1 (server1)
                              </p>
                              <p class="process-desc">
                                Additional JVM process for horizontal scaling of
                                execution capacity.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (separate memory
                                  space)
                                </li>
                                <li><b>P4 Port:</b> 5XX05</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 3: Database -->
              <div class="vm-level">
                <div class="vm-level-title">Database</div>
                <div class="vm-level-content">
                  <!-- Database VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-hana-db-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs"
                        >16 vCPU | 128GB RAM | SLES 15</span
                      >
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">
                          Operating System: SUSE Linux Enterprise Server 15
                        </h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        HANA-optimized kernel, huge pages configured, HANA user
                        (j2eadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">🗄️</span>
                          <h5 class="instance-title">SAP HANA Database</h5>
                          <span class="badge badge-sap">Database Instance</span>
                          <span class="instance-id">SID: J2E, Tenant: J2E</span>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbindexserver
                          </p>
                          <p class="process-desc">
                            Main HANA database engine process serving SQL from
                            all JVM nodes.
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 3XX13 (30013 for instance 00)</li>
                            <li>
                              <b>Protocol:</b> SQL via JDBC from JVM nodes
                            </li>
                            <li>
                              <b>Stores:</b> Java schema - config tables,
                              deployment metadata, app data
                            </li>
                            <li>
                              <b>Tables:</b> BC_*, deployment units, cluster
                              state, etc.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: rgba(15, 23, 48, 0.9);
                          "
                        >
                          <p class="process-title">Database Usage Breakdown</p>
                          <ul class="process-details">
                            <li>
                              <b>Configuration & Cluster State:</b> instance
                              profiles, Java cluster membership, locks metadata.
                            </li>
                            <li>
                              <b>Deployment Metadata (SCA/SDA):</b> deployed
                              software components, versions, and deployment
                              descriptors.
                            </li>
                            <li>
                              <b>Application Data:</b> business application
                              tables accessed via JPA/JDBC from JVM nodes.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbdaemon
                          </p>
                          <p class="process-desc">
                            HANA lifecycle management daemon
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbcompileserver, hdbpreprocessor
                          </p>
                          <p class="process-desc">
                            SQL compilation and query processing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style="
                margin-top: 32px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                📊 Key Communication Flows:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>User Request Flow:</b> Browser → Load Balancer → ICM
                  (VM1/VM2) → Dispatcher → JVM Node → Database
                </li>
                <li>
                  <b>Cluster Communication:</b> All JVM Nodes ↔ Message Server
                  (ASCS VM) for server list and cluster info
                </li>
                <li>
                  <b>Locking:</b> All JVM Nodes ↔ Enqueue Server (ASCS VM) for
                  distributed locks
                </li>
                <li>
                  <b>Persistence:</b> All JVM Nodes → Database (JDBC
                  connections) for config, metadata, app data
                </li>
                <li>
                  <b>Session Replication:</b> JVM Nodes ↔ Database (if DB
                  session store) or JVM-to-JVM (if in-memory replication)
                </li>
                <li>
                  <b>Management:</b> Admin tools → sapstartsrv (each VM) →
                  Control processes via SOAP/HTTP
                </li>
              </ul>
            </div>

            <div
              style="
                margin-top: 20px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                🔧 Infrastructure Scaling Patterns:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>Scale-up:</b> Add more vCPU/RAM to existing VMs, increase
                  JVM heap sizes
                </li>
                <li>
                  <b>Scale-out (nodes):</b> Add more JVM nodes to existing VMs
                  (limited by VM resources)
                </li>
                <li>
                  <b>Scale-out (VMs):</b> Add more Java app server VMs
                  (sap-java-app-03, 04, etc.) - unlimited horizontal scaling
                </li>
                <li>
                  <b>High Availability:</b> Add standby ASCS VM, configure
                  database replication (HANA System Replication), use load
                  balancer health checks
                </li>
                <li>
                  <b>Disaster Recovery:</b> Replicate database to secondary
                  datacenter, keep standby VMs ready
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Component Info Modal -->
    <div id="componentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modalTitle"></h2>
          <button class="modal-close" id="modalClose">&times;</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
      </div>
    </div>

    <script src="script.js"></script>
  </body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</h1>
      <p>
        Complete view showing the infrastructure stack: Physical/Cloud →
        VM/Container → OS → SAP Instance → Processes → JVM Runtime. Each layer
        clearly shows what runs on what.
      </p>
    </header>

    <main class="wrap">
      <section class="controls">
        <div class="view-switcher">
          <button class="view-btn active" id="topologyViewBtn" onclick="switchView('topology')">
            Topology View
          </button>
          <button class="view-btn" id="flowViewBtn" onclick="switchView('flow')">
            Flow View
          </button>
        </div>

        <div class="zoom-controls" id="topologyControls">
          <button class="zoom-btn" onclick="zoomOut()">−</button>
          <div class="zoom-level" id="zoomLevel">100%</div>
          <button class="zoom-btn" onclick="zoomIn()">+</button>
          <button class="zoom-btn" onclick="resetZoom()">Reset</button>
        </div>

        <div class="vm-width-controls">
          <label for="vmWidthSlider">VM Width</label>
          <input
            type="range"
            id="vmWidthSlider"
            min="180"
            max="360"
            step="10"
          />
          <span id="vmWidthValue"></span>
        </div>

        <div class="scaling-controls" id="topologyControls2">
          <button class="zoom-btn" onclick="addJavaAppServer()">
            + Java App Server
          </button>
          <button class="zoom-btn" onclick="removeJavaAppServer()">
            − Java App Server
          </button>
        </div>

        <div class="flow-controls" id="flowControls" style="display: none;">
          <select id="flowSelector" class="flow-select">
            <option value="http">Flow 1: User HTTP Request</option>
            <option value="cluster">Flow 2: Java Cluster Coordination</option>
            <option value="startup">Flow 3: System Startup</option>
          </select>
          <button class="zoom-btn" id="playPauseBtn" onclick="togglePlayPause()">▶ Play</button>
          <button class="zoom-btn" onclick="stepBackward()">◀◀ Step Back</button>
          <button class="zoom-btn" onclick="stepForward()">Step Forward ▶▶</button>
          <button class="zoom-btn" onclick="restartFlow()">↻ Restart</button>
        </div>

        <div class="legend">
          <div class="pill">
            <span class="dot" style="background: #64748b"></span>Physical/Cloud
            Infra
          </div>
          <div class="pill">
            <span class="dot" style="background: #8b5cf6"></span>VM/Host
          </div>
          <div class="pill">
            <span class="dot" style="background: #0ea5e9"></span>Operating
            System
          </div>
          <div class="pill">
            <span class="dot" style="background: #60a5fa"></span>SAP Instance
          </div>
          <div class="pill">
            <span class="dot" style="background: #34d399"></span>Process/JVM
          </div>
          <div class="pill">
            <span class="dot" style="background: #22c55e"></span>Network/Edge
          </div>
          <div class="pill">
            <span class="dot" style="background: #fbbf24"></span>Control Plane
          </div>
          <div class="pill">
            <span class="dot" style="background: #10b981"></span>Execution Plane
          </div>
        </div>
      </section>

      <!-- Topology View -->
      <section class="diagram-shell" id="topologyView">
        <div class="canvas-wrapper">
          <div class="canvas" id="canvas">
            <!-- EXTERNAL / NETWORK LAYER -->
            <div class="external-layer">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(34, 197, 94, 0.2)"
                >
                  🌐
                </div>
                <h2 class="layer-title">External Network & Edge Layer</h2>
                <p class="layer-desc">
                  Load balancers, reverse proxies, firewalls (no VMs - typically
                  cloud services or dedicated appliances)
                </p>
              </div>
              <div class="grid grid-3">
                <div class="box">
                  <p class="box-title">DNS / Load Balancer</p>
                  <p class="box-desc">
                    Virtual IP, health checks, traffic distribution
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Reverse Proxy / WAF</p>
                  <p class="box-desc">
                    TLS termination, L7 routing, security filtering
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Firewall / Security Groups</p>
                  <p class="box-desc">Network policies, port filtering, VPN</p>
                </div>
              </div>
            </div>

            <div class="flow-arrow">↓</div>
            <div class="connection-note">
              Traffic flows to SAP infrastructure
            </div>

            <!-- PHYSICAL / CLOUD INFRASTRUCTURE -->
            <div class="infra-layer layer-physical">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(100, 116, 139, 0.2)"
                >
                  🏗️
                </div>
                <h2 class="layer-title">
                  Physical / Cloud Infrastructure Layer
                </h2>
                <p class="layer-desc">
                  Bare metal servers, hypervisors, or cloud provider
                  infrastructure (AWS/Azure/GCP/On-Prem)
                </p>
              </div>

              <!-- Level 1: Central Services -->
              <div class="vm-level">
                <div class="vm-level-title">Central Services</div>
                <div class="vm-level-content">
                  <!-- ASCS VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-ascs-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">4 vCPU | 16GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        Kernel, filesystem (/usr/sap/...), networking, user
                        management (sidadm, sapadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">⚙️</span>
                          <h5 class="instance-title">SAP Instance: ASCS00</h5>
                          <span class="badge badge-sap">Central Services</span>
                          <span class="badge-role">ASCS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 00</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div class="process-box msg">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Message Server (msg_server)
                            </p>
                            <p class="process-desc">
                              Cluster-wide control service that maintains the
                              server list and load-balancing information; no
                              user traffic or application logic.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 36XX (3600 for instance 00)</li>
                              <li>
                                <b>Protocol:</b> SAP Message Server protocol
                              </li>
                              <li>
                                <b>Connects to:</b> All Java application server
                                instances
                              </li>
                            </ul>
                          </div>

                          <div class="process-box enq">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Enqueue Server (enserver)
                            </p>
                            <p class="process-desc">
                              Central lock table for distributed locks; ensures
                              data consistency across the Java cluster.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 32XX (3200 for instance 00)</li>
                              <li>
                                <b>Lock Table:</b> Stored in shared memory
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 2: Java Application Servers -->
              <div class="vm-level">
                <div class="vm-level-title">Java Application Servers</div>
                <div class="vm-level-content">
                  <!-- Java App Server 1 VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-java-app-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">8 vCPU | 32GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        SAP JVM installed at
                        /usr/sap/J2E/SYS/exe/uc/linuxx86_64, instance
                        directories, j2eadm user
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">☕</span>
                          <h5 class="instance-title">
                            SAP Java Primary Application Server (PAS)
                          </h5>
                          <span class="badge badge-sap"
                            >SAP Java Engine (Java EE compatible runtime)</span
                          >
                          <span class="badge-role">PAS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 01</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div
                            class="process-box"
                            style="border-color: rgba(96, 165, 250, 0.5)"
                          >
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              sapstartsrv
                            </p>
                            <p class="process-desc">
                              Local control service that starts, stops, and
                              monitors ICM, Java Dispatcher, and JVM server
                              nodes.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Starts:</b> ICM, Java Dispatcher, JVM nodes
                                via jstart
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div class="plane-label">Execution Plane</div>
                        <div class="plane-group">
                          <div class="process-box icm">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              ICM (Internet Communication Manager)
                            </p>
                            <p class="process-desc">
                              Receives incoming HTTP(S) requests and distributes
                              them to Java server processes using a round-robin
                              algorithm; does not execute application logic.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Ports:</b> 80XX (8001) for HTTP, 443XX
                                (44301) for HTTPS
                              </li>
                              <li>
                                <b>Distributes to:</b> Java server processes of
                                the instance
                              </li>
                            </ul>
                          </div>

                          <div class="process-box dispatcher">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Java Dispatcher
                            </p>
                            <p class="process-desc">
                              Organizes the Java server processes of this
                              instance and participates in the Java cluster
                              together with Central Services and the database.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Port:</b> 5XX04 (P4 protocol for internal
                                Java instance communication)
                              </li>
                              <li>
                                <b>Connects to:</b> Message Server for cluster
                                information
                              </li>
                            </ul>
                          </div>

                          <div class="jvm-node-group">
                            <div class="jvm-node-group-header">
                              <p class="jvm-node-group-title">
                                Java Server Nodes (Cluster Members)
                              </p>
                              <p class="jvm-node-group-note">
                                Execute Java EE applications; multi-threaded and
                                part of the Java cluster.
                              </p>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 0 (server0)
                              </p>
                              <p class="process-desc">
                                JVM process running the SAP Java Engine and
                                application logic.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>Started by:</b> jstart (Java launcher)
                                </li>
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (configured in
                                  instance profile)
                                </li>
                                <li>
                                  <b>P4 Port:</b> 5XX04 (P4 protocol for Java
                                  Dispatcher communication)
                                </li>
                              </ul>

                              <div class="jvm-internals">
                                <p
                                  style="
                                    font-size: 11px;
                                    font-weight: 700;
                                    margin: 0 0 8px;
                                    color: var(--ink);
                                  "
                                >
                                  Inside JVM Process Memory:
                                </p>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Java EE / Jakarta EE Runtime
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Servlet Container - handles HTTP requests
                                      after dispatching
                                    </li>
                                    <li>
                                      EJB Container - business logic components
                                    </li>
                                    <li>
                                      Web Services Runtime - SOAP/REST endpoints
                                    </li>
                                    <li>
                                      JPA / Persistence - ORM for database
                                      access
                                    </li>
                                    <li>
                                      JMS Provider - asynchronous messaging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 SAP Java Engine Services
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Service Framework - lifecycle management
                                      of SAP services
                                    </li>
                                    <li>
                                      Deploy Service - handles SCA/SDA
                                      deployment
                                    </li>
                                    <li>
                                      Cluster Service - communicates with
                                      Message Server
                                    </li>
                                    <li>
                                      Locking Service - interacts with Enqueue
                                      Server
                                    </li>
                                    <li>
                                      Configuration Service - reads/writes
                                      config to DB
                                    </li>
                                    <li>
                                      Log & Trace Service - application logging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Deployed Applications
                                  </p>
                                  <ul class="jvm-items">
                                    <li>Web Dynpro Runtime - UI framework</li>
                                    <li>
                                      SAP NetWeaver Portal - portal server
                                      runtime
                                    </li>
                                    <li>
                                      Custom Java Applications - business apps
                                    </li>
                                    <li>
                                      SAP JCo - RFC connector for ABAP systems
                                    </li>
                                    <li>
                                      JDBC Drivers - database connectivity
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Thread Pools & Resources
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      HTTP Worker Threads - process servlet
                                      requests
                                    </li>
                                    <li>EJB Thread Pool - handle EJB calls</li>
                                    <li>
                                      Connection Pools - JDBC, JCo, JMS
                                      connections
                                    </li>
                                    <li>
                                      Session Manager - HTTP session cache
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 1 (server1)
                              </p>
                              <p class="process-desc">
                                Additional JVM process for horizontal scaling of
                                execution capacity.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (separate memory
                                  space)
                                </li>
                                <li><b>P4 Port:</b> 5XX05</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 3: Database -->
              <div class="vm-level">
                <div class="vm-level-title">Database</div>
                <div class="vm-level-content">
                  <!-- Database VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-hana-db-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs"
                        >16 vCPU | 128GB RAM | SLES 15</span
                      >
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">
                          Operating System: SUSE Linux Enterprise Server 15
                        </h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        HANA-optimized kernel, huge pages configured, HANA user
                        (j2eadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">🗄️</span>
                          <h5 class="instance-title">SAP HANA Database</h5>
                          <span class="badge badge-sap">Database Instance</span>
                          <span class="instance-id">SID: J2E, Tenant: J2E</span>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbindexserver
                          </p>
                          <p class="process-desc">
                            Main HANA database engine process serving SQL from
                            all JVM nodes.
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 3XX13 (30013 for instance 00)</li>
                            <li>
                              <b>Protocol:</b> SQL via JDBC from JVM nodes
                            </li>
                            <li>
                              <b>Stores:</b> Java schema - config tables,
                              deployment metadata, app data
                            </li>
                            <li>
                              <b>Tables:</b> BC_*, deployment units, cluster
                              state, etc.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: rgba(15, 23, 48, 0.9);
                          "
                        >
                          <p class="process-title">Database Usage Breakdown</p>
                          <ul class="process-details">
                            <li>
                              <b>Configuration & Cluster State:</b> instance
                              profiles, Java cluster membership, locks metadata.
                            </li>
                            <li>
                              <b>Deployment Metadata (SCA/SDA):</b> deployed
                              software components, versions, and deployment
                              descriptors.
                            </li>
                            <li>
                              <b>Application Data:</b> business application
                              tables accessed via JPA/JDBC from JVM nodes.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbdaemon
                          </p>
                          <p class="process-desc">
                            HANA lifecycle management daemon
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbcompileserver, hdbpreprocessor
                          </p>
                          <p class="process-desc">
                            SQL compilation and query processing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style="
                margin-top: 32px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                📊 Key Communication Flows:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>User Request Flow:</b> Browser → Load Balancer → ICM
                  (VM1/VM2) → Dispatcher → JVM Node → Database
                </li>
                <li>
                  <b>Cluster Communication:</b> All JVM Nodes ↔ Message Server
                  (ASCS VM) for server list and cluster info
                </li>
                <li>
                  <b>Locking:</b> All JVM Nodes ↔ Enqueue Server (ASCS VM) for
                  distributed locks
                </li>
                <li>
                  <b>Persistence:</b> All JVM Nodes → Database (JDBC
                  connections) for config, metadata, app data
                </li>
                <li>
                  <b>Session Replication:</b> JVM Nodes ↔ Database (if DB
                  session store) or JVM-to-JVM (if in-memory replication)
                </li>
                <li>
                  <b>Management:</b> Admin tools → sapstartsrv (each VM) →
                  Control processes via SOAP/HTTP
                </li>
              </ul>
            </div>

            <div
              style="
                margin-top: 20px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                🔧 Infrastructure Scaling Patterns:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>Scale-up:</b> Add more vCPU/RAM to existing VMs, increase
                  JVM heap sizes
                </li>
                <li>
                  <b>Scale-out (nodes):</b> Add more JVM nodes to existing VMs
                  (limited by VM resources)
                </li>
                <li>
                  <b>Scale-out (VMs):</b> Add more Java app server VMs
                  (sap-java-app-03, 04, etc.) - unlimited horizontal scaling
                </li>
                <li>
                  <b>High Availability:</b> Add standby ASCS VM, configure
                  database replication (HANA System Replication), use load
                  balancer health checks
                </li>
                <li>
                  <b>Disaster Recovery:</b> Replicate database to secondary
                  datacenter, keep standby VMs ready
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Component Info Modal -->
    <div id="componentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modalTitle"></h2>
          <button class="modal-close" id="modalClose">&times;</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
      </div>
    </div>

    <script src="script.js"></script>
  </body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>SAP NetWeaver AS Java – Infrastructure & Software Hierarchy</h1>
      <p>
        Complete view showing the infrastructure stack: Physical/Cloud →
        VM/Container → OS → SAP Instance → Processes → JVM Runtime. Each layer
        clearly shows what runs on what.
      </p>
    </header>

    <main class="wrap">
      <section class="controls">
        <div class="view-switcher">
          <button class="view-btn active" id="topologyViewBtn" onclick="switchView('topology')">
            Topology View
          </button>
          <button class="view-btn" id="flowViewBtn" onclick="switchView('flow')">
            Flow View
          </button>
        </div>

        <div class="zoom-controls" id="topologyControls">
          <button class="zoom-btn" onclick="zoomOut()">−</button>
          <div class="zoom-level" id="zoomLevel">100%</div>
          <button class="zoom-btn" onclick="zoomIn()">+</button>
          <button class="zoom-btn" onclick="resetZoom()">Reset</button>
        </div>

        <div class="vm-width-controls">
          <label for="vmWidthSlider">VM Width</label>
          <input
            type="range"
            id="vmWidthSlider"
            min="180"
            max="360"
            step="10"
          />
          <span id="vmWidthValue"></span>
        </div>

        <div class="scaling-controls" id="topologyControls2">
          <button class="zoom-btn" onclick="addJavaAppServer()">
            + Java App Server
          </button>
          <button class="zoom-btn" onclick="removeJavaAppServer()">
            − Java App Server
          </button>
        </div>

        <div class="flow-controls" id="flowControls" style="display: none;">
          <select id="flowSelector" class="flow-select">
            <option value="http">Flow 1: User HTTP Request</option>
            <option value="cluster">Flow 2: Java Cluster Coordination</option>
            <option value="startup">Flow 3: System Startup</option>
          </select>
          <button class="zoom-btn" id="playPauseBtn" onclick="togglePlayPause()">▶ Play</button>
          <button class="zoom-btn" onclick="stepBackward()">◀◀ Step Back</button>
          <button class="zoom-btn" onclick="stepForward()">Step Forward ▶▶</button>
          <button class="zoom-btn" onclick="restartFlow()">↻ Restart</button>
        </div>

        <div class="legend">
          <div class="pill">
            <span class="dot" style="background: #64748b"></span>Physical/Cloud
            Infra
          </div>
          <div class="pill">
            <span class="dot" style="background: #8b5cf6"></span>VM/Host
          </div>
          <div class="pill">
            <span class="dot" style="background: #0ea5e9"></span>Operating
            System
          </div>
          <div class="pill">
            <span class="dot" style="background: #60a5fa"></span>SAP Instance
          </div>
          <div class="pill">
            <span class="dot" style="background: #34d399"></span>Process/JVM
          </div>
          <div class="pill">
            <span class="dot" style="background: #22c55e"></span>Network/Edge
          </div>
          <div class="pill">
            <span class="dot" style="background: #fbbf24"></span>Control Plane
          </div>
          <div class="pill">
            <span class="dot" style="background: #10b981"></span>Execution Plane
          </div>
        </div>
      </section>

      <!-- Topology View -->
      <section class="diagram-shell" id="topologyView">
        <div class="canvas-wrapper">
          <div class="canvas" id="canvas">
            <!-- EXTERNAL / NETWORK LAYER -->
            <div class="external-layer">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(34, 197, 94, 0.2)"
                >
                  🌐
                </div>
                <h2 class="layer-title">External Network & Edge Layer</h2>
                <p class="layer-desc">
                  Load balancers, reverse proxies, firewalls (no VMs - typically
                  cloud services or dedicated appliances)
                </p>
              </div>
              <div class="grid grid-3">
                <div class="box">
                  <p class="box-title">DNS / Load Balancer</p>
                  <p class="box-desc">
                    Virtual IP, health checks, traffic distribution
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Reverse Proxy / WAF</p>
                  <p class="box-desc">
                    TLS termination, L7 routing, security filtering
                  </p>
                </div>
                <div class="box">
                  <p class="box-title">Firewall / Security Groups</p>
                  <p class="box-desc">Network policies, port filtering, VPN</p>
                </div>
              </div>
            </div>

            <div class="flow-arrow">↓</div>
            <div class="connection-note">
              Traffic flows to SAP infrastructure
            </div>

            <!-- PHYSICAL / CLOUD INFRASTRUCTURE -->
            <div class="infra-layer layer-physical">
              <div class="layer-header">
                <div
                  class="layer-icon"
                  style="background: rgba(100, 116, 139, 0.2)"
                >
                  🏗️
                </div>
                <h2 class="layer-title">
                  Physical / Cloud Infrastructure Layer
                </h2>
                <p class="layer-desc">
                  Bare metal servers, hypervisors, or cloud provider
                  infrastructure (AWS/Azure/GCP/On-Prem)
                </p>
              </div>

              <!-- Level 1: Central Services -->
              <div class="vm-level">
                <div class="vm-level-title">Central Services</div>
                <div class="vm-level-content">
                  <!-- ASCS VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-ascs-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">4 vCPU | 16GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        Kernel, filesystem (/usr/sap/...), networking, user
                        management (sidadm, sapadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">⚙️</span>
                          <h5 class="instance-title">SAP Instance: ASCS00</h5>
                          <span class="badge badge-sap">Central Services</span>
                          <span class="badge-role">ASCS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 00</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div class="process-box msg">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Message Server (msg_server)
                            </p>
                            <p class="process-desc">
                              Cluster-wide control service that maintains the
                              server list and load-balancing information; no
                              user traffic or application logic.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 36XX (3600 for instance 00)</li>
                              <li>
                                <b>Protocol:</b> SAP Message Server protocol
                              </li>
                              <li>
                                <b>Connects to:</b> All Java application server
                                instances
                              </li>
                            </ul>
                          </div>

                          <div class="process-box enq">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Enqueue Server (enserver)
                            </p>
                            <p class="process-desc">
                              Central lock table for distributed locks; ensures
                              data consistency across the Java cluster.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 32XX (3200 for instance 00)</li>
                              <li>
                                <b>Lock Table:</b> Stored in shared memory
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 2: Java Application Servers -->
              <div class="vm-level">
                <div class="vm-level-title">Java Application Servers</div>
                <div class="vm-level-content">
                  <!-- Java App Server 1 VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-java-app-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs">8 vCPU | 32GB RAM | RHEL 8</span>
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">Operating System: RHEL 8.6</h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        SAP JVM installed at
                        /usr/sap/J2E/SYS/exe/uc/linuxx86_64, instance
                        directories, j2eadm user
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">☕</span>
                          <h5 class="instance-title">
                            SAP Java Primary Application Server (PAS)
                          </h5>
                          <span class="badge badge-sap"
                            >SAP Java Engine (Java EE compatible runtime)</span
                          >
                          <span class="badge-role">PAS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 01</span
                          >
                        </div>

                        <div class="plane-label">Control Plane</div>
                        <div class="plane-group">
                          <div
                            class="process-box"
                            style="border-color: rgba(96, 165, 250, 0.5)"
                          >
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              sapstartsrv
                            </p>
                            <p class="process-desc">
                              Local control service that starts, stops, and
                              monitors ICM, Java Dispatcher, and JVM server
                              nodes.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Starts:</b> ICM, Java Dispatcher, JVM nodes
                                via jstart
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div class="plane-label">Execution Plane</div>
                        <div class="plane-group">
                          <div class="process-box icm">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              ICM (Internet Communication Manager)
                            </p>
                            <p class="process-desc">
                              Receives incoming HTTP(S) requests and distributes
                              them to Java server processes using a round-robin
                              algorithm; does not execute application logic.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Ports:</b> 80XX (8001) for HTTP, 443XX
                                (44301) for HTTPS
                              </li>
                              <li>
                                <b>Distributes to:</b> Java server processes of
                                the instance
                              </li>
                            </ul>
                          </div>

                          <div class="process-box dispatcher">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Java Dispatcher
                            </p>
                            <p class="process-desc">
                              Organizes the Java server processes of this
                              instance and participates in the Java cluster
                              together with Central Services and the database.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Port:</b> 5XX04 (P4 protocol for internal
                                Java instance communication)
                              </li>
                              <li>
                                <b>Connects to:</b> Message Server for cluster
                                information
                              </li>
                            </ul>
                          </div>

                          <div class="jvm-node-group">
                            <div class="jvm-node-group-header">
                              <p class="jvm-node-group-title">
                                Java Server Nodes (Cluster Members)
                              </p>
                              <p class="jvm-node-group-note">
                                Execute Java EE applications; multi-threaded and
                                part of the Java cluster.
                              </p>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 0 (server0)
                              </p>
                              <p class="process-desc">
                                JVM process running the SAP Java Engine and
                                application logic.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>Started by:</b> jstart (Java launcher)
                                </li>
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (configured in
                                  instance profile)
                                </li>
                                <li>
                                  <b>P4 Port:</b> 5XX04 (P4 protocol for Java
                                  Dispatcher communication)
                                </li>
                              </ul>

                              <div class="jvm-internals">
                                <p
                                  style="
                                    font-size: 11px;
                                    font-weight: 700;
                                    margin: 0 0 8px;
                                    color: var(--ink);
                                  "
                                >
                                  Inside JVM Process Memory:
                                </p>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Java EE / Jakarta EE Runtime
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Servlet Container - handles HTTP requests
                                      after dispatching
                                    </li>
                                    <li>
                                      EJB Container - business logic components
                                    </li>
                                    <li>
                                      Web Services Runtime - SOAP/REST endpoints
                                    </li>
                                    <li>
                                      JPA / Persistence - ORM for database
                                      access
                                    </li>
                                    <li>
                                      JMS Provider - asynchronous messaging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 SAP Java Engine Services
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      Service Framework - lifecycle management
                                      of SAP services
                                    </li>
                                    <li>
                                      Deploy Service - handles SCA/SDA
                                      deployment
                                    </li>
                                    <li>
                                      Cluster Service - communicates with
                                      Message Server
                                    </li>
                                    <li>
                                      Locking Service - interacts with Enqueue
                                      Server
                                    </li>
                                    <li>
                                      Configuration Service - reads/writes
                                      config to DB
                                    </li>
                                    <li>
                                      Log & Trace Service - application logging
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Deployed Applications
                                  </p>
                                  <ul class="jvm-items">
                                    <li>Web Dynpro Runtime - UI framework</li>
                                    <li>
                                      SAP NetWeaver Portal - portal server
                                      runtime
                                    </li>
                                    <li>
                                      Custom Java Applications - business apps
                                    </li>
                                    <li>
                                      SAP JCo - RFC connector for ABAP systems
                                    </li>
                                    <li>
                                      JDBC Drivers - database connectivity
                                    </li>
                                  </ul>
                                </div>

                                <div class="jvm-section">
                                  <p class="jvm-section-title">
                                    🔹 Thread Pools & Resources
                                  </p>
                                  <ul class="jvm-items">
                                    <li>
                                      HTTP Worker Threads - process servlet
                                      requests
                                    </li>
                                    <li>EJB Thread Pool - handle EJB calls</li>
                                    <li>
                                      Connection Pools - JDBC, JCo, JMS
                                      connections
                                    </li>
                                    <li>
                                      Session Manager - HTTP session cache
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 1 (server1)
                              </p>
                              <p class="process-desc">
                                Additional JVM process for horizontal scaling of
                                execution capacity.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>JVM Heap:</b> -Xmx4096M (separate memory
                                  space)
                                </li>
                                <li><b>P4 Port:</b> 5XX05</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Level 3: Database -->
              <div class="vm-level">
                <div class="vm-level-title">Database</div>
                <div class="vm-level-content">
                  <!-- Database VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-hana-db-01</h3>
                      <span class="badge badge-vm">Virtual Machine</span>
                      <span class="vm-specs"
                        >16 vCPU | 128GB RAM | SLES 15</span
                      >
                    </div>

                    <div class="os-layer">
                      <div class="os-header">
                        <span style="font-size: 14px">🐧</span>
                        <h4 class="os-title">
                          Operating System: SUSE Linux Enterprise Server 15
                        </h4>
                        <span class="badge badge-os">Linux</span>
                      </div>
                      <p
                        style="
                          font-size: 11px;
                          color: var(--muted);
                          margin: 0 0 12px;
                        "
                      >
                        HANA-optimized kernel, huge pages configured, HANA user
                        (j2eadm)
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">🗄️</span>
                          <h5 class="instance-title">SAP HANA Database</h5>
                          <span class="badge badge-sap">Database Instance</span>
                          <span class="instance-id">SID: J2E, Tenant: J2E</span>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbindexserver
                          </p>
                          <p class="process-desc">
                            Main HANA database engine process serving SQL from
                            all JVM nodes.
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 3XX13 (30013 for instance 00)</li>
                            <li>
                              <b>Protocol:</b> SQL via JDBC from JVM nodes
                            </li>
                            <li>
                              <b>Stores:</b> Java schema - config tables,
                              deployment metadata, app data
                            </li>
                            <li>
                              <b>Tables:</b> BC_*, deployment units, cluster
                              state, etc.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: rgba(15, 23, 48, 0.9);
                          "
                        >
                          <p class="process-title">Database Usage Breakdown</p>
                          <ul class="process-details">
                            <li>
                              <b>Configuration & Cluster State:</b> instance
                              profiles, Java cluster membership, locks metadata.
                            </li>
                            <li>
                              <b>Deployment Metadata (SCA/SDA):</b> deployed
                              software components, versions, and deployment
                              descriptors.
                            </li>
                            <li>
                              <b>Application Data:</b> business application
                              tables accessed via JPA/JDBC from JVM nodes.
                            </li>
                          </ul>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbdaemon
                          </p>
                          <p class="process-desc">
                            HANA lifecycle management daemon
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="
                            border-color: rgba(251, 146, 60, 0.6);
                            background: linear-gradient(
                              135deg,
                              rgba(251, 146, 60, 0.12),
                              rgba(15, 23, 48, 0.85)
                            );
                          "
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            hdbcompileserver, hdbpreprocessor
                          </p>
                          <p class="process-desc">
                            SQL compilation and query processing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style="
                margin-top: 32px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                📊 Key Communication Flows:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>User Request Flow:</b> Browser → Load Balancer → ICM
                  (VM1/VM2) → Dispatcher → JVM Node → Database
                </li>
                <li>
                  <b>Cluster Communication:</b> All JVM Nodes ↔ Message Server
                  (ASCS VM) for server list and cluster info
                </li>
                <li>
                  <b>Locking:</b> All JVM Nodes ↔ Enqueue Server (ASCS VM) for
                  distributed locks
                </li>
                <li>
                  <b>Persistence:</b> All JVM Nodes → Database (JDBC
                  connections) for config, metadata, app data
                </li>
                <li>
                  <b>Session Replication:</b> JVM Nodes ↔ Database (if DB
                  session store) or JVM-to-JVM (if in-memory replication)
                </li>
                <li>
                  <b>Management:</b> Admin tools → sapstartsrv (each VM) →
                  Control processes via SOAP/HTTP
                </li>
              </ul>
            </div>

            <div
              style="
                margin-top: 20px;
                padding: 20px;
                background: rgba(16, 26, 51, 0.65);
                border: 1px solid var(--line);
                border-radius: 12px;
              "
            >
              <h3 style="margin: 0 0 14px; font-size: 14px">
                🔧 Infrastructure Scaling Patterns:
              </h3>
              <ul
                style="
                  margin: 0;
                  padding-left: 20px;
                  color: var(--muted);
                  font-size: 11.5px;
                  line-height: 1.6;
                "
              >
                <li>
                  <b>Scale-up:</b> Add more vCPU/RAM to existing VMs, increase
                  JVM heap sizes
                </li>
                <li>
                  <b>Scale-out (nodes):</b> Add more JVM nodes to existing VMs
                  (limited by VM resources)
                </li>
                <li>
                  <b>Scale-out (VMs):</b> Add more Java app server VMs
                  (sap-java-app-03, 04, etc.) - unlimited horizontal scaling
                </li>
                <li>
                  <b>High Availability:</b> Add standby ASCS VM, configure
                  database replication (HANA System Replication), use load
                  balancer health checks
                </li>
                <li>
                  <b>Disaster Recovery:</b> Replicate database to secondary
                  datacenter, keep standby VMs ready
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

      <!-- Flow View -->
      <section class="flow-view-shell" id="flowView" style="display: none;">
        <div class="flow-view-container">
          <div class="flow-canvas" id="flowCanvas">
            <!-- Components will be positioned here -->
            <div class="flow-component" id="client" data-component="client">
              <div class="flow-comp-box">
                <div class="flow-comp-title">Client / Browser</div>
              </div>
            </div>
            
            <div class="flow-component" id="loadbalancer" data-component="loadbalancer">
              <div class="flow-comp-box">
                <div class="flow-comp-title">Load Balancer / Web Dispatcher</div>
              </div>
            </div>

            <div class="flow-component" id="icm-pas" data-component="icm">
              <div class="flow-comp-box">
                <div class="flow-comp-title">ICM (PAS)</div>
                <div class="flow-comp-subtitle">Instance 01</div>
              </div>
            </div>

            <div class="flow-component" id="icm-aas" data-component="icm">
              <div class="flow-comp-box">
                <div class="flow-comp-title">ICM (AAS)</div>
                <div class="flow-comp-subtitle">Instance 02</div>
              </div>
            </div>

            <div class="flow-component" id="dispatcher-pas" data-component="dispatcher">
              <div class="flow-comp-box">
                <div class="flow-comp-title">Java Dispatcher (PAS)</div>
              </div>
            </div>

            <div class="flow-component" id="dispatcher-aas" data-component="dispatcher">
              <div class="flow-comp-box">
                <div class="flow-comp-title">Java Dispatcher (AAS)</div>
              </div>
            </div>

            <div class="flow-component" id="jvm-pas-0" data-component="jvm">
              <div class="flow-comp-box">
                <div class="flow-comp-title">JVM Server 0</div>
                <div class="flow-comp-subtitle">PAS</div>
              </div>
            </div>

            <div class="flow-component" id="jvm-pas-1" data-component="jvm">
              <div class="flow-comp-box">
                <div class="flow-comp-title">JVM Server 1</div>
                <div class="flow-comp-subtitle">PAS</div>
              </div>
            </div>

            <div class="flow-component" id="jvm-aas-0" data-component="jvm">
              <div class="flow-comp-box">
                <div class="flow-comp-title">JVM Server 0</div>
                <div class="flow-comp-subtitle">AAS</div>
              </div>
            </div>

            <div class="flow-component" id="database" data-component="database">
              <div class="flow-comp-box">
                <div class="flow-comp-title">Database</div>
                <div class="flow-comp-subtitle">HANA</div>
              </div>
            </div>

            <div class="flow-component" id="messageserver" data-component="messageserver">
              <div class="flow-comp-box">
                <div class="flow-comp-title">Message Server</div>
                <div class="flow-comp-subtitle">Central Services</div>
              </div>
            </div>

            <div class="flow-component" id="enqueueserver" data-component="enqueueserver">
              <div class="flow-comp-box">
                <div class="flow-comp-title">Enqueue Server</div>
                <div class="flow-comp-subtitle">Central Services</div>
              </div>
            </div>

            <!-- Animated arrows will be created dynamically -->
          </div>

          <div class="flow-explanation-panel" id="flowExplanationPanel">
            <div class="explanation-header">
              <h3>Architecture Flow Explanation</h3>
            </div>
            <div class="explanation-content" id="explanationContent">
              <div class="explanation-step">
                <h4 id="stepTitle">Select a flow to begin</h4>
                <ul id="stepBullets">
                  <li>Choose a flow from the dropdown above</li>
                  <li>Click Play to start the animation</li>
                  <li>Use Step Forward/Back to navigate manually</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Component Info Modal -->
    <div id="componentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modalTitle"></h2>
          <button class="modal-close" id="modalClose">&times;</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
      </div>
    </div>

    <script src="script.js"></script>
  </body>
</html>

```


Adding CSS for the Flow View:


```css
:root {
  --bg: #0b1020;
  --panel: #101a33;
  --panel2: #0f1730;
  --ink: #e8ecff;
  --muted: #b7c1ff;
  --line: rgba(232, 236, 255, 0.25);
  --shadow: 0 12px 28px rgba(0, 0, 0, 0.35);

  --c-client: #8b5cf6;
  --c-edge: #22c55e;
  --c-sap: #60a5fa;
  --c-java: #34d399;
  --c-db: #fb923c;
  --c-mgmt: #fbbf24;
  --c-sec: #f472b6;
  --c-infra: #64748b;
  --c-os: #0ea5e9;
  --c-vm: #8b5cf6;

  /* Base VM width used for layout; adjustable via UI */
  --vm-base-width: 360px;
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  background: radial-gradient(
      1200px 700px at 20% 10%,
      rgba(96, 165, 250, 0.18),
      transparent 55%
    ),
    radial-gradient(
      900px 600px at 80% 25%,
      rgba(139, 92, 246, 0.16),
      transparent 55%
    ),
    radial-gradient(
      1200px 800px at 55% 95%,
      rgba(251, 146, 60, 0.14),
      transparent 60%
    ),
    var(--bg);
  color: var(--ink);
}

header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(16, 26, 51, 0.85),
    rgba(16, 26, 51, 0.55)
  );
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

header h1 {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0.2px;
  font-weight: 650;
}

header p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
  max-width: 1600px;
}

.wrap {
  padding: 18px 22px 32px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(16, 26, 51, 0.65);
  border: 1px solid var(--line);
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  position: sticky;
  top: 76px;
  z-index: 90;
  backdrop-filter: blur(10px);
}

.vm-width-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--muted);
}

.vm-width-controls label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.vm-width-controls input[type="range"] {
  accent-color: #60a5fa;
}

.scaling-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.zoom-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.zoom-btn {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.zoom-btn:hover {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.zoom-level {
  color: var(--muted);
  font-size: 12px;
  min-width: 60px;
  text-align: center;
}

.legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.pill {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11.5px;
  color: var(--muted);
  white-space: nowrap;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08) inset;
}

.diagram-shell {
  background: rgba(16, 26, 51, 0.55);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
  /* Let the main page handle scrolling so we only have one scrollbar */
  overflow: visible;
  padding: 0;
  height: auto;
  min-height: 700px;
}

.canvas-wrapper {
  padding: 40px;
  display: inline-block;
  min-width: 100%;
  min-height: 100%;
}

.canvas {
  position: relative;
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 14px;
  background: linear-gradient(transparent 24px, rgba(232, 236, 255, 0.04) 25px),
    linear-gradient(90deg, transparent 24px, rgba(232, 236, 255, 0.04) 25px);
  background-size: 25px 25px;
  background-color: rgba(15, 23, 48, 0.55);
  outline: 1px solid rgba(232, 236, 255, 0.12);
  padding: 20px;
  transition: transform 0.3s ease;
}

/* Infrastructure layers */
.infra-layer {
  position: relative;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid;
  max-width: 100%;
  width: 100%;
}

/* VM levels (rows of VMs by category) */
.vm-level {
  margin-bottom: 10px;
}

.vm-level-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0 0 4px 2px;
}

.vm-level-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.layer-physical {
  border-color: rgba(100, 116, 139, 0.5);
  background: linear-gradient(
    135deg,
    rgba(100, 116, 139, 0.08),
    rgba(100, 116, 139, 0.03)
  );
}

.layer-vm {
  border-color: rgba(139, 92, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08),
    rgba(139, 92, 246, 0.03)
  );
}

.layer-os {
  border-color: rgba(14, 165, 233, 0.5);
  background: linear-gradient(
    135deg,
    rgba(14, 165, 233, 0.08),
    rgba(14, 165, 233, 0.03)
  );
}

.layer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.layer-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
}

.layer-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
}

.layer-desc {
  font-size: 11.5px;
  color: var(--muted);
  margin: 0;
  flex: 1;
}

/* VM/Host containers */
.vm-container {
  border-radius: 12px;
  border: 2px dashed rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.05);
  padding: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  /* Let flexbox control width inside vm-level-content, based on adjustable CSS variable */
  flex: 0 0 var(--vm-base-width);
}

.vm-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  padding: 4px 6px;
  background: rgba(139, 92, 246, 0.12);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  flex-wrap: wrap;
}

.vm-title {
  font-size: 11px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
}

.vm-specs {
  font-size: 8px;
  color: var(--muted);
  margin-left: auto;
  white-space: nowrap;
}

/* OS layer inside VM */
.os-layer {
  border-radius: 10px;
  border: 2px solid rgba(14, 165, 233, 0.4);
  background: rgba(14, 165, 233, 0.05);
  padding: 6px;
  margin-bottom: 6px;
  max-width: 100%;
  width: 100%;
}

.os-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  padding: 4px 5px;
  background: rgba(14, 165, 233, 0.12);
  border-radius: 6px;
  flex-wrap: wrap;
}

.os-title {
  font-size: 10.5px;
  font-weight: 600;
  margin: 0;
}

/* SAP Instance layer */
.sap-instance {
  border-radius: 10px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  background: rgba(96, 165, 250, 0.08);
  padding: 6px;
  margin-bottom: 6px;
  max-width: 100%;
  width: 100%;
}

.instance-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  padding: 4px 5px;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  flex-wrap: wrap;
}

.instance-title {
  font-size: 10.5px;
  font-weight: 700;
  margin: 0;
}

.instance-id {
  font-size: 8px;
  color: var(--muted);
  margin-left: 6px;
  white-space: nowrap;
}

/* Process boxes */
.process-box {
  border-radius: 8px;
  border: 1.5px solid;
  padding: 6px;
  margin-bottom: 4px;
  background: rgba(15, 23, 48, 0.85);
  max-width: 100%;
  width: 100%;
}

.process-box.icm {
  border-color: rgba(34, 197, 94, 0.6);
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.dispatcher {
  border-color: rgba(52, 211, 153, 0.6);
  background: linear-gradient(
    135deg,
    rgba(52, 211, 153, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.jvm {
  border-color: rgba(34, 211, 153, 0.6);
  background: linear-gradient(
    135deg,
    rgba(34, 211, 153, 0.15),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.msg {
  border-color: rgba(96, 165, 250, 0.6);
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.enq {
  border-color: rgba(96, 165, 250, 0.6);
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-title {
  font-size: 10px;
  font-weight: 700;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.process-desc {
  font-size: 9px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.4;
}

.process-details {
  font-size: 8px;
  color: var(--muted);
  padding-left: 12px;
  margin: 4px 0 0;
}

.process-details li {
  margin-bottom: 2px;
  line-height: 1.3;
}

/* Control vs Execution plane labels/groups */
.plane-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--muted);
  margin: 4px 0 4px;
}

.plane-group {
  margin-bottom: 6px;
}

.plane-group:last-child {
  margin-bottom: 0;
}

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

/* Group of JVM server nodes per VM */
.jvm-node-group {
  margin-top: 6px;
}

.jvm-node-group-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
}

.jvm-node-group-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.jvm-node-group-note {
  font-size: 9px;
  color: var(--muted);
  margin: 0;
  text-align: right;
}

.jvm-section {
  padding: 8px;
  margin-bottom: 8px;
  background: rgba(52, 211, 153, 0.08);
  border-radius: 4px;
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.jvm-section:last-child {
  margin-bottom: 0;
}

.jvm-section-title {
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--ink);
}

.jvm-items {
  font-size: 10px;
  color: var(--muted);
  margin: 0;
  padding-left: 14px;
  line-height: 1.4;
}

.jvm-items li {
  margin-bottom: 2px;
}

/* Grid layouts */
.grid {
  display: grid;
  gap: 10px;
  width: 100%;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 100%;
  width: 100%;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
  max-width: 100%;
  width: 100%;
}

/* Tags and badges */
.tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  border: 1px solid rgba(232, 236, 255, 0.22);
  background: rgba(232, 236, 255, 0.08);
  color: rgba(232, 236, 255, 0.92);
  margin-left: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 600;
  border: 1px solid;
}

.badge-infra {
  background: rgba(100, 116, 139, 0.15);
  border-color: rgba(100, 116, 139, 0.4);
  color: rgba(248, 250, 252, 0.95);
}

.badge-vm {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  color: rgba(233, 213, 255, 0.95);
}

.badge-os {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.4);
  color: rgba(224, 242, 254, 0.95);
}

.badge-sap {
  background: rgba(96, 165, 250, 0.15);
  border-color: rgba(96, 165, 250, 0.4);
  color: rgba(219, 234, 254, 0.95);
}

/* Small role badge inside SAP instance headers (ASCS / PAS / AAS) */
.badge-role {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  margin-left: 6px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid rgba(148, 163, 184, 0.7);
  color: rgba(226, 232, 240, 0.95);
  background: rgba(15, 23, 42, 0.7);
}

.badge-process {
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(52, 211, 153, 0.4);
  color: rgba(204, 251, 241, 0.95);
}

/* Connection indicators */
.flow-arrow {
  text-align: center;
  padding: 12px 0;
  color: var(--muted);
  font-size: 20px;
  font-weight: 300;
}

.connection-note {
  text-align: center;
  padding: 8px 16px;
  margin: 8px auto 20px;
  max-width: fit-content;
  border-radius: 999px;
  border: 1px solid rgba(232, 236, 255, 0.18);
  background: rgba(15, 23, 48, 0.85);
  color: var(--muted);
  font-size: 11px;
  box-shadow: var(--shadow);
}

/* Network/External layer */
.external-layer {
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 16px;
  border: 2px solid rgba(34, 197, 94, 0.5);
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.08),
    rgba(34, 197, 94, 0.03)
  );
  max-width: 100%;
  width: 100%;
}

.box {
  border-radius: 10px;
  border: 1.5px solid rgba(232, 236, 255, 0.25);
  background: rgba(15, 23, 48, 0.9);
  padding: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  max-width: 100%;
  width: 100%;
}

.box-title {
  font-size: 11.5px;
  font-weight: 700;
  margin: 0 0 4px;
}

.box-desc {
  font-size: 10px;
  color: var(--muted);
  margin: 0;
  line-height: 1.4;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--line);
  letter-spacing: 0.3px;
}

/* Clickable elements */
.box,
.vm-container,
.os-layer,
.sap-instance,
.process-box {
  cursor: pointer;
  transition: all 0.2s ease;
}

.box:hover,
.vm-container:hover,
.os-layer:hover,
.sap-instance:hover,
.process-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

/* Modal/Popup Styles */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(16, 26, 51, 0.8);
  border-radius: 16px 16px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(232, 236, 255, 0.1);
  color: var(--ink);
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
  color: var(--ink);
}

.modal-body h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-body p {
  margin: 0 0 16px;
  line-height: 1.6;
  color: var(--muted);
  font-size: 13px;
}

.modal-body ul {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.modal-body li {
  margin-bottom: 8px;
}

.modal-body .info-section {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(15, 23, 48, 0.6);
  border-radius: 8px;
  border: 1px solid var(--line);
}

.modal-body .info-section:last-child {
  margin-bottom: 0;
}

.modal-body strong {
  color: var(--ink);
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Flow View Styles */
.view-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-right: 16px;
}

.view-btn {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.view-btn:hover {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.view-btn.active {
  background: rgba(96, 165, 250, 0.3);
  border-color: rgba(96, 165, 250, 0.7);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.flow-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.flow-select {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  min-width: 220px;
}

.flow-view-shell {
  background: rgba(16, 26, 51, 0.55);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 20px;
  min-height: 700px;
}

.flow-view-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.flow-canvas {
  position: relative;
  background: linear-gradient(transparent 24px, rgba(232, 236, 255, 0.04) 25px),
    linear-gradient(90deg, transparent 24px, rgba(232, 236, 255, 0.04) 25px);
  background-size: 25px 25px;
  background-color: rgba(15, 23, 48, 0.55);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.flow-component {
  position: absolute;
  z-index: 10;
  transition: all 0.3s ease;
}

.flow-component.active {
  z-index: 20;
  transform: scale(1.05);
}

.flow-comp-box {
  background: rgba(15, 23, 48, 0.9);
  border: 2px solid rgba(96, 165, 250, 0.5);
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 140px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.flow-component.active .flow-comp-box {
  border-color: rgba(34, 197, 94, 0.8);
  background: rgba(34, 197, 94, 0.15);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

.flow-comp-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}

.flow-comp-subtitle {
  font-size: 10px;
  color: var(--muted);
}

/* Component-specific positioning */
#client {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

#loadbalancer {
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}

#icm-pas {
  top: 200px;
  left: 30%;
  transform: translateX(-50%);
}

#icm-aas {
  top: 200px;
  left: 70%;
  transform: translateX(-50%);
}

#dispatcher-pas {
  top: 300px;
  left: 30%;
  transform: translateX(-50%);
}

#dispatcher-aas {
  top: 300px;
  left: 70%;
  transform: translateX(-50%);
}

#jvm-pas-0 {
  top: 400px;
  left: 20%;
  transform: translateX(-50%);
}

#jvm-pas-1 {
  top: 400px;
  left: 30%;
  transform: translateX(-50%);
}

#jvm-aas-0 {
  top: 400px;
  left: 70%;
  transform: translateX(-50%);
}

#database {
  top: 500px;
  left: 50%;
  transform: translateX(-50%);
}

#messageserver {
  top: 200px;
  left: 10%;
  transform: translateX(-50%);
}

#enqueueserver {
  top: 280px;
  left: 10%;
  transform: translateX(-50%);
}

/* Animated arrows */
.flow-arrow {
  position: absolute;
  z-index: 5;
  pointer-events: none;
}

.flow-arrow svg {
  overflow: visible;
}

.flow-arrow.animate {
  animation: pulseArrow 1.5s ease-in-out infinite;
}

@keyframes pulseArrow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Explanation Panel */
.flow-explanation-panel {
  background: rgba(16, 26, 51, 0.85);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  max-height: 100%;
}

.explanation-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.explanation-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}

.explanation-content {
  color: var(--muted);
}

.explanation-step h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.explanation-step ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
}

.explanation-step li {
  margin-bottom: 8px;
}

/* Color coding for different flow types */
.flow-arrow.http {
  stroke: #22c55e;
  fill: #22c55e;
}

.flow-arrow.cluster {
  stroke: #fbbf24;
  fill: #fbbf24;
}

.flow-arrow.db {
  stroke: #fb923c;
  fill: #fb923c;
}

@media print {
  header,
  .controls {
    display: none;
  }
  body {
    background: white;
    color: black;
  }
  .diagram-shell {
    border: none;
    box-shadow: none;
    height: auto;
  }
  .modal {
    display: none !important;
  }
  .flow-view-shell {
    display: none !important;
  }
}

```


Adding JavaScript for the Flow View animations and controls:


```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
  flowState.totalSteps = flowState.flowData.steps.length;
  clearCanvas();
  updateExplanation();
  updateStepVisualization();
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

  // Highlight components
  step.highlight.forEach((compId) => {
    const comp = document.getElementById(compId);
    if (comp) comp.classList.add("active");
  });

  // Draw arrows
  const canvas = document.getElementById("flowCanvas");
  step.arrows.forEach((arrowDef) => {
    const arrow = createArrow(arrowDef);
    if (arrow) canvas.appendChild(arrow);
  });
}

// Create SVG arrow
function createArrow(arrowDef) {
  const fromEl = document.getElementById(arrowDef.from);
  const toEl = document.getElementById(arrowDef.to);
  if (!fromEl || !toEl) return null;

  const fromRect = fromEl.getBoundingClientRect();
  const canvasRect = document.getElementById("flowCanvas").getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
  const fromY = fromRect.top - canvasRect.top + fromRect.height / 2;
  const toX = toRect.left - canvasRect.left + toRect.width / 2;
  const toY = toRect.top - canvasRect.top + toRect.height / 2;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-arrow", arrowDef.type);
  if (flowState.isPlaying) svg.classList.add("animate");

  svg.style.position = "absolute";
  svg.style.left = "0";
  svg.style.top = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromX);
  line.setAttribute("y1", fromY);
  line.setAttribute("x2", toX);
  line.setAttribute("y2", toY);
  line.setAttribute("stroke", getArrowColor(arrowDef.type));
  line.setAttribute("stroke-width", "3");
  line.setAttribute("marker-end", `url(#arrowhead-${arrowDef.type})`);
  if (arrowDef.reverse) {
    line.setAttribute("marker-start", `url(#arrowhead-${arrowDef.type})`);
  }
  svg.appendChild(line);

  // Add arrowhead marker if not exists
  if (!document.getElementById(`arrowhead-${arrowDef.type}`)) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", `arrowhead-${arrowDef.type}`);
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", "0 0, 10 3, 0 6");
    polygon.setAttribute("fill", getArrowColor(arrowDef.type));
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
  }

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

```


Fixing arrow rendering and initialization:


```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
  flowState.totalSteps = flowState.flowData.steps.length;
  clearCanvas();
  updateExplanation();
  updateStepVisualization();
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

  // Highlight components
  step.highlight.forEach((compId) => {
    const comp = document.getElementById(compId);
    if (comp) comp.classList.add("active");
  });

  // Draw arrows
  const canvas = document.getElementById("flowCanvas");
  step.arrows.forEach((arrowDef) => {
    const arrow = createArrow(arrowDef);
    if (arrow) canvas.appendChild(arrow);
  });
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", "0 0, 10 3, 0 6");
      polygon.setAttribute("fill", getArrowColor(type));
      marker.appendChild(polygon);
      defs.appendChild(marker);
    });
    
    svg.appendChild(defs);
    canvas.appendChild(svg);
  }
}

// Create SVG arrow
function createArrow(arrowDef) {
  const fromEl = document.getElementById(arrowDef.from);
  const toEl = document.getElementById(arrowDef.to);
  if (!fromEl || !toEl) return null;

  const fromRect = fromEl.getBoundingClientRect();
  const canvasRect = document.getElementById("flowCanvas").getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
  const fromY = fromRect.top - canvasRect.top + fromRect.height / 2;
  const toX = toRect.left - canvasRect.left + toRect.width / 2;
  const toY = toRect.top - canvasRect.top + toRect.height / 2;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-arrow", arrowDef.type);
  if (flowState.isPlaying) svg.classList.add("animate");

  svg.style.position = "absolute";
  svg.style.left = "0";
  svg.style.top = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromX);
  line.setAttribute("y1", fromY);
  line.setAttribute("x2", toX);
  line.setAttribute("y2", toY);
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
```

```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
  flowState.totalSteps = flowState.flowData.steps.length;
  clearCanvas();
  updateExplanation();
  updateStepVisualization();
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

  // Highlight components
  step.highlight.forEach((compId) => {
    const comp = document.getElementById(compId);
    if (comp) comp.classList.add("active");
  });

  // Draw arrows
  const canvas = document.getElementById("flowCanvas");
  step.arrows.forEach((arrowDef) => {
    const arrow = createArrow(arrowDef);
    if (arrow) canvas.appendChild(arrow);
  });
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", "0 0, 10 3, 0 6");
      polygon.setAttribute("fill", getArrowColor(type));
      marker.appendChild(polygon);
      defs.appendChild(marker);
    });
    
    svg.appendChild(defs);
    canvas.appendChild(svg);
  }
}

// Create SVG arrow
function createArrow(arrowDef) {
  const fromEl = document.getElementById(arrowDef.from);
  const toEl = document.getElementById(arrowDef.to);
  if (!fromEl || !toEl) return null;

  const fromRect = fromEl.getBoundingClientRect();
  const canvasRect = document.getElementById("flowCanvas").getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
  const fromY = fromRect.top - canvasRect.top + fromRect.height / 2;
  const toX = toRect.left - canvasRect.left + toRect.width / 2;
  const toY = toRect.top - canvasRect.top + toRect.height / 2;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-arrow", arrowDef.type);
  if (flowState.isPlaying) svg.classList.add("animate");

  svg.style.position = "absolute";
  svg.style.left = "0";
  svg.style.top = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromX);
  line.setAttribute("y1", fromY);
  line.setAttribute("x2", toX);
  line.setAttribute("y2", toY);
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
```

```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
  flowState.totalSteps = flowState.flowData.steps.length;
  clearCanvas();
  updateExplanation();
  updateStepVisualization();
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

  // Highlight components
  step.highlight.forEach((compId) => {
    const comp = document.getElementById(compId);
    if (comp) comp.classList.add("active");
  });

  // Draw arrows
  const canvas = document.getElementById("flowCanvas");
  step.arrows.forEach((arrowDef) => {
    const arrow = createArrow(arrowDef);
    if (arrow) canvas.appendChild(arrow);
  });
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", "0 0, 10 3, 0 6");
      polygon.setAttribute("fill", getArrowColor(type));
      marker.appendChild(polygon);
      defs.appendChild(marker);
    });
    
    svg.appendChild(defs);
    canvas.appendChild(svg);
  }
}

// Create SVG arrow
function createArrow(arrowDef) {
  const fromEl = document.getElementById(arrowDef.from);
  const toEl = document.getElementById(arrowDef.to);
  if (!fromEl || !toEl) return null;

  const fromRect = fromEl.getBoundingClientRect();
  const canvasRect = document.getElementById("flowCanvas").getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
  const fromY = fromRect.top - canvasRect.top + fromRect.height / 2;
  const toX = toRect.left - canvasRect.left + toRect.width / 2;
  const toY = toRect.top - canvasRect.top + toRect.height / 2;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-arrow", arrowDef.type);
  if (flowState.isPlaying) svg.classList.add("animate");

  svg.style.position = "absolute";
  svg.style.left = "0";
  svg.style.top = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromX);
  line.setAttribute("y1", fromY);
  line.setAttribute("x2", toX);
  line.setAttribute("y2", toY);
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
```


Improving arrow positioning to use relative coordinates:


```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
  flowState.totalSteps = flowState.flowData.steps.length;
  clearCanvas();
  updateExplanation();
  updateStepVisualization();
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

  // Highlight components
  step.highlight.forEach((compId) => {
    const comp = document.getElementById(compId);
    if (comp) comp.classList.add("active");
  });

  // Draw arrows
  const canvas = document.getElementById("flowCanvas");
  step.arrows.forEach((arrowDef) => {
    const arrow = createArrow(arrowDef);
    if (arrow) canvas.appendChild(arrow);
  });
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
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

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-arrow", arrowDef.type);
  if (flowState.isPlaying) svg.classList.add("animate");

  const canvas = document.getElementById("flowCanvas");
  const canvasRect = canvas.getBoundingClientRect();
  
  svg.setAttribute("viewBox", `0 0 ${canvasRect.width} ${canvasRect.height}`);
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
```

```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
  flowState.totalSteps = flowState.flowData.steps.length;
  clearCanvas();
  updateExplanation();
  updateStepVisualization();
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

  // Small delay to ensure layout is stable
  setTimeout(() => {
    // Highlight components
    step.highlight.forEach((compId) => {
      const comp = document.getElementById(compId);
      if (comp) comp.classList.add("active");
    });

    // Draw arrows
    const canvas = document.getElementById("flowCanvas");
    step.arrows.forEach((arrowDef) => {
      const arrow = createArrow(arrowDef);
      if (arrow) canvas.appendChild(arrow);
    });
  }, 50);
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
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

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-arrow", arrowDef.type);
  if (flowState.isPlaying) svg.classList.add("animate");

  const canvas = document.getElementById("flowCanvas");
  const canvasRect = canvas.getBoundingClientRect();
  
  svg.setAttribute("viewBox", `0 0 ${canvasRect.width} ${canvasRect.height}`);
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
```


Checking for linting errors and fixing any issues:



Improving Flow View responsiveness and fixing a few issues:


```css
:root {
  --bg: #0b1020;
  --panel: #101a33;
  --panel2: #0f1730;
  --ink: #e8ecff;
  --muted: #b7c1ff;
  --line: rgba(232, 236, 255, 0.25);
  --shadow: 0 12px 28px rgba(0, 0, 0, 0.35);

  --c-client: #8b5cf6;
  --c-edge: #22c55e;
  --c-sap: #60a5fa;
  --c-java: #34d399;
  --c-db: #fb923c;
  --c-mgmt: #fbbf24;
  --c-sec: #f472b6;
  --c-infra: #64748b;
  --c-os: #0ea5e9;
  --c-vm: #8b5cf6;

  /* Base VM width used for layout; adjustable via UI */
  --vm-base-width: 360px;
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  background: radial-gradient(
      1200px 700px at 20% 10%,
      rgba(96, 165, 250, 0.18),
      transparent 55%
    ),
    radial-gradient(
      900px 600px at 80% 25%,
      rgba(139, 92, 246, 0.16),
      transparent 55%
    ),
    radial-gradient(
      1200px 800px at 55% 95%,
      rgba(251, 146, 60, 0.14),
      transparent 60%
    ),
    var(--bg);
  color: var(--ink);
}

header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(16, 26, 51, 0.85),
    rgba(16, 26, 51, 0.55)
  );
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

header h1 {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0.2px;
  font-weight: 650;
}

header p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
  max-width: 1600px;
}

.wrap {
  padding: 18px 22px 32px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(16, 26, 51, 0.65);
  border: 1px solid var(--line);
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  position: sticky;
  top: 76px;
  z-index: 90;
  backdrop-filter: blur(10px);
}

.vm-width-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--muted);
}

.vm-width-controls label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.vm-width-controls input[type="range"] {
  accent-color: #60a5fa;
}

.scaling-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.zoom-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.zoom-btn {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.zoom-btn:hover {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.zoom-level {
  color: var(--muted);
  font-size: 12px;
  min-width: 60px;
  text-align: center;
}

.legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.pill {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11.5px;
  color: var(--muted);
  white-space: nowrap;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08) inset;
}

.diagram-shell {
  background: rgba(16, 26, 51, 0.55);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
  /* Let the main page handle scrolling so we only have one scrollbar */
  overflow: visible;
  padding: 0;
  height: auto;
  min-height: 700px;
}

.canvas-wrapper {
  padding: 40px;
  display: inline-block;
  min-width: 100%;
  min-height: 100%;
}

.canvas {
  position: relative;
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 14px;
  background: linear-gradient(transparent 24px, rgba(232, 236, 255, 0.04) 25px),
    linear-gradient(90deg, transparent 24px, rgba(232, 236, 255, 0.04) 25px);
  background-size: 25px 25px;
  background-color: rgba(15, 23, 48, 0.55);
  outline: 1px solid rgba(232, 236, 255, 0.12);
  padding: 20px;
  transition: transform 0.3s ease;
}

/* Infrastructure layers */
.infra-layer {
  position: relative;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid;
  max-width: 100%;
  width: 100%;
}

/* VM levels (rows of VMs by category) */
.vm-level {
  margin-bottom: 10px;
}

.vm-level-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0 0 4px 2px;
}

.vm-level-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.layer-physical {
  border-color: rgba(100, 116, 139, 0.5);
  background: linear-gradient(
    135deg,
    rgba(100, 116, 139, 0.08),
    rgba(100, 116, 139, 0.03)
  );
}

.layer-vm {
  border-color: rgba(139, 92, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08),
    rgba(139, 92, 246, 0.03)
  );
}

.layer-os {
  border-color: rgba(14, 165, 233, 0.5);
  background: linear-gradient(
    135deg,
    rgba(14, 165, 233, 0.08),
    rgba(14, 165, 233, 0.03)
  );
}

.layer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.layer-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
}

.layer-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
}

.layer-desc {
  font-size: 11.5px;
  color: var(--muted);
  margin: 0;
  flex: 1;
}

/* VM/Host containers */
.vm-container {
  border-radius: 12px;
  border: 2px dashed rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.05);
  padding: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  /* Let flexbox control width inside vm-level-content, based on adjustable CSS variable */
  flex: 0 0 var(--vm-base-width);
}

.vm-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  padding: 4px 6px;
  background: rgba(139, 92, 246, 0.12);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  flex-wrap: wrap;
}

.vm-title {
  font-size: 11px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
}

.vm-specs {
  font-size: 8px;
  color: var(--muted);
  margin-left: auto;
  white-space: nowrap;
}

/* OS layer inside VM */
.os-layer {
  border-radius: 10px;
  border: 2px solid rgba(14, 165, 233, 0.4);
  background: rgba(14, 165, 233, 0.05);
  padding: 6px;
  margin-bottom: 6px;
  max-width: 100%;
  width: 100%;
}

.os-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  padding: 4px 5px;
  background: rgba(14, 165, 233, 0.12);
  border-radius: 6px;
  flex-wrap: wrap;
}

.os-title {
  font-size: 10.5px;
  font-weight: 600;
  margin: 0;
}

/* SAP Instance layer */
.sap-instance {
  border-radius: 10px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  background: rgba(96, 165, 250, 0.08);
  padding: 6px;
  margin-bottom: 6px;
  max-width: 100%;
  width: 100%;
}

.instance-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  padding: 4px 5px;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  flex-wrap: wrap;
}

.instance-title {
  font-size: 10.5px;
  font-weight: 700;
  margin: 0;
}

.instance-id {
  font-size: 8px;
  color: var(--muted);
  margin-left: 6px;
  white-space: nowrap;
}

/* Process boxes */
.process-box {
  border-radius: 8px;
  border: 1.5px solid;
  padding: 6px;
  margin-bottom: 4px;
  background: rgba(15, 23, 48, 0.85);
  max-width: 100%;
  width: 100%;
}

.process-box.icm {
  border-color: rgba(34, 197, 94, 0.6);
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.dispatcher {
  border-color: rgba(52, 211, 153, 0.6);
  background: linear-gradient(
    135deg,
    rgba(52, 211, 153, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.jvm {
  border-color: rgba(34, 211, 153, 0.6);
  background: linear-gradient(
    135deg,
    rgba(34, 211, 153, 0.15),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.msg {
  border-color: rgba(96, 165, 250, 0.6);
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.enq {
  border-color: rgba(96, 165, 250, 0.6);
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-title {
  font-size: 10px;
  font-weight: 700;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.process-desc {
  font-size: 9px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.4;
}

.process-details {
  font-size: 8px;
  color: var(--muted);
  padding-left: 12px;
  margin: 4px 0 0;
}

.process-details li {
  margin-bottom: 2px;
  line-height: 1.3;
}

/* Control vs Execution plane labels/groups */
.plane-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--muted);
  margin: 4px 0 4px;
}

.plane-group {
  margin-bottom: 6px;
}

.plane-group:last-child {
  margin-bottom: 0;
}

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

/* Group of JVM server nodes per VM */
.jvm-node-group {
  margin-top: 6px;
}

.jvm-node-group-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
}

.jvm-node-group-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.jvm-node-group-note {
  font-size: 9px;
  color: var(--muted);
  margin: 0;
  text-align: right;
}

.jvm-section {
  padding: 8px;
  margin-bottom: 8px;
  background: rgba(52, 211, 153, 0.08);
  border-radius: 4px;
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.jvm-section:last-child {
  margin-bottom: 0;
}

.jvm-section-title {
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--ink);
}

.jvm-items {
  font-size: 10px;
  color: var(--muted);
  margin: 0;
  padding-left: 14px;
  line-height: 1.4;
}

.jvm-items li {
  margin-bottom: 2px;
}

/* Grid layouts */
.grid {
  display: grid;
  gap: 10px;
  width: 100%;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 100%;
  width: 100%;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
  max-width: 100%;
  width: 100%;
}

/* Tags and badges */
.tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  border: 1px solid rgba(232, 236, 255, 0.22);
  background: rgba(232, 236, 255, 0.08);
  color: rgba(232, 236, 255, 0.92);
  margin-left: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 600;
  border: 1px solid;
}

.badge-infra {
  background: rgba(100, 116, 139, 0.15);
  border-color: rgba(100, 116, 139, 0.4);
  color: rgba(248, 250, 252, 0.95);
}

.badge-vm {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  color: rgba(233, 213, 255, 0.95);
}

.badge-os {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.4);
  color: rgba(224, 242, 254, 0.95);
}

.badge-sap {
  background: rgba(96, 165, 250, 0.15);
  border-color: rgba(96, 165, 250, 0.4);
  color: rgba(219, 234, 254, 0.95);
}

/* Small role badge inside SAP instance headers (ASCS / PAS / AAS) */
.badge-role {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  margin-left: 6px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid rgba(148, 163, 184, 0.7);
  color: rgba(226, 232, 240, 0.95);
  background: rgba(15, 23, 42, 0.7);
}

.badge-process {
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(52, 211, 153, 0.4);
  color: rgba(204, 251, 241, 0.95);
}

/* Connection indicators */
.flow-arrow {
  text-align: center;
  padding: 12px 0;
  color: var(--muted);
  font-size: 20px;
  font-weight: 300;
}

.connection-note {
  text-align: center;
  padding: 8px 16px;
  margin: 8px auto 20px;
  max-width: fit-content;
  border-radius: 999px;
  border: 1px solid rgba(232, 236, 255, 0.18);
  background: rgba(15, 23, 48, 0.85);
  color: var(--muted);
  font-size: 11px;
  box-shadow: var(--shadow);
}

/* Network/External layer */
.external-layer {
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 16px;
  border: 2px solid rgba(34, 197, 94, 0.5);
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.08),
    rgba(34, 197, 94, 0.03)
  );
  max-width: 100%;
  width: 100%;
}

.box {
  border-radius: 10px;
  border: 1.5px solid rgba(232, 236, 255, 0.25);
  background: rgba(15, 23, 48, 0.9);
  padding: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  max-width: 100%;
  width: 100%;
}

.box-title {
  font-size: 11.5px;
  font-weight: 700;
  margin: 0 0 4px;
}

.box-desc {
  font-size: 10px;
  color: var(--muted);
  margin: 0;
  line-height: 1.4;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--line);
  letter-spacing: 0.3px;
}

/* Clickable elements */
.box,
.vm-container,
.os-layer,
.sap-instance,
.process-box {
  cursor: pointer;
  transition: all 0.2s ease;
}

.box:hover,
.vm-container:hover,
.os-layer:hover,
.sap-instance:hover,
.process-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

/* Modal/Popup Styles */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(16, 26, 51, 0.8);
  border-radius: 16px 16px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(232, 236, 255, 0.1);
  color: var(--ink);
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
  color: var(--ink);
}

.modal-body h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-body p {
  margin: 0 0 16px;
  line-height: 1.6;
  color: var(--muted);
  font-size: 13px;
}

.modal-body ul {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.modal-body li {
  margin-bottom: 8px;
}

.modal-body .info-section {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(15, 23, 48, 0.6);
  border-radius: 8px;
  border: 1px solid var(--line);
}

.modal-body .info-section:last-child {
  margin-bottom: 0;
}

.modal-body strong {
  color: var(--ink);
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Flow View Styles */
.view-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-right: 16px;
}

.view-btn {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.view-btn:hover {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.view-btn.active {
  background: rgba(96, 165, 250, 0.3);
  border-color: rgba(96, 165, 250, 0.7);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.flow-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.flow-select {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  min-width: 220px;
}

.flow-view-shell {
  background: rgba(16, 26, 51, 0.55);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 20px;
  min-height: 700px;
}

.flow-view-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
  max-height: 900px;
}

@media (max-width: 1200px) {
  .flow-view-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    height: auto;
    min-height: 800px;
  }
  
  .flow-explanation-panel {
    max-height: 400px;
  }
}

.flow-canvas {
  position: relative;
  background: linear-gradient(transparent 24px, rgba(232, 236, 255, 0.04) 25px),
    linear-gradient(90deg, transparent 24px, rgba(232, 236, 255, 0.04) 25px);
  background-size: 25px 25px;
  background-color: rgba(15, 23, 48, 0.55);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.flow-component {
  position: absolute;
  z-index: 10;
  transition: all 0.3s ease;
}

.flow-component.active {
  z-index: 20;
  transform: scale(1.05);
}

.flow-comp-box {
  background: rgba(15, 23, 48, 0.9);
  border: 2px solid rgba(96, 165, 250, 0.5);
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 140px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.flow-component.active .flow-comp-box {
  border-color: rgba(34, 197, 94, 0.8);
  background: rgba(34, 197, 94, 0.15);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

.flow-comp-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}

.flow-comp-subtitle {
  font-size: 10px;
  color: var(--muted);
}

/* Component-specific positioning */
#client {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

#loadbalancer {
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}

#icm-pas {
  top: 200px;
  left: 30%;
  transform: translateX(-50%);
}

#icm-aas {
  top: 200px;
  left: 70%;
  transform: translateX(-50%);
}

#dispatcher-pas {
  top: 300px;
  left: 30%;
  transform: translateX(-50%);
}

#dispatcher-aas {
  top: 300px;
  left: 70%;
  transform: translateX(-50%);
}

#jvm-pas-0 {
  top: 400px;
  left: 20%;
  transform: translateX(-50%);
}

#jvm-pas-1 {
  top: 400px;
  left: 30%;
  transform: translateX(-50%);
}

#jvm-aas-0 {
  top: 400px;
  left: 70%;
  transform: translateX(-50%);
}

#database {
  top: 500px;
  left: 50%;
  transform: translateX(-50%);
}

#messageserver {
  top: 200px;
  left: 10%;
  transform: translateX(-50%);
}

#enqueueserver {
  top: 280px;
  left: 10%;
  transform: translateX(-50%);
}

/* Animated arrows */
.flow-arrow {
  position: absolute;
  z-index: 5;
  pointer-events: none;
}

.flow-arrow svg {
  overflow: visible;
}

.flow-arrow.animate {
  animation: pulseArrow 1.5s ease-in-out infinite;
}

@keyframes pulseArrow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Explanation Panel */
.flow-explanation-panel {
  background: rgba(16, 26, 51, 0.85);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  max-height: 100%;
}

.explanation-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.explanation-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}

.explanation-content {
  color: var(--muted);
}

.explanation-step h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.explanation-step ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
}

.explanation-step li {
  margin-bottom: 8px;
}

/* Color coding for different flow types */
.flow-arrow.http {
  stroke: #22c55e;
  fill: #22c55e;
}

.flow-arrow.cluster {
  stroke: #fbbf24;
  fill: #fbbf24;
}

.flow-arrow.db {
  stroke: #fb923c;
  fill: #fb923c;
}

@media print {
  header,
  .controls {
    display: none;
  }
  body {
    background: white;
    color: black;
  }
  .diagram-shell {
    border: none;
    box-shadow: none;
    height: auto;
  }
  .modal {
    display: none !important;
  }
  .flow-view-shell {
    display: none !important;
  }
}

```

```css
:root {
  --bg: #0b1020;
  --panel: #101a33;
  --panel2: #0f1730;
  --ink: #e8ecff;
  --muted: #b7c1ff;
  --line: rgba(232, 236, 255, 0.25);
  --shadow: 0 12px 28px rgba(0, 0, 0, 0.35);

  --c-client: #8b5cf6;
  --c-edge: #22c55e;
  --c-sap: #60a5fa;
  --c-java: #34d399;
  --c-db: #fb923c;
  --c-mgmt: #fbbf24;
  --c-sec: #f472b6;
  --c-infra: #64748b;
  --c-os: #0ea5e9;
  --c-vm: #8b5cf6;

  /* Base VM width used for layout; adjustable via UI */
  --vm-base-width: 360px;
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  background: radial-gradient(
      1200px 700px at 20% 10%,
      rgba(96, 165, 250, 0.18),
      transparent 55%
    ),
    radial-gradient(
      900px 600px at 80% 25%,
      rgba(139, 92, 246, 0.16),
      transparent 55%
    ),
    radial-gradient(
      1200px 800px at 55% 95%,
      rgba(251, 146, 60, 0.14),
      transparent 60%
    ),
    var(--bg);
  color: var(--ink);
}

header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(16, 26, 51, 0.85),
    rgba(16, 26, 51, 0.55)
  );
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

header h1 {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0.2px;
  font-weight: 650;
}

header p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
  max-width: 1600px;
}

.wrap {
  padding: 18px 22px 32px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(16, 26, 51, 0.65);
  border: 1px solid var(--line);
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  position: sticky;
  top: 76px;
  z-index: 90;
  backdrop-filter: blur(10px);
}

.vm-width-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--muted);
}

.vm-width-controls label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.vm-width-controls input[type="range"] {
  accent-color: #60a5fa;
}

.scaling-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.zoom-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.zoom-btn {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.zoom-btn:hover {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.zoom-level {
  color: var(--muted);
  font-size: 12px;
  min-width: 60px;
  text-align: center;
}

.legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.pill {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11.5px;
  color: var(--muted);
  white-space: nowrap;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08) inset;
}

.diagram-shell {
  background: rgba(16, 26, 51, 0.55);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
  /* Let the main page handle scrolling so we only have one scrollbar */
  overflow: visible;
  padding: 0;
  height: auto;
  min-height: 700px;
}

.canvas-wrapper {
  padding: 40px;
  display: inline-block;
  min-width: 100%;
  min-height: 100%;
}

.canvas {
  position: relative;
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 14px;
  background: linear-gradient(transparent 24px, rgba(232, 236, 255, 0.04) 25px),
    linear-gradient(90deg, transparent 24px, rgba(232, 236, 255, 0.04) 25px);
  background-size: 25px 25px;
  background-color: rgba(15, 23, 48, 0.55);
  outline: 1px solid rgba(232, 236, 255, 0.12);
  padding: 20px;
  transition: transform 0.3s ease;
}

/* Infrastructure layers */
.infra-layer {
  position: relative;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid;
  max-width: 100%;
  width: 100%;
}

/* VM levels (rows of VMs by category) */
.vm-level {
  margin-bottom: 10px;
}

.vm-level-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0 0 4px 2px;
}

.vm-level-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.layer-physical {
  border-color: rgba(100, 116, 139, 0.5);
  background: linear-gradient(
    135deg,
    rgba(100, 116, 139, 0.08),
    rgba(100, 116, 139, 0.03)
  );
}

.layer-vm {
  border-color: rgba(139, 92, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08),
    rgba(139, 92, 246, 0.03)
  );
}

.layer-os {
  border-color: rgba(14, 165, 233, 0.5);
  background: linear-gradient(
    135deg,
    rgba(14, 165, 233, 0.08),
    rgba(14, 165, 233, 0.03)
  );
}

.layer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.layer-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
}

.layer-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
}

.layer-desc {
  font-size: 11.5px;
  color: var(--muted);
  margin: 0;
  flex: 1;
}

/* VM/Host containers */
.vm-container {
  border-radius: 12px;
  border: 2px dashed rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.05);
  padding: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  /* Let flexbox control width inside vm-level-content, based on adjustable CSS variable */
  flex: 0 0 var(--vm-base-width);
}

.vm-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  padding: 4px 6px;
  background: rgba(139, 92, 246, 0.12);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  flex-wrap: wrap;
}

.vm-title {
  font-size: 11px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
}

.vm-specs {
  font-size: 8px;
  color: var(--muted);
  margin-left: auto;
  white-space: nowrap;
}

/* OS layer inside VM */
.os-layer {
  border-radius: 10px;
  border: 2px solid rgba(14, 165, 233, 0.4);
  background: rgba(14, 165, 233, 0.05);
  padding: 6px;
  margin-bottom: 6px;
  max-width: 100%;
  width: 100%;
}

.os-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  padding: 4px 5px;
  background: rgba(14, 165, 233, 0.12);
  border-radius: 6px;
  flex-wrap: wrap;
}

.os-title {
  font-size: 10.5px;
  font-weight: 600;
  margin: 0;
}

/* SAP Instance layer */
.sap-instance {
  border-radius: 10px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  background: rgba(96, 165, 250, 0.08);
  padding: 6px;
  margin-bottom: 6px;
  max-width: 100%;
  width: 100%;
}

.instance-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  padding: 4px 5px;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  flex-wrap: wrap;
}

.instance-title {
  font-size: 10.5px;
  font-weight: 700;
  margin: 0;
}

.instance-id {
  font-size: 8px;
  color: var(--muted);
  margin-left: 6px;
  white-space: nowrap;
}

/* Process boxes */
.process-box {
  border-radius: 8px;
  border: 1.5px solid;
  padding: 6px;
  margin-bottom: 4px;
  background: rgba(15, 23, 48, 0.85);
  max-width: 100%;
  width: 100%;
}

.process-box.icm {
  border-color: rgba(34, 197, 94, 0.6);
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.dispatcher {
  border-color: rgba(52, 211, 153, 0.6);
  background: linear-gradient(
    135deg,
    rgba(52, 211, 153, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.jvm {
  border-color: rgba(34, 211, 153, 0.6);
  background: linear-gradient(
    135deg,
    rgba(34, 211, 153, 0.15),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.msg {
  border-color: rgba(96, 165, 250, 0.6);
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-box.enq {
  border-color: rgba(96, 165, 250, 0.6);
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.12),
    rgba(15, 23, 48, 0.85)
  );
}

.process-title {
  font-size: 10px;
  font-weight: 700;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.process-desc {
  font-size: 9px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.4;
}

.process-details {
  font-size: 8px;
  color: var(--muted);
  padding-left: 12px;
  margin: 4px 0 0;
}

.process-details li {
  margin-bottom: 2px;
  line-height: 1.3;
}

/* Control vs Execution plane labels/groups */
.plane-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--muted);
  margin: 4px 0 4px;
}

.plane-group {
  margin-bottom: 6px;
}

.plane-group:last-child {
  margin-bottom: 0;
}

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

/* Group of JVM server nodes per VM */
.jvm-node-group {
  margin-top: 6px;
}

.jvm-node-group-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
}

.jvm-node-group-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.jvm-node-group-note {
  font-size: 9px;
  color: var(--muted);
  margin: 0;
  text-align: right;
}

.jvm-section {
  padding: 8px;
  margin-bottom: 8px;
  background: rgba(52, 211, 153, 0.08);
  border-radius: 4px;
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.jvm-section:last-child {
  margin-bottom: 0;
}

.jvm-section-title {
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--ink);
}

.jvm-items {
  font-size: 10px;
  color: var(--muted);
  margin: 0;
  padding-left: 14px;
  line-height: 1.4;
}

.jvm-items li {
  margin-bottom: 2px;
}

/* Grid layouts */
.grid {
  display: grid;
  gap: 10px;
  width: 100%;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 100%;
  width: 100%;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
  max-width: 100%;
  width: 100%;
}

/* Tags and badges */
.tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  border: 1px solid rgba(232, 236, 255, 0.22);
  background: rgba(232, 236, 255, 0.08);
  color: rgba(232, 236, 255, 0.92);
  margin-left: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 600;
  border: 1px solid;
}

.badge-infra {
  background: rgba(100, 116, 139, 0.15);
  border-color: rgba(100, 116, 139, 0.4);
  color: rgba(248, 250, 252, 0.95);
}

.badge-vm {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  color: rgba(233, 213, 255, 0.95);
}

.badge-os {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.4);
  color: rgba(224, 242, 254, 0.95);
}

.badge-sap {
  background: rgba(96, 165, 250, 0.15);
  border-color: rgba(96, 165, 250, 0.4);
  color: rgba(219, 234, 254, 0.95);
}

/* Small role badge inside SAP instance headers (ASCS / PAS / AAS) */
.badge-role {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  margin-left: 6px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid rgba(148, 163, 184, 0.7);
  color: rgba(226, 232, 240, 0.95);
  background: rgba(15, 23, 42, 0.7);
}

.badge-process {
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(52, 211, 153, 0.4);
  color: rgba(204, 251, 241, 0.95);
}

/* Connection indicators */
.flow-arrow {
  text-align: center;
  padding: 12px 0;
  color: var(--muted);
  font-size: 20px;
  font-weight: 300;
}

.connection-note {
  text-align: center;
  padding: 8px 16px;
  margin: 8px auto 20px;
  max-width: fit-content;
  border-radius: 999px;
  border: 1px solid rgba(232, 236, 255, 0.18);
  background: rgba(15, 23, 48, 0.85);
  color: var(--muted);
  font-size: 11px;
  box-shadow: var(--shadow);
}

/* Network/External layer */
.external-layer {
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 16px;
  border: 2px solid rgba(34, 197, 94, 0.5);
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.08),
    rgba(34, 197, 94, 0.03)
  );
  max-width: 100%;
  width: 100%;
}

.box {
  border-radius: 10px;
  border: 1.5px solid rgba(232, 236, 255, 0.25);
  background: rgba(15, 23, 48, 0.9);
  padding: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  max-width: 100%;
  width: 100%;
}

.box-title {
  font-size: 11.5px;
  font-weight: 700;
  margin: 0 0 4px;
}

.box-desc {
  font-size: 10px;
  color: var(--muted);
  margin: 0;
  line-height: 1.4;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--line);
  letter-spacing: 0.3px;
}

/* Clickable elements */
.box,
.vm-container,
.os-layer,
.sap-instance,
.process-box {
  cursor: pointer;
  transition: all 0.2s ease;
}

.box:hover,
.vm-container:hover,
.os-layer:hover,
.sap-instance:hover,
.process-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

/* Modal/Popup Styles */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(16, 26, 51, 0.8);
  border-radius: 16px 16px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(232, 236, 255, 0.1);
  color: var(--ink);
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
  color: var(--ink);
}

.modal-body h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-body p {
  margin: 0 0 16px;
  line-height: 1.6;
  color: var(--muted);
  font-size: 13px;
}

.modal-body ul {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.modal-body li {
  margin-bottom: 8px;
}

.modal-body .info-section {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(15, 23, 48, 0.6);
  border-radius: 8px;
  border: 1px solid var(--line);
}

.modal-body .info-section:last-child {
  margin-bottom: 0;
}

.modal-body strong {
  color: var(--ink);
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Flow View Styles */
.view-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-right: 16px;
}

.view-btn {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.view-btn:hover {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.view-btn.active {
  background: rgba(96, 165, 250, 0.3);
  border-color: rgba(96, 165, 250, 0.7);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.flow-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.flow-select {
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: var(--ink);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  min-width: 220px;
}

.flow-view-shell {
  background: rgba(16, 26, 51, 0.55);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 20px;
  min-height: 700px;
}

.flow-view-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
  max-height: 900px;
}

@media (max-width: 1200px) {
  .flow-view-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    height: auto;
    min-height: 800px;
  }
  
  .flow-explanation-panel {
    max-height: 400px;
  }
}

.flow-canvas {
  position: relative;
  background: linear-gradient(transparent 24px, rgba(232, 236, 255, 0.04) 25px),
    linear-gradient(90deg, transparent 24px, rgba(232, 236, 255, 0.04) 25px);
  background-size: 25px 25px;
  background-color: rgba(15, 23, 48, 0.55);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: visible;
  min-height: 600px;
  width: 100%;
}

.flow-component {
  position: absolute;
  z-index: 10;
  transition: all 0.3s ease;
}

.flow-component.active {
  z-index: 20;
  transform: scale(1.05);
}

.flow-comp-box {
  background: rgba(15, 23, 48, 0.9);
  border: 2px solid rgba(96, 165, 250, 0.5);
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 140px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.flow-component.active .flow-comp-box {
  border-color: rgba(34, 197, 94, 0.8);
  background: rgba(34, 197, 94, 0.15);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

.flow-comp-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}

.flow-comp-subtitle {
  font-size: 10px;
  color: var(--muted);
}

/* Component-specific positioning */
#client {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

#loadbalancer {
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}

#icm-pas {
  top: 200px;
  left: 30%;
  transform: translateX(-50%);
}

#icm-aas {
  top: 200px;
  left: 70%;
  transform: translateX(-50%);
}

#dispatcher-pas {
  top: 300px;
  left: 30%;
  transform: translateX(-50%);
}

#dispatcher-aas {
  top: 300px;
  left: 70%;
  transform: translateX(-50%);
}

#jvm-pas-0 {
  top: 400px;
  left: 20%;
  transform: translateX(-50%);
}

#jvm-pas-1 {
  top: 400px;
  left: 30%;
  transform: translateX(-50%);
}

#jvm-aas-0 {
  top: 400px;
  left: 70%;
  transform: translateX(-50%);
}

#database {
  top: 500px;
  left: 50%;
  transform: translateX(-50%);
}

#messageserver {
  top: 200px;
  left: 10%;
  transform: translateX(-50%);
}

#enqueueserver {
  top: 280px;
  left: 10%;
  transform: translateX(-50%);
}

/* Animated arrows */
.flow-arrow {
  position: absolute;
  z-index: 5;
  pointer-events: none;
}

.flow-arrow svg {
  overflow: visible;
}

.flow-arrow.animate {
  animation: pulseArrow 1.5s ease-in-out infinite;
}

@keyframes pulseArrow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Explanation Panel */
.flow-explanation-panel {
  background: rgba(16, 26, 51, 0.85);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  max-height: 100%;
}

.explanation-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.explanation-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}

.explanation-content {
  color: var(--muted);
}

.explanation-step h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.explanation-step ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
}

.explanation-step li {
  margin-bottom: 8px;
}

/* Color coding for different flow types */
.flow-arrow.http {
  stroke: #22c55e;
  fill: #22c55e;
}

.flow-arrow.cluster {
  stroke: #fbbf24;
  fill: #fbbf24;
}

.flow-arrow.db {
  stroke: #fb923c;
  fill: #fb923c;
}

@media print {
  header,
  .controls {
    display: none;
  }
  body {
    background: white;
    color: black;
  }
  .diagram-shell {
    border: none;
    box-shadow: none;
    height: auto;
  }
  .modal {
    display: none !important;
  }
  .flow-view-shell {
    display: none !important;
  }
}

```

```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
  flowState.totalSteps = flowState.flowData.steps.length;
  clearCanvas();
  updateExplanation();
  updateStepVisualization();
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

  // Small delay to ensure layout is stable
  setTimeout(() => {
    // Highlight components
    step.highlight.forEach((compId) => {
      const comp = document.getElementById(compId);
      if (comp) comp.classList.add("active");
    });

    // Draw arrows
    const canvas = document.getElementById("flowCanvas");
    step.arrows.forEach((arrowDef) => {
      const arrow = createArrow(arrowDef);
      if (arrow) canvas.appendChild(arrow);
    });
  }, 50);
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
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
```

```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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

  // Small delay to ensure layout is stable
  setTimeout(() => {
    // Highlight components
    step.highlight.forEach((compId) => {
      const comp = document.getElementById(compId);
      if (comp) comp.classList.add("active");
    });

    // Draw arrows
    const canvas = document.getElementById("flowCanvas");
    step.arrows.forEach((arrowDef) => {
      const arrow = createArrow(arrowDef);
      if (arrow) canvas.appendChild(arrow);
    });
  }, 50);
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
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
```


Adding a resize handler to recalculate arrows on window resize:


```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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

  // Small delay to ensure layout is stable
  setTimeout(() => {
    // Highlight components
    step.highlight.forEach((compId) => {
      const comp = document.getElementById(compId);
      if (comp) comp.classList.add("active");
    });

    // Draw arrows
    const canvas = document.getElementById("flowCanvas");
    step.arrows.forEach((arrowDef) => {
      const arrow = createArrow(arrowDef);
      if (arrow) canvas.appendChild(arrow);
    });
  }, 50);
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
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
```


Verifying the implementation and fixing a small issue in the updateStepVisualization function:


```javascript
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
        arrows: [
          { from: "client", to: "loadbalancer", type: "http" },
        ],
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
        arrows: [
          { from: "loadbalancer", to: "icm-pas", type: "http" },
        ],
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
        arrows: [
          { from: "icm-pas", to: "dispatcher-pas", type: "http" },
        ],
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
        arrows: [
          { from: "dispatcher-pas", to: "jvm-pas-0", type: "http" },
        ],
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
        arrows: [
          { from: "jvm-pas-0", to: "database", type: "db" },
        ],
      },
      {
        title: "Response flows back",
        bullets: [
          "JVM generates HTTP response",
          "Response flows back: JVM → Dispatcher → ICM → Load Balancer → Client",
          "Client receives response and renders content",
        ],
        highlight: ["jvm-pas-0", "dispatcher-pas", "icm-pas", "loadbalancer", "client"],
        arrows: [
          { from: "database", to: "jvm-pas-0", type: "db", reverse: true },
          { from: "jvm-pas-0", to: "dispatcher-pas", type: "http", reverse: true },
          { from: "dispatcher-pas", to: "icm-pas", type: "http", reverse: true },
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
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", `arrowhead-${type}`);
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "3");
      marker.setAttribute("orient", "auto");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
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
```


## Summary

Added a Flow View to the SAP NetWeaver AS Java architecture diagram.

### Features

1. View switcher: Toggle between "Topology View" (existing) and "Flow View" (new).

2. Flow View layout:
   - Animation canvas (center): Fixed component positions with animated flows
   - Explanation panel (right): Updates per step with technical details

3. Three flows:
   - Flow 1: User HTTP Request — Client → Load Balancer → ICM → Dispatcher → JVM → Database → Response
   - Flow 2: Java Cluster Coordination — Message Server registration, cluster state, Enqueue Server locks
   - Flow 3: System Startup — OS → Central Services → PAS → AAS instances

4. Controls:
   - Flow selector dropdown
   - Play/Pause
   - Step Forward/Back
   - Restart

5. Visuals:
   - Color-coded arrows (HTTP: green, Cluster: yellow, Database: orange)
   - Component highlighting during active steps
   - Animated arrows with pulsing effect
   - Dashed lines for reverse flows

6. Architecture accuracy:
   - Follows ADM800 Java Cluster Architecture
   - One Central Services instance (Message Server + Enqueue Server)
   - One PAS, zero or more AAS
   - Each PAS/AAS has ICM, Dispatcher, and JVM processes
   - Central Services has no ICM or JVMs

The Flow View is non-dynamic (no scaling/editing) and focuses on teaching how the system works at runtime. All explanations use SAP terminology and technical details.

You can switch between views using the buttons at the top, select a flow, and use the controls to navigate through the animated steps.

---

**User**

like 2 main thins to imporve i want to see the execte entity like its an instance , a server a vm a process a file , what is built on etc .. secdnly dont use just arroews i want to see what protoclas are in use and how the info is look like  

