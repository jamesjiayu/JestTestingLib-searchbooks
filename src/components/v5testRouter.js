import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Router } from 'react-router-dom'
//import ButtonLogin from './ButtonLogin';
import { createMemoryHistory } from 'history'
//React Router v5 only works with History v4, so make sure you have the correct version of history installed.
import { Link } from 'react-router-dom'

function ButtonLogin () {
  return (
    <Link to="/login">
      <button className="button-login">Iniciar sesión</button>
    </Link>
  )
}

describe('ButtonLogin', () => {
  test('should pass', () => {
    const history = createMemoryHistory({ initialEntries: ['/home'] })
    const { getByText } = render(
      <Router history={history}>
        <ButtonLogin />
      </Router>
    )
    expect(history.location.pathname).toBe('/home')
    fireEvent.click(getByText('Iniciar sesión'))
    expect(history.location.pathname).toBe('/login')
  })
})