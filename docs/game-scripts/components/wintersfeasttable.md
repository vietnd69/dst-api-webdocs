---
id: wintersfeasttable
title: Wintersfeasttable
description: Manages the state and consumption logic for the Winters Eve Feast Table, tracking which entities are feasting and handling food usage.
tags: [crafting, event, inventory, multiplayer]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e75d21c0
system_scope: crafting
---

# Wintersfeasttable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WintersFeasttable` handles the gameplay logic for the Winters Eve Feast Table, a special crafting station used during the Winters Eve event. It tracks which entities (feasters) are currently using the table, manages food item consumption via the `finiteuses` component, and notifies participants when feasting is interrupted or the food supply is depleted. It works in conjunction with the `shelf` and `inventory` components to access and consume the placed food item.

## Usage example
```lua
local inst = SpawnPrefab("wintersfeasttable")
inst:AddComponent("wintersfeasttable")
inst.components.wintersfeasttable.canfeast = true
inst.components.wintersfeasttable.onfinishfoodfn = function(table) print("No more food!") end
```

## Dependencies & tags
**Components used:** `finiteuses`, `inventory`, `shelf`
**Tags:** Adds `wintersfeasttable`; conditionally adds/removes `readyforfeast` based on `canfeast` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canfeast` | boolean | `false` | Controls whether the table is ready to receive feasters. Triggers `readyforfeast` tag when true. |
| `current_feasters` | table | `{}` | Dictionary mapping entity instances (feasters) currently using the table to `true`. |
| `ondepletefoodfn` | function or `nil` | `nil` | Optional callback fired when food uses decrease but the item is not yet exhausted. |
| `onfinishfoodfn` | function or `nil` | `nil` | Optional callback fired when food item runs out (uses reach zero). |

## Main functions
### `GetDebugString()`
* **Description:** Returns a formatted debug string including the current feaster (if any), the food item on the shelf, and remaining uses of that item.
* **Parameters:** None.
* **Returns:** `string` — Human-readable debug information (e.g., `"feaster: nil, item: winter_cookie, uses: 5.00"`).
* **Error states:** Returns `0` for uses if the item or `finiteuses` component is missing.

### `OnRemoveFromEntity()`
* **Description:** Cleans up state when the component is removed from its entity. Ensures the `wintersfeasttable` tag is removed and disables feasting.
* **Parameters:** None.
* **Returns:** Nothing.

### `CancelFeasting()`
* **Description:** Notifies all currently feasting entities that feasting has been interrupted by pushing the `"feastinterrupted"` event to each.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Skips invalid (dead/despawned) feasters.

### `DepleteFood(feasters)`
* **Description:** Consumes one use from the food item placed in inventory slot 1 (via `inventory` component), then fires the appropriate callback (`ondepletefoodfn` or `onfinishfoodfn`) depending on whether the item still has remaining uses.
* **Parameters:** `feasters` (table) — Reserved for future use; currently unused in implementation.
* **Returns:** Nothing.
* **Error states:** No effect if the item is missing, or if the item lacks a `finiteuses` component.

## Events & listeners
- **Listens to:** None explicitly — event handling is indirect (e.g., `oncanfeast` closure updates `readyforfeast` tag, `CancelFeasting` pushes `"feastinterrupted"`).
- **Pushes:** `"feastinterrupted"` — sent to each feaster when `CancelFeasting()` is invoked.
