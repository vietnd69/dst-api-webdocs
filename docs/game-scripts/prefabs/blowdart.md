---
id: blowdart
title: Blowdart
description: A throwable weapon prefabricated as a family of darts with distinct effects (sleep, fire, electric, or damage), designed for use by the player or walrus creatures in combat.
tags: [combat, projectile, consumable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eb984591
system_scope: entity
---

# Blowdart

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`blowdart` is not a standalone component but a Prefab factory that generates several dart variants used as throwable weapons. Each variant embeds the `weapon`, `projectile`, `equippable`, and other utility components internally. It handles animation swapping, physics, tagging, and network synchronization, and provides差异化 damage/application logic for sleep, fire, electric, and physical effects via custom `onhit` and `onattack` callbacks.

The prefabs are organized under four player-facing variants (`blowdart_sleep`, `blowdart_fire`, `blowdart_pipe`, `blowdart_yellow`) and one walrus-specific variant (`blowdart_walrus`). All variants inherit from a shared `common()` initializer and override or extend behavior conditionally based on server-side simulation (`TheWorld.ismastersim`).

## Usage example
```lua
-- Spawn a sleep dart and throw it
local dart = SpawnPrefab("blowdart_sleep")
if dart ~= nil then
    dart.Transform:SetPosition(entity.Transform:GetWorldPosition())
    dart.components.projectile:Launch(entity, dart)
end

-- A weapon component listener for a custom dart attack
local function myattack(inst, attacker, target)
    if target.components.health then
        target.components.health:DoDelta(10, false, attacker)
    end
end
```

## Dependencies & tags
**Components used:** `weapon`, `projectile`, `equippable`, `inventoryitem`, `stackable`, `inspectable`, `floater`, `burnable`, `freezable`, `health`, `sleeper`, `grogginess`, `combat`, `animstate`, `transform`, `network`, `soundemitter`.

**Tags:** `blowdart`, `sharp`, `weapon`, `projectile`, `NOCLICK` (dynamically added on thrown state), plus variant-specific tags: `tranquilizer` (sleep), `firedart` (fire), and `yellow` (electric) via implicit behavior.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `anim` parameter | Stores the animation state key for scrapbook preview. |
| `persists` | boolean | `true` | Controls whether the dart persists after hitting a target (`false` for thrown states). |
| `equippable.equipstack` | boolean | `true` | Indicates the dart can be equipped even in stacks. |

## Main functions
### `common(anim, tags, removephysicscolliders)`
*   **Description:** Core initializer that builds the base blowdart entity — including transforms, animation, tags, physics, and core components (weapon, projectile, equippable, etc.). Conditional logic runs only on the master simulation. Takes variant-specific parameters to finalize behavior.
*   **Parameters:**
    *   `anim` (string) — The initial animation name to play (e.g., `"idle_purple"`).
    *   `tags` (table? | nil) — Optional array of string tags to add to the entity.
    *   `removephysicscolliders` (boolean | nil) — If `true`, removes default physics colliders via `RemovePhysicsColliders`.
*   **Returns:** `inst` (Entity) — The fully initialized but possibly non-persistent entity instance.
*   **Error states:** Returns early on client (non-mastersim) after setting up basic visuals/audio — no combat components attached.

### `sleep()`
*   **Description:** Returns the `blowdart_sleep` prefab with sleep-inducing behavior on impact. Applies sleepiness via `sleeper` or `grogginess` components on the target.
*   **Parameters:** None.
*   **Returns:** Entity instance of `blowdart_sleep`.
*   **Error states:** Early return on client (no components added).

### `fire()`
*   **Description:** Returns the `blowdart_fire` prefab with fire-ignition behavior. Attempts to ignite targets via `burnable:Ignite`, remove freezing via `freezable:Unfreeze`, and trigger fire damage via `health:DoFireDamage`.
*   **Parameters:** None.
*   **Returns:** Entity instance of `blowdart_fire`.
*   **Error states:** Early return on client; no side effects if target lacks `burnable` or `freezable`.

### `pipe()`
*   **Description:** Returns the `blowdart_pipe` prefab with physical damage (`TUNING.PIPE_DART_DAMAGE`) and pipe-specific visual/swap animations.
*   **Parameters:** None.
*   **Returns:** Entity instance of `blowdart_pipe`.
*   **Error states:** Early return on client.

### `yellow()`
*   **Description:** Returns the `blowdart_yellow` prefab with electric damage. Sets up `SetElectric()` (enables wet damage scaling) and triggers sparks on impact.
*   **Parameters:** None.
*   **Returns:** Entity instance of `blowdart_yellow`.
*   **Error states:** Early return on client.

### `walrus()`
*   **Description:** Returns the `blowdart_walrus` variant customized for walrus attacks — including launch offset, range, and homing disabled. Includes `NOCLICK` tag and removes physics colliders to prevent player interaction.
*   **Parameters:** None.
*   **Returns:** Entity instance of `blowdart_walrus`.
*   **Error states:** Early return on client.

## Events & listeners
- **Listens to:** `onthrown` (via `inst:ListenForEvent("onthrown", onthrown)`) — triggers orientation change and disables landed events for inventory collision handling.
- **Pushes:** None directly; delegates event logic to callbacks (`onhit`, `onthrown`, `onattack`), and relies on `attacked` events via `target:PushEvent("attacked", ...)`.