import React, { memo } from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { store } from './store';
import './styles/general.style.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const AppWrapper = memo(() => {
  return (
    <div>
      <HashRouter>
        <Provider store={store}>
          <Routes>
            {routes.map(({ path, component: Component }) => {
              return <Route key={path} path={path} element={<Component />} />;
            })}
            <Route path={'*'} element={<Navigate replace to={'/'} />} />
          </Routes>
        </Provider>
      </HashRouter>
    </div>
  );
});
