---
id: update
title: Update System
description: Core update loop system that handles game simulation timing and component updates
sidebar_position: 1
slug: game-scripts/core-systems/runtime/update
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Update System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Update System** manages all update loops in Don't Starve Together, providing different timing mechanisms for various game systems. It handles wall time updates (real-time), simulation time updates (game time), static updates (paused server), and long updates (time skipping).

## Usage Example

```lua
-- Register a component for updates
local function StartUpdating(self)
    StartUpdatingComponent(self, self.inst)
end

-- Component update method
function MyComponent:OnUpdate(dt)
    -- This runs every simulation tick
    self.timer = self.timer + dt
end

-- Wall update method (always runs)
function MyComponent:OnWallUpdate(dt)
    -- This runs on real time, even when paused
    self.realtime_timer = self.realtime_timer + dt
end
```

## Update Types

### Wall Time Updates

Wall time updates run continuously based on real time, not affected by game pause or simulation speed.

#### WallUpdate(dt) {#wall-update}

**Status:** `stable`

**Description:**
Main wall time update function that runs regardless of server pause state. Handles input, frontend updates, and camera updates.

**Parameters:**
- `dt` (number): Delta time in seconds since last wall update

**Key Operations:**
- Processes RPC and user command queues
- Updates wall updating components
- Updates mixer, camera, and frontend
- Handles input processing

**Example:**
```lua
-- Components can register for wall updates
function MyComponent:StartWallUpdating()
    StartWallUpdatingComponent(self, self.inst)
end

function MyComponent:OnWallUpdate(dt)
    -- Always runs, even when game is paused
    self.wall_timer = self.wall_timer + dt
end
```

### Simulation Time Updates

Simulation updates run on game time and are paused when the server is paused.

#### Update(dt) {#main-update}

**Status:** `stable`

**Description:**
Main simulation update loop that processes game logic. Only runs when server is not paused.

**Parameters:**
- `dt` (number): Delta time in seconds since last simulation update

**Key Operations:**
- Runs scheduler tasks
- Updates all registered components
- Updates state graphs and AI brains
- Manages component update registration

**Example:**
```lua
-- Register component for simulation updates
function MyComponent:StartUpdating()
    StartUpdatingComponent(self, self.inst)
end

function MyComponent:OnUpdate(dt)
    -- Only runs when game is not paused
    self.game_timer = self.game_timer + dt
    if self.game_timer > 5 then
        self:DoSomething()
        self.game_timer = 0
    end
end
```

### Static Updates

Static updates run only when the server is paused, allowing certain systems to continue functioning.

#### StaticUpdate(dt) {#static-update}

**Status:** `stable`

**Description:**
Updates static components when the server is paused. Used for systems that need to continue running during pause.

**Parameters:**
- `dt` (number): Always 0 for static updates

**Example:**
```lua
-- Register for static updates
function MyComponent:StartStaticUpdating()
    StartStaticUpdatingComponent(self, self.inst)
end

function MyComponent:OnStaticUpdate(dt)
    -- Runs when server is paused, dt is always 0
    if self.should_continue_when_paused then
        self:ContinueOperation()
    end
end
```

## Advanced Update Functions

### PostUpdate(dt) {#post-update}

**Status:** `stable`

**Description:**
Runs after the main update loop completes. Used for cleanup operations and final processing.

**Parameters:**
- `dt` (number): Delta time in seconds

**Operations:**
- Updates emitter manager
- Runs update looper post-update

### PostPhysicsWallUpdate(dt) {#post-physics-wall-update}

**Status:** `stable`

**Description:**
Runs after physics wall updates complete. Currently handles walkable platform manager updates.

**Parameters:**
- `dt` (number): Delta time in seconds

### LongUpdate(dt, ignore_player) {#long-update}

**Status:** `stable`

**Description:**
Special update function for advancing simulation over long periods (cave transitions, night skipping).

**Parameters:**
- `dt` (number): Large delta time value representing the time skip
- `ignore_player` (boolean): Whether to skip updating player-related entities

**Example:**
```lua
-- Skip 8 hours of game time
TheWorld:LongUpdate(TUNING.TOTAL_DAY_TIME / 3, true)
```

## Component Registration Functions

### RegisterStaticComponentUpdate(classname, fn) {#register-static-component-update}

**Status:** `stable`

**Description:**
Registers a static update function for a component class.

**Parameters:**
- `classname` (string): Name of the component class
- `fn` (function): Update function to call

**Example:**
```lua
RegisterStaticComponentUpdate("mycomponent", function(dt)
    -- Static update logic for all instances
end)
```

### RegisterStaticComponentLongUpdate(classname, fn) {#register-static-component-long-update}

**Status:** `stable`

**Description:**
Registers a long update function for a component class.

**Parameters:**
- `classname` (string): Name of the component class
- `fn` (function): Long update function to call

**Example:**
```lua
RegisterStaticComponentLongUpdate("mycomponent", function(dt)
    -- Long update logic for time skipping
end)
```

## Update Registration

### Component Update Registration

Components can register for different types of updates:

```lua
-- For simulation updates
StartUpdatingComponent(component, entity)
StopUpdatingComponent(component, entity)

-- For wall time updates
StartWallUpdatingComponent(component, entity)
StopWallUpdatingComponent(component, entity)

-- For static updates (paused server)
StartStaticUpdatingComponent(component, entity)
StopStaticUpdatingComponent(component, entity)
```

### Update Flow

1. **Wall Update**: Always runs first, handles input and UI
2. **Static Update**: Runs when paused, for special systems
3. **Main Update**: Runs when not paused, handles game logic
4. **Post Update**: Cleanup after main update
5. **Post Physics Wall Update**: Final physics-related updates

## Performance Considerations

### Profiling

The update system includes built-in profiling:

```lua
TheSim:ProfilerPush("section_name")
-- Update operations
TheSim:ProfilerPop()
```

### Update Frequency

- **Wall Updates**: Run at display framerate (typically 60 FPS)
- **Simulation Updates**: Run at game tick rate (15 Hz by default)
- **Static Updates**: Only when server is paused
- **Long Updates**: Called manually for time skipping

## Common Usage Patterns

### Component Update Pattern

```lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.timer = 0
    self:StartUpdating()
end)

function MyComponent:OnUpdate(dt)
    self.timer = self.timer + dt
    if self.timer >= 1.0 then  -- Every second
        self:DoPeriodicAction()
        self.timer = 0
    end
end

function MyComponent:StartUpdating()
    StartUpdatingComponent(self, self.inst)
end

function MyComponent:StopUpdating()
    StopUpdatingComponent(self, self.inst)
end
```

### Wall Update Pattern

```lua
function MyComponent:OnWallUpdate(dt)
    -- Real-time operations (UI, input, etc.)
    self.realtime_accumulator = self.realtime_accumulator + dt
    
    if self.should_update_ui then
        self:UpdateUIElements()
    end
end
```

## Related Systems

- [**Scheduler**](./scheduler.md): Task scheduling system used within updates
- [**StateGraphs**](../stategraphs/stategraph.md): Updated during main update loop
- [**Brain**](./brain.md): AI brains updated during main update loop
- [**Components**](./entityscript.md): Component system that receives update calls

## Constants

The update system uses these key timing constants:

- `FRAMES_PER_TICK`: Number of wall frames per simulation tick
- `TICK_TIME`: Duration of one simulation tick in seconds
- Game runs at 15 simulation ticks per second by default
