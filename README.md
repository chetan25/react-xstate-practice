---
Title: XState in context with React.
Excerpt: A simple effort to learn XState in context with React, by creating sample components and showing the difference.
Tech: "React, XState"
---

# React and XState

This repo contains some examples showing difference between XState and normal React state workflow. To start with I have created few Toggle components that are loaded in the main App and have different ways to manage internal state.

> There are lots of comments in the code explaining the reasoning :)

### Different ways to Handle State

Basically all the Toggle component have the same UI, but different ways to handle the toggle state. The state can basically have 3 values

- active - when the toggle is on
- inactive - when the toggle is off
- pending - when we press from inactive state to got to active state. This middle state mimics a async action like a http request or callback, and once the action is complete fires the action to change state to active.

#### React useState

The `ToggleReactState` component uses `useState` to manage the states, and you can see how this could lead to issues if our state gets complicated or if we have multiple states to handle between active and inactive.

#### React Reducer(Using State Model Approach)

The `ToggleReactReducer` component uses `useReducer` to manage state. This component shows two ways to use the reducer function.

- First is the classic Switch case approach. But there is a difference in how we have use the switched case. In normal reducer we would switch between the `action type` and then generate our new state, but in State model approach we switch between the `states` and define all the action that can happen when the component is in that state.
- Second approach is swapping the Switch case with an Object. In this we define an Object equivalent to the XState machine object, which basically defines what actions we can take in a state.

#### React and XState

The `ToggleReactXState` component uses XState machine model to handle the state. In this we create a machine object that maps the all action that can be taken when in a particular state in the component. Then we pass this machine Object to the `useMachine` hook that returns us 3 things

- `state` - this is the state object, that contains the current state, context(extended state) and bunch of other properties.
- `send` - a function to fire action on the machine.
- `service` - this is the running instance of that state machine, and it's like an obsevable and we could subscribe to it to get the values.

#### Spawning Child State Machine from Main State Machine

We can spawn dynamic state machine for a State machine. A example of this is `SimpleXStateToggle` component. This component takes in the reference to the state machine to be consumed and is generated from the main App by clicking the button. The Main app uses the `spawn` function and passes it the state machine object to generate the new state machine instance and returns a reference of the newly created instance.
