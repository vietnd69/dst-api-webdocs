---
id: hound
title: Hound
description: Manages the behavior, combat, and lifecycle of hound entities including variants like fire, ice, lunar-aligned, and hedgehounds.
tags: [combat, ai, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3ed8d615
system_scope: entity
---

# Hound

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hound` prefab serves as the core definition for multiple hostile hound variants in DST, using a shared factory function (`fncommon`) to initialize common components and behaviors. It supports multiple variants—default, fire, ice, lunar-aligned (moonbeast), clay, mutated, and hedgehounds—via specialized function variants (`fndefault`, `fnfire`, etc.). It integrates deeply with components for combat targeting, follower leadership, sleep cycles, amphibious movement, and stategraph-driven behaviors.

## Usage example
```lua
-- Create a default hound with full behavior
local inst = SpawnPrefab("hound")
inst.Transform:SetPosition(x, y, z)

-- Example: create a firehound
local fire_hound = SpawnPrefab("firehound")
fire_hound.Transform:SetPosition(x, y, z)
fire_hound.components.health:SetMaxHealth(100)
fire_hound.components.combat:SetDefaultDamage(25)
```

## Dependencies & tags
**Components used:**  
`amphibiouscreature`, `burnable`, `childspawner`, `combat`, `eater`, `embarker`, `entitytracker`, `follower`, `freezable`, `halloweenmoonmutable`, `hauntable`, `health`, `homeseeker`, `inspectable`, `locomotor`, `lootdropper`, `sanityaura`, `sleeper`

**Tags added:**  
`scarytoprey`, `scarytooceanprey`, `monster`, `hostile`, `hound`, `canbestartled`, `pet_hound` (for pets), `lunar_aligned` (mutated variants), `moonbeast`, `clay` (clayhounds), `hedge` (hedgehounds), `electricdamageimmune` (clayhounds), `strongstomach`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `freezable`, `soulless` (for lunar_aligned)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sounds` | table | `sounds`, `sounds_clay`, etc. | Sound bank used by the instance, variant-dependent. |
| `hedgeitem` | string or nil | `nil` | Item name to drop on death for hedgehounds. |
| `wargleader` | entity reference or nil | `nil` | Reference to leader when mutated by a Warg. |
| `forcemutate` | boolean or nil | `nil` | Flag set when leader is mutatedwarg. |
| `leadertask` | task reference or nil | `nil` | Delayed task to restore leader after stopping following. |
| `eyefxl`, `eyefxr` | entity reference or nil | `nil` | Eyeflame child entities for clayhounds. |
| `_eyeflames` | net_bool or nil | `nil` | Replicated boolean for clayhound eye flame state. |
| `landspeed` | number or nil | `nil` | Cached land speed before entering water. |
| `hop_distance` | number or nil | `nil` | Cached hop distance before entering water. |

## Main functions
### `fncommon(bank, build, morphlist, custombrain, tag, data)`
*   **Description:** Shared constructor function that initializes common components and behavior for all hound variants. It sets up physics, animation, components (combat, follower, sleeper, etc.), sound banks, and variant-specific overrides.
*   **Parameters:**  
    `bank` (string) – Animation bank name (e.g., `"hound"`, `"clayhound"`).  
    `build` (string) – Build asset name (e.g., `"hound_ocean"`, `"clayhound"`).  
    `morphlist` (table or nil) – List of mutagenic prefabs for hauntable morphing.  
    `custombrain` (table or nil) – Brain module to override default (`brain` or `moonbrain`).  
    `tag` (string or nil) – Variant tag (`"clay"`, `"lunar_aligned"`, `"moonbeast"`, `"hedge"`).  
    `data` (table or nil) – Options table (`{amphibious = true}`, `{canlunarmutate = true}`).
*   **Returns:** `inst` (entity) – The fully constructed entity.
*   **Error states:** Returns early without master simulation logic if `TheWorld.ismastersim` is `false`.

### `fndefault()`
*   **Description:** Constructs a default hound with amphibious behavior and lunar mutation support. Calls `fncommon` with `canlunarmutate = true` and adds `halloweenmoonmutable` component.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Default hound instance.

### `fnfire()`
*   **Description:** Constructs a firehound with fire-damage attacks, reduced freeze resistance, and explosion on death.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Firehound instance.
*   **Error states:** No explosion occurs during file load (`data.cause == "file_load"`).

### `fncold()`
*   **Description:** Constructs an icehound with cold-damage attacks, burn resistance, and frost-explosion on death.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Icehound instance.
*   **Error states:** No shatter effect if component is missing at death.

### `fnmoon()`
*   **Description:** Constructs a lunar-aligned moonbeast with distinct AI (via `moonbrain`), petrify support, and moon-specific targeting/retarget logic.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Moon hound instance.

### `fnclay()`
*   **Description:** Constructs a clayhound that starts in a statue state (`"statue"`), lacks corpse, and supports eye flame lighting/sound.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Clayhound instance.

### `fnmutated()`
*   **Description:** Constructs a mutated hound (lunar_aligned) with unique corpse handling, no corpse state, and ability to inherit Warg leadership.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Mutated hound instance.

### `fnhedge()`
*   **Description:** Constructs a hedgehound that shatters on death, drops custom items from `hedgeitem`, and has unique scrapbook dependencies.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Hedgehound instance.

### `fnfiredrop()`
*   **Description:** Creates a non-sentient `houndfire` object used as projectile/overlay.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) – Fire projectile instance.

## Events & listeners
- **Listens to:**  
  `"attacked"` – Triggers combat target assignment and share-target logic.  
  `"onattackother"` – Triggers share-target logic for aggressive hounds.  
  `"newcombattarget"` – Wakes sleeper if hound is asleep.  
  `"death"` – Triggers variant-specific explosions (fire/ice) or shatter effects (hedge, ice).  
  `"moonpetrify"` – Transforms moonhound into gargoyle.  
  `"moontransformed"` – Enters taunt state after moon mutation.  
  `"startfollowing"` / `"stopfollowing"` – Manages leader tracking and follow time.  
  `"restoredfollower"` – Emitted when follower is restored after leader death.  
  `"eyeflamesdirty"` – Updates clayhound eye flame FX and lighting.  
  `"spawnedfromhaunt"` – Triggers panic behavior.  
  `"stopday"` (WorldState) – Triggers return home at nightfall.  
  `"OnEntitySleep"` – Triggers return home during sleep.  
  `"save"` / `"load"` – Persists pet status and `hedgeitem`.  
  `"eyeflamesdirty"` (custom) – Handles FX creation/destruction for clayhounds.

- **Pushes:**  
  `"onignite"`, `"onwakeup"`, `"attacked"`, `"onattackother"`, `"leaderchanged"`, `"on_loot_dropped"`, `"loot_prefab_spawned"`, `"moonpetrify"`, `"moontransformed"`, `"restoredfollower"`, `"eyeflamesdirty"`, `"spawnedfromhaunt"`.
