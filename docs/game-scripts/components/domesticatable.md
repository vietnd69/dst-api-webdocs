---
id: domesticatable
title: Domesticatable
description: Manages the domestication and obedience mechanics for tameable entities, tracking changes via periodic decay tasks and broadcasting relevant events.
tags: [domestication, ai, entity, npc, behavior]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0fb45858
system_scope: entity
---

# Domesticatable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Domesticatable` implements the core logic for how an entity progresses toward and maintains domestication status — a state that allows interaction such as riding or wearing saddle items. It tracks `domestication` (a measure of taming progress), `obedience` (a measure of responsiveness to commands), and `tendencies` (behavioral preferences). The component uses periodic decay tasks to simulate attrition over time and exposes events for external systems to react to domestication milestones. It integrates closely with `hunger`, `rideable`, and `skilltreeupdater` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("domesticatable")
inst.components.domesticatable:DeltaDomestication(0.2)
inst.components.domesticatable:DeltaObedience(0.1)
inst.components.domesticatable:SetMinObedience(0.5)
```

## Dependencies & tags
**Components used:** `hunger`, `rideable`, `skilltreeupdater`  
**Tags:** Adds `domesticatable` on construction; adds/removes `domesticated` tag when `SetDomesticated(true/false)` is called.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(assigned via constructor)* | The entity instance this component belongs to. |
| `domesticated` | boolean | `false` | Whether the entity is currently domesticated. |
| `domestication` | number | `0` | Current domestication level, clamped to `0..1`. |
| `domestication_latch` | boolean | `false` | Latch that captures when domestication reaches `>= 1.0` before being reset. |
| `lastdomesticationgain` | number | `0` | Timestamp of the last domestication gain. |
| `obedience` | number | `0` | Current obedience level. |
| `minobedience` | number | `0` | Minimum allowed obedience value. |
| `maxobedience` | number | `1` | Maximum allowed obedience value. |
| `domesticationdecaypaused` | boolean | `false` | Whether domestication decay is paused. |
| `tendencies` | table | `{}` | Map of tendency names to float values (e.g., `{ "aggressive" = 0.3 }`). |
| `decaytask` | `Task` | `nil` | Periodic task managing decay updates. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the component on removal: cancels any pending decay task and removes the `domesticatable` tag.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetDomesticationTrigger(fn)`
* **Description:** Registers a callback function used to determine whether domestication should increase during decay updates.
* **Parameters:** `fn` (function) — A function expecting the entity instance as its sole argument, returning `true` to trigger gain.
* **Returns:** Nothing.

### `GetObedience()`
* **Description:** Returns the current obedience value.
* **Parameters:** None.
* **Returns:** number — Current obedience.

### `GetDomestication()`
* **Description:** Returns the current domestication value.
* **Parameters:** None.
* **Returns:** number — Current domestication (`0..1`).

### `Validate()`
* **Description:** Checks if the entity should remain domesticatable; cancels decay task and returns `false` if obedience ≤ minobedience, hunger depleted, and domestication ≤ 0.
* **Parameters:** None.
* **Returns:** boolean — `true` if valid, `false` otherwise.

### `CheckForChanges()`
* **Description:** Detects state transitions: latches domestication at `1.0`, resets latch below `0.95`, and triggers `"goneferal"` event if hunger is depleted and domestication is zero.
* **Parameters:** None.
* **Returns:** Nothing.

### `BecomeDomesticated()`
* **Description:** Converts the entity to domesticated state: latches domestication, sets domesticated flag, adds `domesticated` tag, and pushes `"domesticated"` event with current tendencies.
* **Parameters:** None.
* **Returns:** Nothing.

### `DeltaObedience(delta)`
* **Description:** Adjusts obedience by `delta`, clamping between `minobedience` and `maxobedience`. If changed, starts or restarts the decay task.
* **Parameters:** `delta` (number) — Amount to change obedience.
* **Returns:** Nothing.

### `DeltaDomestication(delta, doer)`
* **Description:** Adjusts domestication by `delta`, applying skill-based multipliers if `doer` has the `"beefalodomestication"` skill tag. Clamps value to `0..1`.
* **Parameters:**  
  - `delta` (number) — Amount to change domestication.  
  - `doer` (Entity or `nil`) — The actor applying the domestication change. If omitted, defaults to current rider (if any).
* **Returns:** Nothing.

### `DeltaTendency(tendency, delta)`
* **Description:** Updates the numeric value of a named tendency.
* **Parameters:**  
  - `tendency` (string) — The name of the tendency (e.g., `"peaceful"`).  
  - `delta` (number) — Amount to change the tendency value.
* **Returns:** Nothing.

### `PauseDomesticationDecay(pause)`
* **Description:** Enables or disables decay of domestication (obedience decay continues unaffected).
* **Parameters:** `pause` (boolean) — `true` to pause decay, `false` to resume.
* **Returns:** Nothing.

### `TryBecomeDomesticated()`
* **Description:** Attempts to transition to domesticated if the latch is set.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetDomesticated(domesticated)`
* **Description:** Explicitly sets the domesticated state and manages the `domesticated` tag and validation.
* **Parameters:** `domesticated` (boolean)
* **Returns:** Nothing.

### `IsDomesticated()`
* **Description:** Returns whether the entity is currently domesticated.
* **Parameters:** None.
* **Returns:** boolean — `true` if domesticated, `false` otherwise.

### `SetMinObedience(min)`
* **Description:** Sets the minimum obedience threshold and corrects current obedience if below the new minimum.
* **Parameters:** `min` (number)
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes domestication state for saving, including optional rideable data.
* **Parameters:** None.
* **Returns:** table — Save data including `domestication`, `tendencies`, `domestication_latch`, `domesticated`, `obedience`, `minobedience`, `lastdomesticationgaindelta`, and `rideable`.

### `OnLoad(data, newents)`
* **Description:** Restores domestication state from save data and initializes the decay task.
* **Parameters:**  
  - `data` (table or `nil`) — Save data from `OnSave()`.  
  - `newents` (table) — Used for entity respawn resolution (passed to `rideable:OnLoadDomesticatable`).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing domestication status, obedience range, tendencies, and latch.
* **Parameters:** None.
* **Returns:** string — Debug representation of internal state.

## Events & listeners
- **Listens to:** None.
- **Pushes:**  
  - `"domesticated"` — fired when `BecomeDomesticated()` is called; payload includes `tendencies`.  
  - `"goneferal"` — fired when entity becomes feral due to starvation and zero domestication; payload includes `domesticated`.  
  - `"domesticationdelta"` — fired when domestication value changes; payload `{ old = number, new = number }`.  
  - `"obediencedelta"` — fired when obedience value changes; payload `{ old = number, new = number }`.
