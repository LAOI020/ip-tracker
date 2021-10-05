import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { Home } from './components/Home';
import { actionResizeWindow } from './actions/appActions';
import 'mapbox-gl/dist/mapbox-gl.css';


export const App = () => {
  return (
    <Provider store={store}>
      <Init/>
    </Provider>
  )
}


const Init = () => {

  const dispatch = useDispatch();

  const handleResize = () => {
    dispatch(actionResizeWindow());
  }
  
  useEffect(() => {
    
    handleResize();
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);    
    }
  }, [handleResize]);

  return (
    <Home/>
  )
}