import React, { createContext} from 'react';
import { createMachine, assign, spawn, sendParent } from 'xstate';
import { useMachine } from '@xstate/react';


import './App.css';
import ToggleReactState from './components/toggle-react-state';
import ToggleReactReducer from './components/toggle-react-reducer';
import ToggleReactXState from './components/toggle-react-xstate';
import SimpleXStateToggle from './components/simple-xsate-toggle';


const mainGreetMachine = createMachine({
  initial: 'active',
  context: {
    greeting: 'hello'
  },
  states: {
    active: {
      on: {
        'ON_CHANGE': {
          target: undefined, // this tells that we just wanyt to perform an action in that state and not to chnage state
          actions: assign({
            greeting: (context, event) => {
              return 'Tets';
            }
          })
        }
      }
    }
  }
});


const toggleMachine = createMachine({
  initial: 'inactive',
  states: {
    'inactive': {
        on: {
          TOGGLE: [
            {
              // by default target is undefined and we would remian in same state
              target: 'active', // this is the next state identifier
            }, 
          ] 
        }
    },
    'active': {
      // this is child calling the parent
      entry: sendParent('CHILD_ACTIVE'),
      on: {
        TOGGLE: 'inactive', // shorthand for the above
      }
    },
    'rejected': {}
  }
});

const toggleMachines = createMachine({
   context: {
     toggles: []
   },
   initial: 'active',
   states: {
      active: {
       on: {
         ADD_TOGGLE: {
            actions: assign({
              toggles: (context) => {
                // spwaning a new toggle machine
                 const toggle = spawn(toggleMachine);

                 return context.toggles.concat(toggle);
              } 
            })
         },
         CHILD_ACTIVE: {
           actions: (context, event) => {
             console.log('received event from child');
            }
         }
       }
      }
   }
});

export const AppContext = createContext();

function App() {
  // this service instance won't change
  const [state, send, service] = useMachine(mainGreetMachine);

  // let's cretae a new toogle machines state
  const [toggleMachineState, toggleMacineSend] = useMachine(toggleMachines);

  return (
    <AppContext.Provider value={service}>
       <div className="App">
          <main>
            <div className="toggle-example">
                <div>
                  <h2>React State Example</h2>
                  <ToggleReactState id="react-state" />
                </div>
                <div>
                  <h2>React Reducer Switch Example with Sate  Machine Model</h2>
                  <ToggleReactReducer id="react-reducer" />
                </div>
                <div>
                  <h2>React & XState</h2>
                  <ToggleReactXState id="react-xstate" />
                </div>
            </div>
            <div>
              <h2>This is our App spwaning child Toggle Machine, from the main App</h2>
              <div><button onClick={() => toggleMacineSend('ADD_TOGGLE')}>Click to create toggle</button></div>
              {
                  toggleMachineState.context.toggles.map((toggle, i) => {
                    return <div className='toggle-machine' key={i}><SimpleXStateToggle toggleRef={toggle} id={`xstate${i}`} /></div>
                  })
              }
            </div>
          </main>
        </div>
    </AppContext.Provider>
  );
}

export default App;
