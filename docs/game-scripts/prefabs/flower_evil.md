---
id: flower_evil
title: Flower Evil
description: A harvestable, sanity-affecting decorative flower that drops petals upon picking and can ignite wildfires.
tags: [environment, sanity, loot, fire]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e6933d1
system_scope: environment
---

# Flower Evil

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`flower_evil` is a world-scene entity representing a decorative yet dangerous plant found in the Shadow Realm and other high-sanity-loss zones. It emits a negative sanity aura, drops `petals_evil` when harvested, and can be used as a wildfire starter. Its behavior and appearance are randomized at spawn, and it persists state across save/load cycles via custom save hooks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("flower")
-- (Implementation note: this is typically instantiated via Prefab("flower_evil", fn) and not manually constructed)
-- In modding, to reference its components:
if inst.components.pickable then
    inst.components.pickable:SetUp("petals_evil", 20)  -- customize regen
end
```

## Dependencies & tags
**Components used:** `inspectable`, `sanityaura`, `pickable`, `transformer` (commented out, not active), and indirectly `sanity` and `skilltreeupdater` (via `onpickedfn` logic).  
**Tags:** `flower` is added to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | random from `{"f1", ..., "f8"}` | Current animation sequence name; stored in save data. |
| `scrapbook_anim` | string | `"f1"` | Placeholder used for scrapbook display. |
| `scrapbook_removedeps` | table of strings | `{"nightmarefuel"}` | Dependencies excluded from scrapbook auto-generation. |
| `pickupsound` | string | `"vegetation_grassy"` | Not used directly (overridden via `pickable.picksound`). |

## Main functions
Not applicable — this prefab is defined in its `fn()` constructor and exposes no public methods beyond those of its attached components (`pickable`, `sanityaura`, etc.).

## Events & listeners
The component itself does not register event listeners directly, but:
- **Listens to:** None (no `inst:ListenForEvent()` calls appear in this file).
- **Pushes:** None (no `inst:PushEvent()` calls appear in this file).
- **Indirect listeners via component callbacks:**
  - `onpickedfn(inst, picker)` is invoked when the `pickable` component triggers a harvest.
  - `onsave(inst, data)` and `onload(inst, data)` are called by the save system.

### Save/load behavior
- **`onsave(inst, data)`**  
  Stores `inst.animname` in the `data.anim` field to persist the chosen animation across sessions.

- **`onload(inst, data)`**  
  On restore, applies `inst.animname = data.anim` and replays that animation via `AnimState:PlayAnimation()`.

### `onpickedfn(inst, picker)`
*   **Description:** Callback executed upon harvesting. Modifies the harvester's sanity based on skill activation.
*   **Parameters:**  
    - `inst` (Entity) – the flower being picked.  
    - `picker` (Entity) – the entity harvesting the flower.  
*   **Returns:** Nothing.
*   **Error states:** No-op if `picker` lacks a `sanity` component or if `picker`'s `skilltreeupdater` is missing or skill `"wendy_gravestone_1"` is not activated.

### Component-specific behavior
- `sanityaura.aura = -TUNING.SANITYAURA_SMALL` – applies a small negative sanity aura.
- `pickable.onpickedfn = onpickedfn` – hooks into the harvest event.
- `pickable.remove_when_picked = true` – plant is consumed upon harvest.
- `pickable.wildfirestarter = true` – enables use as a wildfire starter.
- `pickable.quickpick = true` – allows one-tap harvest (no pickup animation).
- `MakeSmallBurnable(inst)` and `MakeSmallPropagator(inst)` – integrate into fire spread mechanics.