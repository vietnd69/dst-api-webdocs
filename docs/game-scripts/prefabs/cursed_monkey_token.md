---
id: cursed_monkey_token
title: Cursed Monkey Token
description: A cursed trinket that attaches to players, slowly erodes over time unless picked up, and changes appearance based on stack size.
tags: [cursed, inventory, stackable,fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 44680644
system_scope: inventory
---

# Cursed Monkey Token

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `cursed_monkey_token` prefab represents a wearable cursed item that players can carry in their pocket. It manifests in two forms: the active token carried by players (with erosion timer and interaction hooks), and a detached visual prop (used when the item is channeling from a distance). It uses the `curseditem`, `inventoryitem`, `stackable`, and `timer` components to manage its behavior, and supports dynamic visual updates based on stack size and state.

## Usage example
```lua
-- Spawn a cursed monkey token in the world
local token = SpawnPrefab("cursed_monkey_token")

-- Set its stack size (triggers visual change)
if token.components.stackable then
    token.components.stackable.stacksize = 3
end

-- Listen for its events
token:ListenForEvent("imagechange", function(inst)
    print("Token image changed to:", inst.image_num)
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`, `curseditem`, `timer`, `updatelooper`  
**Tags added:** `cattoy`, `monkey_token`, `nosteal`, `cursed`, `fx` (for prop)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `image_num` | number | `1` | Determines which variant texture/animation is used (`1`–`4`). Updated when `stacksize` changes. |
| `seticons` | function | `seticons` (local) | Function to update image name and animation. |
| `scrapbook_tex` | string | `"cursed_beads4"` | Texture shown in the scrapbook for this item. |
| `scrapbook_specialinfo` | string | `"CURSEDMONKEYTOKEN"` | Localization key used for scrapbook description. |

## Main functions
### `OnStackSizeChange(inst)`
*   **Description:** Adjusts `image_num` based on stack size. If stack size is > 1, sets `image_num` to `4`; otherwise picks a random value `1–3`. Then calls `seticons`.
*   **Parameters:** `inst` (Entity) — the item instance.
*   **Returns:** Nothing.

### `seticons(inst)`
*   **Description:** Updates the item's inventory image and animation to match `inst.image_num`.
*   **Parameters:** `inst` (Entity) — the item instance.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Handler for the `"errode"` timer finishing. Calls `ErodeAway(inst)` to remove the token.
*   **Parameters:**  
  - `inst` (Entity) — the item instance.  
  - `data` (table) — timer data; checks `data.name == "errode"`.
*   **Returns:** Nothing.

### `OnUpdateProp(inst, dt)`
*   **Description:** Animates the prop toward its `target` (player). If close enough, stops channeling and destroys itself; otherwise, moves toward the target.
*   **Parameters:**  
  - `inst` (Entity) — the prop instance.  
  - `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"timerdone"` — handled by `OnTimerDone` to trigger erosion.
  - `"onpickup"` — stops the `"errode"` timer when the item is picked up.
  - `"stacksizechange"` — triggers visual update via `OnStackSizeChange`.
  - `"onremove"` (prop only) — notifies the channeling target that channeling failed via `"stopcursechanneling"`.
- **Pushes:**
  - `"stopcursechanneling"` (prop only) — fires with `{success=true}` when attached successfully or `{success=false}` on removal.
  - `"imagechange"` (via `inventoryitem:ChangeImageName`) — fires when the inventory image updates.
  - `"timerdone"` (via `timer` component) — fires when the `"errode"` timer completes.