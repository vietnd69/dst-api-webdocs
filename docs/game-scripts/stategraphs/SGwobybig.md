---
id: SGwobybig
title: Sgwobybig
description: Manages the state graph for the Big Woby creature, controlling its animations, locomotion, and interactions during gameplay.
tags: [ai, locomotion, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 28d217ca
system_scope: entity
---

# Sgwobybig

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwobybig` defines the state machine for the Big Woby entity in Don't Starve Together. It orchestrates all movement, idle behaviors, transformations, and action responses via a collection of named states, each with specific timing, animation, sound, and locomotion logic. The state graph integrates closely with components such as `locomotor`, `hunger`, `sleeper`, `rideable`, and `wobyrack`, and inherits common behaviors from `SGcritter_common` and `commonstates`.

## Usage example
```lua
-- This state graph is automatically applied to the Big Woby prefab
-- and should not be manually instantiated or modified by mods.
-- Standard usage is via the core Woby prefabs in prefabs/wobycommon.lua.

-- Example of checking Woby's state from external code:
if woby.inst.sg:HasStateTag("busy") then
    -- Woby is currently performing a long action or transformation
end
```

## Dependencies & tags
**Components used:** `locomotor`, `hunger`, `sleeper`, `rideable`, `wobyrack`, `container`, `workable`, `pickable`, `hounded`  
**Tags added/checked:** `idle`, `busy`, `moving`, `running`, `canrotate`, `alert`, `sitting`, `cower`, `jumping`, `transforming`  
**Notable tag behavior:** The stategraph dynamically adds/removes tags (e.g., `transforming` during transformation) and uses them to gate state transitions and animation variants.

## Properties
No public properties — this is a stategraph definition returning a `StateGraph` object, not a component with instance-level properties.

## Main functions
This file does not define any standalone functions — it returns a `StateGraph` object via `StateGraph("wobybig", states, events, "idle", actionhandlers)`. Individual states define `onenter`, `onexit`, `ontimeout`, `onupdate`, and `timeline` callbacks that execute per-state logic. Key behavior types are:

### `onenter` callbacks (per state)
*   **Description:** Executed once when entering a state; handles animation playback, sound triggers, locomotion changes, and buffered action storage.
*   **Parameters:** Varies per state (e.g., `data`, `timeout`, `target`); documented in-line within state definitions.
*   **Returns:** Nothing.
*   **Error states:** None — fails silently on invalid component access (e.g., `inst.components.X` may be `nil` in rare cases).

### `ontimeout` callbacks (e.g., `idle`, `run`)
*   **Description:** Triggered by `inst.sg:SetTimeout(...)` after a duration; typically cycles back to same state or transitions to next idle.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onupdate` callbacks (e.g., `pickup`, `bash_jump`)
*   **Description:** Executed per tick while in the state; used for real-time physics overrides or target tracking.
*   **Parameters:** None (uses `inst` from closure).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `transform`, `showrack`, `showalignmentchange`, `start_sitting`, `animqueueover`, `animover`, `animqueueover`, `playernewstate`, `stop_sitting`, `OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze`, `OnHop`, `OnSink`, `OnFallInVoid`.
- **Pushes:** No custom events — relies entirely on core event system (`inst:PushEvent(...)`) indirectly via component and stategraph internals.