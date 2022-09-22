import React, { useEffect, useState } from "react";
import { EventEmitter } from "events";

const initialState = {
  ee: new EventEmitter()
};

const useInitialState = () => {
  const [state, setstate] = useState(initialState);

  const setValue = (payload: object) => {
    setstate({
      ...state,
      ...payload
    });
  };

  const addEvent = (name: string, payload: any) => {
    state.ee.on(name, payload);
  };

  const emitEvent = (name: string, data: any) => {
    state.ee.emit(name, data);
  };

  return {
    state,
    setValue,
    addEvent,
    emitEvent
  };
};

export default useInitialState();
