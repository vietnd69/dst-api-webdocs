---
id: domesticatable
title: Domesticatable
description: Manages domestication progress, obedience levels, and tendency tracking for rideable creatures like beefalo.
tags: [creature, domestication, progression]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: component
source_hash: 6e38eba2
system_scope: entity
---

# Domesticatable

> Based on game build **722832** | Last updated: 2026-04-28

## Overview

`domesticatable.lua` defines the `Domesticatable` component that tracks and manages the domestication state of creatures (primarily beefalo). It maintains domestication progress (0-1 scale), obedience levels, and tendency values that determine creature behavior after domestication. The component runs a periodic decay task that reduces obedience and tendencies over time, with loss calculations based on player interaction frequency. It integrates with `hunger` for starvation checks, `rideable` for rider detection, and `skilltreeupdater` for skill-based domestication bonuses.

## Usage example

```lua
local inst = CreateEntity()
inst:AddComponent("domesticatable")

-- Set up domestication trigger function
inst.components.domesticatable:SetDomesticationTrigger(function(inst)
    return inst.components.rideable:GetRider() ~= nil
end)

-- Modify domestication and obedience
inst.components.domesticatable:DeltaDomestication(0.1)
inst.components.domesticatable:DeltaObedience(0.5)

-- Check domestication state
if inst.components.domesticatable:IsDomesticated() then
    print("Creature is domesticated")
end

-- Pause decay during events
inst.components.domesticatable:PauseDomesticationDecay(true)
```

## Dependencies & tags

**External dependencies:**
- `easing` -- required but not directly used in visible functions (may be legacy or for future use)

**Components used:**
- `hunger` -- `GetPercent()` called in `Validate()` and `CheckForChanges()` to detect starvation
- `rideable` -- `GetRider()`, `OnSaveDomesticatable()`, `OnLoadDomesticatable()` for rider detection and save/load coordination
- `skilltreeupdater` -- `HasSkillTag()` called to apply domestication skill bonuses

**Tags:**
- `domesticatable` -- added on construction, removed on `OnRemoveFromEntity()`
- `domesticated` -- added/removed via `AddOrRemoveTag()` when domestication state changes

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `domesticated` | boolean | `false` | Whether the creature is fully domesticated (domestication >= 1.0). |
| `domestication` | number | `0` | Current domestication progress (0-1 scale). |
| `domestication_latch` | boolean | `false` | Flag set when domestication reaches 1.0, triggers `BecomeDomesticated()` on next check. |
| `lastdomesticationgain` | number | `nil` | Timestamp of last domestication gain, used for loss calculations when trigger function is not active. |
| `domestication_triggerfn` | function | `nil` | Callback function that returns true when domestication should increase. Set via `SetDomesticationTrigger()`. |
| `obedience` | number | `0` | Current obedience level (clamped between minobedience and maxobedience). |
| `minobedience` | number | `0` | Minimum obedience threshold. |
| `maxobedience` | number | `1` | Maximum obedience cap. |
| `domesticationdecaypaused` | boolean | `false` | When true, tendency decay is paused but obedience still decays. |
| `tendencies` | table | `{}` | Map of tendency names to values (e.g., `rider`, `ornery`, `pudgy`). |
| `decaytask` | task | `nil` | Reference to the periodic decay task. Nil when task is not running. |

## Main functions

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Cancels decay task and removes both `domesticatable` and `domesticated` tags.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `SetDomesticationTrigger(fn)`
* **Description:** Sets the callback function that determines when domestication should increase. The function is called each decay tick and should return `true` when the creature is being actively domesticated (e.g., when being ridden).
* **Parameters:** `fn` -- function that takes `inst` and returns boolean
* **Returns:** None
* **Error states:** None.

### `GetObedience()`
* **Description:** Returns the current obedience level.
* **Parameters:** None
* **Returns:** Number between `minobedience` and `maxobedience`.
* **Error states:** None.

### `GetDomestication()`
* **Description:** Returns the current domestication progress.
* **Parameters:** None
* **Returns:** Number between 0 and 1.
* **Error states:** None.

### `Validate()`
* **Description:** Checks if the creature should continue running the decay task. Returns `false` if obedience is at minimum, hunger is at 0%, and domestication is at 0 (creature has gone feral).
* **Parameters:** None
* **Returns:** `true` if decay task should continue, `false` if task should be cancelled.
* **Error states:** Errors if `hunger` component is missing (nil dereference on `self.inst.components.hunger` — no guard present).

### `CheckForChanges()`
* **Description:** Checks domestication thresholds and handles state transitions. Sets `domestication_latch` when domestication reaches 1.0. If hunger is 0% and domestication is 0, clears tendencies, pushes `goneferal` event, and calls `SetDomesticated(false)` if previously domesticated.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `hunger` component is missing (nil dereference on `self.inst.components.hunger` — no guard present).

### `BecomeDomesticated()`
* **Description:** Transitions the creature to fully domesticated state. Clears the domestication latch, calls `SetDomesticated(true)`, and pushes the `domesticated` event with current tendencies.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `DeltaObedience(delta)`
* **Description:** Applies a delta to obedience level and restarts decay task if changed. Obedience is clamped between `minobedience` and `maxobedience`.
* **Parameters:** `delta` -- number to add to obedience (can be negative)
* **Returns:** None
* **Error states:** None.

### `DeltaDomestication(delta, doer)`
* **Description:** Applies a delta to domestication progress. If delta is positive, checks for `beefalodomestication` skill tag on the rider and applies a multiplier. Clamps domestication between 0 and 1, sets `maxobedience` to 1, and triggers change checks.
* **Parameters:**
  - `delta` -- number to add to domestication (can be negative)
  - `doer` -- player entity (optional, auto-detected from rideable rider if nil)
* **Returns:** None
* **Error states:** None.

### `DeltaTendency(tendency, delta)`
* **Description:** Applies a delta to a specific tendency value. Creates the tendency entry if it doesn't exist.
* **Parameters:**
  - `tendency` -- string tendency name (e.g., `"rider"`, `"ornery"`, `"pudgy"`)
  - `delta` -- number to add to tendency
* **Returns:** None
* **Error states:** None.

### `PauseDomesticationDecay(pause)`
* **Description:** Pauses or resumes domestication decay. When paused, tendency decay stops but obedience continues to decay.
* **Parameters:** `pause` -- boolean to pause (true) or resume (false) decay
* **Returns:** None
* **Error states:** None.

### `TryBecomeDomesticated()`
* **Description:** Checks if `domestication_latch` is set and calls `BecomeDomesticated()` if true. Should be called after domestication changes to trigger the transition.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `CancelTask()`
* **Description:** Cancels the periodic decay task if running. Sets `decaytask` to nil.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `CheckAndStartTask()`
* **Description:** Validates the component state and starts the periodic decay task if not already running. Task calls `UpdateDomestication` every `DECAY_TASK_PERIOD` seconds.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `SetDomesticated(domesticated)`
* **Description:** Sets the domesticated state and validates. Updates the `domesticated` tag via `AddOrRemoveTag`.
* **Parameters:** `domesticated` -- boolean (defaults to `false` if nil)
* **Returns:** None
* **Error states:** None.

### `IsDomesticated()`
* **Description:** Returns whether the creature is currently domesticated.
* **Parameters:** None
* **Returns:** Boolean.
* **Error states:** None.

### `SetMinObedience(min)`
* **Description:** Sets the minimum obedience threshold. If current obedience is below the new minimum, applies a delta to raise it. Restarts decay task.
* **Parameters:** `min` -- number for minimum obedience
* **Returns:** None
* **Error states:** None.

### `OnSave()`
* **Description:** Returns a table of state to persist on world save. Includes domestication, tendencies, latch state, obedience, and delegates rideable save to the rideable component.
* **Parameters:** None
* **Returns:** Table with save data, or `nil` if no data to save.
* **Error states:** None.

### `OnLoad(data, newents)`
* **Description:** Restores state from saved data. Resets obedience to 0 then applies saved value via `DeltaObedience()`. Restores `lastdomesticationgain` timestamp and delegates rideable load to the rideable component. Starts decay task after load.
* **Parameters:**
  - `data` -- table from `OnSave()`
  - `newents` -- entity mapping for save record resolution
* **Returns:** None
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing domestication state, decay status, percentages, obedience range, tendencies, and latch state. Used for console debugging.
* **Parameters:** None
* **Returns:** String with debug information.
* **Error states:** None.

## Events & listeners

**Pushes:**
- `goneferal` -- pushed when hunger is 0% and domestication is 0. Data: `{domesticated = boolean}`
- `domesticated` -- pushed when creature becomes fully domesticated. Data: `{tendencies = table}`
- `obediencedelta` -- pushed when obedience changes. Data: `{old = number, new = number}`
- `domesticationdelta` -- pushed when domestication changes. Data: `{old = number, new = number}`