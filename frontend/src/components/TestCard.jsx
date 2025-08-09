import React from 'react'

const TestCard = ({ test }) => {
  return (
    <div className="shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-200 my-3 p-5 rounded grid grid-cols-1 lg:grid-cols-2 gap-6">
      <h2 className="text-xl mb-2">{test.test_name}</h2>
      <div className='flex justify-between w-full'>
        <div>
          <p><span className='text-[#2563eb]'>Result:</span> {test.test_value} {test.unit}</p>
          <p><span className='text-[#2563eb]'>Status:</span> {test.test_status}</p>
          <p><span className='text-[#2563eb]'>Normal Range:</span> {test.reference_range}</p>
        </div>
        <div>
          {test.test_status === 'normal' ?
            (<i className="text-green-600 text-2xl ri-checkbox-circle-fill"></i>) :
            (test.test_status === 'unsure' ?
              (<i className="text-yellow-600 text-2xl ri-question-fill"></i>) :
              (<i className="text-red-600 text-2xl ri-error-warning-fill"></i>)
            )
          }
        </div>
      </div>
    </div>
  );
};


export default TestCard