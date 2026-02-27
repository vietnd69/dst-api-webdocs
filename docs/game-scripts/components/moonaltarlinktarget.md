---
id: moonaltarlinktarget
title: Moonaltarlinktarget
description: This component enables an entity to serve as a valid target for establishing lunar altar link connections during celestial events, by registering a tag and participating in the process of forming triangle-based links between compatible altars.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 69311638
---

# Moonaltarlinktarget

## Overview
This component marks an entity as a potential target for Moon Altar Link operations (e.g., during Moon Storms) by assigning the `"moonaltarlinktarget"` tag and implementing logic to detect valid neighboring altars within a specified radius. It enables entities (such as Moon Altars) to participate in constructing a 3-altar triangle required for link establishment, and ensures cleanup if the entity is removed.

## Dependencies & Tags
- Adds the `"moonaltarlinktarget"` tag to the entity (`inst:AddTag("moonaltarlinktarget")`)
- Listens for the `"onremove"` event to break existing links
- Uses `TheSim:FindEntities()` to locate candidate altars
- Requires external components: `Transform` (for position), `moonaltarlinktarget` (on found altars), and `moon_altar_link` (on the spawned link prefab)
- Relies on `TheWorld.components.moonstormmanager` for triangle validation

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `link` | `EntityRef?` | `nil` | Reference to an active `moon_altar_link` entity if one has been established. |
| `link_radius` | `number` | `20` | Search radius (in game units) around the entity for potential linking targets. |
| `onfoundotheraltarfn` | `function?` | `nil` | Optional callback invoked when a second altar is discovered during link setup. |
| `canbelinkedfn` | `function?` | `nil` | Optional predicate function to dynamically control whether this entity may be linked. |

## Main Functions

### `TryEstablishLink()`
* **Description:** Scans the area within `link_radius` for compatible Moon Altar entities (Moon Altar, Cosmic Moon Altar, or Astral Moon Altar), up to two additional altars, and attempts to form a valid triangular link if three are found and pass validation.
* **Parameters:** None.

### `CanBeLinked()`
* **Description:** Returns whether this altar is currently allowed to participate in linking. Delegates to `canbelinkedfn` if present; otherwise returns `true`.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"onremove"` → triggers `breaklink()` to break any active link when the entity is removed from the world.

- **Does not push any events.**