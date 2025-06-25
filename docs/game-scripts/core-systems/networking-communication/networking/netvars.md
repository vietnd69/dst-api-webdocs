---
id: netvars
title: Network Variables (NetVars)
description: Network variable types and utilities for synchronized client-server communication
sidebar_position: 3
slug: game-scripts/core-systems/netvars
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Network Variables (NetVars)

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `netvars` module provides network variable types and utilities for synchronized client-server communication in Don't Starve Together. Network variables (netvars) automatically synchronize data between server and clients, ensuring consistent game state across all players.

## Usage Example

```lua
-- Create a network variable
local health_netvar = net_float(inst.GUID, "health", "healthdirty")

-- Set value on server (syncs to clients)
health_netvar:set(100)

-- Read value on server or client
local current_health = health_netvar:value()

-- Set local value without sync
health_netvar:set_local(95)
```

## Network Variable Types

### net_bool {#net-bool}

**Status:** `stable`

**Description:**
1-bit boolean network variable for true/false values.

**Usage:**
```lua
local is_alive = net_bool(inst.GUID, "alive", "alivedirty")
is_alive:set(true)
```

### net_tinybyte {#net-tinybyte}

**Status:** `stable`

**Description:**
3-bit unsigned integer network variable. Range: [0..7]

**Usage:**
```lua
local small_counter = net_tinybyte(inst.GUID, "counter", "counterdirty")
small_counter:set(5)
```

### net_smallbyte {#net-smallbyte}

**Status:** `stable`

**Description:**
6-bit unsigned integer network variable. Range: [0..63]

**Usage:**
```lua
local medium_counter = net_smallbyte(inst.GUID, "level", "leveldirty")
medium_counter:set(42)
```

### net_byte {#net-byte}

**Status:** `stable`

**Description:**
8-bit unsigned integer network variable. Range: [0..255]

**Usage:**
```lua
local age = net_byte(inst.GUID, "age", "agedirty")
age:set(150)
```

### net_shortint {#net-shortint}

**Status:** `stable`

**Description:**
16-bit signed integer network variable. Range: [-32767..32767]

**Usage:**
```lua
local temperature = net_shortint(inst.GUID, "temp", "tempdirty")
temperature:set(-100)
```

### net_ushortint {#net-ushortint}

**Status:** `stable`

**Description:**
16-bit unsigned integer network variable. Range: [0..65535]

**Usage:**
```lua
local item_count = net_ushortint(inst.GUID, "count", "countdirty")
item_count:set(30000)
```

### net_int {#net-int}

**Status:** `stable`

**Description:**
32-bit signed integer network variable. Range: [-2147483647..2147483647]

**Usage:**
```lua
local large_value = net_int(inst.GUID, "value", "valuedirty")
large_value:set(-1000000)
```

### net_uint {#net-uint}

**Status:** `stable`

**Description:**
32-bit unsigned integer network variable. Range: [0..4294967295]

**Usage:**
```lua
local timestamp = net_uint(inst.GUID, "time", "timedirty")
timestamp:set(4000000000)
```

### net_float {#net-float}

**Status:** `stable`

**Description:**
32-bit floating point network variable for decimal values.

**Usage:**
```lua
local health_percent = net_float(inst.GUID, "healthpct", "healthpctdirty")
health_percent:set(0.75)
```

### net_hash {#net-hash}

**Status:** `stable`

**Description:**
32-bit hash network variable. Can be set by hash or string (automatically converted to hash), but only returns the hash value when read.

**Usage:**
```lua
local state_hash = net_hash(inst.GUID, "state", "statedirty")
state_hash:set("idle")  -- Converted to hash automatically
local hash_value = state_hash:value()  -- Returns hash, not string
```

### net_string {#net-string}

**Status:** `stable`

**Description:**
Variable length string network variable.

**Usage:**
```lua
local player_name = net_string(inst.GUID, "name", "namedirty")
player_name:set("Player1")
```

### net_entity {#net-entity}

**Status:** `stable`

**Description:**
Network variable for entity instances.

**Usage:**
```lua
local target_entity = net_entity(inst.GUID, "target", "targetdirty")
target_entity:set(some_entity)
```

## Array Network Variables

### net_bytearray {#net-bytearray}

**Status:** `stable`

**Description:**
Array of 8-bit unsigned integers (max size = 31). Arrays are expensive and should be avoided if values change often.

**Usage:**
```lua
local byte_array = net_bytearray(inst.GUID, "bytes", "bytesdirty")
-- Set array values as needed
```

### net_smallbytearray {#net-smallbytearray}

**Status:** `stable`

**Description:**
Array of 6-bit unsigned integers (max size = 31). Arrays are expensive and should be avoided if values change often.

**Usage:**
```lua
local small_byte_array = net_smallbytearray(inst.GUID, "smallbytes", "smallbytesdirty")
-- Set array values as needed
```

### net_ushortarray {#net-ushortarray}

**Status:** `stable`

**Description:**
Array of 16-bit unsigned integers (max size = 31). Arrays are expensive and should be avoided if values change often.

**Usage:**
```lua
local ushort_array = net_ushortarray(inst.GUID, "ushorts", "ushortsdirty")
-- Set array values as needed
```

## Classes

### net_event {#net-event}

**Status:** `stable`

**Description:**
Event wrapper over net_bool for one-shot triggers such as sound effects. Use events for triggers, not state changes (which should use net_bool instead).

**Methods:**

#### net_event(guid, event) {#net-event-constructor}

**Parameters:**
- `guid` (number): Entity GUID
- `event` (string): Event name

**Returns:**
- (net_event): New event instance

#### inst:push() {#net-event-push}

**Description:**
Triggers the event on server and clients.

**Example:**
```lua
local damage_event = net_event(inst.GUID, "damage", "damagedirty")

-- Trigger event
damage_event:push()
```

## Utility Functions

### GetIdealUnsignedNetVarForCount(count) {#get-ideal-unsigned-netvar}

**Status:** `stable`

**Description:**
Returns the most efficient unsigned network variable type for a given count requirement. Should be used sparingly and assigned to variables with suffix `_net_enum` for file searches.

**Parameters:**
- `count` (number): Maximum count value needed

**Returns:**
- (function): Appropriate netvar constructor function, or nil if count exceeds limits

**Example:**
```lua
local item_count_net_enum = GetIdealUnsignedNetVarForCount(100)
local count_netvar = item_count_net_enum(inst.GUID, "itemcount", "itemcountdirty")
```

**Selection Logic:**
- count ≤ 7: returns `net_tinybyte`
- count ≤ 63: returns `net_smallbyte`
- count ≤ 255: returns `net_byte`
- count ≤ 65535: returns `net_ushortint`
- count ≤ 4294967295: returns `net_uint`
- count > 4294967295: returns `nil`

## Network Variable Methods

All network variables share these common methods:

### netvar:set(value) {#netvar-set}

**Description:**
Call on the server to set the value, which will be synced to clients. Dirty event is triggered on server and clients only if value has actually changed.

**Parameters:**
- `value` (varies): Value to set (type depends on netvar type)

### netvar:value() {#netvar-value}

**Description:**
Call on the server or clients to read the current value.

**Returns:**
- (varies): Current value (type depends on netvar type)

### netvar:set_local(value) {#netvar-set-local}

**Description:**
Call on the server or clients to set the value without triggering a sync or dirty event. This results in the next server set() to be dirty regardless of whether the value changed, since we assume the client may have set_local() to any arbitrary value.

**Parameters:**
- `value` (varies): Value to set locally

**Usage Notes:**
- Generally used in code paths shared between server and clients
- Clients may have enough information (such as elapsed time) to estimate and update the value locally
- Sharing the code path allows the server to be aware that the value is being updated locally on clients
- Example usage: let clients update smooth timer ticks locally, server saves bandwidth by only needing set() to force a resync occasionally

## Important Notes

### Synchronization Requirements

- **Identical Declaration**: Netvars must exist and be declared identically on server and clients for each entity, otherwise entity deserialization will fail
- **Mod Requirement**: If a MOD uses netvars, then server and clients must all have the same MOD active
- **Event Timing**: Netvar dirty events are triggered before lua update
- **Different Listeners**: Server and clients may register different listeners for dirty events

### Performance Considerations

- **Array Cost**: Arrays are expensive. Avoid using them, especially if the values will change often
- **Hash Efficiency**: net_hash has the same network cost as a 32-bit unsigned integer
- **Bandwidth**: Use the smallest appropriate netvar type for your data to minimize bandwidth usage

### Best Practices

1. **Choose Appropriate Type**: Use the smallest netvar type that can hold your data range
2. **Avoid Arrays**: Use individual netvars instead of arrays when possible
3. **Event vs State**: Use net_event for one-shot triggers, net_bool for persistent state
4. **Local Updates**: Use set_local() for client-side predictions that the server will occasionally correct

## Related Modules

- [Networking](./networking.md): Core networking functions and server management
- [Network Client RPC](./networkclientrpc.md): Remote procedure calls for client-server communication
- [Entity Script](./entityscript.md): Entity management and GUID system
