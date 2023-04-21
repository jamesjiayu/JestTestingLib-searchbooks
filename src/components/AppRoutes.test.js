import { render, screen, fireEvent } from '@testing-library/react'
//import userEvent from '@testing-library/user-event'
import React from 'react'
import '@testing-library/jest-dom'
import App from '../App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { LocationDisplay } from './Layout'//add it to Layout.js

describe('test router', () => {
  test('full app rendering/navigating', () => {
    render(<App />)//, { wrapper: BrowserRouter }//ours already wrappered
    // const user = userEvent.setup() ??setup s not fn?
    const wishlistEl = screen.getByText(/wishlist/i)
    // verify page content for default route
    expect(screen.getByText(/search/i)).toBeInTheDocument()
    expect(wishlistEl).toBeInTheDocument()
    // verify page content for expected route after navigating
    fireEvent.click(wishlistEl)// user.click() 
    const wishlistDivEl = screen.getByTestId("wishlist-div")
    expect(wishlistDivEl).toBeInTheDocument()
  })
  test('rendering a component that uses useLocation', () => {
    const route = '/some-route'
    // use <MemoryRouter> when you want to manually control the history
    render(
      <MemoryRouter initialEntries={[route]}>
        <LocationDisplay />
      </MemoryRouter>,
    )
    // verify location display is rendered
    const locationDisplayDivEl = screen.getByTestId('location-display')
    expect(locationDisplayDivEl).toHaveTextContent(route)
  })

})
//, { wrapper: BrowserRouter }