import "bootstrap/dist/css/bootstrap.min.css";
import "styles/dayz.css"
import "styles/matchclub.css"
import "react-datepicker/dist/react-datepicker.css";

import { StoreProvider } from 'components/Store'
import App from 'next/app'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    )
  }
}

export default MyApp
