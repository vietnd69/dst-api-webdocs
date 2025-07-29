---
id: input-systems-overview
title: Input Systems Overview
description: Overview of input handling, device management, and haptic feedback infrastructure in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: input device management and feedback
---

# Input Systems Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Input Systems category provides the foundational infrastructure for managing all user input devices and feedback mechanisms in Don't Starve Together. This system handles keyboard, mouse, and controller inputs across multiple platforms while providing haptic feedback and device coordination to create a unified input experience regardless of hardware configuration.

## Architecture Overview

### Data Flow
```
Hardware Input → Input Device Detection → Event Processing → Control Resolution → Game Actions
     ↓                      ↓                    ↓                ↓              ↓
Controller Events → Device Management → Handler Registry → Virtual Controls → Haptic Feedback
     ↓                      ↓                    ↓                ↓              ↓
Keyboard/Mouse → Platform Detection → Event Routing → Scheme Selection → Vibration Output
```

### Integration Points

1. **Hardware Layer**: Direct interface with system input devices
2. **Event Processing**: Core input event handling and routing  
3. **Control Resolution**: Virtual control mapping and scheme management
4. **Game Integration**: Translation of input events to game actions
5. **Feedback Systems**: Haptic and audio feedback coordination

## Key Concepts

### Input Device Management
- **Multi-Platform Support**: Unified handling across PC, console, and handheld platforms
- **Controller Detection**: Automatic device discovery and configuration
- **Virtual Keyboard Integration**: Platform-specific text input handling
- **Device Coordination**: Multiple input device synchronization

### Control Scheme System
- **Virtual Controls**: Abstract control mapping for complex input scenarios
- **Scheme Selection**: Adaptive control schemes based on player preference and device type
- **Twin-Stick Support**: Advanced controller schemes with free aiming and camera movement
- **Accessibility Options**: Configurable control mappings for different needs

### Haptic Feedback Integration
- **Event Synchronization**: Automatic haptic feedback triggered by audio events
- **Intensity Management**: Configurable vibration and audio intensity levels
- **Platform Optimization**: Adaptive feedback based on device capabilities
- **Category-Based Organization**: Organized feedback for UI, combat, environmental, and boss events

## Modules

### Core Input Infrastructure

| Module | Status | Description |
|-----|-----|----|
| [Input System](./input.md) | stable | Core input handling for keyboard, mouse, controllers, and virtual controls |

**Functionality Provided:**
- Event handler registration and management
- Input device detection and coordination
- Virtual control system with scheme-based resolution
- Cross-platform input normalization
- Real-time input state queries and position tracking

### Feedback Systems

| Module | Status | Description |  
|-----|-----|----|
| [Haptic Effects](./haptics.md) | stable | Haptic feedback and vibration effects for enhanced player immersion |

**Functionality Provided:**
- Audio-synchronized haptic feedback
- Configurable vibration and audio intensity
- Event categorization for different game contexts
- Platform-optimized tactile responses

## Common Usage Patterns

### Basic Input Handling

```lua
-- Register input handlers
TheInput:AddKeyDownHandler(KEY_SPACE, function()
    -- Handle spacebar press
end)

TheInput:AddControlHandler(CONTROL_PRIMARY, function(control, down)
    if down then
        -- Handle primary action
    end
end)
```

### Device Management

```lua
-- Check controller status
if TheInput:ControllerAttached() then
    -- Enable controller-specific features
    local devices = TheInput:GetInputDevices()
end

-- Manage mouse input
TheInput:EnableMouse(true)
```

### Virtual Control Resolution

```lua
-- Handle control scheme adaptation
local scheme = TheInput:GetActiveControlScheme(CONTROL_SCHEME_CAM_AND_INV)

if TheInput:SupportsControllerFreeAiming() then
    -- Use twin-stick controls
else
    -- Use traditional movement controls
end
```

## Recent Changes

| Build | Date | Module | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Input System](./input.md) | stable | Current comprehensive input handling system |
| 676042 | 2025-06-21 | [Haptic Effects](./haptics.md) | stable | Current haptic feedback configuration |

## Integration with Core Systems

### User Interface Systems
- **Widget Interaction**: Mouse and touch input for UI elements
- **Virtual Keyboard**: Text input integration with UI widgets
- **Accessibility**: Enhanced input options for diverse user needs

### Game Mechanics
- **Player Actions**: Direct translation of input to character actions
- **Camera Control**: Integrated camera movement with input schemes
- **Inventory Management**: Specialized controls for item interaction

### Performance Systems
- **Event Optimization**: Efficient input event processing and handler management
- **Device Caching**: Optimized controller state management
- **Frame Synchronization**: Input updates tied to rendering performance

## Technical Considerations

### Platform Optimization
- **Console Integration**: Optimized for controller-primary platforms
- **PC Flexibility**: Full keyboard/mouse support with controller fallback
- **Handheld Adaptation**: Virtual keyboard and touch-friendly controls
- **Cross-Platform Consistency**: Unified control experience across devices

### Performance Features
- **Event Caching**: Controller state caching for reduced overhead
- **Selective Processing**: Efficient event filtering and routing
- **Memory Management**: Automatic cleanup of input handlers
- **Frame-Rate Independence**: Input processing decoupled from rendering

### Development Support
- **Debug Commands**: Input testing and diagnostic capabilities
- **Control Mapping Tools**: Runtime control remapping and validation
- **Device Testing**: Multi-device input testing and validation
- **Event Logging**: Comprehensive input event tracking for debugging

## Related Systems

- [User Interface Frontend](../frontend/index.md): UI interaction handling and input events
- [User Interface Graphics](../graphics/index.md): Visual feedback coordination with input
- [Development Tools Console](../../development-tools/console/index.md): Input debugging and testing commands
- [Game Configuration Settings](../../game-confinguration/settings/index.md): Input preference storage and configuration
