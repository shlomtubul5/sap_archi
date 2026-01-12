# SAP System Architecture Components

This document defines the logical structure and component details for the **Dual Stack** and **Java Stack** architectures.

## 1. Dual Stack Architecture
*Logical view of an SAP Dual Stack (ABAP + Java) system running on a single host.*

### 1.1 Client Layer
*   **SAP GUI**
    *   **Type**: Client Application
    *   **Description**: Desktop client application for accessing SAP systems using DIAG (SAP's proprietary) protocol.
    *   **Details**:
        *   Traditional thick client used for ABAP stack access
        *   Communicates via DIAG protocol
        *   Requires installation on user's workstation
        *   Supports rich UI features and offline capabilities

*   **Web Browser**
    *   **Type**: Client Application
    *   **Description**: Modern web-based access to both ABAP and Java stack applications.
    *   **Details**:
        *   Uses HTTP/HTTPS protocol
        *   Accesses both SAP GUI for HTML and Fiori applications
        *   Platform-independent access
        *   No client installation required

### 1.2 Infrastructure Layer
#### 1.2.1 Virtual Machine / Host
*   **Name**: Single Host Lab Scenario
*   **Type**: Virtual Machine
*   **Description**: Single host environment containing both ABAP and Java stacks.
*   **Details**:
    *   Lab/development scenario with both stacks on one host
    *   Shared system resources
    *   Both instances communicate via localhost/network
    *   Isolated from production but demonstrates dual-stack architecture

    #### 1.2.2 ABAP Stack Components
    *   **Instance 00: ASCS (ABAP Central Services)**
        *   **Message Server (ABAP)**
            *   **Type**: Service
            *   **Description**: Central communication hub for ABAP instances in the dual-stack system.
            *   **Details**: Routes messages between application servers, Maintains instance communication state, Critical for load balancing and failover.
        *   **Enqueue Server (ABAP)**
            *   **Type**: Service
            *   **Description**: Manages database locks and ensures data consistency across the ABAP stack.
            *   **Details**: Single point of lock management, Prevents concurrent modifications, Essential for data integrity.
        *   **sapstartsrv**
            *   **Type**: Infrastructure Service
            *   **Description**: Infrastructure component responsible for starting and stopping SAP services.
            *   **Details**: Process management and monitoring, Manages instance lifecycle.

    *   **Instance 01: ABAP PAS (Primary Application Server)**
        *   **sapstartsrv**: (See above)
        *   **IGS (Internet Graphics Server)**
            *   **Type**: Service (Optional)
            *   **Description**: Optional component for rendering graphics in SAP GUI for HTML.
            *   **Details**: Converts ABAP OLE objects to web formats.
        *   **ICM (Internet Communication Manager)**
            *   **Type**: Gateway
            *   **Description**: Handles HTTP/HTTPS communication and acts as application gateway for both stacks.
            *   **Details**: Manages incoming HTTP requests, SSL/TLS termination, Load balancing.
        *   **ABAP Dispatcher**
            *   **Type**: Core Dispatcher
            *   **Description**: Routes requests to available ABAP work processes.
            *   **Details**: Manages request queue, Assigns requests to work processes, Handles context switching.
        *   **ABAP Shared Memory**
            *   **Type**: Memory Management
            *   **Description**: Shared memory segments used by ABAP work processes.
            *   **Details**: PXA (Program Execution Area), Roll Area (User Context), Table Buffer (Cache).
        *   **Work Processes**
            *   **DIA (Dialog)**: Handles interactive user requests. Executes ABAP programs synchronously.
            *   **BTC (Batch)**: Executes batch jobs and background processing tasks.
            *   **UPD (Update V1)**: Asynchronously processes database updates (synchronous update).
            *   **UP2 (Update V2)**: Asynchronously processes database updates (secondary/deferred).
            *   **SPO (Spool)**: Manages print jobs and spool requests.
        *   **Gateway (RFC)**
            *   **Type**: Gateway
            *   **Description**: Enables RFC communication with external systems.
            *   **Details**: Bidirectional communication, External system integration point.

    #### 1.2.3 Java Stack Components
    *   **Instance 02: SCS (Java Central Services)**
        *   **Message Server (Java)**
            *   **Type**: Service
            *   **Description**: Central communication hub for Java instances.
            *   **Details**: Routes JMS and internal messaging, Cluster communication.
        *   **Enqueue Server (Java)**
            *   **Type**: Service
            *   **Description**: Manages locks in the Java stack.
            *   **Details**: Distributed lock management, Supports Java object serialization.
        *   **sapstartsrv**: (See above)

    *   **Instance 03: Java PAS (Primary Application Server)**
        *   **sapstartsrv**: (See above)
        *   **jstart/jlaunch**
            *   **Type**: Process Manager
            *   **Description**: Java process management component that starts and manages Java services.
            *   **Details**: Launches J2EE engine, Manages JVM lifecycle.
        *   **ICM**: (See above - shared logic, separate process)
        *   **Java Dispatcher**
            *   **Type**: Core Dispatcher
            *   **Description**: Routes requests to available Java server nodes.
            *   **Details**: Connection manager, Load balancer for server nodes, Session management.
        *   **Java Server Node (JVM)**
            *   **Type**: Runtime Environment
            *   **Description**: JVM instance running J2EE containers and application logic.
            *   **Components**:
                *   **Web Container**: Servlet and JSP execution environment.
                *   **EJB Container**: Enterprise JavaBean execution and lifecycle management.
                *   **Persistence Layer**: Data access/ORM (JPA/Hibernate), connection pooling.

### 1.3 Database Layer
*   **DBMS (Database)**
    *   **Type**: Database
    *   **Description**: Central relational database supporting both ABAP and Java stacks.
    *   **Details**: Single shared instance containing both schemas.
    *   **Components**:
        *   **ABAP Schema**: Contains SAP data dictionary tables and ABAP application data.
        *   **Java Schema**: J2EE configuration data and Java application tables.

---

## 2. Java Stack Architecture
*Logical view of a distributed SAP NetWeaver AS Java system.*

### 2.1 External Layer
*   **External Network & Edge**
    *   **DNS / Load Balancer**
        *   **Description**: Virtual IP, health checks, traffic distribution.
    *   **Reverse Proxy / WAF**
        *   **Description**: TLS termination, L7 routing, security.
    *   **Firewall / Security Groups**
        *   **Description**: Network policies, port filtering.

### 2.2 Infrastructure Layer ("Physical / Cloud")

#### 2.2.1 Level 1: Central Services
*   **VM/Host: sap-ascs-01**
    *   **OS**: RHEL 8.6 (Linux)
    *   **Specs**: 4 vCPU | 16GB
    *   **SAP Instance: ASCS00 (ASCS)**
        *   **Type**: Central Services Instance
        *   **Instance #**: 00
        *   **Components**:
            *   **Message Server (msg_server)**: Control hub for cluster, load balancing info.
            *   **Enqueue Server (enserver)**: Distributed lock management.

#### 2.2.2 Level 2: Java Application Servers
*   **VM/Host: sap-java-app-01**
    *   **OS**: RHEL 8.6
    *   **Specs**: 8 vCPU | 32GB
    *   **SAP Instance: SAP Java PAS**
        *   **Type**: Primary Application Server
        *   **Instance #**: 01
        *   **Components**:
            *   **sapstartsrv**: Daemon for process usage.
            *   **ICM (Internet Comm. Mgr)**: HTTP/HTTPS entry point.
            *   **Java Dispatcher**: Distributes requests to JVM nodes.
            *   **Java Server Nodes (Cluster Members)**:
                *   **JVM Node 0 (server0)**
                    *   **Java EE Runtime**: Servlet Container, EJB Container.
                    *   **Services**: Deploy, Cluster, Locking.
                *   **JVM Node 1 (server1)**: (Redundant node)

#### 2.2.3 Level 3: Database
*   **VM/Host: sap-hana-db-01**
    *   **OS**: SLES 15 (Linux)
    *   **SAP Instance: SAP HANA Database**
        *   **Type**: Database Instance
        *   **Components**:
            *   **hdbindexserver**: Main DB engine. Stores Java Schema.
            *   **hdbdaemon**: Database background daemon.
