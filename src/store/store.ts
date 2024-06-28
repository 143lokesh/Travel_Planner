import { create } from "zustand"
import { AuthSlice, ScrapingSlice, createAuthSlice,createScrapingSlice } from "./slices"


type StoreState= AuthSlice & ScrapingSlice

export const useAppStore = create<StoreState>()((...a)=>({
    ...createAuthSlice(...a),
    ...createScrapingSlice(...a),
}))