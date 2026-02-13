---
id: burnable
title: Burnable
description: Manages an entity's state of being on fire, smoldering, and the visual effects associated with burning.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
---

# Burnable

## Overview
The Burnable component handles all logic related to an entity catching fire. This includes smoldering due to ambient heat, igniting into a full fire, burning for a set duration, being extinguished, and managing all associated visual and audio effects. It interacts with other components like `propagator` to spread fire and `fueled` to consume fuel while burning.

## Dependencies & Tags

**Dependencies:**
This component interacts with, but does not strictly require, the following components on its entity:
- `propagator`: To spread heat and fire to nearby objects.
- `fueled`: To consume fuel as a resource while burning.
- `health`: To handle charring on death and other health-related fire interactions.
- `rainimmunity`: To check if rain should affect smoldering.

**Tags Added:**
- `fire`: Added when the entity is burning.
- `smolder`: Added when the entity is smoldering.
- `canlight`: Added when the entity is not burning and can be lit.
- `nolight`: Added when the entity is burning or cannot be lit.
- `stokeablefire`: Added for controlled burns that can be stoked into a regular fire.
- `burnableignorefuel`: Added if the entity should not consume fuel from its `fueled` component when burning.

## Properties

| Property            | Type      | Default Value | Description                                                                                 |
| ------------------- | --------- | ------------- | ------------------------------------------------------------------------------------------- |
| `flammability`      | number    | `1`           | A modifier for how easily this object catches fire (used by the `propagator` component).    |
| `burning`           | boolean   | `false`       | True if the entity is currently on fire.                                                    |
| `smoldering`        | boolean   | `false`       | True if the entity is currently smoldering and about to catch fire.                         |
| `burntime`          | number    | `nil`         | The duration, in seconds, that the entity will burn before being consumed.                  |
| `fxdata`            | table     | `{}`          | A table containing data for creating fire visual effects (FX).                              |
| `fxlevel`           | number    | `1`           | The current intensity level of the fire visual effects.                                     |
| `canlight`          | boolean   | `true`        | Determines if the entity can be lit on fire by a player.                                    |
| `lightningimmune`   | boolean   | `false`       | If true, the entity cannot be ignited by lightning.                                         |
| `onignite`          | function  | `nil`         | Callback function triggered when the entity ignites.                                        |
| `onextinguish`      | function  | `nil`         | Callback function triggered when the entity is extinguished.                                |
| `onburnt`           | function  | `nil`         | Callback function triggered when the entity has completely burned away.                     |
| `onsmoldering`      | function  | `nil`         | Callback function triggered when the entity begins to smolder.                              |
| `onstopsmoldering`  | function  | `nil`         | Callback function triggered when the entity stops smoldering.                               |
| `extinguishimmediately`| boolean | `true`       | If true, the entity is extinguished immediately after the `onburnt` event.                  |
| `stokeablefire`     | boolean   | `false`       | If true, this fire is a controlled burn (e.g., from Willow) that can be stoked.           |

## Main Functions

### `SetOnIgniteFn(fn)`
* **Description:** Sets a custom callback function to be executed when the entity ignites.
* **Parameters:**
    * `fn`: The function to call. It will receive the entity instance (`inst`), the fire source, and the instigator (`doer`) as arguments.

### `SetOnBurntFn(fn)`
* **Description:** Sets a custom callback function to be executed when the entity has finished burning.
* **Parameters:**
    * `fn`: The function to call. It will receive the entity instance (`inst`) as an argument.

### `SetOnExtinguishFn(fn)`
* **Description:** Sets a custom callback function to be executed when the entity's fire is extinguished.
* **Parameters:**
    * `fn`: The function to call. It will receive the entity instance (`inst`) as an argument.

### `SetBurnTime(time)`
* **Description:** Sets the duration in seconds that the entity will burn for once ignited.
* **Parameters:**
    * `time`: (number) The burn duration.

### `IsBurning()`
* **Description:** Returns whether the entity is currently on fire.
* **Parameters:** None.

### `IsSmoldering()`
* **Description:** Returns whether the entity is currently smoldering.
* **Parameters:** None.

### `AddBurnFX(prefab, offset, followsymbol, followaschild, scale, followlayered)`
* **Description:** Registers a visual effect prefab to be spawned when the entity is burning.
* **Parameters:**
    * `prefab`: (string) The prefab name of the effect to spawn.
    * `offset`: (Vector3) The position offset for the effect relative to the entity's origin or `followsymbol`.
    * `followsymbol`: (string, optional) The symbol in the entity's animation build that the effect should follow.
    * `followaschild`: (boolean, optional) If true, makes the FX a child of the entity even when following a symbol.
    * `scale`: (number, optional) A scale multiplier for the effect.
    * `followlayered`: (boolean, optional) If true, the effect follows the symbol's transform and layering.

### `SetFXLevel(level, percent)`
* **Description:** Sets the intensity level of currently active and future fire visual effects.
* **Parameters:**
    * `level`: (number) The intensity level to set.
    * `percent`: (number, optional) The percentage progress within the given level (default is 1).

### `StartWildfire()`
* **Description:** Initiates the smoldering process on the entity, typically triggered by high ambient heat. If not extinguished, this will lead to ignition.
* **Parameters:** None.

### `Ignite(immediate, source, doer)`
* **Description:** Sets the entity on fire. This stops any smoldering, spawns fire effects, starts the burn timer, and triggers the `onignite` event.
* **Parameters:**
    * `immediate`: (boolean, optional) If true, fire effects may appear instantly.
    * `source`: (entity, optional) The entity that is the source of the fire (e.g., a torch).
    * `doer`: (entity, optional) The entity that caused the ignition (e.g., the player holding the torch).

### `ExtendBurning()`
* **Description:** Resets the burn timer to its full duration. This is typically called when adding fuel to an existing fire.
* **Parameters:** None.

### `SmotherSmolder(smotherer)`
* **Description:** Stops the entity from smoldering.
* **Parameters:**
    * `smotherer`: (entity, optional) The item or entity used to smother the smolder, which may be consumed or damaged in the process.

### `StopSmoldering(heatpct)`
* **Description:** Halts the smoldering process and cleans up smolder effects.
* **Parameters:**
    * `heatpct`: (number, optional) A heat percentage to reset the `propagator` component to.

### `Extinguish(resetpropagator, heatpct, smotherer)`
* **Description:** Puts out the fire on the entity. This stops burning, kills fire effects, and triggers the `onextinguish` event.
* **Parameters:**
    * `resetpropagator`: (boolean, optional) If true, resets the heat in the `propagator` component.
    * `heatpct`: (number, optional) The heat percentage to reset the `propagator` to.
    * `smotherer`: (entity, optional) The item or entity used to extinguish the fire.

### `KillFX()`
* **Description:** Destroys all active fire visual effect children associated with this component.
* **Parameters:** None.

## Events & Listeners

**Listens To:**
- `death`: When the entity is burning, it listens for its own death to apply a charred visual effect.

**Pushes:**
- `onignite`: Pushed on the entity when it is set on fire. Passes `{ source, doer }`.
- `onburnt`: Pushed on the entity when it has completely burned away.
- `onextinguish`: Pushed on the entity when its fire is extinguished.
- `plantkilled`: Pushed to `TheWorld` if a burning entity with the "plant" tag is destroyed by fire.
- `burnt`: Pushed on a `smotherer` entity if it takes fire damage while putting out a smolder.