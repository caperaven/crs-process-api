# Prefixes

Prefixes are shortcuts helping with keeping pathing shorter.  
There are a number of default prefixes, but you can also add your own.  

Prefixes are on the process object.
When you look at calling intent there are a number of standard parameters you need to pass in, though not all are required all the time.
Process is one of those parameters if you call it form javascript.

When executing processes using the JSON schema, the process running will pass on the process by default.  
See the [example schema](/docs/example/) on how they are used.

## Existing "system" prefixes

There are a number of default prefixes that is defined by the system.

| Prefix        | Path / Target             | Description                                                               |
| :------------ | :------------------------ | :------------------------                                                  |
| $context      | context object            | as per parameter                                                          |                                                  
| $process      | process object            | as per parameter                                                          |
| $item         | item object               | as per parameter                                                          |
| $text         | $process.text             | placeholder for text you want to refer to in steps                        |
| $data         | $process.data             | place where you can store process data while process is running           |
| $parameters   | $process.parameters       | if a process has parameters and, you want to access a parameter in a step |
| $bId          | $process.parameters.bId   | crs-binding context id that was passed on as a parameter                  |
| $global       | globalThis                | certain systems allow access to global objects                            |