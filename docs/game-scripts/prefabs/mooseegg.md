---
id: mooseegg
title: Mooseegg
description: Manages the lifecycle of a moose nest, including egg incubation, spawning of a guardian moose, and hatching of mosslings when conditions are met.
tags: [nesting, guardian, herding, hatching, lightning]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8bb282f0
system_scope: world
---

# Mooseegg

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mooseegg` is a complex prefab that represents a moose nest and its associated hatching behavior. It functions as a spawner for guardian moose and a herder for mossling offspring. The component manages the full lifecycle: initial egg placement, hatch timer, player-triggered cracking, lightning-induced hatching, and guardian summoning. It integrates tightly with the `herd`, `guardian`, `named`, `timer`, `workable`, and `playerprox` components.

## Usage example
```lua
-- Typical use via the game's world generation (not direct instantiation by mods)
-- The prefab is defined as "mooseegg" and spawned automatically by the moose spawner
-- Mods may interact via:
local nest = TheWorld:FindEntityWithTag("mooseegg")
if nest and nest.components.herd then
    -- Access mosslings in the herd
    print(#nest.components.herd.members)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `timer`, `entitytracker`, `herd`, `guardian`, `named`, `playerprox`, `workable`  
**Tags added:** `lightningrod`  
**Tags used for internal logic:** `_named` (temporary), `mossling` (via herd), `busy` (state tag)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_workable` | `ACTIONS` | `ACTIONS.HAMMER` | Action shown in scrapbook for interacting with the nest. |
| `scrapbook_anim` | string | `"idle"` | Animation name shown in scrapbook. |
| `mooseIncoming` | boolean | `false` | Internal flag used by `moose_nesting_ground` to indicate a moose is pending spawn. |

## Main functions
### `InitEgg(inst)`
*   **Description:** Initializes an egg by transitioning the state graph to `"land"` and starting the hatch timer.
*   **Parameters:** `inst` (entity) — the nest instance.
*   **Returns:** Nothing.

### `OnSummonMoose(inst, guardian)`
*   **Description:** Callback invoked when the guardian moose is summoned. Positions the moose slightly offset and initiates a glide state.
*   **Parameters:**  
    - `inst` (entity) — the nest instance.  
    - `guardian` (entity) — the newly spawned moose.
*   **Returns:** Nothing.

### `OnGuardianDeath(inst, guardian, cause)`
*   **Description:** Callback invoked when the guardian moose dies. Assigns the last attacker as target to all mosslings and sets them to run.
*   **Parameters:**  
    - `inst` (entity) — the nest instance.  
    - `guardian` (entity) — the moose that died.  
    - `cause` (any) — cause of death (unused directly).
*   **Returns:** Nothing.

### `OnDismissMoose(inst, guardian)`
*   **Description:** Marks the guardian moose to be dismissed by setting `shouldGoAway = true`.
*   **Parameters:**  
    - `inst` (entity) — the nest instance.  
    - `guardian` (entity) — the moose being dismissed.
*   **Returns:** Nothing.

### `MakeWorkable(inst, bool)`
*   **Description:** Toggles workable interaction (e.g., hammering) on the nest. When enabled,hammering triggers cracking, stops the hatch timer, and deals electric damage to the hammerer (unless insulated).
*   **Parameters:**  
    - `inst` (entity) — the nest instance.  
    - `bool` (boolean) — `true` to enable, `false` to disable.
*   **Returns:** Nothing.

### `rename(inst)`
*   **Description:** Assigns a new random name to the nest from `possiblenames`.
*   **Parameters:** `inst` (entity) — the nest instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes whether the nest currently holds an egg (based on state tag `"egg"`).
*   **Parameters:**  
    - `inst` (entity) — the nest instance.  
    - `data` (table) — save data table.
*   **Returns:** Nothing.

### `OnLoadPostPass(inst, ents, data)`
*   **Description:** Restores the correct state graph (`idle_full`, `crack`, or `idle_empty`) on load based on saved egg state and timer status.
*   **Parameters:**  
    - `inst` (entity) — the nest instance.  
    - `ents` (table) — loaded entities (unused).  
    - `data` (table) — saved data.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Callback for hatch timer completion; transitions state to `"crack"`.
*   **Parameters:**  
    - `inst` (entity) — the nest instance.  
    - `data` (table) — timer event data with `name` field.
*   **Returns:** Nothing.

### `OnSummonMoose(inst, guardian)`
*   **Description:** Positions and starts the guardian moose in glide state.

### `OnDismissMoose(inst, guardian)`
*   **Description:** Sets `shouldGoAway = true` on the guardian.

### `OnGuardianDeath(inst, guardian, cause)`
*   **Description:** Assigns last attacker as target and enables running on mosslings.

## Events & listeners
- **Listens to:** `timerdone` — triggers `OnTimerDone` to process hatch timer completion.  
- **Pushes:** No custom events are fired by the component itself (uses existing state transitions and component events).