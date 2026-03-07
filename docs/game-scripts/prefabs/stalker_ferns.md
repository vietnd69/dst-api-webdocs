---
id: stalker_ferns
title: Stalker Ferns
description: A world entity that starts as a wilted plant, blooms after a delay, becomes harvestable, and then decays after being left unharvested for a set time.
tags: [environment, plant, interactivity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7496114f
system_scope: world
---

# Stalker Ferns

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`stalker_ferns` defines the `stalker_fern` prefab, a decorative and harvestable environmental entity found in the world. It cycles through three states: wilted (initial), blooming (transitional), and bloomed (harvestable). Once bloomed, it becomes temporarily harvestable (`caninteractwith = true`), and if left unharvested, it automatically wilts and removes itself after `TUNING.STALKER_BLOOM_DECAY + random()` seconds. It is closely tied to the `pickable` and `burnable` components and supports replication, tagging, and inspection.

## Usage example
This prefab is not typically instantiated directly in mod code. Instead, modders reference it via the prefab name `"stalker_fern"` or extend it. Example usage in a mod (e.g., to detect when it blooms):
```lua
local function OnStalkerBloom(inst)
    print("Stalker fern bloomed!")
    -- Add custom behavior
end

inst:ListenForEvent("bloom", function(data)
    if data.ent and data.ent.prefab == "stalker_fern" then
        OnStalkerBloom(data.ent)
    end
end)
```

## Dependencies & tags
**Components used:** `pickable`, `burnable`, `inspectable`, `lootdropper`  
**Tags added:** `stalkerbloom`  
**Tags checked:** None (only adds tags)  
**External functions called:** `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableIgnite`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | string or number | `""` or `"2"`, `"3"`, or `"4"` | Stores the random bloom variant; determines animation suffix and loot count. |
| `_killtask` | task | `nil` | Task reference for delayed self-destruction after blooming. |
| `persists` | boolean | `false` | If `false`, entity does not save/restore across world reloads. |

## Main functions
### `KillPlant(inst)`
*   **Description:** Called after a delay following the bloom state to wilt and remove the entity. Sets `caninteractwith = false`, cancels the bloom timer, and triggers the "wilt" animation, scheduling removal on animation end.
*   **Parameters:** `inst` (Entity) — the stalker fern entity instance.
*   **Returns:** Nothing.
*   **Error states:** Safe to call multiple times (Idempotent: `_killtask` is nulled after first execution).

### `OnBloomed(inst)`
*   **Description:** Callback for when the "bloom" animation completes. Switches the entity to harvestable state: plays the appropriate "idle" animation, enables interaction, and schedules `KillPlant`.
*   **Parameters:** `inst` (Entity) — the stalker fern entity instance.
*   **Returns:** Nothing.
*   **Error states:** Removes its own callback to avoid duplicate calls; safe only during bloom phase.

### `OnPicked(inst)`
*   **Description:** Callback invoked when the plant is harvested. Cancels the scheduled decay, removes the bloom callback, plays the "picked" animation, and schedules removal on animation end.
*   **Parameters:** `inst` (Entity) — the stalker fern entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers either `OnBloomed` (initial bloom animation) or `inst.Remove` (after picking or wilting).  
  *(Note: The `onpickedfn` for `pickable` is assigned to `OnPicked`, but the event listeners above are registered via `inst:ListenForEvent` explicitly.)*  
- **Pushes:** None — this entity does not push custom events; interaction is handled via component callbacks.