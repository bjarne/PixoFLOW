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
2. **Connections Array**: Connection definitions (see Connection Formats below)

## Available Icons for Pixotope Diagrams

**IMPORTANT**: Use only the icon IDs listed below. These correspond to actual icons available in the system.

### PIXOTOPE Collection Icons
- `pixotope-clock` - Timing and sync devices (`/icons/pixotope/clock.png`)
- `pixotope-greenscreen` - Green/blue screens for chroma keying (`/icons/pixotope/greenscreen.png`)
- `pixotope-led-floor` - LED floor panel systems (`/icons/pixotope/led_floor.png`)
- `pixotope-led-wall` - LED video walls and displays (`/icons/pixotope/led_wall.png`)
- `pixotope-light` - Lighting and tally systems (`/icons/pixotope/light.png`)
- `pixotope-mixer` - Audio/video mixing equipment (`/icons/pixotope/mixer.png`)
- `pixotope-video` - Cameras and video equipment (`/icons/pixotope/video.png`)

### ISOFLOW Collection Icons (Basic Components)
- `server` - Servers and compute systems (graphics, tracking, media, etc.)
- `desktop` - Desktop computers and workstations
- `laptop` - Laptop computers
- `router` - Network routers and gateways
- `switch-module` - Network switches
- `storage` - Storage systems (SAN/NAS)
- `cloud` - Cloud services
- `firewall` - Security appliances
- `user` - People and operators
- `cube` - Generic equipment and components

## Icon Usage Guidelines

### Pixotope System Components
- **Graphics Compute**: Use `server`
- **Tracking Compute**: Use `server`
- **Control/Director Station**: Use `desktop`
- **Cameras**: Use `pixotope-video`
- **LED Walls**: Use `pixotope-led-wall`
- **LED Floors**: Use `pixotope-led-floor`
- **Green Screens**: Use `pixotope-greenscreen`
- **Sync/Timing**: Use `pixotope-clock`
- **Switchers/Mixers**: Use `pixotope-mixer`
- **Tally Systems**: Use `pixotope-light`

### Infrastructure Components
- **Network Switches**: Use `switch-module`
- **Routers/Gateways**: Use `router`
- **Storage Systems**: Use `storage`
- **Generic Servers**: Use `server`
- **Monitors/Displays**: Use `desktop`
- **Cloud Services**: Use `cloud`
- **Firewalls**: Use `firewall`
- **Generic Equipment**: Use `cube`
- **Operators**: Use `user`

## Connection Formats

### Current Connection Format (Required)
The system currently supports only the basic connection format:
```json
[[fromIndex, toIndex], [fromIndex, toIndex]]
```

### Enhanced Connection Format (Future Feature)
**Note: This enhanced format is not yet implemented in the system.** 
For future professional broadcast diagrams with signal labeling, the proposed enhanced format would be:
```json
[
  {
    "from": fromIndex,
    "to": toIndex,
    "startLabel": "OUT 1", 
    "endLabel": "IN 3",
    "description": "SDI",
    "color": "red",
    "style": "SOLID",
    "lineType": "SINGLE",
    "width": 12
  }
]
```

### Connection Properties

#### Labels
- **`startLabel`** (string): Port/connector label at source (e.g., "OUT 1", "TX", "A")
- **`endLabel`** (string): Port/connector label at destination (e.g., "IN 3", "RX", "B")  
- **`description`** (string): Signal type in center of line (e.g., "SDI", "ST 2110", "SRT")

#### Visual Styling
- **`color`** (string): Line color - `"red"`, `"blue"`, `"green"`, `"orange"`, `"purple"`, `"gray"`
- **`style`** (string): Line pattern - `"SOLID"`, `"DOTTED"`, `"DASHED"`
- **`lineType`** (string): Line structure - `"SINGLE"`, `"DOUBLE"`, `"DOUBLE_WITH_CIRCLE"`
- **`width`** (number): Line thickness (8-16 recommended)

#### Label Heights (Optional)
- **`startLabelHeight`** (number): Height of start label line (0-40)
- **`centerLabelHeight`** (number): Height of center label line (0-40)  
- **`endLabelHeight`** (number): Height of end label line (0-40)

### Broadcast Connection Standards

#### Signal Type Colors
- **SDI Video**: `"red"` - Professional video signals
- **IP/Ethernet**: `"blue"` - Network data, ST 2110, SMPTE 2022
- **Streaming**: `"purple"` - SRT, RTMP, WebRTC
- **Control**: `"green"` - GPI/O, serial, automation
- **Audio**: `"orange"` - AES, analog audio
- **Sync/Clock**: `"gray"` - Genlock, PTP, timecode

#### Connection Reliability
- **Primary/Main**: `"SOLID"` style
- **Backup/Secondary**: `"DASHED"` style  
- **Optional/Failover**: `"DOTTED"` style

#### Signal Complexity
- **Single Signal**: `"SINGLE"` lineType
- **Bidirectional**: `"DOUBLE"` lineType
- **Multiple Streams/Channels**: `"DOUBLE_WITH_CIRCLE"` lineType (use center label to indicate count)

### Connection Examples

#### SDI Video Connection
```json
{
  "from": 0,
  "to": 1, 
  "startLabel": "SDI OUT 1",
  "endLabel": "SDI IN A",
  "description": "3G-SDI",
  "color": "red",
  "style": "SOLID",
  "lineType": "SINGLE",
  "width": 12
}
```

#### ST 2110 IP Video
```json
{
  "from": 2,
  "to": 3,
  "startLabel": "25G",
  "endLabel": "25G",
  "description": "ST 2110",
  "color": "blue", 
  "style": "SOLID",
  "lineType": "DOUBLE",
  "width": 14
}
```

#### SRT Streaming
```json
{
  "from": 4,
  "to": 5,
  "startLabel": "WAN",
  "endLabel": "WAN", 
  "description": "SRT",
  "color": "purple",
  "style": "SOLID", 
  "lineType": "SINGLE",
  "width": 10
}
```

#### Backup Connection
```json
{
  "from": 6,
  "to": 7,
  "startLabel": "BACKUP",
  "endLabel": "BACKUP",
  "description": "SDI",
  "color": "red",
  "style": "DASHED",
  "lineType": "SINGLE", 
  "width": 10
}
```

#### Control/GPI
```json
{
  "from": 8,
  "to": 9,
  "startLabel": "GPI 1",
  "endLabel": "TALLY",
  "description": "Control",
  "color": "green",
  "style": "SOLID",
  "lineType": "SINGLE",
  "width": 8
}
```

#### Multiple SDI Streams
```json
{
  "from": 0,
  "to": 1,
  "startLabel": "SDI 1-4",
  "endLabel": "IN 1-4",
  "description": "4x 3G-SDI",
  "color": "red",
  "style": "SOLID",
  "lineType": "DOUBLE_WITH_CIRCLE",
  "width": 16
}
```

#### Multiple IP Streams
```json
{
  "from": 2,
  "to": 3,
  "startLabel": "25G",
  "endLabel": "25G",
  "description": "8x ST 2110",
  "color": "blue",
  "style": "SOLID",
  "lineType": "DOUBLE_WITH_CIRCLE",
  "width": 18
}
```

## Multiple Stream Connections

### When Multiple Signals Use the Same Path
Use `"DOUBLE_WITH_CIRCLE"` lineType when multiple video/data streams travel between the same two devices:

#### Common Scenarios:
- **4x SDI outputs** from Pixotope graphics engine to video router
- **Multiple ST 2110 streams** over single network connection  
- **Multi-channel audio** feeds
- **Parallel data streams** between servers

#### Labeling Convention:
- **Start/End Labels**: Show port ranges (e.g., "SDI 1-4", "IN A-D", "CH 1-8")
- **Description**: Include count and signal type (e.g., "4x 3G-SDI", "8x ST 2110", "16x AES")
- **Width**: Use wider lines (16-20) to indicate higher bandwidth

#### Multiple Stream Examples:

**Pixotope to Router (4x SDI)**
```json
{
  "from": 0,
  "to": 1,
  "startLabel": "SDI 1-4",
  "endLabel": "IN 1-4", 
  "description": "4x 3G-SDI",
  "color": "red",
  "style": "SOLID",
  "lineType": "DOUBLE_WITH_CIRCLE",
  "width": 16
}
```

**Graphics Server to LED Processor (8x Streams)**
```json
{
  "from": 2,
  "to": 3,
  "startLabel": "DP 1-4",
  "endLabel": "IN A-H",
  "description": "8x 4K Feeds",
  "color": "red", 
  "style": "SOLID",
  "lineType": "DOUBLE_WITH_CIRCLE",
  "width": 18
}
```

**Network Multi-Stream (ST 2110)**
```json
{
  "from": 4,
  "to": 5,
  "startLabel": "25G",
  "endLabel": "25G",
  "description": "12x ST 2110",
  "color": "blue",
  "style": "SOLID", 
  "lineType": "DOUBLE_WITH_CIRCLE",
  "width": 20
}
```

## Two Available Formats

The system supports two different diagram formats:

### 1. Compact Format (For LLM Generation)
**Limitation**: Only supports basic `[[fromIndex, toIndex]]` connections
**Use case**: Token-efficient LLM generation, simple diagrams

```json
{
  "t": "Diagram Title",
  "i": [["Item 1", "server", "Description"]],
  "v": [
    [
      [[0, -4, 0], [1, 0, 0]],  // Positions
      [[0, 1]]                  // Basic connections only
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

### 2. Full Format (Complete Feature Support)
**Capability**: Full support for connection labels, colors, line types, etc.
**Use case**: Professional broadcast diagrams, detailed documentation

**Icon URL Requirements**:
- **PIXOTOPE icons**: Use `/icons/pixotope/{filename}.png` (e.g., `/icons/pixotope/video.png`)
- **ISOFLOW icons**: Use base64 encoded SVG data (as exported by the system)

```json
{
  "title": "Diagram Title",
  "items": [...],
  "views": [{
    "connectors": [{
      "description": "SDI",
      "startLabel": "OUT 1", 
      "endLabel": "IN 3",
      "color": "red",
      "style": "SOLID",
      "lineType": "SINGLE",
      "width": 12
    }]
  }]
}
```

## Enhanced Connection Format (Full Format Only)

### Use Basic Format When:
- Creating simple overview diagrams
- Showing logical relationships only
- Token count is critical
- Signal types are obvious from context

### Use Enhanced Format When:
- Creating professional broadcast documentation
- Showing specific port connections
- Multiple signal types are present
- Backup/redundancy paths exist
- Diagram will be used for installation/maintenance
- Color coding improves clarity

## Full Format Example with Enhanced Connections

Based on the actual system capabilities, here's how to create professional broadcast diagrams:

```json
{
  "title": "Professional Broadcast Setup",
  "icons": [
    {
      "id": "pixotope-video",
      "name": "pixotope-video", 
      "url": "/icons/pixotope/video.png",
      "isIsometric": true
    },
    {
      "id": "server",
      "name": "server",
      "url": "data:image/svg+xml;base64,...",
      "collection": "isoflow",
      "isIsometric": true
    }
  ],
  "colors": [
    {
      "id": "red",
      "value": "#ff0000"
    },
    {
      "id": "blue", 
      "value": "#0000ff"
    }
  ],
  "items": [
    {
      "id": "camera-1",
      "name": "Studio Camera",
      "icon": "pixotope-video"
    },
    {
      "id": "graphics-1",
      "name": "Graphics Engine", 
      "icon": "server"
    }
  ],
  "views": [{
    "name": "Main View",
    "items": [
      {
        "id": "camera-1",
        "tile": { "x": -4, "y": 0 },
        "labelHeight": 80
      },
      {
        "id": "graphics-1", 
        "tile": { "x": 4, "y": 0 },
        "labelHeight": 80
      }
    ],
    "connectors": [
      {
        "id": "conn-1",
        "color": "red",
        "description": "4x 3G-SDI",
        "startLabel": "SDI 1-4",
        "endLabel": "IN A-D", 
        "width": 16,
        "style": "SOLID",
        "lineType": "DOUBLE_WITH_CIRCLE",
        "anchors": [
          {
            "id": "anchor-1",
            "ref": { "item": "camera-1" }
          },
          {
            "id": "anchor-2", 
            "ref": { "item": "graphics-1" }
          }
        ]
      }
    ],
    "rectangles": [],
    "textBoxes": []
  }]
}
```

### Mixed Format Example
You can mix both formats in the same diagram:
```json
"v": [
  [
    [[0, -4, 0], [1, 0, 0], [2, 4, 0]],
    [
      [0, 1],  // Simple connection
      {        // Enhanced connection
        "from": 1,
        "to": 2,
        "startLabel": "OUT 1",
        "endLabel": "IN A",
        "description": "SDI",
        "color": "red",
        "style": "SOLID",
        "width": 12
      }
    ]
  ]
]
```

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

### Example 1: Basic Virtual Studio (Simple Format)

```json
{
  "t": "Virtual Studio Setup",
  "i": [
    ["Studio Camera", "pixotope-video", "Main broadcast camera with tracking"],
    ["Tracking Sensor", "cube", "Pixotope Zone tracking head"],
    ["Green Screen", "pixotope-greenscreen", "12x8m green screen backdrop"],
    ["Tracking Compute", "server", "Pixotope tracking server"],
    ["Graphics Compute", "server", "UE5 rendering engine"],
    ["Video Switcher", "pixotope-mixer", "Production switcher"],
    ["PGM Monitor", "desktop", "Program output monitor"],
    ["Network Switch", "switch-module", "10GbE managed switch"]
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

### Example 1b: Virtual Studio (Proposed Enhanced Format - Not Yet Implemented)

```json
{
  "t": "Virtual Studio with Signal Labels",
  "i": [
    ["Studio Camera", "pixotope-video", "Main broadcast camera with tracking"],
    ["Tracking Sensor", "cube", "Pixotope Zone tracking head"],
    ["Green Screen", "pixotope-greenscreen", "12x8m green screen backdrop"],
    ["Tracking Compute", "server", "Pixotope tracking server"],
    ["Graphics Compute", "server", "UE5 rendering engine"],
    ["Video Switcher", "pixotope-mixer", "Production switcher"],
    ["PGM Monitor", "desktop", "Program output monitor"],
    ["Network Switch", "switch-module", "10GbE managed switch"]
  ],
  "v": [
    [
      [[0, -6, -4], [1, -6, 0], [2, 0, -6], [3, -2, 2], [4, 2, 2], [5, 6, 0], [6, 10, 0], [7, 0, 6]],
      [
        {
          "from": 0,
          "to": 1,
          "startLabel": "SYNC",
          "endLabel": "CAM",
          "description": "Tracking",
          "color": "green",
          "style": "SOLID",
          "lineType": "SINGLE",
          "width": 8
        },
        {
          "from": 1,
          "to": 3,
          "startLabel": "DATA",
          "endLabel": "ETH",
          "description": "Position",
          "color": "blue",
          "style": "SOLID",
          "lineType": "SINGLE",
          "width": 10
        },
        {
          "from": 3,
          "to": 4,
          "startLabel": "OUT",
          "endLabel": "IN",
          "description": "Tracking",
          "color": "blue",
          "style": "SOLID",
          "lineType": "DOUBLE",
          "width": 12
        },
        {
          "from": 0,
          "to": 5,
          "startLabel": "SDI OUT",
          "endLabel": "SDI 1",
          "description": "3G-SDI",
          "color": "red",
          "style": "SOLID",
          "lineType": "SINGLE",
          "width": 12
        },
        {
          "from": 4,
          "to": 5,
          "startLabel": "SDI 1-4",
          "endLabel": "IN A-D",
          "description": "4x Graphics",
          "color": "red",
          "style": "SOLID",
          "lineType": "DOUBLE_WITH_CIRCLE",
          "width": 16
        },
        {
          "from": 5,
          "to": 6,
          "startLabel": "PGM",
          "endLabel": "INPUT",
          "description": "Program",
          "color": "red",
          "style": "SOLID",
          "lineType": "SINGLE",
          "width": 12
        },
        {
          "from": 3,
          "to": 7,
          "startLabel": "1G",
          "endLabel": "PORT 1",
          "description": "Control",
          "color": "blue",
          "style": "SOLID",
          "lineType": "SINGLE",
          "width": 8
        },
        {
          "from": 4,
          "to": 7,
          "startLabel": "10G",
          "endLabel": "PORT 2",
          "description": "Render",
          "color": "blue",
          "style": "SOLID",
          "lineType": "SINGLE",
          "width": 10
        },
        {
          "from": 5,
          "to": 7,
          "startLabel": "1G",
          "endLabel": "PORT 3",
          "description": "Control",
          "color": "blue",
          "style": "SOLID",
          "lineType": "SINGLE",
          "width": 8
        }
      ]
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
    ["Camera A", "pixotope-video", "Main talent camera"],
    ["Camera B", "pixotope-video", "Secondary PTZ camera"],
    ["Vision Tracking", "cube", "Pixotope Vision optical tracking"],
    ["LED Wall", "pixotope-led-wall", "10x5m curved LED wall"],
    ["LED Floor", "pixotope-led-floor", "8x8m LED floor"],
    ["LED Processor", "cube", "Brompton LED processor"],
    ["Tracking Server", "server", "Vision tracking compute"],
    ["Graphics Engine", "server", "Real-time UE5 render"],
    ["Director Station", "desktop", "Pixotope Director"],
    ["Sync Generator", "pixotope-clock", "Tri-level sync source"],
    ["10G Switch", "switch-module", "Core network switch"]
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
    ["Camera 1", "pixotope-video", "Studio camera with Zone"],
    ["Camera 2", "pixotope-video", "Studio camera with Zone"],
    ["Camera 3", "pixotope-video", "Ceiling mounted PTZ"],
    ["CCU 1", "cube", "Camera control unit"],
    ["CCU 2", "cube", "Camera control unit"],
    ["Video Router", "router", "32x32 SDI router"],
    ["Graphics 1", "server", "Primary graphics engine"],
    ["Graphics 2", "server", "Backup graphics engine"],
    ["Switcher", "pixotope-mixer", "Vision mixer"],
    ["Multi-viewer", "desktop", "Operator monitoring"],
    ["NRCS Server", "server", "Newsroom integration"],
    ["Storage", "storage", "Shared media storage"]
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
    ["Remote Camera", "pixotope-video", "Field camera with 5G bonding"],
    ["Stream Encoder", "cube", "H.265 live encoder"],
    ["Cloud Gateway", "cloud", "AWS Media Services"],
    ["IP Gateway", "router", "ST 2110 to cloud bridge"],
    ["Graphics Compute", "server", "Cloud-based rendering"],
    ["Control Station", "desktop", "Remote director workstation"],
    ["Stream Decoder", "cube", "Studio decoder"],
    ["Production Switch", "pixotope-mixer", "Master control switcher"]
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

### For Compact Format (LLM Generation):
- [ ] All icon IDs use only available icons: `pixotope-clock`, `pixotope-greenscreen`, `pixotope-led-floor`, `pixotope-led-wall`, `pixotope-light`, `pixotope-mixer`, `pixotope-video`, `server`, `desktop`, `laptop`, `router`, `switch-module`, `storage`, `cloud`, `firewall`, `user`, `cube`
- [ ] Use only basic connection format `[[fromIndex, toIndex]]`
- [ ] All connection indices reference valid items (0-based indexing)
- [ ] Metadata format is exactly `{"f": "compact", "v": "1.0"}`

### For Full Format (Professional Diagrams):
- [ ] All icon IDs match available icons
- [ ] Connection colors use valid values: `"red"`, `"blue"`, `"green"`, `"orange"`, `"purple"`, `"gray"`
- [ ] Connection styles use valid values: `"SOLID"`, `"DOTTED"`, `"DASHED"`
- [ ] Connection lineTypes use valid values: `"SINGLE"`, `"DOUBLE"`, `"DOUBLE_WITH_CIRCLE"`
- [ ] Multiple streams use `"DOUBLE_WITH_CIRCLE"` with count in description (e.g., "4x SDI")
- [ ] Signal types clearly indicated in connection descriptions
- [ ] Port labels match actual equipment specifications (ranges for multiple streams)

### General Requirements (Both Formats):
- [ ] Video signal flow clearly shown (left to right)
- [ ] Network topology makes sense (devices connected to switches)
- [ ] Sync/timing distribution included where needed
- [ ] Tracking to graphics pipeline properly connected
- [ ] Control paths identified (director to systems)
- [ ] Redundancy clearly marked (primary/backup)
- [ ] Item names are ≤ 30 characters
- [ ] Descriptions are ≤ 100 characters
- [ ] Title is ≤ 40 characters
- [ ] Position coordinates are reasonable (-20 to +20)
- [ ] Metadata format is exactly `{"f": "compact", "v": "1.0"}`

## Common Pitfalls to Avoid

1. **Invalid icon names**: Only use these exact icon IDs: `pixotope-clock`, `pixotope-greenscreen`, `pixotope-led-floor`, `pixotope-led-wall`, `pixotope-light`, `pixotope-mixer`, `pixotope-video`, `server`, `desktop`, `laptop`, `router`, `switch-module`, `storage`, `cloud`, `firewall`, `user`, `cube`
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
1. **Graphics Compute** (`server`) - Always needed
2. **Tracking System** (`cube` or `server`) - For camera tracking
3. **Network Switch** (`switch-module`) - For connectivity
4. **Video I/O** (`pixotope-mixer` or `router`) - Switching/routing
5. **Display** (`desktop`, `pixotope-led-wall`, or `pixotope-greenscreen`)
6. **Camera** (`pixotope-video`) - Video capture
7. **Control** (`desktop`) - For operation

This format ensures accurate, professional Pixotope installation diagrams that clearly communicate system architecture to broadcast engineers and virtual production teams.