---
id: ash
title: Ash
description: A throwable consumable item that briefly appears on the ground before disappearing, can be used as bait or burnt food, and haunts players upon interaction.
tags: [inventory, bait, haunt, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7c7b76e5
system_scope: inventory
---

# Ash

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`ash` is a lightweight, stackable item prefab representing leftover burnt remains (e.g., from cooking or fire damage). It appears on the ground and automatically begins disappearing after a short delay. It can be used as bait for moles, eaten for modest nutritional value (as burnt food), traded, or interacted with as a hauntable object (haunting the player who interacts with it). Its behavior is coordinated through multiple components including `disappears`, `edible`, `hauntable`, `bait`, and `named`.

## Usage example
```lua
-- Spawn an ash item at position (x, y, z)
local ash = SpawnPrefab("ash")
ash.Transform:SetPosition(x, y, z)

-- Customize stack size (note: named state is reset for stacks > 1)
ash.components.stackable:SetSize(5)

-- Manually trigger hauntable behavior (e.g., via player interaction)
ash.components.hauntable:TriggerHaunt(someplayer)
```

## Dependencies & tags
**Components used:** `disappears`, `stackable`, `inspectable`, `inventoryitem`, `named`, `bait`, `edible`, `tradable`, `hauntable`, `snowmandecor`  
**Tags added:** `molebait`, `ashes`  
**Tags removed (in master simulation only):** `_named` (temporary optimization tag)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` (via `disappears`) | string | `"disappear"` | Animation played when disappearing. |
| `sound` (via `disappears`) | string | `"dontstarve/common/dust_blowaway"` | Sound played during disappearance. |
| `maxsize` (via `stackable`) | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `foodtype` (via `edible`) | FOODTYPE enum | `FOODTYPE.BURNT` | Food classification, affects spoilage and effects. |
| `healthvalue` (via `edible`) | number | `20` | Health restored on consumption. |
| `hungervalue` (via `edible`) | number | `20` | Hunger restored on consumption. |
| `nameformat` (via `named`) | string | `STRINGS.NAMES.ASH_REMAINS` | Format string used for naming (typically a lookup key). |
| `cooldown_on_successful_haunt` (via `hauntable`) | boolean | `false` | Whether haunter goes on cooldown after successful haunt. |
| `usefx` (via `hauntable`) | boolean | `false` | Whether to show visual effects on haunt. |
| `hauntvalue` (via `hauntable`) | number | `TUNING.HAUNT_TINY` | Base haunt value (determines haunt difficulty). |

## Main functions
### `GetStatus(inst)`
* **Description:** Returns a localization key string if the ash has a custom name (i.e., `inst.components.named.name` is non-nil), otherwise `nil`. Used by the `inspectable` component to display special status text.
* **Parameters:** `inst` (Entity) — the ash entity instance.
* **Returns:** `string?` — localization key (e.g., `"REMAINS_MOLE"`), or `nil`.
* **Error states:** Uses `string.gsub` safely; no known failure modes.

### `OnPickup(inst)`
* **Description:** Cancels the scheduled disappearance of the ash when it is picked up by a player.
* **Parameters:** `inst` (Entity) — the ash entity instance.
* **Returns:** Nothing.

### `OnStackSizeChange(inst, data)`
* **Description:** Resets any custom name when the stack size increases above 1 (since names only apply to single items).
* **Parameters:**  
  - `inst` (Entity) — the ash entity instance.  
  - `data` (table) — event data, expected to contain `data.stacksize` (number).  
* **Returns:** Nothing.

### `OnDropped(inst)`
* **Description:** Initiates disappearance timer when the ash is dropped.
* **Parameters:** `inst` (Entity) — the ash entity instance.
* **Returns:** Nothing.

### `OnHaunt(inst)`
* **Description:** Handles haunt interaction: triggers immediate disappearance and signals successful haunt to the haunter.
* **Parameters:** `inst` (Entity) — the ash entity instance.
* **Returns:** `true` — indicates successful haunt (triggers haunter effects).
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `stacksizechange` — calls `OnStackSizeChange` to reset name when stack size exceeds 1.  
  - `ondropped` — calls `OnDropped` to start the disappearance timer.
- **Pushes:**  
  - None directly. Relies on `disappears` and `hauntable` to fire their own events (e.g., `animover` for removal, haunt completion events).