import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="bg-amber-50 text-amber-900 py-16 px-6 ">
        <div className="container">
          <div className="grid gap-12 ">
            {/* Services Column */}
            {/* <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-800 mb-6 font-serif">
                Services
              </h3>
              <ul className="space-y-3">
                {['Branding', 'Design', 'Marketing', 'Advertisement'].map((item) => (
                  <li key={item}>
                    <a
                      type="button"
                      className="hover:text-amber-700 transition-colors duration-300 flex items-center group bg-transparent border-none p-0 cursor-pointer"
                    >
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Company Column */}
            {/* <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-800 mb-6 font-serif">
                Company
              </h3>
              <ul className="space-y-3">
                {['About us', 'Contact', 'Jobs', 'Press kit'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#"
                      className="hover:text-amber-700 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Social Media Column */}
            <div className=" col align-items-center grid items-center justify-center">
              <h3 className="">
                Connect With Developer
              </h3>

              <div className="flex space-x-6 p-4">

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/bhanuteja59/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-600 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <div className="relative group">
                    <div className="relative bg-amber-100 p-3 rounded-lg flex items-center justify-center w-12 h-12 border border-amber-200 hover:border-amber-300 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.41c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.41h-3v-5.5c0-1.38-.03-3.15-1.91-3.15s-2.21 1.49-2.21 3.04v5.61h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.58v5.62z" />
                      </svg>
                    </div>
                  </div>
                </a>

                {/* Gmail */}
                <a
                  href="mailto:bhanutejareddy59@gmail.com"
                  className="text-amber-800 hover:text-amber-600 transition-colors duration-300"
                  aria-label="Gmail"
                >
                  <div className="relative group">
                    <div className="relative bg-amber-100 p-3 rounded-lg flex items-center justify-center w-12 h-12 border border-amber-200 hover:border-amber-300 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M12 13.065L2 6.5v11c0 .827.673 1.5 1.5 1.5h17c.827 0 1.5-.673 1.5-1.5v-11l-10 6.565zM12 11L2 4h20l-10 7z" />
                      </svg>
                    </div>
                  </div>
                </a>


                {/* Portfolio */}
                <a
                  href="https://portfolio-psi-lovat-40.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-600 transition-colors duration-300"
                  aria-label="Portfolio"
                >
                  <div className="relative group">
                    <div className="relative bg-amber-100 p-3 rounded-lg flex items-center justify-center w-12 h-12 border border-amber-200 hover:border-amber-300 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 17.5H6c-.276 0-.5-.224-.5-.5V7c0-.276.224-.5.5-.5h12c.276 0 .5.224.5.5v10c0 .276-.224.5-.5.5zm-1.5-9.5h-9v8h9v-8zM9 11h6v2H9v-2z" />
                      </svg>
                    </div>
                  </div>
                </a>

              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Footer
