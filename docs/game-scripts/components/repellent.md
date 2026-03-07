---
id: repellent
title: Repellent
description: Causes nearby entities with specified repel tags to stop following their leader or drop combat targets when activated.
tags: [combat, ai, follower, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0cd23b65
system_scope: entity
---

# Repellent

> Based on game build **714140** | Last updated: 2026-03-03

## Overview
The `repellent` component implements a reactive effect that clears follower loyalty and/or combat targets within a radius when activated (e.g., when used from an item). It primarily interacts with the `leader`, `follower`, and `combat` components to clear affiliations and combat engagements. It supports configurable tag-based targeting, radius, usage consumption (via `finiteuses`), and optional per-follower callbacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("repellent")
inst:AddTag("repellentitem")
inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMax(10)
inst.components.finiteuses:SetUses(10)

inst.components.repellent:AddRepelTag("combat")
inst.components.repellent:SetRadius(5)
inst.components.repellent:SetOnlyRepelsFollowers(true)

-- Trigger repel effect
inst.components.repellent:Repel(inst)
```

## Dependencies & tags
**Components used:** `combat`, `finiteuses`, `follower`, `leader`  
**Tags added by default to ignore list:** `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`  
**Tags added by user via API:** `repel_tags` (custom per instance)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | — | Reference to the owning entity instance. |
| `onlyfollowers` | boolean | `false` | If true, only repels followers; otherwise also repels entities with active combat targets. |
| `repel_tags` | table of strings | `{}` | Tags an entity must *have* to be affected (AND logic across all tags). |
| `ignore_tags` | table of strings | `{"FX", "NOCLICK", "DECOR", "INLIMBO"}` | Tags that prevent an entity from being affected (OR logic across tags). |
| `radius` | number | `nil` | Radius around the owner to scan for affected entities. |
| `use_amount` | number | `1` | Number of uses to consume when `Repel` is called. |
| `onrepelfollowerfn` | function or `nil` | `nil` | Optional callback called for each follower that stops following. |

## Main functions
### `ValidateTargetTags(target)`
* **Description:** Checks whether `target` matches the `repel_tags` and does *not* match any `ignore_tags`.  
* **Parameters:** `target` (Entity) — the entity to validate.
* **Returns:** `boolean` — `true` if all `repel_tags` are present and none of the `ignore_tags` are present; otherwise `false`.
* **Error states:** Only evaluates tags; no explicit failure paths beyond `false` return.

### `AddRepelTag(tag)`
* **Description:** Adds a required tag to the `repel_tags` list. An entity must have *all* repel tags to be affected.  
* **Parameters:** `tag` (string) — the tag to add. Duplicate additions are ignored.  
* **Returns:** Nothing.

### `RemoveRepelTag(tag)`
* **Description:** Removes a tag from the `repel_tags` list.  
* **Parameters:** `tag` (string) — the tag to remove. No-op if absent.  
* **Returns:** Nothing.

### `AddIgnoreTag(tag)`
* **Description:** Adds a tag to the `ignore_tags` list. Any entity possessing *any* ignore tag is excluded.  
* **Parameters:** `tag` (string) — the tag to add. Duplicate additions are ignored.  
* **Returns:** Nothing.

### `RemoveIgnoreTag(tag)`
* **Description:** Removes a tag from the `ignore_tags` list.  
* **Parameters:** `tag` (string) — the tag to remove. No-op if absent.  
* **Returns:** Nothing.

### `SetRadius(radius)`
* **Description:** Sets the radius around the owner within which affected entities are scanned.  
* **Parameters:** `radius` (number) — the search radius in world units.  
* **Returns:** Nothing.

### `SetUseAmount(amount)`
* **Description:** Sets how many uses are consumed when `Repel` is called (if `finiteuses` is present).  
* **Parameters:** `amount` (number) — number of uses to subtract. Defaults to `1` in `Repel` if not set.  
* **Returns:** Nothing.

### `SetOnRepelFollowerFn(fn)`
* **Description:** Sets a callback invoked for each follower that stops following.  
* **Parameters:** `fn` (function) — signature: `fn(inst, follower)`, where `inst` is the repellent owner and `follower` is the affected entity.  
* **Returns:** Nothing.

### `SetOnlyRepelsFollowers(enabled)`
* **Description:** Controls whether repel behavior is limited to followers only (`true`) or includes combat target clearing (`false`).  
* **Parameters:** `enabled` (boolean) — `true` to restrict to followers only.  
* **Returns:** Nothing.

### `Repel(doer)`
* **Description:** Performs the repel effect: clears all followers matching `repel_tags`, optionally clears combat targets within radius, and consumes uses.  
* **Parameters:** `doer` (Entity) — the entity that triggered the repel (used to access `leader.followers`).  
* **Returns:** Nothing.  
* **Error states:**  
  - If `finiteuses` is absent, no uses are consumed.  
  - If `radius` is `nil`, `TheSim:FindEntities` defaults to a minimal radius (`1`) per engine behavior.  
  - Follower repel always occurs *before* combat target drop, regardless of `onlyfollowers`.  
  - The ignore-tag logic is commented out in source and not active.

## Events & listeners
- **Listens to:** None — this component does not register event listeners.
- **Pushes:** None — this component does not fire events (but relies on `follower:StopFollowing()` and `combat:DropTarget()` to fire their own internal events).
