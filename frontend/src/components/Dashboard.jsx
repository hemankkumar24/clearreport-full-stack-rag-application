import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase_client'
import useSession from '../hooks/useSession';
import TestCard from './TestCard';

const Dashboard = () => {
  const [latestTests, setLatestTests] = useState("")
  const { session, isLoading } = useSession();
  const userId = session?.user?.id;
  const [reportName, setReportName] = useState("")

  useEffect(() => {
    const get_data = async () => {
      if (!isLoading && session) {
        const { data: reports, error: reportsError } = await supabase.from("reports").select("*").eq('user_id', userId).order("upload_time", { ascending: false }).limit(1);

        if (reportsError) {
          console.log(reportsError);
        }

        setReportName(reports[0].report_name)

        const { data: testData, error: testDataError } = await supabase.from("test_results").select("*").eq('report_name', reports[0].report_name);

        if (testDataError) {
          console.log(testDataError);
        }
        console.log(testData);
        setLatestTests(testData);
      }
    }
    get_data()
  }, [isLoading, session])

  return (
    <>
      <div className='w-full'>
        <div className='text-2xl lg:text-4xl mt-10'>Latest Test Results</div>
        {latestTests.length === 0 ? (<div className='p-10 bg-gray-50 shadow-inner rounded flex justify-center items-center h-[500px] mt-5'>
          <div className=''>No Test Results Yet.</div>
        </div>) : (
          <div>

            <div className='text-xl py-2 bold'>{reportName}</div>
            <div className='bg-gray-50 p-6 rounded-xl shadow-inner'>
              {latestTests.map((test, index) => (
                <TestCard key={index} test={test} />
              ))}
            </div>

          </div>)}
      </div>
    </>
  )
}

export default Dashboard