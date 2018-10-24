import React from 'react'
import ReactDOM from 'react-dom'
import App from './main/App'
import { StyleProvider } from './ui/style'
import { BrowserRouter } from 'react-router-dom'
import { createContext } from './app-context/create'
import { AppContext } from './app-context/AppContext'
import 'semantic-ui-css/semantic.min.css'
import { Provider } from 'react-redux'
import { setupStatsEvents } from './stats/events'

const context = createContext()

const {store} = context

setupStatsEvents(context)

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <AppContext value={context}>
        <StyleProvider>
          <App/>
        </StyleProvider>
      </AppContext>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'))


