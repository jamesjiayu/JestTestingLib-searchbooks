import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Wishlist from "./Wishlist"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import searchSlice from "../redux/slices/searchSlice"
import wishlistSlice from "../redux/slices/wishlistSlice"

const createMockStore = (
  preloadedState = {
    searchSlice: {
      keyword: "",
      isLoading: false,
      list: [],
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    },
    wishlistSlice: {
      list: [{
        id: 1,
        volumeInfo: {
          title: "",
          authors: "",
          publisher: "",
          publishedDate: "",
          description: "",
          imageLinks: { thumbnail: "" },
        },
      },
      {
        id: 2,
        volumeInfo: {
          title: "",
          authors: "",
          publisher: "",
          publishedDate: "",
          description: "",
          imageLinks: { thumbnail: "" },
        },
      },]
    },
  }
) => {
  return configureStore({
    reducer: {
      searchSlice,
      wishlistSlice,
    },
    preloadedState,
  })
}

//fetch = jest.fn() //dummy function
describe("wishlist component", () => {

  test("delete a book from wishlist", () => {
    render(
      <Provider store={createMockStore()}>
        <Wishlist />
      </Provider>
    )
    const liEls = screen.getAllByRole('listitem')
    expect(liEls).toHaveLength(2)
    fireEvent.click(liEls[0])
    const newLiEls = screen.getAllByRole('listitem')
    expect(newLiEls).toHaveLength(1)
    fireEvent.click(newLiEls[0])
    const placeHolderEl = screen.getByText('Nothing here')
    expect(placeHolderEl).toBeInTheDocument()
  })

})
