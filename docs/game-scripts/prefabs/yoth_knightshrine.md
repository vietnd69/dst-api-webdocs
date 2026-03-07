---
id: yoth_knightshrine
title: Yoth Knightshrine
description: Manages the lifecycle, offering acceptance, and heckler behavior of the Yoth Knightshrine structure in Don't Starve Together.
tags: [structure, crafting, npc, boss, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 91e81cf7
system_scope: environment
---

# Yoth Knightshrine

> Based on game build **714004** | Last updated: 2026-03-07

## Overview
The `yoth_knightshrine` prefab represents a specialized structure used during the Yoth boss encounter. It serves as an interactive offering point where players can insert specific components (e.g., gears, wires, transistors) to activate its prototyper functionality and spawn a Heckler NPC. The structure manages state transitions between empty, offering-accepted, and burnt states, integrates with the `yoth_hecklermanager`, and handles destruction via hammering or burning.

## Usage example
```lua
-- Adding and configuring a Knightshrine instance (typically done internally by the prefab system)
local inst = SpawnPrefab("yoth_knightshrine")
-- The shrine is automatically populated with components and tags
-- A player can give an item (e.g., "gears") to trigger offering acceptance
inst.components.trader:AcceptItem(given_item) -- triggers onaccept callback → SetOffering()
-- Hammering the shrine drops the offering and resets it to empty state
```

## Dependencies & tags
**Components used:** `lootdropper`, `timer`, `workable`, `burnable`, `prototyper`, `trader`, `hauntable`, `inspectable`, `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`, `fueled` (via `MakeMediumBurnable`), `propagator` (via `MakeMediumPropagator`), `yoth_hecklermanager` (referenced via `TheWorld.components.yoth_hecklermanager`)

**Tags added:** `structure`, `knightshrine`, `prototyper`

**Tags checked:** `burnt`, `ignoretalking`, `debuffed`, `buffed`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offering` | entity or `nil` | `nil` | The currently accepted item (e.g., gears, trinket_6, transistor). |
| `heckler` | entity or `nil` | `nil` | Reference to the spawned Charlie Heckler NPC associated with this shrine. |
| `_delay_heckler_spawn` | task or `nil` | `nil` | Delayed task used to control heckler spawning timing after prototyper activation. |
| `was_hammered` | boolean or `nil` | `nil` | Temporary flag used during hammering to track animation state. |

## Main functions
### `SetOffering(inst, offering, loading)`
*   **Description:** Accepts and attaches an offering item to the shrine. Activates the prototyper, spawns a heckler (delayed), updates animations, and pushes the `ms_knightshrineactivated` event.
*   **Parameters:** `offering` (entity) — the item to attach; `loading` (boolean, optional) — if `true`, suppresses sound and animation feedback (used during world load).
*   **Returns:** Nothing.
*   **Error states:** Returns early if the offered item is identical to the current offering.

### `MakeEmpty(inst, loading)`
*   **Description:** Clears the current offering, deactivates the prototyper, reverts to the trader component (if not burnt), resets animations/sounds, and pushes `ms_knightshrinedeactivated` on offering removal.
*   **Parameters:** `loading` (boolean, optional) — suppresses feedback when loading from save data.
*   **Returns:** Nothing.

### `MakePrototyper(inst)`
*   **Description:** Replaces the `trader` component with `prototyper`, sets allowed trees, and registers callbacks. Also schedules the heckler spawn delay task.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Removes existing `trader` and prevents duplication of `prototyper`.

### `DropOffering(inst, worker)`
*   **Description:** Detaches and flings the current offering away (to the player if `worker` is provided). Hides the gears animation, and deactivates the shrine via `UnregisterShrine`.
*   **Parameters:** `worker` (entity or `nil`) — the entity hammering the shrine.
*   **Returns:** Nothing.

### `SpawnHeckler(inst)`
*   **Description:** Spawns a `charlie_heckler` prefab and attaches it as a follower to the shrine's `bird1` symbol.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onremove` (offering) → triggers `MakeEmpty` if offering is removed prematurely.
  - `ondeconstructstructure` → triggers `DropOffering`.
  - `onremove` (shrine itself) → triggers `OnRemove`, which unregisters and destroys the heckler.
  - `onbuilt` → triggers `on_built`, which initializes the shrine in empty state.
  - `death` → internal (via `burnable` component, not directly handled here).
- **Pushes:**
  - `ms_knightshrineactivated` — fired when an offering is successfully attached.
  - `ms_knightshrinedeactivated` — fired when the shrine is deactivated or removed.
  - `entity_droploot` — fired internally by `lootdropper:DropLoot`.