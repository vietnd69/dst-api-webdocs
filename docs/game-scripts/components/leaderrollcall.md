---
id: leaderrollcall
title: Leaderrollcall
description: Manages periodic recruitment of followers for a leader entity, typically used by items like the One-Man Band.
tags: [follower, leadership, recruitment]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: b7850d0c
system_scope: entity
---

# Leaderrollcall

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`LeaderRollCall` periodically scans for valid follower entities within a radius and recruits them to a leader. It is commonly attached to items like the One-Man Band that grant temporary follower recruitment abilities. The component integrates with the `leader` and `follower` components to manage loyalty times and follower counts, and can optionally tend farm plants during recruitment scans.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("leaderrollcall")
inst.components.leaderrollcall:SetRadius(15)
inst.components.leaderrollcall:SetMaxFollowers(5)
inst.components.leaderrollcall:Enable(0)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- provides default `ONEMANBAND_RANGE` and `ONEMANBAND_MAXFOLLOWERS` values
- `MakeComponentAnInventoryItemSource` / `RemoveComponentInventoryItemSource` -- registers/unregisters inventory item source behavior

**Components used:**
- `leader` -- calls `SetIsRollCaller`, `GetNumFollowers`, `IsFollower`, `AddFollower`, accesses `followers` table
- `follower` -- calls `CanBeRollCalled`, `GetLeader`, `AddLoyaltyTime`
- `farmplanttendable` -- calls `TendTo` when crop tending is enabled
- `inventoryitem` -- checked for existence to enable inventory item source behavior

**Tags:**
- Checks for: `pig`, `merm`, `farm_plant` (valid recruitment targets)
- Excludes: `werepig`, `player` (cannot be recruited)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enable` | boolean | `false` | Whether the roll call system is currently active. |
| `radius` | number | `TUNING.ONEMANBAND_RANGE` | Search radius for finding potential followers. |
| `maxfollowers` | number | `TUNING.ONEMANBAND_MAXFOLLOWERS` | Maximum number of followers the leader can have. |
| `onrollcallfn` | function | `nil` | Callback fired after each roll call cycle. Signature: `fn(inst)`. Set by external code. |
| `update_time` | number | `1` | Interval in seconds between roll call updates. |
| `can_tend_crop` | boolean | `nil` | If `true`, also tends farm plants during roll call scans. |
| `update_accumulation` | number | `0` | Internal accumulator for update timing. Resets after each `DoRollCall`. |
| `hasitemsource` | boolean | `false` | Set to `true` if entity has `inventoryitem` component; gates inventory source registration. |
| `itemsource_owner` | entity | `nil` | Current owner of this item when used as an inventory item source. Set by inventory source system. |

## Main functions
### `Enable(inittime)`
* **Description:** Activates the roll call system and starts the update loop. If the item has an owner with a `leader` component, marks them as a roll caller.
* **Parameters:**
  - `inittime` -- number or nil. If provided, adjusts `update_accumulation` to `(update_time - inittime)` for delayed first tick.
* **Returns:** nil
* **Error states:** None

### `Disable()`
* **Description:** Deactivates the roll call system and stops the update loop. Removes roll caller status from the current leader if valid.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `IsEnabled()`
* **Description:** Returns whether the roll call system is currently active.
* **Parameters:** None
* **Returns:** boolean `true` if enabled, `false` otherwise.
* **Error states:** None

### `SetRadius(radius)`
* **Description:** Sets the search radius for finding potential followers.
* **Parameters:** `radius` -- number distance in world units.
* **Returns:** nil
* **Error states:** None

### `GetRadius()`
* **Description:** Returns the current search radius.
* **Parameters:** None
* **Returns:** number radius value.
* **Error states:** None

### `SetMaxFollowers(max)`
* **Description:** Sets the maximum number of followers the leader can recruit.
* **Parameters:** `max` -- number maximum follower count.
* **Returns:** nil
* **Error states:** None

### `GetMaxFollowers()`
* **Description:** Returns the current maximum follower limit.
* **Parameters:** None
* **Returns:** number max followers value.
* **Error states:** None

### `SetCanTendFarmPlant(boolval)`
* **Description:** Enables or disables farm plant tending during roll call scans.
* **Parameters:** `boolval` -- boolean or nil. `true` enables tending, `false` or `nil` disables.
* **Returns:** nil
* **Error states:** None

### `GetCanTendFarmPlant()`
* **Description:** Returns whether farm plant tending is enabled.
* **Parameters:** None
* **Returns:** boolean or `nil`.
* **Error states:** None

### `SetUpdateTime(time)`
* **Description:** Sets the interval between roll call update cycles.
* **Parameters:** `time` -- number interval in seconds.
* **Returns:** nil
* **Error states:** None

### `SetOnRollCallFn(fn)`
* **Description:** Sets a callback function to fire after each roll call cycle completes.
* **Parameters:** `fn` -- function or nil. Signature: `fn(inst)` where `inst` is the entity with this component.
* **Returns:** nil
* **Error states:** None

### `GetLeader()`
* **Description:** Returns the current leader entity. Checks item source owner first, then the component's owning entity.
* **Parameters:** None
* **Returns:** entity instance or `nil` if no valid leader found.
* **Error states:** None

### `IsValidLeader(leader)`
* **Description:** Validates that a leader entity exists and has a `leader` component.
* **Parameters:** `leader` -- entity instance or nil.
* **Returns:** boolean `true` if valid, `false` otherwise.
* **Error states:** None

### `DoRollCall()` (internal)
* **Description:** Performs one recruitment cycle. Scans for valid followers within radius, recruits them if under max limit, and adds loyalty time to existing followers. Also tends farm plants if enabled.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Update loop callback. Accumulates delta time and triggers `DoRollCall` when `update_accumulation` exceeds `update_time`.
* **Parameters:** `dt` -- number delta time in seconds.
* **Returns:** nil
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when component is removed from entity. Unregisters inventory item source if applicable.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnItemSourceRemoved(owner)`
* **Description:** Callback when this item is unequipped or removed from an owner. Removes roll caller status from the owner's leader component.
* **Parameters:** `owner` -- entity instance that owned this item.
* **Returns:** nil
* **Error states:** None

### `OnItemSourceNewOwner(owner)`
* **Description:** Callback when this item is equipped by a new owner. If roll call is enabled, sets the owner as a roll caller.
* **Parameters:** `owner` -- entity instance that now owns this item.
* **Returns:** nil
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a debug string showing current leader and update accumulation value.
* **Parameters:** None
* **Returns:** string debug information.
* **Error states:** None

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

**Update loop:**
- Uses `inst:StartUpdatingComponent(self)` / `inst:StopUpdatingComponent(self)` for periodic updates via `OnUpdate(dt)`.