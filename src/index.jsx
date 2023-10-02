import ReactDOM from 'react-dom/client';
import MediaQuery from 'react-responsive';
import App from './App/index';

import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './Context';
import { Desktop } from './Desktop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <MediaQuery maxWidth={1200}>
      <BrowserRouter>
        <ContextProvider>
          <App />
        </ContextProvider>
      </BrowserRouter>
    </MediaQuery>
    <MediaQuery minWidth={1201}>
      <BrowserRouter>
        <ContextProvider>
          <Desktop />
        </ContextProvider>
      </BrowserRouter>
    </MediaQuery>
  </>
);
