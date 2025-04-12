import React from 'react'


function CustomerReview() {
  return (
    <div>
        <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white" id="reviews">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hear From Our Community</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - see what learners are saying about their experience
            </p>
          </div>

          {/* Reviews grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToaSbEI-kkboqqZdJEF4fxUopiSpvij3rCVOeuR4mJOn8u5jVs7emD-MtRwHhR4aXt78o&usqp=CAU"
                  alt="Amazing Experience"
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-100"
                />
                <div>
                  <h5 className="text-xl font-semibold text-gray-800">Amazing Experience</h5>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 pl-20 relative">
                <svg className="absolute left-0 top-0 w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path>
                </svg>
                "Helped me understand complex topics with ease. The interactive lessons made learning enjoyable and effective."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src="https://pm1.aminoapps.com/6921/ea94e2249ac6586dfa270d6ff0427fee97d99056r1-750-726v2_uhq.jpg"
                  alt="Great Quizzes!"
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-100"
                />
                <div>
                  <h5 className="text-xl font-semibold text-gray-800">Great Quizzes!</h5>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 pl-20 relative">
                <svg className="absolute left-0 top-0 w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path>
                </svg>
                "Challenged my knowledge and improved my skills. The quiz system adapts to your level, making it perfect for all learners."
              </p>
            </div>
          </div>

          {/* CTA at bottom */}
          {/* <div className="text-center mt-16">
      <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
        Join Our Learning Community
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </button>
    </div> */}
        </div>
      </section>
    </div>
  )
}

export default CustomerReview
