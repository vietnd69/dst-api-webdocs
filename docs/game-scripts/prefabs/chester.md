---
id: chester
title: Chester
description: Manages the transformation, behavior, and state transitions of the Chester chest monster, including morphing between normal, snow, and shadow variants.
tags: [locomotion, combat, ai, transformation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1dac520
system_scope: entity
---

# Chester

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`chester` is the prefab script defining the behavior of the monster Chester. It implements the core logic for Chester's transformation mechanics (Normal, Snow, Shadow), movement, sleep/wake cycles, breath effects (frost and shadow), container management (including proxy switching between world and pocket dimensions), and interactions with the full moon cycle. It integrates with several core components including `follower`, `health`, `combat`, `sleeper`, `container_proxy`, `locomotor`, and `maprevealable`.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
-- ... other required entity setup ...
inst:AddComponent("chester")
inst.components.chester.MorphChester() -- Trigger transformation if conditions met
inst.components.chester.SetBuild(inst) -- Apply build override for skins
```

## Dependencies & tags
**Components used:** `combat`, `container`, `container_proxy`, `follower`, `health`, `inspectable`, `locomotor`, `maprevealable`, `sleeper`, `drownable`, `embarker`, `knownlocations`, `hauntable`

**Tags:** `companion`, `character`, `scarytoprey`, `chester`, `notraptrigger`, `noauradamage`, `devourable`, `NOBLOCK`, `fridge`, `spoiler`, `shadow_aligned`, `NOCLICK`, `CLASSIFIED`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `frostbreath` | table or boolean | `nil` | Holds frost breath effect instances on client, boolean placeholder on dedicated server. |
| `shadowbreath` | table | `nil` | Contains pool of reusable shadow breath FX entities and active tasks (`task`, `task2`). |
| `_chesterstate` | net_tinybyte | `ChesterState.NORMAL` | Networked variable tracking current state (NORMAL, SNOW, SHADOW). |
| `_frostbreathtrigger` | net_event | `nil` | Client-side event used to trigger frost breath emission. |

## Main functions
### `SetBuild(inst)`
*   **Description:** Applies skin/build overrides to Chester's animation symbols based on his current state and any assigned skin build. Uses `inst.AnimState:OverrideItemSkinSymbol` when a skin is present, otherwise sets a base build. Adjusts shadow FX visibility and color based on state.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `ToggleBreath(inst)`
*   **Description:** Enables or disables frost breath (for SNOW state) and shadow breath (for SHADOW state) by calling `EnableFrostBreath` and `EnableShadowBreath`.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `EnableFrostBreath(inst, enable)`
*   **Description:** Manages frost breath FX on the client. On the server, only sends a network event. Creates/destroys two `frostbreath` prefabs and sets up periodic emission via `EmitFrost`.
*   **Parameters:** `inst` (Entity) - The Chester entity instance. `enable` (boolean) - Whether to enable frost breath.
*   **Returns:** Nothing.

### `EnableShadowBreath(inst, enable)`
*   **Description:** Manages shadow breath FX on the client. Spawns and recycles `shadow_breath` FX entities from a pool, emitting them periodically at left and right breath points.
*   **Parameters:** `inst` (Entity) - The Chester entity instance. `enable` (boolean) - Whether to enable shadow breath.
*   **Returns:** Nothing.

### `SwitchToContainer(inst)`
*   **Description:** Ensures Chester has a local `container` component. Configures `onopenfn`, `onclosefn`, and sound skipping. Closes the proxy and makes it unopenable.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `SwitchToShadowContainerProxy(inst)`
*   **Description:** Replaces the local container with a proxy to the pocket dimension ("shadow"). Moves all inventory items from the local container to the shadow container and removes the local container.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `MorphNormalChester(inst)`
*   **Description:** Transforms Chester back to his default state. Removes specialized tags, resets minimap icon and map revealable icon, switches to standard container, triggers eyebrow morph, and updates state.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `MorphSnowChester(inst)`
*   **Description:** Transforms Chester into the snow variant. Adds `fridge` tag, sets minimap icon, switches to standard container, triggers snow eyebrow morph, and updates state.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `MorphShadowChester(inst)`
*   **Description:** Transforms Chester into the shadow variant. Adds `spoiler` and `shadow_aligned` tags, sets minimap icon, switches to shadow container proxy, triggers shadow eyebrow morph, and updates state.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `CanMorph(inst)`
*   **Description:** Checks if Chester is eligible to morph. Requires full moon, Chester closed, and inventory slots fully populated with valid items (`nightmarefuel` for shadow, `bluegem` for snow).
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** `canShadow` (boolean), `canSnow` (boolean).

### `MorphChester(inst)`
*   **Description:** Triggers a morph if conditions allow. Consumes all inventory items and calls the appropriate `Morph*Chester` function.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `CheckForMorph(inst)`
*   **Description:** Evaluates morph eligibility periodically and transitions to `"transition"` state if conditions are met.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Handles haunt reactions. Chance to trigger panic state and assign haunt value.
*   **Parameters:** `inst` (Entity) - The Chester entity instance.
*   **Returns:** `true` if haunt reaction occurred, `false` otherwise.

## Events & listeners
- **Listens to:**  
  `animover` - Used to trigger frost breath emission (`PushFrostBreathTrigger` / `TriggerAndDoFrostBreath`).  
  `stopfollowing` / `startfollowing` - Manages `companion` tag.  
  `chester._frostbreathtrigger` (client only) - Triggers local frost breath.  
  `chesterstatedirty` (client only) - Triggers `ToggleBreath`.  
  `onclose` - Used to re-check morph conditions.  
  World state `"isfullmoon"` - Used to re-check morph conditions.
- **Pushes:**  
  `chester._frostbreathtrigger` (server only) - Signals frost breath trigger to clients.
