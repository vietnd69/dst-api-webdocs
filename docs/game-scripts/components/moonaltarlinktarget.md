---
id: moonaltarlinktarget
title: Moonaltarlinktarget
description: Enables moon altars to detect and link with nearby altars of compatible types to form a valid triangle for cosmic events.
tags: [moon, environment, networking]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 69311638
system_scope: environment
---

# Moonaltarlinktarget

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonAltarLinkTarget` is a passive component attached to moon altar prefabs (e.g., `moon_altar`, `moon_altar_cosmic`, `moon_altar_astral`) that facilitates dynamic linking between altars. It periodically scans the world for other compatible altars within a configurable radius and attempts to form a valid triangular link. If three mutually reachable altars satisfy geometric and storm-related constraints, it spawns a `moon_altar_link` entity and notifies the `moonstormmanager` to validate the configuration. The component is primarily used in the Moon Altar event system to enable coordinated ritual mechanics.

## Usage example
```lua
-- Add the component to a moon altar entity (e.g., in its prefab definition)
inst:AddComponent("moonaltarlinktarget")

-- Optionally define custom linking rules or callbacks
inst.components.moonaltarlinktarget.canbelinkedfn = function(entity)
    return not entity:IsAsleep() and not entity:HasTag("playerready")
end

-- Manually trigger a link search (e.g., after altar state changes)
inst.components.moonaltarlinktarget:TryEstablishLink()
```

## Dependencies & tags
**Components used:**  
- `moonaltarlink` (via `inst.components.moonaltarlinktarget.link.components.moonaltarlink`)  
- `moonstormmanager` (via `TheWorld.components.moonstormmanager`)  
- `Transform` (via `inst.Transform:GetWorldPosition()`)  

**Tags:**  
- Adds `moonaltarlinktarget` automatically.  
- Removes `moonaltarlinktarget` when removed from an entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `link` | `Entity?` | `nil` | Reference to the `moon_altar_link` entity if currently linked; `nil` otherwise. |
| `link_radius` | number | `20` | Maximum distance (in units) to search for other altars. |
| `canbelinkedfn` | function? | `nil` | Optional predicate function that determines whether this altar may participate in a link. Receives `inst` as argument and returns `boolean`. |
| `onfoundotheraltarfn` | function? | `nil` | Optional callback invoked when another altar is found during link search. Receives `(this_altar, other_altar)` arguments. |
| `onlinkfn` | function? | `nil` | *Not initialized in constructor*, but used externally: invoked on this altar when linked. |
| `onlinkbrokenfn` | function? | `nil` | *Not initialized in constructor*, but used externally: invoked on this altar when link is broken. |

## Main functions
### `TryEstablishLink()`
* **Description:** Scans the world for up to two additional compatible moon altars within `link_radius`, forms a triangle if valid, and initiates a link via `moon_altar_link:EstablishLink`. Calls `moonstormmanager:TestAltarTriangleValid` to ensure the triangle passes storm-related checks. Stops after finding two valid altars (total of three including itself).
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:**  
  - If fewer than two compatible altars are found or eligible (including radius and `CanBeLinked` checks), no link is formed.  
  - If `TheWorld.components.moonstormmanager` is missing or `TestAltarTriangleValid` returns `false`, no link occurs.

### `CanBeLinked()`
* **Description:** Determines whether this altar is eligible to participate in a new link, based on a custom predicate if defined.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `canbelinkedfn` is `nil` or returns `true`; otherwise, the result of `canbelinkedfn(inst)`.
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  `onremove` — triggers `breaklink` callback to automatically break any existing link when the entity is removed.  
- **Pushes:**  
  - `onfoundotheraltarfn` callback (if assigned) is invoked internally when another altar is found.  
  - No direct `PushEvent` calls are made by this component.
