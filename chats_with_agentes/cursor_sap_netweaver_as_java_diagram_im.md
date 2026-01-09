# SAP NetWeaver AS Java diagram improvements
_Exported on 1/9/2026 at 13:27:08 GMT+2 from Cursor (2.3.30)_

---

**User**

Modernize instance names and roles – The “Java Central Instance” and “Java App Instance” labels are legacy terminology. SAP NetWeaver AS Java now distinguishes between Primary Application Server (PAS) and Additional Application Server (AAS). Renaming JC01 and JC02 to PAS and AAS, respectively, will align your diagram with current SAP documentation and avoid confusion
.

Make roles explicit – Add a small badge or line under each SAP instance indicating its role: ASCS (Central Services), PAS, or AAS. For example, the ASCS host houses the Message Server and Enqueue Server, but no JVM nodes; the PAS contains the first dispatcher and first JVM node; AAS instances scale out capacity. This helps readers quickly grasp the function of each instance.

Separate control plane and execution plane – Visually group control-plane components (Message Server, Enqueue Server, sapstartsrv) apart from execution-plane components (ICM, Dispatcher, JVM Nodes). Within the PAS and AAS boxes, note that the ICM terminates HTTP/HTTPS but never runs application logic, while the Dispatcher is the sole router to the JVM nodes. This distinction addresses a common misunderstanding and reflects SAP’s architecture.

Group JVM nodes logically – Instead of listing JVM nodes individually, place them inside a “Java Server Nodes (Cluster Members)” container and include a note that they are stateless and store session/application state in the DB or via replication. This makes the cluster concept clearer.

Clarify database roles – The database section identifies the SAP HANA instance and its processes (hdbindexserver, hdbdaemon, etc.)
, but you could further divide the database workload into configuration & cluster state tables, deployment metadata (SCA/SDA), and application data. This helps readers understand why a running AS Java always needs DB connectivity.

Refine terminology and ports – Use SAP-accurate terms (e.g., “Java Dispatcher” rather than “disp+work” and “P4 protocol” rather than “internal communication port”) and ensure port descriptions mention both the port number and purpose (HTTP, HTTPS, P4, ICM).

Optional enhancements – Consider adding a legend or toggle to highlight “control plane” vs “execution plane” paths. Also, a short summary of key communication flows (user request flow, cluster communication) at the end of the diagram would reinforce the narrative.

---

**Cursor**

I’ll inspect your existing diagram implementation in `index.html`, `script.js`, and `styles.css`, then update labels, roles, groupings, and terminology so the visual matches modern SAP NetWeaver AS Java concepts (PAS/AAS, control vs execution plane, JVM cluster, DB roles). After adjusting structure and styling, I’ll add optional legend/flow notes if they fit cleanly into your current layout.

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
        <div class="zoom-controls">
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

                          <div
                            class="process-box"
                            style="border-color: rgba(96, 165, 250, 0.5)"
                          >
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              sapstartsrv
                            </p>
                            <p class="process-desc">
                              Local instance control daemon that can start,
                              stop, and monitor ASCS processes.
                            </p>
                            <ul class="process-details">
                              <li><b>Port:</b> 5XX00 (SOAP/HTTP)</li>
                              <li>
                                <b>Started by:</b> OS init system (systemd)
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
                              Terminates HTTP(S), handles network I/O and TLS,
                              and forwards requests; never executes application
                              logic.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Ports:</b> 80XX (8001) HTTP, 443XX (44301)
                                HTTPS
                              </li>
                              <li>
                                <b>Forwards to:</b> Java Dispatcher via local
                                IPC
                              </li>
                            </ul>
                          </div>

                          <div class="process-box dispatcher">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Java Dispatcher
                            </p>
                            <p class="process-desc">
                              Sole router that distributes all requests to JVM
                              server nodes, enforcing session affinity and load
                              balancing.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Port:</b> 5XX04 (P4 protocol for Java
                                Dispatcher ↔ JVM communication)
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
                                Stateless execution; state stored in DB or
                                replicated.
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

                  <!-- Java App Server 2 VM -->
                  <div class="vm-container">
                    <div class="vm-header">
                      <span style="font-size: 18px">💻</span>
                      <h3 class="vm-title">VM/Host: sap-java-app-02</h3>
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
                        Same OS setup as app-01, separate VM for scale-out
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">☕</span>
                          <h5 class="instance-title">
                            SAP Java Additional Application Server (AAS)
                          </h5>
                          <span class="badge badge-sap"
                            >SAP Java Engine (Java EE compatible runtime)</span
                          >
                          <span class="badge-role">AAS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 02</span
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
                              nodes on this AAS host.
                            </p>
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
                              Terminates HTTP(S) and forwards requests to the
                              local Java Dispatcher; never executes application
                              logic.
                            </p>
                            <ul class="process-details">
                              <li>
                                <b>Ports:</b> 80XX (8002) HTTP, 443XX (44302)
                                HTTPS
                              </li>
                              <li>
                                <b>Load Balancer:</b> Distributes traffic
                                between app-01 and app-02 ICMs
                              </li>
                            </ul>
                          </div>

                          <div class="process-box dispatcher">
                            <p class="process-title">
                              <span class="badge badge-process">Process</span>
                              Java Dispatcher
                            </p>
                            <p class="process-desc">
                              Sole router that distributes all requests from ICM
                              to local JVM server nodes on this AAS host.
                            </p>
                          </div>

                          <div class="jvm-node-group">
                            <div class="jvm-node-group-header">
                              <p class="jvm-node-group-title">
                                Java Server Nodes (Cluster Members)
                              </p>
                              <p class="jvm-node-group-note">
                                Stateless execution; state stored in DB or
                                replicated.
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
                                JVM process running SAP Java Engine and
                                applications for this AAS.
                              </p>
                              <ul class="process-details">
                                <li>
                                  <b>All nodes connect to same database</b>
                                </li>
                                <li>
                                  <b>All nodes register with Message Server</b>
                                </li>
                                <li>
                                  <b>All nodes use Enqueue Server for locks</b>
                                </li>
                              </ul>
                            </div>

                            <div class="process-box jvm">
                              <p class="process-title">
                                <span class="badge badge-process"
                                  >JVM Process</span
                                >
                                Java Server Node 1 (server1)
                              </p>
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

### Summary of updates

- **Modernized instance naming and roles** by changing the visible instance titles from `JC01`/`JC02` to **“SAP Java Primary Application Server (PAS)”** and **“SAP Java Additional Application Server (AAS)”**, while keeping the technical instance number in the smaller `SID/Instance#` line.  
- **Made roles and planes more explicit**: added legend pills for **Control Plane** and **Execution Plane**, and refactored the AAS instance to mirror the PAS structure with clear `Control Plane` (sapstartsrv) and `Execution Plane` (ICM, Java Dispatcher, JVM node cluster) groupings.  
- **Clarified JVM clustering and behavior** on the AAS by wrapping its JVMs in a `Java Server Nodes (Cluster Members)` container with the same stateless/DB-or-replication note used for PAS.  
- **Refined terminology and ports** by explicitly labeling ICM ports as HTTP/HTTPS and updating the PAS dispatcher port description to reference **P4** with a concrete `5XX04` example, keeping the rest of your database and flow clarifications as they are.

---

**User**

You are a senior SAP Basis architect and front-end engineer.

Your task is to fix and align an existing interactive HTML/CSS/JS diagram of SAP NetWeaver AS Java so that it is 100% consistent with SAP ADM800 (Unit 1 – Java Cluster Architecture).

Use ADM800 as the single source of truth. Do not guess, simplify, or invent behavior.

1. Instance roles (critical)

Implement the exact instance model from ADM800:

Central Services (ASCS)

Exactly one per system

Contains Java Message Server + Java Enqueue Server only

Must never be duplicated, even when scaling

Primary Application Server (PAS)

Exactly one

First Java instance installed

Contains: ICM, Java Dispatcher, Java Server Processes (JVMs)

Additional Application Servers (AAS)

Zero or more

All scale-out Java instances are AAS only

Same structure as PAS (ICM + Dispatcher + Server Processes)

Rename all legacy or incorrect labels such as:

“Java Central Instance”

“Java App Instance”

to PAS or AAS, according to ADM800 terminology.

2. Fix the scaling button logic

The “+ Java App Server” button must:

Add a new VM hosting an AAS

Never create:

Another Central Services instance

Another PAS

The “- Java App Server” button must:

Remove only the most recently added AAS

Scaling must represent horizontal scaling via AAS, exactly as described in ADM800.

3. Internal structure correctness

Inside every PAS and AAS, show:

ICM

Receives HTTP(S) requests

Distributes them to server processes (round-robin)

Java Dispatcher

Java Server Processes (JVMs)

Executing Java EE applications

Multi-threaded

Part of the Java cluster

Do not place JVMs or ICM inside Central Services.

4. Java cluster semantics

Reflect these ADM800 rules:

Java cluster = Central Services + PAS + optional AAS + database

Message Server knows all active Java instances

Enqueue Server handles cluster-wide locks

Scaling is achieved by:

Adding server processes per instance

Adding AAS instances

5. Database relationship

Keep a single shared database for the system:

Configuration

Cluster state

Deployment metadata

Application data

Do not imply per-instance databases.

6. Do NOT

Do not add ABAP components

Do not redesign the layout

Do not add marketing explanations

Do not invent SAP behavior not stated in ADM800

Goal:
The diagram must be something a senior SAP Basis engineer can validate line-by-line against ADM800 without finding architectural errors.

---

**Cursor**

I’ll remove the hard-coded AAS VM so scaling is purely via the buttons, tighten the ASCS/PAS/AAS roles and content, and adjust the scaling logic so it clones only AAS instances (never PAS/ASCS) while keeping the ICM/Dispatcher/JVM structure correct per ADM800. Then I’ll lightly tweak the text so ICM/dispatcher/server processes and cluster semantics match your SAP training expectations without adding any new behavior.

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
        <div class="zoom-controls">
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
                              Receives incoming HTTP(S) requests and
                              distributes them to Java server processes using a
                              round-robin algorithm; does not execute
                              application logic.
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
                                Execute Java EE applications; multi-threaded
                                and part of the Java cluster.
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

```javascript
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

```

### What I changed to align with ADM800

- **Instance roles and structure**
  - Central Services (`ASCS00`) now **only contains** the Java Message Server and Java Enqueue Server inside the instance box; the sapstartsrv box was removed from the ASCS instance so it clearly matches “Message Server + Enqueue Server only” with **no ICM / JVMs**.
  - The Java layer now has **one PAS VM only** in the static HTML (`sap-java-app-01`), labeled in the instance header as **“SAP Java Primary Application Server (PAS)”** with role badge `PAS`. There are **no hard-coded AAS VMs** at load time, so AAS count is truly “zero or more”.
  - The PAS internal structure still shows **ICM, Java Dispatcher, JVM server processes grouped as “Java Server Nodes (Cluster Members)”**, matching ADM800’s PAS composition.

- **Scaling buttons = AAS only**
  - `addJavaAppServer()` now:
    - Uses the PAS VM as a **template**, clones it, and then **converts the clone into an AAS**:
      - VM title → `VM/Host: sap-java-app-0X` (02, 03, …).
      - Instance title → **“SAP Java Additional Application Server (AAS)”**.
      - Role badge `.badge-role` is already forced to `AAS` in existing code.
      - `SID: J2E, Instance#: 0X` is set from the running `javaAppServerCount`, so PAS is `01`, first AAS is `02`, etc.
    - This guarantees that **no second PAS or Central Services** is ever created; every scaled-out VM is an **AAS**.
  - `removeJavaAppServer()` already removed only the last `.vm-container` and kept at least one; now that the HTML has exactly one PAS VM:
    - If only the PAS is present (no AAS), `vms.length === 1` and the function returns, so the PAS **cannot be removed**.
    - As soon as you add AAS instances, the **“- Java App Server”** button removes **only the most recently added AAS**, correctly modeling horizontal scale-out via AAS.

- **Internal PAS/AAS behavior text**
  - **ICM (PAS)** description now explicitly states:
    - Receives incoming HTTP(S) requests.
    - **Distributes them to Java server processes using round-robin**.
    - Does not execute application logic.
  - ICM ports text was normalized to:  
    **“80XX (8001) for HTTP, 443XX (44301) for HTTPS”**.
  - **Java Dispatcher (PAS)** description was simplified so it doesn’t contradict ADM800:
    - “Organizes the Java server processes of this instance and participates in the Java cluster together with Central Services and the database.”
    - Port line now reads: **“5XX04 (P4 protocol for internal Java instance communication)”**, matching SAP terminology without adding extra behavior.
  - The PAS JVM group note now says:  
    **“Execute Java EE applications; multi-threaded and part of the Java cluster.”**, aligning with ADM800’s wording about server processes/JVMs.

- **Cluster and database semantics**
  - The visible architecture now reflects: **ASCS (Message + Enqueue) + exactly one PAS + zero or more AAS (via scaling buttons) + one shared database**, which is the ADM800 Java cluster definition.
  - No ICMs or JVMs appear in the Central Services instance, and there is **only one database** used for configuration, cluster state, deployment metadata, and application data; nothing suggests per-instance databases.

If you’d like, I can next tighten a few more descriptions (e.g., Message Server / Enqueue Server bullets, JVM internals) strictly to the phrasing and scope of ADM800, without adding any extra behavior.

---

**User**

i want to make the defulte zoom to 130

---

**Cursor**


Setting the default zoom to 130% (1.3).



Updating the default zoom to 130% and ensuring it's applied on initialization.


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

```


Updated the default zoom to 130% (1.3). The diagram will load at 130% zoom, and the zoom level indicator will show "130%". The "Reset" button still resets to 100% (1.0); if you want it to reset to 130%, I can update that too.

---

**User**

and the widte to 360px by defult

---

**Cursor**


Setting the default VM width to 360px. Checking where it's defined in CSS and HTML.



Checking the HTML slider's default value:



Updating the default VM width to 360px in CSS and JavaScript:


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

```


Set the default VM width to 360px. Updated:
1. The CSS variable `--vm-base-width` from 230px to 360px
2. The JavaScript fallback value from 230 to 360

The diagram will load with VM containers at 360px width by default, and the slider will show "360px" on page load.

