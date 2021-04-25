import React, {useReducer, useEffect} from 'react';
import './ToggleSwitch.scss';

// This reducer is bades on the State Machine module,
// where we switch between State and then decide what action
// can occur in that state to move to new state
const toggleReducerSwitch = (state, event) => {
  switch(state) {
      case 'inactive':
        if (event.type === 'TOGGLE') {
          return 'pending';
        }
        return state;
      case 'active':
        if (event.type === 'TOGGLE') {
          return 'inactive';
        }
        return state;
      case 'pending':
        if (event.type === 'SUCCESS') {
          return 'active';
        }
        return state;
      default:
        return state;      
  }
};

const toggleMachine = {
  initial: 'inactive',
  states: {
    'inactive': {
        on: {
          TOGGLE: 'pending' // this is the next state identifier
        }
    },
    'active': {
      on: {
        TOGGLE: 'inactive' // shorthand for the above
      }
    },
    'pending': {
      on: {
        SUCCESS: 'active',
        TOGGLE: 'inactive'
      }
    }
  }
}

const toggleReducerMachine = (state, event) => {
  const nextState = toggleMachine.states[state].on[event.type] || state;

  return nextState;
}

const ToggleReactReducer = ({id, name, optionLabels = ["Yes", "No"], small, disabled}) => {
  // normal reducer 
  // const [status, dispatch] = useReducer(toggleReducerSwitch, 'inactive');


  // with state machine object model
  const [status, dispatch] = useReducer(toggleReducerMachine, 'inactive');
  console.log(status);
  const onChnageHandler = () => {
    dispatch({
      type: 'TOGGLE'
    })
  }
  useEffect(() => {
     if (status === 'pending') {
       setTimeout(() => {
        dispatch({
          type: 'SUCCESS'
        })
       }, 2000);
     }
  }, [status]);

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
        <p>Current Status {status}</p>
        </>

    );
}

export default ToggleReactReducer;