import {create} from "zustand"

type MobileSidebarStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: ()=> void
}

export const useMobileSideBar = create<MobileSidebarStore>((set)=>({
    isOpen:false,
    onOpen: () => set({isOpen: true }),
    onClose:() => set({ isOpen: false}),
}))