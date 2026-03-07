---
id: archive_lockbox
title: Archive Lockbox
description: Represents a storage and knowledge-dispensing entity in the Grotto environment, used to unlock blueprints and manage archival puzzle data.
tags: [inventory, crafting, grotto, puzzle, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ac853099
system_scope: world
---

# Archive Lockbox

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `archive_lockbox` prefab is a Grotto-specific item used to dispense blueprints and manage archived knowledge. It appears as a physical object that players can interact with to unlock crafting recipes. When activated, it spawns blueprints for specific recipes and broadcasts announcements to nearby players. It also persists puzzle state (`inst.puzzle`) and product configuration (`inst.product_orchestrina`) across saves. The `archive_lockbox_dispencer` version acts as a static dispenser that releases lockboxes when powered and activated.

## Usage example
```lua
local lockbox = SpawnPrefab("archive_lockbox")
lockbox.product_orchestrina = "archive_resonator"
lockbox.components.inventoryitem:SetOnPutInInventoryFn(function(inst)
    inst.removewhenspawned = nil
end)
lockbox:PushEvent("onteach")
```

## Dependencies & tags
**Components used:**  
`inventoryitem`, `inspectable`, `tradable`, `activatable`, `lootdropper`, `talker` (via players), `builder` (via players), `inventory` (via players)

**Tags:** Adds `"archive_lockbox"` tag. The dispenser version adds `"structure"` and `"dustable"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `puzzle` | table | `{1,2,3,4,5,6,7,8}` (randomized on init) | Array of 8 integers in random order; used for puzzle validation. |
| `product_orchestrina` | string | `""` (dispenser) / `nil` (lockbox) | Name of the product to unlock (e.g., `"archive_resonator"`). Automatically normalized to `"archive_resonator_item"` for resolvers. |
| `vaultpowered` | boolean / `nil` | `nil` | Set to `true` only for `vaultrelic` and `turf_vault` dispensers, enabling special visual states. |
| `pastloot` | entity / `nil` | `nil` | Reference to the last lockbox spawned by the dispenser (used for removal after erosion). |

## Main functions
### `teach(inst)`
* **Description:** Unlocks blueprints for the recipes associated with `inst.product_orchestrina` to all players within range. Spawns a visual effect and sends a talk announcement to each player.
* **Parameters:** `inst` — The lockbox entity instance.
* **Returns:** Nothing.
* **Error states:** Silently skips players without the `builder` component. Blueprint spawning is conditional on `builder:KnowsRecipe(recipe)` returning `false`.

### `OnTeach(inst)`
* **Description:** Triggered by the `"onteach"` event. Initiates the lockbox activation sequence (animation and sound), then calls `teach(inst)` after animation duration.
* **Parameters:** `inst` — The lockbox entity instance.
* **Returns:** Nothing.
* **Error states:** Returns early without effect if `"activation"` animation is already playing.

### `SetProductOrchestrina(inst, product)`
* **Description:** Sets `product_orchestrina`, normalizes `"archive_resonator"` to `"archive_resonator_item"`, and updates visual builds and minimap icons.
* **Parameters:**  
  `inst` — The dispenser entity instance.  
  `product` (string) — Product name to set.
* **Returns:** Nothing.

### `OnActivate(inst, doer)`
* **Description:** Handles activation of the *dispenser* (`archive_lockbox_dispencer`). Checks power status via `archivemanager`, and if powered, plays activation animation, spawns SFX, and schedules lockbox ejection. If unpowered, deactivates and notifies the user.
* **Parameters:**  
  `inst` — The dispenser entity instance.  
  `doer` (entity) — The entity triggering activation (e.g., player).
* **Returns:** Nothing.
* **Error states:** If `archivemanager` exists and `GetPowerSetting()` is `false`, activation is blocked and `"ANNOUNCE_ARCHIVE_NO_POWER"` is spoken.

### `getstatus(inst)`
* **Description:** Returns `"POWEROFF"` status for inspection when the dispenser is unpowered (via `archivemanager:GetPowerSetting()`). Otherwise returns `nil`.
* **Parameters:** `inst` — The dispenser entity instance.
* **Returns:** `"POWEROFF"` or `nil`.

## Events & listeners
- **Listens to:**  
  `"onteach"` — Triggers `OnTeach` to begin knowledge dispensing.  
  `"animover"` — For lockbox: removes itself after `"activation"` finishes. For dispenser: controls idle/taunt/update animation logic and dispatches lockbox ejection after `"use_post"`.

- **Pushes:** `"animover"` — Used internally for animation state transitions (e.g., post-activation cleanup).