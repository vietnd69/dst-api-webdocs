---
id: wardrobe
title: Wardrobe
description: A placeable structure component that allows players to store and manage items via an inventory interface, while supporting interaction callbacks, hammering, burning, and save/load persistence.
tags: [structure, storage, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 12a022db
system_scope: entity
---

# Wardrobe

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wardrobe` component is a structure used to provide player inventory management functionality. It is attached to the `wardrobe` prefab and defines behavior for opening/closing animations, sound effects, interaction callbacks, and integration with the `wardrobe` component to manage item changes. It also handles hammering (destructive action), burning (via `burnable`), and save/load persistence.

## Usage example
```lua
-- Typically used as part of the 'wardrobe' prefab constructor (as shown in source).
-- Custom prefabs can reuse the wardrobe component like so:

inst:AddComponent("wardrobe")
inst.components.wardrobe:SetChangeInDelay(20 * FRAMES)
inst.components.wardrobe.onchangeinfn = function(inst) -- custom callback
    print("Wardrobe change-in initiated")
end
```

## Dependencies & tags
**Components used:** `inspectable`, `wardrobe`, `lootdropper`, `workable`, `burnable`, `propagator`, `fueled`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`, `workable`
**Tags:** Adds `structure`, `wardrobe`; checks `burnt` during animation/sound control and save/load.

## Properties
No public properties.

## Main functions
Not applicable. This file is a prefab constructor (i.e., defines the full entity via `fn()`), not a reusable component class.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `onbuilt(inst)` to play construction animation and sound.
- **Pushes:** None directly in this file, but leverages component event systems (e.g., `burnable` fires `onextinguish`, `wardrobe` manages inventory state events).
