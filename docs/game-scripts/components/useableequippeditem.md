---
id: useableequippeditem
title: UseableEquippedItem
description: Manages the in-use state of equipped items with callback hooks for start and stop events.
tags: [inventory, equipment, item]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 3533daa9
system_scope: inventory
---

# UseableEquippedItem

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`UseableEquippedItem` tracks whether an equipped item is currently being actively used by a player. It manages the `equipped_and_inuse` tag and provides callback hooks for custom logic when use starts or stops. This component is typically added to wearable or handheld items that have sustained use actions, such as tools or instruments.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("useableequippeditem")

-- Set callbacks for use events
inst.components.useableequippeditem:SetOnUseFn(function(item, doer)
    -- Start playing sound, drain durability, etc.
    return true
end)

inst.components.useableequippeditem:SetOnStopUseFn(function(item, doer)
    -- Stop sound, cleanup effects, etc.
end)

-- Control use state
inst.components.useableequippeditem:StartUsingItem(player)
print(inst.components.useableequippeditem:IsInUse())  -- true
inst.components.useableequippeditem:StopUsingItem(player)
```

## Dependencies & tags
**External dependencies:**
- `Class` -- DST class system for component construction

**Components used:**
- None identified

**Tags:**
- `equipped_and_inuse` -- added when `inuse` is true, removed when false or on component removal

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `inuse` | boolean | `false` | Whether the item is currently being used. Assignment triggers `oninuse` watcher to sync tag. |
| `onusefn` | function | `nil` | Callback fired when `StartUsingItem` succeeds. Signature: `fn(inst, doer) → success, reason`. Set by owning prefab. |
| `onstopusefn` | function | `nil` | Callback fired when `StopUsingItem` is called. Signature: `fn(inst, doer)`. Set by owning prefab. |

## Main functions
### `SetOnUseFn(fn)`
* **Description:** Sets the callback function to execute when the item starts being used. The callback can return `false, reason` to abort the use action.
* **Parameters:** `fn` -- function with signature `(inst, doer) → success, reason`. Return `false` to fail the use attempt.
* **Returns:** nil
* **Error states:** None

### `SetOnStopUseFn(fn)`
* **Description:** Sets the callback function to execute when the item stops being used.
* **Parameters:** `fn` -- function with signature `(inst, doer)`. Called after `inuse` is set to false.
* **Returns:** nil
* **Error states:** None

### `IsInUse()`
* **Description:** Returns the current in-use state of the item.
* **Parameters:** None
* **Returns:** boolean -- `true` if item is currently in use, `false` otherwise.
* **Error states:** None

### `StartUsingItem(doer)`
* **Description:** Attempts to start using the item. Sets `inuse` to true, adds the `equipped_and_inuse` tag, and calls `onusefn` if set. If the callback returns `false`, the use is aborted and `inuse` is reset.
* **Parameters:** `doer` -- entity attempting to use the item (typically a player).
* **Returns:** `true` on success, `false, reason` on failure (either already in use or callback rejected).
* **Error states:** None -- handles all failure cases gracefully with return values.

### `StopUsingItem(doer)`
* **Description:** Stops using the item. Sets `inuse` to false, removes the `equipped_and_inuse` tag, and calls `onstopusefn` if set. No-op if already not in use.
* **Parameters:** `doer` -- entity that was using the item.
* **Returns:** nil
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when the component is removed from its entity. Ensures the `equipped_and_inuse` tag is removed even if `inuse` was true.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `oninuse(self, inuse)` (local)
* **Description:** Property watcher callback triggered whenever `self.inuse` is assigned. Adds or removes the `equipped_and_inuse` tag based on the new value.
* **Parameters:** 
  - `self` -- component instance
  - `inuse` -- boolean -- the new value being assigned
* **Returns:** nil
* **Error states:** None

## Events & listeners
**Listens to:**
- None identified

**Pushes:**
- None identified

**World state watchers:**
- None identified