import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Search from "./Search"
import Wishlist from "./Wishlist"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import searchSlice from "../redux/slices/searchSlice"
import wishlistSlice from "../redux/slices/wishlistSlice"

//user story
//accessibility

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
        wishlistSlice: { list: [] },
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

fetch = jest.fn() //dummy function
describe("search component", () => {
    beforeEach(() => {
        fetch.mockImplementation(() => {
            return new Promise((res, rej) =>
                res({
                    json: () =>
                        new Promise((res, rej) => {
                            res({
                                items: Array.from({ length: 2 }, (value, index) => {
                                    return {
                                        id: index + 1,
                                        volumeInfo: {
                                            title: "",
                                            authors: "",
                                            publisher: "",
                                            publishedDate: "",
                                            description: "",
                                            imageLinks: { thumbnail: "" },
                                        },
                                    }
                                }),
                                totalItems: 2,
                                kind: "",
                            })
                        }),
                })
            )
        })
    })
    test("search input should respond to user key press", () => {
        render(
            <Provider store={createMockStore()}>
                <Search />
            </Provider>
        )
        const inputEl = screen.getByRole("textbox")
        expect(inputEl).toBeInTheDocument()
        fireEvent.change(inputEl, { target: { value: "ab" } })
        expect(inputEl).toHaveValue("ab")
    })

    test("search result should show up after type some keyword, and clicking the submit button ", async () => {
        render(
            <Provider store={createMockStore()}>
                <Search />
            </Provider>
        )
        let liEls
        const placeHolderEl = screen.getByText("Nothing here")
        expect(placeHolderEl).toBeInTheDocument()
        const inputEl = screen.getByRole("textbox")
        fireEvent.change(inputEl, { target: { value: "ab" } })
        expect(inputEl).toHaveValue("ab")
        await waitFor(() => { }, {
            timeout: 200,
        })
        liEls = screen.queryAllByRole("listitem")
        expect(liEls).toHaveLength(0)
        /* liEls = await screen.findAllByRole("listitem");
        expect(liEls).toHaveLength(2); */

        const submitBtnEl = screen.getByText("Submit")
        fireEvent.click(submitBtnEl)
        liEls = await screen.findAllByRole("listitem") //what makes code async, promise, async await, settimeout
        expect(liEls).toHaveLength(2)
    })

    test("loader should show up when the data is loading after clicking submit button", async () => {
        render(
            <Provider store={createMockStore()}>
                <Search />
            </Provider>
        )
        let loaderEl = screen.queryByTestId("loader")
        expect(loaderEl).not.toBeInTheDocument()
        const inputEl = screen.getByRole("textbox")
        fireEvent.change(inputEl, { target: { value: "ab" } })
        const submitBtnEl = screen.getByText("Submit")
        fireEvent.click(submitBtnEl)
        loaderEl = screen.queryByTestId("loader")
        expect(loaderEl).toBeInTheDocument()
        //wait the request to be fulfilled, get the loader element again
        await waitFor(() => {
            const loader = screen.queryByTestId("loader")
            expect(loader).not.toBeInTheDocument()
        })
    })
    test('pagination: click prev or next button, current page shoulde change according to it', async () => {
        render(
            <Provider store={createMockStore()}>
                <Search />
            </Provider>
        )
        fetch.mockImplementation(() => {
            return new Promise((res, rej) =>
                res({
                    json: () =>
                        new Promise((res, rej) => {
                            res({
                                items: Array.from({ length: 22 }, (value, index) => {
                                    return {
                                        id: index + 1,
                                        volumeInfo: {
                                            title: "",
                                            authors: "",
                                            publisher: "",
                                            publishedDate: "",
                                            description: "",
                                            imageLinks: { thumbnail: "" },
                                        },
                                    }
                                }),
                                totalItems: 22,
                                kind: "",
                            })
                        }),
                })
            )
        })
        expect(screen.getByText('1/1')).toBeInTheDocument
        const buttonEls = screen.getAllByRole("button")
        const [submitBtnEl, prevButtonEl, nextButtonEl] = buttonEls
        expect(prevButtonEl).toBeInTheDocument
        expect(nextButtonEl).toBeInTheDocument
        const inputEl = screen.getByRole("textbox")
        fireEvent.change(inputEl, { target: { value: 'test' } })
        // fireEvent.click(submitBtnEl)// submit or not 
        expect(await screen.findByText('1/3')).toBeInTheDocument// /1\/\d+/
        fireEvent.click(nextButtonEl) //another ajax createthunk....
        expect(await screen.findByText('2/3')).toBeInTheDocument
        fireEvent.click(prevButtonEl)
        expect(await screen.findByText('1/3')).toBeInTheDocument

        // await waitFor(() => {
        //     expect(screen.getByText(/1\/\d+/)).toBeInTheDocument// \d           
        //     fireEvent.click(nextButtonEl)
        //     // expect(screen.getByText(/2\/\d+/)).toBeInTheDocument
        // })


    })
    // test('should add a book from search results to wishlist', async () => {
    //     render(
    //         <Provider store={createMockStore()}>
    //             <Search />
    //             <Wishlist />
    //         </Provider>
    //     )
    //     const inputEl = screen.getByRole('textbox')
    //     fireEvent.change(inputEl, { target: { value: 'test' } })
    //     const liEls = await screen.findAllByRole('listitem')
    //     fireEvent.click(liEls[0])//how to check the wishlist

    // })
})

