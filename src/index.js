import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'bulma/css/bulma.css';
import './assets/sass/main.scss';

import Layout from './components/Layout.jsx';

ReactDOM.render(<Layout />, document.getElementById('root'));

serviceWorker.unregister();
