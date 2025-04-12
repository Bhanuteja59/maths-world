import React from 'react'

function Footer() {
  return (
    <div>
       <footer className="bg-amber-50 text-amber-900 py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Services Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-800 mb-6 font-serif">
                Services
              </h3>
              <ul className="space-y-3">
                {['Branding', 'Design', 'Marketing', 'Advertisement'].map((item) => (
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
            </div>

            {/* Company Column */}
            <div className="space-y-4">
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
            </div>

            {/* Social Media Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-amber-800 mb-6 font-serif">
                Connect With Me
              </h3>

              <div className="flex space-x-6">
                {/* GitHub */}
                <a
                  href="https://github.com/Bhanuteja59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-600 transition-colors duration-300"
                  aria-label="GitHub"
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
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.865-.014-1.698-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.109-1.463-1.109-1.463-.906-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.891 1.528 2.34 1.087 2.91.831.091-.647.349-1.087.635-1.338-2.222-.253-4.555-1.111-4.555-4.943 0-1.091.39-1.985 1.029-2.683-.103-.253-.446-1.274.098-2.656 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.843a9.51 9.51 0 0 1 2.5.338c1.91-1.294 2.75-1.025 2.75-1.025.544 1.382.201 2.403.098 2.656.64.698 1.029 1.592 1.029 2.683 0 3.842-2.336 4.687-4.564 4.935.359.31.678.923.678 1.86 0 1.344-.012 2.428-.012 2.757 0 .268.18.577.688.48C19.135 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="www.linkedin.com/in/reddy-bhanuteja-160bb4184"
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

                {/* Portfolio */}
                <a
                  href="https://bhanuteja59.github.io/portfolio/"
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
