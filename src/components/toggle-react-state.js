import React, {useState, useEffect} from 'react';
import './ToggleSwitch.scss';

const ToggleReactState = ({id, name, optionLabels = ["Yes", "No"], small, disabled}) => {
  const [status, setStatus] = useState('inactive');

  const onChnageHandler = () => {
    if (status === 'inactive') {
      setStatus('pending');
    } else {
      setStatus('inactive');
    }
  }
  useEffect(() => {
     if (status === 'pending') {
       setTimeout(() => {
        setStatus('active');
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

export default ToggleReactState;