import { ArrowRight, Calendar, SportShoe, UserGroup } from "lucide-react"
import { Button } from "../common/Button"

export const Samar: React.FC = () => {

    return (
        <section className="relative  overflow-hidden md:h-[50vh] h-[90vh]   bg-[url('https://images.unsplash.com/photo-1784460309828-57ae1e75d53f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D')] bg-cover bg-no-repeat bg-position-[center_30%] lg:h-[50vh] shadow-2xl">
            <div className="absolute top-0 min-w-full h-screen bg-linear-to-b from-black/30 to-black  z-0" />
            <div className="flex flex-col lg:flex-row p-12 relative items-center justify-between lg:h-[50vh]">
                <div className=" flex flex-col justify-center items-start ">
                    <p className="text-amber-400 text-xl font-semibold tracking-widest uppercase w-full ">NIT Raipur Anual sport festival</p>
                    <div>
                        <h1 className="text-8xl font-bold tracking-widest font-permanent uppercase text-white ">
                            SAMAR
                        </h1>
                        <div>
                            <h3 className="uppercase text-[1.8em] font-medium tracking-wider bg-gradient-to-r from-amber-400 via-yellow-200 to-white bg-clip-text text-transparent">The Campus comes alive.</h3>
                            <p className="text-slate-100 text-lg">
                                A 4-day celebration of competition, <br />sportsmanship and campus spirit.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <Button size="lg" className="group" >Explore SAMAR <ArrowRight className="w-4 h-4 ml-1.5 group-hover:text-[#6e5c00] duration-200" /></Button>

                    </div>
                </div>
                <div className="flex items-end gap-20 lg:h-[35vh]">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <Calendar size={40} className="text-amber-400 font-bold" />
                        <p className="flex flex-col text-center text-xl font-bold">4  <span className="font-light text-lg tracking-wide">Days</span></p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 ">
                        <SportShoe size={40} className="text-amber-400 font-bold" />
                        <p className="flex flex-col text-center text-xl font-bold">14+  <span className="font-light text-lg tracking-wide">Sports</span></p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <UserGroup size={40} className="text-amber-400 font-bold" />
                        <p className="flex flex-col text-center text-xl font-bold">1000+  <span className="font-light text-lg tracking-wide">participation</span></p>
                    </div>


                </div>
            </div>

        </section>
    )
}