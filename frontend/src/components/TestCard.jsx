import React from 'react'

const TestCard = ({ test }) => {
  return (
    <div className="shadow-xl my-3 p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{test.test_name}</h2>
      <div className='flex justify-between w-full'>
        <div>
      <p>Result: {test.test_value} {test.unit}</p>
      <p>Status: {test.test_status}</p>
      <p>Normal Range: {test.reference_range}</p>
        </div>
        <div>
            <p>good</p>
        </div>
      </div>
    </div>
  );
};


export default TestCard