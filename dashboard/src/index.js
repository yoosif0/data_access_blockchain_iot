import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import store from './stores/configureStore';
import 'rxjs'
import './index.css'



render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
