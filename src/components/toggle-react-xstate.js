import React, {useReducer, useEffect, useContext, useCallback} from "react";
import './ToggleSwitch.scss';
import { createMachine, assign, send } from 'xstate';
import { useMachine, useService} from '@xstate/react';
import { AppContext } from '../App';

const incrementCount = assign({
  toggleCount: (context, event) => {
    return context.toggleCount + 1;
  }
});

const gaurdCondition =  (context, event) => {
  // this is a gaurding condition
  // this will only trigger pending state if toggleCount is less than 3
  return  context.toggleCount < 3;
};

// this is a dummy funcion to mimic a http request
const saveToogle = async () => {
  return new Promise((res, rej) => {
      setTimeout(() => {
       res(22);
      }, 2000)
  })
}

const toggleMachine = createMachine({
  initial: 'inactive',
  // context is used to access extended state, satte like that could be infinite
  context: {
    toggleCount: 0 
  },
  states: {
    'inactive': {
        on: {
          TOGGLE: [
            {
              // by default target is undefined and we would remian in same state
              target: 'pending', // this is the next state identifier
              actions: 'incrementCount', // this way we can assign diffent function to the action  
              // actions: assign({
              //   toggleCount: (context, event) => {
              //     return context.toggleCount + 1;
              //   }
              // })
              cond: 'gaurdCondition'
            }, 
            {
              target: 'rejected' // this will fire if the gaurded transiton does not meet the condition
            }
          ] 
        }
    },
    'active': {
      invoke: {
        id: 'resetToggle',
        // src with callback 
        src: (context, event) => (sendBack, receiveFn) => {
          receiveFn(event => {
            console.log(event)
          });

          // after being active for 2 sec, go back to inactive state
          const timer = setTimeout(() => {
            sendBack({
              type: 'inactive'
            }, 2000)
          })

          // cleanup if we are not in that state
          return () => clearTimeout(timer)
        }
      },
      on: {
        TOGGLE: 'inactive', // shorthand for the above
        RESET: {
          // cannot specify target here, since the invocation callabck only happens on same state
          actions: send({
            type: 'RESET_DONE'
          }, {
            to: 'resetToggle'
          })
        }
      }
    },
    'pending': {
      invoke: { // this handles any side effects for thi state
        src: (context, event) => {
          // returns something that can be invoked like useCallback, promise, observable or another machine
          return saveToogle();
        },
        onDone: [
          {
            target: 'active',// replacment for that SUCCESS event we fired from useEffect
            cond: (context, event) => {
              // this data will be returned form the resolve promise, since we are doing res(22)
              // this is saying set state to 'active' if retun value is > 20
               return event.data > 20
            }
          },
          {
            target: 'rejected'
          }
        ], 
        onError: {
          target: 'rejected'
        }
      },
      on: {
        SUCCESS: {
          target: 'active'
        },
        TOGGLE: 'inactive'
      }
    },
    'rejected': {}
  }
}, {
  actions: {
    incrementCount: incrementCount
  },
  guards: {
    gaurdCondition: gaurdCondition
  }  
});

const toggleReducerMachine = (state, event) => {
   const nextState =  toggleMachine.transition(state, event);

   return nextState;
};


const ToggleReactXState = ({id, name, optionLabels = ["Yes", "No"], small, disabled}) => {
  // to use the service from the React Context
  const appGreeterService = useContext(AppContext);
  const [appGreeterState, sendAppGreeter] = useService(appGreeterService);
  console.log(appGreeterState, 'appGreeterState');

  // here State will be a object with different values
  // This is using XState in pure form
  // const [state, dispatch] = useReducer(toggleReducerMachine, toggleMachine.initialState);

  // uisng the react-xstate
  // third argumrnt service is the runnig instance of that machine, and it's an observable
  const [state, send, service] = useMachine(toggleMachine, {
    // here we can pass the actions
    actions: {
      // this will override the default function 
      // incrementCount:  assign({
      //   toggleCount: (context, event) => {
      //     return context.toggleCount + 10;
      //   }
      // })
    }
  });
  
  // status will be state.value. here State will be a object with different values
  console.log(state);
  const status = state.value;
  
  // the context added to the Machine is available in the state
  const { toggleCount } = state.context;

  const onChnageHandler = () => {
    send({
      type: 'TOGGLE'
    });
  }
  useEffect(() => {
    // one way of hanfling side effect using useEffect

    //  if (status === 'pending') {
    //    setTimeout(() => {
    //     send({
    //       type: 'SUCCESS'
    //     })
    //    }, 2000);
    //  }

  }, [status, send]);

  useEffect(() => {
    // this will run on every state change
    const sub = service.subscribe(state => {
      console.log(state.value);
    });

    return () => sub.unsubscribe();
 });

    return (
        <>
        <div className={"toggle-switch" + (small ? " small-switch" : "")}>
        <input
          type="checkbox"
          name={name}
          className="toggle-switch-checkbox"
          id={id}
          checked={status === 'active' ? true : false}
          onChange={e => onChnageHandler()}
          disabled={disabled}
          style={{
            opacity: status === 'pending' ? 0.5 : 1
          }}
          />
          {id ? (
            <label className="toggle-switch-label" htmlFor={id}>
              <span
                className={
                  disabled
                    ? "toggle-switch-inner toggle-switch-disabled"
                    : "toggle-switch-inner"
                }
                data-yes={optionLabels[0]}
                data-no={optionLabels[1]}
              />
              <span
                className={
                disabled
                  ? "toggle-switch-switch toggle-switch-disabled"
                  : "toggle-switch-switch"
                }
              />
            </label>
          ) : null}
        </div>
        <p>Current Status {status} and Current Toggle Count is {toggleCount}</p>
        <h2>Greeting from App is {appGreeterState.context.greeting} </h2>
        </>
    );
}

export default ToggleReactXState;