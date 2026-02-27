---
id: trader
title: Trader
description: Enables an entity to receive and process item gifts from players, with configurable acceptance logic and custom callbacks for trade events.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: fce9cd18
---

# Trader

## Overview
The `Trader` component allows an entity (typically a NPC) to accept items from players via the `GIVE`, `GIVETOPLAYER`, and `GIVEALLTOPLAYER` actions. It provides fine-grained control over when and what items may be accepted, including physical restrictions (e.g., dead, busy, sleeping), internal desire logic (e.g., item preferences), and custom behavior hooks such as callbacks and tests. It also manages entity tags (`trader`, `alltrader`) based on its enabled state and acceptance configuration.

## Dependencies & Tags
- **Component Tags Added/Removed:**  
  - `"trader"` — added when `enabled = true`, removed otherwise.  
  - `"alltrader"` — added when `acceptnontradable = true` and `enabled = true`, otherwise removed.
- **Dependencies (components used by logic):**  
  - `inventoryitem` (checked for ownership)  
  - `health` (checks `IsDead()`)  
  - `sleeper` (checks `IsAsleep()`)  
  - `inventory` (used when not deleting items)  
- **Note:** Component does *not* auto-add itself to the entity; must be added explicitly via `inst:AddComponent("trader")`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `true` | Controls whether the trader is currently active and accepting items. Affects tag `"trader"`. |
| `acceptnontradable` | `boolean` | `false` | If true, adds tag `"alltrader"`, enabling acceptance of non-tradeable items. |
| `deleteitemonaccept` | `boolean` | `true` | If true, accepted items are removed instead of added to the trader's inventory. |
| `acceptstacks` | `boolean` | `nil` | If non-`nil` (set via `SetAcceptStacks()`), allows accepting partial stacks; otherwise may restrict or deny. |
| `test` | `function` | `nil` | Custom callback (`fn(inst, item, giver, count) -> boolean`) used in `WantsToAccept()` to determine *desire*. |
| `abletoaccepttest` | `function` | `nil` | Custom override for `AbleToAccept()` (e.g., for custom failure reasons). |
| `onaccept` | `function` | `nil` | Callback (`fn(inst, giver, item, count)`) invoked on successful acceptance. |
| `onrefuse` | `function` | `nil` | Callback (`fn(inst, giver, item)`) invoked when the trader *desires not* to accept. |
| `acceptsmimics` | `boolean` | `nil` (implicit `false`) | If `nil` (default), mimics (`item.components.itemmimic`) are rejected. Not exposed via setter — likely unused or reserved. |

## Main Functions

### `IsTryingToTradeWithMe(inst)`
* **Description:** Determines whether the given entity (`inst`) is attempting to trade *with* this trader (i.e., performing a `GIVE`/`GIVETOPLAYER` action directed at this trader).  
* **Parameters:**  
  - `inst`: The potential giver (usually a `player`).

### `IsAcceptingStacks()`
* **Description:** Returns the current state of the `acceptstacks` flag.  
* **Parameters:** None.  
* **Returns:** `boolean?` — `nil` if unset, or the boolean value set by `SetAcceptStacks()`.

### `Enable()`
* **Description:** Enables the trader (sets `enabled = true`) and adds the `"trader"` tag.  
* **Parameters:** None.

### `Disable()`
* **Description:** Disables the trader (sets `enabled = false`) and removes the `"trader"` tag.  
* **Parameters:** None.

### `SetAcceptTest(fn)`
* **Description:** Sets the `test` function used to determine *desire* (i.e., whether the trader wants the item). Invoked in `WantsToAccept()`.  
* **Parameters:**  
  - `fn`: A function with signature `(inst, item, giver, count) -> boolean`.

### `SetAbleToAcceptTest(fn)`
* **Description:** Overrides the `AbleToAccept()` logic entirely; used to trigger custom failure reasons via `action.fail`.  
* **Parameters:**  
  - `fn`: A function with signature `(inst, item, giver, count) -> boolean, string?`.

### `SetOnAccept(fn)`
* **Description:** Sets the callback invoked after a successful gift acceptance.  
* **Parameters:**  
  - `fn`: A function with signature `(inst, giver, item, count)`.

### `SetOnRefuse(fn)`
* **Description:** Sets the callback invoked when the trader refuses the gift (e.g., due to `test` returning `false`).  
* **Parameters:**  
  - `fn`: A function with signature `(inst, giver, item)`.

### `SetAcceptStacks()`
* **Description:** Enables stack-acceptance mode by setting `acceptstacks = true`.  
* **Parameters:** None.

### `AbleToAccept(item, giver, count)`
* **Description:** Checks whether the trader is *physically able* to accept an item (ignores preference). Returns `false` and a reason string for failure (e.g., `"DEAD"`, `"SLEEPING"`).  
* **Parameters:**  
  - `item`: The item being offered.  
  - `giver`: The entity giving the item (optional).  
  - `count`: Number of items being offered (optional).  
* **Returns:** `boolean, string?` — First value indicates ability; second is failure reason if applicable.

### `WantsToAccept(item, giver, count)`
* **Description:** Checks whether the trader *wants* to accept the item (preference/logic). May invoke custom `test` function. Does not trigger failure actions.  
* **Parameters:** Same as `AbleToAccept`.  
* **Returns:** `boolean`.

### `AcceptGift(giver, item, count)`
* **Description:** Processes a gift offer. Validates via `AbleToAccept()` and `WantsToAccept()`, then executes item transfer, optional removal, inventory addition, and callbacks. Emits `"trade"` event on success.  
* **Parameters:**  
  - `giver`: The entity giving the item.  
  - `item`: The item instance.  
  - `count`: Number of items to accept. Defaults to `1`.  
* **Returns:** `boolean` — `true` if accepted, `false` otherwise.

### `GetDebugString()`
* **Description:** Returns `"true"` if enabled, `"false"` otherwise — useful for debugging.  
* **Parameters:** None.  
* **Returns:** `string`.

## Events & Listeners
- **Events emitted by component:**  
  - `"trade"` — triggered in `AcceptGift()` after successful item transfer.  
    - Payload: `{ giver = giver, item = item }`
- **Listeners:**  
  - None — the component does *not* register listeners for external events via `inst:ListenForEvent`.  
- **Tag updates:**  
  - `"trader"` and `"alltrader"` tags are added/removed in `onenabled()` and `onacceptnontradable()` callbacks, triggered by property changes.