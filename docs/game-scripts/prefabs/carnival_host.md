---
id: carnival_host
title: Carnival Host
description: Controls the behavior, interaction, and state of the Carnival Host NPC, including shop management, summoning to plazas, and chatter synchronization.
tags: [npc, shop, minigame, ai]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 11902e2a
system_scope: entity
---

# Carnival Host

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnival_host` prefab represents the NPC vendor in the Carnival event. It manages shop inventory (via the `prototyper` component), summoning behavior when a carnival plaza is built, and interactive dialogue (via the `talker` component). It integrates with the `knownlocations`, `locomotor`, and `minigame_spectator` components to handle positioning, movement, and event state tracking. This entity is conditionally spawned only during the Carnival event.

## Usage example
```lua
-- Typically not instantiated manually; created automatically via Prefab("carnival_host", fn, ...)
-- Example of adding a listener to detect when the host arrives at a plaza:
inst:ListenForEvent("ms_carnivalplazabuilt", function(world, plaza)
    if inst.summoncooldown == nil and not inst:HasTag("busy") then
        local success, reason = inst.SummonedToPlaza(inst, plaza)
        -- success is true if host successfully teleported/summoned
    end
end, TheWorld)
```

## Dependencies & tags
**Components used:** `talker`, `prototyper`, `knownlocations`, `locomotor`, `lootdropper`, `inspectable`, `minigame_spectator`
**Tags:** Adds `character`, `prototyper`; checks `busy`, `flight`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hassold_plaza` | boolean | `false` | Whether the host has ever sold plaza wares. Controls shop inventory. |
| `hassold_prizebooth` | boolean | `false` | Whether the host has ever sold prize booth items. |
| `hasbeento_plaza` | boolean | `false` | Whether the host has ever been summoned to a plaza. |
| `summoncooldown` | number or nil | `nil` | Handle to cooldown task (15 seconds) after summoning; prevents re-summoning. |
| `prototyper_chatter_task` | number or nil | `nil` | Handle to recurring chatter task (5–10 seconds interval). |

## Main functions
### `AddPlazaWares(inst)`
* **Description:** Updates the `prototyper` component to offer plaza-specific wares.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.
* **Error states:** Modifies `inst.components.prototyper.trees` unconditionally.

### `RemovePlazaWares(inst)`
* **Description:** Resets the `prototyper` to offer wander-shop wares.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `DoPrototyperChatter(inst)`
* **Description:** Triggers a random dialogue line related to shop offerings and schedules the next chatter after 5–10 seconds.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.
* **Error states:** Uses `inst.hassold_plaza` to select the dialogue table; if `inst.components.talker` is uninitialized or missing, no chatter occurs.

### `prototyper_onturnon(inst)`
* **Description:** Callback fired when the `prototyper` is turned on. Stops movement, forces a brain update, and starts chatter.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.
* **Error states:** Skips movement/brain updates if `minigame_spectator` component is missing.

### `prototyper_onturnoff(inst)`
* **Description:** Callback fired when the `prototyper` is turned off. Cancels the recurring chatter task.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `prototyper_onactivate(inst, doer, recipe)`
* **Description:** Handles recipe activation (e.g., player builds a carnival kit). Sets flags and updates shop inventory if the `carnival_plaza_kit` is crafted.
* **Parameters:** `inst` (entity instance), `doer` (player entity), `recipe` (recipe object).
* **Returns:** Nothing.
* **Error states:** Only acts on `carnival_plaza_kit` or `carnival_prizebooth_kit` recipes.

### `OnSummonedToPlaza(inst, plaza)`
* **Description:** Summons the host to the specified plaza if not on cooldown, busy, or flying. Sets `home` location, starts a 15-second cooldown, and transitions state to `flyaway` or `glide`.
* **Parameters:** `inst` (entity instance), `plaza` (plaza entity).
* **Returns:** `true` if successfully summoned; `false` otherwise. On failure, returns `false, "HOSTBUSY"` or `false, "CARNIVAL_HOST_HERE"` (commented out).
* **Error states:** Returns `false` if `plaza` is `nil`, lacks `carnival_plaza` tag, `summoncooldown` is active, `inst:HasTag("busy")`, or state graph has `flight` tag.

### `OnFirstPlazaBuiltImpl(inst, plaza)`
* **Description:** Handles first plaza construction event. Sets flags, adds plaza wares, cancels the global `ms_carnivalplazabuilt` listener, and summons the host.
* **Parameters:** `inst` (entity instance), `plaza` (plaza entity).
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes persisted flags (`hassold_plaza`, `hassold_prizebooth`, `hasbeento_plaza`) into save data.
* **Parameters:** `inst` (entity instance), `data` (table).
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores persisted flags and re-applies plaza wares if needed. Cancels the `ms_carnivalplazabuilt` listener if plaza was already visited.
* **Parameters:** `inst` (entity instance), `data` (table).
* **Returns:** Nothing.

### `OnLoadPostPass(inst)`
* **Description:** Ensures the host is not悬浮 above ground after loading. Forces `Y = 0` if `Y > 0.1`.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ms_carnivalplazabuilt` (global world event) — triggers `OnFirstPlazaBuiltImpl`.
- **Pushes:** None directly.
- **State Graph Events:** Relies on `SGcarnival_host` state transitions (`flyaway`, `glide`, `busy`, `flight` tags).