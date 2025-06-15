---
id: worldsettings
title: World Settings API
sidebar_position: 4
last_updated: 2023-07-06
---

# World Settings API

Configuration options and controls for world generation settings.

## Overview

The World Settings API provides functionality for adjusting game parameters that affect world behavior. It allows for customization of spawn rates, regeneration times, and various environmental factors.

## Key Components

### World Settings Timer

The `worldsettingstimer` component manages timers that are affected by world settings:

```lua
-- Add a timer affected by world settings
local timer_name = "my_timer"
local duration = 60 -- seconds
local enabled = true
inst.components.worldsettingstimer:AddTimer(timer_name, duration, enabled, callback_fn)

-- Start/stop/pause timer
inst.components.worldsettingstimer:StartTimer(timer_name, duration)
inst.components.worldsettingstimer:StopTimer(timer_name)
inst.components.worldsettingstimer:PauseTimer(timer_name)
inst.components.worldsettingstimer:ResumeTimer(timer_name)

-- Check timer status
local time_left = inst.components.worldsettingstimer:GetTimeLeft(timer_name)
local is_active = inst.components.worldsettingstimer:ActiveTimerExists(timer_name)
```

### World Settings Overrides

The game provides systems to override default settings based on player-selected difficulty:

```lua
-- Applying world settings overrides
WorldSettings_Spawner_SpawnDelay(inst, startdelay, enabled)
WorldSettings_ChildSpawner_SpawnPeriod(inst, spawnperiod, enabled)
WorldSettings_ChildSpawner_RegenPeriod(inst, regenperiod, enabled)
WorldSettings_Pickable_RegenTime(inst, regentime, enabled)
```

## Common Use Cases

### Entity Spawners

Control spawn rates and behaviors for entities in the world:

```lua
-- Configure a beefalo spawner with world settings
local spawner = inst.components.childspawner
WorldSettings_ChildSpawner_SpawnPeriod(inst, TUNING.BEEFALO_SPAWN_PERIOD, true)
WorldSettings_ChildSpawner_RegenPeriod(inst, TUNING.BEEFALO_REGEN_PERIOD, true)
```

### Resource Regeneration

Adjust how quickly resources regenerate:

```lua
-- Configure berry bush regrowth with world settings
local pickable = inst.components.pickable
WorldSettings_Pickable_RegenTime(inst, TUNING.BERRY_REGROW_TIME, true)
```

### World Events

Configure timing for world events like boss appearances:

```lua
-- Set up timer for seasonal giant appearance
local worldsettingstimer = TheWorld.components.worldsettingstimer
worldsettingstimer:AddTimer("bearger_spawn", TUNING.BEARGER_SPAWN_DELAY, true, OnBeargerTimerDone)
```

## Settings Synchronization

For dedicated servers, settings can be synchronized across shards:

```lua
-- Synchronize settings from master shard to secondary shards
Shard_SyncWorldSettings(world_id, is_resync)

-- Apply synchronized settings from master shard
WorldSettings_Overrides.Sync[option](value)
```

## Related Systems

- **Customize Menu**: Frontend interface for selecting world settings
- **World Generation**: Initial world creation based on settings
- **Tuning Variables**: Default values for game parameters 
