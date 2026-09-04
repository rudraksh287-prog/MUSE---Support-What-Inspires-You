"use client"
import { useSession, signOut } from 'next-auth/react'
import { fetchuserByEmail, fetchCreators } from "@/actions/useractions"
import { useEffect, useState } from "react"
import Link from 'next/link'

const Navbar = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState(null)
  const [showdropdown, setshowdropdown] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      if (!session?.user?.email) return

      const u = await fetchuserByEmail(session.user.email)
      setUser(u)
    }

    getUser()
  }, [session])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true)
        const results = await fetchCreators(searchQuery)
        setSearchResults(results)
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <nav>
      <div className="bg-black text-white flex justify-between px-4 items-center md:h-16 flex-col md:flex-row gap-2 py-2 md:py-0 relative z-50">

        <Link className="logo font-bold text-lg flex justify-center items-center" href={"/"}>
          <img width={44} src="/tea.gif" alt="" />
          <span className='text-2xl'>MUSE</span>
        </Link>

        {/* Live Creator Search Bar */}
        <div className="relative w-full md:w-72 my-1 md:my-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators..."
            className="w-full bg-slate-800 text-sm text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-slate-500"
          />

          {/* Search Dropdown Results */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-xs text-gray-400 text-center">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((creator) => (
                  <Link
                    key={creator._id}
                    href={`/${creator.username}`}
                    onClick={() => setSearchQuery("")}
                    className="flex items-center gap-3 p-2 hover:bg-slate-800 transition"
                  >
                    <img
                      src={creator.profilepic || "/avatar.gif"}
                      alt={creator.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-white leading-tight">{creator.name}</span>
                      <span className="text-xs text-gray-400">@{creator.username}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-3 text-xs text-gray-400 text-center">No creators found</div>
              )}
            </div>
          )}
        </div>

        <div className='relative flex flex-col justify-center items-center gap-2 md:flex-row '>
          {session && <>
            <button onClick={() => setshowdropdown(!showdropdown)}
              id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
              Welcome {session.user.email}
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            <div id="dropdown" className={`z-10 ${showdropdown ? "" : "hidden"} absolute left-[133px] top-12 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                  <Link href="/dashboard" onClick={() => setshowdropdown(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
                </li>
                {user?.isCreator && (
                  <li>
                    <Link
                      href={`/${user.username}`}
                      onClick={() => setshowdropdown(false)}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Your Page
                    </Link>
                  </li>
                )}
                <li>
                  <button type="button" onMouseDown={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</button>
                </li>
              </ul>
            </div>
          </>}

          {!session &&
            <Link href={"/login"}>
              <button className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-2xl text-sm px-4 py-2.5 text-center leading-5 mx-1 md:mb-0 mb-2">LOgIN</button>
            </Link>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar