import React, {useEffect} from "react";
import './ToggleSwitch.scss';

import { useService} from '@xstate/react';

// toggleRef is the refernce to the toggle Machine
const SimpleXStateToggle = ({id, name, optionLabels = ["Yes", "No"], small, disabled, toggleRef}) => {
  // uisng the react-xstate
  // third argumrnt service is the runnig instance of that machine, and it's an observable
  const [state, send] = useService(toggleRef);
  
  // status will be state.value. here State will be a object with different values
  console.log(state);
  const status = state.value;
  

  const onChnageHandler = () => {
    send({
      type: 'TOGGLE'
    });
  }

  useEffect(() => {
    // this will run on every state change
    // const sub = service.subscribe(state => {
    //   console.log(state.value);
    // });

    // return () => sub.unsubscribe();
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
        </>
    );
}

export default SimpleXStateToggle;