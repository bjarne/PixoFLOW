# LLM Generation Guide for Pixotope Installation Diagrams

## Overview
This guide explains how to generate JSON files in the Isoflow compact format for creating professional Pixotope installation schematics. The format is optimized for broadcast graphics and virtual production workflows.

## Format Structure

```json
{
  "t": "Diagram Title (max 40 chars)",
  "i": [
    ["Item Name (max 30 chars)", "icon_id", "Description (max 100 chars)"]
  ],
  "v": [
    [
      [[0, 2, 4], [1, -2, 6]],
      [[0, 1], [1, 0]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

## Structure Explanation

### Root Level
- `t`: **Title** - Short diagram title (max 40 characters)
- `i`: **Items** - Array of diagram elements
- `v`: **Views** - Array of views (usually just one)
- `_`: **Metadata** - Format identifier (always `{"f": "compact", "v": "1.0"}`)

### Items Array (`i`)
Each item is an array with 3 elements:
1. **Name** (string, max 30 chars): Display name of the item
2. **Icon** (string): Icon identifier from available icons
3. **Description** (string, max 100 chars): Brief description

### Views Array (`v`)
Each view contains:
1. **Positions Array**: `[[itemIndex, x, y], ...]` - Position of each item
2. **Connections Array**: `[[fromIndex, toIndex], ...]` - Connections between items

## Pixotope-Specific Icons

### Core Pixotope Systems
- `pixotope-graphics-compute` - Graphics rendering engine
- `pixotope-tracking-compute` - Tracking computation server
- `pixotope-control-director` - Control/Director station
- `pixotope-server` - Main Pixotope server

### Tracking Hardware
- `camera-tracking-sensor` - Camera-mounted tracking (Zone, Fly, Vision)
- `lens-encoder` - FIZ lens encoding system

### Video Infrastructure
- `video-router-matrix` - SDI/IP routing matrix
- `video-switcher` - Production switcher
- `multi-viewer` - Multi-source monitoring
- `video-converter` - Format/standard converter
- `ip-video-gateway` - SMPTE ST 2110 gateway

### Network Infrastructure
- `network-switch` - Managed Ethernet switch
- `network-router` - Network routing
- `ptp-grandmaster-clock` - PTP timing source
- `firewall` - Security appliance

### Camera Systems
- `broadcast-cinema-camera` - Professional camera
- `ptz-robotic-camera` - PTZ/robotic camera
- `camera-ccu` - Camera Control Unit
- `witness-camera` - Reference/calibration camera

### Display Systems
- `led-wall` - LED volume/wall
- `led-floor` - LED floor panels
- `led-processor` - LED control processor
- `chroma-screen` - Green/blue screen
- `video-projector` - Projection system
- `monitor` - Professional monitor

### Sync & Timing
- `sync-generator` - Black burst/tri-level sync
- `timecode-generator` - SMPTE timecode

### Control & Automation
- `automation-controller` - Production automation
- `nrcs-mos-server` - Newsroom/MOS integration
- `gpi-o-interface` - GPI/O control
- `tally-system` - Tally light control

### Storage & Compute
- `media-server` - Media processing server
- `storage-san-nas` - Shared storage system
- `generic-server` - Generic compute server

### Recording & Playback
- `video-recorder-player` - Recording device
- `replay-system` - Instant replay
- `clip-server` - Clip management

### Streaming
- `streaming-encoder` - Live encoder
- `streaming-decoder` - Stream decoder

### Infrastructure
- `ups` - Uninterruptible power supply
- `motion-capture-suit` - Motion capture system

### Generic/External
- `third-party-software` - External software
- `cloud-service` - Cloud-based service
- `external-system-api` - External API/system

### Basic ISOFLOW Icons (Fallbacks)
- `server` - Generic server
- `desktop` - Desktop computer
- `laptop` - Laptop computer
- `router` - Network router
- `switch-module` - Network switch
- `storage` - Storage device
- `cloud` - Cloud service
- `firewall` - Firewall
- `user` - User/person
- `cube` - Generic component

## Positioning Guidelines for Broadcast Workflows

### Positioning System
The positioning system uses a grid-based coordinate system:
- **X-axis**: Horizontal position (negative = left, positive = right)
- **Y-axis**: Vertical position (negative = up, positive = down)
- **Grid spacing**: Each unit represents one grid cell
- **Typical range**: -20 to +20 for both axes

### Standard Layout Patterns

#### 1. Virtual Production Studio Layout
```
         Camera Layer (-8 to -4 Y)
         Tracking Layer (-4 to 0 Y)
         Processing Layer (0 to 4 Y)
         Infrastructure Layer (4 to 8 Y)
```

#### 2. Broadcast Graphics Pipeline (Left to Right)
```
Input Sources → Processing → Output/Display
   X: -8          X: 0         X: 8
```

#### 3. Network Topology (Hub and Spoke)
```
    Core Switch (0, 0)
    Connected devices in circle around it
```

## Common Connection Patterns

### Video Signal Flow
- Camera → CCU → Video Router → Switcher → Output
- LED Processor → LED Wall/Floor
- Tracking Sensor → Tracking Compute → Graphics Compute

### Network Data Flow
- All devices → Network Switch → Router/Firewall
- PTP Clock → Network Switch (timing distribution)

### Control Connections
- Director Station → Graphics Compute
- Automation Controller → Multiple systems
- GPI/O → Switcher/Router

## Pixotope-Specific Examples

### Example 1: Basic Virtual Studio

```json
{
  "t": "Virtual Studio Setup",
  "i": [
    ["Studio Camera", "broadcast-cinema-camera", "Main broadcast camera with tracking"],
    ["Tracking Sensor", "camera-tracking-sensor", "Pixotope Zone tracking head"],
    ["Green Screen", "chroma-screen", "12x8m green screen backdrop"],
    ["Tracking Compute", "pixotope-tracking-compute", "Pixotope tracking server"],
    ["Graphics Compute", "pixotope-graphics-compute", "UE5 rendering engine"],
    ["Video Switcher", "video-switcher", "Production switcher"],
    ["PGM Monitor", "monitor", "Program output monitor"],
    ["Network Switch", "network-switch", "10GbE managed switch"]
  ],
  "v": [
    [
      [[0, -6, -4], [1, -6, 0], [2, 0, -6], [3, -2, 2], [4, 2, 2], [5, 6, 0], [6, 10, 0], [7, 0, 6]],
      [[0, 1], [1, 3], [3, 4], [0, 5], [4, 5], [5, 6], [3, 7], [4, 7], [5, 7]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

### Example 2: LED Volume Production

```json
{
  "t": "LED Volume Configuration",
  "i": [
    ["Camera A", "broadcast-cinema-camera", "Main talent camera"],
    ["Camera B", "ptz-robotic-camera", "Secondary PTZ camera"],
    ["Vision Tracking", "camera-tracking-sensor", "Pixotope Vision optical"],
    ["LED Wall", "led-wall", "10x5m curved LED wall"],
    ["LED Floor", "led-floor", "8x8m LED floor"],
    ["LED Processor", "led-processor", "Brompton LED processor"],
    ["Tracking Server", "pixotope-tracking-compute", "Vision tracking compute"],
    ["Graphics Engine", "pixotope-graphics-compute", "Real-time UE5 render"],
    ["Director Station", "pixotope-control-director", "Pixotope Director"],
    ["Sync Generator", "sync-generator", "Tri-level sync source"],
    ["10G Switch", "network-switch", "Core network switch"]
  ],
  "v": [
    [
      [[0, -8, -2], [1, -8, 2], [2, -4, -4], [3, 0, -6], [4, 0, -2], [5, 4, -4], [6, -4, 4], [7, 0, 4], [8, 4, 4], [9, -8, 6], [10, 0, 8]],
      [[0, 2], [1, 2], [2, 6], [6, 7], [7, 8], [5, 3], [5, 4], [7, 5], [9, 10], [6, 10], [7, 10], [8, 10]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

### Example 3: Multi-Camera Broadcast

```json
{
  "t": "Multi-Cam Broadcast Graphics",
  "i": [
    ["Camera 1", "broadcast-cinema-camera", "Studio camera with Zone"],
    ["Camera 2", "broadcast-cinema-camera", "Studio camera with Zone"],
    ["Camera 3", "ptz-robotic-camera", "Ceiling mounted PTZ"],
    ["CCU 1", "camera-ccu", "Camera control unit"],
    ["CCU 2", "camera-ccu", "Camera control unit"],
    ["Video Router", "video-router-matrix", "32x32 SDI router"],
    ["Graphics 1", "pixotope-graphics-compute", "Primary graphics engine"],
    ["Graphics 2", "pixotope-graphics-compute", "Backup graphics engine"],
    ["Switcher", "video-switcher", "Vision mixer"],
    ["Multi-viewer", "multi-viewer", "Operator monitoring"],
    ["NRCS Server", "nrcs-mos-server", "Newsroom integration"],
    ["Storage", "storage-san-nas", "Shared media storage"]
  ],
  "v": [
    [
      [[0, -10, -4], [1, -10, 0], [2, -10, 4], [3, -6, -4], [4, -6, 0], [5, -2, 0], [6, 2, -2], [7, 2, 2], [8, 6, 0], [9, 10, -2], [10, 6, 4], [11, 2, 6]],
      [[0, 3], [1, 4], [2, 5], [3, 5], [4, 5], [5, 6], [5, 7], [6, 8], [7, 8], [8, 9], [10, 11], [11, 6], [11, 7]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

### Example 4: Remote Production Hub

```json
{
  "t": "Remote Production Setup",
  "i": [
    ["Remote Camera", "broadcast-cinema-camera", "Field camera with 5G bonding"],
    ["Stream Encoder", "streaming-encoder", "H.265 live encoder"],
    ["Cloud Gateway", "cloud-service", "AWS Media Services"],
    ["IP Gateway", "ip-video-gateway", "ST 2110 to cloud bridge"],
    ["Graphics Compute", "pixotope-graphics-compute", "Cloud-based rendering"],
    ["Control Station", "pixotope-control-director", "Remote director workstation"],
    ["Stream Decoder", "streaming-decoder", "Studio decoder"],
    ["Production Switch", "video-switcher", "Master control switcher"]
  ],
  "v": [
    [
      [[0, -10, 0], [1, -6, 0], [2, -2, -4], [3, -2, 4], [4, 2, 0], [5, 6, -4], [6, 6, 4], [7, 10, 0]],
      [[0, 1], [1, 2], [2, 4], [3, 4], [4, 5], [4, 6], [6, 7], [5, 7]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

## Best Practices for Pixotope Diagrams

### 1. Signal Flow Direction
- **Video**: Left to right (input → processing → output)
- **Data**: Bottom to top (infrastructure → application)
- **Control**: Top to bottom (operator → equipment)

### 2. Component Grouping
- Group cameras and tracking together
- Keep Pixotope compute nodes adjacent
- Place infrastructure (network, sync) at bottom
- Position monitoring/output on the right

### 3. Connection Types (Implied by Context)
- **Video signals**: Camera to processing connections
- **Network/data**: Computer to switch connections
- **Control/GPI**: Automation to device connections

### 4. Naming Conventions
- Use product names for specific hardware (e.g., "Zone Tracking")
- Include resolution/format where relevant (e.g., "4K Camera")
- Specify protocols when important (e.g., "ST 2110 Gateway")
- Keep names under 30 characters

### 5. Description Best Practices
- Include model/version for critical components
- Mention protocol support (MOS, ST 2110, IPMX, etc.)
- Note redundancy role (primary/backup)
- Specify capacity (ports, channels, resolution)
- Keep descriptions under 100 characters

## Common Pixotope Configurations

### Newsroom Graphics
Focus on: NRCS/MOS server, automation, template systems, graphics compute

### Virtual Production
Focus on: LED walls/floors, tracking systems, real-time rendering, sync

### Sports/AR Graphics
Focus on: Multi-camera setup, tracking, keying, compositing, graphics engines

### Remote Production
Focus on: IP gateways, cloud services, streaming encoders/decoders

### Live Events
Focus on: Switchers, routers, multi-viewers, backup systems

## Connection Guidelines

Connections are defined as `[fromIndex, toIndex]` pairs:
- **fromIndex**: Index of source item in items array (starting at 0)
- **toIndex**: Index of destination item in items array
- **Direction**: Connections are directional (from → to)

### Common Connection Patterns
- **Linear flow**: [0,1], [1,2], [2,3]
- **Hub and spoke**: [0,1], [0,2], [0,3]
- **Redundant paths**: [0,2], [1,2] (multiple sources to same destination)
- **Bidirectional** (use two connections): [0,1], [1,0]

## Validation Checklist for Pixotope Diagrams

Before generating, ensure:
- [ ] All Pixotope components properly identified with correct icon IDs
- [ ] Video signal flow clearly shown (left to right)
- [ ] Network topology makes sense (devices connected to switches)
- [ ] Sync/timing distribution included where needed
- [ ] Tracking to graphics pipeline properly connected
- [ ] Control paths identified (director to systems)
- [ ] Redundancy clearly marked (primary/backup)
- [ ] All icon IDs exactly match the available list
- [ ] Item names are ≤ 30 characters
- [ ] Descriptions are ≤ 100 characters
- [ ] Title is ≤ 40 characters
- [ ] Position coordinates are reasonable (-20 to +20)
- [ ] Connection indices reference valid items (0-based indexing)
- [ ] Metadata format is exactly `{"f": "compact", "v": "1.0"}`

## Common Pitfalls to Avoid

1. **Invalid icon names**: Always use exact icon IDs from the list
2. **Missing descriptions**: Always provide the third element in item arrays
3. **Incorrect metadata**: Use exact format `{"f": "compact", "v": "1.0"}`
4. **Invalid connections**: Ensure indices refer to existing items (0-based)
5. **Extreme coordinates**: Keep positions within -20 to +20
6. **Missing views**: Always include at least one view with positions
7. **Disconnected components**: Ensure all items have relevant connections
8. **Crossing connections**: Minimize overlapping connection lines through smart positioning

## Token Optimization Tips

- Use component IDs from the icon list exactly as specified
- Keep descriptions technical but concise
- Use standard broadcast abbreviations (CCU, PGM, MOS, etc.)
- Use integer coordinates instead of decimals
- Group related components to minimize total connections
- Reuse common patterns from the examples

## Quick Reference: Essential Pixotope Components

For most Pixotope installations, include these core components:
1. **Graphics Compute** (`pixotope-graphics-compute`) - Always needed
2. **Tracking System** (`camera-tracking-sensor` or `pixotope-tracking-compute`)
3. **Network Switch** (`network-switch`) - For connectivity
4. **Video I/O** (`video-switcher` or `video-router-matrix`)
5. **Display** (`monitor`, `led-wall`, or `chroma-screen`)
6. **Camera** (`broadcast-cinema-camera` or `ptz-robotic-camera`)
7. **Control** (`pixotope-control-director`) - For operation

This format ensures accurate, professional Pixotope installation diagrams that clearly communicate system architecture to broadcast engineers and virtual production teams.