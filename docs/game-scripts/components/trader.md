---
id: trader
title: Trader
description: Manages trade logic and acceptance conditions for an entity acting as a merchant or trade partner.
tags: [inventory, trade, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fce9cd18
system_scope: entity
---

# Trader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Trader` component enables an entity to participate in trade interactions by defining conditions under which it will accept gifts from other entities. It validates physical eligibility (e.g., not dead, not sleeping), checks for visual preference (via custom test callbacks), and handles item transfer. It automatically manages the `trader` and `alltrader` tags on the entity based on its `enabled` and `acceptnontradable` properties.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("trader")
inst.components.trader:SetAcceptTest(function(trader, item, giver, count)
    return item:HasTag("coin")
end)
inst.components.trader:SetOnAccept(function(trader, giver, item, count)
    -- Handle successful trade logic
end)
```

## Dependencies & tags
**Components used:** `health`, `inventory`, `inventoryitem`, `itemmimic`, `playercontroller`, `sleeper`, `stackable`  
**Tags:** Adds `trader`, and conditionally adds `alltrader` when `acceptnontradable` is true and `enabled` is true.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the trader is active and able to accept items. |
| `deleteitemonaccept` | boolean | `true` | Whether the accepted item is destroyed (`true`) or moved into the trader’s inventory (`false`). |
| `acceptnontradable` | boolean | `false` | Whether the trader accepts items that lack the `tradable` tag (triggers `alltrader` tag if enabled). |
| `acceptstacks` | boolean or nil | `nil` | Whether the trader accepts partial stacks; when set, `stackable:Get(count)` is used instead of removing the whole stack. |
| `test` | function or nil | `nil` | Callback used in `WantsToAccept` to determine if the item is *wanted*. |
| `abletoaccepttest` | function or nil | `nil` | Callback used in `AbleToAccept` to override the default physical eligibility check. |
| `onaccept` | function or nil | `nil` | Callback invoked when a trade is successfully completed. |
| `onrefuse` | function or nil | `nil` | Callback invoked when a trade is refused (e.g., item unwanted). |

## Main functions
### `IsTryingToTradeWithMe(inst)`
*   **Description:** Determines whether the given entity `inst` is attempting to trade with this trader (via buffered action or remote interaction).  
*   **Parameters:** `inst` (Entity) - The candidate trading partner.  
*   **Returns:** `true` if `inst` has an active `GIVE`, `GIVEALLTOPLAYER`, or `GIVETOPLAYER` action targeting this trader; otherwise `false`.  

### `IsAcceptingStacks()`
*   **Description:** Reports whether partial-stack trades are accepted.  
*   **Parameters:** None.  
*   **Returns:** Value of `self.acceptstacks`; `nil` if unset.  

### `Enable()`
*   **Description:** Enables the trader and ensures the `trader` tag is present.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `Disable()`
*   **Description:** Disables the trader and removes the `trader` tag.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `SetAcceptTest(fn)`
*   **Description:** Sets a callback function used to decide whether the trader *wants* the item (i.e., is not disgusted by it). This is checked *after* `AbleToAccept`.  
*   **Parameters:** `fn` (function) - Signature: `function(trader, item, giver, count) return should_accept end`.  
*   **Returns:** Nothing.  
*   **Error states:** Does *not* trigger action failure or reasons; use `SetAbleToAcceptTest` for such behavior.  

### `SetAbleToAcceptTest(fn)`
*   **Description:** Sets a callback to override the default *physical eligibility* check in `AbleToAccept`. Useful for custom failure reasons.  
*   **Parameters:** `fn` (function) - Signature: `function(trader, item, giver, count) return boolean, reason end`.  
*   **Returns:** Nothing.  

### `SetOnAccept(fn)`
*   **Description:** Registers a callback invoked when an item is successfully accepted.  
*   **Parameters:** `fn` (function) - Signature: `function(trader, giver, item, count)`.  
*   **Returns:** Nothing.  

### `SetOnRefuse(fn)`
*   **Description:** Registers a callback invoked when an item is refused (e.g., not wanted).  
*   **Parameters:** `fn` (function) - Signature: `function(trader, giver, item)`.  
*   **Returns:** Nothing.  

### `SetAcceptStacks()`
*   **Description:** Enables partial-stack trades (sets `acceptstacks` to `true`).  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `AbleToAccept(item, giver, count)`
*   **Description:** Checks whether the trader is *physically capable* of accepting the item.  
*   **Parameters:**  
  - `item` (Entity or nil) - The item being traded.  
  - `giver` (Entity or nil) - The entity giving the item.  
  - `count` (number or nil) - Number of items in the stack intended for trade.  
*   **Returns:** `true` if the trader can accept; otherwise `false, "REASON"` (e.g., `"DEAD"`, `"SLEEPING"`, `"BUSY"`, `"ITEMMIMIC"`).  
*   **Error states:** Returns `false` if `enabled` is false, `item` is `nil`, or `abletoaccepttest` returns `false`. Mimic items are rejected unless `acceptsmimics` is true (currently commented out).  

### `WantsToAccept(item, giver, count)`
*   **Description:** Checks whether the trader *wants* the item (subjective preference). Called after `AbleToAccept`.  
*   **Parameters:** Same as `AbleToAccept`.  
*   **Returns:** `true` if `enabled` and (no `test` function or `test()` returns `true`); otherwise `false`.  
*   **Error states:** Never returns a reason string—this is handled separately by `onrefuse`.  

### `AcceptGift(giver, item, count)`
*   **Description:** Attempts to accept the gift, performing all checks, item transfer, and side effects.  
*   **Parameters:**  
  - `giver` (Entity or nil) - The entity giving the item.  
  - `item` (Entity) - The item being given.  
  - `count` (number or nil) - Number of items to accept. Defaults to `1`.  
*   **Returns:** `true` if accepted; `false` if refused or ineligible.  
*   **Error states:** Returns `false` immediately if `AbleToAccept` fails; if `WantsToAccept` fails, triggers `onrefuse` and returns `false`. If accepted and `deleteitemonaccept` is `true`, the item is removed; otherwise it is added to the trader’s inventory. The `trade` event is pushed after processing.  

### `GetDebugString()`
*   **Description:** Returns a debug-friendly string representation of the `enabled` state.  
*   **Parameters:** None.  
*   **Returns:** `"true"` if `enabled`; otherwise `"false"`.  

## Events & listeners
- **Listens to:** `enabled` and `acceptnontradable` property changes (via `Class` property hooks `onenabled` and `onacceptnontradable`) to update `trader`/`alltrader` tags.
- **Pushes:** `trade` - fired after a successful trade with payload `{ giver = giver, item = item }`.
