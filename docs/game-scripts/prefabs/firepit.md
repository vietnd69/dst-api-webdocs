---
id: firepit
title: Firepit
description: A structure that provides a controllable fire source for cooking, heating, and light, fueled by consumable items and supporting charcoal production.
tags: [crafting, cooking, fire, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 181091f9
system_scope: world
---

# Firepit

> Based on game build **714004** | Last updated: 2026-03-05

## Overview
The `firepit` prefab represents a placed structure that functions as a central fire-based cooking and heating device. It uses the `fueled`, `burnable`, `workable`, `cooker`, and `hauntable` components to manage fuel consumption, fire state, hammering response, cooking behavior, and hauntable mechanics. It supports charcoal production when fully fueled and integrates with DST’s quagmire game mode via custom networked overrides and physics.

## Usage example
```lua
local firepit = SpawnPrefab("firepit")
firepit.Transform:SetPosition(x, y, z)
firepit.components.fueled:DoDelta(TUNING.FIREPIT_FUEL_START) -- initialize fuel
firepit.components.fueled.accepting = true
firepit.components.burnable:Ignite() -- ignite the fire
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `workable`, `cooker`, `hauntable`, `inspectable`, `lootdropper`, `storytellingprop`, `rainimmunity`  
**Tags:** `campfire`, `structure`, `wildfireprotected`, `cooker`, `storytellingprop` (quagmire: `installations`, `quagmire_stewer`, `quagmire_cookwaretrader`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `queued_charcoal` | boolean | `false` | Internal flag indicating whether charcoal should be dropped upon fuel depletion (only when fuel reaches max section). |
| `disable_charcoal` | boolean | `false` (quagmire mode sets to `true`) | Prevents charcoal production when set. |
| `curradius` | number | `0.6` (quagmire) or `nil` | Physics obstacle radius override used only in quagmire game mode. |

## Main functions
### `restart_firepit(inst)`
*   **Description:** Utility function to reset the firepit’s fuel state without affecting charcoal queue status or animation frames; used during reskin operations.
*   **Parameters:** `inst` (Entity) — the firepit instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onextinguish` — triggers fuel reset (`InitializeFuelLevel(0)`) when fire is extinguished.  
  - `onbuilt` — plays build animation and sound.  
  - `prefaboverridedirty` (quagmire) — updates prefab name and network widget setup.  
  - `radiusdirty` (quagmire) — updates physics obstacle radius.
- **Pushes:**  
  - None directly; relies on component-emitted events via `inst:PushEvent(...)` calls.