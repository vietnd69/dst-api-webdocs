---
id: townportaltalisman
title: Townportaltalisman
description: Manages the behavior and animation of the Town Portal Talisman item, which links two portals for teleportation and updates state based on inventory and connection status.
tags: [teleport, inventory, animation, sound]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0419a185
system_scope: inventory
---

# Townportaltalisman

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`townportaltalisman` is a prefab that implements the Town Portal Talisman, an item used to link two Town Portals for fast travel. The component manages animation states, sound loops, sanity effects during teleport, and inventory interactions (e.g., auto-pickup exclusion, image changes). It integrates with `teleporter`, `inventoryitem`, `inspectable`, `stackable`, and `talker` components.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()
MakeInventoryPhysics(inst)

inst:AddTag("townportaltalisman")
inst:AddTag("townportal")

inst:AddComponent("inventoryitem")
inst:AddComponent("teleporter")
inst:AddComponent("inspectable")
inst:AddComponent("stackable")

inst:ListenForEvent("linktownportals", function(inst, other) ... end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `teleporter`, `inspectable`, `stackable`, `talker`, `sanity`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags:** Adds `townportaltalisman`, `townportal`, `donotautopick` (conditionally); removes `donotautopick` when unlinked.

## Properties
No public properties are initialized directly on the component itself. Component properties are configured via `inst.components.X` assignments in the constructor.

## Main functions
### `OnLinkTownPortals(inst, other)`
*   **Description:** Links the talisman to another portal (`other`). Updates inventory image, animation, and sound state based on whether `other` is `nil`. Adds or removes the `donotautopick` tag accordingly.
*   **Parameters:**  
    `inst` (Entity) — The talisman entity.  
    `other` (Entity or `nil`) — The target portal to link to. If `nil`, the talisman is unlinked.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes valid `inst` and optional `other`.

### `OnStartTeleporting(inst, doer)`
*   **Description:** Triggered when a player uses the talisman to teleport. Silences the player's speech and reduces their sanity; then destroys the talisman stack.
*   **Parameters:**  
    `inst` (Entity) — The talisman entity.  
    `doer` (Entity) — The entity performing the teleport (typically a player).
*   **Returns:** Nothing.
*   **Error states:** Silencing and sanity effects only apply if `doer` is a player and has the corresponding components.

### `topocket(inst)`
*   **Description:** Resets animation tasks and updates animation upon placing the talisman in inventory (e.g., after linking or unlinking). Restores active or inactive loop based on `teleporter` status.
*   **Parameters:**  
    `inst` (Entity) — The talisman entity.
*   **Returns:** Nothing.
*   **Error states:** Returns early if no animation tasks are pending (`animtask` and `onanimqueueover` are both `nil`).

### `GetStatus(inst)`
*   **Description:** Returns `"ACTIVE"` if the talisman is linked to a portal, otherwise `nil`. Used for the `inspectable` component.
*   **Parameters:**  
    `inst` (Entity) — The talisman entity.
*   **Returns:** `"ACTIVE"` (string) or `nil`.

## Events & listeners
- **Listens to:**  
  `linktownportals` — Triggers `OnLinkTownPortals`.  
  `onputininventory` — Triggers `topocket`.  
  `exitlimbo` — Triggers `OnEntityWake`.  
  `enterlimbo` — Triggers `OnEntitySleep`.  
  `animqueueover` — Used internally to chain animations (e.g., active_fall → inactive).
- **Pushes:** None directly. Delegates events via `inst:PushEvent(...)` in attached components (e.g., `imagechange`, `sanitydelta`).