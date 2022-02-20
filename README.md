# WPI HPRC Groundstation 

Built using Electron and React.

Run the groundstation in development mode:

```npm run dev```

Build the groundstation for target:

```npm run electron:package:[win|linux|mac]```

### Usage:

Start the backend server with `node .`

Start the frontend gui

Connect to the backend with the `Connect` button

### Groundstation Commands:

```
c
```

Connect to the receiver

```
dc
```

Disconnect from the receiver

```
z
```

Zero the telemetry values (may have to do this twice)

```
x
```

Clear backend offsets to unzero values

```
rec
```

Begin detailed logging (fast logging) (limited to 100,000)

```
dump
```

Dump fast logged data to file

```
raw
```

Print the incoming packets to console

```
stop
```

Stop printing incoming packets to console

```
set
```

Set a specific frontend value

```
get
```

Read a speciific frontend value

```
reset
```

Clear the groundstation values