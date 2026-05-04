// app/help/page.tsx
export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Hero Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg hover-scale">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Help & Support
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about booking bus tickets in Sri Lanka.
          </p>
        </div>

        {/* Sections with staggered animation */}
        <div className="space-y-8 animate-fade-in-stagger">

          {/* How to Book */}
          <section className="glass-card hover-lift">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
              </div>
              <div className="ml-5 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  How to Book a Ticket
                </h2>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="pl-2">
                    Click <strong className="text-primary">Register</strong> or <strong className="text-primary">Login</strong> to access your account.
                  </li>
                  <li className="pl-2">
                    Go to the <strong className="text-primary">Book</strong> page to view available routes.
                  </li>
                  <li className="pl-2">
                    Select your desired bus route and click <strong className="text-primary">Confirm Booking</strong>.
                  </li>
                  <li className="pl-2">
                    Your e-ticket will appear instantly in <strong className="text-primary">My Bookings</strong>.
                  </li>
                  <li className="pl-2">
                    Show your ticket (on phone or printed) to the conductor before boarding.
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="glass-card hover-lift">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-5">
                  <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Can I cancel my booking?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      Yes! Go to <strong className="text-secondary">My Bookings</strong>, select your ticket, and click <strong className="text-secondary">Cancel Booking</strong>. 
                      The seat will be released, and you'll receive confirmation.
                    </p>
                  </div>
                  <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Is my personal data secure?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      Absolutely. We use Firebase Authentication and Firestore with strict security rules. 
                      We never share your data with third parties.
                    </p>
                  </div>
                  <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      What if the bus is delayed or canceled?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      In case of operator-initiated cancellations, you'll be notified via email (if provided) 
                      and can rebook or request a refund through support.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Do I need to print my ticket?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      No. Showing the ticket on your phone is sufficient. Just ensure your screen brightness is high enough for scanning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="glass-card hover-lift">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Contact Support
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Our team is ready to assist you Monday to Friday, 8:00 AM – 6:00 PM (Sri Lanka Time).
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-blue-50 dark:bg-gray-700/50 rounded-lg p-4 hover-scale">
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-2xl">📧</span>
                      Email
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                      support@srilankabus.lk
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-gray-700/50 rounded-lg p-4 hover-scale">
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-2xl">📞</span>
                      Phone
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                      +94 11 234 5678
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-gray-700/50 rounded-lg p-4 hover-scale sm:col-span-2 lg:col-span-1">
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      Office
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                      Colombo 07, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="inline-block glass rounded-full px-6 py-3">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Need urgent help? You can also visit our office during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}