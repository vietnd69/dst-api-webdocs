---
id: worldsettingsutil
title: World Settings Util
description: Utility functions for managing external timers and world settings integration with game components
sidebar_position: 153
slug: api-vanilla/core-systems/worldsettingsutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# World Settings Util

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `worldsettingsutil` module provides utility functions for integrating world settings with component-based game systems. It enables components to use external timers managed by the world settings system instead of their internal timers, allowing for global configuration of spawning, regeneration, and other time-based mechanics.

## Usage Example

```lua
-- Set up external timer for a childspawner component
local worldsettingsutil = require("worldsettingsutil")

-- Configure spawn period timer
worldsettingsutil.WorldSettings_ChildSpawner_SpawnPeriod(inst, 20, true)

-- Configure regeneration timer  
worldsettingsutil.WorldSettings_ChildSpawner_RegenPeriod(inst, 30, true)
```

## Timer Function Generators

### MakePauseTimerFunction(timername) {#make-pause-timer-function}

**Status:** `stable`

**Description:**
Creates a function that pauses a named timer on an entity's worldsettingstimer component.

**Parameters:**
- `timername` (string): Name of the timer to pause

**Returns:**
- (function): Function that accepts an entity instance and pauses the timer

**Example:**
```lua
-- Create a pause function for a custom timer
local PauseCustomTimer = MakePauseTimerFunction("custom_timer")

-- Use the function to pause the timer
PauseCustomTimer(inst)
```

### MakeResumeTimerFunction(timername) {#make-resume-timer-function}

**Status:** `stable`

**Description:**
Creates a function that resumes a named timer on an entity's worldsettingstimer component.

**Parameters:**
- `timername` (string): Name of the timer to resume

**Returns:**
- (function): Function that accepts an entity instance and resumes the timer

### MakeStartTimerFunction(timername) {#make-start-timer-function}

**Status:** `stable`

**Description:**
Creates a function that starts/restarts a named timer with a specified delay.

**Parameters:**
- `timername` (string): Name of the timer to start

**Returns:**
- (function): Function that accepts an entity instance and delay, then starts the timer

**Example:**
```lua
-- Create a start function for spawn timer
local StartSpawnTimer = MakeStartTimerFunction("spawn_timer")

-- Start timer with 10 second delay
StartSpawnTimer(inst, 10)
```

### MakeStopTimerFunction(timername) {#make-stop-timer-function}

**Status:** `stable`

**Description:**
Creates a function that stops a named timer on an entity's worldsettingstimer component.

**Parameters:**
- `timername` (string): Name of the timer to stop

**Returns:**
- (function): Function that accepts an entity instance and stops the timer

## ChildSpawner Integration

The ChildSpawner component can use external timers for spawn period and regeneration period management.

### WorldSettings_ChildSpawner_SpawnPeriod(inst, spawnperiod, enabled) {#worldsettings-childspawner-spawnperiod}

**Status:** `stable`

**Description:**
Configures a ChildSpawner component to use an external timer for spawn period management instead of its internal timer.

**Parameters:**
- `inst` (Entity): Entity with ChildSpawner component
- `spawnperiod` (number): Time between spawn attempts in seconds
- `enabled` (boolean): Whether the timer should be enabled initially

**Returns:**
- None (modifies component behavior)

**Example:**
```lua
-- Set up spawn period timer for a spider den
WorldSettings_ChildSpawner_SpawnPeriod(inst, 15, true)

-- The ChildSpawner will now use external timing
print(inst.components.childspawner.useexternaltimer) -- true
```

**Integration Details:**
- Sets `childspawner.useexternaltimer = true`
- Assigns timer control functions to childspawner
- Creates and starts the external timer

### WorldSettings_ChildSpawner_RegenPeriod(inst, regenperiod, enabled) {#worldsettings-childspawner-regenperiod}

**Status:** `stable`

**Description:**
Configures a ChildSpawner component to use an external timer for regeneration period management.

**Parameters:**
- `inst` (Entity): Entity with ChildSpawner component
- `regenperiod` (number): Time between regeneration attempts in seconds
- `enabled` (boolean): Whether the timer should be enabled initially

**Returns:**
- None (modifies component behavior)

**Example:**
```lua
-- Set up regeneration timer for a hound mound
WorldSettings_ChildSpawner_RegenPeriod(inst, 60, true)
```

### WorldSettings_ChildSpawner_PreLoad(inst, data, spawnperiod_max, regenperiod_max) {#worldsettings-childspawner-preload}

**Status:** `stable`

**Description:**
Prepares ChildSpawner save data for external timer migration during world loading. Converts legacy childspawner timer data to worldsettingstimer format with normalized time values.

**Parameters:**
- `inst` (Entity): Entity being loaded
- `data` (table): Save data for the entity
- `spawnperiod_max` (number): Maximum spawn period for normalization
- `regenperiod_max` (number): Maximum regen period for normalization

**Returns:**
- None (modifies save data)

**Implementation Details:**
```lua
-- Actual implementation from source code
function WorldSettings_ChildSpawner_PreLoad(inst, data, spawnperiod_max, regenperiod_max)
    if data and data.childspawner and not data.worldsettingstimer then
        data.worldsettingstimer = { timers = {} }
        data.worldsettingstimer.timers[CHILDSPAWNER_SPAWNPERIOD_TIMERNAME] = {
            timeleft = math.min(data.childspawner.timetonextspawn, spawnperiod_max) / spawnperiod_max,
            paused = data.childspawner.spawning,
            initial_time = 0,
        }
        data.worldsettingstimer.timers[CHILDSPAWNER_REGENPERIOD_TIMERNAME] = {
            timeleft = math.min(data.childspawner.timetonextregen, regenperiod_max) / regenperiod_max,
            paused = data.childspawner.regening,
            initial_time = 0,
        }
    end
end
```

**Timer Name Constants:**
```lua
-- Defined timer names used by the system
local CHILDSPAWNER_SPAWNPERIOD_TIMERNAME = "ChildSpawner_SpawnPeriod"
local CHILDSPAWNER_REGENPERIOD_TIMERNAME = "ChildSpawner_RegenPeriod"
```

**Migration Logic:**
1. **Condition Check**: Only migrates if legacy data exists and worldsettingstimer doesn't
2. **Normalization**: Converts absolute time values to relative (0-1) scale
3. **State Preservation**: Maintains paused state from original timer
4. **Initial Time**: Sets to 0 for normalized timers

## Spawner Integration

### WorldSettings_Spawner_SpawnDelay(inst, startdelay, enabled) {#worldsettings-spawner-spawndelay}

**Status:** `stable`

**Description:**
Configures a Spawner component to use external timer for spawn delay management.

**Parameters:**
- `inst` (Entity): Entity with Spawner component
- `startdelay` (number): Initial spawn delay in seconds
- `enabled` (boolean): Whether the timer should be enabled initially

**Returns:**
- None (modifies component behavior)

**Example:**
```lua
-- Set up external spawn delay for a spawner
WorldSettings_Spawner_SpawnDelay(inst, 30, true)

-- Spawner will now use external timing
print(inst.components.spawner.useexternaltimer) -- true
```

**Integration Functions:**
- `spawner.starttimerfn`: Function to start the delay timer
- `spawner.stoptimerfn`: Function to stop the delay timer
- `spawner.timertestfn`: Function to check if timer exists

### WorldSettings_Spawner_PreLoad(inst, data, maxstartdelay) {#worldsettings-spawner-preload}

**Status:** `stable`

**Description:**
Migrates Spawner save data to external timer format during world loading.

**Parameters:**
- `inst` (Entity): Entity being loaded
- `data` (table): Save data for the entity
- `maxstartdelay` (number): Maximum start delay for normalization

**Returns:**
- None (modifies save data)

## Pickable Integration

### WorldSettings_Pickable_RegenTime(inst, regentime, enabled) {#worldsettings-pickable-regentime}

**Status:** `stable`

**Description:**
Configures a Pickable component to use external timer for regeneration timing.

**Parameters:**
- `inst` (Entity): Entity with Pickable component
- `regentime` (number): Time for regeneration in seconds
- `enabled` (boolean): Whether the timer should be enabled initially

**Returns:**
- None (modifies component behavior)

**Example:**
```lua
-- Set up external regen timer for a berry bush
WorldSettings_Pickable_RegenTime(inst, 180, true)

-- Pickable will now use external timing
print(inst.components.pickable.useexternaltimer) -- true
```

**Integration Functions:**
```lua
-- Functions assigned to pickable component
pickable.startregentimer    -- Start regeneration timer
pickable.stopregentimer     -- Stop regeneration timer
pickable.pauseregentimer    -- Pause regeneration timer
pickable.resumeregentimer   -- Resume regeneration timer
pickable.getregentimertime  -- Get remaining time
pickable.setregentimertime  -- Set remaining time
pickable.regentimerexists   -- Check if timer exists
```

### WorldSettings_Pickable_PreLoad(inst, data, maxregentime) {#worldsettings-pickable-preload}

**Status:** `stable`

**Description:**
Migrates Pickable save data to external timer format during world loading.

**Parameters:**
- `inst` (Entity): Entity being loaded
- `data` (table): Save data for the entity
- `maxregentime` (number): Maximum regeneration time for normalization

**Returns:**
- None (modifies save data)

## Timer Migration and Loading

### WorldSettings_Timer_PreLoad(inst, data, timername, maxtimeleft) {#worldsettings-timer-preload}

**Status:** `stable`

**Description:**
Generic function for migrating timer component data to worldsettingstimer format.

**Parameters:**
- `inst` (Entity): Entity being loaded
- `data` (table): Save data for the entity
- `timername` (string): Name of the timer to migrate
- `maxtimeleft` (number): Maximum time for normalization (optional)

**Returns:**
- None (modifies save data)

**Example:**
```lua
-- Migrate a custom timer during preload
WorldSettings_Timer_PreLoad(inst, data, "custom_timer", 100)
```

### WorldSettings_Timer_PreLoad_Fix(inst, data, timername, maxmultiplier) {#worldsettings-timer-preload-fix}

**Status:** `stable`

**Description:**
Fixes timer data by applying a maximum multiplier constraint to prevent extreme values.

**Parameters:**
- `inst` (Entity): Entity being loaded
- `data` (table): Save data for the entity
- `timername` (string): Name of the timer to fix
- `maxmultiplier` (number): Maximum multiplier to apply

**Returns:**
- None (modifies save data)

## Timer Event Handlers

### Timer Finished Callbacks

The module defines several timer finished callback functions that handle component-specific logic when external timers complete.

#### On_ChildSpawner_SpawnPeriod_TimerFinished(inst) {#on-childspawner-spawnperiod-timerfinished}

**Status:** `stable`

**Description:**
Handles spawn period timer completion for ChildSpawner components. Automatically restarts the timer and attempts spawning based on current component state.

**Implementation:**
```lua
local function On_ChildSpawner_SpawnPeriod_TimerFinished(inst)
    local childspawner = inst.components.childspawner

    if childspawner then
        local dospawn = childspawner.spawning and not childspawner.queued_spawn and childspawner.childreninside > 0
        inst.components.worldsettingstimer:StartTimer(CHILDSPAWNER_SPAWNPERIOD_TIMERNAME, childspawner:GetTimeToNextSpawn(), not dospawn)
        if dospawn then
            if childspawner:CanSpawnOffscreenOrAwake() then
                childspawner:SpawnChild()
            else
                childspawner:QueueSpawnChild()
            end
        end
    end
end
```

**Logic Flow:**
1. **Component Check**: Verifies childspawner component exists
2. **Spawn Condition**: Checks spawning state, queue status, and available children
3. **Timer Restart**: Always restarts timer with next spawn interval
4. **Timer State**: Pauses timer if spawn conditions aren't met
5. **Spawn Attempt**: Spawns immediately or queues based on visibility/sleep state

#### On_ChildSpawner_RegenPeriod_TimerFinished(inst) {#on-childspawner-regenperiod-timerfinished}

**Status:** `stable`

**Description:**
Handles regeneration period timer completion for ChildSpawner components. Manages child regeneration and emergency capacity checking.

**Implementation:**
```lua
local function On_ChildSpawner_RegenPeriod_TimerFinished(inst)
    local childspawner = inst.components.childspawner

    if childspawner then
        local doregen = childspawner.regening and not (childspawner:IsFull() and childspawner:IsEmergencyFull())
        inst.components.worldsettingstimer:StartTimer(CHILDSPAWNER_REGENPERIOD_TIMERNAME, childspawner:GetTimeToNextRegen(), not doregen)
        if doregen then
            childspawner:DoRegen()
        end
    end
end
```

**Logic Flow:**
1. **Component Check**: Verifies childspawner component exists
2. **Regen Condition**: Checks regening state and capacity (both normal and emergency)
3. **Timer Restart**: Always restarts timer with next regen interval
4. **Timer State**: Pauses timer if regen conditions aren't met (full capacity)
5. **Regen Execution**: Calls DoRegen() to increase child count if conditions allow

#### On_Spawner_StartDelay_TimerFinished(inst) {#on-spawner-startdelay-timerfinished}

**Status:** `stable`

**Description:**
Handles spawn delay timer completion for Spawner components.

**Logic Flow:**
1. Set external timer finished flag
2. Attempt spawn if entity is asleep or spawn off-screen is enabled

#### On_Pickable_RegenTime_TimerFinished(inst) {#on-pickable-regentime-timerfinished}

**Status:** `stable`

**Description:**
Handles regeneration timer completion for Pickable components.

**Logic Flow:**
1. Trigger component regeneration
2. Reset pickable state to ready

## Constants

### Timer Names

**Status:** `stable`

**Description:** Predefined timer names used by the system.

```lua
-- ChildSpawner timer names
CHILDSPAWNER_SPAWNPERIOD_TIMERNAME = "ChildSpawner_SpawnPeriod"
CHILDSPAWNER_REGENPERIOD_TIMERNAME = "ChildSpawner_RegenPeriod"

-- Spawner timer names
SPAWNER_STARTDELAY_TIMERNAME = "Spawner_SpawnDelay"

-- Pickable timer names
PICKABLE_REGENTIME_TIMERNAME = "Pickable_RegenTime"
```

## Integration Benefits

### Centralized Timer Management

- **Global Control**: All timers can be managed through world settings
- **Consistent Scaling**: Uniform difficulty scaling across components
- **Save Migration**: Automatic conversion of legacy save data
- **Performance**: Reduced timer overhead through centralization

### World Settings Compatibility

- **Dynamic Adjustment**: Timers can be modified at runtime
- **Difficulty Scaling**: Integration with world difficulty systems
- **Event Integration**: Timer changes trigger appropriate world events
- **Persistence**: Timer state is properly saved and loaded

## Related Modules

- [World Settings Overrides](./worldsettings_overrides.md): Uses these utilities for component timer configuration
- [World Settings Timer Component](../components/worldsettingstimer.md): The component that manages external timers
- [Child Spawner Component](../components/childspawner.md): Component that can use external timers
- [Spawner Component](../components/spawner.md): Component that can use external timers
- [Pickable Component](../components/pickable.md): Component that can use external timers
