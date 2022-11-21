import { useEffect, useState } from "react";
import { Header } from 'gifty-components';
 import {usersApi}  from 'gifty-api';  

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
      async function fetchUsers() {
        const data = usersApi.getUsers() 
        console.log(data)
      } 
      fetchUsers()   
  }, []);
  return (
    <div className="h-full bg-gray-100 App">
      <body className="h-full">
        <div className="min-h-full">
          <Header />
          <main className="pb-8 -mt-24">
            <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
              <h1 className="sr-only">Page title</h1>
              <div className="grid items-start grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                  <section aria-labelledby="section-1-title">
                    <h2 className="sr-only" id="section-1-title">
                      Section title
                    </h2>
                    <div className="overflow-hidden bg-white rounded-lg shadow">
                      <div className="p-6"></div>
                    </div>
                  </section>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <section aria-labelledby="section-2-title">
                    <h2 className="sr-only" id="section-2-title">
                      Section title
                    </h2>
                    <div className="overflow-hidden bg-white rounded-lg shadow">
                      <div className="p-6"></div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
          <footer>
            <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="py-8 text-sm text-center text-gray-500 border-t border-gray-200 sm:text-left">
                <span className="block sm:inline">
                  &copy; 2021 Your Company, Inc.
                </span>{" "}
                <span className="block sm:inline">All rights reserved.</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </div>
  );
}

export default App;
