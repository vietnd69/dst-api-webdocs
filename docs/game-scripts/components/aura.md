---
id: aura
title: Aura
description: Applies periodic area-of-effect damage or effects to nearby entities within a defined radius.
tags: [combat, area-damage, buff]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b5611d97
system_scope: combat
---

# Aura

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Aura` component enables an entity to periodically deal area-of-effect damage or trigger aura-specific logic on nearby valid targets within a configurable radius. It is typically used for passive damage zones (e.g., fire, poison clouds) or beneficial AOE effects on allies. The component relies on the `combat` component to perform area attacks and respects filtering via a customizable `auratestfn` and a default list of exclusion tags.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aura")
inst.components.aura.radius = 4
inst.components.aura.tickperiod = 0.5
inst.components.aura.auratestfn = function(inst, target)
    return target:HasTag("monster") and not target:HasTag("player")
end
inst.components.aura:Enable(true)
```

## Dependencies & tags
**Components used:** `combat` (used via `inst.components.combat:DoAreaAttack`)
**Tags:** Checks exclusion tags `noauradamage`, `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost` during area scanning.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number | `3` | Radius (in world units) around the entity where aura affects targets. |
| `tickperiod` | number | `1` | Interval in seconds between aura ticks. |
| `active` | boolean | `false` | Whether the aura is currently active (running periodic task). |
| `applying` | boolean | `false` | Whether the aura successfully applied effects during the last tick. |
| `pretickfn` | function or `nil` | `nil` | Optional callback called before each aura tick. Signature: `fn(inst)` |
| `auratestfn` | function or `nil` | `nil` | Custom predicate function to determine if a target is affected. Signature: `fn(inst, target) -> boolean` |
| `auraexcludetags` | table of strings | `{ "noauradamage", "INLIMBO", "notarget", "noattack", "flight", "invisible", "playerghost" }` | List of tags that exclude an entity from being affected by the aura. |

## Main functions
### `Enable(val)`
* **Description:** Activates or deactivates the aura. When enabled, starts a periodic task; when disabled, cancels the task and fires `stopaura` if `applying` is true.
* **Parameters:** `val` (boolean or `nil`) – if truthy, enables aura; otherwise disables it. Defaults to `true`.
* **Returns:** Nothing.
* **Error states:** No-op if `active` state does not change (i.e., enabling when already enabled, or vice versa).

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the current aura state.
* **Parameters:** None.
* **Returns:** `string` – formatted as `"radius:X.XX, enabled:true/false [Y.YYs applying:true/false]"`.
* **Error states:** None.

### `OnTick()`
* **Description:** Core tick logic that runs periodically while the aura is active. Calls `pretickfn` (if set), then performs `DoAreaAttack` using the `combat` component. Fires `startaura` or `stopaura` events based on whether any targets were hit.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `combat` component is missing, no area attack occurs and `applying` remains unchanged.

## Events & listeners
- **Pushes:** `startaura` – fired when `OnTick` successfully affects at least one target *and* `applying` was previously `false`.
- **Pushes:** `stopaura` – fired when no targets are affected *or* aura is manually disabled while `applying` is `true`.
