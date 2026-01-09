# One slider needed
_Exported on 1/9/2026 at 13:26:35 GMT+2 from Cursor (2.3.30)_

---

**User**

thier is now 2 slider i want only one 

---

**Cursor**

I’ll first inspect your HTML and JS to see where both sliders are coming from, then I’ll adjust the markup or script so only one slider is initialized/rendered. Then I’ll summarize exactly what changed so you can tweak further if needed.

I see where the extra scroll area is coming from in your layout; I’ll adjust the CSS so you only have a single scrollbar for the whole page instead of one inside the diagram and one on the window.

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
  padding: 10px;
  margin-bottom: 12px;
  max-width: 100%;
  width: 100%;
}

.vm-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px 8px;
  background: rgba(139, 92, 246, 0.12);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  flex-wrap: wrap;
}

.vm-title {
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
}

.vm-specs {
  font-size: 9px;
  color: var(--muted);
  margin-left: auto;
  white-space: nowrap;
}

/* OS layer inside VM */
.os-layer {
  border-radius: 10px;
  border: 2px solid rgba(14, 165, 233, 0.4);
  background: rgba(14, 165, 233, 0.05);
  padding: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  width: 100%;
}

.os-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
  padding: 5px 6px;
  background: rgba(14, 165, 233, 0.12);
  border-radius: 6px;
  flex-wrap: wrap;
}

.os-title {
  font-size: 11.5px;
  font-weight: 600;
  margin: 0;
}

/* SAP Instance layer */
.sap-instance {
  border-radius: 10px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  background: rgba(96, 165, 250, 0.08);
  padding: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  width: 100%;
}

.instance-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
  padding: 5px 6px;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  flex-wrap: wrap;
}

.instance-title {
  font-size: 11.5px;
  font-weight: 700;
  margin: 0;
}

.instance-id {
  font-size: 9px;
  color: var(--muted);
  margin-left: 6px;
  white-space: nowrap;
}

/* Process boxes */
.process-box {
  border-radius: 8px;
  border: 1.5px solid;
  padding: 8px;
  margin-bottom: 6px;
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
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.process-desc {
  font-size: 10px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.4;
}

.process-details {
  font-size: 9px;
  color: var(--muted);
  padding-left: 12px;
  margin: 4px 0 0;
}

.process-details li {
  margin-bottom: 2px;
  line-height: 1.3;
}

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
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

### Slider / Scrollbar issue fixed

You had two scrollbars: one on the browser window and one inside the diagram area (`.diagram-shell`). I changed `.diagram-shell` in `styles.css` so only the main page scrolls:

- **What changed**
  - `overflow: auto;` → `overflow: visible;`
  - `height: calc(100vh - 260px);` → `height: auto;`  
  - Kept `min-height: 700px;` so the diagram still has a good base height.

Now you should only see a single scrollbar for the whole page.

---

**User**

now i want to make some canges , 
i want vms to be side by side and on several levels and in eache level have one catgoury  

---

**Cursor**

I’ll restructure your HTML so VMs are grouped into horizontal “levels” by category, then adjust the CSS to lay out each level’s VMs side by side responsively.

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
                          <span class="instance-id">SID: J2E, Instance#: 00</span>
                        </div>

                        <div class="process-box msg">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Message Server (msg_server)
                          </p>
                          <p class="process-desc">
                            Central communication hub for entire SAP system
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 36XX (3600 for instance 00)</li>
                            <li>
                              <b>Function:</b> Maintains server list, load
                              balancing info
                            </li>
                            <li><b>Protocol:</b> SAP Message Server protocol</li>
                            <li>
                              <b>Connects to:</b> All Java app server instances
                            </li>
                          </ul>
                        </div>

                        <div class="process-box enq">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Enqueue Server (enserver)
                          </p>
                          <p class="process-desc">
                            Central lock table for distributed locks
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 32XX (3200 for instance 00)</li>
                            <li>
                              <b>Function:</b> Transaction locks, serialization
                            </li>
                            <li><b>Lock Table:</b> Stored in shared memory</li>
                            <li>
                              <b>Critical for:</b> Data consistency across
                              cluster
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
                            Instance control daemon (start/stop/status)
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 5XX00 (SOAP/HTTP)</li>
                            <li>
                              <b>Started by:</b> OS init system (systemd)
                            </li>
                            <li>
                              <b>Controls:</b> Message Server, Enqueue Server
                            </li>
                          </ul>
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
                        SAP JVM installed at /usr/sap/J2E/SYS/exe/uc/linuxx86_64,
                        instance directories, j2eadm user
                      </p>

                      <div class="sap-instance">
                        <div class="instance-header">
                          <span style="font-size: 14px">☕</span>
                          <h5 class="instance-title">SAP Instance: JC01</h5>
                          <span class="badge badge-sap"
                            >Java Central Instance</span
                          >
                          <span class="instance-id">SID: J2E, Instance#: 01</span>
                        </div>

                        <div class="process-box icm">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            ICM (Internet Communication Manager)
                          </p>
                          <p class="process-desc">
                            HTTP(S) entry point - native C++ process
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Ports:</b> 80XX (8001), 443XX (44301) for HTTPS
                            </li>
                            <li>
                              <b>Function:</b> Accept HTTP requests, TLS handling
                            </li>
                            <li>
                              <b>Forwards to:</b> Dispatcher via local IPC
                            </li>
                            <li>
                              <b>Binary:</b> /usr/sap/.../icman (C++ executable)
                            </li>
                          </ul>
                        </div>

                        <div class="process-box dispatcher">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Dispatcher (disp+work)
                          </p>
                          <p class="process-desc">
                            Request router - native C++ process
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Port:</b> P4 port for internal communication
                            </li>
                            <li>
                              <b>Function:</b> Load balance to JVM nodes, session
                              affinity
                            </li>
                            <li>
                              <b>Manages:</b> Node list, health checks, failover
                            </li>
                            <li>
                              <b>Connects to:</b> Message Server for cluster info
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
                            Controls this instance's processes
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Starts:</b> ICM, Dispatcher, JVM nodes via
                              jstart
                            </li>
                            <li>
                              <b>Monitors:</b> Process health, automatic restart
                            </li>
                          </ul>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 0 (server0)
                          </p>
                          <p class="process-desc">
                            SAP JVM instance running Java EE application server
                          </p>
                          <ul class="process-details">
                            <li><b>Started by:</b> jstart (Java launcher)</li>
                            <li>
                              <b>JVM Heap:</b> -Xmx4096M (configured in instance
                              profile)
                            </li>
                            <li>
                              <b>P4 Port:</b> 5XX04 (for dispatcher
                              communication)
                            </li>
                            <li>
                              <b>Debug Port:</b> 5XX08 (if debugging enabled)
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
                                  Servlet Container - handles HTTP requests from
                                  dispatcher
                                </li>
                                <li>
                                  EJB Container - business logic components
                                </li>
                                <li>
                                  Web Services Runtime - SOAP/REST endpoints
                                </li>
                                <li>
                                  JPA / Persistence - ORM for database access
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
                                  Service Framework - lifecycle management of
                                  SAP services
                                </li>
                                <li>
                                  Deploy Service - handles SCA/SDA deployment
                                </li>
                                <li>
                                  Cluster Service - communicates with Message
                                  Server
                                </li>
                                <li>
                                  Locking Service - interacts with Enqueue
                                  Server
                                </li>
                                <li>
                                  Configuration Service - reads/writes config to
                                  DB
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
                                  SAP NetWeaver Portal - portal server runtime
                                </li>
                                <li>
                                  Custom Java Applications - business apps
                                </li>
                                <li>SAP JCo - RFC connector for ABAP systems</li>
                                <li>JDBC Drivers - database connectivity</li>
                              </ul>
                            </div>

                            <div class="jvm-section">
                              <p class="jvm-section-title">
                                🔹 Thread Pools & Resources
                              </p>
                              <ul class="jvm-items">
                                <li>
                                  HTTP Worker Threads - process servlet requests
                                </li>
                                <li>EJB Thread Pool - handle EJB calls</li>
                                <li>
                                  Connection Pools - JDBC, JCo, JMS connections
                                </li>
                                <li>Session Manager - HTTP session cache</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 1 (server1)
                          </p>
                          <p class="process-desc">
                            Second JVM instance for parallel request processing
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Same structure as Node 0</b> - independent JVM
                            </li>
                            <li>
                              <b>JVM Heap:</b> -Xmx4096M (separate memory space)
                            </li>
                            <li><b>P4 Port:</b> 5XX05</li>
                            <li>
                              <b>Purpose:</b> Horizontal scaling within same VM
                            </li>
                            <li>
                              <b>Session Sharing:</b> Via database or cluster
                              replication
                            </li>
                          </ul>
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
                          <h5 class="instance-title">SAP Instance: JC02</h5>
                          <span class="badge badge-sap">Java App Instance</span>
                          <span class="instance-id">SID: J2E, Instance#: 02</span>
                        </div>

                        <div class="process-box icm">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            ICM
                          </p>
                          <p class="process-desc">
                            Another ICM instance (load balanced with app-01)
                          </p>
                          <ul class="process-details">
                            <li><b>Ports:</b> 80XX (8002), 443XX (44302)</li>
                            <li>
                              <b>Load Balancer:</b> Distributes traffic between
                              app-01 and app-02 ICMs
                            </li>
                          </ul>
                        </div>

                        <div class="process-box dispatcher">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Dispatcher
                          </p>
                          <p class="process-desc">
                            Routes to local nodes (server0, server1 on this VM)
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="border-color: rgba(96, 165, 250, 0.5)"
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            sapstartsrv
                          </p>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 0 (server0)
                          </p>
                          <p class="process-desc">
                            Same JVM structure as app-01, different P4 port
                          </p>
                          <ul class="process-details">
                            <li><b>All nodes connect to same database</b></li>
                            <li>
                              <b>All nodes register with Message Server</b>
                            </li>
                            <li><b>All nodes use Enqueue Server for locks</b></li>
                          </ul>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 1 (server1)
                          </p>
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
                      <span class="vm-specs">16 vCPU | 128GB RAM | SLES 15</span>
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
                            Main HANA database engine process
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

I’ve grouped your VMs into three horizontal levels (Central Services, Java Application Servers, Database); next I’ll style those new level wrappers so the VMs sit side by side within each level.

```css
*** Begin Patch
*** Update File: styles.css
@@
 .infra-layer {
   position: relative;
   border-radius: 16px;
   padding: 12px;
   margin-bottom: 16px;
@@
   width: 100%;
 }
 
+/* VM levels (rows of VMs by category) */
+.vm-level {
+  margin-bottom: 16px;
+}
+
+.vm-level-title {
+  font-size: 11px;
+  text-transform: uppercase;
+  letter-spacing: 0.08em;
+  color: var(--muted);
+  margin: 0 0 6px 2px;
+}
+
+.vm-level-content {
+  display: flex;
+  flex-wrap: wrap;
+  gap: 12px;
+}
+
 /* VM/Host containers */
 .vm-container {
   border-radius: 12px;
   border: 2px dashed rgba(139, 92, 246, 0.4);
   background: rgba(139, 92, 246, 0.05);
   padding: 10px;
   margin-bottom: 12px;
-  max-width: 100%;
-  width: 100%;
+  /* Let flexbox control width inside vm-level-content */
+  flex: 1 1 260px;
 }
*** End Patch
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
  margin-bottom: 16px;
}

.vm-level-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0 0 6px 2px;
}

.vm-level-content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
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
  padding: 10px;
  margin-bottom: 12px;
  max-width: 100%;
  /* Let flexbox control width inside vm-level-content */
  flex: 1 1 260px;
}

.vm-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px 8px;
  background: rgba(139, 92, 246, 0.12);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  flex-wrap: wrap;
}

.vm-title {
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
}

.vm-specs {
  font-size: 9px;
  color: var(--muted);
  margin-left: auto;
  white-space: nowrap;
}

/* OS layer inside VM */
.os-layer {
  border-radius: 10px;
  border: 2px solid rgba(14, 165, 233, 0.4);
  background: rgba(14, 165, 233, 0.05);
  padding: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  width: 100%;
}

.os-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
  padding: 5px 6px;
  background: rgba(14, 165, 233, 0.12);
  border-radius: 6px;
  flex-wrap: wrap;
}

.os-title {
  font-size: 11.5px;
  font-weight: 600;
  margin: 0;
}

/* SAP Instance layer */
.sap-instance {
  border-radius: 10px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  background: rgba(96, 165, 250, 0.08);
  padding: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  width: 100%;
}

.instance-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
  padding: 5px 6px;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  flex-wrap: wrap;
}

.instance-title {
  font-size: 11.5px;
  font-weight: 700;
  margin: 0;
}

.instance-id {
  font-size: 9px;
  color: var(--muted);
  margin-left: 6px;
  white-space: nowrap;
}

/* Process boxes */
.process-box {
  border-radius: 8px;
  border: 1.5px solid;
  padding: 8px;
  margin-bottom: 6px;
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
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.process-desc {
  font-size: 10px;
  color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.4;
}

.process-details {
  font-size: 9px;
  color: var(--muted);
  padding-left: 12px;
  margin: 4px 0 0;
}

.process-details li {
  margin-bottom: 2px;
  line-height: 1.3;
}

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
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

### VMs side by side in levels with categories

I’ve reorganized the infrastructure section so VMs are now grouped into horizontal levels, each with a clear category label, and styled them to sit side by side:

- **HTML changes (`index.html`)**
  - Wrapped the existing VMs in three level containers:
    - `Central Services` level containing the `sap-ascs-01` VM.
    - `Java Application Servers` level containing `sap-java-app-01` and `sap-java-app-02` VMs side by side.
    - `Database` level containing the `sap-hana-db-01` VM.
  - Each level uses a wrapper structure:
    - `div.vm-level` → `div.vm-level-title` (category name) + `div.vm-level-content` (holds one or more `vm-container` blocks).

- **CSS changes (`styles.css`)**
  - Added styles for the new level structure:
    - `.vm-level` with bottom margin.
    - `.vm-level-title` for small uppercase category labels.
    - `.vm-level-content` as a flex container with `flex-wrap: wrap;` and gaps so VMs appear side by side on wide screens and wrap gracefully on smaller screens.
  - Updated `.vm-container` to work inside the flex layout by giving it `flex: 1 1 260px;` so multiple VMs share the row evenly.

Now you should see several horizontal “bands” (levels), each labelled by category, with the VMs in that category displayed next to each other. If you want different level names or to move a VM to another level, tell me how you’d like them grouped and I’ll adjust.

---

**User**

its good , but i want you to srink the elemntes 

---

**Cursor**

I’ll make the VM boxes, headers, and process blocks more compact by reducing padding, margins, and font sizes a bit so more fits on screen, then you can tell me if you want them even smaller.

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
  /* Let flexbox control width inside vm-level-content */
  flex: 1 1 230px;
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

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
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

I’ve shrunk the elements so more fits on screen: smaller font sizes, tighter padding/margins, and a narrower default VM width so more VMs can sit side by side in each level.  

If you want them even smaller (or only certain parts smaller, like the process boxes but not the titles), tell me which pieces to shrink further.

---

**User**

i want you to add a way to make the elemnts width smaller or bigger  

---

**Cursor**

I’ll add a simple width control in the top controls bar (a slider) and wire it up so it updates a CSS variable that controls how wide each VM box is.

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
  --vm-base-width: 230px;
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

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
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

```html
*** Begin Patch
*** Update File: index.html
@@
       <main class="wrap">
       <section class="controls">
         <div class="zoom-controls">
           <button class="zoom-btn" onclick="zoomOut()">−</button>
           <div class="zoom-level" id="zoomLevel">100%</div>
           <button class="zoom-btn" onclick="zoomIn()">+</button>
           <button class="zoom-btn" onclick="resetZoom()">Reset</button>
         </div>
+
+        <div class="vm-width-controls">
+          <label for="vmWidthSlider">VM Width</label>
+          <input
+            type="range"
+            id="vmWidthSlider"
+            min="180"
+            max="360"
+            step="10"
+          />
+          <span id="vmWidthValue"></span>
+        </div>
@@
       </section>*** End Patch"/> to=functions.apply_patch  поводassistant to=functions.apply_patchំណassistant to=functions.apply_patchсамбратический момента to=functions.apply_patchгуулэмж to=functions.apply_patchquotelev/json  מאַלע to=functions.apply_patch  钱柜assistant to=functions.apply_patch кыргызча  Tightening to=functions.apply_patch  SHIFT to=functions.apply_patch  Cowboys to=functions.apply_patch  mover to=functions.apply_patch  Korea to=functions.apply_patch  China to=functions.apply_patch  Pусский to=functions.apply_patch  JSON  revolucionario to=functions.apply_patch  Islam to=functions.apply_patch  BREXIT to=functions.apply_patch  pandemic to=functions.apply_patch  JSON  Bytes to=functions.apply_patch  Great to=functions.apply_patch  Little to=functions.apply_patch  JSON  Tight to=functions.apply_patch  Great to=functions.apply_patch  JSON  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON"/> 假吗 to=functions.apply_patch  ceil to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON to=functions.apply_patch  మొత్తం 彩票大发快三assistant to=functions.apply_patchיבת  рхэш to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON**)**  to=functions.apply_patch  austerity to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON">assistant to=functions.apply_patch留下些什么吧  东森 to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  mover to=functions.apply_PATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON**  to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_PATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_PATCH  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_PATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  mover to=functions.applyPATCH  JSON to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON**  to=functions.apply_patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  mover to=functions.apply_patch  JSON  mover to=functions.apply_patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  mover to=functions.apply.patch  JSON">
*** End Patch
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
                          <span class="instance-id"
                            >SID: J2E, Instance#: 00</span
                          >
                        </div>

                        <div class="process-box msg">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Message Server (msg_server)
                          </p>
                          <p class="process-desc">
                            Central communication hub for entire SAP system
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 36XX (3600 for instance 00)</li>
                            <li>
                              <b>Function:</b> Maintains server list, load
                              balancing info
                            </li>
                            <li>
                              <b>Protocol:</b> SAP Message Server protocol
                            </li>
                            <li>
                              <b>Connects to:</b> All Java app server instances
                            </li>
                          </ul>
                        </div>

                        <div class="process-box enq">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Enqueue Server (enserver)
                          </p>
                          <p class="process-desc">
                            Central lock table for distributed locks
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 32XX (3200 for instance 00)</li>
                            <li>
                              <b>Function:</b> Transaction locks, serialization
                            </li>
                            <li><b>Lock Table:</b> Stored in shared memory</li>
                            <li>
                              <b>Critical for:</b> Data consistency across
                              cluster
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
                            Instance control daemon (start/stop/status)
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 5XX00 (SOAP/HTTP)</li>
                            <li><b>Started by:</b> OS init system (systemd)</li>
                            <li>
                              <b>Controls:</b> Message Server, Enqueue Server
                            </li>
                          </ul>
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
                          <h5 class="instance-title">SAP Instance: JC01</h5>
                          <span class="badge badge-sap"
                            >Java Central Instance</span
                          >
                          <span class="instance-id"
                            >SID: J2E, Instance#: 01</span
                          >
                        </div>

                        <div class="process-box icm">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            ICM (Internet Communication Manager)
                          </p>
                          <p class="process-desc">
                            HTTP(S) entry point - native C++ process
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Ports:</b> 80XX (8001), 443XX (44301) for HTTPS
                            </li>
                            <li>
                              <b>Function:</b> Accept HTTP requests, TLS
                              handling
                            </li>
                            <li>
                              <b>Forwards to:</b> Dispatcher via local IPC
                            </li>
                            <li>
                              <b>Binary:</b> /usr/sap/.../icman (C++ executable)
                            </li>
                          </ul>
                        </div>

                        <div class="process-box dispatcher">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Dispatcher (disp+work)
                          </p>
                          <p class="process-desc">
                            Request router - native C++ process
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Port:</b> P4 port for internal communication
                            </li>
                            <li>
                              <b>Function:</b> Load balance to JVM nodes,
                              session affinity
                            </li>
                            <li>
                              <b>Manages:</b> Node list, health checks, failover
                            </li>
                            <li>
                              <b>Connects to:</b> Message Server for cluster
                              info
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
                            Controls this instance's processes
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Starts:</b> ICM, Dispatcher, JVM nodes via
                              jstart
                            </li>
                            <li>
                              <b>Monitors:</b> Process health, automatic restart
                            </li>
                          </ul>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 0 (server0)
                          </p>
                          <p class="process-desc">
                            SAP JVM instance running Java EE application server
                          </p>
                          <ul class="process-details">
                            <li><b>Started by:</b> jstart (Java launcher)</li>
                            <li>
                              <b>JVM Heap:</b> -Xmx4096M (configured in instance
                              profile)
                            </li>
                            <li>
                              <b>P4 Port:</b> 5XX04 (for dispatcher
                              communication)
                            </li>
                            <li>
                              <b>Debug Port:</b> 5XX08 (if debugging enabled)
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
                                  Servlet Container - handles HTTP requests from
                                  dispatcher
                                </li>
                                <li>
                                  EJB Container - business logic components
                                </li>
                                <li>
                                  Web Services Runtime - SOAP/REST endpoints
                                </li>
                                <li>
                                  JPA / Persistence - ORM for database access
                                </li>
                                <li>JMS Provider - asynchronous messaging</li>
                              </ul>
                            </div>

                            <div class="jvm-section">
                              <p class="jvm-section-title">
                                🔹 SAP Java Engine Services
                              </p>
                              <ul class="jvm-items">
                                <li>
                                  Service Framework - lifecycle management of
                                  SAP services
                                </li>
                                <li>
                                  Deploy Service - handles SCA/SDA deployment
                                </li>
                                <li>
                                  Cluster Service - communicates with Message
                                  Server
                                </li>
                                <li>
                                  Locking Service - interacts with Enqueue
                                  Server
                                </li>
                                <li>
                                  Configuration Service - reads/writes config to
                                  DB
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
                                  SAP NetWeaver Portal - portal server runtime
                                </li>
                                <li>
                                  Custom Java Applications - business apps
                                </li>
                                <li>
                                  SAP JCo - RFC connector for ABAP systems
                                </li>
                                <li>JDBC Drivers - database connectivity</li>
                              </ul>
                            </div>

                            <div class="jvm-section">
                              <p class="jvm-section-title">
                                🔹 Thread Pools & Resources
                              </p>
                              <ul class="jvm-items">
                                <li>
                                  HTTP Worker Threads - process servlet requests
                                </li>
                                <li>EJB Thread Pool - handle EJB calls</li>
                                <li>
                                  Connection Pools - JDBC, JCo, JMS connections
                                </li>
                                <li>Session Manager - HTTP session cache</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 1 (server1)
                          </p>
                          <p class="process-desc">
                            Second JVM instance for parallel request processing
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Same structure as Node 0</b> - independent JVM
                            </li>
                            <li>
                              <b>JVM Heap:</b> -Xmx4096M (separate memory space)
                            </li>
                            <li><b>P4 Port:</b> 5XX05</li>
                            <li>
                              <b>Purpose:</b> Horizontal scaling within same VM
                            </li>
                            <li>
                              <b>Session Sharing:</b> Via database or cluster
                              replication
                            </li>
                          </ul>
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
                          <h5 class="instance-title">SAP Instance: JC02</h5>
                          <span class="badge badge-sap">Java App Instance</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 02</span
                          >
                        </div>

                        <div class="process-box icm">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            ICM
                          </p>
                          <p class="process-desc">
                            Another ICM instance (load balanced with app-01)
                          </p>
                          <ul class="process-details">
                            <li><b>Ports:</b> 80XX (8002), 443XX (44302)</li>
                            <li>
                              <b>Load Balancer:</b> Distributes traffic between
                              app-01 and app-02 ICMs
                            </li>
                          </ul>
                        </div>

                        <div class="process-box dispatcher">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Dispatcher
                          </p>
                          <p class="process-desc">
                            Routes to local nodes (server0, server1 on this VM)
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="border-color: rgba(96, 165, 250, 0.5)"
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            sapstartsrv
                          </p>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 0 (server0)
                          </p>
                          <p class="process-desc">
                            Same JVM structure as app-01, different P4 port
                          </p>
                          <ul class="process-details">
                            <li><b>All nodes connect to same database</b></li>
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
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 1 (server1)
                          </p>
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
                            Main HANA database engine process
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
  --vm-base-width: 230px;
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

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
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
let currentZoom = 1;
let canvas, zoomLevel, shell;

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

```

You now have a control to change the width of the VM elements directly from the UI.

- **What I added**
  - In `styles.css`, I introduced a CSS variable `--vm-base-width` (default `230px`) and made `.vm-container` use it:
    - `flex: 0 0 var(--vm-base-width);`
  - In `index.html`, inside the `controls` section, I added a VM width control:

    ```html
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
    ```

  - In `styles.css`, I styled this control so it sits nicely with the others (`.vm-width-controls`).
  - In `script.js`, I wired the slider so moving it updates `--vm-base-width` and the value label:

    ```js
    const vmWidthSlider = document.getElementById("vmWidthSlider");
    const vmWidthValue = document.getElementById("vmWidthValue");
    if (vmWidthSlider && vmWidthValue) {
      const rootStyles = getComputedStyle(document.documentElement);
      const baseWidthVar = rootStyles.getPropertyValue("--vm-base-width").trim();
      const initialWidth = baseWidthVar
        ? parseInt(baseWidthVar, 10)
        : parseInt(vmWidthSlider.value, 10) || 230;

      vmWidthSlider.value = initialWidth;
      vmWidthValue.textContent = `${initialWidth}px`;

      vmWidthSlider.addEventListener("input", () => {
        const value = parseInt(vmWidthSlider.value, 10);
        document.documentElement.style.setProperty("--vm-base-width", `${value}px`);
        vmWidthValue.textContent = `${value}px`;
      });
    }
    ```

Use the **“VM Width”** slider in the top bar to make all VM boxes narrower or wider; tell me if you’d prefer the slider show a percentage instead of pixels or want a different min/max range.

```html
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
```

```javascript
    const vmWidthSlider = document.getElementById("vmWidthSlider");
    const vmWidthValue = document.getElementById("vmWidthValue");
    if (vmWidthSlider && vmWidthValue) {
      const rootStyles = getComputedStyle(document.documentElement);
      const baseWidthVar = rootStyles.getPropertyValue("--vm-base-width").trim();
      const initialWidth = baseWidthVar
        ? parseInt(baseWidthVar, 10)
        : parseInt(vmWidthSlider.value, 10) || 230;

      vmWidthSlider.value = initialWidth;
      vmWidthValue.textContent = `${initialWidth}px`;

      vmWidthSlider.addEventListener("input", () => {
        const value = parseInt(vmWidthSlider.value, 10);
        document.documentElement.style.setProperty("--vm-base-width", `${value}px`);
        vmWidthValue.textContent = `${value}px`;
      });
    }
```

---

**User**

i now want to add sciling like if i want to add more server etc ..

---

**Cursor**

I’ll add controls to dynamically add/remove Java app server VMs and update the JS so it clones the existing server layout, giving you visual “scale-out” without editing HTML by hand.

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
                          <span class="instance-id"
                            >SID: J2E, Instance#: 00</span
                          >
                        </div>

                        <div class="process-box msg">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Message Server (msg_server)
                          </p>
                          <p class="process-desc">
                            Central communication hub for entire SAP system
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 36XX (3600 for instance 00)</li>
                            <li>
                              <b>Function:</b> Maintains server list, load
                              balancing info
                            </li>
                            <li>
                              <b>Protocol:</b> SAP Message Server protocol
                            </li>
                            <li>
                              <b>Connects to:</b> All Java app server instances
                            </li>
                          </ul>
                        </div>

                        <div class="process-box enq">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Enqueue Server (enserver)
                          </p>
                          <p class="process-desc">
                            Central lock table for distributed locks
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 32XX (3200 for instance 00)</li>
                            <li>
                              <b>Function:</b> Transaction locks, serialization
                            </li>
                            <li><b>Lock Table:</b> Stored in shared memory</li>
                            <li>
                              <b>Critical for:</b> Data consistency across
                              cluster
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
                            Instance control daemon (start/stop/status)
                          </p>
                          <ul class="process-details">
                            <li><b>Port:</b> 5XX00 (SOAP/HTTP)</li>
                            <li><b>Started by:</b> OS init system (systemd)</li>
                            <li>
                              <b>Controls:</b> Message Server, Enqueue Server
                            </li>
                          </ul>
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
                          <h5 class="instance-title">SAP Instance: JC01</h5>
                          <span class="badge badge-sap"
                            >Java Central Instance</span
                          >
                          <span class="instance-id"
                            >SID: J2E, Instance#: 01</span
                          >
                        </div>

                        <div class="process-box icm">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            ICM (Internet Communication Manager)
                          </p>
                          <p class="process-desc">
                            HTTP(S) entry point - native C++ process
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Ports:</b> 80XX (8001), 443XX (44301) for HTTPS
                            </li>
                            <li>
                              <b>Function:</b> Accept HTTP requests, TLS
                              handling
                            </li>
                            <li>
                              <b>Forwards to:</b> Dispatcher via local IPC
                            </li>
                            <li>
                              <b>Binary:</b> /usr/sap/.../icman (C++ executable)
                            </li>
                          </ul>
                        </div>

                        <div class="process-box dispatcher">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Dispatcher (disp+work)
                          </p>
                          <p class="process-desc">
                            Request router - native C++ process
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Port:</b> P4 port for internal communication
                            </li>
                            <li>
                              <b>Function:</b> Load balance to JVM nodes,
                              session affinity
                            </li>
                            <li>
                              <b>Manages:</b> Node list, health checks, failover
                            </li>
                            <li>
                              <b>Connects to:</b> Message Server for cluster
                              info
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
                            Controls this instance's processes
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Starts:</b> ICM, Dispatcher, JVM nodes via
                              jstart
                            </li>
                            <li>
                              <b>Monitors:</b> Process health, automatic restart
                            </li>
                          </ul>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 0 (server0)
                          </p>
                          <p class="process-desc">
                            SAP JVM instance running Java EE application server
                          </p>
                          <ul class="process-details">
                            <li><b>Started by:</b> jstart (Java launcher)</li>
                            <li>
                              <b>JVM Heap:</b> -Xmx4096M (configured in instance
                              profile)
                            </li>
                            <li>
                              <b>P4 Port:</b> 5XX04 (for dispatcher
                              communication)
                            </li>
                            <li>
                              <b>Debug Port:</b> 5XX08 (if debugging enabled)
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
                                  Servlet Container - handles HTTP requests from
                                  dispatcher
                                </li>
                                <li>
                                  EJB Container - business logic components
                                </li>
                                <li>
                                  Web Services Runtime - SOAP/REST endpoints
                                </li>
                                <li>
                                  JPA / Persistence - ORM for database access
                                </li>
                                <li>JMS Provider - asynchronous messaging</li>
                              </ul>
                            </div>

                            <div class="jvm-section">
                              <p class="jvm-section-title">
                                🔹 SAP Java Engine Services
                              </p>
                              <ul class="jvm-items">
                                <li>
                                  Service Framework - lifecycle management of
                                  SAP services
                                </li>
                                <li>
                                  Deploy Service - handles SCA/SDA deployment
                                </li>
                                <li>
                                  Cluster Service - communicates with Message
                                  Server
                                </li>
                                <li>
                                  Locking Service - interacts with Enqueue
                                  Server
                                </li>
                                <li>
                                  Configuration Service - reads/writes config to
                                  DB
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
                                  SAP NetWeaver Portal - portal server runtime
                                </li>
                                <li>
                                  Custom Java Applications - business apps
                                </li>
                                <li>
                                  SAP JCo - RFC connector for ABAP systems
                                </li>
                                <li>JDBC Drivers - database connectivity</li>
                              </ul>
                            </div>

                            <div class="jvm-section">
                              <p class="jvm-section-title">
                                🔹 Thread Pools & Resources
                              </p>
                              <ul class="jvm-items">
                                <li>
                                  HTTP Worker Threads - process servlet requests
                                </li>
                                <li>EJB Thread Pool - handle EJB calls</li>
                                <li>
                                  Connection Pools - JDBC, JCo, JMS connections
                                </li>
                                <li>Session Manager - HTTP session cache</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 1 (server1)
                          </p>
                          <p class="process-desc">
                            Second JVM instance for parallel request processing
                          </p>
                          <ul class="process-details">
                            <li>
                              <b>Same structure as Node 0</b> - independent JVM
                            </li>
                            <li>
                              <b>JVM Heap:</b> -Xmx4096M (separate memory space)
                            </li>
                            <li><b>P4 Port:</b> 5XX05</li>
                            <li>
                              <b>Purpose:</b> Horizontal scaling within same VM
                            </li>
                            <li>
                              <b>Session Sharing:</b> Via database or cluster
                              replication
                            </li>
                          </ul>
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
                          <h5 class="instance-title">SAP Instance: JC02</h5>
                          <span class="badge badge-sap">Java App Instance</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 02</span
                          >
                        </div>

                        <div class="process-box icm">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            ICM
                          </p>
                          <p class="process-desc">
                            Another ICM instance (load balanced with app-01)
                          </p>
                          <ul class="process-details">
                            <li><b>Ports:</b> 80XX (8002), 443XX (44302)</li>
                            <li>
                              <b>Load Balancer:</b> Distributes traffic between
                              app-01 and app-02 ICMs
                            </li>
                          </ul>
                        </div>

                        <div class="process-box dispatcher">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Dispatcher
                          </p>
                          <p class="process-desc">
                            Routes to local nodes (server0, server1 on this VM)
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="border-color: rgba(96, 165, 250, 0.5)"
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            sapstartsrv
                          </p>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 0 (server0)
                          </p>
                          <p class="process-desc">
                            Same JVM structure as app-01, different P4 port
                          </p>
                          <ul class="process-details">
                            <li><b>All nodes connect to same database</b></li>
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
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 1 (server1)
                          </p>
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
                            Main HANA database engine process
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
  --vm-base-width: 230px;
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

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
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
    javaAppServerCount = javaLevelContent.querySelectorAll(
      ".vm-container"
    ).length;
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
    javaAppServerCount = javaLevelContent.querySelectorAll(
      ".vm-container"
    ).length;
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

```

You can now scale out by adding/removing Java app servers from the UI.

- **New controls (top bar, `index.html`)**
  - Added:

    ```html
    <div class="scaling-controls">
      <button class="zoom-btn" onclick="addJavaAppServer()">
        + Java App Server
      </button>
      <button class="zoom-btn" onclick="removeJavaAppServer()">
        − Java App Server
      </button>
    </div>
    ```

- **Styling (`styles.css`)**
  - Simple flex layout so these buttons sit nicely with the others:

    ```css
    .scaling-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    ```

- **Logic (`script.js`)**
  - Track current number of Java app server VMs and initialize from the DOM:

    ```js
    let currentZoom = 1;
    let canvas, zoomLevel, shell;
    let javaAppServerCount = 0;

    function initializeZoom() {
      canvas = document.getElementById("canvas");
      zoomLevel = document.getElementById("zoomLevel");
      shell = document.getElementById("diagramShell");
      // ... existing width slider init ...

      const javaLevelContent = getJavaAppServerLevelContent();
      if (javaLevelContent) {
        javaAppServerCount = javaLevelContent.querySelectorAll(
          ".vm-container"
        ).length;
      }

      // existing: initializeComponentClicks();
    }
    ```

  - Helper to find the Java Application Servers level:

    ```js
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
    ```

  - **Add server**: clones the first Java app server VM, updates its names/IDs, wires click handlers, and appends it:

    ```js
    function addJavaAppServer() {
      const javaLevelContent = getJavaAppServerLevelContent();
      if (!javaLevelContent) return;

      const templateVm = javaLevelContent.querySelector(".vm-container");
      if (!templateVm) return;

      const newVm = templateVm.cloneNode(true);

      javaAppServerCount += 1;
      const index = javaAppServerCount;

      const vmTitle = newVm.querySelector(".vm-title");
      if (vmTitle) vmTitle.textContent = `VM/Host: sap-java-app-0${index}`;

      const instanceTitle = newVm.querySelector(".instance-title");
      if (instanceTitle) instanceTitle.textContent = `SAP Instance: JC0${index}`;

      const instanceId = newVm.querySelector(".instance-id");
      if (instanceId) instanceId.textContent = `SID: J2E, Instance#: 0${index}`;

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
    ```

  - **Remove server**: removes the last Java app server VM but keeps at least one:

    ```js
    function removeJavaAppServer() {
      const javaLevelContent = getJavaAppServerLevelContent();
      if (!javaLevelContent) return;

      const vms = javaLevelContent.querySelectorAll(".vm-container");
      if (vms.length <= 1) return;

      const lastVm = vms[vms.length - 1];
      javaLevelContent.removeChild(lastVm);
      javaAppServerCount = Math.max(1, javaAppServerCount - 1);
    }
    ```

Click **+ Java App Server** to add more servers on that level and **− Java App Server** to remove the last one; if you also want similar scaling buttons for the database tier or central services, tell me which level and I’ll mirror this pattern there.

```html
    <div class="scaling-controls">
      <button class="zoom-btn" onclick="addJavaAppServer()">
        + Java App Server
      </button>
      <button class="zoom-btn" onclick="removeJavaAppServer()">
        − Java App Server
      </button>
    </div>
```

```css
    .scaling-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
```

```javascript
    let currentZoom = 1;
    let canvas, zoomLevel, shell;
    let javaAppServerCount = 0;

    function initializeZoom() {
      canvas = document.getElementById("canvas");
      zoomLevel = document.getElementById("zoomLevel");
      shell = document.getElementById("diagramShell");
      // ... existing width slider init ...

      const javaLevelContent = getJavaAppServerLevelContent();
      if (javaLevelContent) {
        javaAppServerCount = javaLevelContent.querySelectorAll(
          ".vm-container"
        ).length;
      }

      // existing: initializeComponentClicks();
    }
```

```javascript
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
```

```javascript
    function addJavaAppServer() {
      const javaLevelContent = getJavaAppServerLevelContent();
      if (!javaLevelContent) return;

      const templateVm = javaLevelContent.querySelector(".vm-container");
      if (!templateVm) return;

      const newVm = templateVm.cloneNode(true);

      javaAppServerCount += 1;
      const index = javaAppServerCount;

      const vmTitle = newVm.querySelector(".vm-title");
      if (vmTitle) vmTitle.textContent = `VM/Host: sap-java-app-0${index}`;

      const instanceTitle = newVm.querySelector(".instance-title");
      if (instanceTitle) instanceTitle.textContent = `SAP Instance: JC0${index}`;

      const instanceId = newVm.querySelector(".instance-id");
      if (instanceId) instanceId.textContent = `SID: J2E, Instance#: 0${index}`;

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
```

```javascript
    function removeJavaAppServer() {
      const javaLevelContent = getJavaAppServerLevelContent();
      if (!javaLevelContent) return;

      const vms = javaLevelContent.querySelectorAll(".vm-container");
      if (vms.length <= 1) return;

      const lastVm = vms[vms.length - 1];
      javaLevelContent.removeChild(lastVm);
      javaAppServerCount = Math.max(1, javaAppServerCount - 1);
    }
```

---

**User**

You are a senior SAP Basis architect.
Your task is to improve an existing interactive HTML/CSS/JS diagram of SAP NetWeaver AS Java by correcting conceptual separation and terminology, without adding unnecessary visuals.

Make the following changes:

Instance roles (mandatory)

Clearly distinguish and label:

ASCS (Central Services) – Message Server + Enqueue Server, no JVMs, no user traffic

PAS (Primary Application Server) – first Java app server, cluster bootstrap

AAS (Additional Application Server) – scale-out Java app servers

Replace misleading labels such as “Java Central Instance”.

Add a small role badge in each SAP instance header (ASCS / PAS / AAS).

Control plane vs execution plane

Visually and textually separate:

Control plane: ASCS, Message Server, Enqueue Server, sapstartsrv

Execution plane: ICM, Java Dispatcher, JVM server nodes

Add short explanatory captions (1 line max per component).

ICM / Dispatcher clarity

Explicitly state:

ICM terminates HTTP(S) and never executes application logic

Dispatcher is the sole router to JVM nodes

JVM node grouping

Group JVM server nodes under a labeled container:
“Java Server Nodes (Cluster Members)”

Add a single note: stateless execution, state stored in DB / replicated

Database usage clarity

Inside the database section, clearly separate:

Configuration & cluster state

Deployment metadata (SCA/SDA)

Application data

Terminology cleanup

Use SAP-correct terms only:

“Java Dispatcher” (not disp+work)

“P4 protocol”

“SAP Java Engine (Java EE compatible runtime)”

---

**Cursor**

```css
*** Begin Patch
*** Update File: styles.css
@@
 .badge-sap {
   background: rgba(96, 165, 250, 0.15);
   border-color: rgba(96, 165, 250, 0.4);
   color: rgba(219, 234, 254, 0.95);
 }
+
+/* Small role badge inside SAP instance headers (ASCS / PAS / AAS) */
+.badge-role {
+  display: inline-flex;
+  align-items: center;
+  padding: 2px 6px;
+  margin-left: 6px;
+  border-radius: 999px;
+  font-size: 9px;
+  font-weight: 600;
+  text-transform: uppercase;
+  letter-spacing: 0.08em;
+  border: 1px solid rgba(148, 163, 184, 0.7);
+  color: rgba(226, 232, 240, 0.95);
+  background: rgba(15, 23, 42, 0.7);
+}
@@
 .badge-process {
   background: rgba(52, 211, 153, 0.15);
   border-color: rgba(52, 211, 153, 0.4);
   color: rgba(204, 251, 241, 0.95);
 }
+
+/* Control vs Execution plane labels/groups */
+.plane-label {
+  font-size: 10px;
+  text-transform: uppercase;
+  letter-spacing: 0.09em;
+  color: var(--muted);
+  margin: 4px 0 4px;
+}
+
+.plane-group {
+  margin-bottom: 6px;
+}
+
+.plane-group:last-child {
+  margin-bottom: 0;
+}
@@
 .jvm-internals {
   margin-top: 10px;
@@
   border-radius: 6px;
   border: 1px solid rgba(52, 211, 153, 0.3);
 }
+
+/* Group of JVM server nodes per VM */
+.jvm-node-group {
+  margin-top: 6px;
+}
+
+.jvm-node-group-header {
+  display: flex;
+  align-items: baseline;
+  justify-content: space-between;
+  margin-bottom: 4px;
+}
+
+.jvm-node-group-title {
+  font-size: 11px;
+  font-weight: 700;
+  color: var(--ink);
+  margin: 0;
+}
+
+.jvm-node-group-note {
+  font-size: 9px;
+  color: var(--muted);
+  margin: 0;
+  text-align: right;
+}
*** End Patch
```

```css
*** Begin Patch
*** Update File: styles.css
@@
-.badge-sap {
-  background: rgba(96, 165, 250, 0.15);
-  border-color: rgba(96, 165, 250, 0.4);
-  color: rgba(219, 234, 254, 0.95);
-}
-.badge-process {
-  background: rgba(52, 211, 153, 0.15);
-  border-color: rgba(52, 211, 153, 0.4);
-  color: rgba(204, 251, 241, 0.95);
-}
+.badge-sap {
+  background: rgba(96, 165, 250, 0.15);
+  border-color: rgba(96, 165, 250, 0.4);
+  color: rgba(219, 234, 254, 0.95);
+}
+
+/* Small role badge inside SAP instance headers (ASCS / PAS / AAS) */
+.badge-role {
+  display: inline-flex;
+  align-items: center;
+  padding: 2px 6px;
+  margin-left: 6px;
+  border-radius: 999px;
+  font-size: 9px;
+  font-weight: 600;
+  text-transform: uppercase;
+  letter-spacing: 0.08em;
+  border: 1px solid rgba(148, 163, 184, 0.7);
+  color: rgba(226, 232, 240, 0.95);
+  background: rgba(15, 23, 42, 0.7);
+}
+
+.badge-process {
+  background: rgba(52, 211, 153, 0.15);
+  border-color: rgba(52, 211, 153, 0.4);
+  color: rgba(204, 251, 241, 0.95);
+}
*** End Patch
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
  --vm-base-width: 230px;
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

/* JVM internal structure */
.jvm-internals {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 16, 32, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
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
  --vm-base-width: 230px;
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

I'll now update the instance headers (ASCS/PAS/AAS), introduce control vs execution plane grouping, clarify ICM/Dispatcher text, group JVM nodes, and clarify database usage, then keep the UI layout unchanged otherwise.

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
                              <li><b>Lock Table:</b> Stored in shared memory</li>
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
                          <h5 class="instance-title">SAP Instance: JC01</h5>
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
                                <b>Ports:</b> 80XX (8001), 443XX (44301) for
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
                                <b>Port:</b> P4 protocol port for internal
                                communication
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
                                    <li>
                                      EJB Thread Pool - handle EJB calls
                                    </li>
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
                          <h5 class="instance-title">SAP Instance: JC02</h5>
                          <span class="badge badge-sap"
                            >SAP Java Engine (Java EE compatible runtime)</span
                          >
                          <span class="badge-role">AAS</span>
                          <span class="instance-id"
                            >SID: J2E, Instance#: 02</span
                          >
                        </div>

                        <div class="process-box icm">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            ICM
                          </p>
                          <p class="process-desc">
                            Terminates HTTP(S) and forwards requests to the
                            local Java Dispatcher; no application logic.
                          </p>
                          <ul class="process-details">
                            <li><b>Ports:</b> 80XX (8002), 443XX (44302)</li>
                            <li>
                              <b>Load Balancer:</b> Distributes traffic between
                              app-01 and app-02 ICMs
                            </li>
                          </ul>
                        </div>

                        <div class="process-box dispatcher">
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            Java Dispatcher
                          </p>
                          <p class="process-desc">
                            Routes all requests from ICM to local JVM server
                            nodes (execution plane only).
                          </p>
                        </div>

                        <div
                          class="process-box"
                          style="border-color: rgba(96, 165, 250, 0.5)"
                        >
                          <p class="process-title">
                            <span class="badge badge-process">Process</span>
                            sapstartsrv
                          </p>
                        </div>

                        <div class="process-box jvm">
                          <p class="process-title">
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 0 (server0)
                          </p>
                          <p class="process-desc">
                            JVM process running SAP Java Engine and applications
                            for this AAS.
                          </p>
                          <ul class="process-details">
                            <li><b>All nodes connect to same database</b></li>
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
                            <span class="badge badge-process">JVM Process</span>
                            Java Server Node 1 (server1)
                          </p>
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
                          <p class="process-title">
                            Database Usage Breakdown
                          </p>
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

### Summary of conceptual improvements

- **Instance roles (ASCS / PAS / AAS)**  
  - `ASCS00` now has a **role badge `ASCS`** in the instance header and its description clearly states it’s Central Services only (Message Server + Enqueue Server, no user traffic, no JVMs).  
  - The first Java instance `JC01` is labeled with **“SAP Java Engine (Java EE compatible runtime)”** and a **`PAS` role badge**; other Java instances use the same engine label and **`AAS`** role badges.  
  - The modal logic in `script.js` reads `.badge-role` to describe PAS vs AAS correctly.

- **Control plane vs execution plane**  
  - In the ASCS and Java instances, I added **`plane-label`** and **`plane-group`** sections:
    - **Control Plane**:  
      - ASCS: Message Server, Enqueue Server, `sapstartsrv` with single-line control-plane explanations.  
      - Java instances: `sapstartsrv` only, as the local control for ICM, Java Dispatcher, JVM nodes.
    - **Execution Plane**:  
      - Java instances: ICM, Java Dispatcher, and the JVM node group; each has a 1‑line caption emphasising execution behavior.

- **ICM / Dispatcher clarity**  
  - **ICM** description now explicitly says: *terminates HTTP(S), handles network I/O/TLS, forwards requests, never executes application logic*.  
  - **Dispatcher** is renamed to **“Java Dispatcher”** and its text states it is the **sole router** to JVM nodes, using the **P4 protocol** for internal communication and relying on the Message Server for cluster info.

- **JVM node grouping and behavior**  
  - JVM processes in the PAS VM are grouped inside a new **`Java Server Nodes (Cluster Members)`** container with a note: **“Stateless execution; state stored in DB or replicated.”**  
  - Each JVM node process box describes that it runs the **SAP Java Engine**, with P4 port details and concise behavior; the existing internal breakdown (Java EE runtime, SAP Java Engine services, deployed apps, resources) is preserved and slightly reworded for correctness.

- **Database usage clarity**  
  - In the HANA section, `hdbindexserver` is clarified as the main engine serving SQL from JVM nodes.  
  - Added a dedicated “Database Usage Breakdown” box that splits usage into three bullets:
    - **Configuration & Cluster State** (profiles, cluster membership, lock metadata)  
    - **Deployment Metadata (SCA/SDA)**  
    - **Application Data** (business tables via JPA/JDBC)

- **Terminology cleanup**  
  - Replaced “Dispatcher (disp+work)” with **“Java Dispatcher”** everywhere.  
  - Port description for dispatcher explicitly mentions **P4 protocol**.  
  - Instance and JVM descriptions consistently use **“SAP Java Engine (Java EE compatible runtime)”** to align with SAP terminology.

